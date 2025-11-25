const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    MaMedia: {
      type: String,
      unique: true,
      default: function () {
        // Tự động tạo MaMedia theo format: MD + timestamp
        return "MD" + Date.now();
      },
    },
    TenMedia: { type: String, required: true },
    LoaiMedia: { type: String, required: true },
    file: { type: String, required: true },
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

const Media = mongoose.model("Media", MediaSchema);
module.exports = Media;
