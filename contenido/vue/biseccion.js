const biseccion = async (params, a, b) => {
    const {
        funcion,
        precision,
        intervalo,
        cancelarMetodo,
        callbackError,
        callbackStep,
        callbackExito
    } = params;
    console.log("Ejecutando metodo de biseccion");

    if (funcion === null) {
        callbackError("Error. La función ingresada es inválida.");
        return;
    }

    let [na, nb] = [a, b];
    const validarPrecision = precisionFnBuilder(precision);
    let iter = 1;

    // Hacer que na sea negativo y nb sea positivo
    if (funcion(nb) < funcion(na)) {
        [na, nb] = [nb, na];
    }

    while (true) {
        if (cancelarMetodo.value) return;

        const puntoMedio = (na + nb) / 2;
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
            callbackError("El método no converge. Revisa que los puntos sean válidos.");
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
