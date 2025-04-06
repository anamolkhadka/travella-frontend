// Component to create a new itinerary for a user
import React, { useState, useEffect } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import NavScroll from './NavScroll';
import axios from 'axios';
import "../styles/Itinerary.css";

const API_URL = "http://localhost:3000";
axios.defaults.withCredentials = true;


function UserCreateItinerary() {
  return (
    <div>
      <h1>User Create Itinerary</h1>
      <p>This is the User Create Itinerary component.</p>
    </div>
  );
}
export default UserCreateItinerary;