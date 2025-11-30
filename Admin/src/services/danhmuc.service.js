import createApiClient from "./api.service";

class DanhMucService {
  constructor(baseUrl = "/api/danhmuc") {
    this.api = createApiClient(baseUrl);
  }

  async getAll(params = {}) {
    const response = await this.api.get("/", { params });
    return response.data.data;
  }

  async getById(id) {
    const response = await this.api.get(`/${id}`);
    return response.data.data;
  }

  async create(data) {
    const response = await this.api.post("/", data);
    return response.data.data;
  }

  async update(id, data) {
    const response = await this.api.put(`/${id}`, data);
    return response.data.data;
  }

  async delete(id) {
    const response = await this.api.delete(`/${id}`);
    return response.data;
  }
}

export default new DanhMucService();
