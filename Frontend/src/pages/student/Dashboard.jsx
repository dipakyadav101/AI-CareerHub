import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Briefcase,
  FileText,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Search,
  BookOpen,
  Target,
  Video,
} from "lucide-react";
import "./Dashboard.css";
import Sidebar from "../../components/Sidebar";

function Dashboard() {
  const [interviewScore, setInterviewScore] = useState(
    localStorage.getItem("aiCareerHubInterviewScore") || "85"
  );

  const [resumeScore, setResumeScore] = useState(null);

  useEffect(() => {
    const updateScore = () => {
      const savedScore = localStorage.getItem(
        "aiCareerHubInterviewScore"
      );

      setInterviewScore(savedScore || "85");

      const savedAnalysis = localStorage.getItem(
        "aiCareerHubResumeAnalysis"
      );

      if (savedAnalysis) {
        try {
          const parsedAnalysis = JSON.parse(savedAnalysis);
          setResumeScore(parsedAnalysis.score);
        } catch (error) {
          console.error("Unable to read resume analysis:", error);
        }
      } else {
        setResumeScore(null);
      }
    };

    updateScore();

    window.addEventListener("storage", updateScore);
    window.addEventListener("pageshow", updateScore);

    return () => {
      window.removeEventListener("storage", updateScore);
      window.removeEventListener("pageshow", updateScore);
    };
  }, []);

  const hasResume = resumeScore !== null;
  const hasInterviewResult =
    localStorage.getItem("aiCareerHubInterviewScore") !== null;

  const careerProgress =
    Math.round(
      ((hasResume ? Number(resumeScore) : 0) +
        (hasInterviewResult ? Number(interviewScore) : 0)) /
        (hasResume && hasInterviewResult
          ? 2
          : hasResume || hasInterviewResult
          ? 1
          : 1)
    ) || 0;

  const stats = [
       {
      title: "Resume Score",
      value: hasResume ? `${resumeScore}%` : "Not analyzed",
      icon: FileText,
      link: "/student/resume",
    },
    {
      title: "Recommended Jobs",
      value: "12",
      icon: Briefcase,
      link: "/student/jobs",
    },
    {
      title: "Interview Score",
      value: hasInterviewResult ? `${interviewScore}%` : "Not attempted",
      icon: MessageSquare,
      link: "/student/interview",
    },
    {
      title: "Career Progress",
      value: `${careerProgress}%`,
      icon: TrendingUp,
      link: "/student/career-guidance",
    },
  ];

  return (
    <div className="student-dashboard">
      <Sidebar />

      <main className="dashboard-main">
        <div className="dashboard-container">

          {/* Dashboard Header */}
          <div className="dashboard-header">
            <div>
              <p className="dashboard-greeting">Welcome back 👋</p>
              <h1>Student Dashboard</h1>
              <p className="dashboard-subtitle">
                Track your career progress and discover your next opportunity.
              </p>
            </div>

            <Link to="/student/jobs" className="dashboard-primary-btn">
              <Search size={18} />
              Find Jobs
            </Link>
          </div>

          {/* Statistics */}
          <div className="dashboard-stats">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Link
                  to={stat.link}
                  className="dashboard-stat-card"
                  key={stat.title}
                >
                  <div className="stat-icon">
                    <Icon size={22} />
                  </div>

                  <div className="stat-content">
                    <p>{stat.title}</p>
                    <h2>{stat.value}</h2>
                  </div>

                  <ArrowRight size={18} className="stat-arrow" />
                </Link>
              );
            })}
          </div>

          {/* Career Progress + Quick Actions */}
          <div className="dashboard-grid">

            {/* Career Progress */}
            <div className="dashboard-card career-progress-card">
              <div className="card-heading">
                <div>
                  <h2>Career Progress</h2>
                  <p>Your overall career development progress</p>
                </div>

                <Target size={22} />
              </div>

              <div className="progress-section">
                <div className="progress-circle">
                  <span>{careerProgress}%</span>
                </div>

                <div className="progress-info">
                  <h3>
                    {careerProgress >= 70
                      ? "Good Progress!"
                      : careerProgress >= 40
                      ? "Keep Going!"
                      : "Just Getting Started"}
                  </h3>

                  <p>
                    Complete your profile, improve your resume and practice
                    interviews to increase your score.
                  </p>

                  <Link to="/student/career-guidance">
                    Continue Development <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card quick-actions-card">
              <div className="card-heading">
                <div>
                  <h2>Quick Actions</h2>
                  <p>Continue your career journey</p>
                </div>

                <BookOpen size={22} />
              </div>

              <div className="quick-actions">

                               <Link to="/student/resume">
                  <FileText size={20} />
                  <span>Analyze Resume</span>
                  <ArrowRight size={16} />
                </Link>

                <Link to="/student/jobs">
                  <Briefcase size={20} />
                  <span>Explore Jobs</span>
                  <ArrowRight size={16} />
                </Link>

                <Link to="/student/interview">
                  <MessageSquare size={20} />
                  <span>Practice Interview</span>
                  <ArrowRight size={16} />
                </Link>

              </div>
            </div>
          </div>

          {/* AI Interview */}
          <div className="ai-interview-card">
            <div className="ai-interview-content">

              <div className="ai-interview-title">
                <Video size={22} />
                <h2>AI Interview</h2>
              </div>

              <p className="ai-interview-description">
                Practice a real interview with our AI interviewer.
                Answer questions, improve your communication, and get
                instant AI-powered feedback and interview scores.
              </p>

              <div className="ai-interview-types">
                <span className="ai-interview-type">Technical</span>
                <span className="ai-interview-type">HR</span>
                <span className="ai-interview-type">Behavioral</span>
              </div>

              <Link
                to="/student/interview"
                className="ai-interview-button"
              >
                <MessageSquare size={18} />
                Start AI Interview
                <ArrowRight size={16} />
              </Link>

            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="dashboard-card recommended-card">

            <div className="card-heading">
              <div>
                <h2>Recommended for You</h2>
                <p>
                  AI-powered suggestions based on your career profile
                </p>
              </div>

              <Link to="/student/jobs">
                View All <ArrowRight size={16} />
              </Link>
            </div>

            <div className="recommendation-list">

              <div className="recommendation-item">
                <div className="recommendation-icon">
                  <Briefcase size={21} />
                </div>

                <div>
                  <h3>Frontend Developer</h3>
                  <p>React • JavaScript • CSS</p>
                </div>

                <span className="match-badge">
                  92% Match
                </span>
              </div>

              <div className="recommendation-item">
                <div className="recommendation-icon">
                  <Briefcase size={21} />
                </div>

                <div>
                  <h3>Junior Software Developer</h3>
                  <p>Java • Python • MySQL</p>
                </div>

                <span className="match-badge">
                  87% Match
                </span>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Dashboard;