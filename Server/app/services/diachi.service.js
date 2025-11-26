const axios = require("axios");
const Tinh = require("../models/tinh.model");
const Quan = require("../models/quan.model");
const Phuong = require("../models/phuong.model");

class DiaChiService {
  static async syncAll() {
    try {
      const response = await axios.get(
        "https://provinces.open-api.vn/api/?depth=3"
      );
      const provinces = response.data;

      if (!provinces || provinces.length === 0) {
        throw new Error("Không có dữ liệu từ API");
      }

      await Tinh.deleteMany({});
      await Quan.deleteMany({});
      await Phuong.deleteMany({});

      const tinhData = provinces.map((p) => ({
        code: String(p.code),
        name: p.name,
        nameEn: p.name_en || p.name,
        fullName: p.full_name || p.name,
        fullNameEn: p.full_name_en || p.name,
        codeName: p.code_name || p.name.toLowerCase().replace(/\s+/g, "_"),
      }));

      await Tinh.insertMany(tinhData);

      const quanData = [];
      const phuongData = [];

      provinces.forEach((province) => {
        if (province.districts && province.districts.length > 0) {
          province.districts.forEach((district) => {
            quanData.push({
              code: String(district.code),
              name: district.name,
              nameEn: district.name_en || district.name,
              fullName: district.full_name || district.name,
              fullNameEn: district.full_name_en || district.name,
              codeName:
                district.code_name ||
                district.name.toLowerCase().replace(/\s+/g, "_"),
              MaTinh: String(province.code),
            });

            if (district.wards && district.wards.length > 0) {
              district.wards.forEach((ward) => {
                phuongData.push({
                  code: String(ward.code),
                  name: ward.name,
                  nameEn: ward.name_en || ward.name,
                  fullName: ward.full_name || ward.name,
                  fullNameEn: ward.full_name_en || ward.name,
                  codeName:
                    ward.code_name ||
                    ward.name.toLowerCase().replace(/\s+/g, "_"),
                  MaQuan: String(district.code),
                });
              });
            }
          });
        }
      });

      if (quanData.length > 0) {
        await Quan.insertMany(quanData);
      }

      if (phuongData.length > 0) {
        await Phuong.insertMany(phuongData);
      }

      return {
        success: true,
        message: "Đồng bộ thành công!",
        stats: {
          provinces: tinhData.length,
          districts: quanData.length,
          wards: phuongData.length,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async getAllTinh() {
    return await Tinh.find({}).sort({ name: 1 });
  }

  static async getTinhByCode(code) {
    return await Tinh.findOne({ code: String(code) });
  }

  static async getQuanByTinh(maTinh) {
    return await Quan.find({ MaTinh: String(maTinh) }).sort({ name: 1 });
  }

  static async getQuanByCode(code) {
    return await Quan.findOne({ code: String(code) });
  }

  static async getPhuongByQuan(maQuan) {
    return await Phuong.find({ MaQuan: String(maQuan) }).sort({ name: 1 });
  }

  static async getPhuongByCode(code) {
    return await Phuong.findOne({ code: String(code) });
  }

  static async formatAddress(
    phuongCode,
    quanCode,
    tinhCode,
    diaChiChiTiet = ""
  ) {
    const [phuong, quan, tinh] = await Promise.all([
      phuongCode ? this.getPhuongByCode(phuongCode) : null,
      quanCode ? this.getQuanByCode(quanCode) : null,
      this.getTinhByCode(tinhCode),
    ]);

    if (!tinh) {
      throw new Error("Không tìm thấy thông tin tỉnh/thành phố");
    }

    const parts = [];
    if (diaChiChiTiet) parts.push(diaChiChiTiet);
    if (phuong) parts.push(phuong.name);
    if (quan) parts.push(quan.name);
    if (tinh) parts.push(tinh.name);

    return parts.join(", ");
  }

  static async searchTinh(keyword) {
    return await Tinh.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { fullName: { $regex: keyword, $options: "i" } },
        { codeName: { $regex: keyword, $options: "i" } },
      ],
    }).sort({ name: 1 });
  }

  static async searchQuan(keyword, maTinh = null) {
    const filter = {
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { fullName: { $regex: keyword, $options: "i" } },
        { codeName: { $regex: keyword, $options: "i" } },
      ],
    };
    if (maTinh) {
      filter.MaTinh = String(maTinh);
    }
    return await Quan.find(filter).sort({ name: 1 });
  }

  static async searchPhuong(keyword, maQuan = null) {
    const filter = {
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { fullName: { $regex: keyword, $options: "i" } },
        { codeName: { $regex: keyword, $options: "i" } },
      ],
    };
    if (maQuan) {
      filter.MaQuan = String(maQuan);
    }
    return await Phuong.find(filter).sort({ name: 1 });
  }

  static async getStatsByTinh() {
    return await Quan.aggregate([
      {
        $group: {
          _id: "$MaTinh",
          soLuongQuan: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "tinhs",
          localField: "_id",
          foreignField: "code",
          as: "tinhInfo",
        },
      },
      {
        $unwind: "$tinhInfo",
      },
      {
        $project: {
          _id: 0,
          maTinh: "$_id",
          tenTinh: "$tinhInfo.name",
          soLuongQuan: 1,
        },
      },
      { $sort: { soLuongQuan: -1 } },
    ]);
  }

  static async getStatsByQuan() {
    return await Phuong.aggregate([
      {
        $group: {
          _id: "$MaQuan",
          soLuongPhuong: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "quans",
          localField: "_id",
          foreignField: "code",
          as: "quanInfo",
        },
      },
      {
        $unwind: "$quanInfo",
      },
      {
        $project: {
          _id: 0,
          maQuan: "$_id",
          tenQuan: "$quanInfo.name",
          soLuongPhuong: 1,
        },
      },
      { $sort: { soLuongPhuong: -1 } },
    ]);
  }
}

module.exports = DiaChiService;
