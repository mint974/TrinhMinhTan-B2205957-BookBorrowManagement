const mongoose = require("mongoose");

const NhaXuatBanSchema = new mongoose.Schema(
  {
    MaNXB: {
      type: String,
      unique: true,
      default: function () {
        // Tự động tạo MaNXB theo format: NXB + timestamp
        return "NXB" + Date.now();
      },
      TenNXB: { type: String, required: true },
      DiaChi: { type: String },
      SoDienThoai: { type: String },
      Email: { type: String },
      deleted: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);
const NhaXuatBan = mongoose.model("NhaXuatBan", NhaXuatBanSchema);
module.exports = NhaXuatBan;
