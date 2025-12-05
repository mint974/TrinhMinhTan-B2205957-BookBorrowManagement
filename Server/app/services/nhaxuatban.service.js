const NhaXuatBan = require("../models/nhaxuatban.model");

class NhaXuatBanService {
  static async create(data) {
    return await NhaXuatBan.create(data);
  }

  static async findAll(query = {}) {
    const { search, page = 1, limit = 10 } = query;
    const filter = { deleted: false };

    if (search) {
      filter.$or = [
        { TenNXB: { $regex: search, $options: "i" } },
        { MaTinh: { $regex: search, $options: "i" } },
        { MaQuan: { $regex: search, $options: "i" } },
        { MaPhuong: { $regex: search, $options: "i" } },
        { DiaChiChiTiet: { $regex: search, $options: "i" } },
        { Email: { $regex: search, $options: "i" } },
        { SoDienThoai: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await NhaXuatBan.countDocuments(filter);
    const data = await NhaXuatBan.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return {
      data,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async findById(id) {
    return await NhaXuatBan.findOne({ _id: id, deleted: false });
  }

  static async findByMaNXB(maNXB) {
    return await NhaXuatBan.findOne({ MaNXB: maNXB, deleted: false });
  }

  static async update(id, data) {
    delete data.MaNXB;

    return await NhaXuatBan.findOneAndUpdate(
      { _id: id, deleted: false },
      data,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  static async softDelete(id) {
    return await NhaXuatBan.findOneAndUpdate(
      { _id: id, deleted: false },
      { deleted: true },
      { new: true }
    );
  }

  static async hardDelete(id) {
    return await NhaXuatBan.findByIdAndDelete(id);
  }

  static async getAllForSelect() {
    return await NhaXuatBan.find({ deleted: false })
      .select("MaNXB TenNXB MaTinh MaQuan MaPhuong DiaChiChiTiet SoDienThoai")
      .sort({ TenNXB: 1 });
  }
}

module.exports = NhaXuatBanService;
