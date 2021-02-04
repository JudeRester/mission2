import React, {  } from 'react';
import './App.css';
import rootReducer from './modules'
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Pages from './components'
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // const devTools =
  //   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
  const store = createStore(rootReducer
    //, devTools
  )
  console.log(store.getState())
  
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
