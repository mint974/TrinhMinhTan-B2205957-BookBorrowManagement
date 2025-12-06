const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const DocGiaSchema = new mongoose.Schema(
  {
    MaDocGia: {
      type: String,
      unique: true,
      default: function () {
        // Tự động tạo MaDocGia theo format: DG + timestamp
        return "DG" + Date.now();
      },
    },
    HoLot: { type: String, required: true },
    Ten: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    NgaySinh: { type: Date, required: true },
    GioiTinh: { type: String, enum: ["Nam", "Nữ"], required: true },
    MaTinh: { type: String },
    MaQuan: { type: String },
    MaPhuong: { type: String },
    DiaChiChiTiet: { type: String },
    DienThoai: { type: String, required: true },
    Avatar: { type: String, default: "" },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Mã hóa password trước khi lưu
DocGiaSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.Password = await bcrypt.hash(this.Password, salt);
  next();
});

// So sánh password
DocGiaSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.Password);
};

module.exports = mongoose.model("DocGia", DocGiaSchema);
