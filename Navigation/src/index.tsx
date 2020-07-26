import * as React from 'react';

//Dimensions. Para acceder a las dimensiones de la pantalla. Hay un hook, useWindowDimensions que puede resultar más conveniente
import {
  ScrollView,
  YellowBox,
  Platform,
  StatusBar,
  I18nManager,
  Dimensions,
  ScaledSize,
  Linking,
} from 'react-native';

// eslint-disable-next-line import/no-unresolved
import { enableScreens } from 'react-native-screens';

//Iconos
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  Provider as PaperProvider,
  DefaultTheme as PaperLightTheme,
  DarkTheme as PaperDarkTheme,
  Appbar,
  List,
  Divider,
  Text,
} from 'react-native-paper';

//Core de Navegacion
import {
  InitialState,
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  PathConfigMap,
  NavigationContainerRef,
} from '@react-navigation/native';

//Navegacion con drawer
import {
  createDrawerNavigator,
  DrawerScreenProps,
} from '@react-navigation/drawer';

//Navegacion stack
import {
  createStackNavigator,
  StackScreenProps,
  HeaderStyleInterpolators,
} from '@react-navigation/stack';

import { useReduxDevToolsExtension } from '@react-navigation/devtools';

//Mis modulos
import { restartApp } from './Restart';
import AsyncStorage from './AsyncStorage';
import LinkingPrefixes from './LinkingPrefixes';
import SettingsItem from './Shared/SettingsItem';
import SimpleStack from './Screens/SimpleStack';
import ModalPresentationStack from './Screens/ModalPresentationStack';
import StackTransparent from './Screens/StackTransparent';
import StackHeaderCustomization from './Screens/StackHeaderCustomization';
import BottomTabs from './Screens/BottomTabs';
import MaterialTopTabsScreen from './Screens/MaterialTopTabs';
import MaterialBottomTabs from './Screens/MaterialBottomTabs';
import NotFound from './Screens/NotFound';
import DynamicTabs from './Screens/DynamicTabs';
import MasterDetail from './Screens/MasterDetail';
import AuthFlow from './Screens/AuthFlow';
import PreventRemove from './Screens/PreventRemove';
import CompatAPI from './Screens/CompatAPI';
import LinkComponent from './Screens/LinkComponent';

YellowBox.ignoreWarnings(['Require cycle:', 'Warning: Async Storage']);

enableScreens();

type RootDrawerParamList = {
  Root: undefined;
  Another: undefined;
};

type RootStackParamList = {
  Home: undefined;
  NotFound: undefined;
} & {
  [P in keyof typeof SCREENS]: undefined;
};

