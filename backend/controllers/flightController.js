const Amadeus = require('amadeus');
const { asyncHandler } = require('../middleware/errorMiddleware');

// Initialize Amadeus client
// Get your FREE API key from: https://developers.amadeus.com/
// Sign up -> Create App -> Get API Key and Secret
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY || 'YOUR_AMADEUS_API_KEY',
    clientSecret: process.env.AMADEUS_API_SECRET || 'YOUR_AMADEUS_API_SECRET'
});

// IATA city codes for major Indian cities
const cityCodeMap = {
    'vijayawada': 'VGA',
    'hyderabad': 'HYD',
    'chennai': 'MAA',
    'bangalore': 'BLR',
    'mumbai': 'BOM',
    'delhi': 'DEL',
    'kolkata': 'CCU',
    'pune': 'PNQ',
    'ahmedabad': 'AMD',
    'jaipur': 'JAI',
    'lucknow': 'LKO',
    'kochi': 'COK',
    'goa': 'GOI',
    'visakhapatnam': 'VTZ',
    'tirupati': 'TIR',
    'varanasi': 'VNS',
    'agra': 'AGR',
    'udaipur': 'UDR',
    'jodhpur': 'JDH',
    'srinagar': 'SXR',
    'leh': 'IXL',
    'guwahati': 'GAU',
    'bhubaneswar': 'BBI',
    'indore': 'IDR',
    'bhopal': 'BHO',
    'nagpur': 'NAG',
    'chandigarh': 'IXC',
    'amritsar': 'ATQ',
    'dehradun': 'DED',
    'patna': 'PAT',
    'ranchi': 'IXR',
    'raipur': 'RPR',
    'coimbatore': 'CJB',
    'madurai': 'IXM',
    'mangalore': 'IXE',
    'trichy': 'TRZ',
    'trivandrum': 'TRV',
    'kozhikode': 'CCJ',
    'mysore': 'MYQ',
    'hubli': 'HBX',
    'belgaum': 'IXG',
    'rajkot': 'RAJ',
    'surat': 'STV',
    'vadodara': 'BDQ',
    'aurangabad': 'IXU',
    'shimla': 'SLV',
    'kullu': 'KUU',
    'jammu': 'IXJ',
    'port blair': 'IXZ',
    'imphal': 'IMF',
    'agartala': 'IXA',
    'dibrugarh': 'DIB',
    'silchar': 'IXS'
};

// Get city code from name
const getCityCode = (cityName) => {
    if (!cityName) return null;
    const normalized = cityName.toLowerCase().trim();
    return cityCodeMap[normalized] || normalized.toUpperCase().substring(0, 3);
};

// @desc    Search flights using Amadeus API
// @route   GET /api/flights/search
// @access  Public
const searchFlights = asyncHandler(async (req, res) => {
    const {
        origin,
        destination,
        departureDate,
        returnDate,
        adults = 1,
        travelClass = 'ECONOMY',
        nonStop = false,
        maxPrice,
        currency = 'INR'
    } = req.query;

    // Validate required fields
    if (!origin || !destination || !departureDate) {
        res.status(400);
        throw new Error('Origin, destination, and departure date are required');
    }

    const originCode = getCityCode(origin);
    const destinationCode = getCityCode(destination);

    if (!originCode || !destinationCode) {
        res.status(400);
        throw new Error('Invalid origin or destination city');
    }

    try {
        // Build search parameters
        const searchParams = {
            originLocationCode: originCode,
            destinationLocationCode: destinationCode,
            departureDate: departureDate,
            adults: parseInt(adults),
            travelClass: travelClass,
            currencyCode: currency,
            max: 20 // Limit results
        };

        if (returnDate) {
            searchParams.returnDate = returnDate;
        }

        if (nonStop === 'true') {
            searchParams.nonStop = true;
        }

        if (maxPrice) {
            searchParams.maxPrice = parseInt(maxPrice);
        }

        // Search flights using Amadeus API
        const response = await amadeus.shopping.flightOffersSearch.get(searchParams);

        // Transform response for our frontend
        const flights = response.data.map(offer => ({
            id: offer.id,
            source: origin,
            destination: destination,
            price: {
                total: parseFloat(offer.price.total),
                currency: offer.price.currency
            },
            itineraries: offer.itineraries.map(itinerary => ({
                duration: itinerary.duration,
                segments: itinerary.segments.map(segment => ({
                    departure: {
                        airport: segment.departure.iataCode,
                        time: segment.departure.at,
                        terminal: segment.departure.terminal
                    },
                    arrival: {
                        airport: segment.arrival.iataCode,
                        time: segment.arrival.at,
                        terminal: segment.arrival.terminal
                    },
                    airline: segment.carrierCode,
                    flightNumber: `${segment.carrierCode}${segment.number}`,
                    aircraft: segment.aircraft?.code,
                    duration: segment.duration,
                    stops: segment.numberOfStops || 0
                }))
            })),
            bookingClass: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin,
            seatsAvailable: offer.numberOfBookableSeats || 0,
            lastTicketingDate: offer.lastTicketingDate,
            validatingAirline: offer.validatingAirlineCodes?.[0]
        }));

        res.json({
            success: true,
            count: flights.length,
            source: 'Amadeus Live API',
            data: flights,
            dictionaries: response.result?.dictionaries || {}
        });

    } catch (error) {
        console.error('Amadeus API Error:', error.response?.result || error.message);

        // If Amadeus API fails, return sample flight data
        const sampleFlights = generateSampleFlights(origin, destination, departureDate, adults);

        res.json({
            success: true,
            count: sampleFlights.length,
            source: 'Sample Data (API unavailable - Get free key from developers.amadeus.com)',
            data: sampleFlights
        });
    }
});

