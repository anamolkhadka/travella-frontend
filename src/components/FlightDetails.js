import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';
import NavScroll from './NavScroll';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/booking/flights';

function FlightDetails({ user, setUser, setIsAuthenticated, setToken }) {
    const { state } = useLocation();
    const navigate = useNavigate();
    const flight = state?.flight;
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(false);

    const handleBack = () => {
        navigate(-1);
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const passengerDetails = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            gender: formData.get('gender'),
            dateOfBirth: formData.get('dateOfBirth'),
            contact: {
                email: formData.get('email'),
                phone: formData.get('phone')
            }
        };

        try {
            const response = await axios.post(`${API_URL}/book`, {
                email,
                selectedFlight: flight,
                passengerDetails,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { confirmationCode, flightInfo } = response.data;

            // Email confirmation
            const subject = encodeURIComponent(`Flight Booking Confirmation - ${flightInfo.airline.name}`);
            const body = encodeURIComponent(
                `Dear ${passengerDetails.firstName},\n\nYour flight has been successfully booked!\n\n` +
                `Airline: ${flightInfo.airline.name}\nFlight Number: ${flightInfo.flightNumber}\n` +
                `Departure: ${flightInfo.departure.airport} at ${flightInfo.departure.time}\n` +
                `Arrival: ${flightInfo.arrival.airport} at ${flightInfo.arrival.time}\n` +
                `Booking Confirmation Code: ${confirmationCode}\n\nThank you for choosing Travella!`
            );
            window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

            alert(`✅ Booking confirmed! Confirmation sent to your email.`);
        } catch (error) {
            console.error('Booking failed:', error);
            alert('❌ Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!flight) return <p className="text-center mt-5">Flight details unavailable.</p>;

    const itinerary = flight.itineraries?.[0];
    const segment = itinerary?.segments?.[0];
    const departure = segment?.departure;
    const arrival = segment?.arrival;

    return (
        <div>
            <NavScroll user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken} />
            <Container className="py-5">
                <Button variant="outline-secondary" onClick={handleBack} className="mb-3">
                    ← Back to Search
                </Button>

                <Card className="mb-4 shadow">
                    <Card.Body>
                        <Card.Title className="mb-3">
                            {flight.airline?.name || 'Airline'} - Flight {segment?.carrierCode} {segment?.number}
                        </Card.Title>
                        <Card.Text><strong>Departure:</strong> {departure?.iataCode} at {departure?.at}</Card.Text>
                        <Card.Text><strong>Arrival:</strong> {arrival?.iataCode} at {arrival?.at}</Card.Text>
                        <Card.Text><strong>Duration:</strong> {itinerary?.duration}</Card.Text>
                        <Card.Text><strong>Price:</strong> {flight.price?.currency} {flight.price?.total}</Card.Text>
                        <Card.Text><strong>Seats Available:</strong> {flight.numberOfBookableSeats}</Card.Text>
                    </Card.Body>
                </Card>

                <h4>Book This Flight</h4>
                <Form onSubmit={handleBooking}>
                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Group controlId="firstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="text" name="firstName" required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="lastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="text" name="lastName" required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="phone">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control type="tel" name="phone" required />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group controlId="dateOfBirth">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control type="date" name="dateOfBirth" required />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group controlId="gender">
                                <Form.Label>Gender</Form.Label>
                                <Form.Select name="gender" required>
                                    <option value="">Select</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
                        {loading ? 'Booking...' : 'Confirm Booking'}
                    </Button>
                </Form>
            </Container>
        </div>
    );
}

export default FlightDetails;