import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import "./LearningRecommendation.css";

function LearningRecommendation() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/career/learning/"
        );
        const data = await response.json();

        if (response.ok) {
          setTopics(data);
        }
      } catch (error) {
        console.error("Failed to fetch learning topics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  return (
    <div className="learning-page">
      <main className="learning-main">
        <div className="learning-container">

          <Link to="/student/career-guidance" className="learning-back">
            <ArrowLeft size={18} />
            Back to Career Guidance
          </Link>

          <div className="learning-header">
            <div className="learning-header-icon">
              <BookOpen size={28} />
            </div>

            <div>
              <p className="learning-label">AI CAREER LEARNING</p>
              <h1>Recommended Learning</h1>
              <p>
                Personalized learning recommendations based on your current
                skills and career goal.
              </p>
            </div>
          </div>

          <div className="learning-summary">
            <div>
              <strong>{topics.length} Topics</strong>
              <span>Recommended for your growth</span>
            </div>
          </div>

          <section className="learning-section">
            <div className="section-heading">
              <div>
                <h2>What You Should Learn Next</h2>
                <p>
                  Focus on these topics to improve your career readiness.
                </p>
              </div>
            </div>

            {isLoading && (
              <p style={{ color: "#667085" }}>Loading learning topics...</p>
            )}

            {!isLoading && topics.length === 0 && (
              <p style={{ color: "#667085" }}>
                No learning topics available right now. Please check back later.
              </p>
            )}

            <div className="learning-grid">
              {topics.map((topic, index) => (
                <div className="learning-card" key={topic.id}>
                  <div className="learning-card-top">
                    <div className="learning-icon">
                      <BookOpen size={22} />
                    </div>

                    <span className="learning-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3>{topic.title}</h3>

                  <p className="learning-description">
                    {topic.description}
                  </p>

                  <div className="learning-tags">
                    {(topic.related_skills || []).map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>

                  <div className="learning-meta">
                    <span>
                      <CheckCircle size={15} />
                      {topic.level}
                    </span>

                    <span>
                      <Clock size={15} />
                      {topic.duration}
                    </span>
                  </div>

                  <button className="learning-start-btn">
                    Start Learning
                    <ExternalLink size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="learning-progress-card">
            <div>
              <h2>Keep Building Your Skills 🚀</h2>
              <p>
                Complete these learning topics and apply your knowledge by
                building practical projects.
              </p>
            </div>

            <Link to="/student/career-guidance" className="career-button">
              View Career Path
            </Link>
          </section>

        </div>
      </main>
    </div>
  );
}

export default LearningRecommendation;