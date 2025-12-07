const DocGiaService = require("../services/docgia.service");
const ApiError = require("../api-error");
const jwt = require("../utils/jwt");

// Đăng ký độc giả mới
exports.register = async (req, res, next) => {
  try {
    const {
      HoLot,
      Ten,
      Email,
      Password,
      NgaySinh,
      GioiTinh,
      MaTinh,
      MaQuan,
      MaPhuong,
      DiaChiChiTiet,
      DienThoai,
    } = req.body;

    // Validate required fields
    if (!HoLot || !Ten || !Email || !Password || !NgaySinh || !GioiTinh || !DienThoai) {
      return next(
        new ApiError(
          400,
          "Vui lòng cung cấp đầy đủ thông tin: Họ lót, Tên, Email, Mật khẩu, Ngày sinh, Giới tính, Điện thoại"
        )
      );
    }

    const data = {
      HoLot,
      Ten,
      Email,
      Password,
      NgaySinh,
      GioiTinh,
      MaTinh,
      MaQuan,
      MaPhuong,
      DiaChiChiTiet,
      DienThoai,
    };

    // Đăng ký qua service
    const newDocGia = await DocGiaService.register(data);

    // Tạo JWT token
    const token = jwt.sign({
      id: newDocGia._id,
      email: newDocGia.Email,
      role: "docgia",
    });

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      token,
      docgia: newDocGia,
    });
  } catch (error) {
    // Nếu đã là ApiError thì pass qua next, nếu không thì wrap lại
    if (error.statusCode) {
      return next(error);
    }
    return next(new ApiError(400, error.message || "Lỗi đăng ký"));
  }
};

// Đăng nhập độc giả
exports.login = async (req, res, next) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return next(new ApiError(400, "Vui lòng cung cấp email và mật khẩu"));
    }

    // Đăng nhập qua service
    const docGia = await DocGiaService.login(Email, Password);

    if (!docGia) {
      return next(new ApiError(401, "Email hoặc mật khẩu không đúng"));
    }

    // Tạo JWT token
    const token = jwt.sign({
      id: docGia._id,
      email: docGia.Email,
      role: "docgia",
    });

    // Loại bỏ password khỏi response
    const docGiaData = docGia.toObject();
    delete docGiaData.Password;

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      docgia: docGiaData,
    });
  } catch (error) {
    return next(new ApiError(500, error.message || "Lỗi đăng nhập"));
  }
};

