import mongoose from "mongoose";

const docgiaSchema = new mongoose.Schema({
  MaDocGia: { type: String, required: true, unique: true },
  HoLot: String,
  Ten: String,
  NgaySinh: Date,
  Phai: String,
  DiaChi: String,
  DienThoai: String,
});

export default mongoose.model("DocGia", docgiaSchema);
