import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  Sparkles,
  Briefcase,
  FileText,
  Mic,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import "../home.css";

function Home() {
  return (
    <div className="home-page">

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">

          <div className="ai-badge">
            <Sparkles size={16} />
            AI-Powered Career Platform
          </div>

          <h1>
            Build Your
            <span> Future with AI</span>
          </h1>

          <p>
            Discover better job opportunities, improve your resume,
            prepare for interviews, and get personalized career guidance
            with intelligent AI-powered tools.
          </p>

          <div className="hero-buttons">
            <Link to="/student/jobs" className="primary-btn">
              Explore Jobs
               <ArrowRight size={18} />
                </Link>

           <Link to="/student/resume" className="secondary-btn">
               Analyze Resume
                </Link>
          </div>

          {/* SEARCH */}
          <div className="job-search">
            <div className="search-input">
              <Search size={20} />
              <input
                type="text"
                placeholder="Job title, skills or keywords"
              />
            </div>

            <div className="search-location">
              <Briefcase size={20} />
              <input
                type="text"
                placeholder="Location"
              />
            </div>

           <Link to="/student/jobs" className="secondary-btn">
              Search Jobs
              </Link>
          </div>

          {/* TRUST */}
          <div className="hero-trust">
            <div>
              <CheckCircle2 size={17} />
              <span>AI Career Guidance</span>
            </div>

            <div>
              <CheckCircle2 size={17} />
              <span>Smart Job Matching</span>
            </div>

            <div>
              <CheckCircle2 size={17} />
              <span>Resume Analysis</span>
            </div>
          </div>
        </div>

        {/* HERO VISUAL */}
        <div className="hero-visual">

          <div className="ai-glow"></div>

          <div className="floating-card resume-card">
            <div className="floating-icon">
              <FileText size={21} />
            </div>

            <div>
              <strong>Resume Score</strong>
              <span>92% ATS Match</span>
            </div>

            <TrendingUp size={18} className="trend-icon" />
          </div>

          <div className="ai-circle">
            <Sparkles size={65} />
            <span>AI</span>
            <small>Career Assistant</small>
          </div>

          <div className="floating-card interview-card">
            <div className="floating-icon">
              <Mic size={21} />
            </div>

            <div>
              <strong>Interview Score</strong>
              <span>Excellent Performance</span>
            </div>

            <CheckCircle2 size={18} className="trend-icon" />
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="section-heading">
          <span>SMART TOOLS</span>

          <h2>
            Everything You Need to
            <br />
            Grow Your Career
          </h2>

          <p>
            Powerful AI tools designed to help students and job seekers
            achieve their career goals faster.
          </p>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon blue">
              <FileText />
            </div>

            <h3>AI Resume Analyzer</h3>

            <p>
              Analyze your resume, get an ATS score, discover missing
              skills and receive personalized improvement suggestions.
            </p>

            <a href="/student/resume">
              Explore Tool
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="feature-card">
            <div className="feature-icon purple">
              <Briefcase />
            </div>

            <h3>Smart Job Recommendation</h3>

            <p>
              Find job opportunities that match your skills, experience
              and career interests using intelligent recommendations.
            </p>

            <a href="/student/jobs">
              Find Jobs
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="feature-card">
            <div className="feature-icon violet">
              <Mic />
            </div>

            <h3>AI Interview Preparation</h3>

            <p>
              Practice HR, technical and coding interviews with
              AI-powered questions and performance feedback.
            </p>

            <a href="/student/interview">
              Practice Now
              <ArrowRight size={16} />
            </a>
          </div>

        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">

        <div className="stat-item">
          <h2>10K+</h2>
          <p>Students</p>
        </div>

        <div className="stat-item">
          <h2>5K+</h2>
          <p>Job Opportunities</p>
        </div>

        <div className="stat-item">
          <h2>95%</h2>
          <p>AI Accuracy</p>
        </div>

        <div className="stat-item">
          <h2>500+</h2>
          <p>Companies</p>
        </div>

      </section>
    </div>
  );
}

export default Home;