// Tạo độc giả mới (dành cho admin)
exports.create = async (req, res, next) => {
  try {
    const {
      HoLot,
      Ten,
      Email,
      Password,
      NgaySinh,
      GioiTinh,
      MaTinh,
      MaQuan,
      MaPhuong,
      DiaChiChiTiet,
      DienThoai,
    } = req.body;

    // Validate required fields
    if (!HoLot || !Ten || !Email || !Password || !NgaySinh || !GioiTinh) {
      return next(
        new ApiError(
          400,
          "Vui lòng cung cấp đầy đủ thông tin: Họ lót, Tên, Email, Password, Ngày sinh, Giới tính"
        )
      );
    }

    // Kiểm tra email đã tồn tại
    const existingDocGia = await DocGiaService.findByEmail(Email);
    if (existingDocGia) {
      return next(new ApiError(400, "Email đã được sử dụng"));
    }

    const data = {
      HoLot,
      Ten,
      Email,
      Password,
      NgaySinh,
      GioiTinh,
      MaTinh,
      MaQuan,
      MaPhuong,
      DiaChiChiTiet,
      DienThoai,
    };

    if (req.file) {
      data.Avatar = `uploads/avatar/${req.file.filename}`;
    }

    const newDocGia = await DocGiaService.create(data);

    res.status(201).json({
      success: true,
      message: "Tạo độc giả thành công",
      data: newDocGia,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách độc giả
exports.getAll = async (req, res, next) => {
  try {
    const result = await DocGiaService.findAll(req.query);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy độc giả theo ID
exports.getById = async (req, res, next) => {
  try {
    const docGia = await DocGiaService.findById(req.params.id);
    if (!docGia) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }

    res.json({
      success: true,
      data: docGia,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy tất cả độc giả cho dropdown (không phân trang)
exports.getAllForSelect = async (req, res, next) => {
  try {
    const docGias = await DocGiaService.getAllForSelect();
    res.json({
      success: true,
      data: docGias,
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật độc giả
exports.update = async (req, res, next) => {
  try {
    const { HoLot, Ten, NgaySinh, GioiTinh, MaTinh, MaQuan, MaPhuong, DiaChiChiTiet, DienThoai } = req.body;
    const updateData = {};

    if (HoLot) updateData.HoLot = HoLot;
    if (Ten) updateData.Ten = Ten;
    if (NgaySinh) updateData.NgaySinh = NgaySinh;
    if (GioiTinh) updateData.GioiTinh = GioiTinh;
    if (MaTinh !== undefined) updateData.MaTinh = MaTinh;
    if (MaQuan !== undefined) updateData.MaQuan = MaQuan;
    if (MaPhuong !== undefined) updateData.MaPhuong = MaPhuong;
    if (DiaChiChiTiet !== undefined) updateData.DiaChiChiTiet = DiaChiChiTiet;
    if (DienThoai !== undefined) updateData.DienThoai = DienThoai;

    // Xử lý upload avatar nếu có
    if (req.file) {
      updateData.Avatar = `uploads/avatar/${req.file.filename}`;

      // Xóa avatar cũ nếu có
      const existingDocGia = await DocGiaService.findById(req.params.id);
      if (existingDocGia && existingDocGia.Avatar) {
        const oldAvatarPath = existingDocGia.Avatar;
        const fs = require("fs");
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }
    }

    const updated = await DocGiaService.update(req.params.id, updateData);
    if (!updated) {
      return next(new ApiError(404, "Không tìm thấy độc giả để cập nhật"));
    }

    res.json({
      success: true,
      message: "Cập nhật độc giả thành công",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật password
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return next(
        new ApiError(400, "Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới")
      );
    }

    await DocGiaService.updatePassword(req.params.id, currentPassword, newPassword);

    res.json({
      success: true,
      message: "Cập nhật mật khẩu thành công",
    });
  } catch (error) {
    next(error);
  }
};

// Upload/cập nhật avatar
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError(400, "Vui lòng chọn file ảnh"));
    }

    const avatarPath = `uploads/avatar/${req.file.filename}`;

    // Xóa avatar cũ nếu có
    const existingDocGia = await DocGiaService.findById(req.params.id);
    if (existingDocGia && existingDocGia.Avatar) {
      const oldAvatarPath = existingDocGia.Avatar;
      const fs = require("fs");
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    const updated = await DocGiaService.update(req.params.id, {
      Avatar: avatarPath,
    });

    if (!updated) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }

    res.json({
      success: true,
      message: "Upload avatar thành công",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Xóa avatar
exports.deleteAvatar = async (req, res, next) => {
  try {
    const docGia = await DocGiaService.findById(req.params.id);
    if (!docGia) {
      return next(new ApiError(404, "Không tìm thấy độc giả"));
    }

    if (docGia.Avatar) {
      const fs = require("fs");
      if (fs.existsSync(docGia.Avatar)) {
        fs.unlinkSync(docGia.Avatar);
      }
    }

    const updated = await DocGiaService.update(req.params.id, { Avatar: "" });

    res.json({
      success: true,
      message: "Xóa avatar thành công",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Xóa mềm độc giả
exports.delete = async (req, res, next) => {
  try {
    const deleted = await DocGiaService.softDelete(req.params.id);
    if (!deleted) {
      return next(new ApiError(404, "Không tìm thấy độc giả để xóa"));
    }

    res.json({
      success: true,
      message: "Xóa độc giả thành công",
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
};

// Xóa vĩnh viễn độc giả
exports.hardDelete = async (req, res, next) => {
  try {
    const deleted = await DocGiaService.hardDelete(req.params.id);
    if (!deleted) {
      return next(new ApiError(404, "Không tìm thấy độc giả để xóa"));
    }

    res.json({
      success: true,
      message: "Xóa vĩnh viễn độc giả thành công",
    });
  } catch (error) {
    next(error);
  }
};

// Thống kê độc giả
exports.getStatistics = async (req, res, next) => {
  try {
    const statsByGioiTinh = await DocGiaService.getStatsByGioiTinh();
    const statsByAge = await DocGiaService.getStatsByAge();

    res.json({
      success: true,
      data: {
        byGioiTinh: statsByGioiTinh,
        byAge: statsByAge,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Cấm độc giả mượn sách
exports.ban = async (req, res, next) => {
  try {
    const { NgayBiCam } = req.body;

    if (!NgayBiCam) {
      return next(new ApiError(400, "Vui lòng cung cấp ngày cấm"));
    }

    const docGia = await DocGiaService.update(req.params.id, { NgayBiCam });
    
    res.json({
      success: true,
      message: "Đã cấm độc giả mượn sách",
      data: docGia,
    });
  } catch (error) {
    next(error);
  }
};

// Gỡ cấm độc giả
exports.unban = async (req, res, next) => {
  try {
    const docGia = await DocGiaService.update(req.params.id, { NgayBiCam: null });
    
    res.json({
      success: true,
      message: "Đã gỡ cấm độc giả",
      data: docGia,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy thông tin profile của độc giả đang đăng nhập
exports.getProfile = async (req, res, next) => {
  try {
    const docGia = await DocGiaService.findById(req.user.id);
    if (!docGia) {
      return next(new ApiError(404, "Không tìm thấy thông tin độc giả"));
    }

    res.json({
      success: true,
      data: docGia,
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật profile của độc giả đang đăng nhập
exports.updateProfile = async (req, res, next) => {
  try {
    const { HoLot, Ten, DienThoai, NgaySinh, GioiTinh, DiaChiChiTiet } = req.body;
    
    const updateData = {
      HoLot,
      Ten,
      DienThoai,
      NgaySinh,
      GioiTinh,
      DiaChiChiTiet,
    };

    const docGia = await DocGiaService.update(req.user.id, updateData);
    
    res.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: docGia,
    });
  } catch (error) {
    next(error);
  }
};

// Upload avatar profile
exports.uploadProfileAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError(400, "Vui lòng chọn file ảnh"));
    }

    const avatarPath = req.file.path.replace(/\\/g, "/");
    
    const docGia = await DocGiaService.update(req.user.id, { Avatar: avatarPath });
    
    res.json({
      success: true,
      message: "Cập nhật ảnh đại diện thành công",
      data: docGia,
    });
  } catch (error) {
    next(error);
  }
};

// Đổi mật khẩu profile
exports.updateProfilePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return next(new ApiError(400, "Vui lòng cung cấp mật khẩu cũ và mật khẩu mới"));
    }

    await DocGiaService.updatePassword(req.user.id, oldPassword, newPassword);
    
    res.json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const deletedCount = await contactService.deleteAll();
    return res.send({
      message: `${deletedCount} contacts were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while deleting all contacts")
    );
  }
};
