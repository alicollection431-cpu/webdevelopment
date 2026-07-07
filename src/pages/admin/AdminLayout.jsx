import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './AdminLayout.css';

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState('Admin');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get admin name from localStorage
    const name = localStorage.getItem('adminName') || 'Admin';
    setAdminName(name);
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminName');
      navigate('/admin/login');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/hero', icon: '🎯', label: 'Hero Section' },
    { path: '/admin/about', icon: '📖', label: 'About Us' },
    { path: '/admin/services', icon: '⚙️', label: 'Services' },
    { path: '/admin/testimonials', icon: '⭐', label: 'Testimonials' },
    { path: '/admin/contact', icon: '📞', label: 'Contact Info' },
    { path: '/admin/team', icon: '👥', label: 'Team' },
    { path: '/admin/messages', icon: '📨', label: 'Messages' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            {isSidebarOpen && <span className="logo-text">Zennix Admin</span>}
          </div>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              title={!isSidebarOpen ? item.label : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              {isSidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-avatar">
              {adminName.charAt(0).toUpperCase()}
            </div>
            {isSidebarOpen && (
              <div className="admin-details">
                <span className="admin-name">{adminName}</span>
                <span className="admin-role">Administrator</span>
              </div>
            )}
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            🚪 {isSidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`admin-main ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className="admin-header">
          <div className="header-left">
            <button className="mobile-toggle" onClick={toggleSidebar}>
              ☰
            </button>
            <h1>Admin Panel</h1>
          </div>
          <div className="header-right">
            <span className="admin-badge">👤 {adminName}</span>
          </div>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;