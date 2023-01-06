import axios from 'axios';
import { writeFile } from "fs";

const datos = await obtenerPorductos();
await escribirResumen('res_asyncawait.json', datos);


async function obtenerPorductos(){
    const res = await axios.get(`/productos`, {
        baseURL: `http://localhost:8082`,
        headers: {
            'Content-Type':'application/json'
        }
    });

    return res.data;
}

async function escribirResumen(archivo, datos){
    writeFile(archivo, JSON.stringify(datos, null, '\t'), error => {
        if (error) throw new Error(`Error de escritura de archivo ${archivo}`)
        console.log(`Escritura ok de archivo ${archivo}`)
    })
}
