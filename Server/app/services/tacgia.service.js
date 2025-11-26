const TacGia = require("../models/tacgia.model");

class TacGiaService {
  // Tạo tác giả mới
  static async create(data) {
    return await TacGia.create(data);
  }

  // Lấy danh sách tác giả với filter và search
  static async findAll(query = {}) {
    const { search, QuocTich, page = 1, limit = 10 } = query;
    const filter = { deleted: false };

    // Lọc theo quốc tịch
    if (QuocTich) {
      filter.QuocTich = QuocTich;
    }

    // Tìm kiếm theo tên, bút danh
    if (search) {
      filter.$or = [
        { HoTen: { $regex: search, $options: "i" } },
        { ButDanh: { $regex: search, $options: "i" } },
        { TieuSu: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await TacGia.countDocuments(filter);
    const data = await TacGia.find(filter)
      .populate("NguoiTao", "TenNV Email")
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

  // Lấy tác giả theo ID
  static async findById(id) {
    return await TacGia.findOne({ _id: id, deleted: false }).populate(
      "NguoiTao",
      "TenNV Email"
    );
  }

  // Lấy tác giả theo quốc tịch
  static async findByQuocTich(quocTich) {
    return await TacGia.find({ QuocTich: quocTich, deleted: false })
      .populate("NguoiTao", "TenNV Email")
      .sort({
        HoTen: 1,
      });
  }

  // Cập nhật tác giả
  static async update(id, data) {
    // Không cho phép cập nhật NguoiTao
    delete data.NguoiTao;

    return await TacGia.findOneAndUpdate({ _id: id, deleted: false }, data, {
      new: true,
      runValidators: true,
    }).populate("NguoiTao", "TenNV Email");
  }

  // Xóa mềm tác giả
  static async softDelete(id) {
    return await TacGia.findOneAndUpdate(
      { _id: id, deleted: false },
      { deleted: true },
      { new: true }
    );
  }

  // Xóa vĩnh viễn tác giả
  static async hardDelete(id) {
    return await TacGia.findByIdAndDelete(id);
  }

  // Thống kê tác giả theo quốc tịch
  static async getStatsByQuocTich() {
    return await TacGia.aggregate([
      { $match: { deleted: false } },
      {
        $group: {
          _id: "$QuocTich",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
  }

  // Lấy tất cả tác giả (không phân trang) - dùng cho dropdown
  static async getAllForSelect() {
    return await TacGia.find({ deleted: false })
      .select("HoTen ButDanh QuocTich")
      .sort({ HoTen: 1 });
  }
}

module.exports = TacGiaService;
