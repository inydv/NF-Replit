# NursingFront - Job Board Platform

A full-stack job board application for nursing professionals, built with React (Vite) frontend and Node.js/Express backend.

## Project Structure

```
├── client/          # React frontend (Vite)
├── server/          # Node.js backend (Express)
└── prisma/          # Database schema and migrations
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Environment variables configured (see `.env` setup below)

### Installation

1. **Install dependencies for both client and server:**

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies  
cd ../client && npm install
```

2. **Set up environment variables:**

Create a `.env` file in the `server/` directory based on `server/sample.env`:

```bash
cp server/sample.env server/.env
```

Then edit `server/.env` with your actual values:
- Database connection string
- API keys (Cloudinary, Google, Stripe, etc.)
- Email configuration
- Session secrets

3. **Set up the database:**

```bash
cd server
npm run prisma:migration:up
```

4. **Run the development servers:**

**Option 1: Run both servers separately (recommended for development)**

Terminal 1 - Backend:
```bash
cd server && npm run dev
```

Terminal 2 - Frontend:
```bash
cd client && npm run dev
```

**Option 2: Use the root dev script (if configured)**
```bash
npm run dev
```

## Available Scripts

### Server Scripts (`server/package.json`)

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run prisma:migration:up` - Run database migrations
- `npm run prisma:validate` - Validate Prisma schema

### Client Scripts (`client/package.json`)

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

### Required Server Environment Variables

See `server/sample.env` for the complete list. Key variables include:

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL (default: http://localhost:5173)
- `BACKEND_URL` - Backend URL (default: http://localhost:5000)
- `EXPRESS_SESSION_SECRET` - Session secret key
- `COOKIE_SECRET` - Cookie encryption secret

### Optional Environment Variables

- Cloudinary configuration (for image uploads)
- Google OAuth credentials
- Stripe payment keys
- Email service configuration
- Reddit API credentials

## Database

This project uses PostgreSQL with Prisma ORM. The database schema is defined in `server/prisma/schema.prisma`.

### Running Migrations

```bash
cd server
npm run prisma:migration:up
```

### Prisma Studio (Database GUI)

```bash
cd server
npx prisma studio
```

## Features

- User authentication (Firebase Auth, Google OAuth)
- Job posting and searching
- Company profiles
- User profiles (Job Seekers, Recruiters, Admins)
- Blog system
- Payment integration (Stripe)
- Email notifications
- Image uploads (Cloudinary)

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Material-UI
- React Router
- Firebase (Authentication)
- Axios

### Backend
- Node.js
- Express 5
- Prisma ORM
- PostgreSQL
- Firebase Admin SDK
- Stripe
- Cloudinary
- Nodemailer

## Deployment

### Building for Production

```bash
# Build frontend
cd client && npm run build

# The built files will be in client/dist/
```

### Production Server

```bash
cd server && npm start
```

## Troubleshooting

### Port Conflicts

- Backend runs on port 5000 by default
- Frontend runs on port 5173 by default
- Make sure these ports are available

### Database Connection Issues

- Verify `DATABASE_URL` in `.env` is correct
- Ensure PostgreSQL is running
- Check database credentials

### Prisma Issues

- Run `npx prisma generate` if Prisma client is missing
- Run migrations: `npm run prisma:migration:up`

## License

ISC

## Author

inydv
