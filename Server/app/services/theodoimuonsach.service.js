const TheoDoiMuonSach = require("../models/theodoimuonsach");
const Sach = require("../models/sach.model");
const DocGia = require("../models/docgia.model");

class TheoDoiMuonSachService {
  // Tạo phiếu mượn sách mới
  static async create(data) {
    // Kiểm tra độc giả có bị cấm mượn sách không
    const docGia = await DocGia.findById(data.MaDocGia);
    if (!docGia) {
      throw new Error("Độc giả không tồn tại");
    }

    if (docGia.NgayBiCam) {
      const now = new Date();
      if (now < docGia.NgayBiCam) {
        const ngayHetCam = new Date(docGia.NgayBiCam).toLocaleDateString('vi-VN');
        throw new Error(`Bạn đang bị cấm mượn sách đến ngày ${ngayHetCam} do trả sách trễ`);
      } else {
        // Hết thời gian cấm, xóa NgayBiCam
        await DocGia.findByIdAndUpdate(data.MaDocGia, {
          $unset: { NgayBiCam: 1 }
        });
      }
    }

    // Kiểm tra số lượng sách đang mượn (tối đa 2 quyển, bao gồm cả yêu cầu chờ duyệt)
    const dangMuon = await TheoDoiMuonSach.countDocuments({
      MaDocGia: data.MaDocGia,
      TrangThai: { $in: ["Chờ duyệt", "Đã duyệt", "Đang mượn"] },
      deleted: false
    });

    if (dangMuon >= 2) {
      throw new Error("Bạn đã có 2 yêu cầu mượn sách (bao gồm cả yêu cầu chờ duyệt). Vui lòng chờ xử lý hoặc trả sách trước khi mượn thêm");
    }

    // Kiểm tra xem đã mượn sách này chưa trả hay chưa
    const daMuonSachNay = await TheoDoiMuonSach.findOne({
      MaDocGia: data.MaDocGia,
      MaSach: data.MaSach,
      TrangThai: { $in: ["Chờ duyệt", "Đã duyệt", "Đang mượn"] },
      deleted: false
    });

    if (daMuonSachNay) {
      throw new Error("Bạn đã có yêu cầu mượn sách này rồi. Vui lòng chờ xử lý hoặc trả sách trước khi mượn lại");
    }

    // Kiểm tra sách còn hay không
    const sach = await Sach.findOne({ _id: data.MaSach, deleted: false });
    if (!sach) {
      throw new Error("Sách không tồn tại");
    }
    
    if (sach.SoQuyen <= 0) {
      throw new Error("Sách đã hết");
    }

    // Tạo phiếu mượn với trạng thái "Chờ duyệt"
    const phieuMuon = await TheoDoiMuonSach.create(data);

    // KHÔNG giảm số lượng sách ngay - chờ nhân viên duyệt

    return await TheoDoiMuonSach.findById(phieuMuon._id)
      .populate('MaDocGia', 'HoLot Ten Email DienThoai MaDocGia')
      .populate('MaSach', 'TenSach MaSach AnhBia DonGia');
  }

