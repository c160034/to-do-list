const express = require('express');
const router = express.Router();
const { isLoggedIn, validateComment, isCommentAuthor } = require('../middleware');
const comments = require('../controllers/comments');
const catchAsync = require('../utils/catchAsync');

router.post('/:id', isLoggedIn, validateComment, catchAsync(comments.createComment))

router.delete('/:id/:commentId', isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment))

module.exports = router;