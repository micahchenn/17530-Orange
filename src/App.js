import React from 'react';
import Login from './login'
import Main from './main'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </Router>
  )
}