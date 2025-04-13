import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavScroll from './NavScroll';

const API_URL = 'http://localhost:3000/api/booking';

function Flights({ user, setUser, setIsAuthenticated, setToken }) {
    const [flights, setFlights] = useState(() => {
        const saved = sessionStorage.getItem('flightResults');
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchFlights = async (origin, destination, departureDate, adults) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/flights/search`, {
                params: { origin, destination, departureDate, adults },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const flightData = response.data.data;
            setFlights(flightData);
            sessionStorage.setItem('flightResults', JSON.stringify(flightData));
            sessionStorage.setItem('flightSearch', JSON.stringify({ origin, destination, departureDate, adults }));
        } catch (error) {
            console.error("Error fetching flights:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const origin = form.get('origin');
        const destination = form.get('destination');
        const departureDate = form.get('departureDate');
        const adults = form.get('adults') || 1;

        fetchFlights(origin, destination, departureDate, adults);
        e.target.reset();
    };

    const handleFlightClick = (flight) => {
        const searchInfo = sessionStorage.getItem('flightSearch');
        navigate(`/bookFlight/${flight.id}`, { state: { flight, searchInfo: JSON.parse(searchInfo) } });
    };

    const formatTime = iso => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formatDate = iso => new Date(iso).toLocaleDateString();

    return (
        <div>
            <NavScroll user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken} />
            <Container className="py-5">
                <h1 className="text-center mb-4 fw-bold">Search Flights</h1>

                <Form onSubmit={handleSubmit} className="mb-5">
                    <Row className="g-3 align-items-end">
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>From (Origin)</Form.Label>
                                <Form.Control type="text" name="origin" placeholder="e.g. DAL" required />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>To (Destination)</Form.Label>
                                <Form.Control type="text" name="destination" placeholder="e.g. LAX" required />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Departure Date</Form.Label>
                                <Form.Control type="date" name="departureDate" required />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>Adults</Form.Label>
                                <Form.Control type="number" name="adults" min={1} defaultValue={1} />
                            </Form.Group>
                        </Col>
                        <Col md={1}>
                            <Button type="submit" variant="primary" className="w-100">Search</Button>
                        </Col>
                    </Row>
                </Form>

                {loading && (
                    <div className="text-center my-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Searching flights...</p>
                    </div>
                )}

                {!loading && flights.length > 0 && (
                    <Row className="g-4">
                        {flights.map((flight, idx) => {
                            const segment = flight.itineraries[0].segments[0];
                            return (
                                <Col md={6} key={idx}>
                                    <Card className="shadow-sm h-100" style={{ cursor: 'pointer' }} onClick={() => handleFlightClick(flight)}>
                                        <Card.Body>
                                            <Card.Title className="fw-bold mb-3">
                                                {segment.departure.iataCode} → {segment.arrival.iataCode}
                                            </Card.Title>
                                            <Card.Text>
                                                <strong>Airline:</strong> {flight.airline.name || flight.airline.iata} <br />
                                                <strong>Flight:</strong> {segment.carrierCode} {segment.number} <br />
                                                <strong>Departure:</strong> {formatDate(segment.departure.at)} @ {formatTime(segment.departure.at)} <br />
                                                <strong>Arrival:</strong> {formatDate(segment.arrival.at)} @ {formatTime(segment.arrival.at)} <br />
                                                <strong>Duration:</strong> {flight.itineraries[0].duration.replace("PT", "").toLowerCase()} <br />
                                                <strong>Seats Left:</strong> {flight.numberOfBookableSeats} <br />
                                                <strong>Total Price:</strong> {flight.price.currency} {flight.price.total}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </Container>
        </div>
    );
}

export default Flights;