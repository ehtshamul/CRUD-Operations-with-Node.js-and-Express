import React, { useState, useEffect } from 'react';
import { Users, LogOut, UserPlus, Edit3, Trash2, Search, Mail, Phone, Building } from 'lucide-react';
import AuthForm from './components/AuthForm';
import FriendCard from './components/FriendCard';
import FriendForm from './components/FriendForm';
import Navbar from './components/Navbar';
import { authService } from './services/authService';
import { friendsService } from './services/friendsService';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface Friend {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showFriendForm, setShowFriendForm] = useState(false);
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        authService.setToken(token);
        const userData = await authService.getCurrentUser();
        setUser(userData);
        await loadFriends();
      }
    } catch (error) {
      console.error('Initialization error:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const loadFriends = async () => {
    try {
      const friendsData = await friendsService.getFriends();
      setFriends(friendsData);
    } catch (error) {
      console.error('Load friends error:', error);
      setError('Failed to load friends');
    }
  };

  const handleAuth = async (userData: User) => {
    setUser(userData);
    setShowAuthForm(false);
    setError('');
    await loadFriends();
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setFriends([]);
    setError('');
  };

  const handleAddFriend = () => {
    setEditingFriend(null);
    setShowFriendForm(true);
  };

  const handleEditFriend = (friend: Friend) => {
    setEditingFriend(friend);
    setShowFriendForm(true);
  };

  const handleFriendSubmit = async (friendData: Partial<Friend>) => {
    try {
      if (editingFriend) {
        await friendsService.updateFriend(editingFriend.id, friendData);
      } else {
        await friendsService.createFriend(friendData);
      }
      setShowFriendForm(false);
      setEditingFriend(null);
      await loadFriends();
    } catch (error: any) {
      console.error('Friend submit error:', error);
      setError(error.response?.data?.error || 'Failed to save friend');
    }
  };

  const handleDeleteFriend = async (friendId: string) => {
    if (window.confirm('Are you sure you want to delete this friend?')) {
      try {
        await friendsService.deleteFriend(friendId);
        await loadFriends();
      } catch (error) {
        console.error('Delete friend error:', error);
        setError('Failed to delete friend');
      }
    }
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (friend.company && friend.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            {!showAuthForm ? (
              <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-2xl p-8 text-center border border-white/20">
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Users className="text-white" size={32} />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Friends List
                  </h1>
                  <p className="text-gray-600">Manage your friends with style</p>
                </div>
                <button
                  onClick={() => setShowAuthForm(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <AuthForm onSuccess={handleAuth} onCancel={() => setShowAuthForm(false)} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar user={user} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
            <button
              onClick={() => setError('')}
              className="float-right text-red-700 hover:text-red-900"
            >
              
            </button>
          </div>
        )}

        <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">My Friends ({friends.length})</h2>
            <button
              onClick={handleAddFriend}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center gap-2"
            >
              <UserPlus size={20} />
              Add Friend
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
            />
          </div>

          {filteredFriends.length === 0 ? (
            <div className="text-center py-12">
              {friends.length === 0 ? (
                <div>
                  <Users className="mx-auto text-gray-400 mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No friends yet</h3>
                  <p className="text-gray-500 mb-6">Start building your network by adding your first friend!</p>
                  <button
                    onClick={handleAddFriend}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                  >
                    Add Your First Friend
                  </button>
                </div>
              ) : (
                <div>
                  <Search className="mx-auto text-gray-400 mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No matching friends</h3>
                  <p className="text-gray-500">Try adjusting your search terms</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFriends.map((friend) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  onEdit={handleEditFriend}
                  onDelete={handleDeleteFriend}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showFriendForm && (
        <FriendForm
          friend={editingFriend}
          onSubmit={handleFriendSubmit}
          onCancel={() => {
            setShowFriendForm(false);
            setEditingFriend(null);
          }}
        />
      )}
    </div>
  );
}

export default App;