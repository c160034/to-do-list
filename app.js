const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { itemSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Item = require('./models/item');

mongoose.connect('mongodb://localhost:27017/to-do-list', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateItem = (req, res, next) => {
    const { error } = itemSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/index', catchAsync(async(req, res) => {
    const items = await Item.find({});
    res.render('items/index', { items })
}));

app.get('/new', (req, res) => {
    res.render('items/new');
})

app.post('/index', validateItem, catchAsync(async(req, res) => {
    const item = new Item(req.body.item);
    await item.save();
    res.redirect('/index')
}))

app.get('/:id/edit', catchAsync(async(req, res) => {
    const item = await Item.findById(req.params.id)
    res.render('items/edit', { item } );
}))

app.put('/index/:id', validateItem, catchAsync(async(req, res) => {
    const { id } = req.params;
    const item = await Item.findByIdAndUpdate(id, { ...req.body.item });
    res.redirect('/index')
}));

app.delete('/index/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    res.redirect('/index');
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})