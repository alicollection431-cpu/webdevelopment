const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('✅ Server starting...');

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const heroRoutes = require('./src/routes/heroRoutes');
const aboutRoutes = require('./src/routes/aboutRoutes');
const testimonialRoutes = require('./src/routes/testimonialRoutes');
const contactRoutes = require('./src/routes/contactRoutes'); 
// Add with other route imports
const teamRoutes = require('./src/routes/teamRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');

// Use the route
// Make sure this is imported

// Use Routes
app.use('/api/team', teamRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes); // Make sure this is used
app.use('/uploads', express.static('src/uploads'));

// Use the route
app.use('/api/upload', uploadRoutes);

// Try to load service routes
let serviceRoutes;
try {
  serviceRoutes = require('./src/routes/serviceRoutes');
  console.log('✅ Service routes loaded');
  app.use('/api/services', serviceRoutes);
} catch (error) {
  console.error('❌ Service routes not found:', error.message);
  app.use('/api/services', (req, res) => {
    res.json({ message: 'Services API (dummy)' });
  });
}

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ API is working!',
    timestamp: new Date().toISOString()
  });
});

// Root API
app.get('/api', (req, res) => {
  res.json({
    name: 'Zennix API',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      test: '/api/test',
      auth: '/api/auth/login',
      hero: '/api/hero',
      about: '/api/about',
      services: '/api/services',
      testimonials: '/api/testimonials',
      contact: '/api/contact'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`📞 Contact API at http://localhost:${PORT}/api/contact`);
  console.log(`🧪 Test API at http://localhost:${PORT}/api/test`);
});