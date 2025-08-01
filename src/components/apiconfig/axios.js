import axios from "axios";

const API_BASE_URL = "http://localhost:8000/"; 

//http://localhost:8000/

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error is due to token expiration
    if (error.response?.status === 401) {
      const errorData = error.response.data;
      
      // Check for specific token expiration messages
      const isTokenExpired = 
        errorData?.detail === "Given token not valid for any token type" ||
        errorData?.code === "token_not_valid" ||
        errorData?.detail?.includes("token") ||
        errorData?.detail?.includes("expired") ||
        errorData?.detail?.includes("invalid");

      if (isTokenExpired) {
        // Clear all auth data
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        localStorage.removeItem("user_data");
        localStorage.removeItem("admin_data");
        localStorage.removeItem("hr_data");

        // Dispatch a custom event to trigger the token expired alert
        const tokenExpiredEvent = new CustomEvent("tokenExpired", {
          detail: { message: "Your session has expired. Please sign in again." }
        });
        window.dispatchEvent(tokenExpiredEvent);

        // Log the error for debugging
        console.error("Unauthorized access - token might be expired", error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;