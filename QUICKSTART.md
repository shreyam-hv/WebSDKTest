# Quick Start Guide

## ⚡ 60-Second Setup

### Prerequisites
- Node.js v16+ and npm v7+
- HyperVerge App ID and App Key

### Step 1: Install Dependencies

```bash
# From project root
cd backend && npm install && cd ../frontend && npm install
```

### Step 2: Configure Backend

```bash
# Create .env file in backend directory
cd backend
cp .env.example .env

# Edit .env if needed (defaults work for local development)
```

### Step 3: Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

You should see:
```
HyperVerge SDK Tester Backend running on http://localhost:3000
```

### Step 4: Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Browser will automatically open `http://localhost:5173`

## 🎯 First Test Workflow

1. **Enter Credentials**
   - App ID: `your_app_id`
   - App Key: `your_app_key` (masked password)
   - Workflow ID: `your_workflow_id`

2. **Generate Transaction ID**
   - Click "Generate Transaction ID"

3. **Generate Token**
   - Click "Generate Token"
   - Should see success message

4. **Launch SDK**
   - Click "Launch SDK"
   - SDK should display
   - Follow the KYC workflow

5. **View Result**
   - SDK callback result displays in right panel
   - Copy response if needed

## 🔧 Common Commands

```bash
# Backend
cd backend
npm run dev        # Start dev server with hot-reload
npm run build      # Compile TypeScript
npm start          # Run compiled JavaScript

# Frontend
cd frontend
npm run dev        # Start dev server on http://localhost:5173
npm run build      # Build production bundle
npm run preview    # Preview production build
```

## 📚 Key Files

- Backend token generation: [backend/src/routes/auth.ts](backend/src/routes/auth.ts)
- Frontend main app: [frontend/src/App.tsx](frontend/src/App.tsx)
- SDK configuration: [frontend/src/config/sdk-version.ts](frontend/src/config/sdk-version.ts)
- API service: [frontend/src/services/tokenService.ts](frontend/src/services/tokenService.ts)

## ❓ Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is in use
lsof -i :3000
# Kill process and try again
```

### Frontend can't connect to backend
```bash
# Verify backend is running
curl http://localhost:3000/health
# Should return: {"status":"ok","message":"HyperVerge SDK Tester Backend"}
```

### Need different port
Edit `backend/.env`:
```env
PORT=3001
```
Then update `frontend/src/services/tokenService.ts` to use `http://localhost:3001/api`

## 📖 Full Documentation

See [README.md](README.md) for complete documentation.
