const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    title: String,
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

module.exports = mongoose.model('Item', ItemSchema);