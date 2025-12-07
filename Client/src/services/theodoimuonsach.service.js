import createApiClient from "./api.service";

class TheoDoiMuonSachService {
  constructor(baseUrl = "/api/theodoimuonsach") {
    this.api = createApiClient(baseUrl);
  }

  async create(data) {
    const response = await this.api.post("/", data);
    return response.data.data || response.data;
  }

  async getAll(params = {}) {
    const response = await this.api.get("/", { params });
    return response.data;
  }

  async getById(id) {
    const response = await this.api.get(`/${id}`);
    return response.data.data || response.data;
  }

  async getByDocGia(docGiaId) {
    const response = await this.api.get(`/docgia/${docGiaId}`);
    return response.data.data || response.data;
  }

  async updateStatus(id, data) {
    const response = await this.api.put(`/${id}/status`, data);
    return response.data.data || response.data;
  }

  async delete(id) {
    const response = await this.api.delete(`/${id}`);
    return response.data;
  }

  async getStatistics() {
    const response = await this.api.get("/statistics");
    return response.data.data || response.data;
  }

  async checkOverdue() {
    const response = await this.api.get("/check-overdue");
    return response.data;
  }
}

export default new TheoDoiMuonSachService();
