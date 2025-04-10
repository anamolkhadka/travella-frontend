import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';
import NavScroll from './NavScroll';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/hotel';

function HotelDetails({ user, setUser, setIsAuthenticated, setToken }) {
    const { state } = useLocation();
    const navigate = useNavigate();
    const hotel = state?.hotel;
    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(false);

    const handleBack = () => {
        navigate(-1);
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const guestDetails = {
            name: formData.get('name'),
        };
        const email = formData.get('email');
        const checkInDate = formData.get('checkIn');
        const checkOutDate = formData.get('checkOut');
        const adults = formData.get('adults');

        try {
            const response = await axios.post(`${API_URL}/hotels/book`, 
                {
                    email,
                    selectedHotel: hotel,
                    guestDetails,
                    checkInDate,
                    checkOutDate,
                    adults, 
                }, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { bookingId, hotel: hotelName, dates } = response.data;

            // Open mail client with booking confirmation
            const subject = encodeURIComponent(`Booking Confirmation - ${hotelName}`);
            const body = encodeURIComponent(
                `Hello ${guestDetails.name},\n\nThank you for booking with us!\n\n` +
                `Hotel: ${hotelName}\nDates: ${dates}\nBooking ID: ${bookingId}\n\n` +
                `We hope you enjoy your stay!\n\n- Travella Team`
            );
            window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

            // Show success alert
            alert(`✅ Booking confirmed! Confirmation sent to your email.`);

        } catch (error) {
            console.error('Booking error:', error);
            alert('❌ Booking failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!hotel) {
        return <p className="text-center mt-5">Hotel details unavailable.</p>;
    }

    return (
        <div>
            <NavScroll user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken} />
            <Container className="py-5">
                <Button variant="outline-secondary" onClick={handleBack} className="mb-3">
                    ← Back to Search
                </Button>

                <Card className="mb-4 shadow">
                    {hotel.image && (
                        <Card.Img
                            variant="top"
                            src={hotel.image.replace('{height}', '400')}
                            alt={hotel.name}
                            style={{ objectFit: 'cover', maxHeight: '400px' }}
                        />
                    )}
                    <Card.Body>
                        <Card.Title>{hotel.name}</Card.Title>
                        <Card.Text><strong>Price:</strong> {hotel.price}</Card.Text>
                        <Card.Text><strong>Rating:</strong> {hotel.rating} ⭐ ({hotel.reviews} reviews)</Card.Text>
                        <Card.Text><strong>Address:</strong> {hotel.address}</Card.Text>
                        {hotel.url && (
                            <Card.Text>
                                <a href={hotel.url} target="_blank" rel="noopener noreferrer">
                                    Visit Hotel Page
                                </a>
                            </Card.Text>
                        )}
                    </Card.Body>
                </Card>

                <h4>Book This Hotel</h4>
                <Form onSubmit={handleBooking}>
                    <Row className="g-3">
                        <Col md={6}>
                            <Form.Group controlId="name">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control type="text" name="name" required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="email">
                                <Form.Label>Your Email</Form.Label>
                                <Form.Control type="email" name="email" required />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="checkIn">
                                <Form.Label>Check-In Date</Form.Label>
                                <Form.Control type="date" name="checkIn" required />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="checkOut">
                                <Form.Label>Check-Out Date</Form.Label>
                                <Form.Control type="date" name="checkOut" required />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="adults">
                                <Form.Label>Adults</Form.Label>
                                <Form.Control type="number" name="adults" min="1" defaultValue="2" required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button variant="success" type="submit" className="mt-3" disabled={loading}>
                        {loading ? 'Booking...' : 'Confirm Booking'}
                    </Button>
                </Form>
            </Container>
        </div>
        
    );
}

export default HotelDetails;