import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import axios from 'axios';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import Login, { loginReducer } from './container/login/Login';
import thunk from 'redux-thunk'
import Header from './container/commons/Header';
import Upload from './container/upload/Upload';
import Main from './container/commons/Main';

const rootReducer = combineReducers({
  loginReducer
})


const store = createStore(rootReducer, applyMiddleware(thunk))
function App() {
  const [loginedAccount, setLoginedAccount] = useState(false);

  return (
    <div className="App">
       <Router>
          <Provider store={store}>
            {/* {!loginedAccount && <Login/>} */}
            <Header />
            <Switch>
              <Route exact path="/" component={Login} />
              <Route path="/main" component={Main} />
              <Route path="/upload" component={Upload}/>
            </Switch>
          </Provider>
      </Router>
    </div>
  );
}

export default App;
