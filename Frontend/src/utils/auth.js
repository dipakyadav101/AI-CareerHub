import { apiRequest } from "./api";

const SESSION_KEY = "aiCareerHubSession";
const TOKEN_KEY = "aiCareerHubToken";

const USER_DATA_KEYS = [
  "aiCareerHubResume",
  "aiCareerHubResumeText",
  "aiCareerHubResumeAnalysis",
  "aiCareerHubInterviewScore",
  "aiCareerHubSavedJobs",
  "aiCareerHubCVData",
  "aiCareerHubCVTemplate",
];

const clearUserData = () => {
  USER_DATA_KEYS.forEach((key) => localStorage.removeItem(key));
};

/* ---------------------------------------------------------
 * Register a new user (calls Django backend)
 * Returns { success: boolean, message: string }
 * --------------------------------------------------------- */
export const registerUser = async ({ fullName, email, password, accountType }) => {
  try {
    const data = await apiRequest("/auth/register/", {
      method: "POST",
      body: JSON.stringify({
        full_name: fullName,
        email,
        password,
        account_type: accountType,
      }),
    });

    return {
      success: true,
      message: data.message,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Registration failed. Please try again.",
    };
  }
};

/* ---------------------------------------------------------
 * Login existing user (calls Django backend)
 * Returns { success: boolean, message: string, user? }
 * --------------------------------------------------------- */
export const loginUser = async ({ email, password }) => {
  try {
    const data = await apiRequest("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    clearUserData();

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));

    return {
      success: true,
      message: data.message,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Login failed. Please try again.",
    };
  }
};

/* ---------------------------------------------------------
 * Get current logged-in user (from local session)
 * --------------------------------------------------------- */
export const getCurrentUser = () => {
  const saved = localStorage.getItem(SESSION_KEY);

  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch (error) {
    return null;
  }
};

/* ---------------------------------------------------------
 * Logout current user
 * --------------------------------------------------------- */
export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TOKEN_KEY);
  clearUserData();
};