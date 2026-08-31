const API_BASE_URL = "http://127.0.0.1:8000/api";

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("aiCareerHubToken");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

export default API_BASE_URL;