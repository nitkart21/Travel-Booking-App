import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiUsers, FiStar } from 'react-icons/fi';

const TravelCard = ({ service }) => {
    const {
        _id,
        name,
        type,
        source,
        destination,
        price,
        duration,
        rating,
        reviewCount,
        availableSeats,
        images
    } = service;

    const getDefaultImage = () => {
        switch (type) {
            case 'trip':
                return '/assets/forest-landscape_119272-9.jpg';
            case 'hotel':
                return '/assets/Dubai image.jpg';
            case 'bus':
                return '/assets/landscape-morning-fog-mountains-with-hot-air-balloons-sunrise.jpg';
            default:
                return '/assets/forest-landscape_119272-9.jpg';
        }
    };

    const imageUrl = images && images.length > 0 ? images[0] : getDefaultImage();

    const getTypeColor = () => {
        switch (type) {
            case 'trip': return '#10b981';
            case 'hotel': return '#6366f1';
            case 'bus': return '#f59e0b';
            default: return '#00b4d8';
        }
    };

    return (
        <div className="travel-card">
            <img
                src={imageUrl}
                alt={name}
                className="travel-card-image"
                onError={(e) => {
                    e.target.src = getDefaultImage();
                }}
            />
            <div className="travel-card-content">
                <span
                    className="travel-card-type"
                    style={{ background: getTypeColor() }}
                >
                    {type}
                </span>
                <h3 className="travel-card-title">{name}</h3>
                <div className="travel-card-route">
                    <FiMapPin />
                    <span>{source} → {destination}</span>
                </div>
                <div className="travel-card-meta">
                    <span><FiClock /> {duration}</span>
                    <span><FiUsers /> {availableSeats} seats</span>
                </div>
                <div className="travel-card-footer">
                    <div>
                        <div className="travel-card-price">
                            ₹{price?.toLocaleString('en-IN')}
                            <span>/{type === 'hotel' ? 'night' : 'person'}</span>
                        </div>
                        <div className="travel-card-rating">
                            <FiStar fill="#f59e0b" />
                            <span>{rating?.toFixed(1) || '0.0'}</span>
                            <span style={{ color: 'var(--gray-500)' }}>({reviewCount || 0})</span>
                        </div>
                    </div>
                    <Link to={`/travel/${_id}`} className="btn btn-primary btn-sm">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TravelCard;
