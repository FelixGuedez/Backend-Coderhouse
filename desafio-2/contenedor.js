const fs = require('fs');

class Container {
    constructor(ruta) {
        this.ruta = ruta
    }

    async save(obj) {
        try {
            const objs = await this.getAll()
            let newId

            if (objs.length == 0) {
                newId = 1
            } else {
                newId = objs[objs.length - 1].id + 1
            }

            const newObj = { id: newId, ...obj }
            objs.push(newObj)

            await fs.promises.writeFile(this.ruta, JSON.stringify(objs, null, 2))
            // return newId

        } catch (error) {
            console.log('Error al guardar')
        }
    }

    async getById(id) {
        try {
            const objs = await this.getAll()
            const objFind = objs.find((e) => e.id == id)
            return objFind

        } catch (error) {
            console.log('No se encontro el articulo seleccionado')

        }
    }

    async getAll() {
        try {
            const objs = await fs.promises.readFile(this.ruta, 'utf-8')

            return JSON.parse(objs)

        } catch (error) {
            return []

        }

    }

    async deleteById(id) {
        try {
            const objs = await this.getAll()
            const indexObj = objs.findIndex((e) => e.id == id)

            if (indexObj == -1) {
                return 'Articulo no encontrado'
            } else {
                objs.splice(indexObj, 1)
                await fs.promises.writeFile(this.ruta, JSON.stringify(objs, null, 2))

            }

        } catch (error) {
            return 'No se pudo eliminar'

        }


    }

    async deleteAll() {
        try {
            const objs =[]
            await fs.promises.writeFile(this.ruta, JSON.stringify(objs, null, 2))
            
        } catch (error) {
            return 'No se pudieron elminar los articulos'
            
        }
        

    }
}

const container = new Container('./productos.txt')

async function main() {
    console.log(await container.save({ title: "Mouse", price: "12000", thumbail: "https://http2.mlstatic.com/D_NQ_NP_2X_706788-MLA45377337052_032021-F.webp" }))
    console.log(await container.save({ title: "NoteBook", price: "40000", thumbail: "https://http2.mlstatic.com/D_NQ_NP_2X_844244-MLA48809011252_012022-F.webp" }))
    console.log(await container.save({ title: "Teclado", price: "15000", thumbail: "https://http2.mlstatic.com/D_NQ_NP_2X_935848-MLA50955116697_082022-F.webp" }))
    console.log('Articulos Iniciales')
    console.log(await container.getAll())
    console.log('Consulta de articulo por ID')
    console.log(await container.getById(2))
    console.log('Eliminar articulo por ID')
    console.log(await container.deleteById(1))
    console.log(await container.getAll())
    console.log('Eliminar Todos los articulos')
    console.log(await container.deleteAll())
    console.log(await container.getAll())
}

main()