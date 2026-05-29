import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiSearch, FiChevronDown } from 'react-icons/fi';
import { travelAPI } from '../services/api';
import TravelCard from '../components/travel/TravelCard';
import Loader from '../components/common/Loader';
import './SearchPage.css';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [pagination, setPagination] = useState({});

    const [filters, setFilters] = useState({
        type: searchParams.get('type') || '',
        source: searchParams.get('source') || '',
        destination: searchParams.get('destination') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || '',
        search: searchParams.get('search') || '',
        page: 1
    });

    useEffect(() => {
        fetchServices();
    }, [filters]);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const params = {};
            Object.keys(filters).forEach(key => {
                if (filters[key]) params[key] = filters[key];
            });

            const response = await travelAPI.getAll(params);
            setServices(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, page: 1 };
        setFilters(newFilters);

        // Update URL params
        const params = new URLSearchParams();
        Object.keys(newFilters).forEach(k => {
            if (newFilters[k]) params.set(k, newFilters[k]);
        });
        setSearchParams(params);
    };

    const clearFilters = () => {
        const cleared = {
            type: '',
            source: '',
            destination: '',
            minPrice: '',
            maxPrice: '',
            sort: '',
            search: '',
            page: 1
        };
        setFilters(cleared);
        setSearchParams({});
    };

    const loadMore = () => {
        setFilters({ ...filters, page: filters.page + 1 });
    };

    const hasActiveFilters = Object.values(filters).some(v => v && v !== 1);

    return (
        <div className="search-page">
            <div className="page-header">
                <div className="container">
                    <h1>Explore Travel Services</h1>
                    <p>Find the perfect trip, hotel, or bus for your journey</p>
                </div>
            </div>

            <div className="container">
                <div className="search-layout">
                    {/* Filters Sidebar */}
                    <aside className={`filters-sidebar ${showFilters ? 'active' : ''}`}>
                        <div className="filters-header">
                            <h3><FiFilter /> Filters</h3>
                            {hasActiveFilters && (
                                <button className="clear-filters" onClick={clearFilters}>
                                    Clear All
                                </button>
                            )}
                            <button className="close-filters" onClick={() => setShowFilters(false)}>
                                <FiX />
                            </button>
                        </div>

                        <div className="filter-group">
                            <label>Search</label>
                            <div className="search-input-wrapper">
                                <FiSearch />
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Service Type</label>
                            <div className="filter-buttons">
                                <button
                                    className={`filter-btn ${filters.type === '' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('type', '')}
                                >
                                    All
                                </button>
                                <button
                                    className={`filter-btn ${filters.type === 'trip' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('type', 'trip')}
                                >
                                    Trips
                                </button>
                                <button
                                    className={`filter-btn ${filters.type === 'hotel' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('type', 'hotel')}
                                >
                                    Hotels
                                </button>
                                <button
                                    className={`filter-btn ${filters.type === 'bus' ? 'active' : ''}`}
                                    onClick={() => handleFilterChange('type', 'bus')}
                                >
                                    Buses
                                </button>
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Source</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="From city"
                                value={filters.source}
                                onChange={(e) => handleFilterChange('source', e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <label>Destination</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="To city"
                                value={filters.destination}
                                onChange={(e) => handleFilterChange('destination', e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            <label>Price Range</label>
                            <div className="price-inputs">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                />
                            </div>
                        </div>
                    </aside>

                    {/* Results */}
                    <main className="search-results">
                        <div className="results-header">
                            <p>
                                {loading ? 'Searching...' : `${pagination.totalItems || 0} results found`}
                            </p>
                            <div className="results-actions">
                                <select
                                    className="sort-select"
                                    value={filters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                >
                                    <option value="">Relevance</option>
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="price_high">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                                <button
                                    className="mobile-filter-btn"
                                    onClick={() => setShowFilters(true)}
                                >
                                    <FiFilter /> Filters
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <Loader text="Finding best options for you..." />
                        ) : services.length === 0 ? (
                            <div className="no-results">
                                <h3>No services found</h3>
                                <p>Try adjusting your filters or search criteria</p>
                                <button className="btn btn-primary" onClick={clearFilters}>
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="travel-grid">
                                    {services.map(service => (
                                        <TravelCard key={service._id} service={service} />
                                    ))}
                                </div>

                                {pagination.hasMore && (
                                    <div className="load-more">
                                        <button className="btn btn-outline" onClick={loadMore}>
                                            Load More <FiChevronDown />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
