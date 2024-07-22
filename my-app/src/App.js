// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Home from './Home';
import Login from './Login';
import Messages from './Messages';
import Navbar from './Navbar';
import SearchUsers from './SearchUsers';
import TodoList from './TodoList';
import './App.css';

const API_BASE_URL = 'http://localhost:8000/api/';

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user data using the token from localStorage
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`${API_BASE_URL}profile/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    setUser(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, []);

    const handleLogout = () => {
        // Remove token from localStorage and set user to null
        localStorage.removeItem('token');
        setUser(null);
    };

    const PrivateRoute = ({ element: Element, ...rest }) => (
        <Route {...rest} element={user ? <Element /> : <Navigate to="/login" />} />
    );

    return (
        <Router>
            <div>
                <Navbar user={user} handleLogout={handleLogout} />

                <Routes>
                    {/* Use PrivateRoute with 'element' instead of 'component' */}
                    <PrivateRoute path="/dashboard" element={<Dashboard />} />
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <PrivateRoute path="/messages" element={<Messages />} />
                    <PrivateRoute path="/search" element={<SearchUsers />} />
                    <PrivateRoute path="/todo" element={<TodoList />} />
                    <PrivateRoute path="/" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
