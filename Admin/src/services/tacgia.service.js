import createApiClient from "./api.service";

class TacGiaService {
  constructor(baseUrl = "/api/tacgia") {
    this.api = createApiClient(baseUrl);
  }

  async create(data) {
    const response = await this.api.post("/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  }

  async getAll(query = {}) {
    const response = await this.api.get("/", { params: query });
    return response.data; // Trả về { success, data, pagination }
  }

  async getById(id) {
    const response = await this.api.get(`/${id}`);
    return response.data.data;
  }

  async update(id, data) {
    const response = await this.api.put(`/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  }

  async delete(id) {
    const response = await this.api.delete(`/${id}`);
    return response.data;
  }

  async getStatsByQuocTich() {
    const response = await this.api.get("/stats/quoctich");
    return response.data.data;
  }

  async getByQuocTich(quocTich) {
    const response = await this.api.get(`/quoctich/${quocTich}`);
    return response.data.data;
  }

  async getAllForSelect() {
    const response = await this.api.get("/select");
    return response.data.data;
  }
}

export default new TacGiaService();