import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import './Admin.css';
import './ManageTeam.css'; 

function ManageTeam() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    position: '',
    bio: '',
    image: '',
    email: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    github: '',
    expertise: '',
    experience: '',
    education: '',
    skills: '',
    is_active: 1,
    display_order: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000/api/team';
  const UPLOAD_URL = 'http://localhost:5000/api/upload';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchTeamMembers();
  }, [navigate]);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('👥 Team members fetched:', response.data);
      setTeamMembers(response.data);
      setError('');
    } catch (error) {
      console.error('❌ Error fetching team:', error);
      setError('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  // ===== IMAGE UPLOAD HANDLERS =====
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('❌ Please upload a valid image file (JPEG, PNG, WEBP, GIF)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('❌ Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      console.log('✅ Image uploaded:', response.data);
      return response.data.imageUrl;
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      setError('❌ Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

    if (!formData.name || !formData.position) {
      setError('❌ Name and Position are required!');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Upload image if selected
      let imageUrl = formData.image || '';
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setLoading(false);
          return;
        }
      }

      const submitData = {
        name: formData.name,
        position: formData.position,
        bio: formData.bio || '',
        image: imageUrl,
        email: formData.email || '',
        twitter: formData.twitter || '',
        linkedin: formData.linkedin || '',
        instagram: formData.instagram || '',
        github: formData.github || '',
        expertise: formData.expertise || '',
        experience: formData.experience || '',
        education: formData.education || '',
        skills: formData.skills || '',
        is_active: formData.is_active !== undefined ? formData.is_active : 1,
        display_order: formData.display_order || 0
      };

      if (isEditing && formData.id) {
        await axios.put(`${API_URL}/${formData.id}`, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('✅ Team member updated successfully!');
      } else {
        await axios.post(API_URL, submitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('✅ Team member added successfully!');
      }

      resetForm();
      fetchTeamMembers();
    } catch (error) {
      console.error('❌ Error saving team member:', error);
      setError(error.response?.data?.message || '❌ Error saving team member');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleEdit = (member) => {
    console.log('✏️ Editing member:', member);
    setFormData({
      id: member.id || '',
      name: member.name || '',
      position: member.position || '',
      bio: member.bio || '',
      image: member.image || '',
      email: member.email || '',
      twitter: member.twitter || '',
      linkedin: member.linkedin || '',
      instagram: member.instagram || '',
      github: member.github || '',
      expertise: member.expertise || '',
      experience: member.experience || '',
      education: member.education || '',
      skills: member.skills || '',
      is_active: member.is_active !== undefined ? member.is_active : 1,
      display_order: member.display_order || 0
    });
    setImagePreview(member.image || '');
    setImageFile(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('🗑️ Team member deleted successfully!');
      fetchTeamMembers();
    } catch (error) {
      console.error('❌ Error deleting team member:', error);
      setError('❌ Error deleting team member');
    }
  };

  const handleView = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      position: '',
      bio: '',
      image: '',
      email: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      github: '',
      expertise: '',
      experience: '',
      education: '',
      skills: '',
      is_active: 1,
      display_order: 0
    });
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    resetForm();
  };

  const getStatusBadge = (status) => {
    return status === 1 ? (
      <span style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '500',
        background: 'rgba(52, 211, 153, 0.15)',
        color: '#6ee7b7'
      }}>✅ Active</span>
    ) : (
      <span style={{
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '500',
        background: 'rgba(239, 68, 68, 0.15)',
        color: '#fca5a5'
      }}>❌ Inactive</span>
    );
  };

