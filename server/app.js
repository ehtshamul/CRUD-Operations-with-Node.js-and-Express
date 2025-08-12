import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';

// --- CONFIG ---
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// In-memory storage
const users = [];
const friends = [];

// Utility functions
const generateToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
const hashPassword = async (password) => await bcrypt.hash(password, 12);
const comparePassword = async (password, hashedPassword) => await bcrypt.compare(password, hashedPassword);

// --- CREATE DEMO USER ---
(async () => {
  const demoPassword = 'demo123'; // password for demo user
  const hashedPassword = await hashPassword(demoPassword);
  const demoUser = {
    id: uuidv4(),
    name: 'Demo User',
    email: 'demo@example.com',
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  users.push(demoUser);
  console.log(`✅ Demo user created: email = ${demoUser.email}, password = ${demoPassword}`);
})();

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.userId = decoded.userId;
    next();
  });
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email, and password are required' });

    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });

    const existingUser = users.find(user => user.email === email);
    if (existingUser)
      return res.status(400).json({ error: 'User already exists with this email' });

    const hashedPassword = await hashPassword(password);
    const user = { id: uuidv4(), name, email, password: hashedPassword, createdAt: new Date().toISOString() };
    users.push(user);
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const user = users.find(user => user.email === email);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) return res.status(400).json({ error: 'Invalid credentials' });

    const token = generateToken(user.id);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Friends routes
app.get('/api/friends', authenticateToken, (req, res) => {
  res.json(friends.filter(friend => friend.userId === req.userId));
});

app.post('/api/friends', authenticateToken, (req, res) => {
  const { name, email, phone, company, notes } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

  const existingFriend = friends.find(friend => friend.userId === req.userId && friend.email === email);
  if (existingFriend) return res.status(400).json({ error: 'Friend with this email already exists' });

  const friend = {
    id: uuidv4(),
    userId: req.userId,
    name,
    email,
    phone: phone || '',
    company: company || '',
    notes: notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  friends.push(friend);
  res.status(201).json(friend);
});

app.put('/api/friends/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, email, phone, company, notes } = req.body;
  const friendIndex = friends.findIndex(friend => friend.id === id && friend.userId === req.userId);
  if (friendIndex === -1) return res.status(404).json({ error: 'Friend not found' });

  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
  const emailExists = friends.find(friend => friend.userId === req.userId && friend.email === email && friend.id !== id);
  if (emailExists) return res.status(400).json({ error: 'Another friend with this email already exists' });

  friends[friendIndex] = { ...friends[friendIndex], name, email, phone, company, notes, updatedAt: new Date().toISOString() };
  res.json(friends[friendIndex]);
});

app.delete('/api/friends/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const friendIndex = friends.findIndex(friend => friend.id === id && friend.userId === req.userId);
  if (friendIndex === -1) return res.status(404).json({ error: 'Friend not found' });

  friends.splice(friendIndex, 1);
  res.json({ message: 'Friend deleted successfully' });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(user => user.id === req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(PORT, () => {
  console.log(`🚀 Friends List API server running on port ${PORT}`);
});
