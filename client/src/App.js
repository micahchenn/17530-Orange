import React from 'react';
import "./App.css";

function App() {
  return (
    <div style={{"text-align" : "center"}}>
      <form>
        <h1>Sign up</h1>      
        <input type="text" placeholder="Username..."/>
        <br />
        <input type="password" placeholder="Password..."/>
        <br />
        <button onClick={displayMessage}>Sign Up</button>
      </form>
    </div>
  );
}

function displayMessage() {
  console.log("JavaScript is initialized!");
}

export default App;