import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import './Admin.css';

function ManageAbout() {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    mission: '',      // ✅ Mission - Separate
    vision: '',       // ✅ Vision - Separate
    icon: '',
    is_active: 1
  });
  const [aboutData, setAboutData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api/about';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
    }
    fetchAboutData();
  }, [navigate]);

  const fetchAboutData = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log('📊 About Data from API:', response.data);
      
      if (Array.isArray(response.data)) {
        setAboutData(response.data);
      } else {
        setAboutData([]);
      }
    } catch (error) {
      console.error('❌ Error fetching about data:', error);
      setError('❌ Error fetching data from database');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const submitData = {
        title: formData.title,
        description: formData.description,
        mission: formData.mission || '',    // ✅ Mission separately
        vision: formData.vision || '',      // ✅ Vision separately
        icon: formData.icon || '📄',
        is_active: formData.is_active || 1
      };
      
      let response;
      if (isEditing) {
        response = await axios.put(`${API_URL}/${formData.id}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage(response.data.message || '✅ About section updated successfully!');
      } else {
        response = await axios.post(API_URL, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage(response.data.message || '✅ About section added successfully!');
      }
      
      setFormData({
        id: '',
        title: '',
        description: '',
        mission: '',
        vision: '',
        icon: '',
        is_active: 1
      });
      setIsEditing(false);
      fetchAboutData();
      
    } catch (error) {
      console.error('❌ Error saving about section:', error);
      const errorMsg = error.response?.data?.message || '❌ Error saving about section';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    console.log('✏️ Editing item:', item);
    setFormData({
      id: item.id || '',
      title: item.title || '',
      description: item.description || '',
      mission: item.mission || '',      // ✅ Mission from database
      vision: item.vision || '',        // ✅ Vision from database
      icon: item.icon || '📄',
      is_active: item.is_active !== undefined ? item.is_active : 1
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this about section?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ About section deleted successfully!');
      fetchAboutData();
    } catch (error) {
      console.error('❌ Error deleting about section:', error);
      setError('❌ Error deleting about section');
    }
  };

  const handleCancel = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      mission: '',
      vision: '',
      icon: '',
      is_active: 1
    });
    setIsEditing(false);
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>← Back</button>
          <h2>📖 Manage About Us</h2>
        </div>

      {message && <div className="success-msg">{message}</div>}
      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>
          {isEditing ? '✏️ Edit About Section' : '➕ Add New About Section'}
        </h3>

        <div className="form-group">
          <label>Title <span style={{ color: '#ef4444' }}>*</span></label>
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            placeholder="e.g., About Zennix"
            required
          />
        </div>

        <div className="form-group">
          <label>Icon (Emoji)</label>
          <input
            type="text"
            name="icon"
            value={formData.icon || ''}
            onChange={handleChange}
            placeholder="e.g., 🚀"
          />
        </div>

        <div className="form-group">
          <label>Description <span style={{ color: '#ef4444' }}>*</span></label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows="5"
            placeholder="About us description"
            required
          />
        </div>

        {/* ===== MISSION & VISION - SEPARATE FIELDS ===== */}
        <div className="form-row">
          <div className="form-group">
            <label>🎯 Mission</label>
            <input
              type="text"
              name="mission"
              value={formData.mission || ''}
              onChange={handleChange}
              placeholder="Enter your mission"
            />
          </div>

          <div className="form-group">
            <label>👁️ Vision</label>
            <input
              type="text"
              name="vision"
              value={formData.vision || ''}
              onChange={handleChange}
              placeholder="Enter your vision"
            />
          </div>
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
            {loading ? 'Saving...' : isEditing ? '✏️ Update About' : '➕ Add About'}
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
          About Sections ({aboutData.length})
        </h3>
        
        {aboutData.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
            No about sections found. Add your first about section above!
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
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Icon</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Title</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>🎯 Mission</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>👁️ Vision</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {aboutData.map((item, index) => (
                  <tr key={item.id || index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.02)', transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '0.9rem' }}>{index + 1}</td>
                    <td style={{ padding: '14px 20px', color: '#f1f5f9', fontSize: '1.2rem' }}>{item.icon || '📄'}</td>
                    <td style={{ padding: '14px 20px', color: '#f1f5f9', fontSize: '0.9rem' }}>{item.title || '-'}</td>
                    <td style={{ padding: '14px 20px', color: '#a78bfa', fontSize: '0.9rem' }}>{item.mission || '-'}</td>
                    <td style={{ padding: '14px 20px', color: '#60a5fa', fontSize: '0.9rem' }}>{item.vision || '-'}</td>
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

export default ManageAbout;