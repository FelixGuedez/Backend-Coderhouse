const socket = io();

socket.on('from-server-producto', productos => {
    console.log('producto recibido', productos)
    const htmlProductos = productos.map((item) => {
        return `<tr>
            <td>${item.nombre}</td>
            <td>${item.precio}</td>
            <td>
                <img width="30" src="${item.imagen}" alt="">
            </td>
        </tr>`;
    })

    const headerTabla = ` <tr style="color: green;">
            <th>Producto</th>
            <th>Precio</th>
            <th>Imagen</th>
        </tr>`;

    document.querySelector("#historial").innerHTML = headerTabla + htmlProductos
})


function enviarProducto() {
    const inputProducto = document.querySelector('#producto');
    const inputPrecio = document.querySelector('#precio');
    const inputImagen = document.querySelector('#imagen');

    const producto = {
        producto: inputProducto.value,
        precio: inputPrecio.value,
        imagen: inputImagen.value
    }
    // console.log(producto)
    socket.emit('from-client-producto', producto);
    console.log(producto)
}

socket.on('from-server-mensaje', mensajes => {
    render(mensajes);
});

function render(mensajes) {
    console.log('mensaje recibidos', mensajes)
    const cuerpoMensajesHTML = mensajes.map((msj) => {
        return `<span style="color:blue;"><b>${msj.email} <span<span style="color:brown;">[${msj.fecha}]:</span> </b><span <span style="color:green;">${msj.mensaje}</span></span>`;
    }).join('<br>');
    // console.log(cuerpoMensajesHTML);

    document.querySelector('#mensajes').innerHTML = cuerpoMensajesHTML;
}

function enviarMensaje() {
    const inputEmail = document.querySelector('#email');
    const inputContenido = document.querySelector('#contenidoMensaje');
    const fecha = new Date().toLocaleString()

    const mensaje = {
        author: inputEmail.value,
        text: inputContenido.value,
        date: fecha
    }
    // console.log(mensaje)

    socket.emit('from-client-mensaje', mensaje);
}