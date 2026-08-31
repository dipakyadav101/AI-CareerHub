import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Settings.css";

function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    jobAlerts: true,
    interviewReminders: true,
    profileVisibility: true,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, checked } = event.target;

    setSettings((previous) => ({
      ...previous,
      [name]: checked,
    }));

    setSaved(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    setSaved(true);
  };

  return (
    <div className="settings-page">
      <div className="settings-container">

        <div className="settings-header">
          <div>
            <Link to="/student/dashboard" className="settings-back-link">
              ← Back to Dashboard
            </Link>

            <h1>Settings</h1>
            <p>
              Manage your account preferences and notification settings.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave}>

          <div className="settings-card">
            <div className="settings-card-header">
              <h2>Notifications</h2>
              <p>Choose which notifications you want to receive.</p>
            </div>

            <div className="settings-option">
              <div>
                <h3>Email Notifications</h3>
                <p>Receive important updates through email.</p>
              </div>

              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
              />
            </div>

            <div className="settings-option">
              <div>
                <h3>Job Alerts</h3>
                <p>Get notified about new job opportunities.</p>
              </div>

              <input
                type="checkbox"
                name="jobAlerts"
                checked={settings.jobAlerts}
                onChange={handleChange}
              />
            </div>

            <div className="settings-option">
              <div>
                <h3>Interview Reminders</h3>
                <p>Receive reminders for interview practice.</p>
              </div>

              <input
                type="checkbox"
                name="interviewReminders"
                checked={settings.interviewReminders}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-header">
              <h2>Privacy</h2>
              <p>Control how your profile is shown.</p>
            </div>

            <div className="settings-option">
              <div>
                <h3>Profile Visibility</h3>
                <p>Allow companies to view your career profile.</p>
              </div>

              <input
                type="checkbox"
                name="profileVisibility"
                checked={settings.profileVisibility}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="settings-footer">
            {saved && (
              <span className="settings-success">
                Settings saved successfully.
              </span>
            )}

            <button type="submit" className="settings-save-button">
              Save Settings
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default Settings;