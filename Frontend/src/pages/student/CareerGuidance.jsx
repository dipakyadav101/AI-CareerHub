import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Target,
  Brain,
  TrendingUp,
  BookOpen,
  Briefcase,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import "./CareerGuidance.css";

function CareerGuidance() {
  const [goal, setGoal] = useState("");
  const [careerPaths, setCareerPaths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCareerPaths = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/career/paths/"
        );
        const data = await response.json();

        if (response.ok) {
          setCareerPaths(data);

          if (data.length > 0) {
            setGoal(data[0].title);
          }
        }
      } catch (error) {
        console.error("Failed to fetch career paths:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCareerPaths();
  }, []);

  const selectedPath = careerPaths.find((path) => path.title === goal);

  return (
    <div className="career-guidance-page">
      <div className="career-guidance-container">

        <Link to="/student/dashboard" className="career-back-link">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="career-header">
          <div>
            <span className="career-label">AI CAREER GUIDANCE</span>

            <h1>Build Your Career Path</h1>

            <p>
              Get personalized career guidance based on your skills,
              interests and career goals.
            </p>
          </div>

          <div className="career-header-icon">
            <Brain size={30} />
          </div>
        </div>

        {isLoading && (
          <p style={{ color: "#667085" }}>Loading career paths...</p>
        )}

        {!isLoading && careerPaths.length === 0 && (
          <p style={{ color: "#667085" }}>
            No career paths available right now. Please check back later.
          </p>
        )}

        {!isLoading && careerPaths.length > 0 && (
          <>
            {/* Goal Selection */}
            <div className="career-card goal-card">
              <div className="career-card-heading">
                <div className="heading-icon">
                  <Target size={21} />
                </div>

                <div>
                  <h2>Your Career Goal</h2>
                  <p>Select the career path you want to focus on.</p>
                </div>
              </div>

              <div className="goal-options">
                {careerPaths.map((path) => (
                  <button
                    key={path.id}
                    className={
                      goal === path.title
                        ? "goal-option active"
                        : "goal-option"
                    }
                    onClick={() => setGoal(path.title)}
                  >
                    <span>{path.title}</span>

                    {goal === path.title && (
                      <CheckCircle size={18} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="ai-career-card">
              <div className="ai-career-icon">
                <Sparkles size={25} />
              </div>

              <div className="ai-career-content">
                <span>AI RECOMMENDATION</span>

                <h2>Your recommended path: {goal}</h2>

                <p>
                  {selectedPath?.description ||
                    `Based on your current skills and career progress, you are well suited for the ${goal} career path. Continue improving your technical skills and build practical projects to become job ready.`}
                </p>

                <div className="ai-career-actions">
                  <Link to="/student/jobs">
                    Explore Jobs
                    <ArrowRight size={16} />
                  </Link>

                  <Link to="/student/learning">
                    View Learning
                    <BookOpen size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Required Skills for selected path */}
            {selectedPath && (
              <div className="career-card">
                <div className="career-card-heading">
                  <div className="heading-icon">
                    <TrendingUp size={21} />
                  </div>

                  <div>
                    <h2>Required Skills</h2>
                    <p>Key skills for the {selectedPath.title} path</p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginTop: "10px",
                  }}
                >
                  {(selectedPath.required_skills || []).map((skill) => (
                    <span
                      key={skill}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        background: "#f7f8fc",
                        border: "1px solid #eaecf0",
                        fontSize: "13px",
                        color: "#344054",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {selectedPath.salary_range && (
                  <p style={{ marginTop: "16px", color: "#667085", fontSize: "14px" }}>
                    <strong>Salary range:</strong> {selectedPath.salary_range}
                  </p>
                )}
              </div>
            )}

            {/* Career Paths */}
            <div className="career-section-heading">
              <div>
                <h2>Career Paths For You</h2>
                <p>Explore careers that match your current profile.</p>
              </div>
            </div>

            <div className="career-path-grid">
              {careerPaths.map((path) => (
                <div className="career-path-card" key={path.id}>
                  <div className="career-path-top">
                    <div className="career-path-icon">
                      <Briefcase size={21} />
                    </div>
                  </div>

                  <h3>{path.title}</h3>

                  <p>{path.description}</p>

                  <div className="career-skills">
                    {(path.required_skills || []).map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>

                  <Link to="/student/jobs">
                    View Jobs
                    <Briefcase size={16} />
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default CareerGuidance;