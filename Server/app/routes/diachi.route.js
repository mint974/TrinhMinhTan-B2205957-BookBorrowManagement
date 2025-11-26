const router = require("express").Router();
const controller = require("../controllers/diachi.controller");

// Đồng bộ dữ liệu từ API
router.post("/sync", controller.sync);

// Thống kê
router.get("/statistics", controller.getStatistics);
router.get("/statistics-quan", controller.getStatsByQuan);

// Tìm kiếm
router.get("/tinh/search", controller.searchTinh);
router.get("/quan/search", controller.searchQuan);
router.get("/phuong/search", controller.searchPhuong);

// Lấy danh sách tỉnh
router.get("/tinh", controller.getAllTinh);
router.get("/tinh/:code", controller.getTinhByCode);

// Lấy danh sách quận/huyện
router.get("/quan/tinh/:maTinh", controller.getQuanByTinh);
router.get("/quan/:code", controller.getQuanByCode);

// Lấy danh sách phường/xã
router.get("/phuong/quan/:maQuan", controller.getPhuongByQuan);
router.get("/phuong/:code", controller.getPhuongByCode);

// Format địa chỉ
router.post("/format", controller.formatAddress);

module.exports = router;
