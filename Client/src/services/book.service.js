import createApiClient from "./api.service";

class BookService {
  constructor(baseUrl = "/api/sach") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    const response = await this.api.get("/");
    return response.data.data || response.data;
  }

  async get(id) {
    const response = await this.api.get(`/${id}`);
    return response.data.data || response.data;
  }

  async search(keyword) {
    return (await this.api.get(`/search?keyword=${keyword}`)).data;
  }
}

export default new BookService();
