# Introduction

This app covers some of the most-used cross-platform components and how to implement each one as you build a demo application. For this purpose we’ll implement the following cross-platform components and APIs by building a cross-platform Star Wars information app:

- Fetch API
- Modal
- ActivityIndicator
- FlatList
- Picker
- React-Navigation

# Comentarios

## App.js

Creamos un navegador con dos `screens`, una para el componente `StarWars` y otra con el componente `People`:

```js
const RootStack = createStackNavigator({
  Home: {
    screen: StarWars,
  },
  People: {
    screen: People,
  },
});

const App = createAppContainer(RootStack);
```

El componente `StarWars` esta definido en el propio archivo. Esta definido como una clase. La clase no tiene un constructor. Especificamos las propiedades del navegador con `static navigationOptions`:

```js
static navigationOptions = {
```

Definimos un método que nos permite navegar usando el `navegator`:

```js
navigate = (link) => {
    const {navigate} = this.props.navigation;
    navigate(link);
  };
```

Lo que renderizamos es un componente llamado `Container` - usaremos `Container` en otros componentes. Lo unico que hace `Container` es crear una `View` con todos los children. El children que especificamos es un `FlatList`. 

```js
render() {
    return (
      <Container>
        <FlatList
          data={links}
          keyExtractor={(item) => item.title}
          renderItem={this.renderItem}
        />
      </Container>
    );
  }
```

Con `FlatList` indicamos:

- `data`. Los datos que vamos a listar
- `keyExtractor`. El key que usaremos con cada item
- `renderItem`. Una funcion que crea como se visualizará cada item

Lo que hacemos es visualizar cada item con su `title`:

```js
renderItem = ({item, index}) => {
    return (
        <TouchableHighlight onPress={() => this.navigate(item.title)}
        style={[styles.item, {borderTopWidth: index === 0 ? 1 : null}]}>
            <Text style={styles.text}>{item.title}</Text>
        </TouchableHighlight>
    );
};
```

Los datos que vamos a incluir en el `FlatList` son:

```js
const links = [
  {title: 'People'},
  {title: 'Films'},
  {title: 'StarShips'},
  {title: 'Vehicles'},
  {title: 'Species'},
  {title: 'Planets'},
];
```

## People.js

Componente estateful:

```js
export default class People extends Component {
static navigationOptions = {
    headerTitle: 'People',
    headerStyle: {
      borderBottomWidth: 1,
```

Define un estado:

```js
  state = {
    data: [],
    loading: true,
    modalVisible: false,
    gender: 'all',
    pickerVisible: false,
  };
```

Cuando el componente se monta, se hace una llamada a la api, y guarda los datos en el estado:

```js
  componentDidMount() {
    fetch('https://swapi.dev/api/people/')
      .then((res) => res.json())
      .then((json) => this.setState({data: json.results, loading: false}))
      .catch((err) => console.log('err:', err));
  }
```

Tenemos una serie de métodos que actualizan el estado:

```js
  openHomeWorld = (url) => {
    this.setState({
      url,
      modalVisible: true,
    });
  };

  closeModal = () => {
    this.setState({modalVisible: false});
  };

  togglePicker = () => {
    this.setState({pickerVisible: !this.state.pickerVisible});
  };

  filter = (gender) => {
    this.setState({gender});
  };
```

El primer componente que se incluye nos muestra el estado del picker, y lo podemos cambiar usando `togglePicker`:


```js
<TouchableHighlight
    style={styles.pickerToggleContainer}
    onPress={this.togglePicker}>
    <Text style={styles.pickerToggle}>
    {this.state.pickerVisible ? 'Close Filter' : 'Open Filter'}
    </Text>
</TouchableHighlight>
```

Mientras se cargan los datos se muestra el indicador de actividad. Cuando el estado cambia, se muestr la lista con los datos:

```js
{this.state.loading ? (
    <ActivityIndicator color="#ffe81f" />
) : (
    <FlatList
    data={data}
    keyExtractor={(item) => item.name}
    renderItem={this.renderItem}
    />
)}
```

Lo siguiente es el componente que nos permite ir al mundo. Cuando esta visible se muestra el componente `HomeWorld`:

```js
<Modal
    onRequestClose={() => console.log('onrequest close called')}
    animationType="slide"
    transparent={false}
    visible={this.state.modalVisible}>
    <HomeWorld closeModal={this.closeModal} url={this.state.url} />
</Modal>
```

Finalmente implementamos la selección del filtro:

```js
{this.state.pickerVisible && (
    <View style={styles.pickerContainer}>
    <Picker
        style={{backgroundColor: '#ffe81f'}}
        selectedValue={this.state.gender}
        onValueChange={(item) => this.filter(item)}>
        <Picker.Item
        itemStyle={{color: 'yellow'}}
        label="All"
        value="all"
        />
        <Picker.Item label="Males" value="male" />
        <Picker.Item label="Females" value="female" />
        <Picker.Item label="Other" value="n/a" />
    </Picker>
    </View>
)}
```

## Homeworld.js

Se trata de un componente stateful que recupera los datos de un determinado planeta, desde la url que se le pasa en las props:

```js
class HomeWorld extends React.Component {
  state = {
    data: {},
    loading: true,
  };
```

```js
  componentDidMount() {
    if (!this.props.url) {
      return;
    }
    const url = this.props.url.replace(/^http:\/\//i, 'https://');
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        this.setState({data: json, loading: false});
      })
      .catch((err) => console.log('err:', err));
  }
```

Para cerrar el componente usamos el método pasado en el props, que actualiza el estado del componente padre, `People`:

```js
<Text style={styles.closeButton} onPress={this.props.closeModal}> Close Modal
```

# Construye la apk

```ps
react-native bundle --platform android --dev false --entry-file index.js --bundle-output ./android/app/src/main/assets/index.android.bundle --assets-dest ./android/app/src/main/res
```

Borrar los directorios `drawable`:

```ps
rmdir .\android\app\src\main\res\drawable* -r
```

```ps
cd android

./gradlew clean 

./gradlew assembleRelease
```

La apk estará en `.\android\app\build\outputs\apk\release`.


