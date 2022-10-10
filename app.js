const express = require('express');
const mongoose = require('mongoose');
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

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/index', async(req, res) => {
    const items = await Item.find({});
    res.render('index', { items })
});

app.get('/new', (req, res) => {
    res.render('new');
})

app.post('/index', async(req, res) => {
    const item = new Item(req.body.item);
    await item.save();
    res.redirect('/index')
})

app.get('/:id/edit', async(req, res) => {
    const item = await Item.findById(req.params.id)
    res.render('edit', { item } );
})

app.put('/index/:id', async(req, res) => {
    const { id } = req.params;
    const item = await Item.findByIdAndUpdate(id, { ...req.body.item });
    res.redirect('/index')
});

app.delete('/index/:id', async(req, res) => {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    res.redirect('/index');
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})