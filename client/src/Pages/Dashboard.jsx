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
  BookOpen,
  Star,
  ExternalLink,
  Loader,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

export default function Dashboard() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [favoriteEvents, setFavoriteEvents] = useState(new Set());
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(new Set());

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
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

  useEffect(() => {
    fetchEvents();
  }, []);

  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Toggle favorite events
  const toggleFavorite = (eventId) => {
    const newFavorites = new Set(favoriteEvents);
    if (newFavorites.has(eventId)) {
      newFavorites.delete(eventId);
      showNotification('Removed from favorites', 'info');
    } else {
      newFavorites.add(eventId);
      showNotification('Added to favorites!');
    }
    setFavoriteEvents(newFavorites);
  };

  // Fetch events from backend
  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
      } else {
        console.error('Failed to fetch events');
        setEvents(sampleEvents); // Fallback to sample data
        showNotification('Using offline data', 'info');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents(sampleEvents); // Fallback to sample data
      showNotification('Connection error, using offline data', 'info');
    } finally {
      setLoadingEvents(false);
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
    setRsvpLoading(prev => new Set([...prev, eventId]));
    
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userEmail: user.email || 'user@example.com' })
      });
      
      const data = await response.json();
      if (data.success) {
        // Update the event in the local state
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === eventId 
              ? { ...event, attendees: (event.attendees || 0) + 1 }
              : event
          )
        );
        showNotification('RSVP Successful! See you there! 🎉');
        toggleFavorite(eventId); // Auto-add to favorites
      } else {
        showNotification(data.error || 'RSVP Failed', 'error');
      }
    } catch (error) {
      console.error('RSVP Error:', error);
      showNotification('Network error. Please try again.', 'error');
    } finally {
      setRsvpLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  // Skeleton loader component
  const EventSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300"></div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Use events directly from backend (already filtered)
  const filteredEvents = events;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                    EventAI
                  </h1>
                  <p className="text-xs text-gray-500">Powered by Gemini</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200">
                  <Bell size={20} />
                </button>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </div>
              
              <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200">
                <Settings size={20} />
              </button>
              
              <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full px-4 py-2 border border-purple-100">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-md">
                  <User size={16} className="text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-800">Hi, {user.name}!</span>
                  <div className="flex items-center space-x-1">
                    <Star size={10} className="text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500">{favoriteEvents.size} favorites</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Notification System */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out ${
          notification ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
          <div className={`rounded-xl shadow-2xl border-l-4 p-4 ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-400 text-green-800' 
              : notification.type === 'error'
              ? 'bg-red-50 border-red-400 text-red-800'
              : 'bg-blue-50 border-blue-400 text-blue-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {notification.type === 'success' && <CheckCircle size={20} className="text-green-600 mr-2" />}
                {notification.type === 'error' && <AlertCircle size={20} className="text-red-600 mr-2" />}
                {notification.type === 'info' && <Bell size={20} className="text-blue-600 mr-2" />}
                <span className="font-medium">{notification.message}</span>
              </div>
              <button 
                onClick={() => setNotification(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced AI Suggestion Section */}
        <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-3xl p-8 mb-8 overflow-hidden shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl animate-bounce"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
              <div className="text-white flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">AI Event Suggestions</h2>
                    <p className="text-purple-200 text-sm">Powered by Google Gemini</p>
                  </div>
                </div>
                
                <p className="text-purple-100 mb-6 text-lg leading-relaxed">
                  Let our advanced AI analyze your preferences and discover events that match your interests perfectly
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowInterestModal(true)}
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 flex items-center border border-white/20"
                  >
                    <Settings className="mr-2" size={18} />
                    Set Interests
                  </button>
                  
                  {selectedInterests.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-200 text-sm">Active:</span>
                      {selectedInterests.slice(0, 2).map(interest => (
                        <span key={interest} className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                          {interest}
                        </span>
                      ))}
                      {selectedInterests.length > 2 && (
                        <span className="text-purple-200 text-sm">+{selectedInterests.length - 2} more</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <button
                  onClick={generateAISuggestions}
                  disabled={loading}
                  className="group bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-purple-50 transition-all duration-200 flex items-center shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin mr-3" size={24} />
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-3 group-hover:scale-110 transition-transform" size={24} />
                      Get AI Suggestions
                    </>
                  )}
                </button>
              </div>
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

        {/* Enhanced Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Search size={20} className="mr-2 text-purple-600" />
                Discover Events
              </h3>
              <span className="text-sm text-gray-500">
                {events.length} events available
              </span>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search events... (AI-powered search)"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm placeholder-gray-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      searchEvents('', selectedCategory);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <div className="flex gap-3">
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="appearance-none px-4 py-4 pr-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white/50 backdrop-blur-sm font-medium text-gray-700 cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    <option value="technology">🔧 Technology</option>
                    <option value="music">🎵 Music</option>
                    <option value="food">🍕 Food</option>
                    <option value="photography">📷 Photography</option>
                    <option value="business">💼 Business</option>
                    <option value="health">🧘 Health</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                
                <button className="px-4 py-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 rounded-xl hover:from-purple-200 hover:to-pink-200 transition-all duration-200 border-2 border-purple-200 group">
                  <Filter size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loadingEvents ? (
            // Show skeleton loaders
            Array.from({ length: 6 }).map((_, index) => (
              <EventSkeleton key={index} />
            ))
          ) : (
            filteredEvents.map((event, index) => (
              <div 
                key={event.id} 
                className="group bg-white/80 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/20 transform hover:scale-[1.02] hover:-rotate-1"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="relative overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500 group-hover:scale-110 transition-transform duration-500"></div>
                  
                  {/* Floating price tag */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-bold text-purple-600 shadow-lg">
                    {event.price}
                  </div>
                  
                  {/* Favorite button */}
                  <button
                    onClick={() => toggleFavorite(event.id)}
                    className={`absolute top-4 left-4 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                      favoriteEvents.has(event.id)
                        ? 'bg-red-100 text-red-600'
                        : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
                    }`}
                  >
                    <Heart 
                      size={18} 
                      className={favoriteEvents.has(event.id) ? 'fill-current' : ''} 
                    />
                  </button>

                  {/* Category overlay */}
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    {event.category}
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Available</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm bg-gray-100 rounded-full px-3 py-1">
                      <Users size={14} className="mr-1" />
                      {event.attendees || 0}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-200 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-500 text-sm bg-gray-50 rounded-lg p-2">
                      <Calendar size={14} className="mr-2 text-purple-600" />
                      <span className="font-medium">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <Clock size={14} className="ml-4 mr-2 text-purple-600" />
                      <span>{event.time}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500 text-sm bg-gray-50 rounded-lg p-2">
                      <MapPin size={14} className="mr-2 text-purple-600" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {event.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium border border-purple-200"
                      >
                        #{tag}
                      </span>
                    ))}
                    {event.tags.length > 3 && (
                      <span className="text-gray-500 text-xs px-2 py-1">
                        +{event.tags.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => handleRSVP(event.id)}
                      disabled={rsvpLoading.has(event.id)}
                      className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {rsvpLoading.has(event.id) ? (
                        <>
                          <Loader className="animate-spin mr-2" size={16} />
                          RSVPing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 group-hover:scale-110 transition-transform" size={16} />
                          RSVP
                        </>
                      )}
                    </button>
                    
                    <div className="flex space-x-2">
                      <button className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-200 group">
                        <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                      </button>
                      <button className="p-3 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-xl transition-all duration-200 group">
                        <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add CSS for animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>

        {/* Enhanced Empty State */}
        {!loadingEvents && filteredEvents.length === 0 && (
          <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar size={48} className="text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No events found</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search criteria or browse all categories'
                  : 'No events are currently available. Check back soon!'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    fetchEvents();
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Browse All Events
                </button>
                <button
                  onClick={() => setShowInterestModal(true)}
                  className="px-6 py-3 border-2 border-purple-200 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200"
                >
                  Set Your Interests
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Floating Action Button */}
        <div className="fixed bottom-8 right-8 flex flex-col space-y-3">
          {favoriteEvents.size > 0 && (
            <button 
              className="bg-white/90 backdrop-blur-sm text-purple-600 p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 border border-purple-200 group"
              title={`${favoriteEvents.size} favorites`}
            >
              <Heart size={20} className="fill-current group-hover:scale-110 transition-transform" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {favoriteEvents.size}
              </span>
            </button>
          )}
          
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 group transform hover:scale-110">
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* Enhanced Interest Selection Modal */}
      {showInterestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-white/20 animate-slideUp">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles size={32} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text mb-2">
                What interests you?
              </h3>
              <p className="text-gray-600">Select your preferences to get personalized AI suggestions</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {interestCategories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedInterests.includes(category.name);
                return (
                  <button
                    key={category.id}
                    onClick={() => toggleInterest(category.name)}
                    className={`group p-6 rounded-2xl border-2 transition-all duration-200 transform hover:scale-105 ${
                      isSelected
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl ${isSelected ? 'bg-gradient-to-r from-purple-500 to-pink-500' : category.color} flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <span className={`text-sm font-semibold ${isSelected ? 'text-purple-700' : 'text-gray-700'} block`}>
                      {category.name}
                    </span>
                    {isSelected && (
                      <div className="mt-2">
                        <CheckCircle size={16} className="text-purple-600 mx-auto" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {selectedInterests.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-6 border border-purple-200">
                <p className="text-sm text-purple-700 font-medium mb-2">Selected interests:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedInterests.map(interest => (
                    <span key={interest} className="bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-medium border border-purple-200">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowInterestModal(false)}
                className="flex-1 px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowInterestModal(false);
                  if (selectedInterests.length > 0) {
                    generateAISuggestions();
                  }
                }}
                disabled={selectedInterests.length === 0}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <TrendingUp className="mr-2" size={20} />
                {selectedInterests.length === 0 ? 'Select interests' : `Get AI Suggestions (${selectedInterests.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add animations CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}