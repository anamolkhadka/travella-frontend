import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "../styles/NavScroll.css"


function NavScroll() {
    const navigate = useNavigate();
    const isLoggedIn = false; // 🔁 Replace with actual auth check

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        // Clear token logic here
        navigate('/');
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

                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="mx-auto d-flex justify-content-center align-items-center gap-4"
                        style={{ maxHeight: '300px' }}
                        navbarScroll
                    >
                        <Nav.Link as={Link} to="/" className='navbar-items'>Home</Nav.Link>
                        <Nav.Link as={Link} to="#" className='navbar-items'>About</Nav.Link>
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
                        {isLoggedIn ? (
                        <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
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
