const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateComment } = require('../middleware');

const Item = require('../models/item');
const Comment = require('../models/comment');

router.post('/:id/comments', isLoggedIn, validateComment, catchAsync(async (req, res) => {
    const item = await Item.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    item.comments.push(comment);
    await comment.save();
    await item.save();
    req.flash('success', 'Posted new comment!');
    res.redirect(`/${item._id}/comments`);
}))

router.delete('/:id/comments/:commentId', catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Item.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Successfully deleted comment')
    res.redirect(`/${id}/comments`);
}))

module.exports = router;