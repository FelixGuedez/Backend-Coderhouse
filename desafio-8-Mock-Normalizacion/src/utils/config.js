import { fileURLToPath } from 'url';
import path, { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




export const config = {
    dbProd: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'administrador',
            password: '12345',
            database: 'desafio7'
        }
    },

    dbMens: {
        client: 'better-sqlite3', // or 'better-sqlite3'
        connection: {
            filename: path.join(__dirname, '../../DB/desafio7.db3')
        },
        useNullAsDefault: true
    }
}
