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
        if (cancelarMetodo.value) {
            return;
        }

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

app.component("metodo-falsa-posicion", {
    template: `
        <div>
        <form @submit.prevent :style="estilos['contenedor-form']">
            <label for="valor-min">Punto inferior: </label>
            <input type="number" id="valor-min" v-model.number="valorMin" step="any">
            <span></span>
            <label for="valor-max">Punto superior: </label>
            <input type="number" id="valor-max" v-model.number="valorMax" step="any">
            <span></span>
        </form>
        <br>
        <button @click="calcular">Calcular</button>
        <br>
        <br>
        <div style="color: red">
            {{mensajeDeError}}
        </div>
        <div v-if="valorRaiz !== null" style="color: #009688; font-weight: bold;">
            Se encontró la raiz: {{valorRaiz}}
        </div>
        <div :style="estilos['contenedor-tabla']">
            <table class="table table-striped">
                <thead class="table-dark">
                <tr>
                    <th>i</th>
                    <th>a</th>
                    <th>b</th>
                    <th>raíz</th>
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
        <!-- -->
        </div>
    `,
    props: {
        solver: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const estilos = {
            "contenedor-form": {
                display: "grid",
                gridTemplateColumns: "13rem 8rem auto",
                gridColumnGap: "1rem"
            },
            "contenedor-tabla": {
                maxHeight: "80vh",
                overflow: "auto",
                border: "solid 2px gray"
            }
        };
        const valorMin = Vue.ref(null);
        const valorMax = Vue.ref(null);
        const decimales = Vue.ref(null);

        const entradas = Vue.ref([]);
        const mensajeDeError = Vue.ref("");
        const valorRaiz = Vue.ref(null);

        const limpiarValores = () => entradas.value = [];

        const calcular = () => {
            limpiarValores();
            valorRaiz.value = null;
            mensajeDeError.value = "";
            props.solver.run(falsaPosicion, valorMin.value, valorMax.value);
        };

        const callbackStep = (params) => {
            const {
                i,
                puntoInferior,
                puntoSuperior,
                raiz,
                error
            } = params;

            entradas.value.push([i, puntoInferior, puntoSuperior, raiz, error]);
        };

        props.solver.setCallbackStep(callbackStep);
        props.solver.setCallbackError(e => mensajeDeError.value = e);
        props.solver.setCallbackExito(x => valorRaiz.value = x);

        return {
            estilos,
            valorMin,
            valorMax,
            decimales,
            calcular,
            entradas,
            mensajeDeError,
            valorRaiz
        }
    }
});
