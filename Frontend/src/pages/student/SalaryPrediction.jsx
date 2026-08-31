import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SalaryPrediction.css";

function SalaryPrediction() {
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [salary, setSalary] = useState(null);

  const predictSalary = (event) => {
    event.preventDefault();

    if (!experience || !skills || !education || !jobRole) {
      alert("Please fill in all fields.");
      return;
    }

    const years = Number(experience);
    const skillCount = skills.split(",").filter((skill) => skill.trim()).length;

    let predictedSalary = 25000;

    predictedSalary += years * 8000;
    predictedSalary += skillCount * 3000;

    if (education === "Bachelor") {
      predictedSalary += 5000;
    } else if (education === "Master") {
      predictedSalary += 10000;
    }

    if (jobRole === "Frontend Developer") {
      predictedSalary += 5000;
    } else if (jobRole === "Full Stack Developer") {
      predictedSalary += 10000;
    } else if (jobRole === "Data Analyst") {
      predictedSalary += 7000;
    }

    setSalary(predictedSalary);
  };

  return (
    <div className="salary-page">
      <div className="salary-container">

        <Link to="/student/dashboard" className="salary-back">
          ← Back to Dashboard
        </Link>

        <div className="salary-header">
          <h1>Salary Prediction</h1>
          <p>
            Estimate your expected salary based on your skills,
            experience and career profile.
          </p>
        </div>

        <div className="salary-content">

          <div className="salary-card">
            <h2>Enter Your Details</h2>

            <form onSubmit={predictSalary}>

              <div className="salary-form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Example: 2"
                  value={experience}
                  onChange={(event) => setExperience(event.target.value)}
                />
              </div>

              <div className="salary-form-group">
                <label>Skills</label>
                <input
                  type="text"
                  placeholder="Example: React, JavaScript, MySQL"
                  value={skills}
                  onChange={(event) => setSkills(event.target.value)}
                />
                <small>Separate multiple skills with commas.</small>
              </div>

              <div className="salary-form-group">
                <label>Education</label>
                <select
                  value={education}
                  onChange={(event) => setEducation(event.target.value)}
                >
                  <option value="">Select Education</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="salary-form-group">
                <label>Preferred Job Role</label>
                <select
                  value={jobRole}
                  onChange={(event) => setJobRole(event.target.value)}
                >
                  <option value="">Select Job Role</option>
                  <option value="Frontend Developer">
                    Frontend Developer
                  </option>
                  <option value="Full Stack Developer">
                    Full Stack Developer
                  </option>
                  <option value="Data Analyst">
                    Data Analyst
                  </option>
                </select>
              </div>

              <button type="submit" className="salary-button">
                Predict Salary
              </button>

            </form>
          </div>

          <div className="salary-result-card">
            <h2>Estimated Salary</h2>

            {salary ? (
              <>
                <div className="salary-amount">
                  NPR {salary.toLocaleString()}
                </div>

                <p>
                  This is an estimated monthly salary based on the
                  information you provided.
                </p>

                <div className="salary-note">
                  The actual salary may vary depending on company,
                  location, skills and experience.
                </div>
              </>
            ) : (
              <div className="salary-empty">
                <strong>No prediction yet</strong>
                <p>
                  Fill in your details and click "Predict Salary"
                  to see your estimated salary.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default SalaryPrediction;