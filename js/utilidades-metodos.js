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

const funParser = new exprEval.Parser();
const vueStringAFuncion = (funcionUsuario, color = "#007bff", reiniciar = true) => Vue.computed(() => {
    const value = funcionUsuario.value;
    try {
        const expr = funParser.parse(value);
        const fun = x => expr.evaluate({x});

        if (reiniciar) {
            graph.reset();
        }

        graph.add(fun, color);
        return fun;
    } catch (e) {
        if (value === "" && graph) {
            graph.reset();
        }
        return null;
    }
});
