const mongoose = require("mongoose");

const NhanVienSchema = new mongoose.Schema(
  {
    MSS: {
      type: String,
      unique: true,
      default: function () {
        // Tự động tạo maSach theo format: S + timestamp
        return "S" + Date.now();
      },
    },
    TenSach: { type: String, required: true },
    TacGia: { type: String, required: true },
    NhaXuatBan: { type: String, required: true },
    NamXuatBan: { type: Number, required: true },
    TheLoai: { type: String, required: true },
    SoLuong: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
  }
);

const Sach = mongoose.model("Sach", NhanVienSchema);
module.exports = Sach;
