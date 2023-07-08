const express = require('express');
const router = express.Router({mergeParams:true});
const Review = require('../models/review');
const Campground = require('../models/campground');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../schemas');


const validateReview = (req,res,next) =>{
    
    const {error}= reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}


router.post('/', validateReview, wrapAsync(async(req,res)=>{
    const{id} = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    req.flash('success','Successfully added new review.')
    res.redirect(`/campgrounds/${camp.id}`)
}))
router.delete('/:revId', wrapAsync(async (req,res)=>{
   const {id, revId} = req.params;
   await Review.findByIdAndDelete(revId);
   await Campground.findByIdAndUpdate(id,{$pull:{reviews:revId}} );
   req.flash('success','Successfully deleted review.')
   res.redirect(`/campgrounds/${id}`)

}))

module.exports = router;