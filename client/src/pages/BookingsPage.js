import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiUsers, FiX, FiCheck, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { bookingAPI } from '../services/api';
import Loader from '../components/common/Loader';
import './BookingsPage.css';

const BookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, [filter]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const params = filter !== 'all' ? { status: filter } : {};
            const response = await bookingAPI.getMyBookings(params);
            setBookings(response.data.data);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;

        setCancellingId(bookingId);
        try {
            await bookingAPI.cancel(bookingId);
            toast.success('Booking cancelled. Refund initiated.');
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel');
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'var(--success-color)';
            case 'cancelled': return 'var(--danger-color)';
            case 'pending': return 'var(--warning-color)';
            case 'completed': return 'var(--secondary-color)';
            default: return 'var(--gray-500)';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed': return <FiCheck />;
            case 'cancelled': return <FiX />;
            case 'pending': return <FiClock />;
            default: return <FiCheck />;
        }
    };

    return (
        <div className="bookings-page">
            <div className="page-header">
                <div className="container">
                    <h1>My Bookings</h1>
                    <p>View and manage your travel bookings</p>
                </div>
            </div>

            <div className="container">
                <div className="bookings-filters">
                    {['all', 'confirmed', 'pending', 'cancelled'].map(f => (
                        <button
                            key={f}
                            className={`filter-tab ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <Loader text="Loading your bookings..." />
                ) : bookings.length === 0 ? (
                    <div className="no-bookings">
                        <h3>No bookings found</h3>
                        <p>You haven't made any bookings yet.</p>
                        <Link to="/search" className="btn btn-primary">
                            Explore Travel Options
                        </Link>
                    </div>
                ) : (
                    <div className="bookings-list">
                        {bookings.map(booking => (
                            <div key={booking._id} className="booking-card">
                                <div className="booking-image">
                                    <img
                                        src={booking.travelService?.images?.[0] || '/assets/forest-landscape_119272-9.jpg'}
                                        alt={booking.travelService?.name}
                                        onError={(e) => e.target.src = '/assets/forest-landscape_119272-9.jpg'}
                                    />
                                    <span
                                        className="booking-status"
                                        style={{ background: getStatusColor(booking.status) }}
                                    >
                                        {getStatusIcon(booking.status)} {booking.status}
                                    </span>
                                </div>

                                <div className="booking-details">
                                    <h3>{booking.travelService?.name}</h3>
                                    <div className="booking-meta">
                                        <span><FiMapPin /> {booking.travelService?.source} → {booking.travelService?.destination}</span>
                                        <span><FiCalendar /> {new Date(booking.travelDate).toLocaleDateString('en-IN', {
                                            weekday: 'short',
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}</span>
                                        <span><FiUsers /> {booking.passengers} {booking.passengers === 1 ? 'passenger' : 'passengers'}</span>
                                    </div>
                                    <div className="booking-info">
                                        <span>Booked on: {new Date(booking.createdAt).toLocaleDateString()}</span>
                                        <span>Payment: {booking.paymentStatus}</span>
                                    </div>
                                </div>

                                <div className="booking-actions">
                                    <div className="booking-amount">
                                        <span>Total</span>
                                        <strong>₹{booking.totalAmount?.toLocaleString('en-IN')}</strong>
                                    </div>
                                    {booking.status === 'confirmed' && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleCancel(booking._id)}
                                            disabled={cancellingId === booking._id}
                                        >
                                            {cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                                        </button>
                                    )}
                                    <Link
                                        to={`/travel/${booking.travelService?._id}`}
                                        className="btn btn-outline btn-sm"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingsPage;
