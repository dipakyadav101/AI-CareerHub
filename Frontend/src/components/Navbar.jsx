import React from "react";
import {
  Sparkles,
  Briefcase,
  FileText,
  MessageSquare,
  LogIn,
  UserPlus,
} from "lucide-react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <a href="/" className="navbar-logo">
          <div className="logo-icon">
            <Sparkles size={20} />
          </div>

          <div className="logo-text">
            <strong>AI Career</strong>
            <span>Hub</span>
          </div>
        </a>

        {/* Navigation */}
        <div className="navbar-links">
          <a href="/">
            Home
          </a>

          <a href="/jobs">
            <Briefcase size={17} />
            Jobs
          </a>

          <a href="/resume-analyzer">
            <FileText size={17} />
            Resume
          </a>

          <a href="/interview">
            <MessageSquare size={17} />
            Interview
          </a>
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          <a href="/login" className="login-btn">
            <LogIn size={17} />
            Login
          </a>

          <a href="/register" className="register-btn">
            <UserPlus size={17} />
            Get Started
          </a>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;