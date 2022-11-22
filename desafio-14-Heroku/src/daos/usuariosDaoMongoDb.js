import ContainerMongoDb from "../container/contenedorMongoDb.js";

class UsuariosDaosMongoDb extends ContainerMongoDb {

    constructor() {
        super('usuarios', {
            username: { type: String, required: true },
            password: { type: String, required: true }
        })
    }
}

export default UsuariosDaosMongoDb