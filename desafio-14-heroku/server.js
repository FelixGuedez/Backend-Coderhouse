import express from 'express';
import { Server as HttpServer } from 'http';

/* ---------------------- Instancia Server ----------------------*/
const app = express();
const httpServer = new HttpServer(app);


/* ---------------------- Rutas ----------------------*/
app.get('/', (req, res) => {
    res.send('Hola Node.js desde Heroku')
})

app.get('/mensaje', (req, res) => {
    res.send('Mensaje desde Servidor Heroku')
})

/* ---------------------- Middlewares ----------------------*/
app.use(express.json());
app.use(express.static('./public'))

/* ---------------------- Servidor ----------------------*/
const PORT = process.env.PORT || 8080;
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto http://localhost:${PORT}`);
})
server.on('error', err => console.log(`error en server ${err}`));