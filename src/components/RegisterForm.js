/// src/component/Register component
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/LoginForm.css";

const API_URL = "http://localhost:3000";

function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state
    const navigate = useNavigate();

    /// This function handles change on the input field and sets the current value of email.
    //  Here event is an object that causes the trigger.
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    /// This function handles the form submission.
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        console.log("Registering user", { email, password, location });

        // Make a POST request to the server.
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                email,
                password,
                location,
            });

            const { message } = response.data;

            // Redirect to login page
            navigate('/login', { replace: true });
        } catch (err) {
            setError("Registration failed: " + err.response.data.message); // Set error message
            console.log(err);
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
       <div className="login-container">
            <div className="login-card">
                <form onSubmit={handleSubmit}>
                    <h1>Travella</h1>
                    <h2>Sign Up with us !</h2>
                    {error && <p className="error">{error}</p>} {/* Display error message */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            onChange={handleEmailChange}
                            className="form-control"
                            placeholder="john123@gmail.com"
                            id="email"
                            value={email}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            onChange={handlePasswordChange}
                            className="form-control"
                            placeholder="password123"
                            id="password"
                            value={password}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="location" className="form-label">Your current location</label>
                        <input
                            type="text"
                            onChange={handleLocationChange}
                            className="form-control"
                            placeholder="Dallas"
                            id="location"
                            value={location}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-blue">
                        {loading ? 'Loading...' : 'Submit'} {/* Display loading indicator */}
                    </button>
                    <p>Already have an account ?</p>
                    <Link to="/login">Sign In</Link>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;