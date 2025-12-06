import createApiClient from "./api.service";

class BorrowService {
  constructor(baseUrl = "/api/borrow") {
    this.api = createApiClient(baseUrl);
  }

  async getAllByReader(readerId) {
    const response = await this.api.get(`/reader/${readerId}`);
    return response.data.data || response.data;
  }

  async create(data) {
    const response = await this.api.post("/", data);
    return response.data.data || response.data;
  }
}

export default new BorrowService();
