import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import Login, { loginReducer } from './container/login/Login';
import thunk from 'redux-thunk'
import CommandHeader from './container/login/CommandHeader'

const rootReducer = combineReducers({
  loginReducer
})

const store = createStore(rootReducer, applyMiddleware(thunk))

function App() {
  return (

    <div className="App">
      <BrowserRouter>
        <Provider store={store}>
          <CommandHeader/>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/main" component={Main} />
          </Switch>
        </Provider>
      </BrowserRouter>
    </div>


  );
}

function Main() {
  const [message, setMessage] = useState("");
  console.log(JSON.parse(sessionStorage.getItem("sessionUser")).token); 
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.parse(sessionStorage.getItem("sessionUser")).token; 
  useEffect(() => {
    axios.get(`/api/hello`)
      .then(response => {
        console.log(response.data);
        setMessage(response.data);
      });
  }, [])
  return (
    <div>
      <p>{message}</p>
    </div>
  )
}

//export default connect(state를props화)(App);
export default App;
