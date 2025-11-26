const mongoose = require("mongoose");

const TacGiaSchema = new mongoose.Schema(
  {
    HoTen: { type: String, required: true },
    ButDanh: { type: String },

    NamSinh: { type: Number },
    NamMat: { type: Number },

    QuocTich: { type: String },
    HinhAnh: { type: String },

    TieuSu: { type: String },

    deleted: { type: Boolean, default: false },
    NguoiTao: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NhanVien",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TacGia = mongoose.model("TacGia", TacGiaSchema);
module.exports = TacGia;
