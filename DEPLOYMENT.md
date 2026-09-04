# Deployment Guide: GitHub + Render

This guide walks you through deploying the HyperVerge Web SDK Tester to GitHub and Render.

## Step 1: Prepare for GitHub

### 1.1 Create a GitHub Repository

1. Go to [github.com](https://github.com)
2. Click "+ New repository"
3. Name: `hyperverge-web-sdk-tester`
4. Description: "HyperVerge Web SDK Testing Tool"
5. Choose **Public** (free) or **Private** (requires Render Pro)
6. Click "Create repository"

### 1.2 Initialize Git (if not already done)

```bash
cd /Users/shreyamishrahv/Documents/HV/WebSDKTest

# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: HyperVerge Web SDK Tester"

# Add remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/hyperverge-web-sdk-tester.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 1.3 Verify Repository

- Go to `https://github.com/USERNAME/hyperverge-web-sdk-tester`
- You should see all your files including:
  - `backend/`
  - `frontend/`
  - `render.yaml`
  - `README.md`

---

## Step 2: Deploy to Render

Render will automatically detect the configuration from `render.yaml` and deploy both services.

### 2.1 Connect Render to GitHub

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (easiest option)
3. Click "Authorize render-oss"
4. Grant the necessary permissions

### 2.2 Create a New Service

**Option A: Using render.yaml (Recommended)**

1. Dashboard → "New +"
2. Select "Web Service"
3. Select "Deploy from a Git repository"
4. Search for and select your repository: `hyperverge-web-sdk-tester`
5. Render will automatically detect `render.yaml`
6. Click "Create Web Service"

**Option B: Manual Setup (if above doesn't work)**

Skip to section 2.3 and 2.4 for manual backend and frontend setup.

### 2.3 Deploy Backend Manually

1. **New Service → Web Service**
2. **Connect Git Repository**
   - Select your GitHub repo
   - Branch: `main`

3. **Configure Service**
   - Name: `hyperverge-sdk-backend`
   - Environment: `Node`
   - Region: `Oregon` (or nearest to you)
   - Plan: `Free`
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`

4. **Environment Variables**
   - Click "Advanced"
   - Add environment variables:
     ```
     NODE_ENV = production
     PORT = 3000
     HYPERVERGE_AUTH_URL = https://ind-state.idv.hyperverge.co/v2/auth/token
     CORS_ORIGIN = https://hyperverge-sdk-frontend.onrender.com
     ```

5. Click "Create Web Service"
6. Wait for deployment to complete (5-10 minutes)
7. **Copy the URL** shown (e.g., `https://hyperverge-sdk-backend.onrender.com`)

### 2.4 Deploy Frontend Manually

1. **New Service → Static Site**
2. **Connect Git Repository**
   - Select your GitHub repo
   - Branch: `main`

3. **Configure Service**
   - Name: `hyperverge-sdk-frontend`
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`

4. **Environment Variables**
   - Click "Advanced"
   - Add environment variable:
     ```
     VITE_API_URL = https://hyperverge-sdk-backend.onrender.com/api
     ```
     (Use the backend URL you copied from step 2.3)

5. Click "Create Static Site"
6. Wait for deployment (3-5 minutes)
7. Access your site at the provided URL (e.g., `https://hyperverge-sdk-frontend.onrender.com`)

---

## Step 3: Update Backend Configuration

After backend is deployed, update the CORS origin:

1. Go to Render Dashboard
2. Select `hyperverge-sdk-backend` service
3. Go to "Environment" tab
4. Find `CORS_ORIGIN`
5. Update to your frontend URL: `https://hyperverge-sdk-frontend.onrender.com`
6. Click "Save" (triggers redeploy)

---

## Step 4: Test the Deployment

1. Open your frontend URL: `https://hyperverge-sdk-frontend.onrender.com`
2. Enter your credentials:
   - App ID: `kp9hq2`
   - App Key: `HV:02ba8i1qfhxjbltjy`
   - Workflow ID: `isec-superapp-livenessFM-pwd`
   - Transaction ID: (generate one)

3. Click "Generate Token"
4. Should see success message
5. Click "Launch SDK"
6. SDK should load and display

---

## Troubleshooting

### "CORS Error"

**Problem**: Getting CORS error in browser console.

**Solution**:
1. Backend's `CORS_ORIGIN` must exactly match your frontend URL
2. Go to Backend → Environment
3. Update `CORS_ORIGIN` to your Render frontend URL
4. Save (triggers redeploy)

### "Cannot find backend"

**Problem**: Frontend shows "Network error" when generating token.

**Solution**:
1. Check `VITE_API_URL` environment variable in frontend
2. Should be: `https://hyperverge-sdk-backend.onrender.com/api`
3. Redeploy frontend after updating

### "Build failed"

**Problem**: Service fails to deploy.

**Steps**:
1. Check build logs in Render dashboard
2. Verify `package.json` exists in both `backend/` and `frontend/`
3. Ensure scripts match:
   - Backend: `"build": "tsc"`, `"start": "node dist/server.js"`
   - Frontend: `"build": "tsc && vite build"`

### "Free tier going to sleep"

**Problem**: Site takes a while to load after inactivity.

**Note**: Render's free tier services spin down after 15 minutes of inactivity.

**Solution**:
- Upgrade to Starter plan (minimal cost)
- Or accept the initial delay

---

## Auto-Redeployment

Your services will automatically redeploy when you push to GitHub:

```bash
# Make changes locally
# ...

# Push to GitHub
git add .
git commit -m "Update message"
git push

# Render detects the push and redeploys automatically
```

## Update SDK Version

To change the SDK version:

1. Edit `frontend/src/config/sdk-version.ts`:
   ```typescript
   const SDK_VERSION = '11.3.0'; // Change this
   ```

2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Update SDK version to X.X.X"
   git push
   ```

3. Render will automatically redeploy the frontend

---

## Production Checklist

- [ ] GitHub repository created and pushed
- [ ] Backend service deployed on Render
- [ ] Frontend service deployed on Render
- [ ] CORS_ORIGIN configured correctly
- [ ] VITE_API_URL configured in frontend
- [ ] Token generation working
- [ ] SDK launching successfully
- [ ] HyperVerge credentials set up (not in code)
- [ ] Environment variables configured (not .env files in git)

---

## URLs

- **Frontend**: `https://hyperverge-sdk-frontend.onrender.com`
- **Backend API**: `https://hyperverge-sdk-backend.onrender.com`
- **Backend Health Check**: `https://hyperverge-sdk-backend.onrender.com/health`

---

## Support

For Render-specific issues: [docs.render.com](https://docs.render.com)
For GitHub issues: [docs.github.com](https://docs.github.com)

---

**Deployed**: [Date]
