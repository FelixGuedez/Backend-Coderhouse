import knex from 'knex';
import { config } from '../utils/config.js';

export const knexCliProd = knex(config.dbProd);
export const knexCliMens = knex(config.dbMens);

export async function CrearTablas() {

    const existProd = knexCliMens.schema.hasTable('productos')
    if (!existProd) {
        await
            knexCliProd.schema.createTable('productos', table => {
                table.increments('id').primary();
                table.string('nombre', 50).notNullable();
                table.string('precio', 50).notNullable();
                table.string('imagen', 50).notNullable();
            });
            console.log("Tabla de Productos creada")
        } else {
            console.log('Tabla de Productos Existente')
        }

    const existMens = knexCliMens.schema.hasTable('mensajes')
    if (!existMens) {
        await
            knexCliMens.schema.createTable('mensajes', table => {
                table.increments('id').primary();
                table.string('email', 50).notNullable();
                table.string('mensaje', 50).notNullable();
                table.string('fecha', 50).notNullable();
            })
        console.log("Tabla de mensajes creada")
    } else {
        console.log('Tabla de mensajes Existente')
    }
}

