import {AppRegistry} from 'react-native';

//import App from './animaciones/AnimatedTiming';
//import App from './animaciones/AnimatedInput';
//import App from './animaciones/AnimatedLoop';
//import App from './animaciones/AnimatedParallel';
//import App from './animaciones/AnimatedSequence';
import App from './animaciones/AnimatedStagger';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
