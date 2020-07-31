import * as React from 'react';
import {
  Alert,
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { Button } from 'react-native-paper';
import {
  useTheme,
  CommonActions,
  ParamListBase,
  NavigationAction,
} from '@react-navigation/native';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';
import Article from '../Shared/Article';

/*
Los stacknavigators incluyen una definición para typescrpt en la que se define el tipo. El tipo es un objeto en el que se incluye para cada ruta, la definición de los argumentos de la ruta

En este caso estamos diciendo que habría dos rutas, una Article que tendría un parametro string llamado author, y otra llamada Input que no tienen parametros definidos

Specifying undefined means that the route doesn't have params. An union type with undefined (SomeType | undefined) means that params are optional.

After we have defined the mappings, we need to tell our navigator to use it. To do that, we can pass it as a generic to the createXNavigator functions:

const RootStack = createStackNavigator<RootStackParamList>();
*/
type PreventRemoveParams = {
  Article: { author: string };
  Input: undefined;
};

const scrollEnabled = Platform.select({ web: true, default: false });

/*Definimos las dos screens que vamos a incluir en la stack navigation

Las Props estan tipificadas, y en este caso las hemos tipificado con PreventRemoveParams. Para tipificar cada ruta en el generico tenemos que especificar el tipo de las rutas, seguido con el nombre de nuestra ruta concreta. En este caso para esta screen queremos que la ruta sea Article 
*/
/* 
En la navegacion demostramos alguno de los métodos
*/
const ArticleScreen = ({navigation,route,}: StackScreenProps<PreventRemoveParams,'Article'>) => {
  return (
    <ScrollView>
      <View style={styles.buttons}>
        <Button
          mode="contained"
          onPress={() => navigation.push('Input')}
          style={styles.button}
        >
          Push Input
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.popToTop()}
          style={styles.button}
        >
          Pop to top
        </Button>
      </View>
      <Article
        author={{ name: route.params?.author ?? 'Unknown' }}
        scrollEnabled={scrollEnabled}
      />
    </ScrollView>
  );
};

//En esta otra screen tipificamos también los Props. Notese que el tipo para las rutas es el mismo, pero que indicamos que nuestra ruta aqué es Input
//Cuando queramos navegar a una determinada screen, la ruta y sus argumentos estan tipificados, y el intellisense los reconoce
/*
Añadimos un listener a la navegación para saber cuando estamos saliendo de la screen

Vemos como navegar usando dispatch. Dispatch toma como argumento a Navigation Action. Hay una serie de ellas predefinidas. Otros metodos que hacen la navegacion, como push, usan dispatch por detras.
*/
const InputScreen = ({
  navigation,
}: StackScreenProps<PreventRemoveParams, 'Input'>) => {
  const [text, setText] = React.useState('');
  const { colors } = useTheme();

  const hasUnsavedChanges = Boolean(text);

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {

        //Definimos action como una NavigationAction extendida con una propiedad payload opcional, que es de un tipo que tiene confirmed opcinal como tipo boolean
        //El valor lo toma del evento de navegacion. 
        const action: NavigationAction & { payload?: { confirmed?: boolean } } =
          e.data.action;

        //Si no hay nada pendiente de grabar, sigue su curso y sale de la screen
        if (!hasUnsavedChanges || action.payload?.confirmed) {
          return;
        }

        //En caso contrario no termina la navegación...
        e.preventDefault();

        //...y mostramos un mensaje
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
      }),
    [hasUnsavedChanges, navigation]
  );

  return (
    <View style={styles.content}>
      <TextInput
        autoFocus
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
        value={text}
        placeholder="Type something…"
        onChangeText={setText}
      />
      <Button
        mode="outlined"
        color="tomato"
        onPress={() =>
          navigation.dispatch({
            ...CommonActions.goBack(),
            payload: { confirmed: true },
          })
        }
        style={styles.button}
      >
        Discard and go back
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.push('Article', { author: text })}
        style={styles.button}
      >
        Push Article
      </Button>
    </View>
  );
};

//Crea una navegacion Stack usando el tipo que definimos arriba
const SimpleStack = createStackNavigator<PreventRemoveParams>();

//define el tipo de las Props de un Stack navigator. Aqui estamos diciendo que el tipo sea el base. No tendremos en el route parametros especificos custom de la navegacion
type Props = StackScreenProps<ParamListBase>;

export default function SimpleStackScreen({ navigation }: Props) {

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  //Vemos como tenemos dos rutas, las dos que definimos en el tipo que usamos para crear este stack navigator
  return (
    <SimpleStack.Navigator>
      <SimpleStack.Screen name="Input" component={InputScreen} />
      <SimpleStack.Screen name="Article" component={ArticleScreen} />
    </SimpleStack.Navigator>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
  },
  input: {
    margin: 8,
    padding: 10,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  buttons: {
    flexDirection: 'row',
    padding: 8,
  },
  button: {
    margin: 8,
  },
});
