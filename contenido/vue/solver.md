# API

### `type solver = funcion precision (intervalo = 250) -> retorno`

Establece una interfaz para ejecutar varios métodos.

`type funcion = Vue.ref '((number -> number) | null)`: La función a la cual aplicar el metodo

`type precision = Vue.ref 'number`: La cantidad de decimales de error

`type intevalo = number`: El tiempo que el método espera en cada paso. Por defecto es 250

```
type retorno = {
    setCallbackExito: (any -> ()) -> ()
    setCallbackStep: (any -> ()) -> ()
    setCallbackError: (any -> ()) -> ()
    run: (metodo, ...number) -> () -> ()
}
```

`setCallbackExito`: Agrega un listener para cuando el método encuentre la raíz. 
 Los parámetros de este callback dependen del parámetro `metodo` al llamar a `run`.

`setCallbackStep`: Agrega un listener para cuando el método ejecute un paso del método.
 Los parámetros de este callback dependen del parámetro `metodo` al llamar a `run`.

`setCallbackError`: Agrega un listener para cuando ocurre un error en el método
 Los parámetros de este callback dependen del parámetro `metodo` al llamar a `run`.

`run`: Ejecuta el método `metodo`, pasandole los parametros `...params`. Devuelve una función la 
       cual se usa para cancelar el método.

