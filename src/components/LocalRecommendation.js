import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavScroll from './NavScroll';


const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const API_URL = 'http://localhost:3000/api';
axios.defaults.withCredentials = true;

function LocalRecommendations({ user, setUser, setIsAuthenticated, setToken }) {
    const [recommendations, setRecommendations] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Load from sessionStorage if available; else fetch using user's default location
    useEffect(() => {
        const stored = sessionStorage.getItem('recommendations');
        if (stored) {
            setRecommendations(JSON.parse(stored));
        } else if (user?.location) {
            const fetchDefault = async () => {
                try {
                    const response = await axios.get(`${API_URL}/recommend/city/${user.location}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    setRecommendations(response.data);
                    sessionStorage.setItem('recommendations', JSON.stringify(response.data));
                } catch (err) {
                    console.error('Error fetching recommendations:', err);
                }
            };
            fetchDefault();
        }
    }, [user, token]);

    // Handle search form submission
    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const location = formData.get('location');
        const preferences = formData.get('preferences');

        try {
            const response = await axios.post(`${API_URL}/recommend/user-preferences`, 
            { location, preferences }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRecommendations(response.data);
            sessionStorage.setItem('recommendations', JSON.stringify(response.data)); // Cache search result
            e.target.reset();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Error fetching search results:', err);
        }
    };

    // Navigate to recommendation details page
    const handleCardClick = (place) => {
        navigate(`/localRecommendation/${place.place_id}`, { state: { place } });
    };

    return (
    <div>
        <NavScroll user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken} />
        <Container className="py-5">
        <h1 className="text-center mb-4 fw-bold">Local Recommendations</h1>

        <Form onSubmit={handleSearch} className="mb-5">
            <Row className="g-3">
            <Col md={5}>
                <Form.Control type="text" name="location" placeholder="Enter a city (e.g., Dallas)" required />
            </Col>
            <Col md={5}>
                <Form.Control type="text" name="preferences" placeholder="e.g. museums, vegan restaurants" required />
            </Col>
            <Col md={2}>
                <Button type="submit" variant="primary" className="w-100">Search</Button>
            </Col>
            </Row>
        </Form>

        <Row className="g-4">
            {recommendations.map((place, index) => (
            <Col md={4} key={index}>
                <Card className="h-100 recommendation-card" onClick={() => handleCardClick(place)}>
                {place.photos && place.photos[0] && (
                    <Card.Img
                    variant="top"
                    src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}`}
                    alt={place.name}
                    />
                )}
                <Card.Body>
                    <Card.Title>{place.name}</Card.Title>
                    <Card.Text className="mb-1"><strong>Address:</strong> {place.formatted_address}</Card.Text>
                    <Card.Text className="mb-1">
                        <strong>Rating:</strong> {place.rating} ✨ ({place.user_ratings_total} reviews)
                    </Card.Text>
                    <Card.Text className="mb-1">
                        <strong>Status:</strong> {place.opening_hours?.open_now ? 'Open Now' : 'Closed'}
                    </Card.Text>
                </Card.Body>
                </Card>
            </Col>
            ))}
        </Row>
        </Container>
    </div>
    );
}

export default LocalRecommendations;
