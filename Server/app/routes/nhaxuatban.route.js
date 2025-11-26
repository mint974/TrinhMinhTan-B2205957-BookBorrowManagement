const router = require("express").Router();
const controller = require("../controllers/nhaxuatban.controller");
const auth = require("../middlewares/auth");

router.get("/select", controller.getAllForSelect);
router.get("/ma/:maNXB", auth, controller.getByMaNXB);
router.get("/", auth, controller.getAll);
router.get("/:id", auth, controller.getById);

router.post("/", auth, controller.create);
router.put("/:id", auth, controller.update);

router.delete("/:id", auth, controller.delete);
router.delete("/:id/hard", auth, controller.hardDelete);

module.exports = router;
