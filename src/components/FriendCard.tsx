import React from 'react';
import { Edit3, Trash2, Mail, Phone, Building, User } from 'lucide-react';

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

interface FriendCardProps {
  friend: Friend;
  onEdit: (friend: Friend) => void;
  onDelete: (friendId: string) => void;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="backdrop-blur-lg bg-white/80 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30 overflow-hidden group hover:scale-[1.02]">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-semibold">
              {getInitials(friend.name)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">{friend.name}</h3>
              <p className="text-sm text-gray-500">Added {formatDate(friend.createdAt)}</p>
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(friend)}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
              title="Edit friend"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => onDelete(friend.id)}
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
              title="Delete friend"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-600">
            <Mail size={16} className="text-blue-500" />
            <span className="text-sm truncate">{friend.email}</span>
          </div>

          {friend.phone && (
            <div className="flex items-center gap-3 text-gray-600">
              <Phone size={16} className="text-green-500" />
              <span className="text-sm">{friend.phone}</span>
            </div>
          )}

          {friend.company && (
            <div className="flex items-center gap-3 text-gray-600">
              <Building size={16} className="text-purple-500" />
              <span className="text-sm truncate">{friend.company}</span>
            </div>
          )}

          {friend.notes && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 italic">"{friend.notes}"</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => window.open(`mailto:${friend.email}`)}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            <Mail size={14} />
            Email
          </button>
          {friend.phone && (
            <button
              onClick={() => window.open(`tel:${friend.phone}`)}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
              <Phone size={14} />
              Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendCard;