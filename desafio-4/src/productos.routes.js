const express = require('express');
const routerProductos = express.Router();

/*DB*/
const DB_PRODUCTOS = [];

routerProductos.get('/', (req, res)=>{
    res.status(200).json(DB_PRODUCTOS);
});

routerProductos.post('/', (req, res)=>{
    let newId
    if (DB_PRODUCTOS == 0) {
        newId = 1
    } else {
        newId = DB_PRODUCTOS[DB_PRODUCTOS.length - 1].id + 1
    }
    const newObj = { id: newId, ...req.body }
    DB_PRODUCTOS.push(newObj);
    res.status(201).json({msg: 'Agregado!', data: newObj});
});

routerProductos.get('/:id', (req, res)=>{
    const id = parseInt(req.params.id)
    const productFind = DB_PRODUCTOS.find((e) => e.id == id)
    if (productFind === undefined) {
        res.status(201).json({msg: 'Producto No encontrado'});
    }
    else {
        res.status(201).json({msg: 'El producto es:', data: productFind});
    }
    
});

routerProductos.delete('/:id', (req, res)=>{
    const id = parseInt(req.params.id)
    const productFindIndex = DB_PRODUCTOS.findIndex((e) => e.id == id)
    if (productFindIndex === -1) {
        res.status(201).json({msg: 'Producto No encontrado'});
    }
    else {
        DB_PRODUCTOS.splice(productFindIndex,1)
        res.status(201).json({msg: 'El producto ha sido eliminado'});
    }
    
});

routerProductos.put('/:id', (req, res)=>{
    const id = parseInt(req.params.id)
    const productFind = DB_PRODUCTOS.find((e) => e.id == id)
    if (productFind === undefined) {
        res.status(201).json({msg: 'Producto No encontrado'});
    }
    else {
        productFind.nombre = req.body.nombre
        productFind.precio = req.body.precio
        productFind.url = req.body.url
        res.status(201).json({msg: 'El producto ha sido modificiado:', data: productFind});
    }
    
});

module.exports = routerProductos;
