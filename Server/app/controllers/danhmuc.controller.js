const DanhMucService = require("../services/danhmuc.service");

exports.create = async (req, res) => {
  try {
    // Lấy NguoiTao từ user đã đăng nhập (từ middleware auth)
    const data = {
      ...req.body,
      NguoiTao: req.user.id
    };
    const category = await DanhMucService.create(data);
    res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const list = await DanhMucService.findAll();
    res.json({
      success: true,
      data: list
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const category = await DanhMucService.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await DanhMucService.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    res.json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await DanhMucService.softDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    res.json({
      success: true,
      message: 'Xóa danh mục thành công',
      data: deleted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
