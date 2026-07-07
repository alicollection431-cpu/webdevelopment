import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./HeroSection.css";

function HeroSection() {
  const [heroData, setHeroData] = useState({
    tag: "🚀 Best Digital Agency",
    title: "Build Amazing Digital Experiences",
    description: "We are a creative digital agency building modern web solutions...",
    button_text: "Get Started",
    button_link: "/contact"
  });
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Image data
  const images = [
    {
      url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
      alt: "Digital Agency - Technology"
    },
    {
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      alt: "Digital Agency - Analytics"
    },
    {
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      alt: "Digital Agency - Growth"
    },
    {
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
      alt: "Digital Agency - Team"
    }
  ];

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hero');
      console.log('📊 Hero Data from Database:', response.data);
      
      // Agar response array hai toh first item lein, nahi toh direct object
      let data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        data = data[0]; // First hero section
      }
      
      setHeroData({
        tag: data.tag || heroData.tag,
        title: data.title || heroData.title,
        description: data.description || heroData.description,
        button_text: data.button_text || heroData.button_text,
        button_link: data.button_link || heroData.button_link
      });
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching hero data:', error);
      setLoading(false);
    }
  };

  // Slider navigation functions
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  if (loading) {
    return (
      <div className="hero-loading" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b0f1a',
        color: '#f1f5f9',
        fontSize: '1.2rem'
      }}>
        ⏳ Loading...
      </div>
    );
  }

  return (
    <section className="hero">
      <div className="hero-left">
        <span className="tag" style={{ marginTop: '15px' }}>{heroData.tag}</span>
        <h1>
          {heroData.title}
        </h1>
        <p>{heroData.description}</p>
        <div className="hero-btns">
          <Link to={heroData.button_link}>
            <button className="primary">{heroData.button_text}</button>
          </Link>
          <Link to={heroData.button_link}>
            <button className="secondary">Watch Demo</button>
          </Link>
        </div>
        <div className="stats">
          <div><h2>500+</h2><p>Projects</p></div>
          <div><h2>120+</h2><p>Clients</p></div>
          <div><h2>10+</h2><p>Years</p></div>
        </div>
      </div>
      
      {/* Image Slider */}
      <div className="hero-slider">
        <div className="slider-container">
          {images.map((image, index) => (
            <div
              key={index}
              className={`slide ${index === currentIndex ? 'active' : ''}`}
              style={{
                transform: `translateX(${(index - currentIndex) * 100}%)`,
                opacity: index === currentIndex ? 1 : 0,
              }}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="slider-image"
              />
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="slider-dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button className="slider-arrow prev" onClick={prevSlide}>
          ◀
        </button>
        <button className="slider-arrow next" onClick={nextSlide}>
          ▶
        </button>
      </div>
    </section>
  );
}

export default HeroSection;