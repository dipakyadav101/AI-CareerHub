import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [showMatch, setShowMatch] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/jobs/${id}/`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Job not found.");
        }

        setJob(data);
      } catch (error) {
        console.error("Failed to fetch job:", error);
        setErrorMessage("Job not found.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (isLoading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (errorMessage || !job) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Job not found</h2>
        <Link to="/student/jobs" style={{ color: "#5b4bdb" }}>
          ← Back to Job Recommendations
        </Link>
      </div>
    );
  }

  /* -----------------------------------------------------------
   * Calculate resume match against this job's required skills
   * ----------------------------------------------------------- */
  const calculateMatch = () => {
    const savedResumeText =
      localStorage.getItem("aiCareerHubResumeText") || "";

    const savedAnalysis = localStorage.getItem("aiCareerHubResumeAnalysis");

    if (!savedResumeText.trim()) {
      alert("Please upload and analyze your resume first.");
      navigate("/student/resume");
      return;
    }

    let foundSkills = [];

    if (savedAnalysis) {
      try {
        const parsedAnalysis = JSON.parse(savedAnalysis);
        foundSkills = parsedAnalysis.foundSkills || [];
      } catch (error) {
        console.error("Unable to read resume analysis:", error);
      }
    }

    const resumeTextLower = savedResumeText.toLowerCase();
    const foundSkillsLower = foundSkills.map((skill) =>
      skill.toLowerCase()
    );

    const matchedSkills = [];
    const missingSkills = [];

    (job.skills || []).forEach((skill) => {
      const skillLower = skill.toLowerCase();

      const isMatch =
        foundSkillsLower.includes(skillLower) ||
        resumeTextLower.includes(skillLower);

      if (isMatch) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    const totalSkills = (job.skills || []).length || 1;
    const matchPercent = Math.round(
      (matchedSkills.length / totalSkills) * 100
    );

    setMatchResult({
      matchPercent,
      matchedSkills,
      missingSkills,
    });

    setShowMatch(true);
  };

  /* -----------------------------------------------------------
   * Confirm application - send to backend
   * ----------------------------------------------------------- */
  const confirmApply = async () => {
    setApplyError("");

    const token = localStorage.getItem("aiCareerHubToken");

    if (!token) {
      alert("Please login to apply for this job.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/jobs/${id}/apply/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({
            match_percent: matchResult ? matchResult.matchPercent : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setApplyError(data.message || "Unable to apply. Please try again.");
        return;
      }

      setAlreadyApplied(true);
      setShowMatch(false);

      navigate("/student/applications");
    } catch (error) {
      console.error("Failed to apply:", error);
      setApplyError("Unable to apply. Please try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f8fc",
        padding: "32px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Link
          to="/student/jobs"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#5b4bdb",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={18} />
          Back to Job Recommendations
        </Link>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #eaecf0",
            borderRadius: "18px",
            padding: "28px",
            marginTop: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "14px",
                background: "#f0edff",
                color: "#5b4bdb",
                flexShrink: 0,
              }}
            >
              <Briefcase size={26} />
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ margin: "0 0 6px", color: "#101828" }}>
                {job.title}
              </h1>

              <p style={{ margin: "0 0 10px", color: "#667085", fontSize: "16px" }}>
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
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <MapPin size={14} /> {job.location}
                </span>

                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Clock size={14} /> {job.job_type}
                </span>

                {job.salary && <span>{job.salary}</span>}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "18px",
            }}
          >
            {(job.skills || []).map((skill) => (
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

          {job.description && (
            <div style={{ marginTop: "28px" }}>
              <h2 style={{ fontSize: "17px", color: "#101828" }}>
                Job Description
              </h2>
              <p style={{ color: "#475467", lineHeight: 1.6 }}>
                {job.description}
              </p>
            </div>
          )}

          {job.responsibilities && job.responsibilities.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              <h2 style={{ fontSize: "17px", color: "#101828" }}>
                Responsibilities
              </h2>
              <ul style={{ color: "#475467", lineHeight: 1.8, paddingLeft: "20px" }}>
                {job.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              <h2 style={{ fontSize: "17px", color: "#101828" }}>
                Requirements
              </h2>
              <ul style={{ color: "#475467", lineHeight: 1.8, paddingLeft: "20px" }}>
                {job.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {applyError && (
            <p style={{ color: "#b42318", marginTop: "16px" }}>
              {applyError}
            </p>
          )}

          {/* Match Result */}
          {showMatch && matchResult && (
            <div
              style={{
                marginTop: "28px",
                background: "#f7f6ff",
                border: "1px solid #e0d9ff",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "#5b4bdb",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "16px",
                    flexShrink: 0,
                  }}
                >
                  {matchResult.matchPercent}%
                </div>

                <div>
                  <h3 style={{ margin: "0 0 4px", color: "#101828" }}>
                    Resume Match Score
                  </h3>
                  <p style={{ margin: 0, color: "#667085", fontSize: "13px" }}>
                    Based on the skills required for this job.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginTop: "18px",
                }}
              >
                <div>
                  <p style={{ fontWeight: 700, color: "#027a48", fontSize: "13px" }}>
                    Matched Skills
                  </p>
                  {matchResult.matchedSkills.length > 0 ? (
                    matchResult.matchedSkills.map((skill) => (
                      <div
                        key={skill}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#344054",
                          fontSize: "13px",
                          marginBottom: "4px",
                        }}
                      >
                        <CheckCircle size={14} color="#027a48" />
                        {skill}
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: "13px", color: "#98a2b3" }}>None</p>
                  )}
                </div>

                <div>
                  <p style={{ fontWeight: 700, color: "#b42318", fontSize: "13px" }}>
                    Missing Skills
                  </p>
                  {matchResult.missingSkills.length > 0 ? (
                    matchResult.missingSkills.map((skill) => (
                      <div
                        key={skill}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#344054",
                          fontSize: "13px",
                          marginBottom: "4px",
                        }}
                      >
                        <XCircle size={14} color="#b42318" />
                        {skill}
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: "13px", color: "#98a2b3" }}>None</p>
                  )}
                </div>
              </div>

              <button
                onClick={confirmApply}
                style={{
                  marginTop: "18px",
                  width: "100%",
                  border: "none",
                  background: "#5b4bdb",
                  color: "#ffffff",
                  borderRadius: "10px",
                  padding: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Confirm Application
              </button>
            </div>
          )}

          {/* Apply button */}
          {!showMatch && (
            <div style={{ marginTop: "28px" }}>
              {alreadyApplied ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#027a48",
                    fontWeight: 700,
                    background: "#ecfdf3",
                    padding: "12px 16px",
                    borderRadius: "10px",
                  }}
                >
                  <CheckCircle size={18} />
                  You have already applied to this job.
                </div>
              ) : (
                <button
                  onClick={calculateMatch}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                    border: "none",
                    background: "#5b4bdb",
                    color: "#ffffff",
                    borderRadius: "10px",
                    padding: "13px",
                    fontWeight: 700,
                    fontSize: "15px",
                    cursor: "pointer",
                  }}
                >
                  <FileText size={18} />
                  Apply Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDetails;