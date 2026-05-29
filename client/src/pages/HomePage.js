import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiCalendar, FiUsers, FiStar, FiArrowRight } from 'react-icons/fi';
import { travelAPI } from '../services/api';
import TravelCard from '../components/travel/TravelCard';
import Loader from '../components/common/Loader';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();
    const [featuredServices, setFeaturedServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchData, setSearchData] = useState({
        source: '',
        destination: '',
        date: '',
        passengers: 1
    });

    useEffect(() => {
        fetchFeaturedServices();
    }, []);

    const fetchFeaturedServices = async () => {
        try {
            const response = await travelAPI.getAll({ limit: 6, sort: 'rating' });
            setFeaturedServices(response.data.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchData.source) params.append('source', searchData.source);
        if (searchData.destination) params.append('destination', searchData.destination);
        if (searchData.date) params.append('date', searchData.date);
        navigate(`/search?${params.toString()}`);
    };

    const destinations = [
        { name: 'Taj Mahal, Agra', image: '/assets/tajaaaaa.jpeg' },
        { name: 'Goa Beaches', image: '/assets/goa2.jpg' },
        { name: 'Lakshadweep', image: '/assets/lak2.avif' },
        { name: 'Munnar, Kerala', image: '/assets/mun.jpg' },
        { name: 'Mysore Palace', image: '/assets/mysoreeeeeeeeeeeee.jpeg' },
        { name: 'Himalayas', image: '/assets/himaaa.jpg' }
    ];

    const services = [
        { icon: '🏨', title: 'Affordable Hotels', desc: 'Best stays at great prices' },
        { icon: '🍽️', title: 'Food & Drinks', desc: 'Local cuisines included' },
        { icon: '🚌', title: 'Fast Travel', desc: 'Quick & comfortable journeys' },
        { icon: '🛡️', title: 'Safety Guide', desc: '24/7 travel assistance' },
        { icon: '🌍', title: 'World Tours', desc: 'Explore amazing places' }
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section
                className="hero"
                style={{
                    background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/landscape-morning-fog-mountains-with-hot-air-balloons-sunrise.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Discover Your Next <span style={{ color: 'var(--primary-color)' }}>Adventure</span>
                        </h1>
                        <p className="hero-subtitle">
                            Explore beautiful destinations around India. Book buses, hotels, and complete
                            travel packages with our AI-powered travel assistant.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/search" className="btn btn-primary btn-lg">
                                Explore Now <FiArrowRight />
                            </Link>
                            <Link to="/search?type=trip" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'white' }}>
                                View Packages
                            </Link>
                        </div>
                    </div>
                </div>
            </section>


            {/* Search Box */}
            <div className="container">
                <div className="search-box">
                    <form className="search-form" onSubmit={handleSearch}>
                        <div className="form-group">
                            <label className="form-label">
                                <FiMapPin /> From
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Enter city"
                                value={searchData.source}
                                onChange={(e) => setSearchData({ ...searchData, source: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <FiMapPin /> To
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Destination"
                                value={searchData.destination}
                                onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <FiCalendar /> Date
                            </label>
                            <input
                                type="date"
                                className="form-input"
                                value={searchData.date}
                                onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                <FiUsers /> Travelers
                            </label>
                            <select
                                className="form-select"
                                value={searchData.passengers}
                                onChange={(e) => setSearchData({ ...searchData, passengers: e.target.value })}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg">
                            <FiSearch /> Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Popular Destinations */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title">Top Destinations</h2>
                    <p className="section-subtitle">Explore the most popular travel destinations in India</p>

                    <div className="destinations-grid">
                        {destinations.map((dest, index) => (
                            <div
                                key={index}
                                className="destination-card"
                                onClick={() => navigate(`/search?destination=${dest.name.split(',')[0]}`)}
                            >
                                <img src={dest.image} alt={dest.name} />
                                <div className="destination-overlay">
                                    <h3>{dest.name}</h3>
                                    <span>Explore <FiArrowRight /></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Travel Services */}
            <section className="section" style={{ background: 'var(--gray-100)' }}>
                <div className="container">
                    <h2 className="section-title">Popular Packages</h2>
                    <p className="section-subtitle">Handpicked travel experiences for you</p>

                    {loading ? (
                        <Loader text="Loading packages..." />
                    ) : (
                        <div className="travel-grid">
                            {featuredServices.map(service => (
                                <TravelCard key={service._id} service={service} />
                            ))}
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Link to="/search" className="btn btn-secondary btn-lg">
                            View All Packages <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title">Our Services</h2>
                    <p className="section-subtitle">What makes us the best travel partner</p>

                    <div className="services-grid">
                        {services.map((service, index) => (
                            <div key={index} className="service-card">
                                <div className="service-icon">{service.icon}</div>
                                <h3>{service.title}</h3>
                                <p>{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Photo Gallery */}
            <section className="section gallery-section">
                <div className="container">
                    <h2 className="section-title">Traveler Photos</h2>
                    <p className="section-subtitle">Memories captured by our happy travelers</p>

                    <div className="gallery-grid">
                        <div className="gallery-item"><img src="/assets/peoples1.jpg" alt="Traveler" /></div>
                        <div className="gallery-item"><img src="/assets/peoples2.jpg" alt="Traveler" /></div>
                        <div className="gallery-item"><img src="/assets/peoples3.jpg" alt="Traveler" /></div>
                        <div className="gallery-item"><img src="/assets/peoples4.jpg" alt="Traveler" /></div>
                        <div className="gallery-item"><img src="/assets/peoples5.jpg" alt="Traveler" /></div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <h2>Ready for Your Next Adventure?</h2>
                    <p>Join thousands of happy travelers who have explored India with us</p>
                    <div className="cta-buttons">
                        <Link to="/signup" className="btn btn-primary btn-lg">Get Started</Link>
                        <Link to="/search" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'white' }}>
                            Browse Packages
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
