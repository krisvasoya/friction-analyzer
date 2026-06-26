# 🚀 Deployment Guide — Digital Friction Analyzer

## Overview

This project is a **monorepo** where the Express backend serves both the REST API/WebSocket server and the built React frontend as static files. A single deployment is all you need.

---

## 📁 Final Project Structure

```
digital-friction-analyzer/
│
├── backend/                          # Express.js API Server
│   ├── src/
│   │   ├── database.js               # SQLite DB connection & schema
│   │   ├── analyzer.js               # Friction analysis engine
│   │   └── seed.js                   # Database seeding helpers
│   ├── server.js                     # Main Express server entry point
│   ├── package.json
│   └── friction.db                   # SQLite database file
│
├── frontend/                         # React SPA (Vite)
│   ├── dist/                         # ⬅ Built output served by Express
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── layout/               # Layout.jsx, Navbar.jsx, AdminGuard.jsx
│       │   └── common/               # Tracker.jsx, AutoHelpWidget.jsx, ErrorBoundary.jsx, InteractiveFriction.jsx
│       ├── features/
│       │   ├── auth/                 # Login.jsx, Signup.jsx, AdminLogin.jsx
│       │   ├── dashboard/            # Dashboard.jsx + all dashboard widgets
│       │   └── user/                 # Home.jsx, Services.jsx, Pricing.jsx, etc.
│       ├── lib/
│       │   └── api.js                # Centralized API & Socket client
│       └── styles/
│           ├── index.css
│           └── App.css
│
├── package.json                      # Root scripts (install-all, build, start)
├── .env.example                      # Environment variable template
└── DEPLOYMENT.md                     # This file
```

---

## ⚙️ Local Development

### Prerequisites
- **Node.js** v18+ ([download](https://nodejs.org))
- **npm** v8+

### Step 1 — Install all dependencies
```bash
npm run install-all
```

### Step 2 — Run in development mode (two terminals)

**Terminal 1 — Backend (Express + Socket.io):**
```bash
npm run dev:backend
# Server starts at http://localhost:3000
```

**Terminal 2 — Frontend (Vite dev server):**
```bash
npm run dev:frontend
# App opens at http://localhost:5173
```

> During development, the frontend on port `5173` automatically proxies API calls to `localhost:3000`.

---

## 🏗️ Production Build (Verify Locally First)

### Step 1 — Build the React frontend
```bash
npm run build
```
This compiles the frontend into `frontend/dist/`.

### Step 2 — Start the Express server in production mode
```bash
npm start
```

### Step 3 — Open the app
Visit **http://localhost:3000**  
The Express server will serve both the API routes **and** the React app.

---

## ☁️ Deploying to Render (Recommended Free Option)

> [!NOTE]
> **SQLite Persistence Warning:** Render's free tier has an **ephemeral filesystem**. Data (the `friction.db` file) will be **lost on every restart**. To persist data, add a **Render Disk** (paid) or migrate to PostgreSQL. For a demo/prototype this is fine.

### Step 1 — Push to GitHub
```bash
git add .
git commit -m "Restructure: feature-based folder layout + production server setup"
git push origin main
```

### Step 2 — Create a Web Service on Render
1. Go to [render.com](https://render.com) and sign in.
2. Click **New → Web Service**.
3. Connect your GitHub repository.

### Step 3 — Configure the Web Service

| Setting | Value |
|---|---|
| **Name** | `digital-friction-analyzer` |
| **Root Directory** | _(leave blank — uses repo root)_ |
| **Environment** | `Node` |
| **Build Command** | `npm run install-all && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

### Step 4 — Add Environment Variables (Optional)
In Render's **Environment** tab, you can add:
- `PORT` → Render sets this automatically, no action needed.
- `NODE_ENV` → `production`

### Step 5 — Deploy
Click **Create Web Service**. Render will:
1. Install dependencies for both `backend/` and `frontend/`
2. Build the React app into `frontend/dist/`
3. Start the Express server which serves everything on the assigned port

Your app will be live at: `https://your-app-name.onrender.com`

---

## 🚂 Deploying to Railway

### Step 1 — Install Railway CLI (optional)
```bash
npm install -g @railway/cli
railway login
```

### Step 2 — Create project
```bash
railway init
railway up
```

### Step 3 — Set variables
```bash
railway variables set NODE_ENV=production
```

Railway provides a persistent filesystem, so `friction.db` data will survive restarts.

---

## 🖥️ Deploying to a VPS (Ubuntu/Debian)

### Step 1 — Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2 — Clone and build
```bash
git clone https://github.com/YOUR_USERNAME/digital-friction-analyzer.git
cd digital-friction-analyzer
npm run install-all
npm run build
```

### Step 3 — Run with PM2 (process manager)
```bash
npm install -g pm2
pm2 start backend/server.js --name "friction-analyzer"
pm2 save
pm2 startup
```

### Step 4 — Configure Nginx (optional, for domain/SSL)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔑 Admin Login

After deployment, navigate to `/admin-login`:
- **Admin ID:** `admin`
- **Password:** `admin@123`

---

## 🐛 Troubleshooting

| Problem | Solution |
|---|---|
| `sqlite3` fails to install | Run `npm rebuild sqlite3` in `backend/` |
| Blank page after deploy | Check that `frontend/dist` exists (run `npm run build` first) |
| WebSocket not connecting | Ensure your host supports WebSocket connections (Render does ✓) |
| API returns 404 | Verify Express `app.get('*')` catch-all is **after** all API routes |
| Port already in use locally | Set `PORT=3001` in a `.env` file in `backend/` |
