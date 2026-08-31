import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    name: "Student Name",
    email: "student@example.com",
    phone: "",
    location: "",
    education: "Bachelor in Information Technology",
    skills: "HTML, CSS, JavaScript, React, MySQL",
    careerGoal: "Frontend Developer",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSaved(true);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">

        <div className="profile-header">
          <div>
            <Link to="/student/dashboard" className="back-link">
              ← Back to Dashboard
            </Link>

            <h1>My Profile</h1>
            <p>
              Manage your personal information, education and career details.
            </p>
          </div>
        </div>

        <form className="profile-card" onSubmit={handleSubmit}>

          <div className="profile-section">
            <h2>Personal Information</h2>
            <p>Update your basic personal details.</p>

            <div className="profile-grid">

              <div className="profile-field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-field">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="profile-field">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  placeholder="Enter your location"
                />
              </div>

            </div>
          </div>

          <div className="profile-section">
            <h2>Education & Career</h2>
            <p>Tell us about your education and career goals.</p>

            <div className="profile-grid">

              <div className="profile-field full-width">
                <label>Education</label>
                <input
                  type="text"
                  name="education"
                  value={profile.education}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-field full-width">
                <label>Career Goal</label>
                <select
                  name="careerGoal"
                  value={profile.careerGoal}
                  onChange={handleChange}
                >
                  <option>Frontend Developer</option>
                  <option>Full Stack Developer</option>
                  <option>Data Analyst</option>
                  <option>Software Developer</option>
                  <option>AI/ML Engineer</option>
                </select>
              </div>

              <div className="profile-field full-width">
                <label>Skills</label>
                <textarea
                  name="skills"
                  value={profile.skills}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

            </div>
          </div>

          <div className="profile-footer">
            {saved && (
              <span className="save-message">
                Profile updated successfully.
              </span>
            )}

            <button type="submit" className="save-profile-button">
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Profile;