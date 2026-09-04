# HyperVerge Web SDK Tester

A professional internal testing tool for the HyperVerge HyperKYC Web SDK that can be run locally. This allows integration and development teams to easily test different HyperVerge Web SDK workflows with various configurations.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Token Generation Flow](#token-generation-flow)
- [Web SDK Launch Flow](#web-sdk-launch-flow)
- [Workflow Inputs](#workflow-inputs)
- [Prefetch](#prefetch)
- [Advanced Configuration](#advanced-configuration)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- **Secure Token Generation**: Backend securely generates authentication tokens using App Key (never exposed to frontend)
- **Dynamic SDK Loading**: Automatically loads HyperVerge Web SDK with version control
- **Flexible Workflow Configuration**: Enter App ID, App Key, Workflow ID, Transaction ID
- **Dynamic Workflow Inputs**: Add/remove key-value pairs for workflow-specific parameters
- **Advanced Configuration**: Optional settings like landing page display, dark mode, location permission, language
- **Prefetch Support**: Prefetch workflows before launching
- **UUID Transaction ID Generation**: Auto-generate unique transaction IDs
- **Real-time Result Display**: View SDK callback responses with detailed formatting
- **Debug Panel**: Inspect token requests and SDK configuration (with masked secrets)
- **Error Handling**: User-friendly error messages with error code mapping
- **Responsive Design**: Works on desktop and mobile devices
- **CORS Configuration**: Properly configured for local development

## 🏗️ Architecture

The application is built with a clear separation between frontend and backend:

### Frontend (React + TypeScript + Vite)

- Single-page application (SPA)
- Handles user input and UI rendering
- Communicates with backend for token generation
- Dynamically loads HyperVerge Web SDK
- Manages SDK configuration and callbacks
- Never handles or stores App Key

### Backend (Node.js + Express + TypeScript)

- Generates HyperVerge auth tokens
- Validates request parameters
- Makes secure calls to HyperVerge auth service
- Implements error handling
- Logs errors without exposing secrets

### Communication Flow

```
Frontend (App ID, App Key, etc.)
    ↓
Backend (Express)
    ↓
HyperVerge Auth API (https://ind-state.idv.hyperverge.co/v2/auth/token)
    ↓
Backend returns token
    ↓
Frontend launches SDK with token
```

## 📦 Prerequisites

- **Node.js**: v16 or higher
- **npm**: v7 or higher
- **HyperVerge Credentials**: App ID and App Key from HyperVerge dashboard
- **Workflow ID**: From your configured workflow
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (with camera access for KYC workflows)

## 🚀 Installation

### 1. Clone or Download the Project

```bash
cd /Users/shreyamishrahv/Documents/HV/WebSDKTest
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Backend Environment

Create a `.env` file in the `backend` directory (or copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3000
NODE_ENV=development
HYPERVERGE_AUTH_URL=https://ind-state.idv.hyperverge.co/v2/auth/token
CORS_ORIGIN=http://localhost:5173
```

### 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## 🎯 Running the Application

### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
```

Expected output:
```
HyperVerge SDK Tester Backend running on http://localhost:3000
CORS enabled for: http://localhost:5173
```

### Terminal 2: Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The application will automatically open at `http://localhost:5173`

## 📁 Project Structure

```
hyperverge-web-sdk-tester/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── auth.ts              # Token generation endpoint
│   │   ├── services/
│   │   │   └── hypervergeAuth.ts    # HyperVerge API integration
│   │   ├── types/
│   │   │   └── auth.ts              # TypeScript interfaces
│   │   └── server.ts                # Express server setup
│   ├── dist/                        # Compiled JavaScript
│   ├── tsconfig.json                # TypeScript configuration
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormFields.tsx       # Reusable form components
│   │   │   ├── WorkflowInputs.tsx   # Workflow inputs management
│   │   │   ├── AdvancedConfig.tsx   # Advanced options section
│   │   │   ├── ResultPanel.tsx      # SDK result display
│   │   │   ├── DebugPanel.tsx       # Debug information
│   │   │   └── Header.tsx           # Page header
│   │   ├── services/
│   │   │   ├── tokenService.ts      # Backend API calls
│   │   │   └── sdkLoader.ts         # SDK loading and initialization
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript interfaces
│   │   ├── utils/
│   │   │   ├── helpers.ts           # Utility functions
│   │   │   └── errorMapper.ts       # Error code mapping
│   │   ├── config/
│   │   │   └── sdk-version.ts       # SDK version config
│   │   ├── App.tsx                  # Main app component
│   │   ├── App.css                  # Application styling
│   │   └── main.tsx                 # React entry point
│   ├── index.html
│   ├── vite.config.ts               # Vite configuration
│   ├── tsconfig.json                # TypeScript configuration
│   └── package.json
│
├── README.md                         # This file
└── .gitignore                        # Git ignore rules
```

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `3000` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `HYPERVERGE_AUTH_URL` | HyperVerge token endpoint | `https://ind-state.idv.hyperverge.co/v2/auth/token` |
| `CORS_ORIGIN` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend

Configure SDK version in [frontend/src/config/sdk-version.ts](frontend/src/config/sdk-version.ts):

```typescript
const SDK_VERSION = '1.52.0'; // Update as needed
export default SDK_VERSION;
```

## 💻 Usage

### Step 1: Enter HyperVerge Credentials

1. Open the application at `http://localhost:5173`
2. Enter your **App ID** (required)
3. Enter your **App Key** (required) - masked password input
4. Enter your **Workflow ID** (required)

### Step 2: Generate or Enter Transaction ID

1. Click **Generate Transaction ID** to create a unique UUID, or
2. Manually enter a unique transaction ID

**Note**: Each transaction must have a unique ID for tracking.

### Step 3: Add Workflow Inputs (Optional)

The SDK documentation specifies which inputs each workflow requires. Common examples:

- `mobileNumber`: Customer's mobile number
- `name`: Customer's full name
- `email`: Customer's email address
- Custom workflow-specific inputs

To add inputs:

1. Click **+ Add Input**
2. Enter key and value for each input
3. Click **−** to remove an input

Do not hardcode inputs on the frontend; let the workflow definition determine which inputs are required/allowed.

### Step 4: Configure Advanced Options (Optional)

Click **Advanced Configuration** to expand:

- **Show landing page**: Display the HyperVerge landing page
- **Default Language Code**: Set default language (e.g., `en`, `hi`)
- **Support dark mode**: Enable dark mode for the SDK
- **Request location permission**: Request device location access

### Step 5: Generate Auth Token

1. Click **Generate Token**
2. The backend securely generates a token using your credentials
3. Status displays at the top

If token generation fails, check:

- Credentials are correct
- Network/internet connection is stable
- HyperVerge auth service is accessible
- CORS is properly configured

### Step 6: Launch SDK

1. Click **Launch SDK**
2. The HyperVerge Web SDK will display (may show camera permission request)
3. Follow the KYC workflow
4. The result will display in the **SDK Result** panel on the right

## 🔄 Token Generation Flow

```
Frontend Input
├── App ID
├── App Key
├── Workflow ID
├── Transaction ID
└── Expiry (default 3600s)
    ↓
POST /api/generate-token (to backend)
    ↓
Backend Validation
├── Check all required fields present
├── Call HyperVerge Auth API
└── Handle errors
    ↓
HyperVerge Auth Service
├── Validate credentials
├── Generate JWT token
└── Return token + expiry
    ↓
Backend Response
├── Success: Return token
└── Error: Return error message
    ↓
Frontend
├── Store token in memory (not localStorage)
└── Enable "Launch SDK" button
```

## 🚀 Web SDK Launch Flow

```
User clicks "Launch SDK"
    ↓
Frontend loads SDK script (if not loaded)
├── URL: https://hv-web-sdk-cdn.hyperverge.co/hyperverge-web-sdk@VERSION/src/sdk.min.js
└── Timeout: 10 seconds
    ↓
Create HyperKycConfig
├── Initialize with auth token + landing page flag
├── Set optional configurations
│   ├── defaultLangCode (if provided)
│   ├── supportDarkMode (if enabled)
│   └── setUseLocation (if enabled)
└── Set workflow inputs (if present)
    ↓
Launch SDK
├── HyperKYCModule.launch(config, handler)
└── User interacts with KYC workflow
    ↓
SDK Callback (handler called)
├── Status: user_cancelled | error | auto_approved | auto_declined | needs_review
├── Error details (if status is error)
└── Transaction metadata
    ↓
Display Result in Panel
├── Format and display response
├── Show appropriate status icon and message
└── Provide copy/debug options
```

## 📝 Workflow Inputs

Workflow inputs are key-value pairs passed to the SDK via `hyperKycConfig.setInputs()`.

### Example Workflow Inputs

For a KYC workflow:

```json
{
  "mobileNumber": "9876543210",
  "name": "John Doe",
  "email": "john@example.com",
  "dateOfBirth": "1990-01-15"
}
```

### How to Add Inputs

1. In the **Workflow Inputs** section, click **+ Add Input**
2. Enter the key (e.g., `mobileNumber`)
3. Enter the value (e.g., `9876543210`)
4. Repeat for each input
5. Click the **−** button to remove an input

### Important Notes

- The frontend does NOT validate which inputs are required
- Validation happens on the backend/SDK
- If a required input is missing, the SDK will return an error
- Error messages indicate which input is missing or invalid
- Always refer to your workflow configuration for required inputs

## 🔄 Prefetch

Prefetching loads the workflow ahead of launching, improving user experience.

```javascript
HyperKYCModule.prefetch(appId, workflowId);
```

### To Prefetch a Workflow

1. Fill in **App ID** and **Workflow ID**
2. Click **Prefetch Workflow**
3. Status updates to "Prefetch started"

**Recommendation**: Prefetch when the page loads or before the user clicks "Launch SDK", not immediately before launch.

## ⚙️ Advanced Configuration

### Show Landing Page

HTML elements before the KYC workflow:

```javascript
const hyperKycConfig = new HyperKycConfig(authToken, true);
```

### Default Language

Set the SDK's default language:

```javascript
hyperKycConfig.setDefaultLangCode("en");
```

Supported values depend on HyperVerge configuration (e.g., `en`, `hi`, `ta`).

### Dark Mode

Enable dark mode support:

```javascript
hyperKycConfig.supportDarkMode(true);
```

### Location Permission

Request device location via the SDK:

```javascript
hyperKycConfig.setUseLocation(true);
```

## 🔒 Security Considerations

This is an **internal testing tool**, but security best practices are implemented:

### ✅ What's Secure

- **App Key never sent to frontend**: Only transmitted to backend over HTTP (or HTTPS in production)
- **No localStorage persistence**: Tokens are stored in React state (memory only)
- **No App Key in logs**: Backend service masks and doesn't log credentials
- **Masked secrets in UI**: The debug panel masks the App Key
- **CORS configured**: Restricts to allowed origins
- **TypeScript strict mode**: Catches type-related vulnerabilities

### ⚠️ Important for Production

If you deploy this tool for external use:

1. **Use HTTPS**: Always use HTTPS, not HTTP
2. **Restrict CORS**: Only allow known frontend origins
3. **Add authentication**: Implement user authentication/authorization
4. **Rate limiting**: Limit token generation requests
5. **Audit logging**: Log all token generations with user info
6. **Secrets management**: Use environment variables or secret managers, never hardcode
7. **Input validation**: Validate all inputs (already done in backend)

## 🐛 Troubleshooting

### "Please generate an auth token before launching the SDK"

**Problem**: Launch SDK button shows this message.

**Solution**: 

1. Ensure all required fields are filled (App ID, App Key, Workflow ID, Transaction ID)
2. Click **Generate Token**
3. Wait for token generation to complete
4. Then click **Launch SDK**

### Token Generation Fails with "Invalid App ID or App Key"

**Problem**: Backend returns 401/403 error.

**Solution**:

1. Verify App ID and App Key are correct
2. Check if credentials have expired or been revoked
3. Ensure HyperVerge auth service is accessible from your network
4. Check proxy/firewall settings if behind corporate network

### "Failed to load HyperVerge Web SDK"

**Problem**: SDK doesn't load from CDN.

**Solution**:

1. Verify internet connection
2. Check SDK version is valid (current version: 1.52.0)
3. Ensure CORS allows the SDK CDN (should be automatic)
4. Try updating SDK version in [frontend/src/config/sdk-version.ts](frontend/src/config/sdk-version.ts)

Example - try updating the version:

```typescript
const SDK_VERSION = '1.52.0'; // Try a different version
```

### CORS Error: "Access to XMLHttpRequest blocked"

**Problem**: Browser console shows CORS error.

**Solution**:

1. Verify backend is running on port 3000
2. Check `CORS_ORIGIN` in backend `.env` matches frontend URL
3. For development: `CORS_ORIGIN=http://localhost:5173`
4. Ensure backend error response includes proper CORS headers

### Camera Permission Denied

**Problem**: SDK requests camera permission but user denies it.

**Solution**:

1. The SDK cannot proceed without camera access for KYC workflows
2. Check browser camera permissions:
   - Chrome/Edge: Settings → Privacy → Camera
   - Firefox: Preferences → Privacy → Permissions → Camera
   - Safari: System Preferences → Security & Privacy → Camera
3. Reset camera permissions and refresh page
4. Allow camera access when prompted

### "Transaction ID might already be in use" (Session Conflict)

**Problem**: SDK returns session conflict error.

**Solution**:

1. Each transaction ID must be unique
2. Click **Generate Transaction ID** to create a new UUID
3. Don't reuse the same transaction ID multiple times
4. Wait a few seconds between launching multiple workflows

### Backend Won't Start

**Problem**: `npm run dev` fails or port 3000 is already in use.

**Solution**:

1. Change `PORT` in backend `.env`:
   ```env
   PORT=3001
   ```

2. Update frontend API URL to match:
   Edit [frontend/src/services/tokenService.ts](frontend/src/services/tokenService.ts):
   ```typescript
   const API_BASE_URL = 'http://localhost:3001/api';
   ```

3. Or kill the process using port 3000:
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

### Frontend Won't Connect to Backend

**Problem**: Frontend shows network error when generating token.

**Solution**:

1. Verify backend is running: `curl http://localhost:3000/health`
2. Check network tab in browser DevTools (F12)
3. Ensure API URL matches backend port
4. Try clearing browser cache and refreshing
5. Check if CORS_ORIGIN is correct in backend `.env`

## 🔗 CORS / Domain Whitelisting

### For Local Development

Backend `.env`:
```env
CORS_ORIGIN=http://localhost:5173
```

Frontend API calls go to `http://localhost:3000/api`

### For Production / Remote Testing

If testing from a different machine:

1. Update backend `.env`:
   ```env
   CORS_ORIGIN=http://your-machine-ip:5173
   ```

2. Start backend on your machine's IP:
   ```bash
   # Find your local IP
   ifconfig  # macOS/Linux
   ipconfig  # Windows
   
   # Use that IP in frontend API calls
   ```

3. On client machine, access:
   ```
   http://your-machine-ip:5173
   ```

## 📚 Additional Resources

- [HyperVerge Documentation](https://hyperverge.co/docs)
- [HyperKYC API Reference](https://hyperverge.co/docs/api-reference)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 📄 License

This is an internal testing tool for HyperVerge SDK integration.

---

**Last Updated**: September 2026

For questions or issues, contact your HyperVerge support team.
