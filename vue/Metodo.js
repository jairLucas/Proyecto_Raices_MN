
const solver = (params) => {
    const {
        funcionObjetivo,
        precision,
        intervalo = 250
    } = params;

    const listenersExito = [];
    const listenersStep = [];
    const listenersError = [];

    const cancelarMetodo = () => {};



    return {
        addOnExito: f => listenersError.push(f),
        addOnStep: f => listenersStep.push(f),
        addOnError: f => listenersExito.push(f),
        run: (...params) => cancelarMetodo
    };
};
