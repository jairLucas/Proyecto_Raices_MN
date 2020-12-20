const falsaPosicion = async (params, a, b) => {
    const {
        funcion,
        precision,
        intervalo,
        cancelarMetodo,
        callbackError,
        callbackStep,
        callbackExito
    } = params;
    console.log("Ejecutando metodo de falsa posicion");

    if (funcion === null) {
        callbackError("Error. La función ingresada es inválida.");
        return;
    }

    // Funcion para obtener nuevo punto medio segun el metodo de falsa posicion
    const obtenerPuntoMedio = (a, b) => {
        return b - funcion(b) * ((a - b) / (funcion(a) - funcion(b)));
    };

    let [na, nb] = [a, b];
    const validarPrecision = precisionFnBuilder(precision);
    let iter = 1;

    while (true) {
        if (cancelarMetodo.value) return;

        if (iter > 50) {
            callbackError("El método no converge tras 50 iteraciones.");
            return;
        }

        const puntoMedio = obtenerPuntoMedio(na, nb);
        const puntoMedioEvaluado = funcion(puntoMedio);

        callbackStep({
            i: iter,
            puntoInferior: na,
            puntoSuperior: nb,
            raiz: puntoMedio,
            error: Math.abs(puntoMedioEvaluado)
        });

        if (validarPrecision(puntoMedioEvaluado)) {
            callbackExito(puntoMedio);
            return;
        } else if (na === nb) {
            callbackError("El método no converge.");
            return;
        }

        if (puntoMedioEvaluado < 0) {
            na = puntoMedio;
        } else {
            nb = puntoMedio;
        }
        iter++;

        await esperar(intervalo);
    }
};
