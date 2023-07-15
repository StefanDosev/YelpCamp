const express = require('express');
const router = express.Router({mergeParams:true});
const Review = require('../models/review');
const Campground = require('../models/campground');
const wrapAsync = require('../utils/wrapAsync');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');




router.post('/', isLoggedIn, validateReview, wrapAsync(async(req,res)=>{
    const{id} = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    req.flash('success','Successfully added new review.')
    res.redirect(`/campgrounds/${camp.id}`)
}))
router.delete('/:revId', isLoggedIn, isReviewAuthor, wrapAsync(async (req,res)=>{
   const {id, revId} = req.params;
   await Review.findByIdAndDelete(revId);
   await Campground.findByIdAndUpdate(id,{$pull:{reviews:revId}} );
   req.flash('success','Successfully deleted review.')
   res.redirect(`/campgrounds/${id}`)

}))

module.exports = router;