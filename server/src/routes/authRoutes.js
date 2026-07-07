const express = require('express');
const router = express.Router();

// Simple test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working' });
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Simple response for testing
    if (username === 'admin' && password === 'admin123') {
      return res.json({
        token: 'fake_token_12345',
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@zennix.com',
          role: 'admin'
        }
      });
    }
    
    res.status(400).json({ message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;