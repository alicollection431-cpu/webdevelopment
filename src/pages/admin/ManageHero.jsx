import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import './Admin.css';

function ManageHero() {
  const [formData, setFormData] = useState({
    id: '',
    tag: '',
    title: '',
    description: '',
    button_text: '',
    button_link: ''
  });
  const [heroData, setHeroData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api/hero';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
    }
    fetchHeroData();
  }, [navigate]);

  const fetchHeroData = async () => {
    try {
      const response = await axios.get(API_URL);
      setHeroData(response.data);
    } catch (error) {
      console.error('Error fetching hero data:', error);
      setError('❌ Error fetching data from database');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (isEditing) {
        // Update
        const response = await axios.put(`${API_URL}/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage(response.data.message || '✅ Hero section updated successfully!');
      } else {
        // Create
        const response = await axios.post(API_URL, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage(response.data.message || '✅ Hero section added successfully!');
      }
      
      // Reset form
      setFormData({
        id: '',
        tag: '',
        title: '',
        description: '',
        button_text: '',
        button_link: ''
      });
      setIsEditing(false);
      fetchHeroData();
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || '❌ Error saving hero section';
      setError(errorMsg);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      tag: item.tag || '',
      title: item.title || '',
      description: item.description || '',
      button_text: item.button_text || '',
      button_link: item.button_link || ''
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hero section?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Hero section deleted successfully!');
      fetchHeroData();
    } catch (error) {
      setError('❌ Error deleting hero section');
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      id: '',
      tag: '',
      title: '',
      description: '',
      button_text: '',
      button_link: ''
    });
    setIsEditing(false);
  };

  return (
    <AdminLayout>
    <div className="admin-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>← Back</button>
        <h2>🚀 Manage Hero Section</h2>
      </div>

      {message && <div className="success-msg">{message}</div>}
      {error && <div className="error-msg">{error}</div>}

      {/* ===== FORM ===== */}
      <form onSubmit={handleSubmit} className="admin-form">
        <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>
          {isEditing ? '✏️ Edit Hero Section' : '➕ Add New Hero Section'}
        </h3>
        
        <div className="form-group">
          <label>Tag/Badge <span style={{ color: '#ef4444' }}>*</span></label>
          <input
            type="text"
            name="tag"
            value={formData.tag || ''}
            onChange={handleChange}
            placeholder="e.g., 🚀 Best Digital Agency"
            required
          />
        </div>

        <div className="form-group">
          <label>Title <span style={{ color: '#ef4444' }}>*</span></label>
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            placeholder="e.g., Build Amazing Digital Experiences"
            required
          />
        </div>

        <div className="form-group">
          <label>Description <span style={{ color: '#ef4444' }}>*</span></label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows="4"
            placeholder="Enter hero description"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Button Text</label>
            <input
              type="text"
              name="button_text"
              value={formData.button_text || ''}
              onChange={handleChange}
              placeholder="e.g., Get Started"
            />
          </div>

          <div className="form-group">
            <label>Button Link</label>
            <input
              type="text"
              name="button_link"
              value={formData.button_link || ''}
              onChange={handleChange}
              placeholder="e.g., /contact"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? '✏️ Update Hero' : '➕ Add Hero'}
          </button>
          {isEditing && (
            <button type="button" className="back-btn" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ===== TABLE ===== */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '15px' }}>
          Hero Sections ({heroData.length})
        </h3>
        
        {heroData.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
            No hero sections found in database. Add your first hero section above!
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
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Tag</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Title</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Button</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {heroData.map((item, index) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.02)', transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '0.9rem' }}>{index + 1}</td>
                    <td style={{ padding: '14px 20px', color: '#a78bfa', fontSize: '0.9rem' }}>{item.tag || '-'}</td>
                    <td style={{ padding: '14px 20px', color: '#f1f5f9', fontSize: '0.9rem' }}>{item.title || '-'}</td>
                    <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '0.9rem' }}>{item.button_text || '-'}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleEdit(item)} 
                          style={{
                            padding: '6px 14px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                            borderRadius: '6px',
                            color: '#60a5fa',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          style={{
                            padding: '6px 14px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '6px',
                            color: '#fca5a5',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          🗑️ Delete
                        </button>
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

export default ManageHero;