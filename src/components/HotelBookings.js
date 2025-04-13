import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import NavScroll from './NavScroll';
import jsPDF from 'jspdf';

const API_URL = 'http://localhost:3000/api/hotel/hotels/bookings';
axios.defaults.withCredentials = true;

function HotelBookings({ user, setUser, setIsAuthenticated, setToken }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userId = user?.id;
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`${API_URL}/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBookings(response.data);
            } catch (err) {
                console.error('Failed to fetch hotel bookings:', err);
                setError('Failed to fetch hotel bookings');
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchBookings();
    }, [userId]);

    const exportBookingToPDF = (booking) => {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text('Hotel Booking Confirmation', 14, 20);

        doc.setFontSize(12);
        doc.text(`Booking ID: ${booking.id}`, 14, 35);
        doc.text(`Guest Name: ${booking.guests?.name}`, 14, 45);
        doc.text(`Email: ${booking.userEmail}`, 14, 55);
        doc.text(`Hotel: ${booking.hotel?.name}`, 14, 65);
        doc.text(`Address: ${booking.hotel?.address}`, 14, 75);
        doc.text(`Price: ${booking.hotel?.price}`, 14, 85);
        doc.text(`Check-In: ${booking.dates?.checkIn}`, 14, 95);
        doc.text(`Check-Out: ${booking.dates?.checkOut}`, 14, 105);
        doc.text(`Status: ${booking.status}`, 14, 115);
        doc.text(`Booked On: ${new Date(booking.createdAt).toLocaleDateString()}`, 14, 125);

        doc.text('Thank you for booking with Travella!', 14, 145);

        doc.save(`Booking-${booking.id}.pdf`);
    };

    return (
        <div>
            <NavScroll user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken} />
            <Container className="mt-4">
                <h3 className="mb-4">Your Hotel Bookings</h3>

                {loading && (
                    <div className="text-center my-4">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Loading bookings...</p>
                    </div>
                )}

                {error && <Alert variant="danger">{error}</Alert>}

                {!loading && !error && bookings.length === 0 && (
                    <Alert variant="info">No hotel bookings found.</Alert>
                )}

                {!loading && !error && bookings.length > 0 && (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {bookings.map((booking) => (
                            <Col key={booking.id}>
                                <Card className="d-flex flex-column">
                                    <Card.Img
                                        variant="top"
                                        src={booking.hotel?.image?.replace('{height}', '400')}
                                        alt={booking.hotel?.name}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <Card.Body >
                                        <Card.Title>{booking.hotel?.name}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{booking.hotel?.price}</Card.Subtitle>
                                        <Card.Text>
                                            <strong>Guest:</strong> {booking.guests?.name}<br />
                                            <strong>Email:</strong> {booking.userEmail}<br />
                                            <strong>Check-In:</strong> {booking.dates?.checkIn}<br />
                                            <strong>Check-Out:</strong> {booking.dates?.checkOut}<br />
                                            <strong>Status:</strong> {booking.status}<br />
                                            <strong>Booked On:</strong> {new Date(booking.createdAt).toLocaleDateString()}<br />
                                            <strong>Address:</strong> {booking.hotel?.address}
                                        </Card.Text>

                                        {/* Spacer to push button to bottom */}
                                        <div className="flex-grow-1"></div>
                                        
                                        <Button
                                            variant="outline-primary"
                                            onClick={() => exportBookingToPDF(booking)}
                                        >
                                            Download PDF
                                        </Button>
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

export default HotelBookings;
