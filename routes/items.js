const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateItem } = require('../middleware');

const Item = require('../models/item');

router.get('/index', catchAsync(async(req, res) => {
    const items = await Item.find({});
    res.render('items/index', { items })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('items/new');
})

router.post('/index', isLoggedIn, validateItem, catchAsync(async(req, res) => {
    const item = new Item(req.body.item);
    item.author = req.user._id;
    await item.save();
    req.flash('success', 'Successfully made a new item!');
    res.redirect('/index')
}))

router.get('/:id/comments', catchAsync(async (req, res,) => {
    const item = await Item.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');
    res.render('items/show', { item });
}));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const item = await Item.findById(req.params.id)
    if (!item) {
        req.flash('error', 'Cannot find that item!');
        return res.redirect('/index');
    }
    res.render('items/edit', { item } );
}))

router.put('/index/:id', isLoggedIn, isAuthor, validateItem, catchAsync(async(req, res) => {
    const { id } = req.params;
    const item = await Item.findByIdAndUpdate(id, { ...req.body.item });
    req.flash('success', 'Successfully updated item!');
    res.redirect('/index')
}));

router.put('/:id', isLoggedIn, catchAsync(async(req, res) => {
    const item = await Item.findById(req.params.id)
    item.complete = !item.complete;
    await item.save();
    if (item.complete) req.flash('success', 'Completed item!');
    else req.flash('success', 'Mark item as incomplete!')
    res.redirect('/index');
}))

router.delete('/index/:id', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted item')
    res.redirect('/index');
}))

module.exports = router;