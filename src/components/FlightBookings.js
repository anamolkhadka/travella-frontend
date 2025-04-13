import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import NavScroll from './NavScroll';
import jsPDF from 'jspdf';

const API_URL = 'http://localhost:3000/api/booking/flights/bookings';
axios.defaults.withCredentials = true;

function FlightBookings({ user, setUser, setIsAuthenticated, setToken }) {
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
                console.error('Failed to fetch flight bookings:', err);
                setError('Failed to fetch flight bookings');
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchBookings();
    }, [userId]);

    const exportBookingToPDF = (booking) => {
        const doc = new jsPDF();
        const passenger = booking.passengerDetails;
        const flight = booking.flightInfo;

        doc.setFontSize(18);
        doc.text('Flight Booking Confirmation', 14, 20);

        doc.setFontSize(12);
        doc.text(`Booking ID: ${booking.id}`, 14, 35);
        doc.text(`Passenger: ${passenger.firstName} ${passenger.lastName}`, 14, 45);
        doc.text(`Email: ${passenger.contact?.email}`, 14, 55);
        doc.text(`Phone: ${passenger.contact?.phone}`, 14, 65);
        doc.text(`Airline: ${flight.airline.name}`, 14, 75);
        doc.text(`Flight Number: ${flight.flightNumber}`, 14, 85);
        doc.text(`Departure: ${flight.departure.airport} at ${new Date(flight.departure.time).toLocaleString()}`, 14, 95);
        doc.text(`Arrival: ${flight.arrival.airport} at ${new Date(flight.arrival.time).toLocaleString()}`, 14, 105);
        doc.text(`Aircraft: ${flight.aircraft}`, 14, 115);
        doc.text(`Duration: ${flight.duration.replace("PT", "")}`, 14, 125);
        doc.text(`Price: ${flight.price.currency} ${flight.price.total}`, 14, 135);
        doc.text(`Status: ${booking.status}`, 14, 145);
        doc.text(`Booked On: ${new Date(booking.bookedAt).toLocaleDateString()}`, 14, 155);

        doc.text('Thank you for booking with Travella!', 14, 175);

        doc.save(`FlightBooking-${booking.id}.pdf`);
    };

    return (
        <div>
            <NavScroll user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken} />
            <Container className="mt-4">
                <h3 className="mb-4">Your Flight Bookings</h3>

                {loading && (
                    <div className="text-center my-4">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Loading bookings...</p>
                    </div>
                )}

                {error && <Alert variant="danger">{error}</Alert>}

                {!loading && !error && bookings.length === 0 && (
                    <Alert variant="info">No flight bookings found.</Alert>
                )}

                {!loading && !error && bookings.length > 0 && (
                    <Row xs={1} className="g-4">
                        {bookings.map((booking) => {
                            const passenger = booking.passengerDetails;
                            const flight = booking.flightInfo;
                            return (
                                <Col key={booking.id}>
                                    <Card className="shadow-sm">
                                        <Card.Body>
                                            <Card.Title>{flight.airline.name} — {flight.flightNumber}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">Status: {booking.status}</Card.Subtitle>
                                            <Card.Text>
                                                <strong>Passenger:</strong> {passenger.firstName} {passenger.lastName}<br />
                                                <strong>Email:</strong> {passenger.contact?.email}<br />
                                                <strong>Phone:</strong> {passenger.contact?.phone}<br />
                                                <strong>Departure:</strong> {flight.departure.airport} @ {new Date(flight.departure.time).toLocaleString()}<br />
                                                <strong>Arrival:</strong> {flight.arrival.airport} @ {new Date(flight.arrival.time).toLocaleString()}<br />
                                                <strong>Duration:</strong> {flight.duration.replace("PT", "")}<br />
                                                <strong>Aircraft:</strong> {flight.aircraft}<br />
                                                <strong>Total Price:</strong> {flight.price.currency} {flight.price.total}<br />
                                                <strong>Booked On:</strong> {new Date(booking.bookedAt).toLocaleDateString()}
                                            </Card.Text>

                                            <Button
                                                variant="outline-primary"
                                                onClick={() => exportBookingToPDF(booking)}
                                            >
                                                Download PDF
                                            </Button>
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

export default FlightBookings;
