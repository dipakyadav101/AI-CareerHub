import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import "./SavedJobs.css";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = () => {
    const saved = localStorage.getItem("aiCareerHubSavedJobs");

    if (saved) {
      try {
        setSavedJobs(JSON.parse(saved));
      } catch (error) {
        console.error("Unable to read saved jobs:", error);
        setSavedJobs([]);
      }
    }
  };

  const removeJob = (jobId) => {
    const updatedJobs = savedJobs.filter((job) => job.id !== jobId);
    localStorage.setItem("aiCareerHubSavedJobs", JSON.stringify(updatedJobs));
    setSavedJobs(updatedJobs);
  };

  return (
    <div className="saved-jobs-page">
      <Sidebar />
      <main className="saved-jobs-main">
        <div className="saved-jobs-container">
          <div className="saved-jobs-header">
            <div>
              <p className="saved-jobs-label">JOB SEARCH</p>
              <h1>Saved Jobs</h1>
              <p>
                Keep track of the job opportunities you want to apply for.
              </p>
            </div>
            <Link to="/student/jobs" className="saved-jobs-button">
              Find More Jobs
            </Link>
          </div>
          <div className="saved-jobs-card">
            <div className="saved-jobs-card-header">
              <div>
                <h2>Your Saved Jobs</h2>
                <p>{savedJobs.length} jobs saved</p>
              </div>
            </div>

            {savedJobs.length === 0 ? (
              <div
                style={{
                  padding: "40px 20px",
                  textAlign: "center",
                  color: "#667085",
                }}
              >
                You haven't saved any jobs yet.{" "}
                <Link to="/student/jobs" style={{ color: "#5b4bdb" }}>
                  Browse jobs
                </Link>{" "}
                and save the ones you're interested in.
              </div>
            ) : (
              <div className="saved-jobs-list">
                {savedJobs.map((job) => (
                  <div className="saved-job-item" key={job.id}>
                    <div className="saved-job-info">
                      <h3>{job.title}</h3>
                      <p className="saved-job-company">{job.company}</p>
                      <p className="saved-job-details">
                        {job.location} • {job.job_type}
                      </p>
                      <div className="saved-job-skills">
                        {(job.skills || []).join(", ")}
                      </div>
                    </div>
                    <div className="saved-job-actions">
                      <Link
                        to={`/student/jobs/${job.id}`}
                        className="view-job-button"
                      >
                        View Job
                      </Link>
                      <button
                        className="remove-job-button"
                        type="button"
                        onClick={() => removeJob(job.id)}
                      >
                        Remove
                      </button>
                    </div>
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

export default SavedJobs;