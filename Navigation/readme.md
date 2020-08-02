# Crear el apk

## Limpiar la cache

Expo tiene una cache de paquetes. Si vieramos que actualizamos el package.json y que expo insiste en tomar una versión diferente de la seleccionada, podemos limpiar la cache:

```ps
expo r -c
```

## Usando expo

Con este comando hacemos la compilación de nuestro cógigo en una apk android, que se subirá a `expo.io`:

```ps
expo build:android                                                                    
```

Podemos seguir la compilación en el dashboard de expo:

![Expo](./imagenes/build_expo.png)

Tras un tiempo de espera en la cola, se lanzara la compilación:

![compilación](./imagenes/building_expo.png)

## Usando React Native

### Pre-requisitos

Usamos el React Native CLI. react-native-cli esta deprecado. Tenemos que desinstalar el viejo:

```ps
npm uninstall -g react-native-cli
```

E instalar el nuevo:

```ps
npm i -g @react-native-community/cli
```

Creamos el template de nuestra aplicación:

```ps
npx react-native init navegacion 
```

O con typescript:

```ps
npx react-native init navegacion --template react-native-template-typescript
```

### Compilación

```ps
react-native run-android
```

# Comentarios

## Article

```js
import { useScrollToTop, useTheme } from '@react-navigation/native';
```

```js
const ref = React.useRef<ScrollView>(null);
```

```js
<ScrollView
      ref={ref}
      style={{ backgroundColor: colors.card }}
      contentContainerStyle={styles.content}
      {...rest}
    >
```

```js
useScrollToTop(ref);
```

## Index

### Theme

Para usar un theme, la definición del theme viene con react-native:

```js
import {
  InitialState,
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  PathConfigMap,
  NavigationContainerRef,
} from '@react-navigation/native';
```

Guardamos el them en el estado:

```js
 const [theme, setTheme] = React.useState(DefaultTheme);
 ```

Cambiar el theme no es más que:

```js 
setTheme((t) => (t.dark ? DefaultTheme : DarkTheme));
```

Podemos memorizar le theme, para que la siguiente vez que abramos la aplicación tenga el mismo setup:

```js
AsyncStorage.setItem(THEME_PERSISTENCE_KEY, theme.dark ? 'light' : 'dark');
```

### Right to Left

```js
import {I18nManager,} from 'react-native';
```

```js
I18nManager.forceRTL(!I18nManager.isRTL);
restartApp();
```

Podemos saber si es RtL o no como sigue:

```js
I18nManager.isRTL
```

## PreventRemove

En este caso vamos a demostrar como utilizar los distintos métodos de `navigation` para controlar como se nevega entre pantallas:

- Los métodos habituales:
    - `navigation.push('input')`. Navega a una nueva instancia de una screen, en este caso la llamada `input`
    - `navigation.pop()`. Vuelve a la instancia previa en la navegacion, y elimina la ultima instancia 
    - `navigation.goback()`. Navega hacía atrás en la historia
    - `navigation.popToTop()`. Navega hasta la raiz del navigator
    - `navigation.dispatch(action)`. Este es el método base que se utiliza en todas las navegaciones anteriores. Hay una serie de acciones definidas por defecto, y podemos tambien definir acciones custom

### navigation.dispatch & eventos de navigation

Podemos despachar una acción. Hay una serie de acciones estandard definidas en react y que estan tipificadas como `NavigationAction`. Podemos extender la acción añadiendo datos extra. Por ejemplo, podemos definir un bloque de datos que incluya un tipo nuevo opcional `payload?` que incluya un argumento opcional `confirmed?`:

```js
const action: NavigationAction & { payload?: { confirmed?: boolean } } 
```

En el listener del evento, tendremos esta action en `e.data.action`:

```js
navigation.addListener('beforeRemove', (e) => {
    const action: NavigationAction & { payload?: { confirmed?: boolean } } = e.data.action;
```

