# Event Suggestion Platform - Frontend

React + Vite application with AI-powered event suggestions using Google Gemini.

## Features

- 🎯 AI-powered event recommendations
- 🔍 Search and filter events
- 📱 Responsive mobile-first design
- 🎨 Modern UI with Tailwind CSS
- 🚀 Fast development with Vite

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup and Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   - Copy `.env.example` to `.env` (optional)
   - Set `VITE_API_BASE_URL` if backend runs on different port
   - Default backend URL: `http://localhost:5001/api`

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Running the Full Application

### Terminal 1 - Backend Server:
```bash
cd ../server
npm install
PORT=5001 npm start
```

### Terminal 2 - Frontend Client:
```bash
cd client
npm install
npm run dev
```

After starting both servers:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001/api
- **API Health**: http://localhost:5001/api/health

## Environment Variables

Create a `.env` file in the client directory:

```env
# Backend API base URL (without trailing slash)
VITE_API_BASE_URL=http://localhost:5001/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend connects to the backend API for:
- Event listing and search
- AI-powered event suggestions
- User RSVP functionality
- Real-time event data

## Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Router** - Navigation
