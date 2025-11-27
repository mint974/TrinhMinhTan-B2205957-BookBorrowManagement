const NhanVien = require("../models/nhanvien.model");

class NhanVienService {
  // Tạo nhân viên
  static async create(data) {
    const nhanvien = await NhanVien.create(data);
    return await NhanVien.findById(nhanvien._id).select("-Password");
  }

  // Lấy danh sách nhân viên (không lấy bản đã xóa)
  static async findAll() {
    return await NhanVien.find({ deleted: false }).select("-Password");
  }

  // Lấy nhân viên theo ID
  static async findById(id) {
    return await NhanVien.findOne({ _id: id, deleted: false }).select(
      "-Password"
    );
  }

  // Cập nhật nhân viên
  static async update(id, data) {
    return await NhanVien.findOneAndUpdate({ _id: id, deleted: false }, data, {
      new: true,
    }).select("-Password");
  }

  // Xóa mềm nhân viên
  static async softDelete(id) {
    return await NhanVien.findOneAndUpdate(
      { _id: id, deleted: false },
      { deleted: true },
      { new: true }
    );
  }

  // Đăng nhập nhân viên
  static async login(email, password) {
    const nv = await NhanVien.findOne({ Email: email });
    // console.log('nv:', nv);
    if (!nv) return null;

    const isMatch = await nv.comparePassword(password);
    // console.log("isMatch:", isMatch);
    if (!isMatch) return null;

    return nv;
  }

  // Tìm nhân viên theo email
  static async findByEmail(email) {
    return await NhanVien.findOne({
      Email: email.toLowerCase().trim(),
      deleted: false,
    });
  }

  // Lấy thông tin profile
  static async getProfile(id) {
    return await NhanVien.findOne({ _id: id, deleted: false }).select(
      "-Password"
    );
  }

  // Cập nhật profile
  static async updateProfile(id, data) {
    const updateData = { ...data };
    delete updateData.Password;
    delete updateData.Email;
    delete updateData.MSNV;
    delete updateData.ChucVu;

    return await NhanVien.findOneAndUpdate(
      { _id: id, deleted: false },
      updateData,
      { new: true }
    ).select("-Password");
  }

  // Đổi mật khẩu
  static async changePassword(id, oldPassword, newPassword) {
    const nv = await NhanVien.findOne({ _id: id, deleted: false });
    if (!nv) return null;

    const isMatch = await nv.comparePassword(oldPassword);
    if (!isMatch) return null;

    nv.Password = newPassword;
    await nv.save();

    return await NhanVien.findById(id).select("-Password");
  }

  // Cập nhật avatar
  static async updateAvatar(id, avatarPath) {
    return await NhanVien.findOneAndUpdate(
      { _id: id, deleted: false },
      { Avatar: avatarPath },
      { new: true }
    ).select("-Password");
  }

  static validateNhanVienData(data) {
    const { HoTenNV, Email, Password, DiaChi, SoDienThoai, ChucVu } = data;

    if (!HoTenNV || !Email || !Password || !DiaChi || !SoDienThoai) {
      throw new Error("Tất cả các trường thông tin là bắt buộc");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      throw new Error("Email không hợp lệ");
    }

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(SoDienThoai)) {
      throw new Error("Số điện thoại không hợp lệ");
    }

    if (ChucVu && !Object.values(ROLE).includes(ChucVu)) {
      throw new Error("Chức vụ không hợp lệ");
    }

    if (Password.length < 6) {
      throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
    }
  }
}

module.exports = NhanVienService;
