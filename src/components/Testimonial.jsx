import { useState, useEffect } from "react";
import axios from "axios";
import "./Testimonial.css";

function Testimonial() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/testimonials');
      console.log('📊 Testimonials Data from Database:', response.data);
      
      // Filter only active testimonials
      const activeData = response.data.filter(item => item.is_active === 1);
      setTestimonials(activeData);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching testimonials:', error);
      setError('Failed to load testimonials');
      setLoading(false);
      
      // Fallback data if API fails
      setTestimonials([
        {
          id: 1,
          name: "Aman Sharma",
          role: "CEO",
          company: "TechStart Inc.",
          review: "Absolutely phenomenal work! Zennix transformed our entire digital presence.",
          rating: 5,
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0",
          color: "#7c3aed"
        },
        {
          id: 2,
          name: "Priya Patel",
          role: "Founder",
          company: "CreativeHub Studio",
          review: "Working with Zennix was a game-changer for our business.",
          rating: 5,
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0",
          color: "#ec4899"
        },
        {
          id: 3,
          name: "Rahul Verma",
          role: "CTO",
          company: "DigitalDreams",
          review: "The team at Zennix is exceptional. They understand technology deeply.",
          rating: 4,
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0",
          color: "#06b6d4"
        }
      ]);
    }
  };

  // Auto-slide effect
  useEffect(() => {
    if (testimonials.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  // Get image URL with fallback
  const getImageUrl = (image) => {
    if (!image) return 'https://ui-avatars.com/api/?name=User&background=7c3aed&color=fff&size=100';
    if (image.startsWith('http')) return image;
    return `http://localhost:5000/uploads/${image}`;
  };

  // Get color based on index
  const getColor = (index) => {
    const colors = ['#7c3aed', '#ec4899', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <section className="testimonial-section">
        <div className="loading-spinner" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          color: '#94a3b8',
          fontSize: '1.2rem'
        }}>
          ⏳ Loading testimonials...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="testimonial-section">
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#fca5a5'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>❌</div>
          <h3>Failed to load testimonials</h3>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="testimonial-section">
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#94a3b8'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💬</div>
          <h3>No Testimonials Yet</h3>
          <p>Check back soon for client reviews!</p>
        </div>
      </section>
    );
  }

  const currentTestimonial = testimonials[currentIndex];
  const color = getColor(currentIndex);

  return (
    <section className="testimonial-section">
      {/* Background Decoration */}
      <div className="bg-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="testimonial-container">
        {/* LEFT SIDE - CTA Section */}
        <div className="cta-side">
          <div className="cta-content-wrapper">
            <span className="cta-badge">🌟 Join Our Happy Clients</span>
            <h2 className="cta-title">
              Ready to Transform <br />
              <span>Your Business?</span>
            </h2>
            <p className="cta-description">
              Join {testimonials.length}+ satisfied clients who have already experienced the 
              Zennix difference. Let's create something amazing together.
            </p>
            
            <div className="cta-stats">
              <div className="cta-stat">
                <div className="stat-number">{testimonials.length}+</div>
                <div className="stat-label">Happy Clients</div>
              </div>
              <div className="cta-stat">
                <div className="stat-number">98%</div>
                <div className="stat-label">Satisfaction</div>
              </div>
              <div className="cta-stat">
                <div className="stat-number">
                  {(testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)}/5
                </div>
                <div className="stat-label">Avg Rating</div>
              </div>
            </div>

            <a href="/contact" className="cta-main-button">
              Get Started Today
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
            </a>

            <div className="trusted-companies">
              <p>Trusted by leading companies</p>
              <div className="company-badges">
                {testimonials.slice(0, 3).map((t, idx) => (
                  <span key={idx}>🏢 {t.company || 'Client'}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Testimonial Card */}
        <div className="testimonial-side">
          <div className="testimonial-card">
            {/* Decorative Elements */}
            <div className="card-decoration">
              <div className="gradient-blob"></div>
            </div>

            <div className="card-header">
              <span className="card-badge">💬 Client Review</span>
              <div className="rating-stars">
                {renderStars(currentTestimonial.rating)}
              </div>
            </div>
            <div className="profile-wrapper">
                <div className="profile-image-container">
                  <img 
                    src={getImageUrl(currentTestimonial.image)} 
                    alt={currentTestimonial.name || 'Client'}
                    className="profile-image"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${currentTestimonial.name || 'User'}&background=7c3aed&color=fff&size=100`;
                    }}
                  />
                  <div className="profile-ring" style={{ borderColor: color }}></div>
                </div>
                <div className="profile-info">
                  <h4>{currentTestimonial.name || 'Anonymous'}</h4>
                  <p className="profile-role">{currentTestimonial.role || 'Client'}</p>
                  <p className="profile-company">{currentTestimonial.company || ''}</p>
                </div>
              </div>

            <div className="card-body">
              <div className="quote-mark">"</div>
              <p className="review-text">{currentTestimonial.review}</p>
            </div>

            <div className="card-footer">
              

              <div className="card-navigation">
                <button className="nav-arrow prev" onClick={prevSlide}>
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  </svg>
                </button>
                
                <div className="dots">
                  {testimonials.map((_, idx) => (
                    <span
                      key={idx}
                      className={`dot ${idx === currentIndex ? 'active' : ''}`}
                      onClick={() => goToSlide(idx)}
                    ></span>
                  ))}
                </div>

                <button className="nav-arrow next" onClick={nextSlide}>
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Slide Counter */}
              <div className="slide-counter" style={{ marginTop: '-110px', fontSize: '0.9rem', color: '#94a3b8' }}>
                {currentIndex + 1} / {testimonials.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonial;