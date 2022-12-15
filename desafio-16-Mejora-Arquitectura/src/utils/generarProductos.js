import { faker } from '@faker-js/faker'
faker.locale = 'es'

export function generarProductos(cant) {
    let productos = [];

    for (let index = 1; index <= cant; index++) {
        const prod = {
            // id: index,
            nombre: faker.commerce.product(),
            precio: faker.commerce.price(),
            imagen: `${faker.image.imageUrl()}?${index}`
        }
        productos.push(prod)
    }
    return productos
}