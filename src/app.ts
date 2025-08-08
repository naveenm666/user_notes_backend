import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'reflect-metadata';
import { AppDataSource } from './config/database';
import authRoutes from './routes/auth';
import noteRoutes from './routes/notes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();
console.log('Environment:', process.env.NODE_ENV);
console.log('Database Host:', process.env.DB_HOST);
console.log('Database Port:', process.env.DB_PORT);
console.log('Database Name:', process.env.DB_DATABASE);
console.log('Frontend URL:', process.env.FRONTEND_URL);
console.log('Server Port:', process.env.PORT);
console.log('JWT Secret:', process.env.JWT_SECRET);
console.log('Database Password:', process.env.DB_PASSWORD ? 'Configured' : 'Not Configured');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Error handling middleware
app.use(errorHandler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Keep Notes API Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl 
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

startServer();

export default app;
