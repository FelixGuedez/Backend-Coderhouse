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
        </tr>`
    })

    const headerTabla = ` <tr style="color: green;">
            <th>Producto</th>
            <th>Precio</th>
            <th>Imagen</th>
        </tr>`

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


// Desnormalizacion de Mensajes
const schemaAuthor = new normalizr.schema.Entity('author', {}, { idAttribute: 'id' })

const schemaMensaje = new normalizr.schema.Entity('post', { author: schemaAuthor }, { idAttribute:'id' })

const schemaMensajes = new normalizr.schema.Entity('post', { author: schemaMensaje }, { idAttribute:'id' })

socket.on('from-server-mensaje', mensajes => {

    let mensajesNsize = JSON.stringify(mensajes).length
    console.log(mensajes, mensajesNsize)

    let mensajesD = normalizr.denormalize(mensajes.result, schemaMensajes, mensajes.entities)

    let mensajesDsize = JSON.stringify(mensajesD).length
    console.log(mensajesD, mensajesDsize)

    let porcentajeC = parseInt((mensajesNsize * 100) / mensajesDsize)
    console.log(`Porcentaje de Compresion ${porcentajeC} %`)
    document.querySelector('#porcentajeCompresion').innerHTML = `${porcentajeC} %`

    render(mensajes);
});

function render(mensajes) {
    console.log('mensaje recibidos', mensajes)
    const cuerpoMensajesHTML = mensajes.map((msj) => {
        return `<span style="color:blue;"><b>${msj.email} <span<span style="color:brown;">[${msj.fecha}]:</span> </b><span <span style="color:green;">${msj.mensaje}</span></span>`;
    }).join('<br>');
    console.log(cuerpoMensajesHTML);

    document.querySelector('#mensajes').innerHTML = cuerpoMensajesHTML;
}

function enviarMensaje() {
    const inputEmail = document.querySelector('#email');
    const inputNombre = document.querySelector('#nombre')
    const inputApellido = document.querySelector('#apellido')
    const inputEdad = document.querySelector('#edad')
    const inputAlias = document.querySelector('#alias')
    const inputAvatar = document.querySelector('#avatar')
    const inputContenido = document.querySelector('#contenidoMensaje');
    const fecha = new Date().toLocaleString()

    const mensaje = {
        author: inputEmail.value,
        nombre: inputNombre.value,
        apellido: inputApellido.value,
        edad: inputEdad.value,
        alias: inputAlias.value,
        avatar: inputAvatar.value,
        text: inputContenido.value,
        date: fecha
    }
    console.log(mensaje)

    socket.emit('from-client-mensaje', mensaje);
}