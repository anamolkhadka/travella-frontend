import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import NavScroll from './NavScroll';
import axios from 'axios';
import "../styles/Itinerary.css";

const API_URL = "http://localhost:3000";

function FlightUpdates({ user, setUser, setIsAuthenticated, setToken }) {
    const [flights, setFlights] = useState([]);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = {
            flightNumber: formData.get('flightNumber'),
            date: formData.get('date'),
            from: formData.get('from'),
            to: formData.get('to'),
        };

        try {
            const response = await axios.post(`${API_URL}/travel-updates/flight`, payload);
            setFlights(response.data.flights);
            setError("");
        } catch (err) {
            setFlights([]);
            setError(err.response?.data?.error || "Something went wrong.");
        }
    };

    return (
        <div>
            <NavScroll user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken} />
            <Container className="py-5">
                <Card className="mb-4">
                    <Card.Header as="h3" className="text-center fw-bold create-itinerary-h1">Check Flight Updates</Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                <Form.Label>Flight Number</Form.Label>
                                <Form.Control type="text" name="flightNumber" required placeholder="e.g., DL839" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                <Form.Label>Date</Form.Label>
                                <Form.Control type="date" name="date" required />
                                <Form.Text className="text-muted">
                                    *Must be within 10 days past or 2 days ahead
                                </Form.Text>
                                </Form.Group>
                            </Col>
                            </Row>
                            <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                <Form.Label>From (IATA Code)</Form.Label>
                                <Form.Control type="text" name="from" required placeholder="e.g., DFW" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                <Form.Label>To (IATA Code)</Form.Label>
                                <Form.Control type="text" name="to" required placeholder="e.g., ATL" />
                                </Form.Group>
                            </Col>
                            </Row>

                            <Button type="submit" variant="primary">Get Flight Info</Button>
                        </Form>
                    </Card.Body>
                </Card>

                {error && <Alert variant="danger">{error}</Alert>}

                {flights.map((flight, index) => (
                    <Card key={index} className="mb-4">
                    <Card.Header as="h5">{flight.ident_iata} — {flight.status}</Card.Header>
                    <Card.Body>
                        <p><strong>Operator:</strong> {flight.operator_iata}</p>
                        <p><strong>Aircraft:</strong> {flight.aircraft_type}</p>
                        <p><strong>Route:</strong> {flight.origin.city} ({flight.origin.code_iata}) ➜ {flight.destination.city} ({flight.destination.code_iata})</p>
                        <p><strong>Scheduled Departure:</strong> {new Date(flight.scheduled_out).toLocaleString()}</p>
                        <p><strong>Actual Departure:</strong> {new Date(flight.actual_off).toLocaleString()}</p>
                        <p><strong>Scheduled Arrival:</strong> {new Date(flight.scheduled_in).toLocaleString()}</p>
                        <p><strong>Actual Arrival:</strong> {new Date(flight.actual_on).toLocaleString()}</p>
                        <p><strong>Gate Info:</strong> From Gate {flight.gate_origin}, Terminal {flight.terminal_origin} ➜ To Gate {flight.gate_destination}, Terminal {flight.terminal_destination}</p>
                    </Card.Body>
                    </Card>
                ))}
            </Container>
        </div>
    );
}

export default FlightUpdates;
