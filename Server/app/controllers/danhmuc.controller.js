const DanhMucService = require("../services/danhmuc.service");

exports.create = async (req, res) => {
  const nv = await DanhMucService.create(req.body);
  res.status(201).json(nv);
};

exports.getAll = async (req, res) => {
  const list = await DanhMucService.findAll();
  res.json(list);
};

exports.getById = async (req, res) => {
  const nv = await DanhMucService.findById(req.params.id);
  res.json(nv);
};

exports.update = async (req, res) => {
  const updated = await DanhMucService.update(req.params.id, req.body);
  res.json(updated);
};

exports.delete = async (req, res) => {
  const deleted = await DanhMucService.softDelete(req.params.id);
  res.json(deleted);
};
