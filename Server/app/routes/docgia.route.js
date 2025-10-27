import express from "express";
import * as DocGiaController from "../controllers/docgia.controller.js";

const router = express.Router();

router.get("/", DocGiaController.getAll);

export default router;
