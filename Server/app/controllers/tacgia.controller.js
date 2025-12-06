const TacGiaService = require("../services/tacgia.service");
const ApiError = require("../api-error");
const fs = require("fs").promises;
const path = require("path");

// Tạo tác giả mới
exports.create = async (req, res, next) => {
  try {
    const { HoTen, ButDanh, NamSinh, NamMat, QuocTich, MaTinh, MaQuan, MaPhuong, DiaChiChiTiet, TieuSu } = req.body;

    if (!HoTen) {
      // Xóa file nếu đã upload và thiếu thông tin
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      return next(new ApiError(400, "Thiếu thông tin: HoTen là bắt buộc"));
    }

    const tacgiaData = {
      HoTen,
      ButDanh: ButDanh || "",
      NamSinh: NamSinh ? parseInt(NamSinh) : undefined,
      NamMat: NamMat ? parseInt(NamMat) : undefined,
      QuocTich: QuocTich || "",
      MaTinh: MaTinh || "",
      MaQuan: MaQuan || "",
      MaPhuong: MaPhuong || "",
      DiaChiChiTiet: DiaChiChiTiet || "",
      TieuSu: TieuSu || "",
      HinhAnh: req.file ? req.file.path : undefined,
    };

    const tacgia = await TacGiaService.create(tacgiaData);
    res.status(201).json({
      success: true,
      message: "Tạo tác giả thành công",
      data: tacgia,
    });
  } catch (error) {
    // Xóa file nếu có lỗi
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Lỗi khi xóa file:", unlinkError);
      }
    }
    next(error);
  }
};

// Lấy danh sách tác giả với filter và search
exports.getAll = async (req, res, next) => {
  try {
    const result = await TacGiaService.findAll(req.query);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy tất cả tác giả cho dropdown (không phân trang)
exports.getAllForSelect = async (req, res, next) => {
  try {
    const data = await TacGiaService.getAllForSelect();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy tác giả theo ID
exports.getById = async (req, res, next) => {
  try {
    const tacgia = await TacGiaService.findById(req.params.id);
    if (!tacgia) {
      return next(new ApiError(404, "Không tìm thấy tác giả"));
    }
    res.json({
      success: true,
      data: tacgia,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy tác giả theo quốc tịch
exports.getByQuocTich = async (req, res, next) => {
  try {
    const tacgiaList = await TacGiaService.findByQuocTich(req.params.quocTich);
    res.json({
      success: true,
      data: tacgiaList,
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật tác giả
exports.update = async (req, res, next) => {
  try {
    const { HoTen, ButDanh, NamSinh, NamMat, QuocTich, MaTinh, MaQuan, MaPhuong, DiaChiChiTiet, TieuSu } = req.body;
    const updateData = {};

    if (HoTen) updateData.HoTen = HoTen;
    if (ButDanh !== undefined) updateData.ButDanh = ButDanh;
    if (NamSinh) updateData.NamSinh = parseInt(NamSinh);
    if (NamMat !== undefined)
      updateData.NamMat = NamMat ? parseInt(NamMat) : null;
    if (QuocTich !== undefined) updateData.QuocTich = QuocTich;
    if (MaTinh !== undefined) updateData.MaTinh = MaTinh;
    if (MaQuan !== undefined) updateData.MaQuan = MaQuan;
    if (MaPhuong !== undefined) updateData.MaPhuong = MaPhuong;
    if (DiaChiChiTiet !== undefined) updateData.DiaChiChiTiet = DiaChiChiTiet;
    if (TieuSu !== undefined) updateData.TieuSu = TieuSu;

    // Xử lý upload hình ảnh nếu có
    if (req.file) {
      updateData.HinhAnh = `uploads/tacgia/${req.file.filename}`;
      
      // Xóa hình ảnh cũ nếu có
      const existingAuthor = await TacGiaService.findById(req.params.id);
      if (existingAuthor && existingAuthor.HinhAnh) {
        const oldImagePath = existingAuthor.HinhAnh;
        const fs = require('fs');
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updated = await TacGiaService.update(req.params.id, updateData);
    if (!updated) {
      return next(new ApiError(404, "Không tìm thấy tác giả để cập nhật"));
    }

    res.json({
      success: true,
      message: "Cập nhật tác giả thành công",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Upload/Cập nhật hình ảnh tác giả
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError(400, "Vui lòng chọn file hình ảnh"));
    }

    const tacgia = await TacGiaService.findById(req.params.id);
    if (!tacgia) {
      await fs.unlink(req.file.path);
      return next(new ApiError(404, "Không tìm thấy tác giả"));
    }

    // Xóa hình ảnh cũ nếu có
    if (tacgia.HinhAnh) {
      try {
        await fs.unlink(tacgia.HinhAnh);
      } catch (error) {
        console.error("Lỗi khi xóa hình ảnh cũ:", error);
      }
    }

    // Cập nhật đường dẫn hình ảnh mới
    const updated = await TacGiaService.update(req.params.id, {
      HinhAnh: req.file.path,
    });

    res.json({
      success: true,
      message: "Upload hình ảnh thành công",
      data: updated,
    });
  } catch (error) {
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Lỗi khi xóa file:", unlinkError);
      }
    }
    next(error);
  }
};

// Xóa hình ảnh tác giả
exports.deleteImage = async (req, res, next) => {
  try {
    const tacgia = await TacGiaService.findById(req.params.id);
    if (!tacgia) {
      return next(new ApiError(404, "Không tìm thấy tác giả"));
    }

    if (tacgia.HinhAnh) {
      try {
        await fs.unlink(tacgia.HinhAnh);
      } catch (error) {
        console.error("Lỗi khi xóa hình ảnh:", error);
      }
    }

    const updated = await TacGiaService.update(req.params.id, {
      HinhAnh: null,
    });

    res.json({
      success: true,
      message: "Xóa hình ảnh thành công",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Xóa mềm tác giả
exports.delete = async (req, res, next) => {
  try {
    const deleted = await TacGiaService.softDelete(req.params.id);
    if (!deleted) {
      return next(new ApiError(404, "Không tìm thấy tác giả để xóa"));
    }
    res.json({
      success: true,
      message: "Xóa tác giả thành công",
    });
  } catch (error) {
    next(error);
  }
};

// Xóa vĩnh viễn tác giả
exports.hardDelete = async (req, res, next) => {
  try {
    const tacgia = await TacGiaService.findById(req.params.id);
    if (!tacgia) {
      return next(new ApiError(404, "Không tìm thấy tác giả"));
    }

    // Xóa hình ảnh nếu có
    if (tacgia.HinhAnh) {
      try {
        await fs.unlink(tacgia.HinhAnh);
      } catch (error) {
        console.error("Lỗi khi xóa hình ảnh:", error);
      }
    }

    await TacGiaService.hardDelete(req.params.id);

    res.json({
      success: true,
      message: "Xóa vĩnh viễn tác giả thành công",
    });
  } catch (error) {
    next(error);
  }
};

// Thống kê tác giả theo quốc tịch
exports.getStatistics = async (req, res, next) => {
  try {
    const stats = await TacGiaService.getStatsByQuocTich();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
