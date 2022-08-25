/* ---------------------- Modulos ----------------------*/
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

/* ---------------------- Instancia Server ----------------------*/
const app = express();

/* ---------------------- Middlewares ----------------------*/
app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));

//Motor de plantillas
app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//base de datos
const DB_PRODUCTOS = []

/* ---------------------- Rutas ----------------------*/
app.get('/', (req, res)=>{
    res.render('vistaForms', {DB_PRODUCTOS});
});

app.get('/productos', (req, res)=>{
    res.render('vistaProducts', {DB_PRODUCTOS});
});

app.post('/productos', (req, res)=>{
    DB_PRODUCTOS.push(req.body);
    console.log(DB_PRODUCTOS);
    res.redirect('/');
});

/* ---------------------- Servidor ----------------------*/
const PORT = 8080;
const server = app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
});
server.on('error', err => console.log(`error en server ${err}`));