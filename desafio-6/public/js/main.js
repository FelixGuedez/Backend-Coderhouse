const socket = io();

socket.on("from-server-producto", (productos) => {
    const htmlProductos = productos.map((item) => {
        return `<tr style="color: green;">
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Imagen</th>
                </tr>
        
                <tr>
                    <td>${item.producto}}</td>
                    <td>${item.precio}}</td>
                    <td>
                        <img width="30" src="${item.imagen}}" alt="">
                    </td>
                </tr>`
    document.querySelector("#historial").innerHTML = 
            htmlProductos;
    })
    console.log('productos:', data.DB_PRODUCTOS);
})


function enviarProducto() {
    const inputProducto = document.querySelector('#producto');
    const inputPrecio = document.querySelector('#precio');
    const inputImagen = document.querySelector('#Imagen');

    const producto = {
        producto: inputProducto.value,
        precio: inputPrecio.value,
        imagen: inputImagen.value
    }
    socket.emit('from-client-producto', producto);
    console.log(producto)
}