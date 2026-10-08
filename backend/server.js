require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Route imports
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Middleware: connect to DB on invocation (crucial for Vercel Serverless & local)
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  next();
});

// Bulletproof CORS Configuration (Supports Vercel preview, production, and localhost)
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check & Root API Information
app.get('/', (req, res) => {
  res.json({
    name: 'Candy Crafts Atelier API',
    status: 'running',
    version: '1.0.0',
    ownerEmail: process.env.OWNER_EMAIL || 'candycraftssstudio@gmail.com',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected / pending connection',
    endpoints: [
      '/api/products',
      '/api/categories',
      '/api/orders',
      '/api/inquiries',
      '/api/contact',
      '/api/health'
    ]
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    ownerEmail: process.env.OWNER_EMAIL || 'candycraftssstudio@gmail.com'
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/contact', contactRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on Candy Crafts server`
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Only listen if not running as a Vercel serverless function
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🌸 Candy Crafts Server running at http://localhost:${PORT}`);
    console.log(`📧 Owner Queries Inbox: ${process.env.OWNER_EMAIL || 'candycraftssstudio@gmail.com'}`);
  });
  connectDB();
}

module.exports = app;

