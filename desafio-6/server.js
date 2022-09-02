/* ---------------------- Modulos ----------------------*/
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');


/* ---------------------- Instancia Server ----------------------*/
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


/* ---------------------- Middlewares ----------------------*/
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Motor de plantillas
app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    // partialsDir: path.join(app.get('views'), 'partials'),
    extname: 'hbs'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//base de datos  
const DB_PRODUCTOS = []
const DB_MENSAJES = [
    { author: "Juan@gmail.com", text: "¡Hola! ¿Que tal?", date: new Date().toLocaleString() },
    { author: "Pedro@gmail.com", text: "¡Muy bien! ¿Y vos?", date: new Date().toLocaleString() },
    { author: "Ana@gmail.com", text: "¡Genial!", date: new Date().toLocaleString() }
]



/* ---------------------- Rutas ----------------------*/
app.get('/', (req, res)=>{
    res.render('formulario', {DB_PRODUCTOS, DB_MENSAJES});
    console.log(DB_PRODUCTOS);
});

/* ---------------------- Servidor ----------------------*/
const PORT = 8080;
const server = httpServer.listen(PORT, ()=>{
    console.log(`Servidor escuchando en puerto http://localhost:${PORT}`);
})
server.on('error', err => console.log(`error en server ${err}`));

/* ---------------------- WebSocket ----------------------*/
io.on('connection', (socket)=>{
    console.log(`Nuevo cliente conectado! ${socket.id}`);
    socket.emit('from-server-producto', DB_PRODUCTOS);
    socket.emit('from-server-mensaje', {DB_MENSAJES});

    socket.on('from-client-producto', (producto) => {
        DB_PRODUCTOS.push(producto);
        io.sockets.emit('from-server-producto', DB_PRODUCTOS);
    });

    socket.on('from-client-mensaje', mensaje => {
        DB_MENSAJES.push(mensaje);
        io.sockets.emit('from-server-mensaje', {DB_MENSAJES});
    });
    

})
