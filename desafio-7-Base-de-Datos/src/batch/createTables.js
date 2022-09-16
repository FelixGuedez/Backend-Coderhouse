import knex from 'knex';
import { config } from '../utils/config.js';

export const knexCliProd = knex(config.dbProd);
export const knexCliMens = knex(config.dbMens);

export async function CrearTablas() {

    // knexCliProd.schema.dropTableIfExists('productos')
    //     .then(() => {
    //         knexCliProd.schema.createTable('productos', table => {
    //             table.increments('id').primary();
    //             table.string('nombre', 50).notNullable();
    //             table.string('precio', 50).notNullable();
    //             table.string('imagen', 50).notNullable();
    //         })
    //             .then(() => console.log("Tabla creada"))
    //             .catch(err => {
    //                 console.log(err);
    //                 throw err;
    //             })
    //             .finally(() => {
    //                 knexCliProd.destroy();
    //             });
    //     });

    const existMens = knexCliMens.schema.hasTable('mensajes')
    if (!existMens) {
        await
            knexCliMens.schema.createTable('mensajes', table => {
                table.increments('id').primary();
                table.string('email', 50).notNullable();
                table.string('mensaje', 50).notNullable();
                table.string('fecha', 50).notNullable();
            })
        console.log("Tabla creada")
        // .then(() => console.log("Tabla creada"))
        // .catch(err => {
        //     console.log(err);
        //     throw err;
        // })
        // // .finally(() => {
        // //     knexCliMens.destroy();
        // // });
    } else {
        console.log('Tabla ya creada anteriormente')
    }
}

