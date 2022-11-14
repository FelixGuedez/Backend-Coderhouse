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
import minimist from 'minimist'
import util from 'util'
import os from 'os'
import { fork } from 'child_process';
import cluster from 'cluster';

import { config } from './src/utils/config.js';

import bcrypt from 'bcrypt';
import passport from 'passport'
import { Strategy } from 'passport-local'
import mongoose from 'mongoose';
import { usuarioModel } from './models/usuario.model.js';
import { argv } from 'process';

import compression from 'compression'
import { logger } from './src/utils/logger.config.js';

export let cantidad

const LocalStrategy = Strategy
let nameUser

dotenv.config();

//session persistencia mongo
// import connectMongo from 'connect-mongo';
// const MongoStore = connectMongo.create({
//     mongoUrl: process.env.MONGO_URL,
//     ttl: 60
// })

/*============================[Base de Datos]============================*/
const strConn = config.mongodb.cnxStr
const conn = await mongoose.connect(strConn, config.mongodb.options)

/* ---------------------- Instancia Server ----------------------*/
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const io2 = new IOServer(httpServer);
/* ---------------------- Fork ----------------------*/
const forkProcess = fork('./src/fork/numAleatotio.js')

/*----------- Passport -----------*/

passport.use(new LocalStrategy(
    async function (username, password, done) {
        console.log(`${username} ${password}`)
        //Logica para validar si un usuario existe
        const existeUsuario = await usuarioModel.findOne({ username: username })
        if (!existeUsuario) {
            return done(null, false);
        } else {
            const match = await verifyPass(existeUsuario, password);
            if (!match) {
                return done(null, false);
            }
            nameUser = await nameUsername(existeUsuario)
            return done(null, existeUsuario);
        }
    }
));

passport.serializeUser((usuario, done) => {
    done(null, usuario.username);
});

passport.deserializeUser((username, done) => {
    const existeUsuario = usuarioModel.findOne({ username: username })
    done(null, existeUsuario);
});


//Motor de plantillas
app.set('views', 'src/views')
app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    extname: 'hbs'
}));
app.set('view engine', '.hbs');

//Session Setup
app.use(session({
    // store: MongoStore,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 20000 //20 seg
    }
}))

app.use(passport.initialize());
app.use(passport.session());

//Metodos de Auth
async function generateHashPassword(password) {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
}

async function verifyPass(username, password) {
    const match = await bcrypt.compare(password, username.password);
    logger.info(`pass login: ${password} || pass hash: ${username.password}`)
    return match;
}

async function nameUsername(username) {
    const usuario = username.username
    return usuario
}

function print(obj) {
    return util.inspect(obj, { showHidden: false, depth: 12, colors: true });
}



// Session Middleware
function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}

/* ---------------------- Middlewares ----------------------*/
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static('./public'))

app.get('/', (req, res) => {
    res.redirect('/login')
})

app.get('/login', (req, res) => {
    res.render('login.hbs')
})

app.get('/registro', (req, res) => {
    res.render('registro.hbs')
})

app.get('/productos', isAuth, (req, res) => {
    const nombre = nameUser
    res.render('productos.hbs', { nombre })
})

app.get('/info', (req, res) => {
    const arg_Entrada = process.argv
    const vOs = process.platform
    const vNode = process.version
    const memoryOs = print(process.memoryUsage())
    const pathEjec = process.execPath
    const idProcess = process.pid
    const carpetaProy = process.cwd()
    const CPU_CORES = os.cpus().length;

    res.render('info.hbs', { arg_Entrada, vOs, vNode, memoryOs, pathEjec, idProcess, carpetaProy, CPU_CORES })

})

app.get('/info-zip', compression(), (req, res) => {
    const arg_Entrada = process.argv
    const vOs = process.platform
    const vNode = process.version
    const memoryOs = print(process.memoryUsage())
    const pathEjec = process.execPath
    const idProcess = process.pid
    const carpetaProy = process.cwd()
    const CPU_CORES = os.cpus().length;

    res.render('info.hbs', { arg_Entrada, vOs, vNode, memoryOs, pathEjec, idProcess, carpetaProy, CPU_CORES })

})

app.get('/api/randoms', (req, res) => {
    const nrosGenerados = {};
    let cant = 1000000000

    if (req.query.cant) {
        cant = req.query.cant
    } else {
        cant
    }

    forkProcess.send(cant);

    forkProcess.on('message', msg => {
        console.log(`mensaje desde el procesos secundario: ${msg}`);
        res.send(msg)
    });
    // res.render('randoms.hbs')

})

app.post('/login', passport.authenticate('local', { successRedirect: '/productos', failureRedirect: '/login-error' }))

app.post('/registro', async (req, res) => {
    const { username, password } = req.body;
    const newUsuario = await usuarioModel.findOne({ username: username })

    if (newUsuario) {
        res.render('registro-error')
    } else {
        const newUser = { username, password: await generateHashPassword(password) };
        await usuarioModel.create(newUser)
        res.redirect('/login')
    }
})

app.get('/login-error', (req, res) => {
    res.render('loginError.hbs')
})

app.get('/logout', (req, res) => {
    const nombre = nameUser
    req.session.destroy(err => {
        if (err) {
            res.json({ err });
        } else {
            res.render('logout.hbs', { nombre })
        }
    });
});

app.get('*', (req, res) => {
    const {url, method } =req
    logger.warn(`Ruta ${method} ${url} no implementada`)
    res.send(`Ruta ${method} ${url} no implementada`)
})




const productosApi = new ProductosMock()
const mensajesApi = new MensajesMock()

let DB_PRODUCTOS = []
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
const CPU_CORES = os.cpus().length;
let options = { default: { p: '8080', m: 'FORK' } }

const PORT = minimist(argv, options)
const mode = minimist(argv, options)


if ( cluster.isPrimary && mode.m == 'CLUSTER') {
    console.log('Cant de cores: ', CPU_CORES);

    for (let i = 0; i < CPU_CORES; i++) {
        cluster.fork();
    }

    cluster.on('exit', worker => {
        logger.info(`Worker ${process.pid} ${worker.id} ${worker.pid} finalizo ${new Date().toLocaleString()}`);
        cluster.fork();
    });

} else {
    // console.log(PORT.p)
    const server = httpServer.listen(PORT.p, () => {
        logger.info(`Servidor escuchando en puerto http://localhost:${PORT.p} - PID WORKER ${process.pid}`);
    })
    server.on('error', err => logger.error(`error en server ${err}`));
}

/* ---------------------- WebSocket ----------------------*/
io.on('connection', async (socket) => {
    logger.info(`Nuevo cliente conectado! ${socket.id}`);
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

    socket.emit('from-server-random',)


})