# Instalar

```ps
npx react-native init redux_demo
```

# Acciones

Dos tipos de acciones:

```js
export const ADD_BOOK = 'ADD_BOOK';
export const REMOVE_BOOK = 'REMOVE_BOOK';
```

Definimos dos acciones - funciones que devuelven una accion. La primera es añadir un libro:

```js
export function addBook(book) {
  return {
    type: ADD_BOOK,
    book: {
      ...book,
      id: uuidv4(),
    },
  };
}
```

La accion tiene un tipo `ADD_BOOK` y el payload lleva los datos que hemos pasado más un id. La accion que elimina un libro es:

```js
export function removeBook(book) {
  return {
    type: REMOVE_BOOK,
    book,
  };
}
```

Esta accion tiene el tipo `REMOVE_BOOK` y el libro como payload.

# Reducers

Los reducers van a transformar el estado cuando reciben una accion:

```js
const bookReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_BOOK:
      return {
        books: [...state.books, action.book],
      };
    case REMOVE_BOOK:
      const index = state.books.findIndex((book) => book.id === action.book.id);
      return {
        books: [
          ...state.books.slice(0, index),
          ...state.books.slice(index + 1)
        ]
      };

    default:
      return state;
  }
};
```

Todos los reducers que hayamos creado se combinan en uno. Con este reducer crearemos nuestro store:

```js
const rootReducer = combineReducers({
  bookReducer,
});

export default rootReducer;
```

# Store

Creamos el store usando el root reducer:

```js
const store = createStore(rootReducer);
```

# Usar redux con react native

Podemos crear un wrapper con redux, de modo que todos los componentes dentro del wrapper puedan hacer uso del store redux:

```js
export default function App() {
  return (
    <Provider store={store}>
      <Books />
    </Provider>
  );
}
```

## Interactuar con redux

Un componente puede interactuar con redux de dos formas:

- Podemos incluir en las `props` del componente información del estado de redux. Cualquier cambio en el estado de redux provocará un re-render del componente

```js
const mapStateToProps = (state) => ({
  books: state.bookReducer.books,
});
```

En este caso hemos incluido la propiedad `books` a nuestras props.

- Podemos añadir al `props` metodos - acciones - de modo que el propio componente pueda actualizar el estado de redux

```js
const mapDispatchToProps = {
  dispatchAddBook: (book) => addBook(book),
  dispatchRemoveBook: (book) => removeBook(book),
};
```

En este caso hemos añadido dos métodos, `dispatchAddBook` y `dispatchRemoveBook`. Finalmente extendemos el componente con las propiedades y los metodos:

```js
export default connect(mapStateToProps, mapDispatchToProps)(Books);
```

Por ejemplo, el componente puede añadir un libro al estado redux:

```js
  addBook = () => {
    this.props.dispatchAddBook(this.state);
    this.setState(initialState);
  };
```

Observemos también como en las props tenemos una propiedad `books`:
```js
  render() {
    const {books} = this.props;
```
