import createApiClient from "./api.service";

class DocGiaService {
  constructor(baseUrl = "/api/docgia") {
    this.api = createApiClient(baseUrl);
  }

  async getProfile() {
    return (await this.api.get("/profile")).data;
  }

  async updateProfile(data) {
    return (await this.api.put("/profile", data)).data;
  }

  async uploadAvatar(formData) {
    return (await this.api.put("/profile/avatar", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })).data;
  }

  async updatePassword(data) {
    return (await this.api.put("/profile/password", data)).data;
  }
}

export default new DocGiaService();
