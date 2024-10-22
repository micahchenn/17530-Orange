import React from 'react';
import "./login.css";
import {useState} from 'react';

export default function loginApp(){ 

  const [userInput, setUserInput] = useState('');
  
  const [passInput, setPassInput] = useState('');

  let userChange = (event) => {
    setUserInput(event.target.value);
  }

  let passChange = (event) => {
    setPassInput(event.target.value);
  }

  let submitForm = () => {
    console.log("user: " + userInput + ", pass: " + passInput);
  }

  return (
    <div style={{"textAlign" : "center"}}>
      <form onSubmit={submitForm}>
        <h1>Sign up</h1>      
        <input type="text" value={userInput} onChange={userChange} placeholder="Username..."/>
        <br />
        <input type="password" value={passInput} onChange={passChange} placeholder="Password..."/>
        <br />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}