//Toda la relación de formas de navegacion que vamos a demostrar
const SCREENS = {
  SimpleStack: { title: 'Simple Stack', component: SimpleStack },
  ModalPresentationStack: {
    title: 'Modal Presentation Stack',
    component: ModalPresentationStack,
  },
  StackTransparent: {
    title: 'Transparent Stack',
    component: StackTransparent,
  },
  StackHeaderCustomization: {
    title: 'Header Customization in Stack',
    component: StackHeaderCustomization,
  },
  BottomTabs: { title: 'Bottom Tabs', component: BottomTabs },
  MaterialTopTabs: {
    title: 'Material Top Tabs',
    component: MaterialTopTabsScreen,
  },
  MaterialBottomTabs: {
    title: 'Material Bottom Tabs',
    component: MaterialBottomTabs,
  },
  DynamicTabs: {
    title: 'Dynamic Tabs',
    component: DynamicTabs,
  },
  MasterDetail: {
    title: 'Master Detail',
    component: MasterDetail,
  },
  AuthFlow: {
    title: 'Auth Flow',
    component: AuthFlow,
  },
  PreventRemove: {
    title: 'Prevent removing screen',
    component: PreventRemove,
  },
  CompatAPI: {
    title: 'Compat Layer',
    component: CompatAPI,
  },
  LinkComponent: {
    title: '<Link />',
    component: LinkComponent,
  },
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const NAVIGATION_PERSISTENCE_KEY = 'NAVIGATION_STATE';
const THEME_PERSISTENCE_KEY = 'THEME_TYPE';

export default function App() {
  //Estado para elegir the theme
  const [theme, setTheme] = React.useState(DefaultTheme);
  //Este estado nos dice si estamos ya listos o no
  const [isReady, setIsReady] = React.useState(Platform.OS === 'web');
  //Usar typescript para indicar el tipo de este estado
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();

  //Usamos useEffect para recuperar valores del almacenamiento local y actualizar el estado de la aplicación
  React.useEffect(() => {
    //Definimos la función que restaura el estado...
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== 'web' || initialUrl === null) {
          
          const savedState = await AsyncStorage.getItem(
            NAVIGATION_PERSISTENCE_KEY
          );

          const state = savedState ? JSON.parse(savedState) : undefined;
          //Actualizamos el estado con lo recuperado del almacenamiento local
          if (state !== undefined) {
            //Guardamos el estado
            setInitialState(state);
          }
        }
      } finally {
        try {
          //Obtenemos el theme del almacenamiento local
          const themeName = await AsyncStorage.getItem(THEME_PERSISTENCE_KEY);
          //Consideramos dos themes, dark y el resto
          //Acutalizamos el estado, con el theme
          setTheme(themeName === 'dark' ? DarkTheme : DefaultTheme);
        } catch (e) {
          // Ignore
        }

        setIsReady(true);
      }
    };
    //... y la ejecutamos
    restoreState();
    //Siempre que cambie cualquier cosa del estado
  }, []);

  //Usa Memo para que paperThem solo se actualice cuando las propieades colors o darke del theme cambie. Sino paperTheme no se cambiara
  const paperTheme = React.useMemo(() => {
    const t = theme.dark ? PaperDarkTheme : PaperLightTheme;

    return {
      ...t,
      colors: {
        ...t.colors,
        ...theme.colors,
        surface: theme.colors.card,
        accent: theme.dark ? 'rgb(255, 55, 95)' : 'rgb(255, 45, 85)',
      },
    };
  }, [theme.colors, theme.dark]);

  //Define otro estado con las dimensiones. El valor sera las dimensiones de la ventana
  const [dimensions, setDimensions] = React.useState(Dimensions.get('window'));

  //Define otro useEffect que se ejecutara cuando cambie alguno de los estados. La diferencia con el otro UseEffect es que hemos añadido un estado más. Esto hace que el primer useEffect no se ejecute cuando cambie el estado de la dimesión
  //Tambien es interesante porque al retornar el useEffect un método, lo que estamos indicando es que cuando se destruya el recurso se ejecute este método - para liberar los recursos.
  //Registramos un listener que sigue los cambios en la dimension de la ventana. El listener cambiara el estado de la dimensión cuando se cambien la dirección
  React.useEffect(() => {
    const onDimensionsChange = ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
    };

    //Nos subscribimos al evento de cambio de las dimensiones de la ventana
    Dimensions.addEventListener('change', onDimensionsChange);

    return () => Dimensions.removeEventListener('change', onDimensionsChange);
  }, []);

  //Otro componente interesante. Aquí usamos un hook para crear una referencia, esto es, una variable mutable. Podremos hacer navigationRef.current para leer o cambiar el valor. Cuando cambiemos el valor no hace un re-render
  const navigationRef = React.useRef<NavigationContainerRef>(null);

  useReduxDevToolsExtension(navigationRef);

  if (!isReady) {
    return null;
  }

  const isLargeScreen = dimensions.width >= 1024;

  //Interesante como comprobamos en que plataforma estamos para renderizar algunas cosas o no
  //Especificamos que la referencia al DOM sea nuestro navigationRef
  //Tiene un initialState que guardamos en nuestro almacenamiento local
  
  return (
    <PaperProvider theme={paperTheme}>
      {Platform.OS === 'ios' && (
        <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      )}
      <NavigationContainer
        ref={navigationRef}
        initialState={initialState}
        onStateChange={(state) =>
          AsyncStorage.setItem(
            NAVIGATION_PERSISTENCE_KEY,
            JSON.stringify(state)
          )
        }
        theme={theme}
        linking={{
          // To test deep linking on, run the following in the Terminal:
          // Android: adb shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:19000/--/simple-stack"
          // iOS: xcrun simctl openurl booted exp://127.0.0.1:19000/--/simple-stack
          // Android (bare): adb shell am start -a android.intent.action.VIEW -d "rne://127.0.0.1:19000/--/simple-stack"
          // iOS (bare): xcrun simctl openurl booted rne://127.0.0.1:19000/--/simple-stack
          // The first segment of the link is the the scheme + host (returned by `Linking.makeUrl`)
          prefixes: LinkingPrefixes,
          config: {
            screens: {
              Root: {
                path: '',
                initialRouteName: 'Home',
                screens: Object.keys(SCREENS).reduce<PathConfigMap>(
                  (acc, name) => {
                    // Convert screen names such as SimpleStack to kebab case (simple-stack)
                    const path = name
                      .replace(/([A-Z]+)/g, '-$1')
                      .replace(/^-/, '')
                      .toLowerCase();

                    acc[name] = {
                      path,
                      screens: {
                        Article: {
                          path: 'article/:author?',
                          parse: {
                            author: (author) =>
                              author.charAt(0).toUpperCase() +
                              author.slice(1).replace(/-/g, ' '),
                          },
                          stringify: {
                            author: (author: string) =>
                              author.toLowerCase().replace(/\s/g, '-'),
                          },
                        },
                        Albums: 'music',
                        Chat: 'chat',
                        Contacts: 'people',
                        NewsFeed: 'feed',
                        Dialog: 'dialog',
                      },
                    };

                    return acc;
                  },
                  {
                    Home: '',
                    NotFound: '*',
                  }
                ),
              },
            },
          },
        }}
        fallback={<Text>Loading…</Text>}
        documentTitle={{
          formatter: (options, route) =>
            `${options?.title ?? route?.name} - React Navigation Example`,
        }}
      >
        <Drawer.Navigator drawerType={isLargeScreen ? 'permanent' : undefined}>
          <Drawer.Screen
            name="Root"
            options={{
              title: 'Examples',
              drawerIcon: ({ size, color }) => (
                <MaterialIcons size={size} color={color} name="folder" />
              ),
            }}
          >
            {({ navigation }: DrawerScreenProps<RootDrawerParamList>) => (
              <Stack.Navigator
                screenOptions={{
                  headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
                }}
              >
                <Stack.Screen
                  name="Home"
                  options={{
                    title: 'Examples',
                    headerLeft: isLargeScreen
                      ? undefined
                      : () => (
                          <Appbar.Action
                            color={theme.colors.text}
                            icon="menu"
                            onPress={() => navigation.toggleDrawer()}
                          />
                        ),
                  }}
                >
                  {({ navigation }: StackScreenProps<RootStackParamList>) => (
                    <ScrollView
                      style={{ backgroundColor: theme.colors.background }}
                    >
                      <SettingsItem
                        label="Right to left"
                        value={I18nManager.isRTL}
                        onValueChange={() => {
                          I18nManager.forceRTL(!I18nManager.isRTL);
                          restartApp();
                        }}
                      />
                      <Divider />
                      <SettingsItem
                        label="Dark theme"
                        value={theme.dark}
                        onValueChange={() => {
                          AsyncStorage.setItem(
                            THEME_PERSISTENCE_KEY,
                            theme.dark ? 'light' : 'dark'
                          );

                          setTheme((t) => (t.dark ? DefaultTheme : DarkTheme));
                        }}
                      />
                      <Divider />
                      {(Object.keys(SCREENS) as (keyof typeof SCREENS)[]).map(
                        (name) => (
                          <List.Item
                            key={name}
                            testID={name}
                            title={SCREENS[name].title}
                            onPress={() => navigation.navigate(name)}
                          />
                        )
                      )}
                    </ScrollView>
                  )}
                </Stack.Screen>
                <Stack.Screen
                  name="NotFound"
                  component={NotFound}
                  options={{ title: 'Oops!' }}
                />
                {(Object.keys(SCREENS) as (keyof typeof SCREENS)[]).map(
                  (name) => (
                    <Stack.Screen
                      key={name}
                      name={name}
                      getComponent={() => SCREENS[name].component}
                      options={{ title: SCREENS[name].title }}
                    />
                  )
                )}
              </Stack.Navigator>
            )}
          </Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
