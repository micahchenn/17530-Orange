import React, { useState } from 'react';
import "./login.css";
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  var isLogin = 0;

  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    let userId = username;
    const response = await axios.post('http://localhost:5000/login', { username, userId, password, isLogin }, { withCredentials: true });
    setErr(response.data.res);
    console.log(response);
    if (response.data.res == "success") {
      navigate('/main');
    }
  }


  return (
    <div style={{ "textAlign": "center" }}>
      <form onSubmit={submitForm}>
        <h1>Sign up / Login</h1>
        <TextField variant="standard" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username..." />
        <br />
        <TextField variant="standard" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password..." />
        <br />
        <Button variant="filled" type="submit" onClick={() => (isLogin = 0)}>Sign Up</Button>
        <br />
        <Button variant="filled" type="submit" onClick={() => (isLogin = 1)}>Login</Button>
      </form>
      <p>{err}</p>
    </div>
  );
};

export default Login;