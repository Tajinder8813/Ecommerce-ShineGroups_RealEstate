import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Star, MapPin, Clock, Phone, MessageCircle, ShieldCheck, 
  Users, Building2, Briefcase, ChevronRight, CheckCircle2, 
  Construction, Target, Eye, HardHat, FileText, Handshake 
} from 'lucide-react';
import './About.css';

const About = ({ isAuthenticated, data}) => {
  const navigate = useNavigate();

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${data.phone.replace('+', '')}?text=I'd like to talk to an expert about Shine Associates properties.`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${data.phone}`;
  };

  const partners = [
    {
      name: "Sukhdev Singh",
      role: "Managing Partner",
      desc: "Specializes in residential and investment properties with over 16 years of industry experience."
    },
    {
      name: "Khushdeep Singh",
      role: "Managing Partner",
      desc: "Expert in commercial real estate transactions and client relationship management."
    },
    {
      name: "Harman Singh",
      role: "Managing Partner",
      desc: "Focused on project development, land acquisition, and strategic planning."
    }
  ];

  const steps = [
    { title: "Property Search", icon: <Building2 size={20} /> },
    { title: "Site Visit", icon: <MapPin size={20} /> },
    { title: "Documentation", icon: <FileText size={20} /> },
    { title: "Negotiation", icon: <Handshake size={20} /> },
    { title: "Registration", icon: <ShieldCheck size={20} /> },
    { title: "Construction Support", icon: <Construction size={20} />, optional: true }
  ];

  const timeline = [
    { year: "2010", event: "Company Founded" },
    { year: "2014", event: "Expanded Residential Services" },
    { year: "2018", event: "Commercial Property Division Added" },
    { year: "2022", event: "Partnership with JBA Constructs" },
    { year: "2026", event: "Serving Hundreds of Satisfied Clients" }
  ];

  return (
    <div className="app-wrapper">
      
      <main className="main-content">
        <div className='about-page'>
          {/* HERO SECTION */}
          <section className="about-hero">
          <div className="about-hero-overlay">
            <span className="hero-badge">Established 2010</span>
            <h1>Building Trust in Real Estate for Over 16 Years</h1>
            <p>Helping families, investors, and businesses find the right properties with transparency, expertise, and long-term relationships.</p>
            <div className="hero-cta-btns">
              <button onClick={() => navigate('/properties')} className="btn-hero-primary">View Properties</button>
              <button onClick={handleCall} className="btn-hero-secondary">Contact Us</button>
            </div>
          </div>
          </section>

          {/* COMPANY INTRODUCTION & STATS */}
          <section className="about-intro-section">
          <div className="about-container">
            <div className="intro-grid">
              <div className="intro-text">
                <span className="section-subtitle">Who We Are</span>
                <h2>Honest Guidance, Exceptional Architecture</h2>
                <p>Founded with a vision to provide honest and reliable real estate services, Shine Associates has been serving clients for more than 16 years. With deep local market knowledge and a commitment to transparency, we specialize in residential, commercial, and investment properties.</p>
                <p>Our partnership-driven approach ensures every client receives personalized guidance throughout their property journey from root level mapping to complete regulatory registrations.</p>
              </div>
              <div className="stats-sidebar-grid">
                <div className="stat-premium-card"><h3>16+</h3><p>Years Experience</p></div>
                <div className="stat-premium-card"><h3>500+</h3><p>Properties Sold</p></div>
                <div className="stat-premium-card"><h3>1000+</h3><p>Happy Clients</p></div>
                <div className="stat-premium-card"><h3>3</h3><p>Managing Partners</p></div>
              </div>
            </div>
          </div>
          </section>

          {/* MEET OUR PARTNERS */}
          <section className="partners-section">
          <div className="about-container">
            <div className="section-header-center">
              <span className="section-subtitle">Leadership</span>
              <h2>Meet Our Managing Partners</h2>
              <div className="header-underline"></div>
            </div>
            <div className="partners-grid">
              {partners.map((partner, index) => (
                <div key={index} className="partner-profile-card">
                    <div className="partner-avatar-placeholder">
                    <Users size={40} color="var(--accent-green)" />
                  </div>
                  <h3>{partner.name}</h3>
                  <span className="partner-role">{partner.role}</span>
                  <p>{partner.desc}</p>
                </div>
              ))}
            </div>
          </div>
          </section>

          {/* OUR CONSTRUCTION PARTNER (JBA CONSTRUCTS) */}
          <section className="jba-partnership-section">
          <div className="about-container">
            <div className="jba-card-wrapper">
              <div className="jba-info">
                <div className="alliance-badge">
                  <Construction size={16} /> 
                  Strategic Alliance
                </div>
                <h2>In Association with JBA Constructs</h2>
                <p>Through our exclusive structural collaboration with JBA Constructs, 
                  we provide clients direct corporate access to structural quality 
                  construction services, engineered project development expertise, 
                  and unified end-to-end property solutions—from raw land acquisition 
                  to completed turnkey projects.
                </p>
                
                <div className="jba-features-grid">
                  <div className="jba-feat-item">
                    <HardHat size={16} /> 
                    Residential Construction
                  </div>
                  <div className="jba-feat-item">
                    <Building2 size={16} /> 
                    Commercial Projects
                  </div>
                  <div className="jba-feat-item">
                    <Briefcase size={16} /> 
                    Renovation Services
                  </div>
                  <div className="jba-feat-item">
                    <CheckCircle2 size={16} /> 
                    Turnkey Solutions
                  </div>
                </div>
              </div>
              <div className="jba-visual-placeholder">
                <Construction size={80} color="rgba(255,255,255,0.15)" />
                <span>Unified Construction Delivery</span>
              </div>
            </div>
          </div>
          </section>

          {/*  WHY CHOOSE US */}
          <section className="why-choose-section">
          <div className="about-container">
            <div className="section-header-center">
              <span className="section-subtitle">Our Advantages</span>
              <h2>Why Clients Choose Shine Group</h2>
              <div className="header-underline"></div>
            </div>
            <div className="why-grid">
              <div className="why-card">
                <h4><CheckCircle2 size={18} /> 16 Years of Experience</h4>
                <p>Deep understanding of the local property structural asset 
                  market values.
                </p>
              </div>
              <div className="why-card">
                <h4><CheckCircle2 size={18} /> Trusted Network</h4>
                <p>Strong, clean connections with vetted developers, premium investors,
                   and immediate buyers.
                </p>
              </div>
              <div className="why-card">
                <h4><CheckCircle2 size={18} /> Transparent Dealings</h4>
                <p>Honest advisory frameworks and completely clear, verified legal 
                  ocumentation.
                </p>
              </div>
              <div className="why-card">
                <h4><CheckCircle2 size={18} /> Legal Assistance</h4>
                <p>Complete corporate guidance through official regional documentation 
                  and registration.
                </p>
              </div>
              <div className="why-card">
                <h4><CheckCircle2 size={18} /> Construction Support</h4>
                <p>Complete structural solutions directly through our companion group 
                  JBA Constructs.
                </p>
              </div>
              <div className="why-card">
                <h4><CheckCircle2 size={18} /> Customer First Philosophy</h4>
                <p>Prioritizing sustainable long-term relationships over short-term 
                  transaction closures.
                </p>
              </div>
            </div>
          </div>
          </section>

          {/* MISSION & VISION */}
          <section className="mission-vision-section">
          <div className="about-container">
            <div className="mv-grid">
              <div className="mv-card">
                <div className="mv-icon-box"><Target size={24} /></div>
                <h3>Our Mission</h3>
                <p>To simplify complex real estate transactions through transparent 
                  frameworks, unmatched professional integrity, and dedicated personalized 
                  service layouts.
                </p>
              </div>
              <div className="mv-card">
                <div className="mv-icon-box">
                  <Eye size={24} />
                </div>
                <h3>Our Vision</h3>
                <p>To become the most trusted real estate ecosystem and premium property 
                  development partner across the entire Punjab region.</p>
              </div>
            </div>
          </div>
          </section>

          {/*  OUR TIMELINE PROCESS */}
          <section className="process-timeline-section">
          <div className="about-container">
            <div className="section-header-center">
              <span className="section-subtitle">Workflow</span>
              <h2>Our Structured Property Journey</h2>
              <div className="header-underline"></div>
            </div>
            <div className="process-horizontal-flow">
              {steps.map((step, idx) => (
                <div key={idx} className="process-step-node">
                  <div className="step-icon-ring">
                    {step.icon}
                    <div className="step-counter-badge">{idx + 1}</div>
                  </div>
                  <h4>{step.title}</h4>
                  {step.optional && <span className="optional-tag">Optional</span>}
                  {idx < steps.length - 1 && 
                  <div className="step-connector-line">
                    <ChevronRight size={16} />
                  </div>}
                </div>
              ))}
            </div>
          </div>
          </section>

          {/*  EXPERIENCE TIMELINE */}
          <section className="history-section">
          <div className="about-container">
            <div className="section-header-center">
              <span className="section-subtitle">Milestones</span>
              <h2>Our Journey Through Time</h2>
              <div className="header-underline"></div>
            </div>
            <div className="history-vertical-line">
              {timeline.map((item, idx) => (
                <div key={idx} 
                     className={`history-milestone-node ${idx % 2 === 0 ? 'left-node' : 'right-node'}`}>
                  <div className="milestone-content-box">
                    <span className="milestone-year">{item.year}</span>
                    <p>{item.event}</p>
                  </div>
                  <div className="timeline-center-bullet"></div>
                </div>
              ))}
            </div>
          </div>
          </section>

          {/*  REGIONAL SERVICE AREAS */}
          <section className="service-areas-section">
          <div className="about-container">
            <div className="section-header-center">
              <span className="section-subtitle">Coverage</span>
              <h2>Key Operating Regions</h2>
              <div className="header-underline"></div>
            </div>
            <div className="areas-pill-box">
              {["Phagwara", "Jalandher", "Chandigarh", "Gurdaspur", "Amritsar", 
              "Banga", "Nearby Punjab Regions"].map((area, i) => (
                <div key={i} className="area-pill-node">
                  <MapPin size={14} color="var(--green)" /> 
                  {area}
                </div>
              ))}
            </div>
          </div>
          </section>

          {/*  CONTACT CTA */}
          <section className="about-cta-footer-banner">
          <div className="cta-inner-content">
            <h2>Looking for your next property investment?</h2>
            <p>Connect with one of our managing partners today for authentic 
              project assessments.</p>
            <div className="cta-action-row-btns">
              <button onClick={() => navigate('/properties')} className="btn-cta-accent">
                Browse Properties
              </button>
              <button onClick={handleWhatsApp} className="btn-cta-outline">
                Contact Our Team
              </button>
            </div>
          </div>
          </section>
        </div>
      </main>     
    </div>
  );
};

export default About;