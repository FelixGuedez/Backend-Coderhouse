import mongoose from 'mongoose';
import { config } from '../utils/config.js';
import MongoDBClient from '../utils/MongoDBClient.js';

// await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)

export default class ContainerMongoDb {
    constructor(modelo) {
        this.coleccion = modelo
        this.conn = MongoDBClient.getInstance()

    }

    async getAll() {
        try {
            await this.conn.connect();
            const docs = await this.coleccion.find()
        } catch (error) {
            return error
        } finally {
            await this.conn.disconnect();
        }


    }

    async getById(id) {
        try {
            await this.conn.connect();
            const docs = await this.coleccion.find({ '_id': id })
            if (docs.length == 0) {
                console.log('No se encontro el articulo seleccionado')
            }
            else {
                return objFind
            }
        } catch (error) {
            console.log('No se encontro el articulo seleccionado')
        }finally {
            await this.conn.disconnect();
        }
    }

    async getByUserName(userName) {
        try {
            await this.conn.connect();
            const docs = await this.coleccion.find({ 'userName': userName })
            if (docs.length == 0) {
                console.log('No se encontro el usuario seleccionado')
            }
            else {
                return objFind
            }
        } catch (error) {
            console.log('No se encontro el usuario seleccionado')
        }finally {
            await this.conn.disconnect();
        }
    }

    async deleteById(id) {
        try {
            await this.conn.connect();
            const obj = await this.coleccion.deleteOne({ '_id': id })
            if (obj == 0) {
                return 'Articulo no encontrado'
            }
        } catch (error) {
            return 'No se pudo eliminar'
        }finally {
            await this.conn.disconnect();
        }
    }

    async save(elem) {
        try {
            await this.conn.connect();
            let doc = await this.coleccion.create({ elem })
            console.log(elem)
            const docJson = JSON.parse(JSON.stringify(doc))
            return docJson
        } catch (error) {
            console.log(error)
        }finally {
            await this.conn.disconnect();
        }
    }

    async deleteAll() {
        try {
            await this.conn.connect();
            await this.coleccion.deleteMany({})
        } catch (error) {
            console.log(error)
        }finally {
            await this.conn.disconnect();
        }
    }

    async update(elem) {
        try {
            await this.conn.connect();
            const obj = await this.coleccion.updateOne({ '_id': elem.id }, elem)
            if (obj === undefined) {
                return 'Producto No encontrado';
            }
            else {
                return JSON.stringify(obj)
            }
        } catch (error) {
            console.log(error)
        }finally {
            await this.conn.disconnect();
        }
    }
}


