// src/services/theodoimuonsach.service.js
import createApiClient from "./api.service";

class TheoDoiMuonSachService {
  constructor(baseUrl = "/api/theodoimuonsach") {
    this.api = createApiClient(baseUrl);
  }

  async getAll(params = {}) {
    return (await this.api.get("/", { params })).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async getByDocGia(docGiaId) {
    return (await this.api.get(`/docgia/${docGiaId}`)).data;
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async updateStatus(id, data) {
    return (await this.api.put(`/${id}/status`, data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async getStatistics() {
    return (await this.api.get("/statistics")).data;
  }

  async checkOverdue() {
    return (await this.api.get("/check-overdue")).data;
  }
}

export default new TheoDoiMuonSachService();
