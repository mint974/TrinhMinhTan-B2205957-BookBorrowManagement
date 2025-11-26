const DiaChiService = require("../services/diachi.service");
const ApiError = require("../api-error");

// Đồng bộ dữ liệu từ API
exports.sync = async (req, res, next) => {
  try {
    const result = await DiaChiService.syncAll();
    res.json({
      success: true,
      message: "Đồng bộ dữ liệu địa chỉ thành công!",
      stats: result.stats,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách tỉnh/thành phố
exports.getAllTinh = async (req, res, next) => {
  try {
    const data = await DiaChiService.getAllTinh();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy tỉnh theo code
exports.getTinhByCode = async (req, res, next) => {
  try {
    const tinh = await DiaChiService.getTinhByCode(req.params.code);
    if (!tinh) {
      return next(new ApiError(404, "Không tìm thấy tỉnh/thành phố"));
    }
    res.json({
      success: true,
      data: tinh,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách quận/huyện theo tỉnh
exports.getQuanByTinh = async (req, res, next) => {
  try {
    const data = await DiaChiService.getQuanByTinh(req.params.maTinh);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy quận theo code
exports.getQuanByCode = async (req, res, next) => {
  try {
    const quan = await DiaChiService.getQuanByCode(req.params.code);
    if (!quan) {
      return next(new ApiError(404, "Không tìm thấy quận/huyện"));
    }
    res.json({
      success: true,
      data: quan,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách phường/xã theo quận
exports.getPhuongByQuan = async (req, res, next) => {
  try {
    const data = await DiaChiService.getPhuongByQuan(req.params.maQuan);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy phường theo code
exports.getPhuongByCode = async (req, res, next) => {
  try {
    const phuong = await DiaChiService.getPhuongByCode(req.params.code);
    if (!phuong) {
      return next(new ApiError(404, "Không tìm thấy phường/xã"));
    }
    res.json({
      success: true,
      data: phuong,
    });
  } catch (error) {
    next(error);
  }
};

// Tạo địa chỉ hoàn chỉnh
exports.formatAddress = async (req, res, next) => {
  try {
    const { phuongCode, quanCode, tinhCode, diaChiChiTiet } = req.body;

    if (!tinhCode) {
      return next(new ApiError(400, "Thiếu thông tin: tinhCode là bắt buộc"));
    }

    const address = await DiaChiService.formatAddress(
      phuongCode,
      quanCode,
      tinhCode,
      diaChiChiTiet
    );

    res.json({
      success: true,
      address,
    });
  } catch (error) {
    next(error);
  }
};

// Tìm kiếm tễnh
exports.searchTinh = async (req, res, next) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return next(new ApiError(400, "Vui lòng nhập từ khóa tìm kiếm"));
    }

    const data = await DiaChiService.searchTinh(keyword);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Tìm kiếm quận/huyện
exports.searchQuan = async (req, res, next) => {
  try {
    const { keyword, maTinh } = req.query;
    if (!keyword) {
      return next(new ApiError(400, "Vui lòng nhập từ khóa tìm kiếm"));
    }

    const data = await DiaChiService.searchQuan(keyword, maTinh);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Tìm kiếm phường
exports.searchPhuong = async (req, res, next) => {
  try {
    const { keyword, maQuan } = req.query;
    if (!keyword) {
      return next(new ApiError(400, "Vui lòng nhập từ khóa tìm kiếm"));
    }

    const data = await DiaChiService.searchPhuong(keyword, maQuan);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Thống kê
exports.getStatistics = async (req, res, next) => {
  try {
    const data = await DiaChiService.getStatsByTinh();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Thống kê phường theo quận
exports.getStatsByQuan = async (req, res, next) => {
  try {
    const data = await DiaChiService.getStatsByQuan();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
