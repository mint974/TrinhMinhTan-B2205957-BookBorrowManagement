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
    MaTinh: { type: String },
    MaQuan: { type: String },
    MaPhuong: { type: String },
    DiaChiChiTiet: { type: String },
    SoDienThoai: { type: String },
    Email: { type: String },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const NhaXuatBan = mongoose.model("NhaXuatBan", NhaXuatBanSchema);
module.exports = NhaXuatBan;
