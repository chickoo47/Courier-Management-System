const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { testConnection } = require('./database');
const couriersRoutes = require('./routes/couriers');
const reportsRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Courier Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/couriers', couriersRoutes);
app.use('/api/reports', reportsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection first
    await testConnection();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log('🚀 COURIER MANAGEMENT SYSTEM - SERVER STARTED');
      console.log('='.repeat(50));
      console.log(`📡 Server running on: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log('='.repeat(50));
      console.log('\n📋 Available API Endpoints:');
      console.log('  POST   /api/couriers/add');
      console.log('  PUT    /api/couriers/update-status/:id');
      console.log('  GET    /api/couriers/status/:id');
      console.log('  GET    /api/couriers/:id/logs');
      console.log('  GET    /api/couriers');
      console.log('  GET    /api/reports/join');
      console.log('  GET    /api/reports/nested');
      console.log('  GET    /api/reports/aggregate');
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
