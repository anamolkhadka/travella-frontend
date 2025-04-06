// This code defines a simple React component for displaying an itinerary.
import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Accordion } from 'react-bootstrap';
import NavScroll from './NavScroll';
import axios from 'axios';
import "../styles/Itinerary.css";

const API_URL = "http://localhost:3000";
axios.defaults.withCredentials = true;

function Itinerary({ user, setUser, setIsAuthenticated, setToken }) {
    const userId = user.id;
    const [itinerary, setItinerary] = useState([]); // Itinerary collection
    const [editItinerary, setEditItinerary] = useState(null); // Itinerary to edit

    // Function to fetch itinerary data for the user.
    const fetchItinerary = async () => {
        const token = localStorage.getItem('token');
        console.log(token)
        try {
            const response = await axios.get(`${API_URL}/itinerary/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Response", response.data);
            setItinerary(response.data);
        } catch (err) {
            console.error('Error fetching itinerary:', err);
            setItinerary([]);
        }
    }
    // Call fetchItinerary when the component mounts
    useEffect(() => {
        fetchItinerary();
    }, []);
    
    // Function to handle itinerary deletion.
    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${API_URL}/itinerary/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Itinerary deleted successfully.');
            // Refresh the itinerary list after deletion
            fetchItinerary();
        } catch (err) {
            alert('Failed to delete the itinerary.');
            console.error('Error deleting itinerary:', err);
        }
    };

    // Function to handle itinerary editing.
    const handleEditButton = (trip) => {
        setEditItinerary(trip);
    }
    
    const handleEditCancel = () => {
        setEditItinerary(null);
    }

    // Function to handle itinerary editing submission.
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData(e.target);
        // Prepare the updated data
        const updatedData = {
            destination: formData.get('destination'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            preferences: {
                style: formData.get('style'),
                budget: formData.get('budget'),
            },
            activities: [],
        };

        // Reconstruct activities from the form
        const activityCount = editItinerary.activities.length;
        for (let i = 0; i < activityCount; i++) {
            // Get the values for each activity
            const day = formData.get(`activity_day_${i}`);
            const activity = formData.get(`activity_name_${i}`);
            const location = formData.get(`activity_location_${i}`);
            const cost = formData.get(`activity_cost_${i}`);
            // Add the activity to the updated data
            updatedData.activities.push({
            day: parseInt(day),
            activity,
            location,
            ...(cost && { cost }) // only include cost if present
            });
        }

        try {
            await axios.put(`${API_URL}/itinerary/update/${editItinerary.id}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Itinerary updated successfully.');
            setEditItinerary(null);
            fetchItinerary();
        } catch (err) {
            alert('Failed to update the itinerary.');
            console.error('Error updating itinerary:', err);
        }
    }

    return (
        <div>
            <NavScroll user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/>
            <div className="itinerary-container container py-5">
                <h1 className="text-center mb-4">My Itineraries</h1>

                {editItinerary ? (
                    <Card className="mb-4">
                        <Card.Header className="fs-4">Edit Itinerary</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleEditSubmit}>
                                <Form.Group controlId="formDestination" className="mb-3">
                                    <Form.Label>Destination</Form.Label>
                                    <Form.Control type="text" name= "destination" defaultValue={editItinerary.destination} required />
                                </Form.Group>

                                <Form.Group controlId="formStartDate" className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="date" name="startDate" defaultValue={editItinerary.startDate} required />
                                </Form.Group>

                                <Form.Group controlId="formEndDate" className="mb-3">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type="date" name="endDate" defaultValue={editItinerary.endDate} required />
                                </Form.Group>

                                <Form.Group controlId="formStyle" className="mb-3">
                                    <Form.Label>Style</Form.Label>
                                    <Form.Control type="text" name="style" defaultValue={editItinerary.preferences.style} required />
                                </Form.Group>

                                <Form.Group controlId="formBudget" className="mb-3">
                                    <Form.Label>Budget</Form.Label>
                                    <Form.Control type="text" name="budget" defaultValue={editItinerary.preferences.budget} required />
                                </Form.Group>

                                <h5 className="mt-4 mb-3 fs-5">Edit Activities</h5>
                                {editItinerary.activities.map((activity, i) => (
                                <div key={i} className="mb-3 p-3 border rounded">
                                    <Form.Group className="mb-2">
                                    <Form.Label>Day</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name={`activity_day_${i}`}
                                        defaultValue={activity.day}
                                    />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                    <Form.Label>Activity</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name={`activity_name_${i}`}
                                        defaultValue={activity.activity}
                                    />
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name={`activity_location_${i}`}
                                        defaultValue={activity.location}
                                    />
                                    </Form.Group>
                                    <Form.Group>
                                    <Form.Label>Cost</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name={`activity_cost_${i}`}
                                        defaultValue={activity.cost || ''}
                                    />
                                    </Form.Group>
                                </div>
                                ))}

                                <Button variant="primary" type="submit" className="mt-5">Save Changes</Button>
                                <Button variant="secondary" className="ms-2 mt-5" onClick={handleEditCancel}>Cancel</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                ) : (
                    <Accordion defaultActiveKey="0">
                        {itinerary.map((trip, index) => (
                            <Accordion.Item eventKey={index.toString()} key={trip.id}>
                                <Accordion.Header>
                                    {trip.destination} — {trip.startDate} to {trip.endDate}
                                </Accordion.Header>
                                <Accordion.Body>
                                    <h5>Style: {trip.preferences.style}</h5>
                                    <h6>Budget: {trip.preferences.budget}</h6>
                                    <ul className="activity-list">
                                        {trip.activities.map((activity, i) => (
                                            <li key={i}>
                                                <strong>Day {activity.day}:</strong> {activity.activity} @ {activity.location}
                                                {activity.cost && ` — ${activity.cost}`}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button variant="outline-primary" onClick={() => handleEditButton(trip)}>Edit</Button>
                                    <Button variant="outline-danger" className="ms-2" onClick={() => handleDelete(trip.id)}>Delete</Button>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                )}
                
                
            </div>
        </div>
        
    );
}

export default Itinerary;