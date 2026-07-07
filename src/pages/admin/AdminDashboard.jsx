import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import './Admin.css';

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const menuItems = [
    { path: '/admin/hero', icon: '🎯', label: 'Hero Section', desc: 'Manage hero content' },
    { path: '/admin/about', icon: '📖', label: 'About Us', desc: 'Manage about content' },
    { path: '/admin/services', icon: '⚙️', label: 'Services', desc: 'Manage services' },
    { path: '/admin/testimonials', icon: '⭐', label: 'Testimonials', desc: 'Manage testimonials' },
    { path: '/admin/contact', icon: '📞', label: 'Contact Info', desc: 'Manage contact details' },
    { path: '/admin/messages', icon: '📨', label: 'Messages', desc: 'View messages' },
  ];

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="page-header">
          <h1>📊 Dashboard Overview</h1>
          <p>Welcome to the Zennix Admin Panel</p>
        </div>

        <div className="dashboard-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          {menuItems.map((item) => (
            <Link to={item.path} key={item.path} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '20px 24px',
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(100, 116, 139, 0.2)',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}>
              <span style={{ fontSize: '2rem' }}>{item.icon}</span>
              <div>
                <h3 style={{ color: '#f1f5f9', margin: 0 }}>{item.label}</h3>
                <p style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '0.85rem' }}>{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;