Con este snippet estamos subscribiendonos an un evento de navigator, en este caso lo que estamos diciendo es que antes de eliminar una instancia de una screen - antes de salir -, vemos cual es la action asociada al evento. En este caso usaremos la propiedad que hemos creado custom en la acción para ver si hemos confirmado que queremos salir `action.payload?.confirmed`, en caso de que no sea así, interceptamos el evento, `e.preventDefault()` - como haríamos con cualquier evento. En este ejemplo le preguntaremos al usuario con un Alert, y en caso de que confirme, continuamos con el dispatch de la acción `navigation.dispatch(action)`:

```js
if (!hasUnsavedChanges || action.payload?.confirmed) {
    return;
}

e.preventDefault();

Alert.alert(
    'Discard changes?',
    'You have unsaved changes. Are you sure to discard them and leave the screen?',
    [
    { text: "Don't leave", style: 'cancel', onPress: () => {} },
    {
        text: 'Discard',
        style: 'destructive',
        onPress: () => navigation.dispatch(action),
    },
    ]
);
```

El set-up del evento lo hacemos en el useEffect del navegador:

```js
  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
          ...
      }),
    [hasUnsavedChanges, navigation]
  );
```

Notese que solo se ejecuta el effect cuando han cambiado las props `[hasUnsavedChanges, navigation]`. A la hora de hacer una navegacion, por ejemplo, un `goback`, podemos usar el método dispatch para poder especificar un payload junto con el `goback`:

```js
onPress={() =>
    navigation.dispatch({
    ...CommonActions.goBack(),
    payload: { confirmed: true },
    })
}
```

Vemos como efectivamente usamos la acction estandar para navegar hacia atrás, `CommonActions.goBack()`, pero que le pasamos nuestro payload. En este ejemplo, cuando navegasemos hacia atras con este botón no preguntaríamos al usuario antes de salir de la instancia de screen. Si usaramos el botón goback del header, como este viene a hacer un `navigation.goback()`, preguntaremos al usuario antes de abandonar la screen.

### Tipificar las rutas

En este ejemplo tambien demostramos como tipificar - estamos usando typescript - las rutas. 

1. Creamos un tipo nuevo que define las rutas de nuestra navegacion. En este caso estamos diciendo que habría dos rutas, una llamada `Article` que tendría un parametro string llamado author, y otra llamada `Input` que no tienen parametros definidos - al indicar `undefined` decimos que la ruta no tiene parametros. Si hicieramos `CualquierTipo | undefined` significa que el parametro es opcional.

```js
type PreventRemoveParams = {
  Article: { author: string };
  Input: undefined;
};
```

2. Al definir las screens, especificamos el tipo de parametros, y el nombre de la ruta - en este caso la llamada `Article` - que se usocia a esta screen:

```js
const ArticleScreen = ({navigation,route,}: StackScreenProps<PreventRemoveParams,'Article'>) => {
  return (
```

3. En el snipet anterior hemos visto que cada screen esta también tipificada, `StackScreenProps` en nuestro caso

4. Al crear el navegador especificamos el tipo de las rutas en el template: 

```js
//Crea una navegacion Stack usando el tipo que definimos arriba
const SimpleStack = createStackNavigator<PreventRemoveParams>();
```

```js
    <SimpleStack.Navigator>
      <SimpleStack.Screen name="Input" component={InputScreen} />
      <SimpleStack.Screen name="Article" component={ArticleScreen} />
    </SimpleStack.Navigator>
```

## AuthFlow

Patron tipico utilizado para implementar una secuencia de login, logout.

- Demuestra el uso de un contexto. El contexto se gestiona en el navegador - `<AuthContext.Provider value={authContext}>`-, de modo que todas las Screens tiene acceso al contexto. El contexto incluye dos métodos, login y logout
- El navegador implementa un estado con useReducer. El estado se actualiza con los métodos del contexto. De esta forma las screens pueden usar el contexto para actualizar el estado del navegador. Cuando eso suceda el navegador re-renderizará todas las screens
- Demuestra como usar useEffect y useLayout para decidir que hacer cuando el navegador se ha contruido y es visible. 
- Al crearse el navegador se usa conditional rendering para determinar que Screen mostrar - es un Stack Navigator. 

