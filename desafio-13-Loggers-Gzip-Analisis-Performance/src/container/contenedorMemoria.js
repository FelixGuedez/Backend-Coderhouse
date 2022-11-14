
export default class ContainerArchivo {
    constructor() {
        this.elementos = []
    }

    getAll() {
        try {
            const objs = this.elementos
            return JSON.parse(JSON.stringify(objs))
        } catch (error) {
            return error
        }
    }

    getById(id) {
        try {
            const objs = this.elementos
            const objFind = objs.find((e) => e.id == id)
            return objFind
        } catch (error) {
            console.log('No se encontro el articulo seleccionado')
        }
    }

    deleteById(id) {
        try {
            const objs = this.elementos
            const indexObj = objs.findIndex((e) => e.id == id)
            if (indexObj == -1) {
                return 'Articulo no encontrado'
            } else {
                return objs.splice(indexObj, 1)
            }
        } catch (error) {
            return 'No se pudo eliminar'
        }
    }

    save(obj) {
        try {
            console.log(this.elementos)
            const objs = this.elementos
            let newId
            if (objs.length == 0) {
                newId = 1
            } else {
                newId = objs[objs.length - 1].id + 1
            }
            const timestamp = Date.now()
            const newObj = { id: newId, timestamp, ...obj }
            return objs.push(newObj)

            // return newId
        } catch (error) {
            console.log(error)
        }
    }

    deleteAll() {
        try {
            const objs = []
            return objs

        } catch (error) {
            return 'No se pudieron elminar los articulos'

        }

    }

    update(id, newObj) {
        const objs = this.elementos
        const indexObj = objs.findIndex((e) => e.id == id)
        if (indexObj === undefined) {
            return 'Producto No encontrado';
        }
        else {
            objs[indexObj] = { id, ...newObj };
        }
        return { id, ...newObj }
    }

    add(id, body) {
        const objs = this.elementos
        const carritoFind = objs.find((e) => e.id == id)
        carritoFind.productos.push(body)
        return carritoFind
    }

}

