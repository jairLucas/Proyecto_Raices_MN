const falsaPosicion = async (funcion, a, b, precision, callback) => {
    const obtenerPuntoMedio = (a, b) => {
        return b - funcion(b) * ((a - b) / (funcion(a) - funcion(b)));
    };

    let [na, nb] = [a, b];
    const validarPrecision = precisionFnBuilder(precision);
    let iter = 1;
    while (true) {
        if (iter >= 50) return;

        const puntoMedio = obtenerPuntoMedio(na, nb);
        const puntoMedioEvaluado = funcion(puntoMedio);


        callback(iter, na, nb, puntoMedio, Math.abs(puntoMedioEvaluado));
        if (validarPrecision(puntoMedioEvaluado)) {
            return puntoMedio;
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
            <label for="decimales-max">Decimales de error: </label>
            <input type="number" id="decimales-max" v-model.number="decimales" min="1" max="6">
        </form>
        <br>
        <button @click="calcular">Calcular</button>
        <br>
        <br>
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
                <td v-for="v in arr">{{v}}</td>
            </tr>
            </tbody>
        </table>
        <!-- -->
    </div>
    `,
    props: {
        funcionUsuario: {
            type: Function,
            required: true
        }
    },
    setup(props) {
        const estilos = {
            "contenedor-form": {
                display: "grid",
                gridTemplateColumns: "13rem 8rem auto",
                gridColumnGap: "1rem"
            }
        };
        const valorMin = Vue.ref(null);
        const valorMax = Vue.ref(null);
        const decimales = Vue.ref(null);

        const entradas = Vue.ref([]);

        const limpiarValores = () => entradas.value = [];

        const calcular = () => {
            limpiarValores();
            falsaPosicion(
                props.funcionUsuario,
                valorMin.value,
                valorMax.value,
                decimales.value,
                (...numeros) => entradas.value.push(numeros)
            );
        };

        return {
            estilos,
            valorMin,
            valorMax,
            decimales,
            calcular,
            entradas
        }
    }
});
