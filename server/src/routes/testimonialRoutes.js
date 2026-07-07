const express = require('express');
const db = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// ===== MULTER SETUP FOR IMAGE UPLOAD =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only images are allowed'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

// ==================== GET All Testimonials ====================
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM testimonials ORDER BY id DESC');
    console.log('📊 Testimonials fetched:', rows.length);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching testimonials:', error);
    res.status(500).json({ message: 'Error fetching testimonials' });
  }
});

// ==================== GET Single Testimonial ====================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM testimonials WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Error fetching testimonial:', error);
    res.status(500).json({ message: 'Error fetching testimonial' });
  }
});

// ==================== CREATE Testimonial ====================
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, role, company, review, rating, is_active } = req.body;
    const image = req.file ? req.file.filename : null;
    
    console.log('📝 Creating testimonial:', { name, role });
    
    if (!name || !role || !review) {
      return res.status(400).json({ message: 'Name, role and review are required' });
    }
    
    const [result] = await db.query(
      `INSERT INTO testimonials (name, role, company, review, rating, image, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, role, company || '', review, rating || 5, image, is_active !== undefined ? is_active : 1]
    );
    
    const [newTestimonial] = await db.query('SELECT * FROM testimonials WHERE id = ?', [result.insertId]);
    
    res.status(201).json({
      message: '✅ Testimonial created successfully!',
      data: newTestimonial[0]
    });
  } catch (error) {
    console.error('❌ Error creating testimonial:', error);
    res.status(500).json({ message: 'Error creating testimonial' });
  }
});

// ==================== UPDATE Testimonial ====================
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, company, review, rating, is_active, existing_image } = req.body;
    const image = req.file ? req.file.filename : (existing_image || null);
    
    console.log('📝 Updating testimonial:', { id, name });
    
    const [existing] = await db.query('SELECT * FROM testimonials WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    // Delete old image if new one uploaded
    if (req.file && existing[0].image) {
      const oldImagePath = path.join(__dirname, '../uploads', existing[0].image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    await db.query(
      `UPDATE testimonials 
       SET name = ?, role = ?, company = ?, review = ?, rating = ?, image = ?, is_active = ?
       WHERE id = ?`,
      [name, role, company || '', review, rating || 5, image, is_active !== undefined ? is_active : 1, id]
    );
    
    const [updatedTestimonial] = await db.query('SELECT * FROM testimonials WHERE id = ?', [id]);
    
    res.json({
      message: '✅ Testimonial updated successfully!',
      data: updatedTestimonial[0]
    });
  } catch (error) {
    console.error('❌ Error updating testimonial:', error);
    res.status(500).json({ message: 'Error updating testimonial' });
  }
});

// ==================== DELETE Testimonial ====================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Deleting testimonial:', id);
    
    const [existing] = await db.query('SELECT * FROM testimonials WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    // Delete image if exists
    if (existing[0].image) {
      const imagePath = path.join(__dirname, '../uploads', existing[0].image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await db.query('DELETE FROM testimonials WHERE id = ?', [id]);
    
    res.json({
      message: '✅ Testimonial deleted successfully!',
      id: id
    });
  } catch (error) {
    console.error('❌ Error deleting testimonial:', error);
    res.status(500).json({ message: 'Error deleting testimonial' });
  }
});

module.exports = router;