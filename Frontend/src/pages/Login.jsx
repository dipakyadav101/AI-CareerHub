import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { loginUser } from "../utils/auth";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

      const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

       const result = await loginUser({ email, password });

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    if (result.user && result.user.account_type === "company") {
      setErrorMessage(
        "Company accounts are coming soon. Please check back later."
      );
      return;
    }

    navigate("/student/dashboard");
    navigate("/student/dashboard");
  };
  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <div className="login-logo-icon">
            <Sparkles size={22} />
          </div>
          <span>AI <strong>CareerHub</strong></span>
        </div>

        <div className="login-heading">
          <h1>Welcome Back</h1>
          <p>Sign in to continue your career journey.</p>
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

        <form className="login-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email Address</label>

            <div className="input-box">
              <Mail size={19} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>

            <div className="input-box">
              <Lock size={19} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <button
                type="button"
                className="password-toggle"
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

          <div className="login-options">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              Remember me
            </label>

            <a href="#forgot">Forgot Password?</a>
          </div>

          <button type="submit" className="login-submit">
            Sign In
          </button>

        </form>

        <div className="login-divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <button
          type="button"
          className="google-signin-btn"
          onClick={() => alert("Google sign-in will be available soon.")}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C33.9 5.1 29.2 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="m6.3 14.7 6.6 4.8C14.6 15.5 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C33.9 5.1 29.2 3 24 3c-7.4 0-13.7 4.2-17 10.3z"
            />
            <path
              fill="#4CAF50"
              d="M24 43c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.6 2.3-7.2 2.3-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.9 38.7 16.4 43 24 43z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.2 5.2C40.7 36 44 30.5 44 23c0-1.3-.1-2.6-.4-3.5z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="register-text">
          Don't have an account?{" "}
          <Link to="/register">Create Account</Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>

      </div>
    </div>
  );
}

export default Login;