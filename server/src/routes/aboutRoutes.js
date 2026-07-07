const express = require('express');
const db = require('../config/database');
const router = express.Router();

// ==================== GET All About ====================
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM about_section ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching about data:', error);
    res.status(500).json({ message: 'Error fetching about data', error: error.message });
  }
});

// ==================== GET Single About ====================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM about_section WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'About section not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching about:', error);
    res.status(500).json({ message: 'Error fetching about', error: error.message });
  }
});

// ==================== CREATE About ====================
router.post('/', async (req, res) => {
  try {
    const { title, description, mission, vision, icon } = req.body;
    
    // Validation
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    const [result] = await db.query(
      'INSERT INTO about_section (title, description, mission, vision, icon) VALUES (?, ?, ?, ?, ?)',
      [title, description, mission || '', vision || '', icon || '📄']
    );
    
    const [newAbout] = await db.query('SELECT * FROM about_section WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      message: '✅ About section created successfully!',
      data: newAbout[0]
    });
  } catch (error) {
    console.error('Error creating about:', error);
    res.status(500).json({ message: 'Error creating about', error: error.message });
  }
});

// ==================== UPDATE About ====================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, mission, vision, icon } = req.body;
    
    // Check if about exists
    const [existing] = await db.query('SELECT * FROM about_section WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'About section not found' });
    }
    
    // Update about
    await db.query(
      `UPDATE about_section 
       SET title = ?, description = ?, mission = ?, vision = ?, icon = ? 
       WHERE id = ?`,
      [title, description, mission || '', vision || '', icon || '📄', id]
    );
    
    const [updatedAbout] = await db.query('SELECT * FROM about_section WHERE id = ?', [id]);
    
    res.json({
      message: '✅ About section updated successfully!',
      data: updatedAbout[0]
    });
  } catch (error) {
    console.error('Error updating about:', error);
    res.status(500).json({ message: 'Error updating about', error: error.message });
  }
});

// ==================== DELETE About ====================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [existing] = await db.query('SELECT * FROM about_section WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'About section not found' });
    }
    
    await db.query('DELETE FROM about_section WHERE id = ?', [id]);
    
    res.json({
      message: '✅ About section deleted successfully!',
      id: id
    });
  } catch (error) {
    console.error('Error deleting about:', error);
    res.status(500).json({ message: 'Error deleting about', error: error.message });
  }
});

module.exports = router;