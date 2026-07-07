import { useState, useEffect } from "react";
import axios from "axios";
import "./AboutUs.css";

function AboutUs() {
  const [aboutData, setAboutData] = useState([]);
  const [missionData, setMissionData] = useState(null);
  const [visionData, setVisionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/about');
      console.log('📊 About Data from Database:', response.data);
      
      const activeData = response.data.filter(item => item.is_active === 1);
      setAboutData(activeData);
      
      const firstItem = activeData.find(item => item.mission || item.vision);
      if (firstItem) {
        setMissionData(firstItem.mission || null);
        setVisionData(firstItem.vision || null);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching about data:', error);
      setError('Failed to load about data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="about">
        <div className="loading-spinner">
          ⏳ Loading about section...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="about">
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#fca5a5'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>❌</div>
          <h3 style={{ marginBottom: '10px' }}>Failed to load content</h3>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="about">
      <div className="about-header">
        <h2>About Us</h2>
        <p style={{ maxWidth: "700px", margin: "10px auto 0", fontSize: "1.2rem", color: "#94a3b8" }}>
          We are a creative digital agency building modern web solutions that help businesses grow.
        </p>
        <div className="subtitle-line"></div>
      </div>
      
      {/* ===== CARDS SECTION ===== */}
      <div className="about-cards">
        {aboutData.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
            No about sections available. Please add some from the admin panel.
          </p>
        ) : (
          aboutData.map((item) => (
            <div key={item.id} className="about-card">
              <div className="icon-wrap">{item.icon || '📄'}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="card-accent"></div>
            </div>
          ))
        )}
      </div>

      {/* ===== MISSION & VISION - FLEX ROW ===== */}
      {(missionData || visionData) && (
        <div className="mission-vision-wrapper">
          {/* Mission */}
          {missionData && (
            <div className="mission-section">
              <div className="mission-container">
                <div className="mission-icon">🎯</div>
                <div className="mission-content">
                  <h3>Our Mission</h3>
                  <p>{missionData}</p>
                </div>
              </div>
            </div>
          )}

          {/* Vision */}
          {visionData && (
            <div className="vision-section">
              <div className="vision-container">
                <div className="vision-icon">👁️</div>
                <div className="vision-content">
                  <h3>Our Vision</h3>
                  <p>{visionData}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default AboutUs;