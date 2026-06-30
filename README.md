# ✈️ TravelNest AI — Full-Stack MERN Travel Platform

A modern, AI-powered tour & travel website built with the MERN stack, Groq AI, and a stunning glassmorphism UI.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| AI | Groq SDK (Llama 3) |
| State | Zustand |
| HTTP | Axios |

---

## 📁 Project Structure

```
travelnest-ai/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Tour.js
│   │   ├── Booking.js
│   │   ├── Wishlist.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tours.js
│   │   ├── bookings.js
│   │   ├── wishlist.js
│   │   ├── admin.js
│   │   ├── reviews.js
│   │   └── ai.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── seed.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Tours.jsx
    │   │   ├── TourDetail.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AIPlanner.jsx
    │   │   └── Wishlist.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── TourCard.jsx
    │   │   ├── Loader.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── store/
    │   │   ├── authStore.js
    │   │   ├── wishlistStore.js
    │   │   └── themeStore.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Groq API Key (free at console.groq.com)

### 2. Backend Setup

```bash
cd backend
npm install

# Edit .env file:
# MONGO_URI=mongodb://localhost:27017/travelnest
# JWT_SECRET=your_super_secret_key
# GROQ_API_KEY=your_groq_api_key_here
# PORT=5000

# Seed the database
npm run seed

# Start backend
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start frontend
npm run dev
```

### 4. Access the App
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@travelnest.com | admin123 |
| User | priya@example.com | password123 |

---

## 🤖 AI Features (Groq)

1. **Trip Planner** — Enter destination, budget, days → get full AI itinerary
2. **AI Chat** — Ask anything about travel, destinations, visa, tips
3. **Quick Prompts** — One-click popular trip templates

> Get your free Groq API key at: https://console.groq.com

---

## 🎯 Features

### User Features
- ✅ JWT Auth (Login/Signup)
- ✅ Browse & filter tours
- ✅ Tour detail with itinerary
- ✅ Wishlist (save/remove)
- ✅ Book tours (no payment required)
- ✅ User dashboard with booking history
- ✅ Reviews & ratings
- ✅ AI trip planner (Groq)
- ✅ AI travel chat
- ✅ Dark mode
- ✅ Fully responsive

### Admin Features
- ✅ Stats overview (users, tours, bookings, revenue)
- ✅ Add/Edit/Delete tours
- ✅ Manage all bookings (update status)
- ✅ View/Delete users

---

## 🌱 Seed Data Includes
- 1 Admin user
- 5 Normal users
- 10 Tour packages (India + International)
- Sample bookings

---

## 📡 API Routes

| Method | Route | Description |
|---|---|---|
| POST | /api/auth/signup | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/tours | List tours (with filters) |
| GET | /api/tours/featured | Featured tours |
| GET | /api/tours/:id | Tour detail |
| POST | /api/tours | Create tour (admin) |
| PUT | /api/tours/:id | Update tour (admin) |
| DELETE | /api/tours/:id | Delete tour (admin) |
| POST | /api/bookings | Book a tour |
| GET | /api/bookings/my | My bookings |
| DELETE | /api/bookings/:id | Cancel booking |
| GET | /api/wishlist | Get wishlist |
| POST | /api/wishlist/toggle | Toggle wishlist |
| GET | /api/reviews/:tourId | Tour reviews |
| POST | /api/reviews | Add review |
| GET | /api/admin/stats | Admin stats |
| GET | /api/admin/users | All users |
| DELETE | /api/admin/users/:id | Delete user |
| GET | /api/admin/bookings | All bookings |
| PUT | /api/admin/bookings/:id | Update booking status |
| POST | /api/ai/travel | Generate itinerary |
| POST | /api/ai/chat | AI chat response |
