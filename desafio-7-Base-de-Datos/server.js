/* ---------------------- Modulos ----------------------*/
import express from 'express';
import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { config } from './src/utils/config.js';
import knex from 'knex';
import { CrearTablas, knexCliMens, knexCliProd } from './src/batch/createTables.js';

/* ---------------------- Instancia Server ----------------------*/
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


/* ---------------------- Middlewares ----------------------*/
app.use(express.json());
app.use(express.static('./public'))

const DB_MENSAJES = []
/* ---------------------- Crear Tablas ----------------------*/

CrearTablas()

/* ---------------------- Servidor ----------------------*/
const PORT = 8080;
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto http://localhost:${PORT}`);
})
server.on('error', err => console.log(`error en server ${err}`));

/* ---------------------- WebSocket ----------------------*/
io.on('connection', async socket => {
    console.log(`Nuevo cliente conectado! ${socket.id}`);
    const productos = await knexCliProd.from('productos').select('nombre', 'precio', 'imagen')
    socket.emit('from-server-producto', productos);
    const mensajes = await knexCliMens.from('mensajes').select('email', 'mensaje', 'fecha')
    // console.log('mensajes en la tabla',mensajes)
    socket.emit('from-server-mensaje', mensajes);

    socket.on('from-client-producto', async item => {
        console.log(item.producto)
        await knexCliProd('productos').insert({ nombre: item.producto, precio: item.precio, imagen: item.imagen })
        const productos = await knexCliProd.from('productos').select('nombre', 'precio', 'imagen')
        // console.log(productos)
        io.sockets.emit('from-server-producto', productos);
    });


    socket.on('from-client-mensaje', async mensaje => {
        // console.log('mensaje antes',mensaje)
        await knexCliMens('mensajes').insert({ email: mensaje.author, mensaje: mensaje.text, fecha: mensaje.date })
        // const mensajes = await knexCliMens.from('mensajes').select('email', 'mensaje', 'fecha')
        // console.log('mensaje despues', mensajes)
        io.sockets.emit('from-server-mensaje', mensajes);
    });


})
