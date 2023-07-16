const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async(req,res)=>{
    const{id} = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    req.flash('success','Successfully added new review.')
    res.redirect(`/campgrounds/${camp.id}`)
}

module.exports.deleteReview = async (req,res)=>{
    const {id, revId} = req.params;
    await Review.findByIdAndDelete(revId);
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:revId}} );
    req.flash('success','Successfully deleted review.')
    res.redirect(`/campgrounds/${id}`)
 
 }