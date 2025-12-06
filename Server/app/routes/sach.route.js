const router = require("express").Router();
const controller = require("../controllers/sach.controller");
const auth = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Cấu hình Multer để upload ảnh bìa sách
const uploadDir = "uploads/sach";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif)"));
    }
  },
});

router.post("/", auth, upload.single("AnhBia"), controller.create);
router.get("/", auth, controller.getAll);
router.get("/search", auth, controller.search);
router.get("/:id", auth, controller.getById);
router.put("/:id", auth, upload.single("AnhBia"), controller.update);
router.delete("/:id", auth, controller.delete);

module.exports = router;
