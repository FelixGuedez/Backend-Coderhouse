import util from 'util';

const nrosGenerados = {};

// const cant = 15
const numFinal = 1000
const numInicial = 1

process.on('message', msg => {
    console.log('mensaje desde el procesos principal:\n');
    console.log(msg);

    function print(obj) {
        return util.inspect(obj, { showHidden: false, depth: 12, colors: true });
    }
    
    function generarAletario() {
        let semilla = Math.random();
        let numAleatorio = parseInt(semilla * numFinal) + numInicial;
        return numAleatorio;
    }
    
    function conteoAleatorios(cant) {
        console.log(cant)
        let numAleatorio = 0;
        for (let conteo = 0; conteo < cant; conteo++) {
            numAleatorio = generarAletario(numInicial, numFinal);
    
            if (nrosGenerados.hasOwnProperty(numAleatorio.toString())) {
                nrosGenerados[numAleatorio.toString()] += 1;
            } else {
                nrosGenerados[numAleatorio.toString()] = 1;
            }
        }
        return nrosGenerados;
    }


    const numeros = print(conteoAleatorios(msg))
    process.send(`resultado de los numeros en segundo plano ${numeros}`)
    
});