  // Lấy danh sách phiếu mượn với filter và search
  static async findAll(query = {}) {
    const { 
      search, 
      TrangThai, 
      MaDocGia, 
      MaSach,
      page = 1, 
      limit = 10 
    } = query;
    
    const filter = { deleted: false };

    // Lọc theo trạng thái
    if (TrangThai) {
      filter.TrangThai = TrangThai;
    }

    // Lọc theo độc giả
    if (MaDocGia) {
      filter.MaDocGia = MaDocGia;
    }

    // Lọc theo sách
    if (MaSach) {
      filter.MaSach = MaSach;
    }

    const skip = (page - 1) * limit;
    const total = await TheoDoiMuonSach.countDocuments(filter);
    const data = await TheoDoiMuonSach.find(filter)
      .populate('MaDocGia', 'HoLot Ten Email DienThoai MaDocGia Avatar NgayBiCam')
      .populate('MaSach', 'TenSach MaSach AnhBia DonGia NamXuatBan SoQuyen')
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

  // Lấy phiếu mượn theo ID
  static async findById(id) {
    return await TheoDoiMuonSach.findOne({ _id: id, deleted: false })
      .populate('MaDocGia', 'HoLot Ten Email DienThoai MaDocGia Avatar NgayBiCam')
      .populate('MaSach', 'TenSach MaSach AnhBia DonGia NamXuatBan SoQuyen');
  }

  // Lấy lịch sử mượn sách của độc giả
  static async findByDocGia(docGiaId) {
    return await TheoDoiMuonSach.find({ 
      MaDocGia: docGiaId, 
      deleted: false 
    })
      .populate('MaSach', 'TenSach MaSach AnhBia DonGia NamXuatBan')
      .sort({ createdAt: -1 });
  }

  // Cập nhật trạng thái phiếu mượn
  static async updateStatus(id, data) {
    const { TrangThai, LyDoTuChoi, NgayTraThucTe } = data;
    const phieuMuon = await TheoDoiMuonSach.findOne({ _id: id, deleted: false })
      .populate('MaSach', 'DonGia');
    
    if (!phieuMuon) {
      return null;
    }

    const oldStatus = phieuMuon.TrangThai;
    const updateData = {};

    if (TrangThai !== undefined) {
      updateData.TrangThai = TrangThai;
    }

    if (LyDoTuChoi !== undefined) {
      updateData.LyDoTuChoi = LyDoTuChoi;
    }

    // Xử lý khi nhân viên duyệt phiếu mượn
    if (TrangThai === "Đã duyệt" && oldStatus === "Chờ duyệt") {
      // Giảm số lượng sách khi duyệt
      await Sach.findByIdAndUpdate(phieuMuon.MaSach._id, {
        $inc: { SoQuyen: -1 }
      });
    }

    // Xử lý khi nhân viên từ chối
    if (TrangThai === "Từ chối" && oldStatus === "Chờ duyệt") {
      // Không cần làm gì vì chưa giảm số lượng
    }

    // Xử lý trả sách
    if (TrangThai === "Đã trả" && oldStatus !== "Đã trả") {
      const ngayTraThucTe = NgayTraThucTe ? new Date(NgayTraThucTe) : new Date();
      updateData.NgayTraThucTe = ngayTraThucTe;

      // Kiểm tra trả trễ
      const ngayHenTra = new Date(phieuMuon.NgayTra);
      const isLate = ngayTraThucTe > ngayHenTra;

      if (isLate) {
        // Tính phí phạt 20% giá sách
        const phiPhat = phieuMuon.MaSach.DonGia * 0.2;
        updateData.PhiPhat = phiPhat;

        // Cấm mượn sách trong 2 tuần
        const ngayBiCam = new Date(ngayTraThucTe);
        ngayBiCam.setDate(ngayBiCam.getDate() + 14); // Cộng 14 ngày

        await DocGia.findByIdAndUpdate(phieuMuon.MaDocGia, {
          NgayBiCam: ngayBiCam
        });
      }

      // Tăng số lượng sách
      await Sach.findByIdAndUpdate(phieuMuon.MaSach._id, {
        $inc: { SoQuyen: 1 }
      });
    }

    return await TheoDoiMuonSach.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('MaDocGia', 'HoLot Ten Email DienThoai MaDocGia NgayBiCam')
      .populate('MaSach', 'TenSach MaSach AnhBia DonGia');
  }

  // Xóa mềm phiếu mượn
  static async softDelete(id) {
    const phieuMuon = await TheoDoiMuonSach.findById(id);
    
    if (!phieuMuon) {
      return null;
    }

    // Nếu phiếu mượn đã duyệt hoặc đang mượn, tăng lại số lượng sách
    if (phieuMuon.TrangThai === "Đã duyệt" || phieuMuon.TrangThai === "Đang mượn") {
      await Sach.findByIdAndUpdate(phieuMuon.MaSach, {
        $inc: { SoQuyen: 1 }
      });
    }

    return await TheoDoiMuonSach.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );
  }

  // Thống kê phiếu mượn theo trạng thái
  static async getStatistics() {
    const stats = await TheoDoiMuonSach.aggregate([
      { $match: { deleted: false } },
      { 
        $group: { 
          _id: "$TrangThai", 
          count: { $sum: 1 } 
        } 
      }
    ]);

    const total = await TheoDoiMuonSach.countDocuments({ deleted: false });

    return {
      total,
      byStatus: stats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };
  }

  // Kiểm tra và cập nhật trạng thái quá hạn
  static async checkOverdue() {
    const now = new Date();
    const result = await TheoDoiMuonSach.updateMany(
      {
        deleted: false,
        TrangThai: { $in: ["Đã duyệt", "Đang mượn"] },
        NgayTra: { $lt: now }
      },
      {
        $set: { TrangThai: "Quá hạn" }
      }
    );

    return result;
  }
}

module.exports = TheoDoiMuonSachService;
