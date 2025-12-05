const DanhMuc = require("../models/danhmuc.model");

class DanhMucService {
  // Tạo danh mục
  static async create(data) {
    const newDanhMuc = await DanhMuc.create(data);
    return await DanhMuc.findById(newDanhMuc._id);
  }

  // Lấy danh sách danh mục (không lấy bản đã xóa)
  static async findAll() {
    return await DanhMuc.find({ deleted: false })
      .sort({ createdAt: -1 });
  }

  // Lấy danh mục theo ID
  static async findById(id) {
    return await DanhMuc.findOne({ _id: id, deleted: false });
  }

  // Cập nhật danh mục
  static async update(id, data) {
    return await DanhMuc.findOneAndUpdate({ _id: id, deleted: false }, data, {
      new: true,
    });
  }

  // Xóa mềm danh mục
  static async softDelete(id) {
    return await DanhMuc.findOneAndUpdate(
      { _id: id, deleted: false },
      { deleted: true },
      { new: true }
    );
  }
}

module.exports = DanhMucService;
