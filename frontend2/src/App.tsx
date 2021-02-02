import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './components/login/Login';
import rootReducer from './modules'
import { createStore } from 'redux';
import { Provider, useDispatch } from 'react-redux';
import Pages from './components'
import { BrowserRouter, Route } from 'react-router-dom';
import { login } from './modules/member';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // const devTools =
  //   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
  const store = createStore(rootReducer
    //, devTools
  )
  const token = localStorage.getItem('token');
  
  return (
    <div className="App">
      <BrowserRouter>
        <Provider store={store}>
          <Pages />
        </Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
