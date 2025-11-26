const mongoose = require("mongoose");

const TinhSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nameEn: { type: String },
    fullName: { type: String },
    fullNameEn: { type: String },
    codeName: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tinh", TinhSchema);
