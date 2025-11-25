const Media = require("../models/media.model");

class MediaService {
  // Tạo media
  static async create(data) {
    return await Media.create(data);
  }

  // Lấy danh sách media (không lấy bản đã xóa)
  static async findAll() {
    return await Media.find({ deleted: false });
  }

  // Lấy media theo ID
  static async findById(id) {
    return await Media.findOne({ _id: id, deleted: false });
  }

  // Cập nhật media
  static async update(id, data) {
    return await Media.findOneAndUpdate({ _id: id, deleted: false }, data, {
      new: true,
    });
  }

  // Xóa mềm media
  static async softDelete(id) {
    return await Media.findOneAndUpdate(
      { _id: id, deleted: false },
      { deleted: true },
      { new: true }
    );
  }
}

module.exports = MediaService;
