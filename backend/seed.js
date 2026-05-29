const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const TravelService = require('./models/TravelService');
const Booking = require('./models/Booking');
const Review = require('./models/Review');

// Major Indian Cities
const cities = [
    'Vijayawada', 'Hyderabad', 'Chennai', 'Bangalore', 'Mumbai', 'Delhi',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kochi', 'Goa',
    'Visakhapatnam', 'Tirupati', 'Guntur', 'Warangal', 'Mysore', 'Coimbatore',
    'Madurai', 'Varanasi', 'Agra', 'Udaipur', 'Jodhpur', 'Shimla', 'Manali',
    'Darjeeling', 'Guwahati', 'Bhubaneswar', 'Raipur', 'Indore', 'Bhopal',
    'Nagpur', 'Surat', 'Vadodara', 'Amritsar', 'Chandigarh', 'Dehradun'
];

// Bus operators
const busOperators = [
    'APSRTC Garuda', 'TSRTC', 'KSRTC', 'Orange Travels', 'SRS Travels',
    'VRL Travels', 'Kaveri Travels', 'National Travels', 'Kesineni Travels',
    'Kallada Travels', 'Paulo Travels', 'Neeta Travels', 'Jabbar Travels',
    'Morning Star', 'SVR Travels', 'SRM Travels', 'Diwakar Travels'
];

// Bus types
const busTypes = [
    'AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Non-AC Seater',
    'Volvo Multi-Axle', 'Mercedes Benz', 'Scania', 'AC Semi-Sleeper'
];

// Hotel chains
const hotelChains = [
    'Taj', 'Oberoi', 'ITC', 'Marriott', 'Hyatt', 'Radisson', 'Holiday Inn',
    'Novotel', 'Lemon Tree', 'OYO Premium', 'Treebo', 'FabHotel', 'Ginger'
];

// Trip packages
const tripTypes = [
    'Heritage Tour', 'Beach Holiday', 'Hill Station Escape', 'Wildlife Safari',
    'Pilgrimage Tour', 'Adventure Trek', 'Honeymoon Package', 'Family Vacation',
    'Weekend Getaway', 'Cultural Experience', 'Backpacking Trip', 'Luxury Tour'
];

// Generate random price
const randomPrice = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate random rating
const randomRating = () => (Math.random() * 2 + 3).toFixed(1); // 3.0 to 5.0

// Generate random seats
const randomSeats = () => Math.floor(Math.random() * 30) + 5;

