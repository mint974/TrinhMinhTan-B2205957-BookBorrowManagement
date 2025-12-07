// src/services/reader.service.js
import createApiClient from "./api.service";

class ReaderService {
  constructor(baseUrl = "/api/docgia") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async ban(id, data) {
    return (await this.api.put(`/${id}/ban`, data)).data;
  }

  async unban(id) {
    return (await this.api.put(`/${id}/unban`)).data;
  }
}

export default new ReaderService();
