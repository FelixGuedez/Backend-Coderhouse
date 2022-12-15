import { config } from "./config.js";
import mongoose from "mongoose";

let instance = null;

export default class MongoDBClient {
    constructor() {
        this.connected = false;
        this.client = mongoose;
        console.log(config.mongodb.connstr);

        this.primeraConexion = (new Date()).toLocaleDateString();
    }

    async connect() {
        try {
            await this.client.connect(config.mongodb.cnxStr, config.mongodb.options);
            this.connected = true;

            console.log('Base de datos conectada');
        } catch (error) {
            throw new CustomError(500, "Error al conectarse a mongodb", error);
        }
    }

    async disconnect() {
        try {
            await this.client.connection.close();
            this.connected = false;

            console.log('Base de datos desconectada');
        } catch (error) {
            throw new CustomError(500, "Error al desconectarse a mongodb", error);
        }
    }

    static getInstance() {
        if (!instance) {
            instance = new MongoDBClient()
        }

        return instance;
    }
}
