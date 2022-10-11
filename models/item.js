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
});

module.exports = mongoose.model('Item', ItemSchema);