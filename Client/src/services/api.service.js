import axios from "axios";

const API_URL = "http://localhost:5000";

export default (baseURL) => {
  const instance = axios.create({
    baseURL: API_URL + baseURL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Interceptor để tự động thêm token vào mọi request
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor để xử lý response
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Nếu token hết hạn hoặc không hợp lệ
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
