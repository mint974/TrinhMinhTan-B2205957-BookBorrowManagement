const Sach = require("../models/sach.model");

class SachService {
  // Tạo sách
  static async create(data) {
    const newSach = await Sach.create(data);
    return await Sach.findById(newSach._id)
      .populate('NhaXuatBan', 'TenNXB MaNXB')
      .populate('DanhMuc', 'TenDanhMuc MaDanhMuc')
      .populate('TacGia', 'HoTen ButDanh HinhAnh')
      .populate('NguoiTao', 'HoTen Email');
  }

  // Lấy danh sách sách (không lấy bản đã xóa)
  static async findAll() {
    return await Sach.find({ deleted: false })
      .populate('NhaXuatBan', 'TenNXB MaNXB')
      .populate('DanhMuc', 'TenDanhMuc MaDanhMuc')
      .populate('TacGia', 'HoTen ButDanh HinhAnh')
      .populate('NguoiTao', 'HoTen Email')
      .sort({ createdAt: -1 });
  }

  // Lấy sách theo ID
  static async findById(id) {
    return await Sach.findOne({ _id: id, deleted: false })
      .populate('NhaXuatBan', 'TenNXB MaNXB DiaChi')
      .populate('DanhMuc', 'TenDanhMuc MaDanhMuc MoTa')
      .populate('TacGia', 'HoTen ButDanh QuocTich NamSinh HinhAnh')
      .populate('NguoiTao', 'HoTen Email');
  }

  // Cập nhật sách
  static async update(id, data) {
    return await Sach.findOneAndUpdate({ _id: id, deleted: false }, data, {
      new: true,
    })
      .populate('NhaXuatBan', 'TenNXB MaNXB')
      .populate('DanhMuc', 'TenDanhMuc MaDanhMuc')
      .populate('TacGia', 'HoTen ButDanh HinhAnh')
      .populate('NguoiTao', 'HoTen Email');
  }

  // Xóa mềm sách
  static async softDelete(id) {
    return await Sach.findOneAndUpdate(
      { _id: id, deleted: false },
      { deleted: true },
      { new: true }
    );
  }

  // Tìm kiếm sách
  static async search(query) {
    const searchRegex = new RegExp(query, 'i');
    return await Sach.find({
      deleted: false,
      $or: [
        { TenSach: searchRegex },
        { MaSach: searchRegex }
      ]
    })
      .populate('NhaXuatBan', 'TenNXB MaNXB')
      .populate('DanhMuc', 'TenDanhMuc MaDanhMuc')
      .populate('TacGia', 'HoTen ButDanh HinhAnh')
      .populate('NguoiTao', 'HoTen Email')
      .sort({ createdAt: -1 });
  }
}

module.exports = SachService;
