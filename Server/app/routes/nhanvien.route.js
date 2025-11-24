const router = require("express").Router();
const controller = require("../controllers/nhanvien.controller");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const authController = require("../controllers/auth.controller");

// NHÂN VIÊN — Đăng nhập
router.post("/login", authController.login);

// ADMIN — CRUD nhân viên
router.post("/", auth, admin, controller.create);
router.get("/", auth, admin, controller.getAll);
router.get("/:id", auth, admin, controller.getById);
router.put("/:id", auth, admin, controller.update);
router.delete("/:id", auth, admin, controller.delete);

module.exports = router;
