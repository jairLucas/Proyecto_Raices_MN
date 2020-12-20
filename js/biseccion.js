/**
 * Metodo numerico: Biseccion
 */

const esperar = ms => new Promise(resolve => {
    setTimeout(resolve, ms);
});

// number -> number -> boolean
const precisionFnBuilder = (n) => {
    if (n < 1) throw new Error("La precisión debe ser mayor o igual a 1.");

    const valorPrecisionStr = "0." + (new Array(n - 1).fill("0").join("")) + "1";
    const valor = parseFloat(valorPrecisionStr);
    return (x) => Math.abs(x) < valor;
};

// (number -> number) number number (number, number number number number -> ()) -> number
const biseccion = async (funcion, a, b, precision, callback) => {
    let [na, nb] = [a, b];
    const validarPrecision = precisionFnBuilder(precision);
    let iter = 1;
    while (true) {
        const puntoMedio = (na + nb) / 2;
        const puntoMedioEvaluado = funcion(puntoMedio);

        callback(iter, na, nb, puntoMedio, Math.abs(puntoMedioEvaluado));
        if (validarPrecision(puntoMedioEvaluado)) {
            return puntoMedio;
        } else if (na === nb) {
            console.error("El método no converge.");
            return;
        }

        if (puntoMedioEvaluado < 0) {
            na = puntoMedio;
        } else {
            nb = puntoMedio;
        }
        iter++;

        await esperar(500);
    }
};

const callback = (na, nb, puntoMedio, puntoMedioEvaluado) => {
    console.log(`| a: ${na}, b: ${nb}, c: ${puntoMedio}, f(c): ${puntoMedioEvaluado}`);
};
