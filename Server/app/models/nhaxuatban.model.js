const mongoose = require("mongoose");

const NhaXuatBanSchema = new mongoose.Schema(
  {
    MaNXB: {
      type: String,
      unique: true,
      default: function () {
        return "NXB" + Date.now();
      },
    },
    TenNXB: { type: String, required: true },
    DiaChi: { type: String },
    SoDienThoai: { type: String },
    Email: { type: String },
    NguoiTao: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NhanVien",
      required: true,
    },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const NhaXuatBan = mongoose.model("NhaXuatBan", NhaXuatBanSchema);
module.exports = NhaXuatBan;
