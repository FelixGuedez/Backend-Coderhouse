/* ---------------------- Modulos ----------------------*/
import express from 'express';
import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { ProductosMock } from './src/mocks/productos.mock.js';
import { MensajesMock } from './src/mocks/mensajes.Mock.js';
import { normalize, schema } from 'normalizr';


/* ---------------------- Instancia Server ----------------------*/
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


/* ---------------------- Middlewares ----------------------*/
app.use(express.json());
app.use(express.static('./public'))

const productosApi = new ProductosMock()
const mensajesApi = new MensajesMock()

let DB_PRODUCTOS =[]
console.log(DB_PRODUCTOS)
DB_PRODUCTOS = productosApi.almacenar(productosApi.generarDatos(5))

// Normalizacion de los mensajes

const schemaAuthor = new schema.Entity('author', {}, { idAttribute: 'email'});

const schemaMensaje = new schema.Entity('post', { author: schemaAuthor }, {idAttribute: 'id' })

const schemaMensajes =new schema.Entity('post', { mensajes: [schemaMensaje]}, {idAttribute:'id'})

const normalizarMensajes = (mensajesConId) => normalize(mensajesConId, schemaMensajes)

async function listarMensajesNormalizados() {
    const mensajes = await mensajesApi.getAll()
    const normalizdos = normalizarMensajes({ id: 'mensajes', mensajes})
    return normalizdos
}

const DB_MENSAJES = []

/* ---------------------- Crear Tablas ----------------------*/

// CrearTablas()

/* ---------------------- Servidor ----------------------*/
const PORT = 8080;
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto http://localhost:${PORT}`);
})
server.on('error', err => console.log(`error en server ${err}`));

/* ---------------------- WebSocket ----------------------*/
io.on('connection', async(socket)=>{
    console.log(`Nuevo cliente conectado! ${socket.id}`);
    socket.emit('from-server-producto', DB_PRODUCTOS);

    socket.on('from-client-producto', (producto) => {
        DB_PRODUCTOS.push(producto);
        io.sockets.emit('from-server-producto', DB_PRODUCTOS);
        console.log(DB_PRODUCTOS)
    });

    socket.emit('from-server-mensaje', await listarMensajesNormalizados());

    socket.on('from-client-mensaje', async mensaje => {
        mensajesApi.save(mensaje)
        io.sockets.emit('mensaje', listarMensajesNormalizados())
        console.log('esto son los mensajes',mensajesApi)

    });
    

})
