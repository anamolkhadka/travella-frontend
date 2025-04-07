import React, { useState } from 'react';
import { Button, Form, Card, Container } from 'react-bootstrap';
import NavScroll from './NavScroll';
import axios from 'axios';
import "../styles/Itinerary.css";

const API_URL = "http://localhost:3000";
axios.defaults.withCredentials = true;

function WeatherUpdates({ user, setUser, setIsAuthenticated, setToken }) {
  const [weather, setWeather] = useState(null);

  // Handles form submission and fetches weather based on user input
  const handleSubmit = async (e) => {

    e.preventDefault();
    const formData = new FormData(e.target);
    const city = formData.get('city');
    const country = formData.get('country');
    ///const token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${API_URL}/travel-updates/weather`, { city, country });
      setWeather(response.data);
    } catch (err) {
      console.error("Error fetching weather:", err);
      alert("Failed to get weather data.");
    }
  };

return (
    <div>
      <NavScroll user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken} />
      <Container className="py-5">
        <Card className="mb-4">
          <Card.Header as="h3" className="text-center fw-bold create-itinerary-h1">Check Weather Updates</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" name="city" required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Country Code (e.g. US, NP)</Form.Label>
                <Form.Control type="text" name="country" required />
              </Form.Group>

              <Button type="submit" variant="primary">Get Weather</Button>
            </Form>
          </Card.Body>
        </Card>

        {weather && (
          <Card className="text-center shadow">
            <Card.Body>
              <Card.Title>{weather.name}, {weather.sys.country}</Card.Title>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
              <h4>{weather.weather[0].main} - {weather.weather[0].description}</h4>
              <p><strong>Temperature:</strong> {weather.main.temp}°C (Feels like {weather.main.feels_like}°C)</p>
              <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
              <p><strong>Wind:</strong> {weather.wind.speed} m/s</p>
              <p><strong>Pressure:</strong> {weather.main.pressure} hPa</p>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default WeatherUpdates;
