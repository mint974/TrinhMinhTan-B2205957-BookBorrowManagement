const mongoose = require("mongoose");

const PhuongSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nameEn: { type: String },
    fullName: { type: String },
    fullNameEn: { type: String },
    codeName: { type: String },
    MaQuan: { type: String, required: true }, // liên kết quận/huyện
  },
  { timestamps: true }
);

module.exports = mongoose.model("Phuong", PhuongSchema);
