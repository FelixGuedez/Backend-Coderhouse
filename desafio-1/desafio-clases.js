class Usuario {
    constructor(nombre, apellido){
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = []
        this.mascotas = [];
    }

    getFullName() {
        return `${this.nombre} ${this.apellido}`
    }

    addMascota(mascota) {
        this.mascotas.push(mascota);
    }

    countMascotas() {
        return this.mascotas.length
    }

    addBook(nombreLibro, autor){
        const libro = {
            nombre: nombreLibro,
            autor: autor
        }
        this.libros.push(libro)
        // console.log(libro)
    }

    getBookNames() {
        return this.libros.map((el) => el.nombre)
    }

}

const usuario1 = new Usuario ('Pedro','Perez');
usuario1.addMascota('gato')
usuario1.addMascota('perro')
usuario1.addMascota('pajaro')
usuario1.addBook('El señor de los anillos','J. R. Tolkien')
usuario1.addBook('Cien años de Soledad','Gabriel Garcia Marquez')
console.log(usuario1.getFullName())
console.log(usuario1.countMascotas())
console.log(usuario1.getBookNames())









