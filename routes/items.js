const express = require('express');
const router = express.Router();
const { isLoggedIn, isAuthor, validateItem } = require('../middleware');
const items = require('../controllers/items');
const catchAsync = require('../utils/catchAsync');

router.route('/index')
    .get(catchAsync(items.index))
    .post(isLoggedIn, validateItem, catchAsync(items.createItem))

router.put('/index/:id', isLoggedIn, catchAsync(items.toggleComplete))

router.get('/new', isLoggedIn, items.renderNewForm)

router.route('/:id')
    .get(catchAsync(items.showComments))
    .put(isLoggedIn, isAuthor, validateItem, catchAsync(items.updateItem))
    .delete(isLoggedIn, isAuthor, catchAsync(items.deleteItem))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(items.renderEditForm))

module.exports = router;