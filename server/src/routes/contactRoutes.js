const express = require('express');
const router = express.Router();

console.log('📞 Contact routes loaded (SIMPLIFIED VERSION)');

// Temporary in-memory storage (no database needed)
let messages = [];
let idCounter = 1;

// POST - Save contact message (IN-MEMORY VERSION)
router.post('/messages', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  console.log('📨 New message received:', { name, email, subject });
  
  if (!name || !email || !message) {
    return res.status(400).json({ 
      message: 'Name, Email, and Message are required' 
    });
  }

  try {
    // Save to in-memory array
    const newMessage = {
      id: idCounter++,
      name,
      email,
      subject: subject || '',
      message,
      status: 'unread',
      created_at: new Date().toISOString()
    };
    messages.push(newMessage);
    
    console.log('✅ Message saved (in-memory). ID:', newMessage.id);
    console.log('📋 Total messages:', messages.length);
    
    res.status(201).json({ 
      message: 'Message sent successfully!',
      id: newMessage.id
    });
  } catch (error) {
    console.error('❌ Error saving message:', error);
    res.status(500).json({ 
      message: 'Error saving message', 
      error: error.message 
    });
  }
});

// GET - Fetch all messages
router.get('/messages', async (req, res) => {
  try {
    console.log('📋 Fetching all messages...');
    console.log('📋 Total messages:', messages.length);
    res.json(messages);
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ 
      message: 'Error fetching messages', 
      error: error.message 
    });
  }
});

// GET - Fetch single message
router.get('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const message = messages.find(m => m.id === parseInt(id));
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Mark as read
    message.status = 'read';
    res.json(message);
  } catch (error) {
    console.error('❌ Error fetching message:', error);
    res.status(500).json({ 
      message: 'Error fetching message', 
      error: error.message 
    });
  }
});

// PUT - Update message status
router.put('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const message = messages.find(m => m.id === parseInt(id));
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    message.status = status;
    res.json({ message: 'Message status updated successfully' });
  } catch (error) {
    console.error('❌ Error updating message:', error);
    res.status(500).json({ 
      message: 'Error updating message', 
      error: error.message 
    });
  }
});

// DELETE - Delete message
router.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const index = messages.findIndex(m => m.id === parseInt(id));
    
    if (index === -1) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    messages.splice(index, 1);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting message:', error);
    res.status(500).json({ 
      message: 'Error deleting message', 
      error: error.message 
    });
  }
});

// Contact info routes (in-memory)
let contactInfo = {
  id: 1,
  phone: '+1 (555) 123-4567',
  email: 'zennix@gmail.com',
  address: '123 Tech Park, Silicon Valley, CA 94025',
  working_hours: 'Mon - Fri: 9:00 AM - 6:00 PM',
  facebook: '',
  twitter: '',
  linkedin: '',
  instagram: ''
};

router.get('/', (req, res) => {
  res.json(contactInfo);
});

router.post('/', (req, res) => {
  contactInfo = { ...contactInfo, ...req.body };
  res.status(201).json(contactInfo);
});

router.put('/:id', (req, res) => {
  contactInfo = { ...contactInfo, ...req.body, id: parseInt(req.params.id) };
  res.json(contactInfo);
});

router.delete('/:id', (req, res) => {
  contactInfo = {
    id: 1,
    phone: '',
    email: '',
    address: '',
    working_hours: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: ''
  };
  res.json({ message: 'Contact deleted' });
});

router.get('/test', (req, res) => {
  res.json({ 
    message: 'Contact route is working! (in-memory mode)',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;