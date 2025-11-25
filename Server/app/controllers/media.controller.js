const MediaService = require("../services/media.service");

exports.create = async (req, res) => {
  const nv = await MediaService.create(req.body);
  res.status(201).json(nv);
};

exports.getAll = async (req, res) => {
  const list = await MediaService.findAll();
  res.json(list);
};

exports.getById = async (req, res) => {
  const nv = await MediaService.findById(req.params.id);
  res.json(nv);
};

exports.update = async (req, res) => {
  const updated = await MediaService.update(req.params.id, req.body);
  res.json(updated);
};

exports.delete = async (req, res) => {
  const deleted = await MediaService.softDelete(req.params.id);
  res.json(deleted);
};
