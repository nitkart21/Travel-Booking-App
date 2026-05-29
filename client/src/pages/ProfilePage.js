import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiLock, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await updateProfile(formData);

        if (result.success) {
            toast.success('Profile updated successfully!');
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const result = await updateProfile({
            ...formData,
            password: passwordData.newPassword
        });

        if (result.success) {
            toast.success('Password updated successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="profile-page">
            <div className="page-header">
                <div className="container">
                    <h1>My Profile</h1>
                    <p>Manage your account settings</p>
                </div>
            </div>

            <div className="container">
                <div className="profile-layout">
                    <aside className="profile-sidebar">
                        <div className="profile-avatar">
                            <div className="avatar-circle">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <h3>{user?.name}</h3>
                            <p>{user?.email}</p>
                        </div>

                        <nav className="profile-nav">
                            <button
                                className={activeTab === 'profile' ? 'active' : ''}
                                onClick={() => setActiveTab('profile')}
                            >
                                <FiUser /> Profile Information
                            </button>
                            <button
                                className={activeTab === 'password' ? 'active' : ''}
                                onClick={() => setActiveTab('password')}
                            >
                                <FiLock /> Change Password
                            </button>
                        </nav>
                    </aside>

                    <main className="profile-main">
                        {activeTab === 'profile' && (
                            <div className="profile-card">
                                <h2>Profile Information</h2>
                                <p>Update your personal details</p>

                                <form onSubmit={handleProfileSubmit}>
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <div className="input-icon-wrapper">
                                            <FiUser className="input-icon" />
                                            <input
                                                type="text"
                                                className="form-input with-icon"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <div className="input-icon-wrapper">
                                            <FiMail className="input-icon" />
                                            <input
                                                type="email"
                                                className="form-input with-icon"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Phone Number</label>
                                        <div className="input-icon-wrapper">
                                            <FiPhone className="input-icon" />
                                            <input
                                                type="tel"
                                                className="form-input with-icon"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="Enter 10-digit phone number"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'password' && (
                            <div className="profile-card">
                                <h2>Change Password</h2>
                                <p>Update your account password</p>

                                <form onSubmit={handlePasswordSubmit}>
                                    <div className="form-group">
                                        <label className="form-label">Current Password</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">New Password</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            required
                                            minLength={6}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        <FiLock /> {loading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
