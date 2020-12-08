/**
 * Metodo numerico: Biseccion
 */

// number -> number -> boolean
const precisionFnBuilder = (n) => {
    if (n < 1) throw new Error("La precisión debe ser mayor o igual a 1.");

    const valorPrecisionStr = "0." + (new Array(n - 1).fill("0").join("")) + "1";
    const valor = parseFloat(valorPrecisionStr);
    return (x) => Math.abs(x) < valor;
};

// number -> number
const funcionPolinomial = (x) => x ** 3 - x - 2;

// TODO
// number number (number number number number -> ()) -> number
const biseccion = (funcion, a, b, precision, callback) => {
    let [na, nb] = [a, b];
    const validarPrecision = precisionFnBuilder(precision);
    while (true) {
        const puntoMedio = (na + nb) / 2;
        const puntoMedioEvaluado = funcion(puntoMedio);


        callback(na, nb, puntoMedio, puntoMedioEvaluado);
        if (validarPrecision(puntoMedioEvaluado)) {
            return puntoMedio;
        }

        if (puntoMedioEvaluado < 0) {
            na = puntoMedio;
        } else {
            nb = puntoMedio;
        }
    }
};

const callback = (na, nb, puntoMedio, puntoMedioEvaluado) => {
    console.log(`| a: ${na}, b: ${nb}, c: ${puntoMedio}, f(c): ${puntoMedioEvaluado}`);
};
