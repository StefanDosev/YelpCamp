const Campground = require('../models/campground');


module.exports.index = async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.createCamp = async (req,res,next)=>{
        
    const campground = new Campground(req.body.campground);
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
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...imgs);
    await camp.save();
    req.flash('success', 'Successfully updated campground')
    res.redirect(`${camp._id}`)
}

module.exports.deleteCamp = async(req,res)=>{
    const{id} = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully added new campground.')
    res.redirect('/campgrounds')
}