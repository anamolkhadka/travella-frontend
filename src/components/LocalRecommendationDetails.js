import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import NavScroll from './NavScroll';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function LocalRecommendationDetails({ user, setUser, setIsAuthenticated, setToken }) {
    const location = useLocation();
    const navigate = useNavigate();
    const place = location.state?.place;

    if (!place) {
    return (
        <Container className="text-center mt-5">
            <h4>Place not found. Please go back and try again.</h4>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
        </Container>
    );
    }

    const photoUrl = place.photos?.[0]
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
    : null;

    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.formatted_address)}`;

    return (
    <div>
        <NavScroll user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken} />
        <Container className="py-5">
        <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-4">
            ← Back to Recommendations
        </Button>

        <Card className="p-3 shadow">
            {photoUrl && (
            <Card.Img
                src={photoUrl}
                alt={place.name}
                style={{ objectFit: 'cover', height: '300px', borderRadius: '12px' }}
                className="mb-3"
            />
            )}
            <Card.Body>
                <Card.Title className="fs-3 fw-bold">{place.name}</Card.Title>
                <Card.Text className="text-muted mb-2">{place.formatted_address}</Card.Text>
                <Card.Text><strong>Rating:</strong> {place.rating} ⭐ ({place.user_ratings_total} reviews)</Card.Text>
                <Card.Text><strong>Status:</strong> {place.opening_hours?.open_now ? 'Open Now' : 'Closed'}</Card.Text>
                <Card.Text><strong>Types:</strong> {place.types?.join(', ')}</Card.Text>
                <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary mt-3"
                >
                    View on Google Maps
                </a>
            </Card.Body>
        </Card>
        </Container>
    </div>
    );
}

export default LocalRecommendationDetails;
