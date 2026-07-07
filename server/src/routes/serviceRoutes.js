const express = require('express');
const db = require('../config/database');
const router = express.Router();

// ==================== GET All Services ====================
router.get('/', async (req, res) => {
  try {
    console.log('📊 Fetching services...');
    
    // Check if database connection exists
    if (!db) {
      console.log('⚠️ Database not connected, returning empty array');
      return res.json([]);
    }
    
    const [rows] = await db.query('SELECT * FROM services ORDER BY id DESC');
    console.log('📊 Services fetched:', rows.length);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching services:', error);
    res.json([]);
  }
});

// ==================== GET Single Service ====================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM services WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error fetching service:', error);
    res.status(500).json({ message: 'Error fetching service' });
  }
});

// ==================== CREATE Service ====================
router.post('/', async (req, res) => {
  try {
    const { icon, title, description, features, features2, features3, is_active } = req.body;
    
    console.log('📝 Creating service:', { title, icon });
    
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    const [result] = await db.query(
      `INSERT INTO services (icon, title, description, features, features2, features3, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [icon || '📄', title, description, features || '', features2 || '', features3 || '', is_active !== undefined ? is_active : 1]
    );
    
    const [newService] = await db.query('SELECT * FROM services WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      message: '✅ Service created successfully!',
      data: newService[0]
    });
  } catch (error) {
    console.error('❌ Error creating service:', error);
    res.status(500).json({ message: 'Error creating service' });
  }
});

// ==================== UPDATE Service ====================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { icon, title, description, features, features2, features3, is_active } = req.body;
    
    console.log('📝 Updating service:', { id, title });
    
    const [existing] = await db.query('SELECT * FROM services WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    await db.query(
      `UPDATE services 
       SET icon = ?, title = ?, description = ?, features = ?, features2 = ?, features3 = ?, is_active = ?
       WHERE id = ?`,
      [icon || '📄', title, description, features || '', features2 || '', features3 || '', is_active !== undefined ? is_active : 1, id]
    );
    
    const [updatedService] = await db.query('SELECT * FROM services WHERE id = ?', [id]);
    
    res.json({
      message: '✅ Service updated successfully!',
      data: updatedService[0]
    });
  } catch (error) {
    console.error('❌ Error updating service:', error);
    res.status(500).json({ message: 'Error updating service' });
  }
});

// ==================== DELETE Service ====================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Deleting service:', id);
    
    const [existing] = await db.query('SELECT * FROM services WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    await db.query('DELETE FROM services WHERE id = ?', [id]);
    
    res.json({
      message: '✅ Service deleted successfully!',
      id: id
    });
  } catch (error) {
    console.error('❌ Error deleting service:', error);
    res.status(500).json({ message: 'Error deleting service' });
  }
});

module.exports = router;