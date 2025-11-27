import createApiClient from "./api.service";

class DiaChiService {
  constructor(baseUrl = "/api/diachi") {
    this.api = createApiClient(baseUrl);
  }

  async syncData() {
    const response = await this.api.post("/sync");
    return response.data;
  }

  async getAllTinh() {
    const response = await this.api.get("/tinh");
    return response.data.data;
  }

  async getTinhByCode(code) {
    const response = await this.api.get(`/tinh/${code}`);
    return response.data.data;
  }

  async getQuanByTinh(maTinh) {
    const response = await this.api.get(`/quan/tinh/${maTinh}`);
    return response.data.data;
  }

  async getQuanByCode(code) {
    const response = await this.api.get(`/quan/${code}`);
    return response.data.data;
  }

  async getPhuongByQuan(maQuan) {
    const response = await this.api.get(`/phuong/quan/${maQuan}`);
    return response.data.data;
  }

  async getPhuongByCode(code) {
    const response = await this.api.get(`/phuong/${code}`);
    return response.data.data;
  }

  async formatAddress(data) {
    const response = await this.api.post("/format", data);
    return response.data.address;
  }

  async searchTinh(keyword) {
    const response = await this.api.get(`/tinh/search?keyword=${keyword}`);
    return response.data.data;
  }

  async searchQuan(keyword, maTinh = null) {
    let url = `/quan/search?keyword=${keyword}`;
    if (maTinh) url += `&maTinh=${maTinh}`;
    const response = await this.api.get(url);
    return response.data.data;
  }

  async searchPhuong(keyword, maQuan = null) {
    let url = `/phuong/search?keyword=${keyword}`;
    if (maQuan) url += `&maQuan=${maQuan}`;
    const response = await this.api.get(url);
    return response.data.data;
  }
}

export default new DiaChiService();
