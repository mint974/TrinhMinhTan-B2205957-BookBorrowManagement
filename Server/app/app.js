const express = require("express");
const cors = require("cors");

const app = express();

const nhanvienRoute = require("./routes/nhanvien.route");
const danhmucRoutes = require("./routes/danhmuc.route");
const mediaRoutes = require("./routes/media.route");
const tacgiaRoutes = require("./routes/tacgia.route");
const diachiRoutes = require("./routes/diachi.route");

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/nhanvien", nhanvienRoute);
app.use("/api/danhmuc", danhmucRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/tacgia", tacgiaRoutes);
app.use("/api/diachi", diachiRoutes);

module.exports = app;
