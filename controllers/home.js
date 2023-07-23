const Campground = require('../models/campground');
const Review = require('../models/review');



module.exports.getHome = async (req, res) => {
    
      // Get all campgrounds
      const allCampgrounds = await Campground.find({});
  
      // Calculate the average rating and number of ratings for each campground
      for (const camp of allCampgrounds) {
        const ratings = await Review.find({ _id: { $in: camp.reviews } }).select('rating');
        const totalRatings = ratings.length;
        const averageRating = totalRatings > 0 ? ratings.reduce((acc, cur) => acc + cur.rating, 0) / totalRatings : 0;
        camp.averageRating = averageRating;
      }
  
      // Sort the campgrounds based on average rating in descending order
      const sortedCampgrounds = allCampgrounds.sort((a, b) => b.averageRating - a.averageRating);
  
      // Get the top 3 campgrounds with the highest average ratings
      const top3Campgrounds = sortedCampgrounds.slice(0, 3);
  
      res.render('home', { top3Campgrounds });
    
  };