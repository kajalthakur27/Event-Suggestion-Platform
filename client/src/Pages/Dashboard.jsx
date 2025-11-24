import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Heart, 
  Share2, 
  Plus,
  User,
  Settings,
  Bell,
  Sparkles,
  TrendingUp,
  Music,
  Camera,
  Gamepad2,
  Coffee,
  Briefcase,
  BookOpen
} from 'lucide-react';

export default function Dashboard() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);

  // Sample user data
  const user = {
    name: "Kajal",
    avatar: "/api/placeholder/40/40",
    interests: ['Music', 'Technology', 'Food']
  };

  // Interest categories with icons
  const interestCategories = [
    { id: 'music', name: 'Music', icon: Music, color: 'bg-purple-500' },
    { id: 'tech', name: 'Technology', icon: Briefcase, color: 'bg-blue-500' },
    { id: 'food', name: 'Food & Dining', icon: Coffee, color: 'bg-orange-500' },
    { id: 'photography', name: 'Photography', icon: Camera, color: 'bg-green-500' },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2, color: 'bg-red-500' },
    { id: 'education', name: 'Education', icon: BookOpen, color: 'bg-indigo-500' }
  ];

  // Sample events data
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
      image: "/api/placeholder/300/200",
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
      image: "/api/placeholder/300/200",
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
      image: "/api/placeholder/300/200",
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
      image: "/api/placeholder/300/200",
      organizer: "Photo Academy",
      tags: ['Photography', 'Workshop', 'Portrait']
    }
  ];

  // API configuration
  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
      } else {
        console.error('Failed to fetch events');
        setEvents(sampleEvents); // Fallback to sample data
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents(sampleEvents); // Fallback to sample data
    }
  };

  // Generate AI suggestions using backend API
  const generateAISuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/events/ai-suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interests: selectedInterests,
          userPreferences: user.interests
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setEvents(data.suggestedEvents);
        console.log('AI Response:', data.aiResponse);
      } else {
        console.error('AI suggestions failed:', data.error);
        // Fallback to local filtering
        const suggestedEvents = events.filter(event => 
          selectedInterests.some(interest => 
            event.category.toLowerCase().includes(interest.toLowerCase()) ||
            event.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
          )
        );
        setEvents(suggestedEvents.length > 0 ? suggestedEvents : events);
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      // Fallback to local filtering
      const suggestedEvents = events.filter(event => 
        selectedInterests.some(interest => 
          event.category.toLowerCase().includes(interest.toLowerCase()) ||
          event.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
        )
      );
      setEvents(suggestedEvents.length > 0 ? suggestedEvents : events);
    } finally {
      setLoading(false);
    }
  };

  // Handle interest selection
  const toggleInterest = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  // Search events using backend API
  const searchEvents = async (query, category) => {
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (category && category !== 'all') params.append('category', category);
      
      const response = await fetch(`${API_BASE_URL}/events/search?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.events);
      } else {
        console.error('Search failed');
      }
    } catch (error) {
      console.error('Error searching events:', error);
    }
  };

  // Handle search input change with debouncing
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      searchEvents(query, selectedCategory);
    }, 500);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    searchEvents(searchQuery, category);
  };

  // Handle RSVP
  const handleRSVP = async (eventId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      if (data.success) {
        // Update the event in the local state
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === eventId 
              ? { ...event, attendees: event.attendees + 1 }
              : event
          )
        );
        alert('RSVP Successful!');
      } else {
        alert('RSVP Failed: ' + data.error);
      }
    } catch (error) {
      console.error('RSVP Error:', error);
      alert('RSVP Failed: Network error');
    }
  };

  // Use events directly from backend (already filtered)
  const filteredEvents = events;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">EventAI</h1>
              <span className="ml-2 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text font-semibold">
                Powered by Gemini
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                <Bell size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                <Settings size={20} />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Hi, {user.name}!</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Suggestion Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <Sparkles className="mr-2" size={24} />
                AI Event Suggestions
              </h2>
              <p className="text-purple-100 mb-4">
                Let our AI find perfect events based on your interests
              </p>
              <button
                onClick={() => setShowInterestModal(true)}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
              >
                Set Your Interests
              </button>
            </div>
            <div className="text-white">
              <button
                onClick={generateAISuggestions}
                disabled={loading}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                ) : (
                  <TrendingUp className="mr-2" size={20} />
                )}
                {loading ? 'Generating...' : 'Get AI Suggestions'}
              </button>
            </div>
          </div>
        </div>

        {/* Selected Interests Display */}
        {selectedInterests.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Interests:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedInterests.map((interest) => (
                <span
                  key={interest}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events... (AI-powered search)"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="all">All Categories</option>
                <option value="technology">Technology</option>
                <option value="music">Music</option>
                <option value="food">Food</option>
                <option value="photography">Photography</option>
                <option value="business">Business</option>
                <option value="health">Health</option>
              </select>
              <button className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative">
                <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-400"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold text-purple-600">
                  {event.price}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    {event.category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Users size={14} className="mr-1" />
                    {event.attendees}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {event.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar size={14} className="mr-2" />
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                    <Clock size={14} className="ml-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin size={14} className="mr-2" />
                    {event.location}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {event.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => handleRSVP(event.id)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    RSVP
                  </button>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Heart size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or interests</p>
          </div>
        )}

        {/* Floating Action Button */}
        <button className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow">
          <Plus size={24} />
        </button>
      </div>

      {/* Interest Selection Modal */}
      {showInterestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Select Your Interests</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {interestCategories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedInterests.includes(category.name);
                return (
                  <button
                    key={category.id}
                    onClick={() => toggleInterest(category.name)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center mb-2 mx-auto`}>
                      <Icon size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowInterestModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowInterestModal(false);
                  generateAISuggestions();
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Save & Get Suggestions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}