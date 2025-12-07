const router = require("express").Router();
const controller = require("../controllers/theodoimuonsach.controller");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

// Route công khai (độc giả có thể mượn sách)
router.post("/", auth, controller.create);

// Route lấy lịch sử mượn sách của độc giả
router.get("/docgia/:docGiaId", auth, controller.getByDocGia);

// Route cho admin
router.get("/", auth, admin, controller.getAll);
router.get("/statistics", auth, admin, controller.getStatistics);
router.get("/check-overdue", auth, admin, controller.checkOverdue);
router.get("/:id", auth, admin, controller.getById);
router.put("/:id/status", auth, admin, controller.updateStatus);
router.delete("/:id", auth, admin, controller.delete);

module.exports = router;
