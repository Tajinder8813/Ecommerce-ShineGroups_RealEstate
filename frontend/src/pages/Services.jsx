import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, Landmark, TrendingUp, Search, Layers, Shield,
  MapPin, CheckCircle, ChevronRight, Hammer, Award, Construction,
  Users, Key, FileText, CheckCircle2
} from 'lucide-react';
import './Services.css';

const Services = ({ isAuthenticated, data }) => {
  const navigate = useNavigate();
  const handleWhatsApp = () => {
    window.open(`https://wa.me/${data.phone.replace('+', '')}?text=I am interested in your services and would like to talk to an expert about Shine Associates Services.`, '_blank');
  };

  const financialSubServices = [
    "Property Investment Planning", "Real Estate Portfolio Consultation",
    "Property Valuation Assistance", "Loan & Mortgage Guidance",
    "ROI Analysis", "Commercial Investment Advisory", "Land Banking Consultation"
  ];

  const propertySubServices = [
    "Residential Plots", "Commercial Properties", "Agricultural Land",
    "Investment Properties", "Property Selling Assistance", "Property Purchase Assistance",
    "Rental Property Consultation", "Legal Documentation Support", "Registry & Mutation Guidance"
  ];

  const constructionSubServices = [
    "Residential House Construction", "Commercial Building Construction", "Turnkey Projects",
    "Renovation & Remodeling", "Architectural Planning", "Structural Engineering",
    "Interior & Exterior Finishing", "Project Supervision"
  ];

  const financialWorkflow = ["Consultation", "Budget Analysis", "Investment Planning", "Property Selection", "Documentation Support"];
  const propertyWorkflow = ["Requirement Discussion", "Property Shortlisting", "Site Visit", "Negotiation", "Legal Verification", "Registration"];
  const constructionWorkflow = ["Land Selection", "Planning & Design", "Cost Estimation", "Approvals", "Construction", "Quality Inspection", "Project Handover"];

  return (
    <>  

      <div className="app-wrapper">
        <main className="main-content tab-pane-animate">

          {/* 🏢 BUSINESS BANNER HERO */}
          <section className="services-hero-banner">
            <div className="services-hero-overlay">
              <span className="corporate-tag">Corporate Portfolio</span>
              <h1>Excellence Across Finance, Real Estate & Construction</h1>
              <p>Delivering institutional-grade property consultancy, asset optimization, 
                and turn-key structural engineering solutions across Punjab.
              </p>
            </div>
          </section>

          {/* 👥 WHO WE SERVE SECTION */}
          <section className="intro-serve-section">
            <div className="services-container">
              <div className="serve-box-layout">
                <span className="service-badge-label">Client Spectrum</span>
                <h2>Who We Serve</h2>
                <p>
                  From individual families acquiring ancestral homesteads to corporate investors 
                  syndicating commercial footprints, Shine Group coordinates capital allocation, 
                  structural safety, and verified legal conveyance. We mitigate transaction risk and 
                  build cross-generational appreciation under a multi-discipline executive framework.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 1: FINANCIAL SERVICES (Left-Right Layout) */}
          <section className="brochure-section finance-bg">
            <div className="services-container">
              <div className="brochure-grid layout-standard">
                <div className="brochure-text-panel">
                  <div className="vertical-indicator finance-accent"></div>
                  <span className="panel-super-title">Division 01 / Asset Management</span>
                  <h2>💰 Financial & Investment Services</h2>
                  <p className="panel-main-desc">
                    We help individuals and businesses make secure and 
                    profitable real estate investments through expert financial guidance and 
                    rigorous market analysis.
                  </p>

                  <h4 className="sub-section-title">Core Sub-Services</h4>
                  <div className="sub-services-checklist">
                    {financialSubServices.map((item, index) => (
                      <div key={index} className="checklist-item">
                        <CheckCircle size={16} className="text-finance" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <h4 className="sub-section-title">Investment Workflow</h4>
                  <div className="workflow-mini-pipeline">
                    {financialWorkflow.map((step, index) => (
                      <React.Fragment key={index}>
                        <div className="pipeline-node">
                          <span className="node-num">0{index + 1}</span>
                          <span className="node-text">{step}</span>
                        </div>
                        {index < financialWorkflow.length - 1 && <ChevronRight size={14} className="pipeline-arrow" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="brochure-image-panel placeholder-finance">
                  <div className="inner-graphic-card">
                    <TrendingUp size={48} className="text-finance" />
                    <h3>Capital Optimization</h3>
                    <p>Securing high-yielding real estate placements backed by 
                      demographic telemetry and infrastructure development maps.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: PROPERTY DEALERSHIP (Alternate Layout: Image-Left, Text-Right) */}
          <section className="brochure-section property-bg">
            <div className="services-container">
              <div className="brochure-grid layout-reversed">
                <div className="brochure-image-panel placeholder-property">
                  <div className="inner-graphic-card">
                    <Layers size={48} className="text-property" />
                    <h3>Verified Land Holdings</h3>
                    <p>Every commercial asset and residential colony undergoes strict 
                      administrative vetting for unencumbered ownership transfers.
                    </p>
                  </div>
                </div>

                <div className="brochure-text-panel">
                  <div className="vertical-indicator property-accent"></div>
                  <span className="panel-super-title">Division 02 / Brokerage & Conveyance</span>
                  <h2>🏠 Property Buying & Selling</h2>
                  <p className="panel-main-desc">
                    Whether you are buying your first home, selling land, or investing in 
                    commercial assets, we provide transparent and reliable property solutions.
                  </p>

                  <h4 className="sub-section-title">Brokerage Verticals</h4>
                  <div className="sub-services-checklist">
                    {propertySubServices.map((item, index) => (
                      <div key={index} className="checklist-item">
                        <CheckCircle size={16} className="text-property" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <h4 className="sub-section-title">Acquisition Timeline</h4>
                  <div className="workflow-mini-pipeline">
                    {propertyWorkflow.map((step, index) => (
                      <React.Fragment key={index}>
                        <div className="pipeline-node">
                          <span className="node-num">0{index + 1}</span>
                          <span className="node-text">{step}</span>
                        </div>
                        {index < propertyWorkflow.length - 1 && <ChevronRight size={14} className="pipeline-arrow" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 🏗 SECTION 3: CONSTRUCTION SERVICES (JBA Constructs Spotlight) */}
          <section className="brochure-section construction-bg">
            <div className="services-container">
              <div className="brochure-grid layout-standard">
                <div className="brochure-text-panel">
                  <div className="vertical-indicator construction-accent"></div>
                  <span className="panel-super-title">Division 03 / Engineering Alliance</span>
                  <h2>🏗 Construction & Development</h2>
                  <p className="panel-main-desc">
                    In structural alliance with 
                    <strong>JBA Constructs</strong>
                    , we deliver end-to-end master planning, advanced engineering, and 
                    finished turnkey projects optimized for durability.
                  </p>

                  <h4 className="sub-section-title">Engineering Capabilities</h4>
                  <div className="sub-services-checklist">
                    {constructionSubServices.map((item, index) => (
                      <div key={index} className="checklist-item">
                        <CheckCircle size={16} className="text-construction" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <h4 className="sub-section-title">Construction Phases</h4>
                  <div className="workflow-mini-pipeline vertical-on-mobile">
                    {constructionWorkflow.map((step, index) => (
                      <React.Fragment key={index}>
                        <div className="pipeline-node">
                          <span className="node-num">0{index + 1}</span>
                          <span className="node-text">{step}</span>
                        </div>
                        {index < constructionWorkflow.length - 1 && <ChevronRight size={14} className="pipeline-arrow adaptive-arrow" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="brochure-image-panel placeholder-construction">
                  <div className="inner-graphic-card jba-spotlight">
                    <Construction size={40} color="#38bdf8" />
                    <span className="jba-tag">JBA CONSTRUCTS</span>
                    <h3>Unified Build Delivery</h3>
                    <p>Enforcing rigorous civil testing, high-grade concrete layouts, 
                      and seismic structural safeguards for all custom properties.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 🌌 UNIQUE SELLING POINT: THE SHINE ECOSYSTEM TIMELINE */}
          <section className="ecosystem-section">
            <div className="services-container">
              <div className="ecosystem-header">
                <span className="ecosystem-badge">Corporate Integration</span>
                <h2>One Trusted Partner For Your Entire Property Journey</h2>
                <p>From planning your investment to handing over the keys to your 
                  completed project, Shine Group provides integrated solutions under one roof.
                </p>
              </div>

              {/* Premium Horizontal Ecosystem Timeline Flow */}
              <div className="ecosystem-flow-wrapper">
                <div className="ecosystem-line-track"></div>

                <div className="ecosystem-node-card">
                  <div className="ecosystem-circle"><Landmark size={22} /></div>
                  <h4>Financial Planning</h4>
                  <p>Risk mitigation strategies, budget configuration, and ROI forecasting layouts.</p>
                </div>

                <div className="ecosystem-node-card">
                  <div className="ecosystem-circle"><Search size={22} /></div>
                  <h4>Property Selection</h4>
                  <p>Strategic localized scouting of unencumbered plots and commercial hubs.</p>
                </div>

                <div className="ecosystem-node-card">
                  <div className="ecosystem-circle"><FileText size={22} /></div>
                  <h4>Documentation & Registry</h4>
                  <p>Comprehensive legal clearance, registration vetting, and mutation support.</p>
                </div>

                <div className="ecosystem-node-card jba-highlight-node">
                  <div className="ecosystem-circle"><Hammer size={22} /></div>
                  <h4>Construction by JBA</h4>
                  <p>Architectural execution and structural build-out to premium corporate tolerances.</p>
                </div>

                <div className="ecosystem-node-card">
                  <div className="ecosystem-circle"><Key size={22} /></div>
                  <h4>Final Delivery</h4>
                  <p>Turnkey structural hand-over with clean compliance and utility operational clearances.</p>
                </div>
              </div>

              {/* Bottom Feature Badges */}
              <div className="brochure-trust-badges">
                <div className="trust-badge-pill"><CheckCircle2 size={16} /> 16+ Years Experience</div>
                <div className="trust-badge-pill"><CheckCircle2 size={16} /> 3 Managing Partners</div>
                <div className="trust-badge-pill"><CheckCircle2 size={16} /> 500+ Successful Transactions</div>
                <div className="trust-badge-pill"><CheckCircle2 size={16} /> JBA Constructs Alliance</div>
                <div className="trust-badge-pill"><CheckCircle2 size={16} /> End-to-End Solutions</div>
                <div className="trust-badge-pill"><CheckCircle2 size={16} /> Transparent Documentation</div>
              </div>
            </div>
          </section>

          {/* 📞 CALL TO ACTION BANNER */}
          <section className="services-cta-banner">
            <div className="services-cta-content">
              <h2>Ready to Build Your Future?</h2>
              <p>Whether you're investing, buying property, or planning construction, 
                our experienced managing team is ready to guide you every step of the way.
              </p>
              <div className="services-cta-actions">
                <button onClick={handleWhatsApp} className="btn-cta-gold">Contact Our Team</button>
                <button onClick={() => navigate('/properties')} className="btn-cta-muted">Browse Properties</button>
              </div>
            </div>
          </section>

        </main>
      </div>
    </>
  );
};

export default Services;