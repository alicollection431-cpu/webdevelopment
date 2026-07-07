import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import './Admin.css';

function ManageContact() {
  const [formData, setFormData] = useState({
    id: '',
    phone: '',
    email: '',
    address: '',
    working_hours: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: ''
  });
  const [contactData, setContactData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api/contact';

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔑 Token exists:', !!token);
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchContactData();
  }, [navigate]);

  const fetchContactData = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('📡 Fetching contact data from:', API_URL);
      
      const token = localStorage.getItem('token');
      console.log('🔑 Using token:', token ? 'Token present' : 'No token');
      
      const response = await axios.get(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });
      
      console.log('✅ Response received:', response.status);
      console.log('📊 Contact Data from API:', response.data);
      
      // Check if response is array or single object
      if (Array.isArray(response.data)) {
        setContactData(response.data);
        if (response.data.length > 0) {
          setFormData({
            id: response.data[0].id || '',
            phone: response.data[0].phone || '',
            email: response.data[0].email || '',
            address: response.data[0].address || '',
            working_hours: response.data[0].working_hours || '',
            facebook: response.data[0].facebook || '',
            twitter: response.data[0].twitter || '',
            linkedin: response.data[0].linkedin || '',
            instagram: response.data[0].instagram || ''
          });
          setIsEditing(true);
        }
      } else if (response.data && response.data.id) {
        // Single object response
        setContactData([response.data]);
        setFormData({
          id: response.data.id || '',
          phone: response.data.phone || '',
          email: response.data.email || '',
          address: response.data.address || '',
          working_hours: response.data.working_hours || '',
          facebook: response.data.facebook || '',
          twitter: response.data.twitter || '',
          linkedin: response.data.linkedin || '',
          instagram: response.data.instagram || ''
        });
        setIsEditing(true);
      } else {
        setContactData([]);
        setIsEditing(false);
        setError('📝 No contact info found. Create new contact.');
      }
    } catch (error) {
      console.error('❌ Error fetching contact data:', error);
      
      // Detailed error logging
      if (error.code === 'ECONNABORTED') {
        setError('❌ Request timeout. Server is not responding.');
      } else if (error.message === 'Network Error') {
        setError('❌ Cannot connect to server. Please check:\n' +
                '1. Backend is running on port 5000\n' +
                '2. No firewall blocking the connection\n' +
                '3. Correct API URL: http://localhost:5000');
      } else if (error.response) {
        // Server responded with error
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        if (error.response.status === 404) {
          setContactData([]);
          setIsEditing(false);
          setError('📝 No contact info found. Create new contact.');
        } else if (error.response.status === 401) {
          setError('❌ Session expired. Please login again.');
          localStorage.removeItem('token');
          setTimeout(() => navigate('/admin/login'), 2000);
        } else {
          setError(`❌ Server error: ${error.response.data?.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        // Request made but no response
        setError('❌ No response from server. Please check if backend is running.');
      } else {
        setError(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Test connection function
  const testConnection = async () => {
    try {
      setLoading(true);
      console.log('🧪 Testing connection to server...');
      const response = await axios.get('http://localhost:5000/api/test', {
        timeout: 5000
      });
      console.log('✅ Server test response:', response.data);
      alert('✅ Server is connected! Response: ' + response.data.message);
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      alert('❌ Cannot connect to server. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Validation
    if (!formData.phone || !formData.email || !formData.address) {
      setError('❌ Phone, Email, and Address are required fields!');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('❌ Please login first');
        navigate('/admin/login');
        return;
      }
      
      const submitData = {
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        working_hours: formData.working_hours || '',
        facebook: formData.facebook || '',
        twitter: formData.twitter || '',
        linkedin: formData.linkedin || '',
        instagram: formData.instagram || ''
      };
      
      console.log('📝 Submitting data:', submitData);
      console.log('📝 Is editing:', isEditing);
      
      let response;
      if (isEditing && formData.id) {
        // UPDATE
        console.log(`🔄 Updating contact ID: ${formData.id}`);
        response = await axios.put(`${API_URL}/${formData.id}`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Update response:', response.data);
        setMessage('✅ Contact info updated successfully!');
      } else {
        // CREATE
        console.log('➕ Creating new contact');
        response = await axios.post(API_URL, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Create response:', response.data);
        setMessage('✅ Contact info created successfully!');
        setIsEditing(true);
      }
      
      // Refresh data
      await fetchContactData();
      
    } catch (error) {
      console.error('❌ Error saving contact:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        const errorMsg = error.response?.data?.message || 'Error saving contact info';
        setError(`❌ ${errorMsg}`);
      } else if (error.message === 'Network Error') {
        setError('❌ Cannot connect to server. Please check if backend is running.');
      } else {
        setError(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    console.log('✏️ Editing contact:', item);
    setFormData({
      id: item.id || '',
      phone: item.phone || '',
      email: item.email || '',
      address: item.address || '',
      working_hours: item.working_hours || '',
      facebook: item.facebook || '',
      twitter: item.twitter || '',
      linkedin: item.linkedin || '',
      instagram: item.instagram || ''
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact info?')) return;
    
    try {
      const token = localStorage.getItem('token');
      console.log(`🗑️ Deleting contact ID: ${id}`);
      
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('🗑️ Contact info deleted successfully!');
      
      // Reset form
      setFormData({
        id: '',
        phone: '',
        email: '',
        address: '',
        working_hours: '',
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: ''
      });
      setIsEditing(false);
      await fetchContactData();
    } catch (error) {
      console.error('❌ Error deleting contact:', error);
      if (error.message === 'Network Error') {
        setError('❌ Cannot connect to server. Please check if backend is running.');
      } else {
        setError('❌ Error deleting contact info');
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      id: '',
      phone: '',
      email: '',
      address: '',
      working_hours: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    });
    setIsEditing(false);
    fetchContactData();
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>← Back</button>
          <h2>📞 Manage Contact Info</h2>
          <button 
            className="refresh-btn" 
          onClick={testConnection}
          style={{ marginLeft: 'auto' }}
        >
          🔌 Test Connection
        </button>
      </div>

      {message && <div className="success-msg">{message}</div>}
      {error && (
        <div className="error-msg" style={{ whiteSpace: 'pre-line' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>
          {isEditing ? '✏️ Edit Contact Info' : '➕ Add New Contact Info'}
        </h3>

        <div className="form-row">
          <div className="form-group">
            <label>Phone <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="zennix@gmail.com"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Address <span style={{ color: '#ef4444' }}>*</span></label>
          <input
            type="text"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            placeholder="123 Tech Park, Silicon Valley, CA 94025"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Working Hours</label>
          <input
            type="text"
            name="working_hours"
            value={formData.working_hours || ''}
            onChange={handleChange}
            placeholder="Mon - Fri: 9:00 AM - 6:00 PM"
            disabled={loading}
          />
        </div>

        <h3 style={{ color: '#f1f5f9', marginTop: '20px', marginBottom: '15px' }}>🌐 Social Media Links</h3>

        <div className="form-row">
          <div className="form-group">
            <label>Facebook</label>
            <input
              type="url"
              name="facebook"
              value={formData.facebook || ''}
              onChange={handleChange}
              placeholder="https://facebook.com/yourpage"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Twitter</label>
            <input
              type="url"
              name="twitter"
              value={formData.twitter || ''}
              onChange={handleChange}
              placeholder="https://twitter.com/yourpage"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin || ''}
              onChange={handleChange}
              placeholder="https://linkedin.com/company/yourpage"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Instagram</label>
            <input
              type="url"
              name="instagram"
              value={formData.instagram || ''}
              onChange={handleChange}
              placeholder="https://instagram.com/yourpage"
              disabled={loading}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '⏳ Saving...' : isEditing ? '💾 Update Contact' : '➕ Add Contact'}
          </button>
          {isEditing && (
            <button type="button" className="back-btn" onClick={handleCancel} disabled={loading}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ===== TABLE ===== */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '15px' }}>
          Contact Information ({contactData.length})
        </h3>
        
        {loading ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>
            ⏳ Loading...
          </p>
        ) : contactData.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
            No contact information found. Add contact details above!
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
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Phone</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Email</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Address</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Working Hours</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Social Links</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contactData.map((item, index) => (
                  <tr key={item.id || index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.02)', transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '0.9rem' }}>{index + 1}</td>
                    <td style={{ padding: '14px 20px', color: '#f1f5f9', fontSize: '0.9rem' }}>{item.phone || '-'}</td>
                    <td style={{ padding: '14px 20px', color: '#60a5fa', fontSize: '0.9rem' }}>{item.email || '-'}</td>
                    <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '0.9rem', maxWidth: '200px' }}>{item.address || '-'}</td>
                    <td style={{ padding: '14px 20px', color: '#a78bfa', fontSize: '0.9rem' }}>{item.working_hours || '-'}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', fontSize: '1.1rem' }}>
                        {item.facebook && <span title="Facebook">📘</span>}
                        {item.twitter && <span title="Twitter">🐦</span>}
                        {item.linkedin && <span title="LinkedIn">🔗</span>}
                        {item.instagram && <span title="Instagram">📸</span>}
                        {!item.facebook && !item.twitter && !item.linkedin && !item.instagram && (
                          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>No links</span>
                        )}
                      </div>
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
                          disabled={loading}
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
                          disabled={loading}
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

export default ManageContact;