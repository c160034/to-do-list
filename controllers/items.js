const Item = require('../models/item');

module.exports.index = async(req, res) => {
    const items = await Item.find({});
    res.render('items/index', { items })
}

module.exports.renderNewForm = (req, res) => {
    res.render('items/new');
}

module.exports.createItem = async(req, res) => {
    const item = new Item(req.body.item);
    item.author = req.user._id;
    await item.save();
    req.flash('success', 'Successfully made a new item!');
    res.redirect('/index')
}

module.exports.showComments = async (req, res,) => {
    const item = await Item.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!item) {
        req.flash('error', 'Cannot find that item!');
        return res.redirect('/index');
    }
    res.render('items/show', { item });
}

module.exports.renderEditForm = async(req, res) => {
    const item = await Item.findById(req.params.id)
    if (!item) {
        req.flash('error', 'Cannot find that item!');
        return res.redirect('/index');
    }
    res.render('items/edit', { item } );
}

module.exports.updateItem = async(req, res) => {
    const { id } = req.params;
    const item = await Item.findByIdAndUpdate(id, { ...req.body.item });
    await item.save();
    req.flash('success', 'Successfully updated item!');
    res.redirect('/index')
}

module.exports.toggleComplete = async(req, res) => {
    const item = await Item.findById(req.params.id)
    item.complete = !item.complete;
    await item.save();
    if (item.complete) req.flash('success', 'Completed item!');
    else req.flash('success', 'Mark item as incomplete!')
    res.redirect('/index');
}

module.exports.deleteItem = async(req, res) => {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted item')
    res.redirect('/index');
}