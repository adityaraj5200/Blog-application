import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Blog App</Link>
            </div>
            <div className="navbar-menu">
                <Link to="/" className="navbar-item">All Blogs</Link>
                {isAuthenticated && (
                    <Link to="/my-blogs" className="navbar-item">My Blogs</Link>
                )}
                {isAuthenticated ? (
                    <>
                        <Link to="/create" className="navbar-item">Create Post</Link>
                        <div className="user-menu">
                            <span className="username">
                                <i className="fas fa-user"></i> {user?.username}
                            </span>
                            <button onClick={logout} className="logout-button">
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="navbar-item">Login</Link>
                        <Link to="/register" className="navbar-item">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar; 