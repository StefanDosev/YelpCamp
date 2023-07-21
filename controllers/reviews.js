const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
  
    // Check if the current user has already reviewed the campground
    const existingReview = await Review.findOne({
        author: req.user._id,
        _id: { $in: camp.reviews },
      });

      
    if (existingReview) {
      // Optionally, you can update the existing review here.
      // For example, you can redirect the user to an edit page for the review.
      // res.redirect(`/campgrounds/${camp._id}/reviews/${existingReview._id}/edit`);
  
      // Or you can display an error message and prevent the user from submitting a new review.
      req.flash('error', 'You have already reviewed this campground.');
      return res.redirect(`/campgrounds/${camp._id}`);
    }
  
    // Create a new review and save it
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await camp.save();
    await review.save();
  
    req.flash('success', 'Successfully added a new review.');
    res.redirect(`/campgrounds/${camp._id}`);
  };



module.exports.deleteReview = async (req,res)=>{
    const {id, revId} = req.params;
    await Review.findByIdAndDelete(revId);
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:revId}} );
    req.flash('success','Successfully deleted review.')
    res.redirect(`/campgrounds/${id}`)
 
 }