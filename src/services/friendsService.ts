const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class FriendsService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getFriends() {
    const response = await fetch(`${API_BASE_URL}/friends`, {
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw { response: { data } };
    }

    return data;
  }

  async createFriend(friendData: any) {
    const response = await fetch(`${API_BASE_URL}/friends`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(friendData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw { response: { data } };
    }

    return data;
  }

  async updateFriend(friendId: string, friendData: any) {
    const response = await fetch(`${API_BASE_URL}/friends/${friendId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(friendData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw { response: { data } };
    }

    return data;
  }

  async deleteFriend(friendId: string) {
    const response = await fetch(`${API_BASE_URL}/friends/${friendId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw { response: { data } };
    }

    return data;
  }
}

export const friendsService = new FriendsService();