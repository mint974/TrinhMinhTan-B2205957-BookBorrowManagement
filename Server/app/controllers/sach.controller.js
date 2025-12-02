const SachService = require("../services/sach.service");

exports.create = async (req, res) => {
  try {
    const data = {
      ...req.body,
      NguoiTao: req.user.id
    };
    const sach = await SachService.create(data);
    res.status(201).json({
      success: true,
      message: 'Tạo sách thành công',
      data: sach
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
    const list = await SachService.findAll();
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
    const sach = await SachService.findById(req.params.id);
    if (!sach) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách'
      });
    }
    res.json({
      success: true,
      data: sach
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
    const updated = await SachService.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách'
      });
    }
    res.json({
      success: true,
      message: 'Cập nhật sách thành công',
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
    const deleted = await SachService.softDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sách'
      });
    }
    res.json({
      success: true,
      message: 'Xóa sách thành công',
      data: deleted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập từ khóa tìm kiếm'
      });
    }
    const list = await SachService.search(q);
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
