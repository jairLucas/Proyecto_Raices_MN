/*
Metodos abiertos:
- Punto fijo
- Newton Raphson
- Secante
- Punto de convergencia (?)

Metodos cerrados:
- Bisección
- Falsa posición
- Falsa posición modificada
*/

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
                <option selected disabled>Métodos abiertos</option>
                <option value="punto-fijo">Punto fijo</option>
                <option value="newton-raphson">Newton Raphson</option>
                <option value="secante">Secante</option>
                <option selected disabled>Métodos cerrados</option>
                <option value="biseccion">Bisección</option>
                <option value="falsa-posicion">Falsa posición</option>
            </select>
        </form>

        <div v-if="funcionParseada === null && metodoUsuario !== ''">
            <p :style="{padding: '0.5rem 0', color: '#f44336'}">La función ingresada es incorrecta.</p>
        </div>
        <div v-else :style="{marginTop: '2rem'}">
            <metodo-biseccion v-if="metodoUsuario === 'biseccion'" :funcionUsuario="funcionParseada"/>
            <metodo-falsa-posicion v-if="metodoUsuario === 'falsa-posicion'" :funcionUsuario="funcionParseada"/>
        </div>

        <!-- -->
        </div>
    `,
    setup() {
        const funcionUsuario = Vue.ref("");
        const metodoUsuario = Vue.ref("");

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

        return {
            metodoUsuario,
            funcionUsuario,
            funcionParseada
        }
    }
});
