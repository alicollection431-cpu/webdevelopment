import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import './Admin.css';

function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    review: '',
    rating: 5,
    image: '',
    is_active: 1
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const API_URL = 'http://localhost:5000/api/testimonials';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
    }
    fetchTestimonials();
  }, [navigate]);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log('📊 Testimonials Data:', response.data);
      setTestimonials(response.data);
    } catch (error) {
      console.error('❌ Error fetching testimonials:', error);
      setError('❌ Error fetching testimonials');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('role', formData.role);
      submitData.append('company', formData.company || '');
      submitData.append('review', formData.review);
      submitData.append('rating', formData.rating);
      submitData.append('is_active', formData.is_active);
      
      if (imageFile) {
        submitData.append('image', imageFile);
      } else if (formData.image) {
        submitData.append('existing_image', formData.image);
      }
      
      let response;
      if (editing) {
        // Update
        response = await axios.put(`${API_URL}/${editing}`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage(response.data.message || '✅ Testimonial updated successfully!');
      } else {
        // Create
        response = await axios.post(API_URL, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage(response.data.message || '✅ Testimonial added successfully!');
      }
      
      // Reset form
      setFormData({ 
        name: '', 
        role: '', 
        company: '', 
        review: '', 
        rating: 5, 
        image: '',
        is_active: 1 
      });
      setImageFile(null);
      setImagePreview('');
      setEditing(null);
      fetchTestimonials();
    } catch (error) {
      console.error('❌ Error saving testimonial:', error);
      const errorMsg = error.response?.data?.message || '❌ Error saving testimonial';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testimonial) => {
    setEditing(testimonial.id);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company || '',
      review: testimonial.review,
      rating: testimonial.rating,
      image: testimonial.image || '',
      is_active: testimonial.is_active !== undefined ? testimonial.is_active : 1
    });
    if (testimonial.image) {
      setImagePreview(`http://localhost:5000/uploads/${testimonial.image}`);
    } else {
      setImagePreview('');
    }
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Testimonial deleted successfully!');
      fetchTestimonials();
    } catch (error) {
      console.error('❌ Error deleting testimonial:', error);
      setError('❌ Error deleting testimonial');
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormData({ 
      name: '', 
      role: '', 
      company: '', 
      review: '', 
      rating: 5, 
      image: '',
      is_active: 1 
    });
    setImageFile(null);
    setImagePreview('');
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <AdminLayout>
    <div className="admin-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>← Back</button>
        <h2>⭐ Manage Testimonials</h2>
      </div>

      {message && <div className="success-msg">{message}</div>}
      {error && <div className="error-msg">{error}</div>}

      {/* ===== FORM ===== */}
      <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
        <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>
          {editing ? '✏️ Edit Testimonial' : '➕ Add New Testimonial'}
        </h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Client Name <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Aman Sharma"
              required
            />
          </div>

          <div className="form-group">
            <label>Role <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g., CEO"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Company</label>
            <input
              type="text"
              name="company"
              value={formData.company || ''}
              onChange={handleChange}
              placeholder="e.g., TechStart Inc."
            />
          </div>

          <div className="form-group">
            <label>Rating (1-5)</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="1"
              max="5"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Review <span style={{ color: '#ef4444' }}>*</span></label>
          <textarea
            name="review"
            value={formData.review}
            onChange={handleChange}
            rows="4"
            placeholder="Write the client's review..."
            required
          />
        </div>

        {/* ===== IMAGE UPLOAD ===== */}
        <div className="form-group">
          <label>Profile Image</label>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ 
                padding: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                color: '#f1f5f9',
                flex: 1
              }}
            />
            {imagePreview && (
              <div style={{ 
                position: 'relative',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid rgba(124,58,237,0.3)'
              }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    setImageFile(null);
                    setFormData({ ...formData, image: '' });
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
          <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px' }}>
            Upload a profile image (JPG, PNG, GIF) - Max size: 5MB
          </p>
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ marginBottom: '0' }}>Active Status</label>
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active === 1}
            onChange={handleChange}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            {formData.is_active === 1 ? '✅ Active' : '❌ Inactive'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : editing ? '✏️ Update Testimonial' : '➕ Add Testimonial'}
          </button>
          {editing && (
            <button type="button" className="back-btn" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ===== TABLE ===== */}
      <div className="items-list">
        <h3 style={{ color: '#f1f5f9', marginBottom: '15px' }}>
          Current Testimonials ({testimonials.length})
        </h3>
        
        {testimonials.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
            No testimonials added yet. Add your first testimonial above!
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'rgba(31, 41, 55, 0.4)',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.04)'
            }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>#</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Image</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Name</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Role</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Rating</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((item, index) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.02)', transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 20px', color: '#64748b' }}>{index + 1}</td>
                    <td style={{ padding: '14px 20px' }}>
                      {item.image ? (
                        <img 
                          src={`http://localhost:5000/uploads/${item.image}`} 
                          alt={item.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid rgba(124,58,237,0.15)'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '1.5rem' }}>👤</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#f1f5f9' }}>{item.name}</td>
                    <td style={{ padding: '14px 20px', color: '#94a3b8' }}>{item.role}</td>
                    <td style={{ padding: '14px 20px', color: '#fbbf24' }}>{renderStars(item.rating)}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: item.is_active === 1 ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: item.is_active === 1 ? '#6ee7b7' : '#fca5a5'
                      }}>
                        {item.is_active === 1 ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => handleEdit(item)} className="edit-btn">✏️ Edit</button>
                        <button onClick={() => handleDelete(item.id)} className="delete-btn">🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
}

export default ManageTestimonials;