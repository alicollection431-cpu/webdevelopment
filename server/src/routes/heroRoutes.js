const express = require('express');
const db = require('../config/database');
const router = express.Router();

// ==================== GET All Heroes ====================
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hero_section ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching heroes:', error);
    res.status(500).json({ message: 'Error fetching heroes', error: error.message });
  }
});

// ==================== GET Single Hero ====================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM hero_section WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Hero not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching hero:', error);
    res.status(500).json({ message: 'Error fetching hero', error: error.message });
  }
});

// ==================== CREATE Hero ====================
router.post('/', async (req, res) => {
  try {
    const { tag, title, description, button_text, button_link } = req.body;
    
    // Validation
    if (!tag || !title || !description) {
      return res.status(400).json({ message: 'Tag, title and description are required' });
    }
    
    const [result] = await db.query(
      'INSERT INTO hero_section (tag, title, description, button_text, button_link) VALUES (?, ?, ?, ?, ?)',
      [tag, title, description, button_text || 'Get Started', button_link || '/contact']
    );
    
    // Get inserted data
    const [newHero] = await db.query('SELECT * FROM hero_section WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      message: '✅ Hero section created successfully!',
      data: newHero[0]
    });
  } catch (error) {
    console.error('Error creating hero:', error);
    res.status(500).json({ message: 'Error creating hero', error: error.message });
  }
});

// ==================== UPDATE Hero ====================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tag, title, description, button_text, button_link } = req.body;
    
    // Check if hero exists
    const [existing] = await db.query('SELECT * FROM hero_section WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Hero not found' });
    }
    
    // Update hero
    await db.query(
      `UPDATE hero_section 
       SET tag = ?, title = ?, description = ?, button_text = ?, button_link = ? 
       WHERE id = ?`,
      [tag, title, description, button_text, button_link, id]
    );
    
    // Get updated data
    const [updatedHero] = await db.query('SELECT * FROM hero_section WHERE id = ?', [id]);
    
    res.json({
      message: '✅ Hero section updated successfully!',
      data: updatedHero[0]
    });
  } catch (error) {
    console.error('Error updating hero:', error);
    res.status(500).json({ message: 'Error updating hero', error: error.message });
  }
});

// ==================== DELETE Hero ====================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if hero exists
    const [existing] = await db.query('SELECT * FROM hero_section WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Hero not found' });
    }
    
    await db.query('DELETE FROM hero_section WHERE id = ?', [id]);
    
    res.json({
      message: '✅ Hero section deleted successfully!',
      id: id
    });
  } catch (error) {
    console.error('Error deleting hero:', error);
    res.status(500).json({ message: 'Error deleting hero', error: error.message });
  }
});

module.exports = router;