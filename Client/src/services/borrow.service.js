import createApiClient from "./api.service";

class BorrowService {
  constructor(baseUrl = "/api/borrow") {
    this.api = createApiClient(baseUrl);
  }

  async getAllByReader(readerId) {
    return (await this.api.get(`/reader/${readerId}`)).data;
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }
}

export default new BorrowService();
