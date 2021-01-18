import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  useEffect(() => {
    axios.post('http://localhost:8080/api/authenticate', {
      "username": "root",
      "password": "12345"
    }).then((response) => {
      console.log(response);
    })
  },[]
  )

  const [message, setMessage] = useState("");
  useEffect(() => {
    //setInterval(() => {
      fetch('/api/hello')
        .then(response => response.text())
        .then(message => {
          setMessage(message);
        });
    //}, 500);

  }, [])
  
  return (
    <div className="App">
      <header className="App-header">
        <p>
          {message}
        </p>
      </header>
    </div>
  );
}

export default App;