```js
<AuthContext.Provider value={authContext}>
      <SimpleStack.Navigator
        screenOptions={{
          headerLeft: () => (
            <HeaderBackButton onPress={() => navigation.goBack()} />
          ),
        }}
      >
        {state.userToken === undefined ? (
          <SimpleStack.Screen
            name="SignIn"
            options={{
              title: 'Sign in',
              animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
            component={SignInScreen}
          />
        ) : (
          <SimpleStack.Screen
            name="Home"
            options={{ title: 'Home' }}
            component={HomeScreen}
          />
        )}
      </SimpleStack.Navigator>
    </AuthContext.Provider>
```

## BottomTabs

Creamos el navegador:

```js
const BottomTabs = createBottomTabNavigator<BottomTabParams>();
```

Hemos especificado las siguientes rutas:

```js
type BottomTabParams = {
  Article: undefined;
  Albums: undefined;
  Contacts: undefined;
  Chat: undefined;
};
```

Con esto ya podemos definir el componente que define el navegador:

```js
export default function BottomTabsScreen({
  navigation,
  route,
}: StackScreenProps<ParamListBase, string>) {
```

El componente extrae las propiedades `navigation` y `route` de las props. El tipo sera un template de `StackScreenProps`, esto es un props. Como usamos navigator y route, tenemos que indicar el tipo de cada uno. El tipo será `ParamListBase` para `navigator` y string para route.

Definimos una de las screens:

```js
const AlbumsScreen = ({
  navigation,
}: BottomTabScreenProps<BottomTabParams>) => {
```

Aquí hemos tipificado las props del tipo `BottomTabScreenProps`, y especificamente el navigator con las rutas que hemos definido al principio.

El resto de screens que usaremos en el navegador son comunes a varios tipos de navegadores y no hacen uso de `navigator`. En el caso de los albums, hemos creado la screen `AlbumsScreen`, que usa unos props del tipo `BottomTabScreenProps`, y luego, apenas incluimos los botones que usan la navegación, e incluimos el componente Albums, que reutilizamos en otras navegaciones.

Podemos ocultar y visualizar los tabs:

```js
navigation.setOptions({ tabBarVisible: false })}
```

```js
onPress={() => navigation.setOptions({ tabBarVisible: true })}
```

Podemos asociar a cada tab un icono:

```js
<BottomTabs.Screen
  name="Contacts"
  component={Contacts}
  options={{
    title: 'Contacts',
    tabBarIcon: getTabBarIcon('contacts'),
  }}
/>
```

También podemos incluir un badge junto con el icono:

```js
<BottomTabs.Screen
    name="Chat"
    component={Chat}
    options={{
      tabBarLabel: 'Chat',
      tabBarIcon: getTabBarIcon('message-reply'),
      tabBarBadge: 2,
    }}
```

### Especifica el título basado en la ruta

Podemos usar `getFocusedRouteNameFromRoute` para obtener el nombre de la ruta. En useEffect fijamos con `navigation` el titulo:

```js
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Article';

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: routeName,
    });
  }, [navigation, routeName]);
```

## MaterialBottomTabs

Es muy parecido al BottomTabs, pero con el theme de Material UI:

```js
const MaterialBottomTabs = createMaterialBottomTabNavigator<
  MaterialBottomTabParams
>();
```

```js
type MaterialBottomTabParams = {
  Article: undefined;
  Albums: undefined;
  Contacts: undefined;
  Chat: undefined;
};
```

```js
<MaterialBottomTabs.Screen
name="Article"
component={SimpleStackScreen}
options={{
    tabBarLabel: 'Article',
    tabBarIcon: 'file-document-box',
    tabBarColor: '#C9E7F8',
}}
/>
```

