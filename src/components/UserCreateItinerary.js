// Component to create a new itinerary for a user
import React, { useState, useEffect } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import NavScroll from './NavScroll';
import axios from 'axios';
import "../styles/Itinerary.css";

const API_URL = "http://localhost:3000";
axios.defaults.withCredentials = true;


function UserCreateItinerary({ user, setUser, setIsAuthenticated, setToken }) {
    // State to store dynamic list of activity objects
    const [activities, setActivities] = useState([
        { day: 1, activity: '', location: '', cost: '' }
    ]);

    // Adds a new blank activity to the list with incremented day value.
    const handleAddActivity = () => {
        setActivities([...activities, { day: activities.length + 1, activity: '', location: '', cost: '' }]);
    };
    
    /**
     * Updates the specific field in an activity object at the given index.
     * @param {number} index - Index of the activity in the list.
     * @param {string} field - Field name to update (day, activity, location, cost).
     * @param {string} value - New value for the field.
    */
    const handleActivityChange = (index, field, value) => {
        const newActivities = [...activities];
        newActivities[index][field] = value;
        setActivities(newActivities);
    };
    
    /**
     * Submits the itinerary form by collecting form data and activities,
     * then makes a POST request to the backend API.
     * On success, resets the form and activity list.
    */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const itinerary = {
            userId: user.id,
            destination: formData.get('destination'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            preferences: {
                style: formData.get('style'),
                budget: formData.get('budget'),
            },
            activities,
        };
  
        const token = localStorage.getItem('token');
        try {
            await axios.post(`${API_URL}/itinerary/create`, itinerary, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            alert("Itinerary created successfully!");
            e.target.reset();
            setActivities([{ day: 1, activity: '', location: '', cost: '' }]);
        } catch (err) {
            console.error("Error creating itinerary:", err);
            alert("Failed to create itinerary.");
        }
    };
  
    return (
    <div>
        <NavScroll user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken} />
        <div className="container py-5">
          <Card>
            <Card.Header as="h3" className="text-center fw-bold create-itinerary-h1">Create New Itinerary</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Destination</Form.Label>
                  <Form.Control type="text" name="destination" required />
                </Form.Group>
  
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control type="date" name="startDate" required />
                </Form.Group>
  
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control type="date" name="endDate" required />
                </Form.Group>
  
                <Form.Group className="mb-3">
                  <Form.Label>Travel Style</Form.Label>
                  <Form.Control type="text" name="style" placeholder="e.g. Cultural, Adventure" required />
                </Form.Group>
  
                <Form.Group className="mb-4">
                  <Form.Label>Budget</Form.Label>
                  <Form.Control type="text" name="budget" placeholder="e.g. medium, luxury" required />
                </Form.Group>
  
                <h5 className="fw-bold mb-3">Activities</h5>
                {activities.map((activity, index) => (
                  <Card className="mb-3 p-3" key={index}>
                    <Form.Group className="mb-2">
                      <Form.Label>Day</Form.Label>
                      <Form.Control
                        type="number"
                        value={activity.day}
                        onChange={(e) => handleActivityChange(index, 'day', e.target.value)}
                        min="1"
                        required
                      />
                    </Form.Group>
  
                    <Form.Group className="mb-2">
                      <Form.Label>Activity</Form.Label>
                      <Form.Control
                        type="text"
                        value={activity.activity}
                        onChange={(e) => handleActivityChange(index, 'activity', e.target.value)}
                        required
                      />
                    </Form.Group>
  
                    <Form.Group className="mb-2">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        value={activity.location}
                        onChange={(e) => handleActivityChange(index, 'location', e.target.value)}
                        required
                      />
                    </Form.Group>
  
                    <Form.Group className="mb-2">
                      <Form.Label>Cost (Optional)</Form.Label>
                      <Form.Control
                        type="text"
                        value={activity.cost}
                        onChange={(e) => handleActivityChange(index, 'cost', e.target.value)}
                      />
                    </Form.Group>
                  </Card>
                ))}
  
                <Button variant="outline-secondary" onClick={handleAddActivity} className="mb-3">+ Add Another Activity</Button>
                <br />
                <Button variant="primary" type="submit">Create Itinerary</Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
    </div>
    );
  }
  
  export default UserCreateItinerary;