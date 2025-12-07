const TheoDoiMuonSachService = require("../services/theodoimuonsach.service");
const ApiError = require("../api-error");

// Tạo phiếu mượn sách mới
exports.create = async (req, res, next) => {
  try {
    const { MaDocGia, MaSach } = req.body;

    // Validate required fields
    if (!MaDocGia || !MaSach) {
      return next(new ApiError(400, "Thiếu thông tin bắt buộc"));
    }

    const phieuMuon = await TheoDoiMuonSachService.create({
      MaDocGia,
      MaSach,
    });

    res.status(201).json({
      success: true,
      message: "Tạo phiếu mượn sách thành công",
      data: phieuMuon,
    });
  } catch (error) {
    // Trả về message lỗi rõ ràng từ service
    return next(new ApiError(400, error.message));
  }
};

// Lấy danh sách phiếu mượn
exports.getAll = async (req, res, next) => {
  try {
    const result = await TheoDoiMuonSachService.findAll(req.query);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy phiếu mượn theo ID
exports.getById = async (req, res, next) => {
  try {
    const phieuMuon = await TheoDoiMuonSachService.findById(req.params.id);
    
    if (!phieuMuon) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn sách"));
    }

    res.json({
      success: true,
      data: phieuMuon,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy lịch sử mượn sách của độc giả
exports.getByDocGia = async (req, res, next) => {
  try {
    const { docGiaId } = req.params;
    const lichSu = await TheoDoiMuonSachService.findByDocGia(docGiaId);

    res.json({
      success: true,
      data: lichSu,
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật trạng thái phiếu mượn
exports.updateStatus = async (req, res, next) => {
  try {
    const { TrangThai, LyDoTuChoi, NgayTraThucTe } = req.body;

    if (!TrangThai) {
      return next(new ApiError(400, "Thiếu thông tin trạng thái"));
    }

    const updated = await TheoDoiMuonSachService.updateStatus(req.params.id, {
      TrangThai,
      LyDoTuChoi,
      NgayTraThucTe,
    });

    if (!updated) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn sách"));
    }

    res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Xóa phiếu mượn
exports.delete = async (req, res, next) => {
  try {
    const deleted = await TheoDoiMuonSachService.softDelete(req.params.id);

    if (!deleted) {
      return next(new ApiError(404, "Không tìm thấy phiếu mượn sách"));
    }

    res.json({
      success: true,
      message: "Xóa phiếu mượn sách thành công",
    });
  } catch (error) {
    next(error);
  }
};

// Lấy thống kê phiếu mượn
exports.getStatistics = async (req, res, next) => {
  try {
    const stats = await TheoDoiMuonSachService.getStatistics();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Kiểm tra và cập nhật trạng thái quá hạn
exports.checkOverdue = async (req, res, next) => {
  try {
    const result = await TheoDoiMuonSachService.checkOverdue();

    res.json({
      success: true,
      message: `Đã cập nhật ${result.modifiedCount} phiếu mượn quá hạn`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
