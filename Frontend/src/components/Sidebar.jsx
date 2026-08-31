import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  GraduationCap,
  DollarSign,
  Compass,
  Bookmark,
  Settings,
  LogOut,
} from "lucide-react";
import { logoutUser } from "../utils/auth";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">AI</div>
        <div>
          <h2>CareerHub</h2>
          <span>Student Portal</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="menu-title">MAIN MENU</p>

        <a href="/student/dashboard" className="sidebar-link active">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </a>

        <a href="/student/jobs" className="sidebar-link">
          <Briefcase size={20} />
          <span>Job Recommendations</span>
        </a>

        <a href="/student/applications" className="sidebar-link">
          <FileText size={20} />
          <span>My Applications</span>
        </a>

        <a href="/student/saved-jobs" className="sidebar-link">
          <Bookmark size={20} />
          <span>Saved Jobs</span>
        </a>

        <p className="menu-title">AI CAREER TOOLS</p>

        <a href="/student/resume" className="sidebar-link">
          <FileText size={20} />
          <span>Resume Analyzer</span>
        </a>

        <a href="/student/interview" className="sidebar-link">
          <MessageSquare size={20} />
          <span>Interview Prep</span>
        </a>

        <a href="/student/career-guidance" className="sidebar-link">
          <Compass size={20} />
          <span>Career Guidance</span>
        </a>

        <a href="/student/learning" className="sidebar-link">
          <GraduationCap size={20} />
          <span>Learning</span>
        </a>

        <a href="/student/salary-prediction" className="sidebar-link">
          <DollarSign size={20} />
          <span>Salary Prediction</span>
        </a>
      </nav>

      <div className="sidebar-bottom">
        <a href="/student/settings" className="sidebar-link">
          <Settings size={20} />
          <span>Settings</span>
        </a>

        <button
          className="sidebar-link logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;