Vemos como en el `options` especificamos el `tabBarIcon`.

## DynamicTabs

En este ejemplo vamos a crear tabs de forma dinámica.

Creamos un navegador `createBottomTabNavigator`. Las rutas no estan prefijadas, seran un array de keys - que son strings - sin parametros - undefined:

```js
type BottomTabParams = {
  [key: string]: undefined;
};
```

```js
const BottomTabs = createBottomTabNavigator<BottomTabParams>();
```

Creamos ahora el componente navegador:

```js
export default function BottomTabsScreen() {
  const [tabs, setTabs] = React.useState([0, 1]);

  return (
    <BottomTabs.Navigator>
```

El componente no hace uso de ninguna props. Hemos creado también un estado que contiene un array con el número de cada tab. Creamos un `<BottomTabs.Screen` para cada uno de los elementos del array. Se actualizamos el estado, se actualizarán también las tabs.

## MasterDetail

Creamos un drawer navigator:

```js
const Drawer = createDrawerNavigator<DrawerParams>();
```

Los parametros son:

```js
type DrawerParams = {
  Article: undefined;
  NewsFeed: undefined;
  Albums: undefined;
};
```

Definimos el componente root del navegador como:

```js
export default function DrawerScreen({ navigation, ...rest }: Props) {
```

El tipo `Props` es:

```js
type Props = Partial<React.ComponentProps<typeof Drawer.Navigator>> & 
  StackScreenProps<ParamListBase>;
```

Esto es tiene las propiedades del `navigator` de un drawer, más las parametros de un `StackScreenProps<ParamListBase>` que tiene nuestras rutas.

En el `useEffect` especificamos las opciones de nuestro navegador:

```js
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
    });
  }, [navigation]);
```

Por defecto especificamos una serie de propiedades que serán comunes para todas las ventanas:

```js
    <Drawer.Navigator openByDefault 
      drawerType={isLargeScreen ? 'permanent' : 'back'}
      drawerStyle={isLargeScreen ? null : { width: '100%' }}
      overlayColor="transparent"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      {...rest}
    >
```

- Un boton que nos lleva hacia atrás, con un incono
- El titulo

```js
const CustomDrawerContent = (
  props: DrawerContentComponentProps<DrawerContentOptions>
) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <>
      <Appbar.Header style={{ backgroundColor: colors.card, elevation: 1 }}>
        <Appbar.Action icon="close" onPress={() => navigation.goBack()} />
        <Appbar.Content title="Pages" />
      </Appbar.Header>
      <DrawerContent {...props} />
    </>
  );
};
```

## ModalPresentation

En este ejemplo tenemos un stack navigator, pero a medida que vamos navegando de una pantalla a otra, lo que haremos es visualizarlas una sobre la otra, como si fueran pantallas modales. Los pasos son analogos a los que hemos visto en los casos anteriores, creamos nuestro navegador:

```js
const ModalPresentationStack = createStackNavigator<ModalStackParams>();
```

Las rutas:

```js
type ModalStackParams = {
  Article: { author: string };
  Albums: undefined;
};
```

A la hora de definir las propiedades del navegador es donde hacemos la configuración que nos muestra las pantallas de forma modal:

```js
    <ModalPresentationStack.Navigator
      mode="modal"
      screenOptions={({ route, navigation }) => ({
        ...TransitionPresets.ModalPresentationIOS,
        cardOverlayEnabled: true,
        gestureEnabled: true,
        headerStatusBarHeight:
          navigation.dangerouslyGetState().routes.indexOf(route) > 0
            ? 0
            : undefined,
      })}
      {...options}
    >
```

La screen de articulos, usa el navigator y route. Fijemonos en como se definen sus tipos:

```js
const ArticleScreen = ({ navigation,route,}: StackScreenProps<ModalStackParams, 'Article'>) => {
```

Al navegar a un articulo:

```js
onPress={() => navigation.push('Article', { author: 'Babel fish' })}
```

