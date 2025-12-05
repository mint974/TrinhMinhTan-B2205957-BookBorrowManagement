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
    filePath: { type: String, default: "" },
    fileType: { type: String, required: true },
    fileSize: { type: Number },
    Sach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sach",
      default: null,
    },
    MoTa: { type: String, default: "" },
    deleted: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  }
);

const Media = mongoose.model("Media", MediaSchema);
module.exports = Media;
