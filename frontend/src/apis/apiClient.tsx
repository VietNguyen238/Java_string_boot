import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.error("Unauthorized");
      } else if (status === 403) {
        console.error(
          "Forbidden: You do not have permission to access this resource."
        );
        alert("Please login to continue!");

        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
