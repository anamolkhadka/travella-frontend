import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import './styles/App.css';
import Footer from './components/Footer';

function App() {
  //Handling user data and user authentication state from the frontend.
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // This ensures any update to user, token or isAuthenticated syncs to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
    localStorage.setItem('token', token);
  }, [user, isAuthenticated, token]);  

  return (
    <Router>
      <div className="App">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/>} />
            <Route path="/login" element={<LoginForm setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/>} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/userProfile" element={isAuthenticated ? <UserProfile user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/> : <Navigate to="/login" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
    
  );
}

export default App;
