const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/QLMuonSach')
  .then(() => console.log('Kết nối MongoDB thành công'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

const Sach = require('../app/models/sach.model');
const NhaXuatBan = require('../app/models/nhaxuatban.model');
const DanhMuc = require('../app/models/danhmuc.model');
const NhanVien = require('../app/models/nhanvien.model');

// Danh sách NXB Việt Nam
const nxbList = [
  { TenNXB: 'NXB Trẻ', DiaChi: '161B Lý Chính Thắng, Q.3, TP.HCM', SoDienThoai: '0283930000', Email: 'info@nxbtre.com.vn' },
  { TenNXB: 'NXB Kim Đồng', DiaChi: '55 Quang Trung, Nguyễn Du, Hai Bà Trưng, Hà Nội', SoDienThoai: '0243942356', Email: 'info@nxbkimdong.com.vn' },
  { TenNXB: 'NXB Văn Học', DiaChi: '18 Nguyễn Trường Tộ, Ba Đình, Hà Nội', SoDienThoai: '0243822341', Email: 'info@nxbvanhoc.com.vn' },
  { TenNXB: 'NXB Lao Động', DiaChi: '175 Giảng Võ, Đống Đa, Hà Nội', SoDienThoai: '0243851632', Email: 'nxblaodong@gmail.com' },
  { TenNXB: 'NXB Thanh Niên', DiaChi: '64 Bà Triệu, Hoàn Kiếm, Hà Nội', SoDienThoai: '0243942514', Email: 'info@nxbthanhnien.vn' },
  { TenNXB: 'NXB Phụ Nữ', DiaChi: '39 Hàng Chuối, Hai Bà Trưng, Hà Nội', SoDienThoai: '0243971024', Email: 'info@nxbphunu.com.vn' },
];

// Danh sách danh mục
const danhMucList = [
  { TenDanhMuc: 'Văn học Việt Nam', MoTa: 'Sách văn học của các tác giả Việt Nam' },
  { TenDanhMuc: 'Văn học nước ngoài', MoTa: 'Sách văn học được dịch từ nước ngoài' },
  { TenDanhMuc: 'Kinh tế', MoTa: 'Sách về kinh tế, tài chính, kinh doanh' },
  { TenDanhMuc: 'Khoa học công nghệ', MoTa: 'Sách về khoa học, công nghệ' },
  { TenDanhMuc: 'Kỹ năng sống', MoTa: 'Sách phát triển bản thân, kỹ năng mềm' },
  { TenDanhMuc: 'Lịch sử', MoTa: 'Sách về lịch sử Việt Nam và thế giới' },
  { TenDanhMuc: 'Thiếu nhi', MoTa: 'Sách dành cho trẻ em' },
];

// Dữ liệu sách mẫu từ Open Library và Google Books
const sachMau = [
  { TenSach: 'Đất Nước Đứng Lên', TacGia: 'Nguyễn Ngọc Tư', NamXuatBan: 2021, DonGia: 95000, MoTa: 'Tác phẩm văn học đương đại Việt Nam', nxb: 'NXB Trẻ', danhmuc: 'Văn học Việt Nam', SoQuyen: 50 },
  { TenSach: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', TacGia: 'Nguyễn Nhật Ánh', NamXuatBan: 2010, DonGia: 120000, MoTa: 'Tiểu thuyết về tuổi thơ miền Trung', nxb: 'NXB Trẻ', danhmuc: 'Văn học Việt Nam', SoQuyen: 100 },
  { TenSach: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ', TacGia: 'Nguyễn Nhật Ánh', NamXuatBan: 2012, DonGia: 95000, MoTa: 'Tác phẩm về kỷ niệm tuổi thơ', nxb: 'NXB Trẻ', danhmuc: 'Văn học Việt Nam', SoQuyen: 80 },
  { TenSach: 'Mắt Biếc', TacGia: 'Nguyễn Nhật Ánh', NamXuatBan: 2007, DonGia: 110000, MoTa: 'Câu chuyện tình yêu thơ ngây', nxb: 'NXB Trẻ', danhmuc: 'Văn học Việt Nam', SoQuyen: 90 },
  { TenSach: 'Cánh Đồng Bất Tận', TacGia: 'Nguyễn Ngọc Tư', NamXuatBan: 2005, DonGia: 85000, MoTa: 'Truyện ngắn về miền Tây sông nước', nxb: 'NXB Trẻ', danhmuc: 'Văn học Việt Nam', SoQuyen: 60 },
  
  { TenSach: 'Nhà Giả Kim', TacGia: 'Paulo Coelho', NamXuatBan: 2013, DonGia: 79000, MoTa: 'Tác phẩm triết lý nổi tiếng thế giới', nxb: 'NXB Văn Học', danhmuc: 'Văn học nước ngoài', SoQuyen: 120 },
  { TenSach: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', TacGia: 'Rosie Nguyễn', NamXuatBan: 2018, DonGia: 89000, MoTa: 'Sách về phát triển bản thân', nxb: 'NXB Thanh Niên', danhmuc: 'Kỹ năng sống', SoQuyen: 150 },
  { TenSach: 'Đắc Nhân Tâm', TacGia: 'Dale Carnegie', NamXuatBan: 2011, DonGia: 99000, MoTa: 'Nghệ thuật giao tiếp và ứng xử', nxb: 'NXB Lao Động', danhmuc: 'Kỹ năng sống', SoQuyen: 200 },
  { TenSach: 'Người Đua Diều', TacGia: 'Khaled Hosseini', NamXuatBan: 2015, DonGia: 125000, MoTa: 'Tiểu thuyết về tình bạn và gia đình', nxb: 'NXB Văn Học', danhmuc: 'Văn học nước ngoài', SoQuyen: 70 },
  { TenSach: '1984', TacGia: 'George Orwell', NamXuatBan: 2019, DonGia: 135000, MoTa: 'Tiểu thuyết khoa học viễn tưởng chính trị', nxb: 'NXB Văn Học', danhmuc: 'Văn học nước ngoài', SoQuyen: 60 },
  
  { TenSach: 'Sapiens - Lược Sử Loài Người', TacGia: 'Yuval Noah Harari', NamXuatBan: 2020, DonGia: 189000, MoTa: 'Lịch sử tiến hóa của loài người', nxb: 'NXB Lao Động', danhmuc: 'Lịch sử', SoQuyen: 100 },
  { TenSach: 'Homo Deus', TacGia: 'Yuval Noah Harari', NamXuatBan: 2021, DonGia: 199000, MoTa: 'Tương lai của nhân loại', nxb: 'NXB Lao Động', danhmuc: 'Khoa học công nghệ', SoQuyen: 80 },
  { TenSach: 'Tư Duy Nhanh Và Chậm', TacGia: 'Daniel Kahneman', NamXuatBan: 2019, DonGia: 169000, MoTa: 'Khoa học về tư duy và ra quyết định', nxb: 'NXB Lao Động', danhmuc: 'Khoa học công nghệ', SoQuyen: 90 },
  { TenSach: 'Nghệ Thuật Bán Hàng Vĩ Đại', TacGia: 'Brian Tracy', NamXuatBan: 2017, DonGia: 139000, MoTa: 'Kỹ năng bán hàng chuyên nghiệp', nxb: 'NXB Lao Động', danhmuc: 'Kinh tế', SoQuyen: 75 },
  { TenSach: 'Dạy Con Làm Giàu', TacGia: 'Robert Kiyosaki', NamXuatBan: 2016, DonGia: 119000, MoTa: 'Giáo dục tài chính cho con trẻ', nxb: 'NXB Lao Động', danhmuc: 'Kinh tế', SoQuyen: 110 },
  
  { TenSach: 'Harry Potter Và Hòn Đá Phù Thủy', TacGia: 'J.K. Rowling', NamXuatBan: 2018, DonGia: 159000, MoTa: 'Phần 1 của series Harry Potter', nxb: 'NXB Kim Đồng', danhmuc: 'Thiếu nhi', SoQuyen: 150 },
  { TenSach: 'Doraemon - Tập 1', TacGia: 'Fujiko F. Fujio', NamXuatBan: 2020, DonGia: 25000, MoTa: 'Truyện tranh thiếu nhi Nhật Bản', nxb: 'NXB Kim Đồng', danhmuc: 'Thiếu nhi', SoQuyen: 200 },
  { TenSach: 'Dế Mèn Phiêu Lưu Ký', TacGia: 'Tô Hoài', NamXuatBan: 2015, DonGia: 45000, MoTa: 'Tác phẩm văn học thiếu nhi Việt Nam', nxb: 'NXB Kim Đồng', danhmuc: 'Thiếu nhi', SoQuyen: 180 },
  { TenSach: 'Thần Đồng Đất Việt', TacGia: 'Nhiều tác giả', NamXuatBan: 2019, DonGia: 65000, MoTa: 'Những câu chuyện lịch sử Việt Nam', nxb: 'NXB Kim Đồng', danhmuc: 'Thiếu nhi', SoQuyen: 130 },
  { TenSach: 'Tôi Là Bêtô', TacGia: 'Nguyễn Nhật Ánh', NamXuatBan: 2014, DonGia: 75000, MoTa: 'Truyện thiếu nhi về tình bạn', nxb: 'NXB Trẻ', danhmuc: 'Thiếu nhi', SoQuyen: 95 },
  
  { TenSach: 'Lịch Sử Việt Nam', TacGia: 'Nhiều tác giả', NamXuatBan: 2020, DonGia: 250000, MoTa: 'Lịch sử dân tộc Việt Nam qua các thời kỳ', nxb: 'NXB Văn Học', danhmuc: 'Lịch sử', SoQuyen: 50 },
  { TenSach: 'Chiến Tranh Và Hòa Bình', TacGia: 'Leo Tolstoy', NamXuatBan: 2017, DonGia: 299000, MoTa: 'Tác phẩm văn học lịch sử nổi tiếng', nxb: 'NXB Văn Học', danhmuc: 'Văn học nước ngoài', SoQuyen: 40 },
  { TenSach: 'Kinh Tế Học Vĩ Mô', TacGia: 'N. Gregory Mankiw', NamXuatBan: 2021, DonGia: 285000, MoTa: 'Giáo trình kinh tế học cơ bản', nxb: 'NXB Lao Động', danhmuc: 'Kinh tế', SoQuyen: 60 },
  { TenSach: 'Thinking, Fast and Slow', TacGia: 'Daniel Kahneman', NamXuatBan: 2022, DonGia: 199000, MoTa: 'Tư duy hệ thống', nxb: 'NXB Lao Động', danhmuc: 'Khoa học công nghệ', SoQuyen: 70 },
  { TenSach: 'Thói Quen Nguyên Tử', TacGia: 'James Clear', NamXuatBan: 2020, DonGia: 149000, MoTa: 'Xây dựng thói quen tốt, phá vỡ thói quen xấu', nxb: 'NXB Thanh Niên', danhmuc: 'Kỹ năng sống', SoQuyen: 160 },
];

async function seedData() {
  try {
    // Lấy admin user để làm NguoiTao
    const admin = await NhanVien.findOne({ ChucVu: 'Admin' });
    if (!admin) {
      console.error('Không tìm thấy tài khoản Admin. Vui lòng tạo tài khoản Admin trước.');
      process.exit(1);
    }
    // 1. Import Nhà xuất bản
    const nxbMap = {};
    for (const nxb of nxbList) {
      let existing = await NhaXuatBan.findOne({ TenNXB: nxb.TenNXB });
      if (!existing) {
        existing = await NhaXuatBan.create({
          ...nxb,
          NguoiTao: admin._id
        });
        console.log(`Đã tạo: ${nxb.TenNXB}`);
      } else {
        console.log(`Đã tồn tại: ${nxb.TenNXB}`);
      }
      nxbMap[nxb.TenNXB] = existing._id;
    }

    // 2. Import Danh mục
    const dmMap = {};
    for (const dm of danhMucList) {
      let existing = await DanhMuc.findOne({ TenDanhMuc: dm.TenDanhMuc });
      if (!existing) {
        existing = await DanhMuc.create({
          ...dm,
          NguoiTao: admin._id
        });
        console.log(`Đã tạo: ${dm.TenDanhMuc}`);
      } else {
        console.log(`Đã tồn tại: ${dm.TenDanhMuc}`);
      }
      dmMap[dm.TenDanhMuc] = existing._id;
    }

    // 3. Import Sách
    let created = 0;
    let skipped = 0;
    
    for (const sach of sachMau) {
      const existing = await Sach.findOne({ TenSach: sach.TenSach });
      if (!existing) {
        await Sach.create({
          TenSach: sach.TenSach,
          TacGia: sach.TacGia,
          NhaXuatBan: nxbMap[sach.nxb],
          DanhMuc: dmMap[sach.danhmuc],
          NamXuatBan: sach.NamXuatBan,
          SoQuyen: sach.SoQuyen,
          DonGia: sach.DonGia,
          MoTa: sach.MoTa,
          NguoiTao: admin._id
        });
        console.log(`Đã tạo: ${sach.TenSach}`);
        created++;
      } else {
        console.log(`Đã tồn tại: ${sach.TenSach}`);
        skipped++;
      }
    }
    process.exit(0);
  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
}

// Chạy script
seedData();
