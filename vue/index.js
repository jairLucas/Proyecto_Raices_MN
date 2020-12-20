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
        setCallbackExito: f => callbackExito = f,
        setCallbackStep: f => callbackStep = f,
        setCallbackError: f => callbackError = f,
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
            }, ...params);
            return cancelarMetodoFn;
        }
    };
};

app.component("menu-seleccion", {
    template: `
        <div>
        <h1>Calculadora</h1>
        <hr>

        <div :style="estilos['contenedor-entrada-grafica']">
            <form @submit.prevent>
                <label for="entrada-funcion">Ingresa la función:</label>
                <br>
                <input v-model="funcionUsuario" type="text" id="entrada-funcion" placeholder="x^3 - 2*x + 5">
                <br>
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
                <br>
                <label for="decimales-max">Decimales de error: </label>
                <br>
                <input type="number" id="decimales-max" v-model.number="decimales" min="1" max="6">
                <br>
            </form>
            <div class="grafica" :style="estilos['grafica']">
                <div id="vsplitter">
                    <div id="wrapper">
                        <div id="graph_wrapper">
                            <canvas id="graph"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Para hacer que el computed de Vue reaccione -->
        <div style="display: none">{{ funcionParseada }}</div>
        <div :style="{marginTop: '2rem'}">
            <metodo-cerrado-abstracto v-if="metodoUsuario === 'biseccion'"
                                      :solver="solverObj"
                                      :metodo="biseccion"/>
            <metodo-cerrado-abstracto v-else-if="metodoUsuario === 'falsa-posicion'"
                                      :solver="solverObj"
                                      :metodo="falsaPosicion"/>
            <metodo-cerrado-abstracto v-else-if="metodoUsuario === 'falsa-posicion-modificada'"
                                      :solver="solverObj"
                                      :metodo="falsaPosicionModificado"/>
            <metodo-newton-raphson v-else-if="metodoUsuario === 'newton-raphson'"
                                   :solver="solverObj"
                                   :funcionParseada="funcionParseada"/>
            <!--
            <metodo-biseccion v-if="metodoUsuario === 'biseccion'" :solver="solverObj"/>
            <metodo-falsa-posicion v-else-if="metodoUsuario === 'falsa-posicion'" :solver="solverObj"/>
            -->
        </div>

        <!-- -->
        </div>
    `,
    setup() {
        const estilos = {
            "contenedor-entrada-grafica": {
                display: "grid",
                gridTemplateColumns: "40vw auto"
            },
            "grafica": {
                height: "50vh",
                width: "50vw",
                overflow: "hidden"
            }
        };
        const funcionUsuario = Vue.ref("");
        const metodoUsuario = Vue.ref("");
        const decimales = Vue.ref(null);

        const funcionParseada = vueStringAFuncion(funcionUsuario);

        const solverObj = solver(funcionParseada, decimales);

        // Actualizar los callbacks del solver para evitar errores
        Vue.watch("metodoUsuario", () => {
            solverObj.setCallbackExito(console.log);
            solverObj.setCallbackStep(console.log);
            solverObj.setCallbackError(console.error);
        });

        return {
            estilos,
            metodoUsuario,
            funcionUsuario,
            funcionParseada,
            decimales,
            solverObj,
            // metodos
            biseccion,
            falsaPosicion,
            falsaPosicionModificado
        }
    }
});
