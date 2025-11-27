const NhanVienService = require("../services/nhanvien.service");
const DiaChiService = require("../services/diachi.service");

exports.create = async (req, res, next) => {
  try {
    const nv = await NhanVienService.create(req.body);
    res.status(201).json({
      message: "Tạo nhân viên thành công",
      data: nv,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const list = await NhanVienService.findAll();

    const listWithAddress = await Promise.all(
      list.map(async (nv) => {
        const nvObj = nv.toObject();
        if (nv.MaTinh) {
          try {
            nvObj.DiaChiDayDu = await DiaChiService.formatAddress(
              nv.MaPhuong,
              nv.MaQuan,
              nv.MaTinh,
              nv.DiaChiChiTiet
            );
          } catch (error) {
            nvObj.DiaChiDayDu = nv.DiaChiChiTiet || "";
          }
        }
        return nvObj;
      })
    );

    res.json({
      message: "Lấy danh sách nhân viên thành công",
      data: listWithAddress,
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const nv = await NhanVienService.findById(req.params.id);
    if (!nv) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }

    const nvObj = nv.toObject();
    if (nv.MaTinh) {
      try {
        nvObj.DiaChiDayDu = await DiaChiService.formatAddress(
          nv.MaPhuong,
          nv.MaQuan,
          nv.MaTinh,
          nv.DiaChiChiTiet
        );
      } catch (error) {
        nvObj.DiaChiDayDu = nv.DiaChiChiTiet || "";
      }
    }

    res.json({
      message: "Lấy thông tin nhân viên thành công",
      data: nvObj,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await NhanVienService.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }
    res.json({
      message: "Cập nhật nhân viên thành công",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const deleted = await NhanVienService.softDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }
    res.json({
      message: "Xóa nhân viên thành công",
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const nv = await NhanVienService.getProfile(req.user.id);
    if (!nv) {
      return res.status(404).json({ message: "Không tìm thấy thông tin" });
    }

    const nvObj = nv.toObject();
    if (nv.MaTinh) {
      try {
        nvObj.DiaChiDayDu = await DiaChiService.formatAddress(
          nv.MaPhuong,
          nv.MaQuan,
          nv.MaTinh,
          nv.DiaChiChiTiet
        );
      } catch (error) {
        nvObj.DiaChiDayDu = nv.DiaChiChiTiet || "";
      }
    }

    res.json({
      message: "Lấy thông tin profile thành công",
      data: nvObj,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updated = await NhanVienService.updateProfile(req.user.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Cập nhật thất bại" });
    }
    res.json({
      message: "Cập nhật profile thành công",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
    }

    const updated = await NhanVienService.changePassword(
      req.user.id,
      oldPassword,
      newPassword
    );

    if (!updated) {
      return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });
    }

    res.json({
      message: "Đổi mật khẩu thành công",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng chọn ảnh" });
    }

    const avatarPath = `/uploads/${req.file.filename}`;
    const updated = await NhanVienService.updateAvatar(req.user.id, avatarPath);

    if (!updated) {
      return res.status(404).json({ message: "Cập nhật avatar thất bại" });
    }

    res.json({
      message: "Cập nhật avatar thành công",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
