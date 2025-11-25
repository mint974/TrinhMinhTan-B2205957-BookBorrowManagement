const router = require("express").Router();
const controller = require("../controllers/media.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Cấu hình multer để upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/media";
    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Tạo tên file duy nhất: timestamp + tên gốc
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname.replace(/\s+/g, "-"));
  },
});

// Filter file types (tùy chọn)
const fileFilter = (req, file, cb) => {
  // Chấp nhận tất cả các loại file
  // Nếu muốn giới hạn, có thể check mimetype ở đây
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // Giới hạn 50MB
  },
});

// Routes
router.get("/statistics", controller.getStatistics); // Thống kê
router.get("/loai/:loaiMedia", controller.getByLoaiMedia); // Lọc theo loại
router.get("/ma/:maMedia", controller.getByMaMedia); // Tìm theo mã
router.get("/download/:id", controller.downloadFile); // Download file
router.get("/", controller.getAll); // Danh sách (có filter & search)
router.get("/:id", controller.getById); // Chi tiết

router.post("/", upload.single("file"), controller.create); // Upload file mới
router.put("/:id", controller.update); // Cập nhật thông tin
router.put("/:id/replace-file", upload.single("file"), controller.replaceFile); // Thay thế file

router.delete("/:id", controller.delete); // Xóa mềm
router.delete("/:id/hard", controller.hardDelete); // Xóa vĩnh viễn

module.exports = router;
