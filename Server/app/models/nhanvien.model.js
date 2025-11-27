const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const NhanVienSchema = new mongoose.Schema(
  {
    MSNV: {
      type: String,
      unique: true,
      default: function () {
        // Tự động tạo maNhanVien theo format: NV + timestamp
        return "NV" + Date.now();
      },
    },

    HoTen: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    MaTinh: { type: String, required: true },
    MaQuan: { type: String, default: "" },
    MaPhuong: { type: String, default: "" },
    DiaChiChiTiet: { type: String, default: "" },
    Phai: { type: String, enum: ["Nam", "Nữ"], required: true },
    SoDienThoai: { type: String, required: true },
    ChucVu: { type: String, enum: ["Admin", "NhanVien"], default: "NhanVien" },
    Avatar: { type: String, default: "" },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Mã hóa password trước khi lưu
NhanVienSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.Password = await bcrypt.hash(this.Password, salt);
  next();
});

// So sánh password
NhanVienSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.Password);
};

module.exports = mongoose.model("NhanVien", NhanVienSchema);
