import axios from "axios";

// Tự động gắn JWT token vào mọi request
axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.token) {
      config.headers["Authorization"] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Tự động logout khi token hết hạn (401)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      const currentPath = window.location.pathname;
      if (currentPath !== "/" && currentPath !== "/login") {
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axios;