const NhanVienService = require("../services/nhanvien.service");

exports.create = async (req, res) => {
  const nv = await NhanVienService.create(req.body);
  res.status(201).json(nv);
};

exports.getAll = async (req, res) => {
  const list = await NhanVienService.findAll();
  res.json(list);
};

exports.getById = async (req, res) => {
  const nv = await NhanVienService.findById(req.params.id);
  res.json(nv);
};

exports.update = async (req, res) => {
  const updated = await NhanVienService.update(req.params.id, req.body);
  res.json(updated);
};

exports.delete = async (req, res) => {
  const deleted = await NhanVienService.softDelete(req.params.id);
  res.json(deleted);
};
