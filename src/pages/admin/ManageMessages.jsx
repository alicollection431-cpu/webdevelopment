import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import './Admin.css';

function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api/contact/messages';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchMessages();
  }, [navigate]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('📋 Messages fetched:', response.data);
      setMessages(response.data);
      setError('');
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = async (msg) => {
    try {
      setSelectedMessage(msg);
      setShowModal(true);
      
      // Mark as read if unread
      if (msg.status === 'unread') {
        const token = localStorage.getItem('token');
        await axios.put(`${API_URL}/${msg.id}`, 
          { status: 'read' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Update local state
        setMessages(messages.map(m => 
          m.id === msg.id ? { ...m, status: 'read' } : m
        ));
      }
    } catch (error) {
      console.error('❌ Error updating message status:', error);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Message deleted successfully!');
      fetchMessages();
      setShowModal(false);
    } catch (error) {
      console.error('❌ Error deleting message:', error);
      setError('Failed to delete message');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/${id}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(messages.map(m => 
        m.id === id ? { ...m, status } : m
      ));
      if (selectedMessage) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    } catch (error) {
      console.error('❌ Error updating status:', error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      unread: { background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' },
      read: { background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' },
      replied: { background: 'rgba(52, 211, 153, 0.15)', color: '#6ee7b7' }
    };
    const labels = {
      unread: '📩 Unread',
      read: '📖 Read',
      replied: '✅ Replied'
    };
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '500',
        ...styles[status]
      }}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <span>Loading messages...</span>
        </div>
      </div>
    );
  }
  return (
<AdminLayout>
    <div className="admin-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>← Back</button>
        <h2>📨 Manage Messages</h2>
        <button className="refresh-btn" onClick={fetchMessages}>
          🔄 Refresh
        </button>
      </div>

      {message && <div className="success-msg">{message}</div>}
      {error && <div className="error-msg">{error}</div>}

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Total Messages</span>
          <span className="stat-value">{messages.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Unread</span>
          <span className="stat-value" style={{ color: '#fca5a5' }}>
            {messages.filter(m => m.status === 'unread').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Read</span>
          <span className="stat-value" style={{ color: '#60a5fa' }}>
            {messages.filter(m => m.status === 'read').length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Replied</span>
          <span className="stat-value" style={{ color: '#6ee7b7' }}>
            {messages.filter(m => m.status === 'replied').length}
          </span>
        </div>
      </div>

      {messages.length === 0 ? (
        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
          📭 No messages found
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg, index) => (
                <tr 
                  key={msg.id} 
                  style={{ 
                    background: msg.status === 'unread' ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
                    fontWeight: msg.status === 'unread' ? '600' : 'normal'
                  }}
                >
                  <td>{index + 1}</td>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.subject || 'No subject'}</td>
                  <td>{getStatusBadge(msg.status)}</td>
                  <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    {formatDate(msg.created_at)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleViewMessage(msg)}
                        className="action-btn view-btn"
                      >
                        👁️ View
                      </button>
                      <button 
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="action-btn delete-btn-small"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for viewing message */}
      {showModal && selectedMessage && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📨 Message Details</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="message-detail">
                <div className="detail-row">
                  <span className="detail-label">From:</span>
                  <span className="detail-value">{selectedMessage.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedMessage.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Subject:</span>
                  <span className="detail-value">{selectedMessage.subject || 'No subject'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span className="detail-value">{getStatusBadge(selectedMessage.status)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Received:</span>
                  <span className="detail-value" style={{ color: '#94a3b8' }}>
                    {formatDate(selectedMessage.created_at)}
                  </span>
                </div>
                <div className="detail-message">
                  <span className="detail-label">Message:</span>
                  <p>{selectedMessage.message}</p>
                </div>
              </div>

              <div className="modal-actions">
                <div className="status-actions">
                  <button 
                    onClick={() => handleStatusUpdate(selectedMessage.id, 'unread')}
                    className="status-btn unread-btn"
                  >
                    📩 Mark Unread
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedMessage.id, 'read')}
                    className="status-btn read-btn"
                  >
                    📖 Mark Read
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedMessage.id, 'replied')}
                    className="status-btn replied-btn"
                  >
                    ✅ Mark Replied
                  </button>
                </div>
                <button 
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="delete-btn"
                >
                  🗑️ Delete Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </AdminLayout>
  );
}

export default ManageMessages;