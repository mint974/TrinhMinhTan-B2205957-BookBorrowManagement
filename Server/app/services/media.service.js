const Media = require("../models/media.model");

class MediaService {
  // Tạo media
  static async create(data) {
    return await Media.create(data);
  }

  // Lấy danh sách media (không lấy bản đã xóa) với filter và search
  static async findAll(query = {}) {
    const { LoaiMedia, search, page = 1, limit = 10 } = query;
    const filter = { deleted: false };

    // Lọc theo loại media
    if (LoaiMedia) {
      filter.LoaiMedia = LoaiMedia;
    }

    // Tìm kiếm theo tên
    if (search) {
      filter.$or = [
        { TenMedia: { $regex: search, $options: "i" } },
        { MoTa: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Media.countDocuments(filter);
    const data = await Media.find(filter)
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

  // Lấy media theo ID
  static async findById(id) {
    return await Media.findOne({ _id: id, deleted: false }).populate(
      "NguoiTao",
      "TenNV Email"
    );
  }

  // Lấy media theo MaMedia
  static async findByMaMedia(maMedia) {
    return await Media.findOne({ MaMedia: maMedia, deleted: false }).populate(
      "NguoiTao",
      "TenNV Email"
    );
  }

  // Lấy media theo loại
  static async findByLoaiMedia(loaiMedia) {
    return await Media.find({ LoaiMedia: loaiMedia, deleted: false })
      .populate("NguoiTao", "TenNV Email")
      .sort({ createdAt: -1 });
  }

  // Cập nhật media
  static async update(id, data) {
    // Không cho phép cập nhật MaMedia và NguoiTao
    delete data.MaMedia;
    delete data.NguoiTao;

    return await Media.findOneAndUpdate({ _id: id, deleted: false }, data, {
      new: true,
      runValidators: true,
    }).populate("NguoiTao", "TenNV Email");
  }

  // Xóa mềm media
  static async softDelete(id) {
    return await Media.findOneAndUpdate(
      { _id: id, deleted: false },
      { deleted: true },
      { new: true }
    );
  }

  // Xóa vĩnh viễn media (chỉ dùng khi cần thiết)
  static async hardDelete(id) {
    return await Media.findByIdAndDelete(id);
  }

  // Thống kê media theo loại
  static async getStatsByLoaiMedia() {
    return await Media.aggregate([
      { $match: { deleted: false } },
      {
        $group: {
          _id: "$LoaiMedia",
          count: { $sum: 1 },
          totalSize: { $sum: "$fileSize" },
        },
      },
      { $sort: { count: -1 } },
    ]);
  }
}

module.exports = MediaService;
