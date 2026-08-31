import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  GraduationCap,
  Building2,
} from "lucide-react";
import { registerUser } from "../utils/auth";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accountType, setAccountType] = useState("student");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

   const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage("Please agree to the Terms & Conditions.");
      return;
    }

    const result = await registerUser({
      fullName,
      email,
      password,
      accountType,
    });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    navigate("/login");
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-logo">
          <div className="register-logo-icon">
            <Sparkles size={22} />
          </div>

          <span>
            AI <strong>CareerHub</strong>
          </span>
        </div>

        <div className="register-heading">
          <h1>Create Your Account</h1>
          <p>Start building your career with AI.</p>
        </div>

        {errorMessage && (
          <div
            style={{
              marginBottom: "18px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: "#fef3f2",
              color: "#b42318",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {errorMessage}
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="register-group">
            <label>Full Name</label>

            <div className="register-input">
              <User size={19} />

              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className="register-group">
            <label>Email Address</label>

            <div className="register-input">
              <Mail size={19} />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          {/* Account Type */}
          <div className="register-group">
            <label>Account Type</label>

            <div className="account-types">

              <button
                type="button"
                className={`account-type ${
                  accountType === "student" ? "selected" : ""
                }`}
                onClick={() => setAccountType("student")}
              >
                <GraduationCap size={20} />
                <span>Student</span>
              </button>

              <button
                type="button"
                className={`account-type ${
                  accountType === "company" ? "selected" : ""
                }`}
                onClick={() => setAccountType("company")}
              >
                <Building2 size={20} />
                <span>Company</span>
              </button>

            </div>
          </div>

          {/* Password */}
          <div className="register-group">
            <label>Password</label>

            <div className="register-input">
              <Lock size={19} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <button
                type="button"
                className="register-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="register-group">
            <label>Confirm Password</label>

            <div className="register-input">
              <Lock size={19} />

              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />

              <button
                type="button"
                className="register-eye"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="terms">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(event) => setAgreedToTerms(event.target.checked)}
            />

            <span>
              I agree to the{" "}
              <a href="#terms">Terms & Conditions</a>
            </span>
          </label>

          <button
            type="submit"
            className="register-submit"
          >
            Create Account
          </button>

        </form>

        <p className="login-link">
          Already have an account?{" "}
          <Link to="/login">Sign In</Link>
        </p>

        <Link to="/" className="register-back">
          ← Back to Home
        </Link>

      </div>
    </div>
  );
}

export default Register;