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
                    <Navbar.Brand className="navbar-items fw-bold me-5">
                        {user.email}
                    </Navbar.Brand>
                )}
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="mx-auto d-flex justify-content-center align-items-center gap-4"
                        style={{ maxHeight: '300px' }}
                        navbarScroll
                    >
                        <Nav.Link as={Link} to="/" className='navbar-items'>Home</Nav.Link>
                        <Nav.Link href="#about" className='navbar-items'>About</Nav.Link>
                        <NavDropdown title="Itinerary" id="navbarScrollingDropdown">
                            <NavDropdown.Item as={Link} to="#">Custom Itinerary</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="#">AI Generated Itinerary</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={Link} to="#" className='navbar-items'>Flights</Nav.Link>
                        <Nav.Link as={Link} to="#" className='navbar-items'>Hotels</Nav.Link>
                        <NavDropdown title="Real-Time Travel Updates" id="navbarScrollingDropdown">
                            <NavDropdown.Item as={Link} to="#">Flight Updates</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="#">Weather Updates</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link as={Link} to="#" className='navbar-items'>Local Recommendations</Nav.Link>
                    </Nav>

                    <div className="d-flex me-4">
                        {user ? (
                        <Button variant="outline-light" className="ms-3" onClick={handleLogout}>Logout</Button>
                        ) : (
                        <Button variant="light" onClick={handleLogin}>Login</Button>
                        )}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>

  );
}

export default NavScroll;
