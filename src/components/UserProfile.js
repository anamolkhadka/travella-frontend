// This is user profile component.
import React, { useState } from 'react';
import { Table, Button, Form, Card } from 'react-bootstrap';
import NavScroll from './NavScroll';
import axios from 'axios';
import "../styles/UserProfile.css";

const API_URL = "http://localhost:3000";
///const token = localStorage.getItem('token');
// Ensure axios is configured globally to include credentials. Important for cookies. 
axios.defaults.withCredentials = true;

function UserProfile({ user, setUser, setIsAuthenticated, setToken }) {
    const { id, email, firstName, lastName, location } = user;
    const [updateUser, setUpdateuser] = useState(false);

    // Handling Profile Update form
    const handleProfileUpdate = async () => {
        setUpdateuser(true);
    }

    const handleUpdateCancel = async () => {
        setUpdateuser(false);
    }

    // This function will handle the form submission for updating user profile.
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        console.log("Inside handleUpdateSubmit");
        const token = localStorage.getItem('token');

        const formData = new FormData(e.target);
        const updatedData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            location: formData.get('location'),
        };

        try {
            const response = await axios.patch(`${API_URL}/users/${id}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Inside try block");
            const { message } = response.data;
            console.log(message);
            setUpdateuser(false);
            // Update user state
            const updatedUser = { ...user, ...updatedData };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (err) {
            console.error('Error updating profile:', err);
        }
        // Show success message
        alert('Profile updated successfully!');
        // Close the update form
        setUpdateuser(false);
        // Redirect to the profile page
        window.location.reload();
    }

    return (
        <div>
            <NavScroll user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken}/>
            <div style={{ marginLeft: '20px' }}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Profile</th>
                            <th>Information</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>User ID</th>
                            <td>{id}</td>
                        </tr>
                        <tr>
                            <th>First Name</th>
                            <td>{firstName}</td>
                        </tr>
                        <tr>
                            <th>Last Name</th>
                            <td>{lastName}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{email}</td>
                        </tr>
                        <tr>
                            <th>Location</th>
                            <td>{location}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            <Button variant="outline-primary" onClick={handleProfileUpdate} style={{ marginLeft: '20px'}}>Update Profile</Button> 

            {/* Update form to update the profile information for the user. Only visible when updateUser is true. */}
            {updateUser && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Card style={{maxWidth: '1000px'}}>
                        <Card.Body>
                            <Form onSubmit={(e) => handleUpdateSubmit(e)}> 
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control 
                                        type="email"
                                        name="email" 
                                        defaultValue={email} 
                                        readOnly
                                    />
                                    <Form.Text className="text-muted">
                                        Users are not allowed to change their email address. Sign up with a new email !
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formUserID">
                                    <Form.Label>User ID</Form.Label>
                                    <Form.Control 
                                        type="text"
                                        name="userID"
                                        defaultValue={id} 
                                        readOnly
                                    />
                                    <Form.Text className="text-muted">
                                        Users are assigned unique IDs when they create an account. Users are not allowed to alter this !
                                    </Form.Text>
                                </Form.Group>


                                <Form.Group className="mb-3" controlId="formFirstName">
                                    <Form.Label>Update FirstName</Form.Label>
                                    <Form.Control 
                                        type="text"
                                        name="firstName"
                                        defaultValue={firstName} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formLastName">
                                    <Form.Label>Update LastName</Form.Label>
                                    <Form.Control 
                                        type="text"
                                        name="lastName" 
                                        defaultValue={lastName}
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formLocation">
                                    <Form.Label>Update Location</Form.Label>
                                    <Form.Control 
                                        type="text"
                                        name="location" 
                                        defaultValue={location}
                                        required 
                                    />
                                </Form.Group>

                                <Button variant="outline-primary" type="button" onClick={handleUpdateCancel}>Cancel</Button>
                                <Button variant="primary" type="submit" style={{marginLeft: '5px'}}>Submit</Button>

                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default UserProfile;