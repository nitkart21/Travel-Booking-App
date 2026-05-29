import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="navbar-logo">
                            <img src="/assets/tat_logo.png" alt="Tours and Travel" style={{ height: '50px' }} />
                        </Link>
                        <p>
                            Discover the world with us! We offer the best travel experiences,
                            from exotic destinations to unforgettable adventures. Your journey
                            begins here.
                        </p>
                        <div className="footer-social" style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                            <a href="#" style={{ color: 'var(--gray-400)', fontSize: '1.25rem' }}><FiFacebook /></a>
                            <a href="#" style={{ color: 'var(--gray-400)', fontSize: '1.25rem' }}><FiTwitter /></a>
                            <a href="#" style={{ color: 'var(--gray-400)', fontSize: '1.25rem' }}><FiInstagram /></a>
                            <a href="#" style={{ color: 'var(--gray-400)', fontSize: '1.25rem' }}><FiYoutube /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-title">Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/search">Explore</Link></li>
                            <li><Link to="/search?type=trip">Packages</Link></li>
                            <li><Link to="/search?type=hotel">Hotels</Link></li>
                            <li><Link to="/search?type=bus">Bus Tickets</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer-title">Support</h4>
                        <ul className="footer-links">
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">FAQs</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Contact Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="footer-title">Contact Info</h4>
                        <ul className="footer-links">
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FiPhone /> +91 9876543210
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FiMail /> info@toursandtravel.com
                            </li>
                            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <FiMapPin style={{ marginTop: '3px' }} />
                                <span>515001, Vijayawada,<br />Andhra Pradesh, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 Tours and Travel. All rights reserved. Made with ❤️ by Avinash</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
