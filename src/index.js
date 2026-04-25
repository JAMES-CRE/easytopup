require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// ── CREATE APP FIRST ──
const app = express();

// ── IMPORT DATABASE ──
require('./config/db');

// ── SECURITY MIDDLEWARE ──
//app.use(helmet());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
    },
  },
}));

// cors allows Flutter app to make requests
app.use(cors());

// Rate limiting 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});
app.use(limiter);

// Parse incoming JSON request bodies
app.use(express.json());

// Serve admin dashboard as static file
app.use(express.static(path.join(__dirname, '../public')));

// ── IMPORT ROUTES (after app is created) ──
const stationsRoutes = require('./routes/stations');
const authRoutes = require('./routes/auth');
const reportsRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admin');

// ── ROUTES ──
app.use('/api/stations', stationsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/admin', adminRoutes);

// ── HEALTH CHECK ──
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running!',
  });
});

// ── 404 HANDLER ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ── GLOBAL ERROR HANDLER ──
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// ── START SERVER ──
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

