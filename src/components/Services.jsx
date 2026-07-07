import { useState, useEffect } from "react";
import axios from "axios";
import "./Services.css";
import {
  FaCode,
  FaPaintBrush,
  FaMobileAlt,
  FaChartLine,
  FaCloudUploadAlt,
  FaShieldAlt,
  FaRobot,
  FaDatabase,
  FaShoppingCart,
  FaSearch,
  FaVideo,
  FaHeadset,
  FaArrowRight,
} from "react-icons/fa";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/services");
      console.log("📊 Services Data from Database:", response.data);

      // Filter only active services (is_active = 1)
      const activeServices = response.data.filter(
        (item) => item.is_active === 1,
      );
      setServices(activeServices);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching services:", error);
      setError("Failed to load services");
      setLoading(false);

      // Fallback data if API fails
      setServices([
        {
          id: 1,
          icon: "💻",
          title: "Web Development",
          description:
            "Custom websites and web applications built with modern technologies.",
          features: "Fast Performance",
          features2: "Secure & Reliable",
          features3: "SEO Optimized",
        },
        {
          id: 2,
          icon: "🎨",
          title: "UI/UX Design",
          description:
            "Beautiful, user-centric designs that engage and convert visitors.",
          features: "User-Friendly",
          features2: "Modern Design",
          features3: "Responsive",
        },
        {
          id: 3,
          icon: "📱",
          title: "Mobile Apps",
          description:
            "Native and cross-platform mobile applications for iOS and Android.",
          features: "iOS & Android",
          features2: "React Native",
          features3: "Flutter",
        },
        {
          id: 4,
          icon: "📊",
          title: "Digital Marketing",
          description:
            "SEO, social media, and content marketing strategies for growth.",
          features: "SEO Optimization",
          features2: "Social Media Marketing",
          features3: "Content Strategy",
        },
      ]);
    }
  };

  // Map icon string to component
  const getIconComponent = (iconName) => {
    const iconMap = {
      FaCode: FaCode,
      FaPaintBrush: FaPaintBrush,
      FaMobileAlt: FaMobileAlt,
      FaChartLine: FaChartLine,
      FaCloudUploadAlt: FaCloudUploadAlt,
      FaShieldAlt: FaShieldAlt,
      FaRobot: FaRobot,
      FaDatabase: FaDatabase,
      FaShoppingCart: FaShoppingCart,
      FaSearch: FaSearch,
      FaVideo: FaVideo,
      FaHeadset: FaHeadset,
    };
    return iconMap[iconName] || FaCode;
  };

  // Render features as array
  const renderFeatures = (service) => {
    const features = [];
    if (service.features) features.push(service.features);
    if (service.features2) features.push(service.features2);
    if (service.features3) features.push(service.features3);
    return features;
  };

  if (loading) {
    return (
      <section className="services">
        <div className="services-header">
          <span className="services-badge">🚀 What We Do</span>
          <h2>
            Our Comprehensive <span>Services</span>
          </h2>
          <p className="services-subtitle">Loading services...</p>
        </div>
        <div
          className="loading-spinner"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
            color: "#94a3b8",
          }}
        >
          ⏳ Loading services...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="services">
        <div className="services-header">
          <span className="services-badge">🚀 What We Do</span>
          <h2>
            Our Comprehensive <span>Services</span>
          </h2>
          <p className="services-subtitle">
            We deliver end-to-end digital solutions tailored to your business
            needs
          </p>
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#fca5a5",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "15px" }}>❌</div>
          <h3>Failed to load services</h3>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="services">
      <div className="services-header">
        <span className="services-badge">🚀 What We Do</span>
        <h2>
          Our Comprehensive <span>Services</span>
        </h2>
        <p className="services-subtitle">
          We deliver end-to-end digital solutions tailored to your business
          needs
        </p>
      </div>
        {/* ===== LLM SECTION ===== */}
         <div className="llm-section">
        <div className="llm-container">
          <div className="llm-content">
            <span className="llm-badge">🤖 Next-Gen Technology</span>
            <h3>LLM Based Software Solutions</h3>
            <p>
              Leverage the power of Large Language Models to transform your
              business. Our AI-driven solutions help you automate tasks,
              generate content, analyze data, and deliver personalized
              experiences at scale.
            </p>
            <div className="llm-features">
              <span>🧠 Intelligent Automation</span>
              <span>📝 Content Generation</span>
              <span>📊 Data Analysis</span>
              <span>💬 Smart Chatbots</span>
              <span>🎯 Personalization</span>
              <span>🔮 Predictive Analytics</span>
            </div>
            <a href="/contact" className="llm-btn">
              Get Started with AI <FaArrowRight />
            </a>
          </div>
          <div className="llm-icon-wrapper">
            <div className="llm-icon">🤖</div>
          </div>
        </div>
      </div>

      <div className="services-grid">
        {services.length === 0 ? (
          <p
            style={{
              color: "#94a3b8",
              textAlign: "center",
              gridColumn: "1 / -1",
              padding: "40px",
            }}
          >
            No services available. Please add services from the admin panel.
          </p>
        ) : (
          services.map((service) => {
            const IconComponent = getIconComponent(service.icon) || FaCode;
            const features = renderFeatures(service);

            return (
              <div key={service.id} className="service-card">
                <div className="service-icon">
                  <IconComponent />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                {features.length > 0 && (
                  <div className="service-features">
                    {features.map((feature, index) => (
                      <span key={index}>✅ {feature}</span>
                    ))}
                  </div>
                )}
                <a href="/contact" className="service-link">
                  Learn More <FaArrowRight />
                </a>
              </div>
            );
          })
        )}
      </div>

    
     
    </section>
  );
}

export default Services;
