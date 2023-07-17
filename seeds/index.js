const mongoose = require('mongoose');
const cities = require('./cities');
const{descriptors, places} = require('./seedHelpers')
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
   
});
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database connected");
});

const sample = arr => arr[Math.floor(Math.random()*arr.length)]

const seedsDB = async() =>{
    await Campground.deleteMany({});
    for (let i = 0; i<20; i++){
        const random1000 = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*20)+10;
        const camp =new Campground({
            author:'64aabd1672a354bbe8435e57',
            location:`${cities[random1000].city}, ${cities[random1000].state} `,
            title:`${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
                },
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                }
            ],
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate laborum accusamus magni deleniti laboriosam quidem consectetur. Magnam sint accusantium harum dolor doloremque mollitia quidem repellat temporibus a nemo enim repellendus architecto nam beatae nesciunt deleniti, recusandae odio perferendis sunt ratione iure veritatis eum! Consectetur quibusdam sint asperiores pariatur, necessitatibus',
            price
        })
        camp.save();
    }
}

seedsDB();