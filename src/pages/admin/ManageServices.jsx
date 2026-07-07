import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import './Admin.css';

function ManageServices() {
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    icon: '',
    title: '',
    description: '',
    features: '',
    features2: '',
    features3: '',
    is_active: 1
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api/services';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
    }
    fetchServices();
  }, [navigate]);

  const fetchServices = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log('📊 Services Data:', response.data);
      setServices(response.data);
    } catch (error) {
      console.error('❌ Error fetching services:', error);
      setError('❌ Error fetching services');
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
        icon: formData.icon,
        title: formData.title,
        description: formData.description,
        features: formData.features || '',
        features2: formData.features2 || '',
        features3: formData.features3 || '',
        is_active: formData.is_active || 1
      };
      
      let response;
      if (editing) {
        response = await axios.put(`${API_URL}/${editing}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage(response.data.message || '✅ Service updated successfully!');
      } else {
        response = await axios.post(API_URL, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage(response.data.message || '✅ Service added successfully!');
      }
      
      setFormData({ 
        icon: '', 
        title: '', 
        description: '', 
        features: '', 
        features2: '', 
        features3: '', 
        is_active: 1 
      });
      setEditing(null);
      fetchServices();
    } catch (error) {
      console.error('❌ Error saving service:', error);
      const errorMsg = error.response?.data?.message || '❌ Error saving service';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditing(service.id);
    setFormData({
      icon: service.icon || '',
      title: service.title || '',
      description: service.description || '',
      features: service.features || '',
      features2: service.features2 || '',
      features3: service.features3 || '',
      is_active: service.is_active !== undefined ? service.is_active : 1
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Service deleted successfully!');
      fetchServices();
    } catch (error) {
      console.error('❌ Error deleting service:', error);
      setError('❌ Error deleting service');
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormData({ 
      icon: '', 
      title: '', 
      description: '', 
      features: '', 
      features2: '', 
      features3: '', 
      is_active: 1 
    });
  };

  return (
    <AdminLayout>
    <div className="admin-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>← Back</button>
        <h2>💻 Manage Services</h2>
      </div>

      {message && <div className="success-msg">{message}</div>}
      {error && <div className="error-msg">{error}</div>}

      {/* ===== FORM ===== */}
      <form onSubmit={handleSubmit} className="admin-form">
        <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>
          {editing ? '✏️ Edit Service' : '➕ Add New Service'}
        </h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Icon (Emoji) <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="e.g., 💻"
              required
            />
          </div>

          <div className="form-group">
            <label>Title <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Service Title"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description <span style={{ color: '#ef4444' }}>*</span></label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Service Description"
            required
          />
        </div>

        {/* ===== FEATURES SECTION ===== */}
        <div className="form-group">
          <label>Feature 1</label>
          <input
            type="text"
            name="features"
            value={formData.features || ''}
            onChange={handleChange}
            placeholder="e.g., ✅ Fast Performance"
          />
        </div>

        <div className="form-group">
          <label>Feature 2</label>
          <input
            type="text"
            name="features2"
            value={formData.features2 || ''}
            onChange={handleChange}
            placeholder="e.g., ✅ Secure & Reliable"
          />
        </div>

        <div className="form-group">
          <label>Feature 3</label>
          <input
            type="text"
            name="features3"
            value={formData.features3 || ''}
            onChange={handleChange}
            placeholder="e.g., ✅ 24/7 Support"
          />
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
            {loading ? 'Saving...' : editing ? '✏️ Update Service' : '➕ Add Service'}
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
          Current Services ({services.length})
        </h3>
        
        {services.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
            No services added yet. Add your first service above!
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
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Features</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={service.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.02)', transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '0.9rem' }}>{index + 1}</td>
                    <td style={{ padding: '14px 20px', color: '#f1f5f9', fontSize: '1.2rem' }}>{service.icon || '📄'}</td>
                    <td style={{ padding: '14px 20px', color: '#f1f5f9', fontSize: '0.9rem' }}>{service.title || '-'}</td>
                    <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '0.85rem' }}>
                      {service.features && <div>✅ {service.features}</div>}
                      {service.features2 && <div>✅ {service.features2}</div>}
                      {service.features3 && <div>✅ {service.features3}</div>}
                      {!service.features && !service.features2 && !service.features3 && <span style={{ color: '#64748b' }}>-</span>}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: service.is_active === 1 ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: service.is_active === 1 ? '#6ee7b7' : '#fca5a5'
                      }}>
                        {service.is_active === 1 ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleEdit(service)} 
                          className="edit-btn"
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(service.id)} 
                          className="delete-btn"
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

export default ManageServices;