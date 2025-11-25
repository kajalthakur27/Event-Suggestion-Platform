import admin from 'firebase-admin';

// Firebase configuration
let db = null;

export function initFirebase() {
  console.log('🔧 Initializing in mock mode for demo...');
  console.log('📝 Using mock database instead of real Firebase');
  return null;
}

export function getFirestore() {
  return null; // Always return null to use mock data
}

// Event operations with mock data only
export class FirebaseEventModel {
  static async getAll() {
    // Always return mock data
    return getMockEvents();
  }

  static async getById(id) {
    const mockEvents = getMockEvents();
    return mockEvents.find(event => event.id.toString() === id.toString());
  }

  static async search(query, category) {
    return searchMockEvents(query, category);
  }

  static async create(eventData) {
    console.log('Mock: Would create event:', eventData.title);
    return { id: Date.now().toString(), ...eventData, attendees: 0 };
  }

  static async addRSVP(eventId, userEmail = 'demo@example.com') {
    console.log('Mock: RSVP added for event', eventId);
    const mockEvents = getMockEvents();
    const event = mockEvents.find(e => e.id.toString() === eventId.toString());
    if (event) {
      event.attendees = (event.attendees || 0) + 1;
      return event;
    }
    return null;
  }
}

// Mock data
function getMockEvents() {
  return [
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
}

function searchMockEvents(query, category) {
  let events = getMockEvents();
  
  if (category && category !== 'all') {
    events = events.filter(event => 
      event.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (query) {
    const queryLower = query.toLowerCase();
    events = events.filter(event => 
      event.title.toLowerCase().includes(queryLower) ||
      event.description.toLowerCase().includes(queryLower) ||
      event.location.toLowerCase().includes(queryLower) ||
      event.tags.some(tag => tag.toLowerCase().includes(queryLower))
    );
  }
  
  return events;
}