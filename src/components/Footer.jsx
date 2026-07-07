import { useState } from "react";
import "./Footer.css";

function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with: ${email}`);
      setEmail("");
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand">
          <h2>Zennix</h2>
<p>
  At Zennix, we're passionate about building amazing digital experiences that 
  help businesses grow, innovate, and succeed in the modern world. From stunning 
  websites and powerful web applications to custom software solutions and digital 
  strategies, we combine creativity with cutting-edge technology to deliver 
  results that truly make a difference.
</p>          <div className="social-links">
            <a href="#" className="social-icon" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-icon" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="social-icon" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Portfolio</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-links">
          <h3>Our Services</h3>
          <ul>
            <li><a href="#">Web Design</a></li>
            <li><a href="#">Development</a></li>
            <li><a href="#">Mobile Apps</a></li>
            <li><a href="#">UI/UX Design</a></li>
            <li><a href="#">Branding</a></li>
            <li><a href="#">Digital Marketing</a></li>
          </ul>
        </div>

        {/* Newsletter & Contact */}
        <div className="footer-newsletter">
          <h3>Subscribe</h3>
          <p>Get the latest updates and offers</p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">
              Subscribe <i className="fas fa-arrow-right"></i>
            </button>
          </form>
          <div className="contact-info">
            <p><i className="fas fa-phone"></i> +91 9876543210</p>
            <p><i className="fas fa-envelope"></i> Zennix@gmail.com</p>
            <p><i className="fas fa-map-marker-alt"></i>Noida Sector 62, Uttar Pradesh</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>© 2026 MyWebsite. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;