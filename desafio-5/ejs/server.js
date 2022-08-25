/* ---------------------- Modulos ----------------------*/
const express = require('express');
const path = require('path');

/* ---------------------- Instancia Server ----------------------*/
const app = express();

/* ---------------------- Middlewares ----------------------*/
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Motor de Plantillas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Base de datos en memoria
const DB_PRODUCTOS = [];

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
const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))
