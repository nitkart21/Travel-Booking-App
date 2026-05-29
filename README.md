# 🌍 Smart Travel AI - Full-Stack Travel Booking Platform

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-smart--travel--ai.netlify.app-00C7B7?style=for-the-badge)](https://smart-travel-ai.netlify.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge)](https://travel-booking-backend-y72y.onrender.com)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)

A modern, full-stack MERN travel booking application with AI-powered chatbot assistance. Book buses, hotels, and trip packages with intelligent recommendations powered by Groq LLM.

![Smart Travel AI](client/public/assets/landscape-morning-fog-mountains-with-hot-air-balloons-sunrise.jpg)

---

## 🔗 Live Demo

| Service | URL |
|---------|-----|
| 🌐 **Frontend** | [https://smart-travel-ai.netlify.app](https://smart-travel-ai.netlify.app) |
| 🖥️ **Backend API** | [https://travel-booking-backend-y72y.onrender.com](https://travel-booking-backend-y72y.onrender.com) |

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@travel.com` | `admin123` |
| **User** | `demo@travel.com` | `demo123` |

---

## ✨ Features

### 🎫 Travel Services
- 🚌 **Bus Booking** - 180+ bus routes across India
- 🏨 **Hotel Booking** - 90+ hotels in major cities
- ✈️ **Trip Packages** - 30+ curated travel packages
- � **Advanced Search** - Filter by type, location, price range
- ⭐ **Ratings & Reviews** - User reviews for all services

### 🤖 AI Travel Assistant
- Powered by **Groq LLM** (Llama 3.3 70B)
- Context-aware responses using real database data
- Travel recommendations and suggestions
- 24/7 instant assistance

### 🔐 Authentication & Security
- JWT-based secure authentication
- Password hashing with bcrypt
- Role-based access control (User/Admin)
- Protected API routes

### 👨‍💼 Admin Dashboard
- 📊 Real-time statistics (users, bookings, revenue)
- 📦 CRUD operations for travel services
- 👥 User management
- 📋 Booking management

### 📱 Responsive Design
- Mobile-first design approach
- Works on all devices (Desktop, Tablet, Mobile)
- Modern UI with smooth animations

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React.js 18** | UI library |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client |
| **React Icons** | Icon library |
| **React Toastify** | Toast notifications |
| **Custom CSS** | Styling with CSS variables |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **Groq SDK** | AI chatbot integration |

### Deployment
| Service | Platform |
|---------|----------|
| **Frontend** | Netlify |
| **Backend** | Render |
| **Database** | MongoDB Atlas |

---

## 📁 Project Structure

```
Travel_app/
├── 📂 backend/
│   ├── 📂 config/
│   │   └── db.js                 # MongoDB connection
│   ├── 📂 controllers/
│   │   ├── adminController.js    # Admin operations
│   │   ├── authController.js     # Authentication
│   │   ├── bookingController.js  # Booking management
│   │   ├── chatbotController.js  # AI chatbot (Groq)
│   │   ├── reviewController.js   # Reviews
│   │   └── travelController.js   # Travel services
│   ├── 📂 middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── errorMiddleware.js    # Error handling
│   ├── 📂 models/
│   │   ├── Booking.js            # Booking schema
│   │   ├── Review.js             # Review schema
│   │   ├── TravelService.js      # Service schema
│   │   └── User.js               # User schema
│   ├── 📂 routes/
│   │   ├── adminRoutes.js        # /api/admin
│   │   ├── authRoutes.js         # /api/auth
│   │   ├── bookingRoutes.js      # /api/bookings
│   │   ├── chatbotRoutes.js      # /api/chatbot
│   │   ├── reviewRoutes.js       # /api/reviews
│   │   └── travelRoutes.js       # /api/travel
│   ├── .env                      # Environment variables
│   ├── package.json
│   ├── seed.js                   # Database seeder
│   └── server.js                 # Entry point
│
├── 📂 client/
│   ├── 📂 public/
│   │   └── 📂 assets/            # Images
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── 📂 chatbot/
│   │   │   │   └── Chatbot.js    # AI chatbot UI
│   │   │   ├── 📂 common/
│   │   │   │   ├── Footer.js
│   │   │   │   ├── Header.js
│   │   │   │   └── Loader.js
│   │   │   └── 📂 travel/
│   │   │       └── TravelCard.js # Service cards
│   │   ├── 📂 context/
│   │   │   └── AuthContext.js    # Auth state
│   │   ├── 📂 pages/
│   │   │   ├── AdminDashboard.js # Admin panel
│   │   │   ├── BookingsPage.js   # User bookings
│   │   │   ├── FlightPage.js     # Flight search
│   │   │   ├── HomePage.js       # Landing page
│   │   │   ├── LoginPage.js      # Login
│   │   │   ├── ProfilePage.js    # User profile
│   │   │   ├── SearchPage.js     # Search results
│   │   │   ├── SignupPage.js     # Registration
│   │   │   └── TravelDetailPage.js # Service details
│   │   ├── 📂 services/
│   │   │   └── api.js            # Axios API config
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.production           # Production API URL
│   ├── netlify.toml              # Netlify config
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Groq API Key (free at [console.groq.com](https://console.groq.com))

### 1. Clone Repository
```bash
git clone https://github.com/avinashreddy1235/Travel-.git
cd Travel-
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials
```

**Backend `.env` file:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travel_booking
JWT_SECRET=your_super_secret_jwt_key_2024
JWT_EXPIRE=7d
GROQ_API_KEY=your_groq_api_key
```

### 3. Frontend Setup
```bash
cd client
npm install
```

### 4. Seed Database
```bash
cd backend
node seed.js
```
This creates 300 travel services and demo users.

### 5. Run Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

### 6. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Admin Panel**: http://localhost:3000/admin

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/profile` | Get profile |
| PUT | `/api/auth/profile` | Update profile |

### Travel Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/travel` | List all services |
| GET | `/api/travel/:id` | Service details |
| POST | `/api/travel` | Create (Admin) |
| PUT | `/api/travel/:id` | Update (Admin) |
| DELETE | `/api/travel/:id` | Delete (Admin) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | User bookings |
| POST | `/api/bookings` | Create booking |
| PUT | `/api/bookings/:id/cancel` | Cancel booking |

### AI Chatbot
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chatbot/message` | Send message |
| GET | `/api/chatbot/suggestions` | Get suggestions |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/users` | List users |
| DELETE | `/api/admin/users/:id` | Delete user |

---

## 🚀 Deployment

### Backend (Render)
1. Create Web Service on [render.com](https://render.com)
2. Connect GitHub repository
3. Set Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add environment variables

### Frontend (Netlify)
1. Create site on [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Base Directory: `client`
4. Build Command: `npm run build`
5. Publish Directory: `client/build`
6. Add `REACT_APP_API_URL` environment variable

---

## 📸 Screenshots

| Homepage | Search Results |
|----------|---------------|
| Landing page with hero section | Filtered travel services |

| Admin Dashboard | AI Chatbot |
|-----------------|------------|
| Statistics and management | Intelligent travel assistant |

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected API routes
- ✅ Role-based access control
- ✅ CORS configuration
- ✅ Input validation

---

## 👨‍💻 Author

**Avinash Reddy**

- GitHub: [@avinashreddy1235](https://github.com/avinashreddy1235)

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Groq](https://groq.com) for the AI API
- [MongoDB Atlas](https://mongodb.com/atlas) for database hosting
- [Render](https://render.com) for backend hosting
- [Netlify](https://netlify.com) for frontend hosting

---

<p align="center">
  Made with ❤️ for travel enthusiasts
  <br><br>
  <a href="https://smart-travel-ai.netlify.app">🌐 Visit Live Demo</a>
</p>
