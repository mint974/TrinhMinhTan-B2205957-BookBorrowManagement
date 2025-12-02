const router = require("express").Router();
const controller = require("../controllers/sach.controller");
const auth = require("../middlewares/auth");

router.post("/", auth, controller.create);
router.get("/", auth, controller.getAll);
router.get("/search", auth, controller.search);
router.get("/:id", auth, controller.getById);
router.put("/:id", auth, controller.update);
router.delete("/:id", auth, controller.delete);

module.exports = router;
