import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiClock, FiUsers, FiStar, FiCalendar, FiCheck, FiChevronLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { travelAPI, reviewAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import './TravelDetailPage.css';

const TravelDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [service, setService] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        travelDate: '',
        passengers: 1,
        contactEmail: '',
        contactPhone: '',
        paymentMethod: 'card'
    });
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        fetchServiceDetails();
        fetchReviews();
    }, [id]);

    const fetchServiceDetails = async () => {
        try {
            const response = await travelAPI.getById(id);
            setService(response.data.data);
        } catch (error) {
            toast.error('Failed to load service details');
            navigate('/search');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await reviewAPI.getByService(id, { limit: 5 });
            setReviews(response.data.data);
        } catch (error) {
            console.error('Error fetching reviews');
        }
    };

    const handleBookNow = () => {
        if (!isAuthenticated) {
            toast.info('Please login to book');
            navigate('/login', { state: { from: { pathname: `/travel/${id}` } } });
            return;
        }
        setShowBookingModal(true);
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setBookingLoading(true);

        try {
            await bookingAPI.create({
                travelServiceId: id,
                ...bookingData
            });
            toast.success('Booking confirmed! Check your email for details.');
            setShowBookingModal(false);
            navigate('/bookings');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    const getDefaultImage = () => {
        switch (service?.type) {
            case 'trip': return '/assets/goa_pak.jpg';
            case 'hotel': return '/assets/Dubai image.jpg';
            case 'bus': return '/assets/landscape-morning-fog-mountains-with-hot-air-balloons-sunrise.jpg';
            default: return '/assets/forest-landscape_119272-9.jpg';
        }
    };

    if (loading) return <Loader text="Loading details..." />;
    if (!service) return <div>Service not found</div>;

    const totalAmount = service.price * bookingData.passengers;

    return (
        <div className="travel-detail-page">
            <div className="page-header">
                <div className="container">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <FiChevronLeft /> Back
                    </button>
                    <h1>{service.name}</h1>
                    <p><FiMapPin /> {service.source} → {service.destination}</p>
                </div>
            </div>

            <div className="container">
                <div className="detail-layout">
                    <div className="detail-main">
                        {/* Hero Image */}
                        <div className="detail-hero">
                            <img
                                src={service.images?.[0] || getDefaultImage()}
                                alt={service.name}
                                onError={(e) => e.target.src = getDefaultImage()}
                            />
                            <span className="service-type-badge">{service.type}</span>
                        </div>

                        {/* Info Cards */}
                        <div className="info-cards">
                            <div className="info-card">
                                <FiClock />
                                <div>
                                    <span>Duration</span>
                                    <strong>{service.duration}</strong>
                                </div>
                            </div>
                            <div className="info-card">
                                <FiUsers />
                                <div>
                                    <span>Available</span>
                                    <strong>{service.availableSeats} seats</strong>
                                </div>
                            </div>
                            <div className="info-card">
                                <FiStar />
                                <div>
                                    <span>Rating</span>
                                    <strong>{service.rating?.toFixed(1)} ({service.reviewCount})</strong>
                                </div>
                            </div>
                            {service.departureDate && (
                                <div className="info-card">
                                    <FiCalendar />
                                    <div>
                                        <span>Departure</span>
                                        <strong>{new Date(service.departureDate).toLocaleDateString()}</strong>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="detail-section">
                            <h2>About this {service.type}</h2>
                            <p>{service.description}</p>
                        </div>

                        {/* Amenities */}
                        {service.amenities?.length > 0 && (
                            <div className="detail-section">
                                <h2>Amenities & Inclusions</h2>
                                <div className="amenities-grid">
                                    {service.amenities.map((amenity, index) => (
                                        <div key={index} className="amenity-item">
                                            <FiCheck /> {amenity}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        <div className="detail-section">
                            <h2>Reviews ({service.reviewCount})</h2>
                            {reviews.length === 0 ? (
                                <p className="no-reviews">No reviews yet. Be the first to review!</p>
                            ) : (
                                <div className="reviews-list">
                                    {reviews.map(review => (
                                        <div key={review._id} className="review-card">
                                            <div className="review-header">
                                                <strong>{review.user?.name}</strong>
                                                <div className="review-rating">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FiStar
                                                            key={i}
                                                            fill={i < review.rating ? '#f59e0b' : 'none'}
                                                            color="#f59e0b"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p>{review.comment}</p>
                                            <span className="review-date">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="booking-sidebar">
                        <div className="booking-card">
                            <div className="price-display">
                                <span className="price">₹{service.price?.toLocaleString('en-IN')}</span>
                                <span className="price-unit">/{service.type === 'hotel' ? 'night' : 'person'}</span>
                            </div>

                            <div className="booking-form-preview">
                                <div className="form-group">
                                    <label>Number of {service.type === 'hotel' ? 'Rooms' : 'Travelers'}</label>
                                    <select
                                        className="form-select"
                                        value={bookingData.passengers}
                                        onChange={(e) => setBookingData({ ...bookingData, passengers: parseInt(e.target.value) })}
                                    >
                                        {[...Array(Math.min(10, service.availableSeats))].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="price-breakdown">
                                    <div className="price-row">
                                        <span>₹{service.price?.toLocaleString()} x {bookingData.passengers}</span>
                                        <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="price-row total">
                                        <span>Total</span>
                                        <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={handleBookNow}
                                    disabled={service.availableSeats === 0}
                                    style={{ width: '100%' }}
                                >
                                    {service.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Complete Your Booking</h2>
                        <p>{service.name}</p>

                        <form onSubmit={handleBookingSubmit}>
                            <div className="form-group">
                                <label className="form-label">Travel Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={bookingData.travelDate}
                                    onChange={(e) => setBookingData({ ...bookingData, travelDate: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="your@email.com"
                                        value={bookingData.contactEmail}
                                        onChange={(e) => setBookingData({ ...bookingData, contactEmail: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        placeholder="10-digit number"
                                        value={bookingData.contactPhone}
                                        onChange={(e) => setBookingData({ ...bookingData, contactPhone: e.target.value })}
                                        pattern="[0-9]{10}"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Payment Method</label>
                                <select
                                    className="form-select"
                                    value={bookingData.paymentMethod}
                                    onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                                >
                                    <option value="card">Credit/Debit Card</option>
                                    <option value="upi">UPI</option>
                                    <option value="netbanking">Net Banking</option>
                                    <option value="wallet">Digital Wallet</option>
                                </select>
                            </div>

                            <div className="booking-summary">
                                <strong>Total Amount: ₹{totalAmount.toLocaleString('en-IN')}</strong>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowBookingModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={bookingLoading}
                                >
                                    {bookingLoading ? 'Processing...' : 'Confirm & Pay'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TravelDetailPage;
