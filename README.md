# 🥊 Octagon Oracle

> MMA Analytics Platform - Fight predictions, fighter comparisons, and training tools powered by data.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation Options](#-installation-options)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 🔮 **Fight Predictions** - AI-powered fight outcome predictions
- 📊 **Fighter Comparison** - Compare fighter statistics side-by-side
- 🏋️ **Training Tools** - Form correction and training programs
- 📅 **Event Tracking** - Upcoming and past UFC events
- 👤 **User Dashboards** - Personalized dashboards for fans and coaches
- 🔐 **Authentication** - Secure JWT-based authentication

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JWT (JSON Web Tokens) |
| **Container** | Docker & Docker Compose |

## 🚀 Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended)
- OR [Node.js 20+](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community)
- Git

### Option 1: Docker (Recommended) 🐳

The easiest way to run the entire application:

```bash
# 1. Clone the repository
git clone https://github.com/hamzanaeem10/Octagon-Oracle.git
cd Octagon-Oracle

# 2. Copy environment file
cp .env.example .env

# 3. Start all services (MongoDB + Backend + Frontend)
docker-compose up -d

# 4. Wait for services to be healthy (about 30-60 seconds)
docker-compose ps

# 5. Import UFC data into MongoDB
docker exec octagon-oracle-backend npm run import-data
```

🎉 **That's it!** Open [http://localhost:3001](http://localhost:3001) in your browser.

### Option 2: Local Development

If you prefer running without Docker:

#### Step 1: Install MongoDB

**Windows:**
```powershell
# Using winget
winget install MongoDB.Server

# OR download from https://www.mongodb.com/try/download/community
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### Step 2: Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Import UFC data
npm run import-data

# Start development server
npm run dev
```

#### Step 3: Setup Frontend

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

🎉 Open [http://localhost:3001](http://localhost:3001) in your browser.

## 📁 Project Structure

```
octagon-oracle/
├── 📂 backend/                 # Express.js API Server
│   ├── src/
│   │   ├── config/            # Database & app configuration
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth & validation middleware
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API route definitions
│   │   └── scripts/           # Data import scripts
│   ├── data/                  # CSV data files
│   └── Dockerfile
│
├── 📂 frontend/               # Next.js Web Application
│   ├── app/                   # Next.js app router pages
│   ├── components/            # React components
│   ├── contexts/              # React context providers
│   ├── lib/                   # Utilities & API client
│   └── Dockerfile
│
├── 📂 scripts/                # Database initialization
│   └── mongo-init.js
│
├── docker-compose.yml         # Docker orchestration
├── .env.example              # Environment template
└── README.md
```

## 🔌 API Documentation

### Base URL
- **Local:** `http://localhost:5001/api`
- **Docker:** `http://localhost:5001/api`

### Endpoints

#### Health Check
```
GET /api/health
```

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (Auth required) |
| PUT | `/api/auth/profile` | Update profile (Auth required) |

#### Fighters
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/fighters` | Get all fighters (paginated) |
| GET | `/api/fighters/search?q=name` | Search fighters |
| GET | `/api/fighters/compare?fighter1=id&fighter2=id` | Compare two fighters |
| GET | `/api/fighters/:id` | Get fighter by ID |

#### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events (paginated) |
| GET | `/api/events/upcoming` | Get upcoming events |
| GET | `/api/events/recent` | Get recent events |
| GET | `/api/events/search?q=name` | Search events |

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_PORT` | Frontend port | `3001` |
| `BACKEND_PORT` | Backend port | `5001` |
| `MONGO_PORT` | MongoDB port | `27017` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/octagon-oracle` |
| `JWT_SECRET` | JWT signing secret | (change in production!) |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `NEXT_PUBLIC_API_URL` | API URL for frontend | `http://localhost:5001/api` |

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v

# Rebuild images
docker-compose up -d --build

# Import data into MongoDB
docker exec octagon-oracle-backend npm run import-data

# Access MongoDB shell
docker exec -it octagon-oracle-mongodb mongosh octagon-oracle
```

## 🗄️ MongoDB Guide

### Using Docker (Automatic)
MongoDB is automatically set up when you run `docker-compose up`. The database is:
- **Pre-configured** with collections and indexes
- **Persistent** - data survives container restarts
- **Accessible** at `localhost:27017`

### Using Local MongoDB

1. **Install MongoDB** (see installation steps above)

2. **Start MongoDB Service:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongodb
   ```

3. **Connect to MongoDB:**
   ```bash
   mongosh mongodb://localhost:27017/octagon-oracle
   ```

4. **Useful MongoDB Commands:**
   ```javascript
   // Show all collections
   show collections
   
   // Count fighters
   db.fighters.countDocuments()
   
   // Search fighter
   db.fighters.findOne({ name: /McGregor/i })
   
   // View upcoming events
   db.events.find({ status: 'upcoming' }).sort({ date: 1 })
   ```

### Using MongoDB Atlas (Cloud)

1. Create free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free M0 cluster
3. Get connection string
4. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/octagon-oracle
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

<p align="center">
  Made with ❤️ for MMA fans and fighters
</p>
