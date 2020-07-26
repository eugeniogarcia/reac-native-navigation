import * as React from 'react';
import { View, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { Title, Button } from 'react-native-paper';
import { useTheme, ParamListBase } from '@react-navigation/native';
import {
  createStackNavigator,
  HeaderBackButton,
  StackScreenProps,
} from '@react-navigation/stack';

type AuthStackParams = {
  Splash: undefined;
  Home: undefined;
  SignIn: undefined;
  PostSignOut: undefined;
};

const AUTH_CONTEXT_ERROR =
  'Authentication context not found. Have your wrapped your components with AuthContext.Consumer?';

//Creamos un contexto. El contexto tiene dos metodos que retorna void
const AuthContext = React.createContext<{
  signIn: () => void;
  signOut: () => void;
}>({
  signIn: () => {
    throw new Error(AUTH_CONTEXT_ERROR);
  },
  signOut: () => {
    throw new Error(AUTH_CONTEXT_ERROR);
  },
});

const SplashScreen = () => {
  return (
    <View style={styles.content}>
      <ActivityIndicator />
    </View>
  );
};

const SignInScreen = () => {
  //Hacemos uso del hook que accede al contexto. Nos quedamos con el método signIn
  const { signIn } = React.useContext(AuthContext);
  const { colors } = useTheme();

  return (
    <View style={styles.content}>
      <TextInput
        placeholder="Username"
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.text },
        ]}
      />
      <Button mode="contained" onPress={signIn} style={styles.button}>
        Sign in
      </Button>
    </View>
  );
};

const HomeScreen = () => {
  const { signOut } = React.useContext(AuthContext);

  return (
    <View style={styles.content}>
      <Title style={styles.text}>Signed in successfully 🎉</Title>
      <Button onPress={signOut} style={styles.button}>
        Sign out
      </Button>
    </View>
  );
};

const SimpleStack = createStackNavigator<AuthStackParams>();

type State = {
  isLoading: boolean;
  isSignout: boolean;
  userToken: undefined | string;
};

//Acciones que usaremos para gestionar el estado conun reducer
type Action =
  | { type: 'RESTORE_TOKEN'; token: undefined | string }
  | { type: 'SIGN_IN'; token: string }
  | { type: 'SIGN_OUT' };

//Este componente tiene un wrapper con el poveedor del contexto. De este modo todos los componentes hijos pueden acceder al mismo contexto, el que hemos creado arriba
export default function SimpleStackScreen({
  navigation,
}: StackScreenProps<ParamListBase>) {
  //Usamos el  hook useReducer para actualizar el estado. Toma el estado inicial, la acción, y obtiene un estado final
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: undefined,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: undefined,
    }
  );

  //Usa un hook que cuando se visualiza el componente en el DOM, cada segundo hace un reduce de modo que el token se limpia. Cuando se destruye el componente, se elimina la gestión del time-out
  React.useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'RESTORE_TOKEN', token: undefined });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  //Con este effect, actualizamos las opciones del la ventana, en concreto oculte el header. Este efecto solo se ejecuta cuando cambia navigation, se recrea
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  //El contexto se recrea cuando cambia alguna de las propiedades
  const authContext = React.useMemo(
    () => ({
      signIn: () => dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' }),
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
    }),
    []
  );

  if (state.isLoading) {
    return <SplashScreen />;
  }

  return (
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
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    margin: 8,
    padding: 10,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  button: {
    margin: 8,
  },
  text: {
    textAlign: 'center',
    margin: 8,
  },
});
