# 🥊 Octagon Oracle

> AI-Powered MMA Analytics Platform - Fight predictions, fighter comparisons, training tools, and gym finder.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

---

## 🚀 Quick Start (Docker - Recommended)

**Run the entire project with just 3 commands:**

```bash
# 1. Clone the repository
git clone https://github.com/Omermuhammadi/Octagon.git
cd Octagon

# 2. Start everything (MongoDB + Backend + Frontend)
docker-compose up --build -d

# 3. Import the UFC data (wait ~30 seconds for services to start first)
docker exec octagon-oracle-backend npm run import-data
```

### ✅ That's it! Open your browser:

| Service | URL |
|---------|-----|
| **Frontend** | [http://localhost:3001](http://localhost:3001) |
| **Backend API** | [http://localhost:5001/api](http://localhost:5001/api) |
| **Health Check** | [http://localhost:5001/api/health](http://localhost:5001/api/health) |

### 📋 Useful Docker Commands

```bash
# Check if all services are running
docker-compose ps

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mongodb

# Stop all services
docker-compose down

# Stop and remove all data (fresh start)
docker-compose down -v

# Rebuild after code changes
docker-compose up --build -d
```

---

## 🔐 Getting Started

After the services are running:

1. Open [http://localhost:3001](http://localhost:3001)
2. Click **"Get Started"** to register a new account
3. Choose your role: **Fan** or **Coach**
4. Explore the platform!

---

## ✨ Features

- 🔮 **AI Fight Predictions** - Data-driven fight outcome predictions with animated hero section
- 📊 **Fighter Comparison** - Compare any two fighters side-by-side with detailed stats
- 🏋️ **Training Hub** - Interactive lessons for MMA techniques (striking, grappling, footwork)
- 🛡️ **Self-Defense Guide** - Comprehensive self-defense scenarios and techniques
- 🏢 **Gym Finder** - Find MMA gyms across Pakistan with filters and directions
- 📅 **Event Tracking** - Upcoming and past UFC events
- 👤 **Dual Dashboards** - Personalized views for Fans and Coaches
- 🎨 **Premium Animations** - GSAP & Framer Motion powered typewriter effects and split text animations

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, GSAP |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB 7 with Mongoose ODM |
| **Auth** | JWT (JSON Web Tokens) with bcrypt |
| **Container** | Docker & Docker Compose |

---

## 📁 Project Structure

```
Octagon/
├── 📂 backend/                 # Express.js API Server
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Route handlers (auth, fighters, events)
│   │   ├── middleware/        # Auth middleware
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API route definitions
│   │   └── scripts/           # Data import scripts
│   ├── data/                  # CSV data files (fighters, events, stats)
│   └── Dockerfile
│
├── 📂 frontend/               # Next.js Web Application
│   ├── app/                   # App router pages
│   │   ├── (auth)/           # Login & Register
│   │   ├── comparison/       # Fighter comparison
│   │   ├── dashboard/        # Fan & Coach dashboards
│   │   ├── form-check/       # Form correction tool
│   │   ├── gyms/             # Gym finder
│   │   ├── prediction/       # Fight predictions
│   │   ├── profile/          # User profile
│   │   ├── self-defense/     # Self-defense guide
│   │   └── training/         # Training hub
│   ├── components/           # Reusable React components
│   ├── contexts/             # Auth context provider
│   ├── lib/                  # API client & utilities
│   └── Dockerfile
│
├── 📂 scripts/               # Database initialization
│   └── mongo-init.js
│
├── docker-compose.yml        # Docker orchestration
├── .env.example             # Environment template
└── README.md
```

---

## 🔌 API Endpoints

### Base URL: `http://localhost:5001/api`

#### Health Check
```
GET /api/health → { "status": "healthy", "timestamp": "..." }
```

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

#### Fighters
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/fighters` | Get all fighters (paginated) |
| GET | `/api/fighters/search?q=name` | Search fighters |
| GET | `/api/fighters/compare?ids=id1,id2` | Compare fighters |
| GET | `/api/fighters/:id` | Get fighter by ID |

#### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events |
| GET | `/api/events/upcoming` | Get upcoming events |
| GET | `/api/events/recent` | Get recent events |

---

## 🖥️ Local Development (Without Docker)

If you prefer running without Docker:

### Prerequisites
- Node.js 20+
- MongoDB 7+ (running locally or Atlas)

### Backend Setup
```bash
cd backend
npm install

# Create .env file with:
# MONGODB_URI=mongodb://localhost:27017/octagon-oracle
# JWT_SECRET=your-secret-key-at-least-32-characters
# PORT=5001

npm run import-data
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install

# Create .env.local file with:
# NEXT_PUBLIC_API_URL=http://localhost:5001/api

npm run dev
```

---

## 🔧 Environment Variables

The docker-compose.yml already has sensible defaults. For customization, create a `.env` file:

```env
# Ports (defaults)
FRONTEND_PORT=3001
BACKEND_PORT=5001
MONGO_PORT=27017

# Security
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d

# URLs
NEXT_PUBLIC_API_URL=http://localhost:5001/api
FRONTEND_URL=http://localhost:3001
```

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force

# Mac/Linux
lsof -i :3001
kill -9 <PID>
```

### Docker issues
```bash
# Full cleanup and restart
docker-compose down -v
docker system prune -f
docker-compose up --build -d
```

### Data not loading
```bash
# Wait for backend to be healthy, then re-import
docker-compose ps  # Check backend is "healthy"
docker exec octagon-oracle-backend npm run import-data
```

### Frontend can't connect to backend
```bash
# Check backend logs
docker-compose logs backend

# Ensure backend is healthy
curl http://localhost:5001/api/health
```

---

## 👥 Contributors

- **Omer Muhammadi** - Full Stack Development
- **Hamza Naeem** - Full Stack Development

---

## 📄 License

This project is licensed under the ISC License.
