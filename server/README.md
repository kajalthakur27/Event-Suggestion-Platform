# Event Suggestion Platform - Backend Server

Node.js/Express server with Firebase Firestore integration and AI-powered event suggestions using Google Gemini.

## Features

- 🔥 **Firebase Firestore Database** - Cloud database for events, users, and RSVPs
- 🤖 **AI Integration** - Google Gemini AI for event suggestions
- 🔍 **Advanced Search** - Text search and category filtering
- 📱 **RESTful API** - Clean API endpoints for frontend integration
- 🚀 **Real-time Data** - Live updates with Firestore
- 🛡️ **CORS Enabled** - Cross-origin requests supported

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project (optional, uses mock data by default)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# For development, the default settings work with mock data
```

### 3. Start Server
```bash
# Development mode (uses mock Firebase data)
npm start

# Or with custom port
PORT=5001 npm start
```

### 4. Seed Database (Optional)
```bash
# Add sample events to Firebase (if configured)
npm run seed
```

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get specific event
- `GET /api/events/search?q=query&category=tech` - Search events
- `POST /api/events/:id/rsvp` - RSVP to event

### AI & Utilities  
- `POST /api/events/ai-suggestions` - Get AI event recommendations
- `GET /api/test-ai` - Test AI connection
- `GET /api/health` - Health check

## Firebase Configuration

### Development Mode (Default)
The server runs in mock mode by default - no Firebase setup required!

```env
FIREBASE_EMULATOR=true
NODE_ENV=development
```

### Production Setup
1. Create Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Generate service account key
4. Update `.env`:

```env
FIREBASE_EMULATOR=false
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

### Local Firebase Emulator (Optional)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Start Firestore emulator
firebase emulators:start --only firestore

# Update .env
FIRESTORE_EMULATOR_HOST=localhost:8080
```

## Environment Variables

```env
# Firebase
FIREBASE_EMULATOR=true                    # Use emulator/mock mode
FIRESTORE_EMULATOR_HOST=localhost:8080   # Emulator host (optional)
FIREBASE_SERVICE_ACCOUNT_KEY={}          # Production credentials

# AI Configuration
GEMINI_API_KEY=your_key_here            # Google Gemini API key
MOCK_GEMINI=true                        # Use mock AI responses

# Server
PORT=5001                               # Server port
NODE_ENV=development                    # Environment
```

## Database Schema

### Events Collection
```javascript
{
  id: "auto-generated",
  title: "Event Name",
  description: "Event description...",
  date: "2025-11-25",
  time: "18:00", 
  location: "Venue Name, City",
  category: "Technology",
  attendees: 0,
  price: "Free",
  organizer: "Organizer Name",
  tags: ["AI", "ML", "Tech"],
  createdAt: "timestamp"
}
```

### RSVPs Collection
```javascript
{
  id: "auto-generated",
  eventId: "event_id",
  userEmail: "user@example.com",
  createdAt: "timestamp"
}
```

## API Usage Examples

### Fetch Events
```bash
curl http://localhost:5001/api/events
```

### Search Events
```bash
curl "http://localhost:5001/api/events/search?q=AI&category=Technology"
```

### RSVP to Event
```bash
curl -X POST http://localhost:5001/api/events/1/rsvp \
  -H "Content-Type: application/json" \
  -d '{"userEmail": "user@example.com"}'
```

### Get AI Suggestions
```bash
curl -X POST http://localhost:5001/api/events/ai-suggestions \
  -H "Content-Type: application/json" \
  -d '{"interests": ["Technology", "AI"]}'
```

## Running with Frontend

### Terminal 1 - Backend:
```bash
cd server
npm install
PORT=5001 npm start
```

### Terminal 2 - Frontend:
```bash
cd ../client
npm install 
npm run dev
```

**Servers will be available at:**
- Backend API: http://localhost:5001
- Frontend: http://localhost:5173

## Technology Stack

- **Express.js** - Web framework
- **Firebase Admin SDK** - Database integration
- **Google Generative AI** - AI suggestions
- **CORS** - Cross-origin support
- **dotenv** - Environment configuration

## Deployment Notes

1. **Firebase Setup**: Configure production Firebase project
2. **Environment**: Set production environment variables
3. **CORS**: Update CORS settings for production domains
4. **API Keys**: Secure API keys and service accounts
5. **Monitoring**: Add logging and monitoring

## Troubleshooting

### Firebase Connection Issues
- Check internet connection for Firebase
- Verify service account credentials
- Ensure Firestore is enabled in Firebase Console

### Mock Mode Fallback
If Firebase fails, the server automatically falls back to mock data, so your app keeps working!

### Port Conflicts
```bash
# Find process using port
lsof -i :5001

# Kill process
kill -9 <PID>
```