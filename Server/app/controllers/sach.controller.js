const SachService = require("../services/sach.service");
const ApiError = require("../api-error");
const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");

exports.create = async (req, res, next) => {
  try {
    const { TenSach, TacGia, NhaXuatBan, DanhMuc, NamXuatBan, SoQuyen, DonGia, MoTa } = req.body;

    // Validate required fields
    if (!TenSach || !TacGia || !NhaXuatBan || !DanhMuc) {
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      return next(new ApiError(400, "Thiếu thông tin bắt buộc"));
    }

    const sachData = {
      TenSach,
      TacGia,
      NhaXuatBan,
      DanhMuc,
      NamXuatBan: NamXuatBan ? parseInt(NamXuatBan) : undefined,
      SoQuyen: SoQuyen ? parseInt(SoQuyen) : undefined,
      DonGia: DonGia ? parseInt(DonGia) : undefined,
      MoTa: MoTa || '',
      NguoiTao: req.user.id
    };
    
    // Chỉ thêm AnhBia nếu có file upload
    if (req.file) {
      sachData.AnhBia = `uploads/sach/${req.file.filename}`;
    }
    
    const sach = await SachService.create(sachData);
    res.status(201).json({
      success: true,
      message: 'Tạo sách thành công',
      data: sach
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

exports.getAll = async (req, res, next) => {
  try {
    const list = await SachService.findAll();
    res.json({
      success: true,
      data: list
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const sach = await SachService.findById(req.params.id);
    if (!sach) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }
    res.json({
      success: true,
      data: sach
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { TenSach, TacGia, NhaXuatBan, DanhMuc, NamXuatBan, SoQuyen, DonGia, MoTa } = req.body;
    const updateData = {};
    
    // Chỉ update các field có giá trị
    if (TenSach !== undefined) updateData.TenSach = TenSach;
    if (TacGia !== undefined) updateData.TacGia = TacGia;
    if (NhaXuatBan !== undefined) updateData.NhaXuatBan = NhaXuatBan;
    if (DanhMuc !== undefined) updateData.DanhMuc = DanhMuc;
    if (NamXuatBan !== undefined) updateData.NamXuatBan = parseInt(NamXuatBan);
    if (SoQuyen !== undefined) updateData.SoQuyen = parseInt(SoQuyen);
    if (DonGia !== undefined) updateData.DonGia = parseInt(DonGia);
    if (MoTa !== undefined) updateData.MoTa = MoTa;
    
    // Xử lý upload ảnh bìa nếu có
    if (req.file) {
      updateData.AnhBia = `uploads/sach/${req.file.filename}`;
      
      // Xóa ảnh cũ nếu có
      const existingBook = await SachService.findById(req.params.id);
      if (existingBook && existingBook.AnhBia) {
        const oldImagePath = existingBook.AnhBia;
        if (fsSync.existsSync(oldImagePath)) {
          fsSync.unlinkSync(oldImagePath);
        }
      }
    }
    
    const updated = await SachService.update(req.params.id, updateData);
    if (!updated) {
      return next(new ApiError(404, "Không tìm thấy sách để cập nhật"));
    }
    
    res.json({
      success: true,
      message: 'Cập nhật sách thành công',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const sach = await SachService.findById(req.params.id);
    if (!sach) {
      return next(new ApiError(404, "Không tìm thấy sách"));
    }

    // Xóa ảnh bìa nếu có
    if (sach.AnhBia && fsSync.existsSync(sach.AnhBia)) {
      try {
        await fs.unlink(sach.AnhBia);
      } catch (error) {
        console.error("Lỗi khi xóa ảnh bìa:", error);
      }
    }

    const deleted = await SachService.softDelete(req.params.id);
    res.json({
      success: true,
      message: 'Xóa sách thành công',
      data: deleted
    });
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return next(new ApiError(400, "Vui lòng nhập từ khóa tìm kiếm"));
    }
    const list = await SachService.search(q);
    res.json({
      success: true,
      data: list
    });
  } catch (error) {
    next(error);
  }
};
