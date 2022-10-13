/* ---------------------- Modulos ----------------------*/
import express from 'express';
import { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { ProductosMock } from './src/mocks/productos.mock.js';
import { MensajesMock } from './src/mocks/mensajes.Mock.js';
import { normalize, schema } from 'normalizr';
import dotenv from 'dotenv';
import session from "express-session";
import exphbs from 'express-handlebars'
import path from 'path'
dotenv.config();

//session persistencia mongo
import connectMongo from 'connect-mongo';
const MongoStore = connectMongo.create({
    mongoUrl: process.env.MONGO_URL,
    ttl: 60
})


/* ---------------------- Instancia Server ----------------------*/
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

//Motor de plantillas
app.set('views', 'src/views')
app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    extname: 'hbs'
}));
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

//Session Setup
app.use(session({
    store: MongoStore,
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true
}))

// Session Middleware
function auth(req, res, next) {
    if (req.session?.user) {
        return next()
    }
    return res.render('sinLogin.hbs')
}

/* ---------------------- Middlewares ----------------------*/
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
// app.use(express.static('./public'))

app.get('/', (req, res) => {
    res.redirect('/login')
})

app.get('/login', (req, res) => {
    res.render('login.hbs')
})

app.get('/productos', auth, (req, res) => {
    const nombre = req.session.user
    res.render('productos.hbs', { nombre })
})

app.post('/login', (req, res,) => {
    const { nombre } = req.body
    req.session.user = nombre;
    req.session.admin = true;
    if (!req.session.contador) {
        req.session.contador = 1;
    } else {
        req.session.contador++;
    }
    res.redirect('/productos')
})

app.get('/logout', (req, res) => {
    const nombre = req.session.user
    req.session.destroy(err => {
        if (err) {
            res.json({ err });
        } else {
            res.render('logout.hbs', {nombre})
        }
    });
});




const productosApi = new ProductosMock()
const mensajesApi = new MensajesMock()

let DB_PRODUCTOS = []
console.log(DB_PRODUCTOS)
DB_PRODUCTOS = productosApi.almacenar(productosApi.generarDatos(5))

// Normalizacion de los mensajes

const schemaAuthor = new schema.Entity('author', {}, { idAttribute: 'email' });

const schemaMensaje = new schema.Entity('post', { author: schemaAuthor }, { idAttribute: 'id' })

const schemaMensajes = new schema.Entity('post', { mensajes: [schemaMensaje] }, { idAttribute: 'id' })

const normalizarMensajes = (mensajesConId) => normalize(mensajesConId, schemaMensajes)

async function listarMensajesNormalizados() {
    const mensajes = await mensajesApi.getAll()
    const normalizdos = normalizarMensajes({ id: 'mensajes', mensajes })
    return normalizdos
}

const DB_MENSAJES = []

/* ---------------------- Crear Tablas ----------------------*/

// CrearTablas()

/* ---------------------- Servidor ----------------------*/
const PORT = process.env.PORT;
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto http://localhost:${PORT}`);
})
server.on('error', err => console.log(`error en server ${err}`));

/* ---------------------- WebSocket ----------------------*/
io.on('connection', async (socket) => {
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
        console.log('esto son los mensajes', mensajesApi)

    });


})
