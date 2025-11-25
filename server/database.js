import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

let db = null;

// Initialize database connection
export async function initDatabase() {
  try {
    db = await open({
      filename: path.join(process.cwd(), 'events.db'),
      driver: sqlite3.Database
    });

    // Create tables
    await createTables();
    console.log('✅ Database initialized successfully');
    return db;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Create database tables
async function createTables() {
  // Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Events table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date DATE NOT NULL,
      time TIME NOT NULL,
      location TEXT NOT NULL,
      category TEXT NOT NULL,
      attendees INTEGER DEFAULT 0,
      price TEXT DEFAULT 'Free',
      organizer TEXT NOT NULL,
      tags TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // RSVPs table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS rsvps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (event_id) REFERENCES events (id),
      UNIQUE(user_id, event_id)
    )
  `);

  console.log('✅ Database tables created');
}

// Get database instance
export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

// Event-related functions
export class EventModel {
  static async getAll() {
    const db = getDatabase();
    const events = await db.all(`
      SELECT e.*, COUNT(r.id) as rsvp_count 
      FROM events e 
      LEFT JOIN rsvps r ON e.id = r.event_id 
      GROUP BY e.id 
      ORDER BY e.date ASC
    `);
    
    return events.map(event => ({
      ...event,
      attendees: event.rsvp_count || 0,
      tags: JSON.parse(event.tags || '[]')
    }));
  }

  static async getById(id) {
    const db = getDatabase();
    const event = await db.get(`
      SELECT e.*, COUNT(r.id) as rsvp_count 
      FROM events e 
      LEFT JOIN rsvps r ON e.id = r.event_id 
      WHERE e.id = ? 
      GROUP BY e.id
    `, [id]);
    
    if (event) {
      event.attendees = event.rsvp_count || 0;
      event.tags = JSON.parse(event.tags || '[]');
    }
    
    return event;
  }

  static async search(query, category) {
    const db = getDatabase();
    let sql = `
      SELECT e.*, COUNT(r.id) as rsvp_count 
      FROM events e 
      LEFT JOIN rsvps r ON e.id = r.event_id 
      WHERE 1=1
    `;
    const params = [];

    if (query) {
      sql += ` AND (e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ? OR e.tags LIKE ?)`;
      const searchTerm = `%${query}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (category && category !== 'all') {
      sql += ` AND e.category LIKE ?`;
      params.push(`%${category}%`);
    }

    sql += ` GROUP BY e.id ORDER BY e.date ASC`;

    const events = await db.all(sql, params);
    
    return events.map(event => ({
      ...event,
      attendees: event.rsvp_count || 0,
      tags: JSON.parse(event.tags || '[]')
    }));
  }

  static async create(eventData) {
    const db = getDatabase();
    const { title, description, date, time, location, category, price, organizer, tags } = eventData;
    
    const result = await db.run(`
      INSERT INTO events (title, description, date, time, location, category, price, organizer, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, description, date, time, location, category, price, organizer, JSON.stringify(tags)]);
    
    return await EventModel.getById(result.lastID);
  }

  static async addRSVP(eventId, userId = 1) {
    const db = getDatabase();
    
    try {
      await db.run('INSERT INTO rsvps (user_id, event_id) VALUES (?, ?)', [userId, eventId]);
      return await EventModel.getById(eventId);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new Error('User already registered for this event');
      }
      throw error;
    }
  }
}

// User-related functions
export class UserModel {
  static async create(userData) {
    const db = getDatabase();
    const { name, email } = userData;
    
    const result = await db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    return await db.get('SELECT * FROM users WHERE id = ?', [result.lastID]);
  }

  static async getByEmail(email) {
    const db = getDatabase();
    return await db.get('SELECT * FROM users WHERE email = ?', [email]);
  }
}