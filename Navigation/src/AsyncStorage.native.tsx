import { AsyncStorage } from 'react-native';

//Devuelve el AsyncStorage nativo, cuando se ejecuta el método en android o ios
/*
On iOS, AsyncStorage is backed by native code that stores small values in a serialized dictionary and larger values in separate files. On Android, AsyncStorage will use either RocksDB or SQLite based on what is available.
*/
export default AsyncStorage;
