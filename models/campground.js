const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url:String,
    filename:String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_350')
})

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title:String,
    images:[ImageSchema],
    price:Number,
    description:String,
    location:String,
    geometry: {
        type: {
          type: String,
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    author:{ type: Schema.Types.ObjectId, ref: 'User' },
    reviews:[{ type: Schema.Types.ObjectId, ref: 'Review' }]

},opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    if (this.images && this.images.length > 0) {
        return `
        
        <a class="card-link" href="/campgrounds/${this._id}">
        <div class="row g-0 p-0">
          <div class="col-md-5">
            <img src="${this.images[0].url}" class="fill" alt="...">
          </div>
          <div class="col-md-7">
            <div class="card-body">
              <h5 class="card-title"><strong>${this.title}</strong></h5>
              <p class="card-text">${this.location}</p>
              <p class="card-text"><small class="text-body-secondary">from <strong>$${this.price}</strong>/night</small></p>
            </div>
          </div>
        </div>
        </a>
      
            
        `;
    } else {
        return `
            <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
        `;
    }
});




CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);
