# Replit Quick Start Guide

## 🚀 Quick Answer to Your Question

**YES!** Replit can handle everything you need:

✅ **Prisma Changes** - Edit schema, run migrations, regenerate client  
✅ **Backend Changes** - Edit server code, auto-restarts with nodemon  
✅ **Frontend Changes** - Edit React code, hot-reloads with Vite  
✅ **Replit Preview** - View your app in Replit's webview pane  

## 📋 Setup Checklist

### 1. Set Up Database
**Option A: Replit Database (Easiest)**
- Go to "Secrets" tab (lock icon)
- Add `DATABASE_URL` with your PostgreSQL connection string

**Option B: External Database**
- Use Supabase, Neon, Railway, etc.
- Add `DATABASE_URL` to Replit Secrets

### 2. Set Environment Variables
Add these to Replit Secrets (or `server/.env`):
- `DATABASE_URL` - PostgreSQL connection
- `FRONTEND_URL` - Your Replit preview URL (e.g., `https://your-repl.username.repl.co`)
- `BACKEND_URL` - Backend URL
- `PORT` - 5000 (default)
- `EXPRESS_SESSION_SECRET` - Random secret string
- `COOKIE_SECRET` - Random secret string
- Other API keys (see `server/sample.env`)

### 3. Run Database Migrations
```bash
npm run prisma:migrate
```

### 4. Start the App
Click the **"Run"** button in Replit, or:
```bash
npm run dev
```

### 5. View Your App
Click the **"Webview"** tab to see your frontend!

## 🔧 Common Tasks

### Making Prisma Schema Changes
```bash
# 1. Edit server/prisma/schema.prisma
# 2. Create and apply migration
npm run prisma:migrate

# 3. (Optional) View database
npm run prisma:studio
```

### Making Backend Changes
- Edit files in `server/src/`
- Server auto-restarts (nodemon)
- Check console for errors

### Making Frontend Changes
- Edit files in `client/src/`
- Changes appear instantly (Vite HMR)
- No refresh needed!

### Viewing Database
```bash
npm run prisma:studio
```
Opens at `http://localhost:5555`

## 🌐 Preview URLs

When running in Replit:
- **Frontend:** `https://your-repl-name.username.repl.co` (port 5173)
- **Backend API:** Accessible via the frontend or `http://localhost:5000`

CORS is already configured to allow Replit preview domains!

## ⚡ Quick Commands

```bash
# Run both servers
npm run dev

# Run server only
npm run dev:server

# Run client only
npm run dev:client

# Database migrations
npm run prisma:migrate

# View database
npm run prisma:studio

# Regenerate Prisma client
npm run prisma:generate

# Build for production
npm run build
```

## 🐛 Troubleshooting

**Preview not showing?**
- Make sure both servers are running
- Check console for errors
- Refresh the preview pane

**Database connection failed?**
- Verify `DATABASE_URL` in Secrets
- Check database is accessible
- Run `npm run prisma:migrate`

**Changes not appearing?**
- Frontend: Refresh preview (Vite should auto-update)
- Backend: Check console for nodemon restart
- Prisma: Run `npm run prisma:generate` after schema changes

## 📚 Full Documentation

See `replit.md` for complete documentation.
