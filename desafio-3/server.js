const express = require('express')

const Container = require('./src/contenedor.js')

const body = new Container('./src/productos.txt');

const app = express()

app.get('/',(req, res) => {
    res.send('Servidor Iniciado')
})

app.get('/productos',async (req, res) => {
const productos = await body.getAll()

    res.send(productos)
})

app.get('/productoRandom', async (req, res) => {
    function genAleatorio(numInic, numFinal) {
        const numAleatorio = parseInt(Math.random() * numFinal) + numInic
        return numAleatorio
    }
    const idAleatorio = genAleatorio(1,3)
    productoAleatorio = await body.getById(idAleatorio)

    res.send(productoAleatorio)
})

app.get('*', (req, res) => {
    res.send('404 - Page not found')
})

const PORT = 3000;
const server = app.listen(PORT, () =>
console.log(`Server on http://localhost:${PORT}`))