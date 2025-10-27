import * as DocGiaService from "../services/docgia.service.js";

export const getAll = async (req, res) => {
  try {
    const docgias = await DocGiaService.getAllDocGia();
    res.json(docgias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
