const secante = async (params, a, b) => {
    const {
        funcion,
        precision,
        intervalo,
        cancelarMetodo,
        callbackError,
        callbackStep,
        callbackExito
    } = params;
    console.log("Ejecutando metodo de la secante");

    if (funcion === null) {
        callbackError("Error. La función ingresada es inválida.");
        return;
    }

    if (!precision && precision < 1 || precision > 6) {
        callbackError("Error. El valor de decimales de error debe estar entre 1 y 6");
    }

    let [na, nb] = [a, b];
    const validarPrecision = precisionFnBuilder(precision);

    for (let iter = 1; true; iter++) {
        if (cancelarMetodo.value) return;

        const sigPunto = nb - (funcion(nb) / ((funcion(nb) - funcion(na)) / (nb - na)));
        const sigPuntoEvaluado = funcion(sigPunto);

        callbackStep({
            i: iter,
            puntoInferior: na,
            puntoSuperior: nb,
            raiz: sigPunto,
            error: Math.abs(sigPuntoEvaluado)
        });

        if (validarPrecision(sigPuntoEvaluado)) {
            callbackExito(sigPunto);
            return;
        }

        na = nb;
        nb = sigPunto;

        await esperar(intervalo);
    }

};
