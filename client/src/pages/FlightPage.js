import React, { useState, useEffect } from 'react';
import { FiSearch, FiMapPin, FiCalendar, FiUsers, FiFilter, FiClock, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { flightAPI } from '../services/api';
import Loader from '../components/common/Loader';
import './FlightPage.css';

const FlightPage = () => {
    const [searchData, setSearchData] = useState({
        origin: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        adults: 1,
        travelClass: 'ECONOMY'
    });
    const [flights, setFlights] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [dataSource, setDataSource] = useState('');
    const [sortBy, setSortBy] = useState('price');

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await flightAPI.getCities();
            setCities(response.data.data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchData.origin || !searchData.destination || !searchData.departureDate) {
            toast.error('Please fill in origin, destination, and departure date');
            return;
        }

        setLoading(true);
        setSearched(true);

        try {
            const response = await flightAPI.search({
                origin: searchData.origin,
                destination: searchData.destination,
                departureDate: searchData.departureDate,
                returnDate: searchData.returnDate || undefined,
                adults: searchData.adults,
                travelClass: searchData.travelClass
            });

            setFlights(response.data.data);
            setDataSource(response.data.source);

            if (response.data.data.length === 0) {
                toast.info('No flights found for this route');
            }
        } catch (error) {
            toast.error('Error searching flights');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (duration) => {
        if (!duration) return '';
        return duration.replace('PT', '').replace('H', 'h ').replace('M', 'm');
    };

    const formatTime = (dateTime) => {
        if (!dateTime) return '';
        const date = new Date(dateTime);
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateTime) => {
        if (!dateTime) return '';
        const date = new Date(dateTime);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    const sortedFlights = [...flights].sort((a, b) => {
        if (sortBy === 'price') {
            return a.price.total - b.price.total;
        } else if (sortBy === 'duration') {
            return (a.itineraries?.[0]?.duration || '').localeCompare(b.itineraries?.[0]?.duration || '');
        }
        return 0;
    });

    const popularRoutes = [
        { from: 'Vijayawada', to: 'Hyderabad' },
        { from: 'Vijayawada', to: 'Chennai' },
        { from: 'Vijayawada', to: 'Bangalore' },
        { from: 'Delhi', to: 'Mumbai' },
        { from: 'Hyderabad', to: 'Kolkata' },
        { from: 'Chennai', to: 'Delhi' }
    ];

    return (
        <div className="flight-page">
            <div className="page-header flight-header">
                <div className="container">
                    <h1>✈️ Flight Search</h1>
                    <p>Search real-time flights across India powered by Amadeus</p>
                </div>
            </div>

            <div className="container">
                {/* Search Form */}
                <div className="flight-search-box">
                    <form className="flight-search-form" onSubmit={handleSearch}>
                        <div className="search-row">
                            <div className="form-group">
                                <label className="form-label"><FiMapPin /> From</label>
                                <select
                                    className="form-select"
                                    value={searchData.origin}
                                    onChange={(e) => setSearchData({ ...searchData, origin: e.target.value })}
                                    required
                                >
                                    <option value="">Select Origin City</option>
                                    {cities.map(city => (
                                        <option key={city.code} value={city.name}>
                                            {city.name} ({city.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="swap-btn" onClick={() => setSearchData({
                                ...searchData,
                                origin: searchData.destination,
                                destination: searchData.origin
                            })}>
                                ⇄
                            </div>

                            <div className="form-group">
                                <label className="form-label"><FiMapPin /> To</label>
                                <select
                                    className="form-select"
                                    value={searchData.destination}
                                    onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                                    required
                                >
                                    <option value="">Select Destination City</option>
                                    {cities.map(city => (
                                        <option key={city.code} value={city.name}>
                                            {city.name} ({city.code})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="search-row">
                            <div className="form-group">
                                <label className="form-label"><FiCalendar /> Departure</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={searchData.departureDate}
                                    onChange={(e) => setSearchData({ ...searchData, departureDate: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label"><FiCalendar /> Return (Optional)</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    min={searchData.departureDate || new Date().toISOString().split('T')[0]}
                                    value={searchData.returnDate}
                                    onChange={(e) => setSearchData({ ...searchData, returnDate: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label"><FiUsers /> Passengers</label>
                                <select
                                    className="form-select"
                                    value={searchData.adults}
                                    onChange={(e) => setSearchData({ ...searchData, adults: parseInt(e.target.value) })}
                                >
                                    {[1, 2, 3, 4, 5, 6].map(num => (
                                        <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label"><FiFilter /> Class</label>
                                <select
                                    className="form-select"
                                    value={searchData.travelClass}
                                    onChange={(e) => setSearchData({ ...searchData, travelClass: e.target.value })}
                                >
                                    <option value="ECONOMY">Economy</option>
                                    <option value="PREMIUM_ECONOMY">Premium Economy</option>
                                    <option value="BUSINESS">Business</option>
                                    <option value="FIRST">First Class</option>
                                </select>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg search-btn" disabled={loading}>
                                <FiSearch /> {loading ? 'Searching...' : 'Search Flights'}
                            </button>
                        </div>
                    </form>

                    {/* Popular Routes */}
                    <div className="popular-routes">
                        <span>Popular:</span>
                        {popularRoutes.map((route, index) => (
                            <button
                                key={index}
                                className="route-chip"
                                onClick={() => setSearchData({
                                    ...searchData,
                                    origin: route.from,
                                    destination: route.to
                                })}
                            >
                                {route.from} → {route.to}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <Loader text="Searching flights..." />
                ) : searched ? (
                    <div className="flight-results">
                        <div className="results-header">
                            <h2>{flights.length} Flights Found</h2>
                            {dataSource && (
                                <span className="data-source">
                                    Data: {dataSource}
                                </span>
                            )}
                            <div className="sort-options">
                                <span>Sort by:</span>
                                <button
                                    className={sortBy === 'price' ? 'active' : ''}
                                    onClick={() => setSortBy('price')}
                                >
                                    Price
                                </button>
                                <button
                                    className={sortBy === 'duration' ? 'active' : ''}
                                    onClick={() => setSortBy('duration')}
                                >
                                    Duration
                                </button>
                            </div>
                        </div>

                        {sortedFlights.length === 0 ? (
                            <div className="no-results">
                                <h3>No flights found</h3>
                                <p>Try different dates or cities</p>
                            </div>
                        ) : (
                            <div className="flight-list">
                                {sortedFlights.map((flight, index) => {
                                    const segment = flight.itineraries?.[0]?.segments?.[0];
                                    if (!segment) return null;

                                    return (
                                        <div key={flight.id || index} className="flight-card">
                                            <div className="flight-airline">
                                                <div className="airline-logo">
                                                    {segment.airlineName || segment.airline}
                                                </div>
                                                <div className="flight-number">
                                                    {segment.flightNumber}
                                                </div>
                                            </div>

                                            <div className="flight-times">
                                                <div className="time-block">
                                                    <span className="time">{formatTime(segment.departure?.time)}</span>
                                                    <span className="airport">{segment.departure?.airport}</span>
                                                    <span className="date">{formatDate(segment.departure?.time)}</span>
                                                </div>

                                                <div className="flight-duration">
                                                    <span className="duration-line"></span>
                                                    <span className="duration-text">
                                                        <FiClock /> {formatDuration(segment.duration || flight.itineraries?.[0]?.duration)}
                                                    </span>
                                                    <span className="stops">
                                                        {segment.stops === 0 ? 'Non-stop' : `${segment.stops} stop${segment.stops > 1 ? 's' : ''}`}
                                                    </span>
                                                </div>

                                                <div className="time-block">
                                                    <span className="time">{formatTime(segment.arrival?.time)}</span>
                                                    <span className="airport">{segment.arrival?.airport}</span>
                                                    <span className="date">{formatDate(segment.arrival?.time)}</span>
                                                </div>
                                            </div>

                                            <div className="flight-price">
                                                <span className="price">
                                                    ₹{flight.price?.total?.toLocaleString('en-IN')}
                                                </span>
                                                <span className="per-person">per person</span>
                                                <span className="seats">
                                                    {flight.seatsAvailable || 'Few'} seats left
                                                </span>
                                                <button className="btn btn-primary btn-sm">
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flight-info">
                        <h2>Search Flights Across India</h2>
                        <p>We support 50+ airports including Vijayawada, Hyderabad, Chennai, Bangalore, Mumbai, Delhi, Kolkata, and more!</p>

                        <div className="info-cards">
                            <div className="info-card">
                                <span className="icon">🛫</span>
                                <h3>50+ Airports</h3>
                                <p>All major Indian cities covered</p>
                            </div>
                            <div className="info-card">
                                <span className="icon">💰</span>
                                <h3>Best Prices</h3>
                                <p>Compare across airlines</p>
                            </div>
                            <div className="info-card">
                                <span className="icon">⚡</span>
                                <h3>Real-Time</h3>
                                <p>Live availability data</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlightPage;
