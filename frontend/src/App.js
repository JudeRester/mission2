import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import axios from 'axios';
import { connect } from 'react-redux';

function App(props) {
  return (
    <div className="App">
      hi
      <p>{props.shoe[0].name}</p>
    </div>
  );
}

function state를props화(state){
  return {
    shoe : state
  }
}
export default connect(state를props화)(App);
//xport default App;
