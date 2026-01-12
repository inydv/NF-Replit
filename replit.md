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

### Setup

1. **Set up environment variables:**

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

## Replit-Specific Guide

### ✅ What Replit Can Handle

**Yes, Replit can fully handle:**
- ✅ **Prisma Schema Changes** - Edit `server/prisma/schema.prisma` and run migrations
- ✅ **Backend Changes** - All Node.js/Express code changes work normally
- ✅ **Frontend Changes** - All React/Vite code changes work normally
- ✅ **Replit Preview** - Preview your app in Replit's webview

### Using Replit Preview

Replit Preview allows you to see your app running directly in Replit:

1. **Click the "Run" button** - This starts both client and server
2. **Click the "Webview" tab** - This opens your frontend in Replit's preview pane
3. **The preview URL** will be something like `https://your-repl-name.username.repl.co`

**Important Notes:**
- The frontend (Vite) runs on port 5173 and is accessible via Replit's preview
- The backend (Express) runs on port 5000
- CORS is configured to allow Replit preview URLs automatically
- Both servers run concurrently when you click "Run"

### Making Prisma Changes in Replit

1. **Edit the schema:**
   ```bash
   # Edit server/prisma/schema.prisma
   ```

2. **Create a migration:**
   ```bash
   cd server
   npm run prisma:migration:up
   ```
   This will:
   - Create a new migration file
   - Apply it to your database
   - Regenerate the Prisma client

3. **If you just want to regenerate the client (no schema changes):**
   ```bash
   cd server
   npx prisma generate
   ```

4. **View your database with Prisma Studio:**
   ```bash
   cd server
   npx prisma studio
   ```
   This opens a web interface at `http://localhost:5555`

### Database Setup in Replit

**Option 1: Use Replit Database (Recommended for Replit)**
- Replit provides a built-in PostgreSQL database
- Access it via the "Secrets" tab (environment variables)
- Set `DATABASE_URL` in Replit Secrets

**Option 2: External Database**
- Use a service like Supabase, Neon, or Railway
- Set `DATABASE_URL` in Replit Secrets (`.env` file)

**Setting up Replit Secrets:**
1. Click the "Secrets" tab (lock icon) in Replit
2. Add your environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `FRONTEND_URL` - Your Replit preview URL (e.g., `https://your-repl.username.repl.co`)
   - `BACKEND_URL` - Your backend URL
   - All other variables from `server/sample.env`

### Making Backend Changes

1. **Edit any file in `server/src/`**
2. **Nodemon automatically restarts** the server when you save
3. **Check the console** for any errors
4. **Test your changes** via the frontend or API endpoints

### Making Frontend Changes

1. **Edit any file in `client/src/`**
2. **Vite's HMR (Hot Module Replacement)** automatically updates the browser
3. **Changes appear instantly** in the Replit Preview
4. **No page refresh needed** for most changes

### Running Commands in Replit

**Terminal 1 (Main):**
- Used by the "Run" button to start both servers
- Shows combined output from client and server

**Terminal 2+ (Additional):**
- Open new terminals for separate commands
- Useful for running migrations, Prisma Studio, etc.

### Environment Variables in Replit

**Two ways to set environment variables:**

1. **Replit Secrets (Recommended):**
   - Click the "Secrets" tab (lock icon)
   - Add variables here
   - They're automatically available as `process.env.VARIABLE_NAME`

2. **`.env` file:**
   - Create `server/.env` file
   - Add your variables (don't commit to git!)
   - The `.gitignore` already excludes `.env`

### Preview URLs

When your app runs in Replit:
- **Frontend Preview:** `https://your-repl-name.username.repl.co` (port 5173)
- **Backend API:** `https://your-repl-name.username.repl.co:5000` (if exposed)
- **Or use:** `http://localhost:5000` for backend API calls from frontend

The CORS configuration automatically allows Replit preview domains.

## Troubleshooting

### Port Conflicts

- Backend runs on port 5000 by default
- Frontend runs on port 5173 by default
- Replit automatically handles port forwarding
- Make sure these ports are available

### Database Connection Issues

- Verify `DATABASE_URL` in Replit Secrets or `.env` is correct
- Ensure PostgreSQL database is accessible
- Check database credentials
- For Replit Database, check the Secrets tab

### Prisma Issues

- Run `npx prisma generate` if Prisma client is missing
- Run migrations: `npm run prisma:migration:up`
- If migrations fail, check your `DATABASE_URL`
- Use `npx prisma studio` to inspect your database

### Replit Preview Not Working

- Make sure both servers are running (check console)
- Verify frontend is on port 5173
- Check CORS configuration (already set up for Replit)
- Try refreshing the preview pane

### Changes Not Reflecting

- **Frontend:** Vite HMR should update automatically. If not, refresh the preview
- **Backend:** Nodemon should restart automatically. Check console for restart messages
- **Prisma:** After schema changes, always run `npm run prisma:migration:up`

## License

ISC

## Author

inydv
