const router = require("express").Router();
const controller = require("../controllers/docgia.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middlewares/auth");

// Cấu hình multer để upload avatar độc giả
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/avatar";
    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      "avatar-" +
        uniqueSuffix +
        path.extname(file.originalname).toLowerCase()
    );
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
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
});

// Routes
// Public routes (không cần auth)
router.post("/register", controller.register); // Đăng ký độc giả mới
router.post("/login", controller.login); // Đăng nhập

// Profile routes (cho độc giả đang đăng nhập)
router.get("/profile", auth, controller.getProfile); // Lấy thông tin profile
router.put("/profile", auth, controller.updateProfile); // Cập nhật profile
router.put("/profile/avatar", auth, upload.single("Avatar"), controller.uploadProfileAvatar); // Upload avatar
router.put("/profile/password", auth, controller.updateProfilePassword); // Đổi mật khẩu

// Protected routes (cần auth)
router.get("/statistics", auth, controller.getStatistics); // Thống kê
router.get("/select", auth, controller.getAllForSelect); // Danh sách cho dropdown
router.get("/", auth, controller.getAll); // Danh sách (có filter & search)
router.get("/:id", auth, controller.getById); // Chi tiết

router.post("/", auth, upload.single("Avatar"), controller.create); // Tạo độc giả mới (admin)
router.put("/:id", auth, upload.single("Avatar"), controller.update); // Cập nhật thông tin
router.put("/:id/password", auth, controller.updatePassword); // Cập nhật mật khẩu
router.put("/:id/ban", auth, controller.ban); // Cấm độc giả
router.put("/:id/unban", auth, controller.unban); // Gỡ cấm độc giả
router.put(
  "/:id/avatar",
  auth,
  upload.single("Avatar"),
  controller.uploadAvatar
); // Upload/thay đổi avatar

router.delete("/:id/avatar", auth, controller.deleteAvatar); // Xóa avatar
router.delete("/:id", auth, controller.delete); // Xóa mềm
router.delete("/:id/hard", auth, controller.hardDelete); // Xóa vĩnh viễn

module.exports = router;

