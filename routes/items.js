const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { itemSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const Item = require('../models/item');

const validateItem = (req, res, next) => {
    const { error } = itemSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/index', catchAsync(async(req, res) => {
    const items = await Item.find({});
    res.render('items/index', { items })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('items/new');
})

router.post('/index', isLoggedIn, validateItem, catchAsync(async(req, res) => {
    const item = new Item(req.body.item);
    await item.save();
    req.flash('success', 'Successfully made a new item!');
    res.redirect('/index')
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res) => {
    const item = await Item.findById(req.params.id)
    if (!item) {
        req.flash('error', 'Cannot find that item!');
        return res.redirect('/index');
    }
    res.render('items/edit', { item } );
}))

router.put('/index/:id', isLoggedIn, validateItem, catchAsync(async(req, res) => {
    const { id } = req.params;
    const item = await Item.findByIdAndUpdate(id, { ...req.body.item });
    req.flash('success', 'Successfully updated item!');
    res.redirect('/index')
}));

router.delete('/index/:id', isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted item')
    res.redirect('/index');
}))

module.exports = router;