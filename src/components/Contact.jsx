import { useState, useEffect } from "react";
import axios from "axios";
import "./Contact.css";
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaArrowRight,
  FaCheckCircle
} from 'react-icons/fa';

function Contact() {
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    address: '',
    working_hours: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/contact');
      console.log('📊 Contact Data from Database:', response.data);
      
      const data = Array.isArray(response.data) ? response.data[0] : response.data;
      
      if (data && data.id) {
        setContactInfo({
          phone: data.phone || '+1 (555) 123-4567',
          email: data.email || 'zennix@gmail.com',
          address: data.address || '123 Tech Park, Silicon Valley, CA 94025',
          working_hours: data.working_hours || 'Mon - Fri: 9:00 AM - 6:00 PM',
          facebook: data.facebook || '',
          twitter: data.twitter || '',
          linkedin: data.linkedin || '',
          instagram: data.instagram || ''
        });
        setError(null);
      } else {
        setContactInfo({
          phone: '+1 (555) 123-4567',
          email: 'zennix@gmail.com',
          address: '123 Tech Park, Silicon Valley, CA 94025',
          working_hours: 'Mon - Fri: 9:00 AM - 6:00 PM',
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: ''
        });
        setError('Contact information not found in database. Using default values.');
      }
    } catch (error) {
      console.error('❌ Error fetching contact info:', error);
      setContactInfo({
        phone: '+1 (555) 123-4567',
        email: 'zennix@gmail.com',
        address: '123 Tech Park, Silicon Valley, CA 94025',
        working_hours: 'Mon - Fri: 9:00 AM - 6:00 PM',
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: ''
      });
      setError('Failed to load contact information. Using default values.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user types
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    setShowSuccess(false);
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setFormError('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('📤 Sending message:', formData);
      
      const response = await axios.post('http://localhost:5000/api/contact/messages', formData);
      
      console.log('✅ Message sent:', response.data);
      
      setSuccessMessage(response.data.message || 'Thank you! Your message has been sent successfully.');
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      // Auto hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('❌ Error sending message:', error);
      
      if (error.response) {
        // Server responded with error
        setFormError(error.response.data.message || 'Failed to send message. Please try again.');
      } else if (error.request) {
        // Request made but no response
        setFormError('Cannot connect to server. Please check your internet connection.');
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="contact">
        <div className="loading-spinner" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          color: '#94a3b8',
          fontSize: '1.2rem',
          width: '100%'
        }}>
          ⏳ Loading contact information...
        </div>
      </section>
    );
  }

  return (
    <section className="contact">
      <div className="contact-container">
        {/* Left Side - Company Info */}
        <div className="contact-info-side">
          <div className="info-content">
            <span className="contact-badge">📞 Get in Touch</span>
            <h2>Let's Build Something <span>Amazing Together</span></h2>
            <p>
              At <strong>Zennix</strong>, we transform ideas into powerful digital 
              solutions. Whether you need a stunning website, a robust web application, 
              or innovative software, our team is here to bring your vision to life.
            </p>
            
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h4>Our Location</h4>
                  <p>{contactInfo.address}</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <FaPhone />
                </div>
                <div>
                  <h4>Phone Number</h4>
                  <p>{contactInfo.phone}</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <FaEnvelope />
                </div>
                <div>
                  <h4>Email Address</h4>
                  <p>{contactInfo.email}</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <FaClock />
                </div>
                <div>
                  <h4>Working Hours</h4>
                  <p>{contactInfo.working_hours}</p>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            {(contactInfo.facebook || contactInfo.twitter || contactInfo.linkedin || contactInfo.instagram) && (
              <div className="social-section">
                <p>Follow us on social media</p>
                <div className="social-links">
                  {contactInfo.facebook && (
                    <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                      <FaFacebookF />
                    </a>
                  )}
                  {contactInfo.twitter && (
                    <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                      <FaTwitter />
                    </a>
                  )}
                  {contactInfo.linkedin && (
                    <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                      <FaLinkedinIn />
                    </a>
                  )}
                  {contactInfo.instagram && (
                    <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                      <FaInstagram />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="contact-form-side">
          <div className="form-wrapper">
            <div className="form-header">
              <h3>Send us a Message</h3>
              <p>We'll get back to you within 24 hours</p>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="success-message">
                <FaCheckCircle />
                <p>{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {formError && (
              <div className="error-message">
                <span>❌</span>
                <p>{formError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Full Name *"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <textarea
                name="message"
                rows="5"
                placeholder="Tell us about your project... *"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message <FaArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="form-footer">
              <p>📱 Or reach us directly at <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;