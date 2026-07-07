import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Team.css';
import { 
  FaLinkedinIn, 
  FaTwitter, 
  FaFacebookF, 
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const sliderRef = useRef(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 768) {
        setSlidesToShow(2);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/team');
      console.log('👥 Team Data:', response.data);
      setTeamMembers(response.data);
      setError(null);
    } catch (error) {
      console.error('❌ Error fetching team:', error);
      setError('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    const maxSlide = Math.max(0, teamMembers.length - slidesToShow);
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <section className="team-section">
        <div className="team-loading">
          <div className="loading-spinner"></div>
          <p>Loading our amazing team...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="team-section">
        <div className="team-error">
          <span>❌</span>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <section className="team-section">
        <div className="team-empty">
          <span>👥</span>
          <p>No team members found. Check back soon!</p>
        </div>
      </section>
    );
  }

  const visibleMembers = teamMembers.slice(
    currentSlide,
    currentSlide + slidesToShow
  );

  return (
    <section className="team-section" id="team">
      <div className="team-container">
        <div className="team-header">
          <span className="team-badge">👥 Our Team</span>
          <h2>Meet the <span>Visionaries</span> Behind Zennix</h2>
          <p>
            Passionate innovators, creative thinkers, and tech enthusiasts 
            dedicated to transforming ideas into extraordinary digital experiences.
          </p>
        </div>

        <div className="team-slider-wrapper">
          <div className="team-slider" ref={sliderRef}>
            <div 
              className="team-track"
              style={{
                transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`,
                transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              {teamMembers.map((member, index) => (
                <div 
                  key={member.id} 
                  className="team-card-wrapper"
                  style={{ flex: `0 0 ${100 / slidesToShow}%` }}
                >
                  <div className="team-card">
                    <div className="card-image-container">
                      <img 
                        src={member.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(member.name) + '&background=7c3aed&color=fff&size=300'} 
                        alt={member.name}
                        className="card-image"
                        loading="lazy"
                      />
                      <div className="card-overlay">
                        <div className="social-overlay-links">
                          {member.facebook && (
                            <a href={member.facebook} target="_blank" rel="noopener noreferrer">
                              <FaFacebookF />
                            </a>
                          )}
                          {member.twitter && (
                            <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                              <FaTwitter />
                            </a>
                          )}
                          {member.linkedin && (
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                              <FaLinkedinIn />
                            </a>
                          )}
                          {member.instagram && (
                            <a href={member.instagram} target="_blank" rel="noopener noreferrer">
                              <FaInstagram />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="card-content">
                      <h3 className="member-name">{member.name}</h3>
                      <span className="member-position">{member.position}</span>
                      
                      {member.bio && (
                        <p className="member-bio">{member.bio}</p>
                      )}
                      
                      <div className="member-contact">
                        {member.email && (
                          <a href={`mailto:${member.email}`} className="contact-link">
                            <FaEnvelope />
                          </a>
                        )}
                        {member.phone && (
                          <a href={`tel:${member.phone}`} className="contact-link">
                            <FaPhone />
                          </a>
                        )}
                      </div>

                      <div className="card-social-links">
                        {member.facebook && (
                          <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="social-link facebook">
                            <FaFacebookF />
                          </a>
                        )}
                        {member.twitter && (
                          <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="social-link twitter">
                            <FaTwitter />
                          </a>
                        )}
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                            <FaLinkedinIn />
                          </a>
                        )}
                        {member.instagram && (
                          <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="social-link instagram">
                            <FaInstagram />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {teamMembers.length > slidesToShow && (
            <>
              <button 
                className="slider-btn prev-btn" 
                onClick={prevSlide}
                disabled={currentSlide === 0}
              >
                <FaChevronLeft />
              </button>
              <button 
                className="slider-btn next-btn" 
                onClick={nextSlide}
                disabled={currentSlide >= teamMembers.length - slidesToShow}
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>

        {teamMembers.length > slidesToShow && (
          <div className="slider-dots">
            {Array.from({ length: Math.ceil(teamMembers.length - slidesToShow + 1) }).map((_, index) => (
              <button
                key={index}
                className={`dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}

        <div className="team-stats">
          <div className="stat-item">
            <span className="stat-number">{teamMembers.length}</span>
            <span className="stat-label">Team Members</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{teamMembers.filter(m => m.position.includes('Developer')).length}</span>
            <span className="stat-label">Developers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{teamMembers.filter(m => m.position.includes('Design')).length}</span>
            <span className="stat-label">Designers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">10+</span>
            <span className="stat-label">Years Combined</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Team;