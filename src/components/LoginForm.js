/// src/component/Login component
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/LoginForm.css";

const API_URL = "http://localhost:3000";

function LoginForm({ setUser, setIsAuthenticated, setToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

    /// This function handles the form submission.
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
            });

            const { message, token, userId } = response.data;

            // Set token to local storage
            localStorage.setItem('token', token);
            localStorage.setItem("user", JSON.stringify({ email, userId }));
            localStorage.setItem("isAuthenticated", "true");
            
            // Update user state
            setUser({ email, userId });
            setIsAuthenticated(true);
            setToken(token);

            // Redirect to home page. Replace is true so that the login page is not in the history when user clicks back button.
            navigate('/', { replace: true });
        } catch (err) {
            setError("Login failed: " + err.response.data.message); // Set error message
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
                    <h2>Sign In</h2>
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
                    <button type="submit" className="btn btn-blue">
                        {loading ? 'Loading...' : 'Submit'} {/* Display loading indicator */}
                    </button>
                    <p>Don't have an account ?</p>
                    <Link to="/register">Sign Up</Link>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
