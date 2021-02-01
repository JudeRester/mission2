import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './components/login/Login';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  
  return (
    <div className="App">
      <Login setIsLogin={setIsLogin} />
    </div>
  );
}

export default App;
