import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Sample events data (in real app, this would be from database)
const sampleEvents = [
  {
    id: 1,
    title: "AI & Machine Learning Meetup",
    description: "Join us for an exciting discussion about the latest trends in AI and ML technology. Network with professionals and learn from industry experts.",
    date: "2025-11-25",
    time: "18:00",
    location: "Tech Hub, Bangalore",
    category: "Technology",
    attendees: 45,
    price: "Free",
    organizer: "Tech Community",
    tags: ['AI', 'Machine Learning', 'Networking']
  },
  {
    id: 2,
    title: "Live Music Concert - Indie Rock Night",
    description: "Experience amazing indie rock performances by local bands. Great music, good vibes, and amazing crowd.",
    date: "2025-11-26",
    time: "20:00",
    location: "Music Cafe, Delhi",
    category: "Music",
    attendees: 120,
    price: "₹500",
    organizer: "Music Lovers Club",
    tags: ['Live Music', 'Indie Rock', 'Concert']
  },
  {
    id: 3,
    title: "Food Festival - Street Food Carnival",
    description: "Taste the best street food from across India. Over 50 food stalls with authentic flavors and amazing prices.",
    date: "2025-11-27",
    time: "12:00",
    location: "Central Park, Mumbai",
    category: "Food",
    attendees: 300,
    price: "₹200",
    organizer: "Foodie Network",
    tags: ['Street Food', 'Festival', 'Indian Cuisine']
  },
  {
    id: 4,
    title: "Photography Workshop - Portrait Mastery",
    description: "Learn professional portrait photography techniques from award-winning photographers. Hands-on workshop with practical sessions.",
    date: "2025-11-28",
    time: "10:00",
    location: "Photography Studio, Pune",
    category: "Photography",
    attendees: 25,
    price: "₹1500",
    organizer: "Photo Academy",
    tags: ['Photography', 'Workshop', 'Portrait']
  },
  {
    id: 5,
    title: "Startup Networking Event",
    description: "Connect with entrepreneurs, investors, and startup enthusiasts. Pitch your ideas and find potential co-founders.",
    date: "2025-11-29",
    time: "19:00",
    location: "Business Center, Hyderabad",
    category: "Business",
    attendees: 80,
    price: "₹300",
    organizer: "Startup Hub",
    tags: ['Startup', 'Networking', 'Business']
  },
  {
    id: 6,
    title: "Yoga & Meditation Retreat",
    description: "Relax and rejuvenate with guided yoga sessions and meditation practices. Perfect for stress relief and mental wellness.",
    date: "2025-11-30",
    time: "07:00",
    location: "Wellness Center, Rishikesh",
    category: "Health",
    attendees: 35,
    price: "₹800",
    organizer: "Wellness Community",
    tags: ['Yoga', 'Meditation', 'Wellness']
  }
];

// API Routes

// Get all events
app.get('/api/events', (req, res) => {
  res.json({
    success: true,
    events: sampleEvents
  });
});

// Search events
app.get('/api/events/search', (req, res) => {
  const { q, category } = req.query;
  
  let filteredEvents = sampleEvents;
  
  // Filter by search query
  if (q) {
    filteredEvents = filteredEvents.filter(event => 
      event.title.toLowerCase().includes(q.toLowerCase()) ||
      event.description.toLowerCase().includes(q.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(q.toLowerCase())) ||
      event.location.toLowerCase().includes(q.toLowerCase())
    );
  }
  
  // Filter by category
  if (category && category !== 'all') {
    filteredEvents = filteredEvents.filter(event => 
      event.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  res.json({
    success: true,
    events: filteredEvents,
    total: filteredEvents.length
  });
});

// Get AI suggestions for events
app.post('/api/events/ai-suggestions', async (req, res) => {
  try {
    const { interests, userPreferences } = req.body;
    
    // Create a prompt for AI based on user interests
    const prompt = `Based on these user interests: ${interests.join(', ')}, suggest relevant events from this list and explain why they would be interested. 
    
    Available events:
    ${sampleEvents.map(event => 
      `${event.title} - ${event.category} - ${event.description}`
    ).join('\n')}
    
    Please provide personalized recommendations with brief explanations.`;
    
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const response = await model.generateContent(prompt);
    
    // Filter events based on interests
    const suggestedEvents = sampleEvents.filter(event => 
      interests.some(interest => 
        event.category.toLowerCase().includes(interest.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
      )
    );
    
    res.json({
      success: true,
      aiResponse: response.response.text(),
      suggestedEvents: suggestedEvents,
      totalSuggestions: suggestedEvents.length
    });
    
  } catch (error) {
    console.error('AI Suggestion Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI suggestions',
      message: error.message
    });
  }
});

// Get event details by ID
app.get('/api/events/:id', (req, res) => {
  const eventId = parseInt(req.params.id);
  const event = sampleEvents.find(e => e.id === eventId);
  
  if (!event) {
    return res.status(404).json({
      success: false,
      error: 'Event not found'
    });
  }
  
  res.json({
    success: true,
    event: event
  });
});

// RSVP to an event
app.post('/api/events/:id/rsvp', (req, res) => {
  const eventId = parseInt(req.params.id);
  const event = sampleEvents.find(e => e.id === eventId);
  
  if (!event) {
    return res.status(404).json({
      success: false,
      error: 'Event not found'
    });
  }
  
  // In real app, this would update database
  event.attendees += 1;
  
  res.json({
    success: true,
    message: 'RSVP successful',
    event: event
  });
});

// Test AI connection
app.get('/api/test-ai', async (req, res) => {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const response = await model.generateContent("Hello! Can you suggest a tech event in one sentence?");
    
    res.json({
      success: true,
      message: 'AI is working!',
      aiResponse: response.response.text()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'AI connection failed',
      message: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available:`);
  console.log(`   GET  /api/events - Get all events`);
  console.log(`   GET  /api/events/search?q=query&category=tech - Search events`);
  console.log(`   POST /api/events/ai-suggestions - Get AI suggestions`);
  console.log(`   GET  /api/events/:id - Get event details`);
  console.log(`   POST /api/events/:id/rsvp - RSVP to event`);
  console.log(`   GET  /api/test-ai - Test AI connection`);
});
