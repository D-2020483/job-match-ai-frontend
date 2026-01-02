import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from '@/pages/Header.jsx';
import Register from '@/pages/Register.jsx';
import Login from '@/pages/Login.jsx';
import { HomePage } from './pages/Home';
import Job from '@/pages/Job';
import ProfilePage from '@/pages/Profile.jsx';

function App() {
  return (
    <BrowserRouter>
    <Header />
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/jobs" element={<Job />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </main>
    </BrowserRouter>
  )
}

export default App;