// Generate bus services between major routes
const generateBusServices = () => {
    const buses = [];

    // Key routes from Vijayawada
    const vijayawadaRoutes = [
        { to: 'Hyderabad', distance: '275 km', duration: '5 hours', basePrice: 400 },
        { to: 'Chennai', distance: '450 km', duration: '7 hours', basePrice: 600 },
        { to: 'Bangalore', distance: '480 km', duration: '8 hours', basePrice: 700 },
        { to: 'Kolkata', distance: '1200 km', duration: '20 hours', basePrice: 1500 },
        { to: 'Mumbai', distance: '900 km', duration: '14 hours', basePrice: 1200 },
        { to: 'Delhi', distance: '1500 km', duration: '24 hours', basePrice: 1800 },
        { to: 'Tirupati', distance: '380 km', duration: '6 hours', basePrice: 500 },
        { to: 'Visakhapatnam', distance: '350 km', duration: '6 hours', basePrice: 450 },
        { to: 'Guntur', distance: '35 km', duration: '1 hour', basePrice: 80 },
        { to: 'Kochi', distance: '700 km', duration: '12 hours', basePrice: 900 },
        { to: 'Pune', distance: '750 km', duration: '12 hours', basePrice: 1000 },
        { to: 'Goa', distance: '650 km', duration: '10 hours', basePrice: 850 },
    ];

    // Generate multiple buses for each Vijayawada route
    vijayawadaRoutes.forEach(route => {
        for (let i = 0; i < 5; i++) {
            const operator = busOperators[Math.floor(Math.random() * busOperators.length)];
            const busType = busTypes[Math.floor(Math.random() * busTypes.length)];
            const priceMultiplier = busType.includes('Volvo') || busType.includes('Mercedes') ? 1.5 :
                busType.includes('AC Sleeper') ? 1.3 :
                    busType.includes('Non-AC') ? 0.7 : 1;

            const departureHour = Math.floor(Math.random() * 24);
            const departureTime = `${departureHour.toString().padStart(2, '0')}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]}`;

            buses.push({
                name: `${operator} - ${busType}`,
                type: 'bus',
                source: 'Vijayawada',
                destination: route.to,
                price: Math.round(route.basePrice * priceMultiplier),
                duration: route.duration,
                description: `${operator} ${busType} bus service from Vijayawada to ${route.to}. Distance: ${route.distance}. Departure: ${departureTime}. Comfortable journey with professional drivers.`,
                images: ['/assets/landscape-morning-fog-mountains-with-hot-air-balloons-sunrise.jpg'],
                amenities: busType.includes('AC') ?
                    ['Air Conditioning', 'Charging Point', 'Blanket', 'Water Bottle', 'Emergency Exit'] :
                    ['Charging Point', 'Water Bottle', 'Emergency Exit'],
                rating: parseFloat(randomRating()),
                reviewCount: Math.floor(Math.random() * 500) + 50,
                availableSeats: randomSeats(),
                departureDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
                departureTime: departureTime
            });
        }
    });

    // Generate buses between other major city pairs
    const majorRoutes = [
        { from: 'Hyderabad', to: 'Chennai', basePrice: 700 },
        { from: 'Hyderabad', to: 'Bangalore', basePrice: 800 },
        { from: 'Hyderabad', to: 'Mumbai', basePrice: 1000 },
        { from: 'Hyderabad', to: 'Kolkata', basePrice: 1600 },
        { from: 'Chennai', to: 'Bangalore', basePrice: 500 },
        { from: 'Chennai', to: 'Kochi', basePrice: 700 },
        { from: 'Chennai', to: 'Madurai', basePrice: 400 },
        { from: 'Bangalore', to: 'Mumbai', basePrice: 1100 },
        { from: 'Bangalore', to: 'Goa', basePrice: 600 },
        { from: 'Bangalore', to: 'Mysore', basePrice: 200 },
        { from: 'Mumbai', to: 'Pune', basePrice: 300 },
        { from: 'Mumbai', to: 'Goa', basePrice: 700 },
        { from: 'Mumbai', to: 'Delhi', basePrice: 1500 },
        { from: 'Delhi', to: 'Jaipur', basePrice: 400 },
        { from: 'Delhi', to: 'Agra', basePrice: 300 },
        { from: 'Delhi', to: 'Chandigarh', basePrice: 350 },
        { from: 'Delhi', to: 'Shimla', basePrice: 500 },
        { from: 'Delhi', to: 'Manali', basePrice: 800 },
        { from: 'Kolkata', to: 'Bhubaneswar', basePrice: 500 },
        { from: 'Kolkata', to: 'Guwahati', basePrice: 700 },
    ];

    majorRoutes.forEach(route => {
        for (let i = 0; i < 3; i++) {
            const operator = busOperators[Math.floor(Math.random() * busOperators.length)];
            const busType = busTypes[Math.floor(Math.random() * busTypes.length)];
            const priceMultiplier = busType.includes('Volvo') ? 1.5 : busType.includes('AC') ? 1.2 : 0.8;

            buses.push({
                name: `${operator} - ${busType}`,
                type: 'bus',
                source: route.from,
                destination: route.to,
                price: Math.round(route.basePrice * priceMultiplier),
                duration: `${Math.floor(route.basePrice / 80)} hours`,
                description: `${operator} ${busType} bus from ${route.from} to ${route.to}. Comfortable seating with amenities.`,
                images: ['/assets/landscape-morning-fog-mountains-with-hot-air-balloons-sunrise.jpg'],
                amenities: ['Charging Point', 'Water Bottle', busType.includes('AC') ? 'Air Conditioning' : 'Fan'],
                rating: parseFloat(randomRating()),
                reviewCount: Math.floor(Math.random() * 300) + 20,
                availableSeats: randomSeats(),
                departureDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
            });

            // Add reverse route
            buses.push({
                name: `${operator} - ${busType}`,
                type: 'bus',
                source: route.to,
                destination: route.from,
                price: Math.round(route.basePrice * priceMultiplier),
                duration: `${Math.floor(route.basePrice / 80)} hours`,
                description: `${operator} ${busType} bus from ${route.to} to ${route.from}. Comfortable seating with amenities.`,
                images: ['/assets/landscape-morning-fog-mountains-with-hot-air-balloons-sunrise.jpg'],
                amenities: ['Charging Point', 'Water Bottle', busType.includes('AC') ? 'Air Conditioning' : 'Fan'],
                rating: parseFloat(randomRating()),
                reviewCount: Math.floor(Math.random() * 300) + 20,
                availableSeats: randomSeats(),
                departureDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
            });
        }
    });

    return buses;
};

