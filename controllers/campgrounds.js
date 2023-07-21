const Campground = require('../models/campground');
const Review = require('../models/review');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const{cloudinary} = require('../cloudinary')

module.exports.index = async(req, res) => {
    try {
      const campgrounds = await Campground.find({});
  
      // Calculate the average rating and number of ratings for each campground
      for (const camp of campgrounds) {
        const ratings = await Review.find({ _id: { $in: camp.reviews } }).select('rating');
        const totalRatings = ratings.length;
        const averageRating = totalRatings > 0 ? ratings.reduce((acc, cur) => acc + cur.rating, 0) / totalRatings : 0;
        camp.averageRating = averageRating;
        camp.totalRatings = totalRatings;
      }
  
      res.render('campgrounds/index', { campgrounds });
    } catch (err) {
      console.error('Error fetching campgrounds:', err);
      res.render('error');
    }
  };

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.createCamp = async (req,res,next)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success','Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
   
    
}

module.exports.findCamp = async(req,res)=>{
    const{id} = req.params;
    const camp = await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    if(!camp){
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds')
    } 
    res.render('campgrounds/show',{camp})
}

module.exports.editCamp = async(req,res)=>{
    const{id} = req.params;
    const camp = await Campground.findById(id);
    if(!camp){
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds')
    } 
    res.render('campgrounds/edit',{camp})
}

module.exports.submitEdit = async(req,res)=>{
    const{id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    if (req.files.length > 0) {
        const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
        camp.images.push(...imgs);
      }
    await camp.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
        console.log(camp)
    }
    req.flash('success', 'Successfully updated campground')
    res.redirect(`${camp._id}`)
}

module.exports.deleteCamp = async(req,res)=>{
    const{id} = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    for (let image of camp.images) {
        await cloudinary.uploader.destroy(image.filename);
      } 
    req.flash('success','Successfully added new campground.')
    res.redirect('/campgrounds')
}