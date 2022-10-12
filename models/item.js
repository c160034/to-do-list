const mongoose = require('mongoose');
const Comment = require('./comment')
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    title: String,
    description: String,
    deadline: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    complete: Boolean,
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

ItemSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Item', ItemSchema);