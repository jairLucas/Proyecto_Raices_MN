const newtonRaphson = async (params, puntoInicial, derivada) => {
    const {
        funcion,
        precision,
        intervalo,
        cancelarMetodo,
        callbackError,
        callbackStep,
        callbackExito
    } = params;
    console.log("Ejecutando metodo de Newton-Raphson");

    if (funcion === null) {
        callbackError("Error. La función ingresada es inválida.");
        return;
    }


    if (derivada === null) {
        callbackError("Error. La derivada ingresada es inválida.");
        return;
    }

    let puntoActual = puntoInicial;
    const validarPrecision = precisionFnBuilder(precision);

    for (let iter = 2; true; iter++) {
        if (cancelarMetodo.value) return;

        if (iter > 51) {
            callbackError("El método no converge tras 50 iteraciones.");
            return;
        }

        const puntoEvaluadoEnDerivada = derivada(puntoActual);
        if (puntoEvaluadoEnDerivada === 0) {
            callbackError(`Error: La derivada evaluada en el punto ${puntoActual} es igual a 0. No se puede continuar.`);
            return;
        }

        const puntoSig = puntoActual - (funcion(puntoActual) / derivada(puntoActual));
        const raizEvaluada = funcion(puntoSig);

        callbackStep({
            puntoAnterior: puntoActual,
            raiz: puntoSig,
            error: Math.abs(raizEvaluada)
        });

        if (validarPrecision(raizEvaluada)) {
            callbackExito(puntoSig);
            return;
        }
        // TODO: Verificar que el método converga

        puntoActual = puntoSig;

        await esperar(intervalo);
    }
};

app.component("metodo-newton-raphson", {
    template: `
        <div>
        <form @submit.prevent :style="estilos['contenedor-form']">
            <label for="valor-min">Derivada: </label>
            <input type="text" id="derivada" v-model="derivada">
            <span></span>
            <label for="valor-max">Punto Inicial: </label>
            <input type="number" id="valor-inicial" v-model.number="puntoInicial" step="any">
            <span></span>
        </form>
        <br>
        <button @click="calcular">Calcular</button>
        <br>
        <br>
        <div style="color: red">
            {{ mensajeDeError }}
        </div>
        <div v-if="valorRaiz !== null" style="color: #009688; font-weight: bold;">
            Se encontró la raiz: {{ valorRaiz }}
        </div>
        <div :style="estilos['contenedor-tabla']">
            <table class="table table-striped">
                <thead class="table-dark" style="position: sticky; top: 0;">
                <tr>
                    <th>x<sub>n</sub></th>
                    <th>x<sub>n+1</sub></th>
                    <th>error</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="arr in entradas">
                    <td v-for="v in arr">{{ v }}</td>
                </tr>
                </tbody>
            </table>
        </div>

        <!-- Benditos computed de Vue -->
        <div style="display: none;">{{ funcionDerivada }}</div>
        <!-- -->
        </div>
    `,
    props: {
        solver: {
            type: Object,
            required: true
        },
        funcionParseada: {
            type: Function,
            required: true
        }
    },
    setup(props) {
        const estilos = {
            "contenedor-form": {
                display: "grid",
                gridTemplateColumns: "13rem 17rem auto",
                gridColumnGap: "1rem"
            },
            "contenedor-tabla": {
                height: "80vh",
                overflow: "auto",
                border: "solid 2px gray"
            }
        };
        const puntoInicial = Vue.ref(null);
        const derivada = Vue.ref("");
        const decimales = Vue.ref(null);

        const entradas = Vue.ref([]);
        const mensajeDeError = Vue.ref("");
        const valorRaiz = Vue.ref(null);

        const limpiarValores = () => entradas.value = [];

        const funcionDerivada = Vue.computed(() => {
            const value = derivada.value;
            try {
                const expr = funParser.parse(value);
                const fun = x => expr.evaluate({x});

                graph.reset();
                graph.add(props.funcionParseada, "#007bff");
                graph.add(fun, "#f44336");
                return fun;
            } catch (e) {
                if (value === "" && graph) {
                    graph.reset();
                    graph.add(props.funcionParseada, "#007bff");
                }
                return null;
            }
        });

        const calcular = () => {
            limpiarValores();
            valorRaiz.value = null;
            mensajeDeError.value = "";
            props.solver.run(newtonRaphson, puntoInicial.value, funcionDerivada.value);
        };

        const callbackStep = (params) => {
            const {
                puntoAnterior,
                raiz,
                error
            } = params;

            entradas.value.push([puntoAnterior, raiz, error]);
        };

        props.solver.setCallbackStep(callbackStep);
        props.solver.setCallbackError(e => mensajeDeError.value = e);
        props.solver.setCallbackExito(x => valorRaiz.value = x);

        return {
            estilos,
            derivada,
            puntoInicial,
            decimales,
            calcular,
            entradas,
            mensajeDeError,
            valorRaiz,
            funcionDerivada
        }
    }
});
