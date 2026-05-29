import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiUsers, FiPackage, FiCalendar, FiDollarSign,
    FiTrendingUp, FiEye, FiEdit, FiTrash2, FiPlus,
    FiCheck, FiX
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { adminAPI, travelAPI, bookingAPI } from '../services/api';
import Loader from '../components/common/Loader';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [recentBookings, setRecentBookings] = useState([]);
    const [popularServices, setPopularServices] = useState([]);
    const [services, setServices] = useState([]);
    const [users, setUsers] = useState([]);
    const [allBookings, setAllBookings] = useState([]);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [serviceForm, setServiceForm] = useState({
        name: '',
        type: 'trip',
        source: '',
        destination: '',
        price: '',
        duration: '',
        description: '',
        availableSeats: '',
        amenities: ''
    });

    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchDashboardData();
        } else if (activeTab === 'services') {
            fetchServices();
        } else if (activeTab === 'bookings') {
            fetchAllBookings();
        } else if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getDashboard();
            const { stats, recentBookings, popularServices } = response.data.data;
            setStats(stats);
            setRecentBookings(recentBookings);
            setPopularServices(popularServices);
        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await travelAPI.getAll({ limit: 50 });
            setServices(response.data.data);
        } catch (error) {
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllBookings = async () => {
        setLoading(true);
        try {
            const response = await bookingAPI.getAll({ limit: 50 });
            setAllBookings(response.data.data);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getUsers({ limit: 50 });
            setUsers(response.data.data);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateService = () => {
        setEditingService(null);
        setServiceForm({
            name: '',
            type: 'trip',
            source: '',
            destination: '',
            price: '',
            duration: '',
            description: '',
            availableSeats: '',
            amenities: ''
        });
        setShowServiceModal(true);
    };

    const handleEditService = (service) => {
        setEditingService(service);
        setServiceForm({
            name: service.name,
            type: service.type,
            source: service.source,
            destination: service.destination,
            price: service.price,
            duration: service.duration,
            description: service.description,
            availableSeats: service.availableSeats,
            amenities: service.amenities?.join(', ') || ''
        });
        setShowServiceModal(true);
    };

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...serviceForm,
                price: Number(serviceForm.price),
                availableSeats: Number(serviceForm.availableSeats),
                amenities: serviceForm.amenities.split(',').map(a => a.trim()).filter(a => a)
            };

            if (editingService) {
                await travelAPI.update(editingService._id, data);
                toast.success('Service updated successfully');
            } else {
                await travelAPI.create(data);
                toast.success('Service created successfully');
            }

            setShowServiceModal(false);
            fetchServices();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDeleteService = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        try {
            await travelAPI.delete(id);
            toast.success('Service deleted');
            fetchServices();
        } catch (error) {
            toast.error('Failed to delete service');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await adminAPI.deleteUser(id);
            toast.success('User deleted');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const renderDashboard = () => (
        <>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        <FiUsers />
                    </div>
                    <div className="stat-info">
                        <span>Total Users</span>
                        <strong>{stats.totalUsers || 0}</strong>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <FiPackage />
                    </div>
                    <div className="stat-info">
                        <span>Travel Services</span>
                        <strong>{stats.totalServices || 0}</strong>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <FiCalendar />
                    </div>
                    <div className="stat-info">
                        <span>Total Bookings</span>
                        <strong>{stats.totalBookings || 0}</strong>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                        <FiDollarSign />
                    </div>
                    <div className="stat-info">
                        <span>Total Revenue</span>
                        <strong>₹{(stats.totalRevenue || 0).toLocaleString('en-IN')}</strong>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-section">
                    <h3>Recent Bookings</h3>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Service</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.map(booking => (
                                    <tr key={booking._id}>
                                        <td>{booking.user?.name}</td>
                                        <td>{booking.travelService?.name}</td>
                                        <td>₹{booking.totalAmount?.toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge ${booking.status}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="dashboard-section">
                    <h3>Popular Services</h3>
                    <div className="popular-list">
                        {popularServices.map(service => (
                            <div key={service._id} className="popular-item">
                                <div>
                                    <strong>{service.name}</strong>
                                    <span>{service.type} • {service.destination}</span>
                                </div>
                                <div className="popular-stats">
                                    <span>⭐ {service.rating?.toFixed(1)}</span>
                                    <span>₹{service.price?.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );

    const renderServices = () => (
        <div className="admin-section">
            <div className="section-header">
                <h3>Manage Travel Services</h3>
                <button className="btn btn-primary" onClick={handleCreateService}>
                    <FiPlus /> Add Service
                </button>
            </div>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Route</th>
                            <th>Price</th>
                            <th>Seats</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(service => (
                            <tr key={service._id}>
                                <td>{service.name}</td>
                                <td><span className={`type-badge ${service.type}`}>{service.type}</span></td>
                                <td>{service.source} → {service.destination}</td>
                                <td>₹{service.price?.toLocaleString()}</td>
                                <td>{service.availableSeats}</td>
                                <td>⭐ {service.rating?.toFixed(1)}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button onClick={() => navigate(`/travel/${service._id}`)}><FiEye /></button>
                                        <button onClick={() => handleEditService(service)}><FiEdit /></button>
                                        <button onClick={() => handleDeleteService(service._id)}><FiTrash2 /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderBookings = () => (
        <div className="admin-section">
            <h3>All Bookings</h3>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Passengers</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allBookings.map(booking => (
                            <tr key={booking._id}>
                                <td>{booking.user?.name}<br /><small>{booking.user?.email}</small></td>
                                <td>{booking.travelService?.name}</td>
                                <td>{new Date(booking.travelDate).toLocaleDateString()}</td>
                                <td>{booking.passengers}</td>
                                <td>₹{booking.totalAmount?.toLocaleString()}</td>
                                <td><span className={`status-badge ${booking.status}`}>{booking.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderUsers = () => (
        <div className="admin-section">
            <h3>Registered Users</h3>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone || '-'}</td>
                                <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    {user.role !== 'admin' && (
                                        <button
                                            className="action-btn danger"
                                            onClick={() => handleDeleteUser(user._id)}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="admin-dashboard">
            <div className="admin-sidebar">
                <div className="admin-brand">
                    <h2>Admin Panel</h2>
                </div>
                <nav className="admin-nav">
                    <button
                        className={activeTab === 'dashboard' ? 'active' : ''}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <FiTrendingUp /> Dashboard
                    </button>
                    <button
                        className={activeTab === 'services' ? 'active' : ''}
                        onClick={() => setActiveTab('services')}
                    >
                        <FiPackage /> Services
                    </button>
                    <button
                        className={activeTab === 'bookings' ? 'active' : ''}
                        onClick={() => setActiveTab('bookings')}
                    >
                        <FiCalendar /> Bookings
                    </button>
                    <button
                        className={activeTab === 'users' ? 'active' : ''}
                        onClick={() => setActiveTab('users')}
                    >
                        <FiUsers /> Users
                    </button>
                </nav>
                <Link to="/" className="back-to-site">← Back to Site</Link>
            </div>

            <main className="admin-main">
                <div className="admin-header">
                    <h1>
                        {activeTab === 'dashboard' && 'Dashboard Overview'}
                        {activeTab === 'services' && 'Travel Services'}
                        {activeTab === 'bookings' && 'Booking Management'}
                        {activeTab === 'users' && 'User Management'}
                    </h1>
                </div>

                <div className="admin-content">
                    {loading ? (
                        <Loader text="Loading..." />
                    ) : (
                        <>
                            {activeTab === 'dashboard' && renderDashboard()}
                            {activeTab === 'services' && renderServices()}
                            {activeTab === 'bookings' && renderBookings()}
                            {activeTab === 'users' && renderUsers()}
                        </>
                    )}
                </div>
            </main>

            {/* Service Modal */}
            {showServiceModal && (
                <div className="modal-overlay" onClick={() => setShowServiceModal(false)}>
                    <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                        <form onSubmit={handleServiceSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={serviceForm.name}
                                        onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Type</label>
                                    <select
                                        className="form-select"
                                        value={serviceForm.type}
                                        onChange={(e) => setServiceForm({ ...serviceForm, type: e.target.value })}
                                    >
                                        <option value="trip">Trip</option>
                                        <option value="hotel">Hotel</option>
                                        <option value="bus">Bus</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Source</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={serviceForm.source}
                                        onChange={(e) => setServiceForm({ ...serviceForm, source: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Destination</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={serviceForm.destination}
                                        onChange={(e) => setServiceForm({ ...serviceForm, destination: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Price (₹)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={serviceForm.price}
                                        onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Duration</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g., 3D/2N"
                                        value={serviceForm.duration}
                                        onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Available Seats</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={serviceForm.availableSeats}
                                        onChange={(e) => setServiceForm({ ...serviceForm, availableSeats: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-input"
                                    rows="3"
                                    value={serviceForm.description}
                                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Amenities (comma-separated)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="AC, WiFi, Breakfast, etc."
                                    value={serviceForm.amenities}
                                    onChange={(e) => setServiceForm({ ...serviceForm, amenities: e.target.value })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowServiceModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingService ? 'Update' : 'Create'} Service
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
