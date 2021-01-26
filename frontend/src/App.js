import './App.css';
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
  
  //const sessionUser = JSON.parse(sessionStorage.getItem("sessionUser"))
  useEffect(() => {
    if (sessionStorage.getItem("sessionUser")) {
      const sessionUser = JSON.parse(sessionStorage.getItem("sessionUser"));
      if (sessionUser) {
        setLoginedAccount(true);
      }
    }
  },[])

  return (

    <div className="App">
      <Router>
          <Provider store={store}>
            {!loginedAccount && <Login />}
            {loginedAccount && <Main />}
            <Header />
            <Switch>
              <Route exact path="/" component={Login} />
              {/* <Route path="/main" component={Main} /> */}
              <Route path="/upload" component={Upload}/>
            </Switch>
          </Provider>
      </Router>
    </div>


  );
}

// function Main() {
//   const [message, setMessage] = useState("");
//   //console.log(JSON.parse(sessionStorage.getItem("sessionUser")).token); 
//   axios.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.parse(sessionStorage.getItem("sessionUser")).token;
//   useEffect(() => {
//     axios.get(`/api/hello`)
//       .then(response => {
//         console.log(response.data);
//         setMessage(response.data);
//       });
//   }, [])
//   return (
//     <div>
//       <p>{message}</p>
//     </div>
//   )
// }

//export default connect(state를props화)(App);
export default App;
