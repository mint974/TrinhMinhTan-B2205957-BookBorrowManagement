const mongoose = require("mongoose");

const SachSchema = new mongoose.Schema(
  {
    MaSach: {
      type: String,
      unique: true,
      default: function () {
        return "S" + Date.now();
      },
    },
    TenSach: { type: String, required: true },
    NhaXuatBan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NhaXuatBan",
      required: true,
    },
    DanhMuc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DanhMuc",
      required: true,
    },
    NamXuatBan: { type: Number, required: true },
    TacGia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TacGia",
      required: true,
    },
    SoQuyen: { type: Number, required: true, min: 0 },
    DonGia: { type: Number, required: true, min: 0 },
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field để lấy danh sách media
SachSchema.virtual('medias', {
  ref: 'Media',
  localField: '_id',
  foreignField: 'Sach',
  match: { deleted: false }
});

const Sach = mongoose.model("Sach", SachSchema);
module.exports = Sach;
