import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./app/config/index.js";
import docgiaRoutes from "./app/routes/docgia.route.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/docgia", docgiaRoutes);

export default app;
