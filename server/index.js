import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { initFirebase, FirebaseEventModel } from './firebase.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MOCK = (process.env.MOCK_GEMINI || 'true').toLowerCase() === 'true';
const HAS_KEY = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim());

app.use(cors());
app.use(express.json());

console.log(`Server starting (PORT=${PORT})`);
console.log(`MOCK_GEMINI=${MOCK}  GEMINI_API_KEY present=${HAS_KEY}`);

// Initialize Firebase
initFirebase();

// Sample events data (fallback only)
const sampleEvents = [
  {
    id: 1,
    title: 'AI & Machine Learning Meetup',
    description: 'Join us for an exciting discussion about the latest trends in AI and ML technology. Network with professionals and learn from industry experts.',
    date: '2025-11-25',
    time: '18:00',
    location: 'Tech Hub, Bangalore',
    category: 'Technology',
    attendees: 45,
    price: 'Free',
    organizer: 'Tech Community',
    tags: ['AI', 'Machine Learning', 'Networking']
  },
  {
    id: 2,
    title: 'Live Music Concert - Indie Rock Night',
    description: 'Experience amazing indie rock performances by local bands. Great music, good vibes, and amazing crowd.',
    date: '2025-11-26',
    time: '20:00',
    location: 'Music Cafe, Delhi',
    category: 'Music',
    attendees: 120,
    price: '₹500',
    organizer: 'Music Lovers Club',
    tags: ['Live Music', 'Indie Rock', 'Concert']
  },
  {
    id: 3,
    title: 'Food Festival - Street Food Carnival',
    description: 'Taste the best street food from across India. Over 50 food stalls with authentic flavors and amazing prices.',
    date: '2025-11-27',
    time: '12:00',
    location: 'Central Park, Mumbai',
    category: 'Food',
    attendees: 300,
    price: '₹200',
    organizer: 'Foodie Network',
    tags: ['Street Food', 'Festival', 'Indian Cuisine']
  },
  {
    id: 4,
    title: 'Photography Workshop - Portrait Mastery',
    description: 'Learn professional portrait photography techniques from award-winning photographers. Hands-on workshop with practical sessions.',
    date: '2025-11-28',
    time: '10:00',
    location: 'Photography Studio, Pune',
    category: 'Photography',
    attendees: 25,
    price: '₹1500',
    organizer: 'Photo Academy',
    tags: ['Photography', 'Workshop', 'Portrait']
  },
  {
    id: 5,
    title: 'Startup Networking Event',
    description: 'Connect with entrepreneurs, investors, and startup enthusiasts. Pitch your ideas and find potential co-founders.',
    date: '2025-11-29',
    time: '19:00',
    location: 'Business Center, Hyderabad',
    category: 'Business',
    attendees: 80,
    price: '₹300',
    organizer: 'Startup Hub',
    tags: ['Startup', 'Networking', 'Business']
  },
  {
    id: 6,
    title: 'Yoga & Meditation Retreat',
    description: 'Relax and rejuvenate with guided yoga sessions and meditation practices. Perfect for stress relief and mental wellness.',
    date: '2025-11-30',
    time: '07:00',
    location: 'Wellness Center, Rishikesh',
    category: 'Health',
    attendees: 35,
    price: '₹800',
    organizer: 'Wellness Community',
    tags: ['Yoga', 'Meditation', 'Wellness']
  }
];

// Initialize AI client only if not mocking and key exists
let ai = null;
if (!MOCK && HAS_KEY) {
  ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// GET /api/events
app.get('/api/events', async (req, res) => {
  try {
    const events = await FirebaseEventModel.getAll();
    res.json({ success: true, events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch events' });
  }
});

// GET /api/events/search?q=&category=
app.get('/api/events/search', async (req, res) => {
  try {
    const { q, category } = req.query;
    const events = await FirebaseEventModel.search(q, category);
    res.json({ success: true, events, total: events.length });
  } catch (error) {
    console.error('Error searching events:', error);
    res.status(500).json({ success: false, error: 'Failed to search events' });
  }
});

// GET /api/events/:id
app.get('/api/events/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const event = await FirebaseEventModel.getById(id);
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
    res.json({ success: true, event });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch event' });
  }
});

// POST /api/events/:id/rsvp
app.post('/api/events/:id/rsvp', async (req, res) => {
  try {
    const id = req.params.id;
    const { userEmail } = req.body;
    const event = await FirebaseEventModel.addRSVP(id, userEmail);
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });
    res.json({ success: true, message: 'RSVP successful', event });
  } catch (error) {
    console.error('Error adding RSVP:', error);
    if (error.message.includes('already registered')) {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: 'Failed to process RSVP' });
    }
  }
});

// POST /api/events/ai-suggestions
app.post('/api/events/ai-suggestions', async (req, res) => {
  try {
    const { interests = [], userPreferences = {} } = req.body || {};

    // Get all events from Firebase
    const allEvents = await FirebaseEventModel.getAll();
    
    const suggestedEvents = allEvents.filter(event =>
      interests.some(interest =>
        event.category.toLowerCase().includes(interest.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
      )
    );

    if (!ai) {
      // Return mock AI response
      const mockText = `Mocked suggestions based on interests: ${interests.join(', ')}`;
      return res.json({ success: true, aiResponse: mockText, suggestedEvents, totalSuggestions: suggestedEvents.length });
    }

    // If real AI client is initialized, call it
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Based on interests: ${interests.join(', ')}. Suggest relevant events.`;
    const response = await model.generateContent(prompt);
    const aiText = typeof response?.response?.text === 'function' ? response.response.text() : response?.response?.text || '';

    res.json({ success: true, aiResponse: aiText, suggestedEvents, totalSuggestions: suggestedEvents.length });
  } catch (error) {
    console.error('AI Suggestion Error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate AI suggestions', message: error.message || String(error) });
  }
});

// GET /api/test-ai
app.get('/api/test-ai', async (req, res) => {
  try {
    if (!ai) return res.json({ success: true, message: 'Mocked AI (no real key configured)' });
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const response = await model.generateContent('Hello! Can you suggest a tech event in one sentence?');
    const aiText = typeof response?.response?.text === 'function' ? response.response.text() : response?.response?.text || '';
    res.json({ success: true, message: 'AI is working!', aiResponse: aiText });
  } catch (error) {
    res.status(500).json({ success: false, error: 'AI connection failed', message: error.message || String(error) });
  }
});

// Health
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running!', mock: MOCK, timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