// Generate hotels in major cities
const generateHotels = () => {
    const hotels = [];

    const hotelCities = [
        { city: 'Vijayawada', attractions: 'Kanaka Durga Temple, Prakasam Barrage' },
        { city: 'Hyderabad', attractions: 'Charminar, Golconda Fort, Ramoji Film City' },
        { city: 'Chennai', attractions: 'Marina Beach, Kapaleeshwarar Temple' },
        { city: 'Bangalore', attractions: 'Lalbagh, Cubbon Park, MG Road' },
        { city: 'Mumbai', attractions: 'Gateway of India, Marine Drive, Juhu Beach' },
        { city: 'Delhi', attractions: 'Red Fort, India Gate, Qutub Minar' },
        { city: 'Kolkata', attractions: 'Victoria Memorial, Howrah Bridge' },
        { city: 'Goa', attractions: 'Beaches, Basilica of Bom Jesus, Dudhsagar Falls' },
        { city: 'Jaipur', attractions: 'Hawa Mahal, Amber Fort, City Palace' },
        { city: 'Agra', attractions: 'Taj Mahal, Agra Fort, Fatehpur Sikri' },
        { city: 'Udaipur', attractions: 'Lake Pichola, City Palace, Jag Mandir' },
        { city: 'Shimla', attractions: 'Mall Road, Ridge, Jakhu Temple' },
        { city: 'Manali', attractions: 'Solang Valley, Rohtang Pass, Hadimba Temple' },
        { city: 'Kochi', attractions: 'Fort Kochi, Chinese Fishing Nets, Mattancherry' },
        { city: 'Mysore', attractions: 'Mysore Palace, Brindavan Gardens' },
        { city: 'Varanasi', attractions: 'Kashi Vishwanath Temple, Ghats' },
        { city: 'Tirupati', attractions: 'Tirumala Temple, Silathoranam' },
        { city: 'Visakhapatnam', attractions: 'RK Beach, Kailasagiri, Submarine Museum' },
    ];

    hotelCities.forEach(location => {
        // Generate 4-5 hotels per city
        for (let i = 0; i < 5; i++) {
            const chain = hotelChains[Math.floor(Math.random() * hotelChains.length)];
            const stars = Math.floor(Math.random() * 3) + 3; // 3 to 5 stars
            const basePrice = stars === 5 ? 8000 : stars === 4 ? 4000 : 2000;

            hotels.push({
                name: `${chain} ${location.city}`,
                type: 'hotel',
                source: location.city,
                destination: location.city,
                price: randomPrice(basePrice * 0.8, basePrice * 1.5),
                duration: 'Per Night',
                description: `${stars}-star ${chain} hotel in ${location.city}. Near ${location.attractions}. Experience luxury accommodation with world-class amenities and exceptional service.`,
                images: ['/assets/Dubai image.jpg'],
                amenities: stars >= 4 ?
                    ['WiFi', 'Swimming Pool', 'Gym', 'Restaurant', 'Room Service', 'Spa', 'Parking', 'AC', 'TV', 'Mini Bar'] :
                    ['WiFi', 'Restaurant', 'Room Service', 'Parking', 'AC', 'TV'],
                rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
                reviewCount: Math.floor(Math.random() * 1000) + 100,
                availableSeats: Math.floor(Math.random() * 50) + 10, // Available rooms
            });
        }
    });

    return hotels;
};

