import createApiClient from "./api.service";

class BookService {
  constructor(baseUrl = "/api/sach") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async search(keyword) {
    return (await this.api.get(`/search?keyword=${keyword}`)).data;
  }
}

export default new BookService();
