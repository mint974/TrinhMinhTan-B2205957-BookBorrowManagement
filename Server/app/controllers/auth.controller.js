const NhanVienService = require("../services/nhanvien.service");
const ApiError = require("../api-error");
const jwt = require("../utils/jwt");

// Đăng nhập nhân viên
exports.login = async (req, res, next) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return next(new ApiError(400, "Vui lòng cung cấp email và mật khẩu"));
    }

    // Đăng nhập qua service
    const nhanVien = await NhanVienService.login(Email, Password);

    if (!nhanVien) {
      return next(new ApiError(401, "Email hoặc mật khẩu không đúng"));
    }

    // Tạo JWT token
    const token = jwt.sign({
      id: nhanVien._id,
      email: nhanVien.Email,
      role: nhanVien.ChucVu,
    });

    // Loại bỏ password khỏi response
    const nhanVienData = nhanVien.toObject();
    delete nhanVienData.Password;

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      nhanvien: nhanVienData,
    });
  } catch (error) {
    return next(new ApiError(500, error.message || "Lỗi đăng nhập"));
  }
};
