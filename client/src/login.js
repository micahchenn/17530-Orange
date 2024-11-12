import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
//import Navbar from './navbarlogin.js';

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
    if (response.data.res === "success") {
      navigate('/main');
    }
  }

  return (
    <>
      {/* <Navbar /> */}
      <div className="login-container">
        <form onSubmit={submitForm} className="login-form">
          <h1 className="login-title">Welcome Back!</h1>
          <TextField
            variant="standard"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username..."
            className="login-input"
          />
          <TextField
            variant="standard"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password..."
            className="login-input"
          />
          <div className="button-container">
            <Button variant="contained" className="form-button" type="submit" onClick={() => (isLogin = 0)}>
              Sign Up
            </Button>
            <Button variant="contained" className="form-button" type="submit" onClick={() => (isLogin = 1)}>
              Login
            </Button>
          </div>
          <p className="error-message">{err}</p>
        </form>
      </div>
    </>
  );
};

export default Login;
