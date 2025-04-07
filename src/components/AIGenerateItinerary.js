import React from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import NavScroll from './NavScroll';
import axios from 'axios';
import "../styles/Itinerary.css";

const API_URL = "http://localhost:3000";
axios.defaults.withCredentials = true;

function AIGenerateItinerary({ user, setUser, setIsAuthenticated, setToken }) {

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
        };

        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`${API_URL}/itinerary/generate`, itinerary, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            const { message, id, activities } = response.data;
            alert("AI-generated itinerary created successfully!");
            console.log("Generated Itinerary ID:", id);
            console.log("AI Activities:", activities);

            e.target.reset();
        } catch (err) {
            console.error("Error generating itinerary:", err);
            alert("Failed to generate itinerary.");
        }
    };

    return (
    <div>
        <NavScroll user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken} />
        <div className="container py-5">
            <Card>
                <Card.Header as="h3" className="text-center fw-bold create-itinerary-h1">Generate Itinerary with AI</Card.Header>
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

                        <Button variant="primary" type="submit">Generate Itinerary</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    </div>
    );
}

export default AIGenerateItinerary;