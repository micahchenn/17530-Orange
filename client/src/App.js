import React, {useState, useEffect} from 'react';
import "./App.css";
import axios from 'axios'

export default function App(){ 

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [err, setErr] = useState("");
  var isLogin = 0;

  const submitForm = async (e) => {
    e.preventDefault();
    const response = await axios.post('/login', {username, userId, password, isLogin});
    setErr(response.data.res);
    console.log(response);
  }


  return (
    <div style={{"textAlign" : "center"}}>
      <form onSubmit={submitForm}>
        <h1>Sign up / Login</h1>      
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username..."/>
        <br />
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="UserId..."/>
        <br />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password..."/>
        <br />
        <button type="submit" onClick={() => (isLogin = 0)}>Sign Up</button>
        <br />
        <button type="submit" onClick={() => (isLogin = 1)}>Login</button>
      </form>
      <p>{err}</p>
    </div>
  );
}