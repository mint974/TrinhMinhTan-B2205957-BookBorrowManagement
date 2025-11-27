import createApiClient from "./api.service";
class NhanVienService {
  constructor(baseUrl = "/api/nhanvien") {
    this.api = createApiClient(baseUrl);
  }

  async create(data) {
    const response = await this.api.post("/", data);
    return response.data.data;
  }

  async getAll() {
    const response = await this.api.get("/");
    return response.data.data;
  }

  async getById(id) {
    const response = await this.api.get(`/${id}`);
    return response.data.data;
  }

  async update(id, data) {
    const response = await this.api.put(`/${id}`, data);
    return response.data.data;
  }

  async delete(id) {
    const response = await this.api.delete(`/${id}`);
    return response.data.data;
  }

  async getProfile() {
    const response = await this.api.get("/profile");
    return response.data.data;
  }

  async updateProfile(data) {
    const response = await this.api.put("/profile", data);
    return response.data.data;
  }

  async changePassword(oldPassword, newPassword) {
    const response = await this.api.put("/profile/password", {
      oldPassword,
      newPassword,
    });
    return response.data;
  }

  async updateAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await this.api.put("/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  }
}
export default new NhanVienService();
