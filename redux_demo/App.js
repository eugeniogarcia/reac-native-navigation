import React from 'react';

import Books from './src/Books';
import rootReducer from './src/reducers';

import {Provider} from 'react-redux';
import {createStore} from 'redux';

const store = createStore(rootReducer);

export default function App() {
  return (
    <Provider store={store}>
      <Books />
    </Provider>
  );
}