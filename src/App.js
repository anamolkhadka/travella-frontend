import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import Itinerary from './components/Itinerary';
import UserCreateItinerary from './components/UserCreateItinerary';
import AIGenerateItinerary from './components/AIGenerateItinerary';
import WeatherUpdates from './components/WeatherUpdates';
import FlightUpdates from './components/FlightUpdates';
import LocalRecommendations from './components/LocalRecommendation';
import LocalRecommendationDetails from './components/LocalRecommendationDetails';
import Hotels from './components/Hotel';
import HotelDetails from './components/HotelDetails';
import HotelBookings from './components/HotelBookings';
import Flights from './components/Flights';
import FlightDetails from './components/FlightDetails';
import FlightBookings from './components/FlightBookings';
import UserExpenses from './components/UserExpenses';
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
            <Route path="/userItinerary" element={isAuthenticated ? <Itinerary user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/> : <Navigate to="/login" />} />
            <Route path="/createItinerary" element={isAuthenticated ? <UserCreateItinerary user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/> : <Navigate to="/login" />} />
            <Route path="/generateItinerary" element={isAuthenticated ? <AIGenerateItinerary user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/> : <Navigate to="/login" />} />
            <Route path="/weatherUpdates" element={<WeatherUpdates user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/>} />
            <Route path="/flightUpdates" element={<FlightUpdates user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/>} />
            <Route path="/localRecommendation" element={isAuthenticated ? <LocalRecommendations user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/> : <Navigate to="/login" />} />
            <Route path="/localRecommendation/:placeId" element={isAuthenticated ? <LocalRecommendationDetails user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/> : <Navigate to="/login" />} />
            <Route path="/searchHotels" element={isAuthenticated ? <Hotels user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/> : <Navigate to="/login" />} />
            <Route path="/searchHotels/:hotelId" element={isAuthenticated ? <HotelDetails user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/> : <Navigate to="/login" />} />
            <Route path="/hotelBookings" element={isAuthenticated ? <HotelBookings user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/> : <Navigate to="/login" />} />
            <Route path="/searchFlights" element={isAuthenticated ? <Flights user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/> : <Navigate to="/login" />} />
            <Route path="/bookFlight/:id" element={isAuthenticated ? <FlightDetails user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/> : <Navigate to="/login" />} />
            <Route path="/flightBookings" element={isAuthenticated ? <FlightBookings user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/> : <Navigate to="/login" />} />
            <Route path="/userExpenses" element={isAuthenticated ? <UserExpenses user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/> : <Navigate to="/login" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
    
  );
}

export default App;
