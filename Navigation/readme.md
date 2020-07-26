# Crear el apk

## Con expo

Con este comando hacemos la compilación de nuestro cógigo en una apk android, que se subirá a `expo.io`:

```ps
expo build:android                                                                    
```

Podemos seguir la compilación en el dashboard de expo:

![Expo](./imagenes/build_expo.png)

Tras un tiempo de espera en la cola, se lanzara la compilación:

![compilación](./imagenes/building_expo.png)

## Con React Native

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

```ps
react-native run-android
```