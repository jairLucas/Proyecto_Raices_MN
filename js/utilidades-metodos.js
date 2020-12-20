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
