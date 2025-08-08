import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { validateEmail, validatePassword, validateUsername } from '../utils/validation';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();
const userRepository = AppDataSource.getRepository(User);

// Register
router.post('/register', asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ 
      message: 'All fields are required',
      fields: ['username', 'email', 'password']
    });
  }

  if (!validateUsername(username)) {
    return res.status(400).json({ 
      message: 'Username must be between 3 and 50 characters long' 
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ 
      message: 'Password must be at least 6 characters long' 
    });
  }

  const existingUser = await userRepository.findOne({
    where: [
      { user_email: email },
      { user_name: username }
    ]
  });

  if (existingUser) {
    const field = existingUser.user_email === email ? 'email' : 'username';
    return res.status(400).json({ 
      message: `User with this ${field} already exists` 
    });
  }

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = userRepository.create({
    user_name: username,
    user_email: email,
    password: hashedPassword,
  });

  await userRepository.save(user);

  const token = jwt.sign(
    { userId: user.user_id, email: user.user_email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: user.user_id,
      username: user.user_name,
      email: user.user_email,
    },
  });
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      message: 'Email and password are required',
      fields: ['email', 'password']
    });
  }

  const user = await userRepository.findOne({
    where: { user_email: email }
  });

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user.user_id, email: user.user_email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.user_id,
      username: user.user_name,
      email: user.user_email,
    },
  });
}));

// Get current user profile
router.get('/profile', asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const user = await userRepository.findOne({
      where: { user_id: decoded.userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.user_id,
        username: user.user_name,
        email: user.user_email,
        createdOn: user.created_on,
        lastUpdate: user.last_update,
      },
    });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}));

export default router;
