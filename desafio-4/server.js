/* ---------------------- Modulos ----------------------*/
const express = require('express');
const morgan = require('morgan');

//Instancia de Server
const app = express();
const routerProductos = require('./src/productos.routes.js');


/* ---------------------- Middlewares ---------------------- */
app.use(express.static(__dirname + '/public'));


/* ---------------------- Rutas ----------------------*/
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));

app.use('/api/productos', routerProductos);

/* ---------------------- Servidor ----------------------*/
const PORT = 8081;
const server = app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en puerto http://localhost:${PORT}`);
})
server.on('error', error=>{
    console.error(`Error en el servidor ${error}`);
});
