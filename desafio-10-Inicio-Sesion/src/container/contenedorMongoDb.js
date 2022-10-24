import mongoose from 'mongoose';
import  { config }  from '../utils/config.js';

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)

export default class ContainerMongoDb {
    constructor(nombreColeccion, esquema) {
        // this.coleccion = mongoose.model(nombreColeccion, esquema)
        this.coleccion =  mongoose.models[nombreColeccion] || mongoose.model(nombreColeccion, esquema);
    }

    async getAll() {
        try {
            const docs = await this.coleccion.find()
        } catch (error) {
            return error
        }
    }

    async getById(id) {
        try {
            const docs = await this.coleccion.find({ '_id': id })
            if (docs.length == 0) {
                console.log('No se encontro el articulo seleccionado')
            }
            else {
                return objFind
            }
        } catch (error) {
            console.log('No se encontro el articulo seleccionado')
        }
    }

    async getByUserName(userName) {
        try {
            const docs = await this.coleccion.find({ 'userName': userName })
            if (docs.length == 0) {
                console.log('No se encontro el usuario seleccionado')
            }
            else {
                return objFind
            }
        } catch (error) {
            console.log('No se encontro el usuario seleccionado')
        }
    }

    async deleteById(id) {
        try {
            const obj = await this.coleccion.deleteOne({ '_id': id })
            if (obj == 0) {
                return 'Articulo no encontrado'
            }
        } catch (error) {
            return 'No se pudo eliminar'
        }
    }

    async save(elem) {
        try {
            let doc = await this.coleccion.create({elem})
            console.log(elem)
            const docJson = JSON.parse(JSON.stringify(doc))
            return docJson
        } catch (error) {
            console.log(error)
        }
    }

    async deleteAll() {
        try {
            await this.coleccion.deleteMany({})
        } catch (error) {
            console.log(error)
        }
    }

    async update(elem) {
        try {
            const obj = await this.coleccion.updateOne({ '_id': elem.id }, elem)
            if (obj === undefined) {
                return 'Producto No encontrado';
            }
            else {
                return JSON.stringify(obj)
            }
        } catch (error) {
            console.log(error)
        }
    }


    // async add(id, body) {
    //     const objs = await this.getAll()
    //     const carritoFind = objs.find((e) => e.id == id)
    //     carritoFind.productos.push(body)
    //     await fs.writeFile(this.ruta, JSON.stringify(carritoFind, null, 2))
    // }

}

// await mongoose.disconnect();

