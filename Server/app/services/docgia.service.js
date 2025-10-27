const { ObjectId } = require("mongodb");

class DocGiaService {
  constructor(client) {
    this.DocGia = client.db().collection("docgias");
  }

  extractContactData(payload) {
    const contact = {
      name: payload.name,
      email: payload.email,
      address: payload.address,
      phone: payload.phone,
      favorite: payload.favorite,
    };
    return contact;
  }

  async getAllDocGia() {
    return await this.DocGia.find().toArray();
  }

  async createDocGia(data) {
    const contact = this.extractContactData(data);
    const result = await this.DocGia.insertOne(contact);
    return result.ops[0];
  }

  async updateDocGia(id, data) {
    const contact = this.extractContactData(data);
    await this.DocGia.updateOne({ _id: ObjectId(id) }, { $set: contact });
    return this.DocGia.findOne({ _id: ObjectId(id) });
  }
}

module.exports = DocGiaService;
//   await DocGia.findByIdAndUpdate(id, data, { new: true });
// export const deleteDocGia = async (id) => await DocGia.findByIdAndDelete(id);
