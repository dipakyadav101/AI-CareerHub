import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  Search,
  Bookmark,
} from "lucide-react";

function JobRecommendation() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedJobIds, setSavedJobIds] = useState(() => {
    const saved = localStorage.getItem("aiCareerHubSavedJobs");
    if (!saved) return [];
    try {
      return JSON.parse(saved).map((job) => job.id);
    } catch (error) {
      return [];
    }
  });

  const toggleSaveJob = (job) => {
    const saved = localStorage.getItem("aiCareerHubSavedJobs");
    let savedJobs = [];

    if (saved) {
      try {
        savedJobs = JSON.parse(saved);
      } catch (error) {
        savedJobs = [];
      }
    }

    const isAlreadySaved = savedJobs.some((item) => item.id === job.id);

    let updatedJobs;

    if (isAlreadySaved) {
      updatedJobs = savedJobs.filter((item) => item.id !== job.id);
    } else {
      updatedJobs = [...savedJobs, job];
    }

    localStorage.setItem("aiCareerHubSavedJobs", JSON.stringify(updatedJobs));
    setSavedJobIds(updatedJobs.map((item) => item.id));
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/jobs/");
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Unable to load jobs.");
        }

        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setErrorMessage("Unable to load jobs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f8fc",
        padding: "32px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Link
          to="/student/dashboard"
          style={{
            color: "#5b4bdb",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Back to Dashboard
        </Link>

        <div style={{ marginTop: "24px", marginBottom: "28px" }}>
          <h1 style={{ margin: 0, color: "#101828" }}>
            Job Recommendations
          </h1>

          <p style={{ color: "#667085" }}>
            Find job opportunities that match your skills and career interests.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "24px",
            background: "#ffffff",
            padding: "16px",
            borderRadius: "14px",
            border: "1px solid #eaecf0",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              border: "1px solid #d0d5dd",
              borderRadius: "10px",
              padding: "0 14px",
            }}
          >
            <Search size={18} color="#667085" />

            <input
              type="text"
              placeholder="Search jobs or skills..."
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                padding: "12px 0",
                fontSize: "14px",
              }}
            />
          </div>

          <button
            style={{
              border: "none",
              borderRadius: "10px",
              padding: "0 22px",
              background: "#5b4bdb",
              color: "#ffffff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>

        {isLoading && (
          <p style={{ color: "#667085" }}>Loading jobs...</p>
        )}

        {errorMessage && (
          <p style={{ color: "#b42318" }}>{errorMessage}</p>
        )}

        {!isLoading && !errorMessage && jobs.length === 0 && (
          <p style={{ color: "#667085" }}>
            No jobs available right now. Please check back later.
          </p>
        )}

        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          {jobs.map((job) => (
            <div
              key={job.id}
              style={{
                background: "#ffffff",
                border: "1px solid #eaecf0",
                borderRadius: "16px",
                padding: "22px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                    background: "#f0edff",
                    color: "#5b4bdb",
                  }}
                >
                  <Briefcase size={23} />
                </div>

                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      margin: "0 0 5px",
                      color: "#101828",
                      fontSize: "18px",
                    }}
                  >
                    {job.title}
                  </h2>

                  <p
                    style={{
                      margin: "0 0 12px",
                      color: "#667085",
                    }}
                  >
                    {job.company}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "16px",
                      color: "#667085",
                      fontSize: "13px",
                    }}
                  >
                    <span>
                      <MapPin size={14} /> {job.location}
                    </span>

                    <span>
                      <Clock size={14} /> {job.job_type}
                    </span>

                    <span>{(job.skills || []).join(" • ")}</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "18px",
                }}
              >
               v

                <Link
                  to={`/student/jobs/${job.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    border: "none",
                    background: "#5b4bdb",
                    color: "#ffffff",
                    borderRadius: "9px",
                    padding: "9px 15px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                >
                  View Job
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobRecommendation;