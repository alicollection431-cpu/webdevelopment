import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import AboutUs from "./components/AboutUs";
import Services from "./components/Services";
import Testimonial from "./components/Testimonial";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Team from "./components/Team";

// Admin Imports
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageHero from "./pages/admin/ManageHero";
import ManageAbout from "./pages/admin/ManageAbout";
import ManageServices from "./pages/admin/ManageServices";
import ManageTestimonials from "./pages/admin/ManageTestimonials";
import ManageContact from "./pages/admin/ManageContact";
import ManageMessages from "./pages/admin/ManageMessages";
import ManageTeam from "./pages/admin/ManageTeam";

// ===== MAIN WEBSITE LAYOUT =====
function MainLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

// ===== HOME PAGE =====
function Home() {
  return (
    <>
      <HeroSection />
      <AboutUs />
      <Services />
      <Testimonial />
      <Team />
      <Contact />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* ========== PUBLIC ROUTES (with Header & Footer) ========== */}
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />

          <Route
            path="/about"
            element={
              <MainLayout>
                <AboutUs />
              </MainLayout>
            }
          />

          <Route
            path="/services"
            element={
              <MainLayout>
                <Services />
              </MainLayout>
            }
          />

          <Route
            path="/testimonials"
            element={
              <MainLayout>
                <Testimonial />
              </MainLayout>
            }
          />
          <Route
            path="/team"
            element={
              <MainLayout>
                <Team />
              </MainLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <MainLayout>
                <Contact />
              </MainLayout>
            }
          />

          {/* ========== ADMIN ROUTES (NO Footer) ========== */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/hero" element={<ManageHero />} />
          <Route path="/admin/about" element={<ManageAbout />} />
          <Route path="/admin/services" element={<ManageServices />} />
          <Route path="/admin/testimonials" element={<ManageTestimonials />} />
          <Route path="/admin/contact" element={<ManageContact />} />
          <Route path="/admin/messages" element={<ManageMessages />} />
          <Route path="/admin/team" element={<ManageTeam />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
