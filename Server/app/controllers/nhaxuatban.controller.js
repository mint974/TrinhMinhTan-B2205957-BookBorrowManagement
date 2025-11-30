const NhaXuatBanService = require("../services/nhaxuatban.service");
const DiaChiService = require("../services/diachi.service");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  try {
    const {
      TenNXB,
      MaTinh,
      MaQuan,
      MaPhuong,
      DiaChiChiTiet,
      SoDienThoai,
      Email,
    } = req.body;

    if (!TenNXB) {
      return next(new ApiError(400, "Thiếu thông tin: TenNXB là bắt buộc"));
    }

    const nxbData = {
      TenNXB,
      MaTinh: MaTinh || "",
      MaQuan: MaQuan || "",
      MaPhuong: MaPhuong || "",
      DiaChiChiTiet: DiaChiChiTiet || "",
      SoDienThoai: SoDienThoai || "",
      Email: Email || "",
      NguoiTao: req.user.id,
    };

    const nxb = await NhaXuatBanService.create(nxbData);
    res.status(201).json({
      success: true,
      message: "Tạo nhà xuất bản thành công",
      data: nxb,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const result = await NhaXuatBanService.findAll(req.query);

    // Format địa chỉ đầy đủ cho từng nhà xuất bản
    const listWithAddress = await Promise.all(
      result.data.map(async (nxb) => {
        const nxbObj = nxb.toObject();
        if (nxb.MaTinh) {
          try {
            nxbObj.DiaChiDayDu = await DiaChiService.formatAddress(
              nxb.MaPhuong,
              nxb.MaQuan,
              nxb.MaTinh,
              nxb.DiaChiChiTiet
            );
          } catch (error) {
            nxbObj.DiaChiDayDu = nxb.DiaChiChiTiet || "";
          }
        }
        return nxbObj;
      })
    );

    res.json({
      success: true,
      data: listWithAddress,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllForSelect = async (req, res, next) => {
  try {
    const data = await NhaXuatBanService.getAllForSelect();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const nxb = await NhaXuatBanService.findById(req.params.id);
    if (!nxb) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
    }

    const nxbObj = nxb.toObject();
    if (nxb.MaTinh) {
      try {
        nxbObj.DiaChiDayDu = await DiaChiService.formatAddress(
          nxb.MaPhuong,
          nxb.MaQuan,
          nxb.MaTinh,
          nxb.DiaChiChiTiet
        );
      } catch (error) {
        nxbObj.DiaChiDayDu = nxb.DiaChiChiTiet || "";
      }
    }

    res.json({
      success: true,
      data: nxbObj,
    });
  } catch (error) {
    next(error);
  }
};

exports.getByMaNXB = async (req, res, next) => {
  try {
    const nxb = await NhaXuatBanService.findByMaNXB(req.params.maNXB);
    if (!nxb) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
    }
    res.json({
      success: true,
      data: nxb,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const {
      TenNXB,
      MaTinh,
      MaQuan,
      MaPhuong,
      DiaChiChiTiet,
      SoDienThoai,
      Email,
    } = req.body;
    const updateData = {};

    if (TenNXB) updateData.TenNXB = TenNXB;
    if (MaTinh !== undefined) updateData.MaTinh = MaTinh;
    if (MaQuan !== undefined) updateData.MaQuan = MaQuan;
    if (MaPhuong !== undefined) updateData.MaPhuong = MaPhuong;
    if (DiaChiChiTiet !== undefined) updateData.DiaChiChiTiet = DiaChiChiTiet;
    if (SoDienThoai !== undefined) updateData.SoDienThoai = SoDienThoai;
    if (Email !== undefined) updateData.Email = Email;

    const updated = await NhaXuatBanService.update(req.params.id, updateData);
    if (!updated) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản để cập nhật"));
    }

    res.json({
      success: true,
      message: "Cập nhật nhà xuất bản thành công",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const deleted = await NhaXuatBanService.softDelete(req.params.id);
    if (!deleted) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản để xóa"));
    }
    res.json({
      success: true,
      message: "Xóa nhà xuất bản thành công",
    });
  } catch (error) {
    next(error);
  }
};

exports.hardDelete = async (req, res, next) => {
  try {
    const nxb = await NhaXuatBanService.findById(req.params.id);
    if (!nxb) {
      return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
    }

    await NhaXuatBanService.hardDelete(req.params.id);

    res.json({
      success: true,
      message: "Xóa vĩnh viễn nhà xuất bản thành công",
    });
  } catch (error) {
    next(error);
  }
};
