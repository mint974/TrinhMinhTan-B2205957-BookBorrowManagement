import createApiClient from "./api.service";

const API_URL = "http://localhost:5000";

class AuthService {
  constructor(baseUrl = "/api/docgia") {
    this.api = createApiClient(API_URL + baseUrl);
  }

  async login(data) {
    return (await this.api.post("/login", data)).data;
  }

  async register(data) {
    return (await this.api.post("/register", data)).data;
  }

  async logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken() {
    return localStorage.getItem("token");
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
