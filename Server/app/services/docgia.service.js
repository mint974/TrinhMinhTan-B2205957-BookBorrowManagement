const DocGia = require("../models/docgia.model");

class DocGiaService {
  // Tạo độc giả mới
  static async create(data) {
    return await DocGia.create(data);
  }

  // Lấy danh sách độc giả với filter và search
  static async findAll(query = {}) {
    const { search, GioiTinh, page = 1, limit = 10 } = query;
    const filter = { deleted: false };

    // Lọc theo giới tính
    if (GioiTinh) {
      filter.GioiTinh = GioiTinh;
    }

    // Tìm kiếm theo họ tên, email, điện thoại, mã độc giả
    if (search) {
      filter.$or = [
        { HoLot: { $regex: search, $options: "i" } },
        { Ten: { $regex: search, $options: "i" } },
        { Email: { $regex: search, $options: "i" } },
        { DienThoai: { $regex: search, $options: "i" } },
        { MaDocGia: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await DocGia.countDocuments(filter);
    const data = await DocGia.find(filter)
      .select("-Password") // Không trả về password
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

  // Lấy độc giả theo ID
  static async findById(id) {
    return await DocGia.findOne({ _id: id, deleted: false }).select(
      "-Password"
    );
  }

  // Lấy độc giả theo email
  static async findByEmail(email) {
    return await DocGia.findOne({ Email: email, deleted: false });
  }

  // Cập nhật độc giả
  static async update(id, data) {
    // Không cho phép cập nhật Password và MaDocGia qua route này
    delete data.Password;
    delete data.MaDocGia;

    return await DocGia.findOneAndUpdate({ _id: id, deleted: false }, data, {
      new: true,
      runValidators: true,
    }).select("-Password");
  }

  // Cập nhật password
  static async updatePassword(id, newPassword) {
    const docGia = await DocGia.findOne({ _id: id, deleted: false });
    if (!docGia) return null;

    docGia.Password = newPassword;
    await docGia.save(); // Trigger pre-save hook để hash password
    return docGia;
  }

  // Xóa mềm độc giả
  static async softDelete(id) {
    return await DocGia.findOneAndUpdate(
      { _id: id, deleted: false },
      { deleted: true },
      { new: true }
    ).select("-Password");
  }

  // Xóa vĩnh viễn độc giả
  static async hardDelete(id) {
    return await DocGia.findByIdAndDelete(id);
  }

  // Thống kê độc giả theo giới tính
  static async getStatsByGioiTinh() {
    return await DocGia.aggregate([
      { $match: { deleted: false } },
      {
        $group: {
          _id: "$GioiTinh",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
  }

  // Lấy tất cả độc giả (không phân trang) - dùng cho dropdown
  static async getAllForSelect() {
    return await DocGia.find({ deleted: false })
      .select("HoLot Ten Email MaDocGia")
      .sort({ HoLot: 1, Ten: 1 });
  }

  // Thống kê độc giả theo độ tuổi
  static async getStatsByAge() {
    const now = new Date();
    return await DocGia.aggregate([
      { $match: { deleted: false } },
      {
        $project: {
          age: {
            $divide: [
              { $subtract: [now, "$NgaySinh"] },
              365 * 24 * 60 * 60 * 1000,
            ],
          },
        },
      },
      {
        $bucket: {
          groupBy: "$age",
          boundaries: [0, 18, 30, 45, 60, 100],
          default: "Other",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);
  }
}

module.exports = DocGiaService;