// Generate sample flight data when API is unavailable
const generateSampleFlights = (origin, destination, date, passengers) => {
    const airlines = [
        { code: 'AI', name: 'Air India', logo: '🇮🇳' },
        { code: '6E', name: 'IndiGo', logo: '🔵' },
        { code: 'SG', name: 'SpiceJet', logo: '🔴' },
        { code: 'UK', name: 'Vistara', logo: '💜' },
        { code: 'G8', name: 'Go First', logo: '🟢' },
        { code: 'I5', name: 'AirAsia India', logo: '❤️' }
    ];

    const flights = [];
    const basePrice = Math.floor(Math.random() * 3000) + 2500;

    for (let i = 0; i < 8; i++) {
        const airline = airlines[i % airlines.length];
        const departureHour = 6 + Math.floor(Math.random() * 14);
        const durationHours = Math.floor(Math.random() * 3) + 1;
        const arrivalHour = (departureHour + durationHours) % 24;

        flights.push({
            id: `FL${Date.now()}${i}`,
            source: origin,
            destination: destination,
            price: {
                total: basePrice + (i * 200) + Math.floor(Math.random() * 500),
                currency: 'INR'
            },
            itineraries: [{
                duration: `PT${durationHours}H${Math.floor(Math.random() * 60)}M`,
                segments: [{
                    departure: {
                        airport: getCityCode(origin),
                        time: `${date}T${departureHour.toString().padStart(2, '0')}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]}:00`
                    },
                    arrival: {
                        airport: getCityCode(destination),
                        time: `${date}T${arrivalHour.toString().padStart(2, '0')}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]}:00`
                    },
                    airline: airline.code,
                    airlineName: airline.name,
                    flightNumber: `${airline.code}${Math.floor(Math.random() * 900) + 100}`,
                    duration: `PT${durationHours}H${Math.floor(Math.random() * 60)}M`,
                    stops: 0
                }]
            }],
            bookingClass: ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS'][Math.floor(Math.random() * 3)],
            seatsAvailable: Math.floor(Math.random() * 50) + 5,
            validatingAirline: airline.code
        });
    }

    return flights.sort((a, b) => a.price.total - b.price.total);
};

// @desc    Get airport suggestions
// @route   GET /api/flights/airports
// @access  Public
const getAirports = asyncHandler(async (req, res) => {
    const { keyword } = req.query;

    if (!keyword || keyword.length < 2) {
        res.status(400);
        throw new Error('Please provide at least 2 characters for search');
    }

    try {
        const response = await amadeus.referenceData.locations.get({
            keyword: keyword,
            subType: Amadeus.location.any
        });

        const airports = response.data.map(location => ({
            code: location.iataCode,
            name: location.name,
            city: location.address?.cityName,
            country: location.address?.countryName,
            type: location.subType
        }));

        res.json({
            success: true,
            data: airports
        });

    } catch (error) {
        console.error('Airport search error:', error.message);

        // Return from local city codes
        const matches = Object.entries(cityCodeMap)
            .filter(([city]) => city.includes(keyword.toLowerCase()))
            .map(([city, code]) => ({
                code: code,
                name: city.charAt(0).toUpperCase() + city.slice(1),
                city: city.charAt(0).toUpperCase() + city.slice(1),
                country: 'India'
            }));

        res.json({
            success: true,
            data: matches
        });
    }
});

// @desc    Get all supported cities
// @route   GET /api/flights/cities
// @access  Public
const getSupportedCities = asyncHandler(async (req, res) => {
    const cities = Object.entries(cityCodeMap).map(([name, code]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        code: code
    }));

    res.json({
        success: true,
        count: cities.length,
        data: cities.sort((a, b) => a.name.localeCompare(b.name))
    });
});

// @desc    Get flight price analysis
// @route   GET /api/flights/price-analysis
// @access  Public
const getPriceAnalysis = asyncHandler(async (req, res) => {
    const { origin, destination } = req.query;

    if (!origin || !destination) {
        res.status(400);
        throw new Error('Origin and destination are required');
    }

    const originCode = getCityCode(origin);
    const destinationCode = getCityCode(destination);

    try {
        const response = await amadeus.analytics.itineraryPriceMetrics.get({
            originIataCode: originCode,
            destinationIataCode: destinationCode,
            departureDate: new Date().toISOString().split('T')[0]
        });

        res.json({
            success: true,
            data: response.data
        });

    } catch (error) {
        // Return mock analysis
        const avgPrice = Math.floor(Math.random() * 5000) + 3000;

        res.json({
            success: true,
            source: 'Sample Analysis',
            data: {
                origin: originCode,
                destination: destinationCode,
                priceMetrics: {
                    minimum: avgPrice - 1000,
                    average: avgPrice,
                    maximum: avgPrice + 2000,
                    median: avgPrice + 200
                },
                recommendation: avgPrice < 4000 ? 'Good time to book!' : 'Prices are average'
            }
        });
    }
});

module.exports = {
    searchFlights,
    getAirports,
    getSupportedCities,
    getPriceAnalysis
};
