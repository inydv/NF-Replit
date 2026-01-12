# NursingFront - Job Board Platform

A full-stack job board application for nursing professionals, built with React (Vite) frontend and Node.js/Express backend.

## 🏗️ Project Architecture

```
NursingFront-replit/
├── client/                 # React Frontend (Vite + React 18)
│   ├── src/
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   ├── Components/    # Reusable React components
│   │   ├── Pages/         # Page components
│   │   ├── Routes/        # Route definitions
│   │   ├── Services/      # API service calls
│   │   ├── Context/       # React Context providers
│   │   └── Configs/       # Frontend configurations
│   └── package.json
│
├── server/                 # Node.js Backend (Express 5)
│   ├── src/
│   │   ├── index.js       # Entry point
│   │   ├── configs/       # Server configurations
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API route definitions
│   │   ├── middlewares/   # Express middlewares
│   │   ├── services/      # Business logic
│   │   ├── validations/   # Input validation
│   │   └── utils/         # Utility functions
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
│
└── package.json           # Root workspace config
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Environment variables (see `server/sample.env`)

### Setup
1. Copy `server/sample.env` to `server/.env` and configure
2. Run migrations: `cd server && npm run prisma:migration:up`
3. Start development: `npm run dev`

## 📁 Key Files for AI Agents

### Entry Points
- **Frontend:** `client/src/main.jsx` → `client/src/App.jsx`
- **Backend:** `server/src/index.js`

### Configuration Files
- **Frontend Config:** `client/vite.config.js`
- **Backend Config:** `server/src/configs/expressApp.config.js`
- **Database Schema:** `server/prisma/schema.prisma`
- **Environment:** `server/.env` (create from `server/sample.env`)

### Important Directories
- **Frontend Components:** `client/src/Components/`
- **Frontend Pages:** `client/src/Pages/`
- **Backend Controllers:** `server/src/controllers/`
- **Backend Routes:** `server/src/routes/`
- **API Services:** `client/src/Services/`

## 🛠️ Development

### Running the App
```bash
npm run dev              # Run both client and server
npm run dev:server       # Run server only
npm run dev:client       # Run client only
```

### Database Operations
```bash
npm run prisma:migrate   # Create and apply migrations
npm run prisma:studio    # Open Prisma Studio (database GUI)
npm run prisma:generate  # Regenerate Prisma client
```

### Building
```bash
npm run build            # Build frontend for production
```

## 🔧 Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Material-UI
- React Router
- Firebase (Auth)
- Axios

**Backend:**
- Node.js
- Express 5
- Prisma ORM
- PostgreSQL
- Firebase Admin SDK
- Stripe
- Cloudinary

## 📚 Documentation

- **Replit Guide:** `replit.md` - Complete Replit setup and usage
- **Quick Start:** `REPLIT_QUICK_START.md` - Quick reference for Replit
- **Replit Agent Guide:** `REPLIT_AGENT_GUIDE.md` - Using Replit Agent with this codebase

## 🎯 Common Tasks

### Adding a New API Endpoint
1. Create controller in `server/src/controllers/`
2. Add route in `server/src/routes/`
3. Register route in `server/src/configs/expressApp.config.js`

### Adding a New Frontend Page
1. Create page component in `client/src/Pages/`
2. Add route in `client/src/Routes/`
3. Update navigation if needed

### Database Changes
1. Edit `server/prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Update controllers/services as needed

## 🔐 Environment Variables

Required variables (see `server/sample.env`):
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL
- `BACKEND_URL` - Backend URL
- `EXPRESS_SESSION_SECRET` - Session secret
- `COOKIE_SECRET` - Cookie secret

## 📝 License

ISC

## 👤 Author

inydv
