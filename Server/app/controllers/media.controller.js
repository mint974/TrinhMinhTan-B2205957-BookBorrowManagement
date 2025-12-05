const MediaService = require("../services/media.service");
const ApiError = require("../api-error");
const fs = require("fs").promises;
const path = require("path");

// Tạo media mới (upload file)
exports.create = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError(400, "Vui lòng chọn file để upload"));
    }

    const { TenMedia, LoaiMedia, MoTa, Sach } = req.body;

    if (!TenMedia || !LoaiMedia) {
      // Xóa file đã upload nếu thiếu thông tin
      await fs.unlink(req.file.path);
      return next(new ApiError(400, "Thiếu thông tin: TenMedia và LoaiMedia"));
    }

    const mediaData = {
      TenMedia,
      LoaiMedia,
      MoTa: MoTa || "",
      Sach: Sach || null,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    };

    const media = await MediaService.create(mediaData);
    res.status(201).json({
      success: true,
      message: "Upload file thành công",
      data: media,
    });
  } catch (error) {
    // Xóa file nếu có lỗi
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Lỗi khi xóa file:", unlinkError);
      }
    }
    next(error);
  }
};

// Lấy danh sách media với filter và search
exports.getAll = async (req, res, next) => {
  try {
    const result = await MediaService.findAll(req.query);
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy media theo ID
exports.getById = async (req, res, next) => {
  try {
    const media = await MediaService.findById(req.params.id);
    if (!media) {
      return next(new ApiError(404, "Không tìm thấy media"));
    }
    res.json({
      success: true,
      data: media,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy media theo MaMedia
exports.getByMaMedia = async (req, res, next) => {
  try {
    const media = await MediaService.findByMaMedia(req.params.maMedia);
    if (!media) {
      return next(new ApiError(404, "Không tìm thấy media"));
    }
    res.json({
      success: true,
      data: media,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy media theo loại
exports.getByLoaiMedia = async (req, res, next) => {
  try {
    const mediaList = await MediaService.findByLoaiMedia(req.params.loaiMedia);
    res.json({
      success: true,
      data: mediaList,
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật media
exports.update = async (req, res, next) => {
  try {
    const { TenMedia, LoaiMedia, MoTa } = req.body;
    const updateData = {};

    if (TenMedia) updateData.TenMedia = TenMedia;
    if (LoaiMedia) updateData.LoaiMedia = LoaiMedia;
    if (MoTa !== undefined) updateData.MoTa = MoTa;

    const updated = await MediaService.update(req.params.id, updateData);
    if (!updated) {
      return next(new ApiError(404, "Không tìm thấy media để cập nhật"));
    }

    res.json({
      success: true,
      message: "Cập nhật media thành công",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Thay thế file của media
exports.replaceFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError(400, "Vui lòng chọn file để thay thế"));
    }

    const media = await MediaService.findById(req.params.id);
    if (!media) {
      await fs.unlink(req.file.path);
      return next(new ApiError(404, "Không tìm thấy media"));
    }

    // Xóa file cũ
    try {
      await fs.unlink(media.filePath);
    } catch (error) {
      console.error("Lỗi khi xóa file cũ:", error);
    }

    // Cập nhật thông tin file mới
    const updateData = {
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    };

    const updated = await MediaService.update(req.params.id, updateData);
    res.json({
      success: true,
      message: "Thay thế file thành công",
      data: updated,
    });
  } catch (error) {
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Lỗi khi xóa file:", unlinkError);
      }
    }
    next(error);
  }
};

// Xóa mềm media
exports.delete = async (req, res, next) => {
  try {
    const deleted = await MediaService.softDelete(req.params.id);
    if (!deleted) {
      return next(new ApiError(404, "Không tìm thấy media để xóa"));
    }
    res.json({
      success: true,
      message: "Xóa media thành công",
    });
  } catch (error) {
    next(error);
  }
};

// Xóa vĩnh viễn media (bao gồm file)
exports.hardDelete = async (req, res, next) => {
  try {
    const media = await MediaService.findById(req.params.id);
    if (!media) {
      return next(new ApiError(404, "Không tìm thấy media"));
    }

    // Xóa file vật lý
    try {
      await fs.unlink(media.filePath);
    } catch (error) {
      console.error("Lỗi khi xóa file:", error);
    }

    // Xóa bản ghi trong database
    await MediaService.hardDelete(req.params.id);

    res.json({
      success: true,
      message: "Xóa vĩnh viễn media thành công",
    });
  } catch (error) {
    next(error);
  }
};

// Download file
exports.downloadFile = async (req, res, next) => {
  try {
    const media = await MediaService.findById(req.params.id);
    if (!media) {
      return next(new ApiError(404, "Không tìm thấy media"));
    }

    const filePath = path.resolve(media.filePath);
    res.download(filePath, media.TenMedia);
  } catch (error) {
    next(error);
  }
};

// Thống kê media theo loại
exports.getStatistics = async (req, res, next) => {
  try {
    const stats = await MediaService.getStatsByLoaiMedia();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
