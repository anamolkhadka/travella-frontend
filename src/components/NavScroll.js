import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from 'axios';
import "../styles/NavScroll.css"

const API_URL = "http://localhost:3000";

function NavScroll({ user, setUser, setIsAuthenticated, setToken }) {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = async () => {
       try {
            // Make a POST request to the server.
            const response = await axios.post(`${API_URL}/auth/logout`);
            const { message } = response.data;
            console.log(message);
            // Remove token from local storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            sessionStorage.removeItem('recommendations');
            //Clear hotel session data
            sessionStorage.removeItem('hotelResults');
            sessionStorage.removeItem('hotelSearch');
            // Clear flight session data
            sessionStorage.removeItem('flightResults');
            sessionStorage.removeItem('flightSearch');
            // Update user state
            setUser(null);
            setIsAuthenticated(false);
            setToken('');
            // Redirect to Home page
            navigate('/', { replace: true });
       } catch (err) {
            console.log('Logout failed:', err);
       }
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary navbar-custom justify-content-center">
            <Container className="d-flex justify-content-center align-items-center">
                <Navbar.Brand className='navbar-items me-3'>
                    <img
                    src="/resources/travella_logo.png"
                    alt="Logo"
                    className="navbar-logo"
                    />
                </Navbar.Brand>
                <Navbar.Brand className="navbar-items fw-bold me-5">Travella</Navbar.Brand>
                {user && (
                    <Nav.Link as={Link} to="/userProfile" className="navbar-items fw-bold me-5">
                        {user.email}
                    </Nav.Link>
                )}
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="mx-auto d-flex justify-content-center align-items-center gap-4"
                        style={{ maxHeight: '500px' }}
                        navbarScroll
                    >
                        <Nav.Link as={Link} to="/" className='navbar-items'>Home</Nav.Link>
                        <Nav.Link href="#about" className='navbar-items'>About</Nav.Link>
                        <Nav.Link as={Link} to="/userExpenses" className='navbar-items'>Expenses</Nav.Link>
                        <NavDropdown title="Itinerary" id="navbarScrollingDropdown">
                            <NavDropdown.Item as={Link} to="/userItinerary">My Itineraries</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/createItinerary">Create Custom Itinerary</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/generateItinerary">AI Generated Itinerary</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Flights" id="navbarScrollingDropdown">
                            <NavDropdown.Item as={Link} to="/searchFlights">Book Flight</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/flightBookings">My Bookings</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Hotels" id="navbarScrollingDropdown">
                            <NavDropdown.Item as={Link} to="/searchHotels">Book hotel</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/hotelBookings">My Reservations</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Travel Updates" id="navbarScrollingDropdown">
                            <NavDropdown.Item as={Link} to="/flightUpdates">Flight Updates</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/weatherUpdates">Weather Updates</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={Link} to="/localRecommendation" className='navbar-items'>Recommendations</Nav.Link>

                        <div className="d-flex me-4">
                            {user ? (
                            <Button variant="outline-light" className="ms-3" onClick={handleLogout}>Logout</Button>
                            ) : (
                            <Button variant="light" onClick={handleLogin}>Login</Button>
                            )}
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

  );
}

export default NavScroll;
