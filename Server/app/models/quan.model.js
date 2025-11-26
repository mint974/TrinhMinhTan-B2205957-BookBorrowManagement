const mongoose = require("mongoose");

const QuanSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nameEn: { type: String },
    fullName: { type: String },
    fullNameEn: { type: String },
    codeName: { type: String },
    MaTinh: { type: String, required: true }, // liên kết tỉnh
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quan", QuanSchema);
