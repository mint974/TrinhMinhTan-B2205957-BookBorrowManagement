import DocGia from "../models/docgia.model.js";

export const getAllDocGia = async () => await DocGia.find();
export const createDocGia = async (data) => await DocGia.create(data);
export const updateDocGia = async (id, data) =>
  await DocGia.findByIdAndUpdate(id, data, { new: true });
export const deleteDocGia = async (id) => await DocGia.findByIdAndDelete(id);
