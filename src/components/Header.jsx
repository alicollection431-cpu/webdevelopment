import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "./Header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }} onClick={closeMenu}>
            <h2>Zennix</h2>
          </Link>
        </div>

        {/* Navigation Links - Desktop */}
        <nav className={`navbar ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          <Link to="/services" onClick={closeMenu}>Services</Link>
          <Link to="/testimonials" onClick={closeMenu}>Testimonials</Link>
          <Link to="/contact" onClick={closeMenu}>Contact</Link>
          
          {/* Theme Toggle in Mobile Menu */}
          <div className="mobile-theme-toggle">
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {isDark ? (
                <>
                  <span className="theme-icon">☀️</span> Light Mode
                </>
              ) : (
                <>
                  <span className="theme-icon">🌙</span> Dark Mode
                </>
              )}
            </button>
          </div>

     
        </nav>

        {/* Desktop Buttons */}
        <div className="header-buttons">
          {/* Theme Toggle Button */}
          <button className="theme-toggle-btn desktop" onClick={toggleTheme} aria-label="Toggle Theme">
            {isDark ? '☀️' : '🌙'}
          </button>

        </div>

        {/* Hamburger Menu Icon */}
        <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>

      {/* Overlay */}
      <div className={`overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
    </header>
  );
}

export default Header;