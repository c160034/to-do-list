const express = require('express');
const app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/index', (req, res) => {
    items = ["update", "clean", "return"]
    res.render('index', { items })
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
})