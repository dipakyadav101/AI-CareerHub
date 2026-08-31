import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import "./MyApplications.css";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("aiCareerHubToken");

        const response = await fetch(
          "http://127.0.0.1:8000/api/jobs/applications/my/",
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error("Unable to load applications.");
        }

        setApplications(data);
      } catch (error) {
        console.error("Failed to fetch applications:", error);
        setErrorMessage("Unable to load applications. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const underReviewCount = applications.filter(
    (application) => application.status === "Under Review"
  ).length;

  const shortlistedCount = applications.filter(
    (application) => application.status === "Shortlisted"
  ).length;

  return (
    <div className="applications-page">
      <Sidebar />

      <main className="applications-main">
        <div className="applications-container">
          <div className="applications-header">
            <div>
              <p className="applications-label">JOB APPLICATIONS</p>
              <h1>My Applications</h1>
              <p>
                Track the jobs you have applied for and check your application
                status.
              </p>
            </div>

            <Link to="/student/jobs" className="browse-jobs-btn">
              Browse Jobs
            </Link>
          </div>

          <div className="applications-summary">
            <div>
              <span>Total Applications</span>
              <strong>{applications.length}</strong>
            </div>

            <div>
              <span>Under Review</span>
              <strong>{underReviewCount}</strong>
            </div>

            <div>
              <span>Shortlisted</span>
              <strong>{shortlistedCount}</strong>
            </div>
          </div>

          <div className="applications-card">
            <div className="applications-card-header">
              <div>
                <h2>Application History</h2>
                <p>Your recent job applications</p>
              </div>
            </div>

            {isLoading && (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#667085" }}>
                Loading applications...
              </div>
            )}

            {errorMessage && (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#b42318" }}>
                {errorMessage}
              </div>
            )}

            {!isLoading && !errorMessage && applications.length === 0 && (
              <div
                style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  color: "#667085",
                }}
              >
                You haven't applied to any jobs yet.{" "}
                <Link to="/student/jobs" style={{ color: "#5b4bdb" }}>
                  Browse jobs
                </Link>{" "}
                to get started.
              </div>
            )}

            {!isLoading && !errorMessage && applications.length > 0 && (
              <div className="applications-list">
                {applications.map((application) => (
                  <div className="application-item" key={application.id}>
                    <div className="application-info">
                      <h3>{application.job_title}</h3>
                      <p>{application.company}</p>
                      <span>
                        {application.location} • Applied{" "}
                        {new Date(application.applied_at).toLocaleDateString(
                          "en-GB",
                          { day: "2-digit", month: "short", year: "numeric" }
                        )}
                        {application.match_percent !== null &&
                          application.match_percent !== undefined &&
                          ` • ${application.match_percent}% Match`}
                      </span>
                    </div>

                    <span
                      className={`application-status ${application.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {application.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyApplications;