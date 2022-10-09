const express = require('express');
const app = express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('home')
});

items = ["update", "clean", "return"]

app.get('/index', (req, res) => {
    res.render('index', { items })
});

app.get('/new', (req, res) => {
    res.render('new');
})

app.post('/index', (req, res) => {
    console.log(req.body)
    items.push(req.body.title)
    res.redirect('/index')
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})