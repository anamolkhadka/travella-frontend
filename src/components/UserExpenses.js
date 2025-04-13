import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavScroll from './NavScroll';
import { Container, Table, Spinner, Alert, Form, Button } from 'react-bootstrap';

const API_URL = 'http://localhost:3000/api/expense';
axios.defaults.withCredentials = true;

function UserExpenses({ user, setUser, setIsAuthenticated, setToken }) {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userId = user?.id;
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get(`${API_URL}/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setExpenses(response.data);
            } catch (err) {
                console.error('Failed to fetch expenses:', err);
                setError('Failed to fetch expenses');
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchExpenses();
    }, [userId]);

    // Handle filter form submission
    const handleFilterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.target);
        const filters = {
            userId,
            amount: formData.get('amount'),
            category: formData.get('category'),
            vendor: formData.get('vendor'),
            date: formData.get('date'),
        };

        try {
            const response = await axios.post(`${API_URL}/filter`, filters, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpenses(response.data);
        } catch (err) {
            console.error('Error filtering expenses:', err);
            setError('Failed to filter expenses.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <NavScroll user={user} setUser={setUser} setIsAuthenticated={setIsAuthenticated} setToken={setToken} />
            <Container className="mt-4">
                <h3 className="mb-4">Your Expenses</h3>

                <Form onSubmit={handleFilterSubmit} className="my-4">
                    <Form.Group controlId="amount" className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="text" name="amount" placeholder="Amount" />
                    </Form.Group>

                    <Form.Group controlId="category" className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Control type="text" name="category" placeholder="Category" />
                    </Form.Group>

                    <Form.Group controlId="vendor" className="mb-3">
                        <Form.Label>Vendor</Form.Label>
                        <Form.Control type="text" name="vendor" placeholder="Vendor" />
                    </Form.Group>

                    <Form.Group controlId="date" className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" name="date" />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Filter
                    </Button>
                </Form>


                {loading && (
                    <div className="text-center my-4">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Loading expenses...</p>
                    </div>
                )}

                {error && (
                    <Alert variant="danger">{error}</Alert>
                )}

                {!loading && !error && expenses.length === 0 && (
                    <Alert variant="info">No expenses found.</Alert>
                )}

                {!loading && !error && expenses.length > 0 && (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Category</th>
                                <th>Vendor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(exp => (
                                <tr key={exp.id}>
                                    <td>{exp.date}</td>
                                    <td>{exp.amount}</td>
                                    <td>{exp.category}</td>
                                    <td>{exp.vendor}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Container>
        </div>
    );
}

export default UserExpenses;
