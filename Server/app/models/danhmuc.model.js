const mongoose = require("mongoose");

const DanhMucSchema = new mongoose.Schema(
  {
    MaDanhMuc: {
      type: String,
      unique: true,
      default: function () {
        // Tự động tạo MaDanhMuc theo format: DM + timestamp
        return "DM" + Date.now();
      },
    },
    TenDanhMuc: { type: String, required: true },
    MoTa: { type: String, default: "" },
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

const DanhMuc = mongoose.model("DanhMuc", DanhMucSchema);
module.exports = DanhMuc;
