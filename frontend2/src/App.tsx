import React, {  } from 'react';
// import './App.css';
import rootReducer from './modules'
import { createStore, applyMiddleware, Middleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'
import { Provider } from 'react-redux';
import Pages from './components'
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const middlewares: Middleware[] = []
  const middlewareEnhancer = applyMiddleware(...middlewares)

  const enhancers = [middlewareEnhancer]
  const composedEnhancers = composeWithDevTools(...enhancers)

  

function App() {

  const store = createStore(rootReducer,
    //, devTools
    composedEnhancers
  )
  
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
