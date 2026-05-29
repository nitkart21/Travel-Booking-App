import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
        setDropdownOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="navbar-logo">
                    <img src="/assets/tat_logo.png" alt="Tours and Travel" />
                    <span>Tours & Travel</span>
                </Link>

                <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
                    <li>
                        <Link
                            to="/"
                            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/search"
                            className={`navbar-link ${isActive('/search') ? 'active' : ''}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            Explore
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/flights"
                            className={`navbar-link ${isActive('/flights') ? 'active' : ''}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            ✈️ Flights
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/search?type=bus"
                            className={`navbar-link ${location.search.includes('type=bus') ? 'active' : ''}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            🚌 Buses
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/search?type=trip"
                            className={`navbar-link ${location.search.includes('type=trip') ? 'active' : ''}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            Packages
                        </Link>
                    </li>
                    {isAuthenticated && (
                        <li>
                            <Link
                                to="/bookings"
                                className={`navbar-link ${isActive('/bookings') ? 'active' : ''}`}
                                onClick={() => setMenuOpen(false)}
                            >
                                My Bookings
                            </Link>
                        </li>
                    )}
                    {isAdmin && (
                        <li>
                            <Link
                                to="/admin"
                                className={`navbar-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                                onClick={() => setMenuOpen(false)}
                            >
                                Admin
                            </Link>
                        </li>
                    )}
                </ul>

                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <div className="user-dropdown">
                            <button
                                className="user-dropdown-toggle"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <FiUser />
                                <span>{user?.name?.split(' ')[0]}</span>
                            </button>
                            {dropdownOpen && (
                                <div className="user-dropdown-menu">
                                    <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                                        <FiSettings /> Profile
                                    </Link>
                                    <button onClick={handleLogout}>
                                        <FiLogOut /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                            <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
                        </>
                    )}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Header;
