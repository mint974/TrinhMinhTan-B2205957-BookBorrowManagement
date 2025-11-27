const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const controller = require("../controllers/nhanvien.controller");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const authController = require("../controllers/auth.controller");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif)"));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});

router.post("/login", authController.login);

router.get("/profile", auth, controller.getProfile);
router.put("/profile", auth, controller.updateProfile);
router.put("/profile/password", auth, controller.changePassword);
router.put(
  "/profile/avatar",
  auth,
  upload.single("avatar"),
  controller.updateAvatar
);

router.get("/", auth, controller.getAll);
router.get("/:id", auth, controller.getById);
router.post("/", auth, admin, controller.create);
router.put("/:id", auth, admin, controller.update);
router.delete("/:id", auth, admin, controller.delete);

module.exports = router;
