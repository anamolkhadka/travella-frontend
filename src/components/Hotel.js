import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavScroll from './NavScroll';

const API_URL = 'http://localhost:3000/api/hotel';

function Hotels({ user, setUser, setIsAuthenticated, setToken }) {
    const [hotels, setHotels] = useState(() => {
        const saved = sessionStorage.getItem('hotelResults');
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchHotels = async (location, checkin, checkout, adults) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/hotels/search`, {
                params: {
                    location,
                    checkin_date: checkin,
                    checkout_date: checkout,
                    adults: parseInt(adults),
                }, 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const hotelData = response.data.data;
            setHotels(hotelData);
            sessionStorage.setItem('hotelResults', JSON.stringify(hotelData));
            sessionStorage.setItem('hotelSearch', JSON.stringify({ location, checkin, checkout, adults }));
        } catch (err) {
            console.error('Error fetching hotels:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const location = formData.get('location');
        const checkin = formData.get('checkin');
        const checkout = formData.get('checkout');
        const adults = formData.get('adults') || 2;

        fetchHotels(location, checkin, checkout, adults);
        e.target.reset();
    };

    const handleHotelClick = (hotel) => {
        const searchInfo = sessionStorage.getItem('hotelSearch');
        navigate(`/searchHotels/${hotel.id}`, { state: { hotel, searchInfo: JSON.parse(searchInfo) } });
    };

    return (
        <div>
            <NavScroll user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken} />
            <Container className="py-5">
            <h1 className="text-center mb-4 fw-bold">Search Hotels</h1>

                <Form onSubmit={handleSubmit} className="mb-5">
                    <Row className="g-3 align-items-end">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Location</Form.Label>
                                <Form.Control type="text" name="location" placeholder="e.g. New York" required />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>Check-In</Form.Label>
                                <Form.Control type="date" name="checkin" required />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>Check-Out</Form.Label>
                                <Form.Control type="date" name="checkout" required />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>Adults</Form.Label>
                                <Form.Control type="number" name="adults" min={1} defaultValue={2} required />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Button type="submit" variant="primary" className="w-100">Search</Button>
                        </Col>
                    </Row>
                </Form>
                
                {loading && (
                    <div className="text-center my-4">
                        <Spinner animation="border" role="status" />
                        <p className="mt-2">Searching hotels...</p>
                    </div>
                )}
                {!loading && hotels.length > 0 && (
                    <Row className="g-4">
                        {hotels.map((hotel, idx) => (
                            <Col md={4} key={idx}>
                                <Card className="h-100 shadow-sm" onClick={() => handleHotelClick(hotel)} style={{ cursor: 'pointer' }}>
                                    {hotel.image && (
                                        <Card.Img
                                            variant="top"
                                            src={hotel.image.replace('{height}', '400')}
                                            alt={hotel.name}
                                        />
                                    )}
                                    <Card.Body>
                                        <Card.Title>{hotel.name}</Card.Title>
                                        <Card.Text><strong>Address:</strong> {hotel.address}</Card.Text>
                                        <Card.Text><strong>Price:</strong> {hotel.price}</Card.Text>
                                        <Card.Text><strong>Rating:</strong> {hotel.rating} ({hotel.reviews} reviews)</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
        
    );
}

export default Hotels;