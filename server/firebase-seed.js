import { initFirebase, FirebaseEventModel, getFirestore } from './firebase.js';

const sampleEvents = [
  {
    title: 'AI & Machine Learning Meetup',
    description: 'Join us for an exciting discussion about the latest trends in AI and ML technology. Network with professionals and learn from industry experts.',
    date: '2025-11-25',
    time: '18:00',
    location: 'Tech Hub, Bangalore',
    category: 'Technology',
    price: 'Free',
    organizer: 'Tech Community',
    tags: ['AI', 'Machine Learning', 'Networking']
  },
  {
    title: 'Live Music Concert - Indie Rock Night',
    description: 'Experience amazing indie rock performances by local bands. Great music, good vibes, and amazing crowd.',
    date: '2025-11-26',
    time: '20:00',
    location: 'Music Cafe, Delhi',
    category: 'Music',
    price: '₹500',
    organizer: 'Music Lovers Club',
    tags: ['Live Music', 'Indie Rock', 'Concert']
  },
  {
    title: 'Food Festival - Street Food Carnival',
    description: 'Taste the best street food from across India. Over 50 food stalls with authentic flavors and amazing prices.',
    date: '2025-11-27',
    time: '12:00',
    location: 'Central Park, Mumbai',
    category: 'Food',
    price: '₹200',
    organizer: 'Foodie Network',
    tags: ['Street Food', 'Festival', 'Indian Cuisine']
  },
  {
    title: 'Photography Workshop - Portrait Mastery',
    description: 'Learn professional portrait photography techniques from award-winning photographers. Hands-on workshop with practical sessions.',
    date: '2025-11-28',
    time: '10:00',
    location: 'Photography Studio, Pune',
    category: 'Photography',
    price: '₹1500',
    organizer: 'Photo Academy',
    tags: ['Photography', 'Workshop', 'Portrait']
  },
  {
    title: 'Startup Networking Event',
    description: 'Connect with entrepreneurs, investors, and startup enthusiasts. Pitch your ideas and find potential co-founders.',
    date: '2025-11-29',
    time: '19:00',
    location: 'Business Center, Hyderabad',
    category: 'Business',
    price: '₹300',
    organizer: 'Startup Hub',
    tags: ['Startup', 'Networking', 'Business']
  },
  {
    title: 'Yoga & Meditation Retreat',
    description: 'Relax and rejuvenate with guided yoga sessions and meditation practices. Perfect for stress relief and mental wellness.',
    date: '2025-11-30',
    time: '07:00',
    location: 'Wellness Center, Rishikesh',
    category: 'Health',
    price: '₹800',
    organizer: 'Wellness Community',
    tags: ['Yoga', 'Meditation', 'Wellness']
  }
];

export async function seedFirebase() {
  try {
    console.log('🔥 Starting Firebase seeding...');
    
    const firestore = initFirebase();
    
    if (!firestore) {
      console.log('⚠️ Firebase not available, seeding skipped');
      return;
    }

    // Check if events already exist
    const existingEvents = await FirebaseEventModel.getAll();
    if (existingEvents.length > 0) {
      console.log('📊 Firebase already has events, skipping seed');
      return;
    }

    console.log('🌱 Adding sample events to Firebase...');

    // Create events in Firebase
    for (const eventData of sampleEvents) {
      try {
        const createdEvent = await FirebaseEventModel.create(eventData);
        console.log(`✅ Created event: ${eventData.title} (ID: ${createdEvent.id})`);
      } catch (error) {
        console.error(`❌ Failed to create event: ${eventData.title}`, error.message);
      }
    }

    console.log('🎉 Firebase seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Firebase seeding failed:', error);
    throw error;
  }
}

// Run seeder if called directly
if (process.argv[1].endsWith('firebase-seed.js')) {
  seedFirebase()
    .then(() => {
      console.log('✨ Seeding process completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Seeding process failed:', error);
      process.exit(1);
    });
}