// Generate trip packages
const generateTrips = () => {
    const trips = [];

    const tripPackages = [
        { name: 'Golden Triangle Tour', source: 'Delhi', destination: 'Agra', duration: '5D/4N', basePrice: 25000, desc: 'Delhi-Agra-Jaipur circuit covering Taj Mahal, Red Fort, and Amber Fort' },
        { name: 'Kerala Backwaters Experience', source: 'Kochi', destination: 'Alleppey', duration: '4D/3N', basePrice: 18000, desc: 'Houseboat stay, Ayurvedic spa, and backwater cruise' },
        { name: 'Goa Beach Carnival', source: 'Mumbai', destination: 'Goa', duration: '4D/3N', basePrice: 15000, desc: 'Beach hopping, water sports, nightlife, and Portuguese heritage' },
        { name: 'Himalayan Adventure', source: 'Delhi', destination: 'Manali', duration: '6D/5N', basePrice: 22000, desc: 'Trekking, paragliding, river rafting, and mountain camping' },
        { name: 'Rajasthan Royal Heritage', source: 'Jaipur', destination: 'Udaipur', duration: '7D/6N', basePrice: 35000, desc: 'Palaces, desert safari, folk culture, and luxury stay' },
        { name: 'South India Temple Tour', source: 'Chennai', destination: 'Madurai', duration: '5D/4N', basePrice: 16000, desc: 'Meenakshi Temple, Rameshwaram, and Kanyakumari' },
        { name: 'Andhra Pradesh Heritage', source: 'Vijayawada', destination: 'Tirupati', duration: '3D/2N', basePrice: 12000, desc: 'Tirumala Temple, Kanaka Durga Temple, and Araku Valley' },
        { name: 'Northeast Explorer', source: 'Kolkata', destination: 'Darjeeling', duration: '5D/4N', basePrice: 20000, desc: 'Tea gardens, Himalayan views, and toy train ride' },
        { name: 'Varanasi Spiritual Journey', source: 'Delhi', destination: 'Varanasi', duration: '3D/2N', basePrice: 14000, desc: 'Ganga Aarti, temple visits, and boat ride on Ganges' },
        { name: 'Mumbai-Goa Road Trip', source: 'Mumbai', destination: 'Goa', duration: '5D/4N', basePrice: 18000, desc: 'Coastal highway drive with beach stops and local cuisine' },
        { name: 'Hyderabad Food & Heritage', source: 'Vijayawada', destination: 'Hyderabad', duration: '2D/1N', basePrice: 8000, desc: 'Charminar, Golconda Fort, and authentic Hyderabadi Biryani' },
        { name: 'Karnataka Circuit', source: 'Bangalore', destination: 'Mysore', duration: '4D/3N', basePrice: 15000, desc: 'Mysore Palace, Coorg hills, and Hampi ruins' },
        { name: 'Araku Valley Retreat', source: 'Vijayawada', destination: 'Visakhapatnam', duration: '3D/2N', basePrice: 10000, desc: 'Coffee plantations, Borra Caves, and tribal culture' },
        { name: 'Kashmir Paradise', source: 'Delhi', destination: 'Srinagar', duration: '6D/5N', basePrice: 30000, desc: 'Dal Lake, Mughal Gardens, Gulmarg, and Pahalgam' },
        { name: 'Leh Ladakh Expedition', source: 'Delhi', destination: 'Leh', duration: '8D/7N', basePrice: 40000, desc: 'High altitude adventure, monasteries, and Pangong Lake' },
    ];

    tripPackages.forEach(pkg => {
        // Create multiple variants of each package
        for (let i = 0; i < 2; i++) {
            const priceVariant = i === 0 ? 'Budget' : 'Premium';
            const priceMultiplier = i === 0 ? 1 : 1.8;

            trips.push({
                name: `${pkg.name} - ${priceVariant}`,
                type: 'trip',
                source: pkg.source,
                destination: pkg.destination,
                price: Math.round(pkg.basePrice * priceMultiplier),
                duration: pkg.duration,
                description: `${pkg.desc}. ${priceVariant} package includes ${priceVariant === 'Premium' ? 'luxury hotels, private transfers, and guided tours' : 'comfortable stays and group transfers'}.`,
                images: ['/assets/goa_pak.jpg'],
                amenities: priceVariant === 'Premium' ?
                    ['Luxury Hotel', 'Private Transfer', 'All Meals', 'Guide', 'Entry Tickets', 'Travel Insurance', 'Airport Pickup'] :
                    ['Standard Hotel', 'Group Transfer', 'Breakfast', 'Entry Tickets'],
                rating: parseFloat((3.8 + Math.random() * 1.2).toFixed(1)),
                reviewCount: Math.floor(Math.random() * 500) + 50,
                availableSeats: Math.floor(Math.random() * 20) + 5,
                departureDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000),
            });
        }
    });

    return trips;
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const seedDatabase = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await TravelService.deleteMany({});
        await Booking.deleteMany({});
        await Review.deleteMany({});
        console.log('Cleared existing data');

        // Create admin user
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@travel.com',
            password: 'admin123',
            phone: '9876543210',
            role: 'admin'
        });
        console.log('Admin user created: admin@travel.com / admin123');

        // Create demo user
        const demoUser = await User.create({
            name: 'Demo User',
            email: 'demo@travel.com',
            password: 'demo123',
            phone: '9876543211',
            role: 'user'
        });
        console.log('Demo user created: demo@travel.com / demo123');

        // Generate and insert all travel services
        const buses = generateBusServices();
        const hotels = generateHotels();
        const trips = generateTrips();

        const allServices = [...buses, ...hotels, ...trips];

        await TravelService.insertMany(allServices);

        console.log(`\n=== Seed Complete ===`);
        console.log(`Buses created: ${buses.length}`);
        console.log(`Hotels created: ${hotels.length}`);
        console.log(`Trip packages created: ${trips.length}`);
        console.log(`Total services: ${allServices.length}`);
        console.log(`\nAdmin Login: admin@travel.com / admin123`);
        console.log(`Demo Login: demo@travel.com / demo123`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
