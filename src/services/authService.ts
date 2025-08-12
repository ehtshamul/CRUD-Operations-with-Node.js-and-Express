const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class AuthService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw { response: { data } };
    }

    this.token = data.token;
    localStorage.setItem('token', data.token);

    return data;
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw { response: { data } };
    }

    this.token = data.token;
    localStorage.setItem('token', data.token);

    return data;
  }

  async getCurrentUser() {
    if (!this.token) {
      throw new Error('No token available');
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw { response: { data } };
    }

    return data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }
}

export const authService = new AuthService();