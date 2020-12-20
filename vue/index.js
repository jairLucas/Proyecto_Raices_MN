/*
Metodos abiertos:
- Punto fijo
- Newton Raphson
- Secante

Metodos cerrados:
- Bisección
- Falsa posición
- Falsa posición modificada
*/

const solver = (funcion, precision, intervalo = 250) => {
    let callbackExito = console.log;
    let callbackStep = console.log;
    let callbackError = console.error;

    let cancelarMetodo = Vue.ref(false);

    const cancelarMetodoFn = () => cancelarMetodo.value = true;

    return {
        setCallbackExito: f => callbackError = f,
        setCallbackStep: f => callbackStep = f,
        setCallbackError: f => callbackExito = f,
        run: (metodo, ...params) => {
            cancelarMetodo.value = false;
            metodo({
                funcion: funcion.value,
                precision: precision.value,
                intervalo,
                cancelarMetodo,
                callbackError,
                callbackStep,
                callbackExito
            },...params);
            return cancelarMetodoFn;
        }
    };
};

app.component("menu-seleccion", {
    template: `
        <div>
        <h1>Calculadora</h1>
        <p>Aqui puedes verificar tus respuestas de problemas de raices de polinomios con los diferentes métodos.</p>
        <hr>

        <form @submit.prevent>
            <label for="entrada-funcion">Ingresa la función:</label>
            <br>
            <input v-model="funcionUsuario" type="text" id="entrada-funcion" placeholder="x^3 - 2*x + 5">
            <br>
            <label for="nombre-metodo">Selecciona el método:</label>
            <br>
            <select v-model="metodoUsuario" id="nombre-metodo">
                <option selected disabled>Métodos cerrados</option>
                <option value="biseccion">Bisección</option>
                <option value="falsa-posicion">Falsa posición</option>
                <option value="falsa-posicion-modificada">Falsa posición modificada</option>
                <option selected disabled>Métodos abiertos</option>
                <option value="punto-fijo">Punto fijo</option>
                <option value="newton-raphson">Newton Raphson</option>
                <option value="secante">Secante</option>
            </select>
            <br>
            <label for="decimales-max">Decimales de error: </label>
            <br>
            <input type="number" id="decimales-max" v-model.number="decimales" min="1" max="6">
            <br>
        </form>

        <div v-if="funcionParseada === null && metodoUsuario !== ''">
            <p :style="{padding: '0.5rem 0', color: '#f44336'}">La función ingresada es incorrecta.</p>
        </div>
        <div v-else :style="{marginTop: '2rem'}">
            <metodo-biseccion v-if="metodoUsuario === 'biseccion'" :funcionUsuario="funcionParseada"/>
            <metodo-falsa-posicion v-if="metodoUsuario === 'falsa-posicion'" :solver="solverObj"/>
        </div>

        <!-- -->
        </div>
    `,
    setup() {
        const funcionUsuario = Vue.ref("");
        const metodoUsuario = Vue.ref("");
        const decimales = Vue.ref(null);

        const funParser = new exprEval.Parser();
        const funcionParseada = Vue.computed(() => {
            const value = funcionUsuario.value;
            try {
                const expr = funParser.parse(value);
                return (x) => expr.evaluate({x})
            } catch (e) {
                return null;
            }
        });

        const solverObj = solver(funcionParseada, decimales);

        return {
            metodoUsuario,
            funcionUsuario,
            funcionParseada,
            decimales,
            solverObj
        }
    }
});
