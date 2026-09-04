# Quick Deployment Commands

## 1. Initialize Git & Push to GitHub

```bash
# Navigate to project root
cd /Users/shreyamishrahv/Documents/HV/WebSDKTest

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: HyperVerge Web SDK Tester"

# Add your GitHub repository (replace USERNAME)
git remote add origin https://github.com/USERNAME/hyperverge-web-sdk-tester.git

# Rename branch to main (GitHub's default)
git branch -M main

# Push to GitHub
git push -u origin main
```

## 2. Verify on GitHub

Visit: `https://github.com/USERNAME/hyperverge-web-sdk-tester`

You should see all files including `render.yaml`

## 3. Deploy to Render

1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Dashboard → "New +" → "Web Service"
4. Select your repository: `hyperverge-web-sdk-tester`
5. Render should automatically detect `render.yaml`
6. Review settings and click "Create Web Service"
7. Wait for both services to deploy (10-15 minutes total)

## 4. Get Your URLs

After deployment completes:
- Frontend: `https://hyperverge-sdk-frontend.onrender.com`
- Backend: `https://hyperverge-sdk-backend.onrender.com`

## 5. Test

Open the frontend URL and test with your credentials

## Useful Git Commands

```bash
# Check status
git status

# Update existing files
git add .
git commit -m "Your message"
git push

# View logs
git log

# Reset if needed
git reset --hard HEAD
```

## If You Don't Have a GitHub Account

1. Go to [github.com](https://github.com)
2. Sign up (free)
3. Then run the git commands above

---

That's it! Once pushed to GitHub, Render will handle everything automatically.
