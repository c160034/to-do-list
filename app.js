const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const methodOverride = require('method-override');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home')
});

items = [{id:0, title:"update", deadline: ""}, {id:1, title:"clean", deadline: ""}, {id:2, title:"return", deadline: ""}]

app.get('/index', (req, res) => {
    res.render('index', { items })
});

app.get('/new', (req, res) => {
    res.render('new');
})

app.post('/index', (req, res) => {
    req.body.item.id=items.length
    items.push(req.body.item)
    res.redirect('/index')
})

app.get('/:id/edit', (req, res) => {
    const item = items.filter(item => item.id == req.params.id)[0]
    res.render('edit', { item } );
})

app.put('/index/:id', (req, res) => {
    const { id } = req.params;
    newItem = { 
        id: parseInt(id),
        title: req.body.item.title,
        deadline: req.body.item.deadline
    }
    items.splice(id, 1, newItem);
    res.redirect('/index')
});

app.delete('/index/:id', (req, res) => {
    const { id } = req.params;
    item1=items.slice(0,id);
    item2=items.slice(parseInt(id)+1);
    items=item1.concat(item2);
    let i=0;
    for (let item of items){
        item.id=i
        i++;
    }
    res.redirect('/index');
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})