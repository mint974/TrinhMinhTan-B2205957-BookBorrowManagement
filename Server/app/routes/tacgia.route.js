const router = require("express").Router();
const controller = require("../controllers/tacgia.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middlewares/auth");

// Cấu hình multer để upload hình ảnh tác giả
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/tacgia";
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

// Filter chỉ cho phép file hình ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(
      new Error("Chỉ cho phép upload file hình ảnh (jpeg, jpg, png, gif, webp)")
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB cho hình ảnh
  },
});

// Routes
router.get("/statistics", auth, controller.getStatistics); // Thống kê
router.get("/select", controller.getAllForSelect); // Danh sách cho dropdown (không cần auth)
router.get("/quoctich/:quocTich", auth, controller.getByQuocTich); // Lọc theo quốc tịch
router.get("/", auth, controller.getAll); // Danh sách (có filter & search)
router.get("/:id", auth, controller.getById); // Chi tiết

router.post("/", auth, upload.single("HinhAnh"), controller.create); // Tạo tác giả mới
router.put("/:id", auth, controller.update); // Cập nhật thông tin
router.put(
  "/:id/image",
  auth,
  upload.single("HinhAnh"),
  controller.uploadImage
); // Upload/thay đổi hình ảnh

router.delete("/:id/image", auth, controller.deleteImage); // Xóa hình ảnh
router.delete("/:id", auth, controller.delete); // Xóa mềm
router.delete("/:id/hard", auth, controller.hardDelete); // Xóa vĩnh viễn

module.exports = router;
