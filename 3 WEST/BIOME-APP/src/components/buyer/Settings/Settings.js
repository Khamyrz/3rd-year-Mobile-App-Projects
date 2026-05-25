import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, 
    faLock, 
    faBell, 
    faGlobe, 
    faShieldAlt, 
    faCreditCard,
    faCamera
} from '@fortawesome/free-solid-svg-icons';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        avatar: null,
        language: 'en',
        currency: 'USD',
        notifications: {
            email: true,
            push: true,
            sms: false
        },
        twoFactorEnabled: false
    });

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // TODO: Implement avatar upload
            setProfileData(prev => ({
                ...prev,
                avatar: URL.createObjectURL(file)
            }));
        }
    };

    const handleProfileUpdate = async (event) => {
        event.preventDefault();
        // TODO: Implement profile update API call
        console.log('Updating profile:', profileData);
    };

    const handlePasswordChange = async (event) => {
        event.preventDefault();
        // TODO: Implement password change API call
        console.log('Changing password');
    };

    const handleNotificationToggle = (type) => {
        setProfileData(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [type]: !prev.notifications[type]
            }
        }));
    };

    const renderProfileSettings = () => (
        <form onSubmit={handleProfileUpdate}>
            <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                    <img 
                        src={profileData.avatar || 'default-avatar.png'} 
                        alt="Profile"
                        className="rounded-circle"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <label 
                        className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2"
                        style={{ cursor: 'pointer' }}
                    >
                        <FontAwesomeIcon icon={faCamera} className="text-white" />
                        <input 
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    </label>
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input 
                    type="text"
                    className="form-control"
                    value={profileData.name}
                    onChange={e => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Email</label>
                <input 
                    type="email"
                    className="form-control"
                    value={profileData.email}
                    onChange={e => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input 
                    type="tel"
                    className="form-control"
                    value={profileData.phone}
                    onChange={e => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                />
            </div>

            <button type="submit" className="btn btn-primary">
                Save Changes
            </button>
        </form>
    );

    const renderSecuritySettings = () => (
        <div>
            <form onSubmit={handlePasswordChange} className="mb-4">
                <h6 className="mb-3">Change Password</h6>
                <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input type="password" className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input type="password" className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">
                    Update Password
                </button>
            </form>

            <div className="mb-4">
                <h6 className="mb-3">Two-Factor Authentication</h6>
                <div className="form-check form-switch">
                    <input 
                        className="form-check-input"
                        type="checkbox"
                        checked={profileData.twoFactorEnabled}
                        onChange={() => setProfileData(prev => ({ 
                            ...prev, 
                            twoFactorEnabled: !prev.twoFactorEnabled 
                        }))}
                    />
                    <label className="form-check-label">
                        Enable Two-Factor Authentication
                    </label>
                </div>
            </div>
        </div>
    );

    const renderNotificationSettings = () => (
        <div>
            <h6 className="mb-3">Notification Preferences</h6>
            <div className="mb-3">
                <div className="form-check form-switch">
                    <input 
                        className="form-check-input"
                        type="checkbox"
                        checked={profileData.notifications.email}
                        onChange={() => handleNotificationToggle('email')}
                    />
                    <label className="form-check-label">Email Notifications</label>
                </div>
                <small className="text-secondary">Receive tour updates and offers via email</small>
            </div>

            <div className="mb-3">
                <div className="form-check form-switch">
                    <input 
                        className="form-check-input"
                        type="checkbox"
                        checked={profileData.notifications.push}
                        onChange={() => handleNotificationToggle('push')}
                    />
                    <label className="form-check-label">Push Notifications</label>
                </div>
                <small className="text-secondary">Get instant updates on your device</small>
            </div>

            <div className="mb-3">
                <div className="form-check form-switch">
                    <input 
                        className="form-check-input"
                        type="checkbox"
                        checked={profileData.notifications.sms}
                        onChange={() => handleNotificationToggle('sms')}
                    />
                    <label className="form-check-label">SMS Notifications</label>
                </div>
                <small className="text-secondary">Receive important alerts via SMS</small>
            </div>
        </div>
    );

    const renderPreferenceSettings = () => (
        <div>
            <div className="mb-4">
                <h6 className="mb-3">Language</h6>
                <select 
                    className="form-select"
                    value={profileData.language}
                    onChange={e => setProfileData(prev => ({ ...prev, language: e.target.value }))}
                >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                </select>
            </div>

            <div className="mb-4">
                <h6 className="mb-3">Currency</h6>
                <select 
                    className="form-select"
                    value={profileData.currency}
                    onChange={e => setProfileData(prev => ({ ...prev, currency: e.target.value }))}
                >
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                    <option value="JPY">Japanese Yen (JPY)</option>
                </select>
            </div>
        </div>
    );

    const renderPaymentSettings = () => (
        <div>
            <h6 className="mb-3">Payment Methods</h6>
            <div className="card mb-3">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="mb-1">•••• •••• •••• 4242</h6>
                            <small className="text-secondary">Expires 12/24</small>
                        </div>
                        <button className="btn btn-outline-danger btn-sm">Remove</button>
                    </div>
                </div>
            </div>
            <button className="btn btn-primary">
                Add New Payment Method
            </button>
        </div>
    );

    return (
        <div className="dashboard-grid">
            <div className="third-width">
                <div className="card">
                    <div className="card-body">
                        <div className="settings-nav">
                            <button 
                                className={`nav-link w-100 text-start ${activeTab === 'profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                <FontAwesomeIcon icon={faUser} className="me-2" />
                                Profile
                            </button>
                            <button 
                                className={`nav-link w-100 text-start ${activeTab === 'security' ? 'active' : ''}`}
                                onClick={() => setActiveTab('security')}
                            >
                                <FontAwesomeIcon icon={faLock} className="me-2" />
                                Security
                            </button>
                            <button 
                                className={`nav-link w-100 text-start ${activeTab === 'notifications' ? 'active' : ''}`}
                                onClick={() => setActiveTab('notifications')}
                            >
                                <FontAwesomeIcon icon={faBell} className="me-2" />
                                Notifications
                            </button>
                            <button 
                                className={`nav-link w-100 text-start ${activeTab === 'preferences' ? 'active' : ''}`}
                                onClick={() => setActiveTab('preferences')}
                            >
                                <FontAwesomeIcon icon={faGlobe} className="me-2" />
                                Preferences
                            </button>
                            <button 
                                className={`nav-link w-100 text-start ${activeTab === 'payment' ? 'active' : ''}`}
                                onClick={() => setActiveTab('payment')}
                            >
                                <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                                Payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="two-thirds-width">
                <div className="card">
                    <div className="card-body">
                        {activeTab === 'profile' && renderProfileSettings()}
                        {activeTab === 'security' && renderSecuritySettings()}
                        {activeTab === 'notifications' && renderNotificationSettings()}
                        {activeTab === 'preferences' && renderPreferenceSettings()}
                        {activeTab === 'payment' && renderPaymentSettings()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings; 