const falsaPosicionModificado = async (params, a, b) => {
    const {
        funcion,
        precision,
        intervalo,
        cancelarMetodo,
        callbackError,
        callbackStep,
        callbackExito
    } = params;
    console.log("Ejecutando metodo de falsa posicion modificado");

    if (funcion === null) {
        callbackError("Error. La función ingresada es inválida.");
        return;
    }

    // Funcion para obtener nuevo punto medio segun el metodo de falsa posicion
    const obtenerPuntoMedio = (a, b, vi, vd) => {
        return (vd*funcion(b)*a - vi*funcion(a)*b) / (vd*funcion(b) - vi*funcion(a));
    };

    let [na, nb] = [a, b];
    let [vi, vd] = [1, 1];
    let ultimoCambio = null;
    const validarPrecision = precisionFnBuilder(precision);

    for (let iter = 1; true; iter++) {
        if (cancelarMetodo.value) return;

        if (iter > 50) {
            callbackError("El método no converge tras 50 iteraciones.");
            return;
        }

        const puntoMedio = obtenerPuntoMedio(na, nb, vi, vd);
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
            if (ultimoCambio === "i") {
                vi = 1;
                vd /= 2;
            } else {
                vi = 1;
                vd = 0.5;
            }
            ultimoCambio = "i";
        } else {
            nb = puntoMedio;
            if (ultimoCambio === "d") {
                vd = 1;
                vi /= 2;
            } else {
                vi = 0.5;
                vd = 1;
            }
            ultimoCambio = "d";
        }

        await esperar(intervalo);
    }
};
