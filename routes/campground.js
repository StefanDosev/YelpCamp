const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, validateCamground, isAuthor } = require('../middleware');






router.get('/',async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
})
router.get('/new', isLoggedIn, (req,res)=>{
    res.render('campgrounds/new');
})
router.post('/',validateCamground, isLoggedIn, wrapAsync(async (req,res,next)=>{
        
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success','Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
   
    
}))

router.get('/:id', wrapAsync(async(req,res)=>{
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
}))

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(async(req,res)=>{
    const{id} = req.params;
    const camp = await Campground.findById(id);
    if(!camp){
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds')
    } 
    res.render('campgrounds/edit',{camp})
}))

router.put('/:id',validateCamground, isLoggedIn, isAuthor, wrapAsync(async(req,res)=>{
    const{id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash('success', 'Successfully updated campground')
    res.redirect(`${camp._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(async(req,res)=>{
    const{id} = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully added new campground.')
    res.redirect('/campgrounds')
}))

module.exports = router;