return (
  <AdminLayout>
    <div className="admin-page">
      <div className="page-header">
        <h2>👥 Manage Team</h2>
        <button className="refresh-btn" onClick={fetchTeamMembers}>
          🔄 Refresh
        </button>
      </div>

      {message && <div className="success-msg">{message}</div>}
      {error && <div className="error-msg">{error}</div>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="admin-form team-form-section">
        <h3 className="team-form-title">
          {isEditing ? (
            <>✏️ <span className="edit-icon">Edit Team Member</span></>
          ) : (
            <>➕ <span className="add-icon">Add New Team Member</span></>
          )}
        </h3>

        {/* ===== IMAGE UPLOAD ===== */}
        <div className="team-image-upload">
          <div className="team-image-preview">
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" />
                <div className="image-overlay">
                  <span>Preview</span>
                </div>
              </>
            ) : (
              <span className="no-image">No Image</span>
            )}
          </div>

          <div className="team-image-upload-controls">
            <div className="team-file-input-wrapper">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="team-file-input"
                disabled={loading || uploading}
              />
            </div>

            <div className="team-upload-actions">
              {imagePreview && (
                <button
                  type="button"
                  className="team-remove-btn"
                  onClick={removeImage}
                  disabled={loading || uploading}
                >
                  🗑️ Remove Image
                </button>
              )}
              {uploading && (
                <div className="team-upload-status">
                  <div className="spinner-small"></div>
                  Uploading...
                </div>
              )}
            </div>

            {formData.image && !imagePreview && !imageFile && (
              <span className="team-current-image">
                Current: {formData.image.split('/').pop()}
              </span>
            )}
            <p className="team-upload-hint">
              Supported: JPG, PNG, WEBP, GIF (Max 5MB)
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="form-row">
          <div className="form-group">
            <label>Name <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              disabled={loading || uploading}
            />
          </div>

          <div className="form-group">
            <label>Position <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="text"
              name="position"
              value={formData.position || ''}
              onChange={handleChange}
              placeholder="e.g., CEO & Founder"
              required
              disabled={loading || uploading}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio || ''}
            onChange={handleChange}
            rows="3"
            placeholder="Tell us about this team member..."
            disabled={loading || uploading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="name@zennix.com"
              disabled={loading || uploading}
            />
          </div>

          <div className="form-group">
            <label>Display Order</label>
            <input
              type="number"
              name="display_order"
              value={formData.display_order || 0}
              onChange={handleChange}
              placeholder="0"
              disabled={loading || uploading}
            />
          </div>
        </div>

        <h4 style={{ color: '#94a3b8', marginTop: '20px', marginBottom: '10px' }}>
          🌐 Social Media Links
        </h4>

        <div className="form-row">
          <div className="form-group">
            <label>Twitter</label>
            <input
              type="url"
              name="twitter"
              value={formData.twitter || ''}
              onChange={handleChange}
              placeholder="https://twitter.com/username"
              disabled={loading || uploading}
            />
          </div>

          <div className="form-group">
            <label>LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin || ''}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              disabled={loading || uploading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Instagram</label>
            <input
              type="url"
              name="instagram"
              value={formData.instagram || ''}
              onChange={handleChange}
              placeholder="https://instagram.com/username"
              disabled={loading || uploading}
            />
          </div>

          <div className="form-group">
            <label>GitHub</label>
            <input
              type="url"
              name="github"
              value={formData.github || ''}
              onChange={handleChange}
              placeholder="https://github.com/username"
              disabled={loading || uploading}
            />
          </div>
        </div>

        <h4 style={{ color: '#94a3b8', marginTop: '20px', marginBottom: '10px' }}>
          💼 Professional Details
        </h4>

        <div className="form-row">
          <div className="form-group">
            <label>Expertise</label>
            <input
              type="text"
              name="expertise"
              value={formData.expertise || ''}
              onChange={handleChange}
              placeholder="e.g., UI/UX, Full-Stack, AI/ML"
              disabled={loading || uploading}
            />
          </div>

          <div className="form-group">
            <label>Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience || ''}
              onChange={handleChange}
              placeholder="e.g., 10+ years"
              disabled={loading || uploading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Education</label>
            <input
              type="text"
              name="education"
              value={formData.education || ''}
              onChange={handleChange}
              placeholder="e.g., PhD in CS, MIT"
              disabled={loading || uploading}
            />
          </div>

          <div className="form-group">
            <label>Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.skills || ''}
              onChange={handleChange}
              placeholder="e.g., React, Node, Python, AWS"
              disabled={loading || uploading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ marginBottom: '0' }}>Active Status</label>
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active === 1}
              onChange={handleChange}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              disabled={loading || uploading}
            />
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              {formData.is_active === 1 ? '✅ Active' : '❌ Inactive'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button type="submit" className="submit-btn" disabled={loading || uploading}>
            {uploading ? '⏳ Uploading Image...' : loading ? '⏳ Saving...' : isEditing ? '💾 Update Member' : '➕ Add Member'}
          </button>
          {isEditing && (
            <button type="button" className="back-btn" onClick={handleCancel} disabled={loading || uploading}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ===== TABLE ===== */}
      <div className="team-table-section">
        <div className="team-table-header">
          <h3>
            👥 Team Members
            <span>({teamMembers.length})</span>
          </h3>
        </div>

        {loading ? (
          <div className="team-loading">
            <div className="spinner"></div>
            <p>Loading team members...</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="team-empty-state">
            <span className="icon">👥</span>
            <h3>No Team Members</h3>
            <p>Add your first team member using the form above!</p>
          </div>
        ) : (
          <div className="team-table-wrapper">
            <table className="team-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Expertise</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member, index) => (
                  <tr key={member.id}>
                    <td>{index + 1}</td>
                    <td>
                      <img 
                        src={member.image || 'https://randomuser.me/api/portraits/men/1.jpg'} 
                        alt={member.name}
                        className="team-table-image"
                        onError={(e) => {
                          e.target.src = 'https://randomuser.me/api/portraits/men/1.jpg';
                        }}
                      />
                    </td>
                    <td style={{ fontWeight: '500' }}>{member.name}</td>
                    <td style={{ color: '#a78bfa' }}>{member.position}</td>
                    <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      {member.expertise || '-'}
                    </td>
                    <td>
                      <span className={`team-status-badge ${member.is_active === 1 ? 'active' : 'inactive'}`}>
                        {member.is_active === 1 ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="team-action-group">
                        <button 
                          onClick={() => handleView(member)}
                          className="team-action-btn view"
                        >
                          👁️ View
                        </button>
                        <button 
                          onClick={() => handleEdit(member)}
                          className="team-action-btn edit"
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(member.id)}
                          className="team-action-btn delete"
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

    {/* ===== MODAL ===== */}
    {showModal && selectedMember && (
      <div className="team-modal-overlay" onClick={() => setShowModal(false)}>
        <div className="team-modal" onClick={(e) => e.stopPropagation()}>
          <button className="team-modal-close" onClick={() => setShowModal(false)}>×</button>
          
          <div className="team-modal-grid">
            <div className="team-modal-image">
              <img 
                src={selectedMember.image || 'https://randomuser.me/api/portraits/men/1.jpg'} 
                alt={selectedMember.name}
                onError={(e) => {
                  e.target.src = 'https://randomuser.me/api/portraits/men/1.jpg';
                }}
              />
              <span className="team-modal-image-badge">
                ⭐ {selectedMember.position}
              </span>
            </div>

            <div className="team-modal-content">
              <h2>{selectedMember.name}</h2>
              <p className="position">{selectedMember.position}</p>
              <p className="bio">{selectedMember.bio || 'No bio available'}</p>

              <div className="team-modal-details">
                {selectedMember.email && (
                  <div className="team-modal-detail">
                    <span className="icon">📧</span>
                    <div>
                      <div className="label">Email</div>
                      <div className="value">{selectedMember.email}</div>
                    </div>
                  </div>
                )}
                {selectedMember.expertise && (
                  <div className="team-modal-detail">
                    <span className="icon">💡</span>
                    <div>
                      <div className="label">Expertise</div>
                      <div className="value">{selectedMember.expertise}</div>
                    </div>
                  </div>
                )}
                {selectedMember.experience && (
                  <div className="team-modal-detail">
                    <span className="icon">⏱️</span>
                    <div>
                      <div className="label">Experience</div>
                      <div className="value">{selectedMember.experience}</div>
                    </div>
                  </div>
                )}
                {selectedMember.education && (
                  <div className="team-modal-detail">
                    <span className="icon">🎓</span>
                    <div>
                      <div className="label">Education</div>
                      <div className="value">{selectedMember.education}</div>
                    </div>
                  </div>
                )}
                {selectedMember.skills && (
                  <div className="team-modal-detail" style={{ gridColumn: '1 / -1' }}>
                    <span className="icon">🛠️</span>
                    <div>
                      <div className="label">Skills</div>
                      <div className="value">{selectedMember.skills}</div>
                    </div>
                  </div>
                )}
              </div>

              {(selectedMember.twitter || selectedMember.linkedin || selectedMember.instagram || selectedMember.github) && (
                <div className="team-modal-social">
                  <span className="label">Connect with {selectedMember.name.split(' ')[0]}</span>
                  <div className="team-modal-social-links">
                    {selectedMember.twitter && (
                      <a href={selectedMember.twitter} target="_blank" rel="noopener noreferrer" className="twitter">
                        🐦
                      </a>
                    )}
                    {selectedMember.linkedin && (
                      <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer" className="linkedin">
                        🔗
                      </a>
                    )}
                    {selectedMember.instagram && (
                      <a href={selectedMember.instagram} target="_blank" rel="noopener noreferrer" className="instagram">
                        📸
                      </a>
                    )}
                    {selectedMember.github && (
                      <a href={selectedMember.github} target="_blank" rel="noopener noreferrer" className="github">
                        🐙
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
  </AdminLayout>
);
}

export default ManageTeam;