const express = require('express');
const router = express.Router();
const db = require('../config/database');

console.log('👥 Team routes loaded');

// GET - Fetch all team members
router.get('/', async (req, res) => {
  try {
    console.log('👥 Fetching team members...');
    
    const [rows] = await db.query(
      'SELECT * FROM team_members WHERE is_active = 1 ORDER BY order_number ASC, id ASC'
    );
    
    console.log(`👥 Found ${rows.length} team members`);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching team members:', error);
    res.status(500).json({ 
      message: 'Error fetching team members', 
      error: error.message 
    });
  }
});

// GET - Fetch single team member by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`👥 Fetching team member ID: ${id}`);
    
    const [rows] = await db.query(
      'SELECT * FROM team_members WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        message: 'Team member not found' 
      });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error fetching team member:', error);
    res.status(500).json({ 
      message: 'Error fetching team member', 
      error: error.message 
    });
  }
});

// POST - Create new team member
router.post('/', async (req, res) => {
  const { 
    name, position, bio, image, email, phone, 
    facebook, twitter, linkedin, instagram, 
    order_number, is_active 
  } = req.body;
  
  console.log('📝 Creating new team member:', { name, position });
  
  // Validation
  if (!name || !position) {
    return res.status(400).json({ 
      message: 'Name and Position are required' 
    });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO team_members 
      (name, position, bio, image, email, phone, facebook, twitter, linkedin, instagram, order_number, is_active) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, 
        position, 
        bio || null, 
        image || null, 
        email || null, 
        phone || null, 
        facebook || null, 
        twitter || null, 
        linkedin || null, 
        instagram || null, 
        order_number || 0, 
        is_active !== undefined ? is_active : 1
      ]
    );

    const [newMember] = await db.query(
      'SELECT * FROM team_members WHERE id = ?', 
      [result.insertId]
    );
    
    console.log('✅ Team member created successfully:', newMember[0]);
    res.status(201).json(newMember[0]);
  } catch (error) {
    console.error('❌ Error creating team member:', error);
    res.status(500).json({ 
      message: 'Error creating team member', 
      error: error.message 
    });
  }
});

// PUT - Update team member
router.put('/:id', async (req, res) => {
  const { 
    name, position, bio, image, email, phone, 
    facebook, twitter, linkedin, instagram, 
    order_number, is_active 
  } = req.body;
  const { id } = req.params;

  console.log(`📝 Updating team member ID: ${id}`, { name, position });

  if (!name || !position) {
    return res.status(400).json({ 
      message: 'Name and Position are required' 
    });
  }

  try {
    const [existing] = await db.query(
      'SELECT id FROM team_members WHERE id = ?', 
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({ 
        message: 'Team member not found' 
      });
    }

    await db.query(
      `UPDATE team_members SET 
        name = ?, 
        position = ?, 
        bio = ?, 
        image = ?, 
        email = ?, 
        phone = ?, 
        facebook = ?, 
        twitter = ?, 
        linkedin = ?, 
        instagram = ?, 
        order_number = ?,
        is_active = ?
      WHERE id = ?`,
      [
        name, 
        position, 
        bio || null, 
        image || null, 
        email || null, 
        phone || null, 
        facebook || null, 
        twitter || null, 
        linkedin || null, 
        instagram || null, 
        order_number || 0, 
        is_active !== undefined ? is_active : 1,
        id
      ]
    );

    const [updatedMember] = await db.query(
      'SELECT * FROM team_members WHERE id = ?', 
      [id]
    );
    
    console.log('✅ Team member updated successfully:', updatedMember[0]);
    res.json(updatedMember[0]);
  } catch (error) {
    console.error('❌ Error updating team member:', error);
    res.status(500).json({ 
      message: 'Error updating team member', 
      error: error.message 
    });
  }
});

// DELETE - Delete team member
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  console.log(`🗑️ Deleting team member ID: ${id}`);

  try {
    const [result] = await db.query(
      'DELETE FROM team_members WHERE id = ?', 
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        message: 'Team member not found' 
      });
    }
    
    console.log('✅ Team member deleted successfully');
    res.json({ 
      message: 'Team member deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Error deleting team member:', error);
    res.status(500).json({ 
      message: 'Error deleting team member', 
      error: error.message 
    });
  }
});

module.exports = router;