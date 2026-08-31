import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/student/Dashboard";
import VoiceInterview from "../pages/student/VoiceInterview";
import JobRecommendation from "../pages/student/JobRecommendation";
import JobDetails from "../pages/student/JobDetails";
import ResumeAnalyzer from "../pages/student/ResumeAnalyzer";
import CareerGuidance from "../pages/student/CareerGuidance";
import LearningRecommendation from "../pages/student/LearningRecommendation";
import SalaryPrediction from "../pages/student/SalaryPrediction";
import MyApplications from "../pages/student/MyApplications";
import SavedJobs from "../pages/student/SavedJobs";
import Settings from "../pages/student/Settings";

import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/jobs/:id"
        element={
          <ProtectedRoute>
            <JobDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/jobs"
        element={
          <ProtectedRoute>
            <JobRecommendation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/interview"
        element={
          <ProtectedRoute>
            <VoiceInterview />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/resume"
        element={
          <ProtectedRoute>
            <ResumeAnalyzer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/career-guidance"
        element={
          <ProtectedRoute>
            <CareerGuidance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/learning"
        element={
          <ProtectedRoute>
            <LearningRecommendation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/salary-prediction"
        element={
          <ProtectedRoute>
            <SalaryPrediction />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/applications"
        element={
          <ProtectedRoute>
            <MyApplications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/saved-jobs"
        element={
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;