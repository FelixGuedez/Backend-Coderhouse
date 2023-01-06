import ContainerArchivo  from '../container/contenedorMemoria.js';
import { generarProductos } from '../utils/generarProductos.js';


export class ProductosMock extends ContainerArchivo {
    constructor(){
        super()
    }

    generarDatos(cant = 5){
        return generarProductos(cant)
    }

    almacenar(productosGenr){
        for (const elemento of productosGenr) {
            let newId = 0;
            if (this.elementos.length == 0) {
                newId = 1
            } else {
                newId = this.elementos[this.elementos.length - 1].id + 1
            }
            this.elementos.push({id: newId, ...elemento})
        }
        return this.elementos
    }
}

