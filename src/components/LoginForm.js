/// src/component/Login component
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/LoginForm.css";

function LoginForm() {
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
                    <button type="submit" className="btn btn-green">
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
