const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const {campgroundSchema} = require('../schemas');



const validateCamground = (req,res,next) =>{
    
    const {error}= campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

router.get('/',async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
})
router.get('/new', (req,res)=>{
    res.render('campgrounds/new');
})
router.post('/',validateCamground, wrapAsync(async (req,res,next)=>{
        
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success','Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
   
    
}))

router.get('/:id', wrapAsync(async(req,res)=>{
    const{id} = req.params;
    const camp = await Campground.findById(id).populate('reviews');
    if(!camp){
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds')
    } 
    res.render('campgrounds/show',{camp})
}))

router.get('/:id/edit', wrapAsync(async(req,res)=>{
    const{id} = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit',{camp})
}))

router.put('/:id',validateCamground, wrapAsync(async(req,res)=>{
    const{id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash('success', 'Successfully updated campground')
    res.redirect(`${camp._id}`)
}))

router.delete('/:id', wrapAsync(async(req,res)=>{
    const{id} = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully added new campground.')
    res.redirect('/campgrounds')
}))

module.exports = router;