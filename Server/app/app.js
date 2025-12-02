const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const nhanvienRoute = require("./routes/nhanvien.route");
const danhmucRoutes = require("./routes/danhmuc.route");
const mediaRoutes = require("./routes/media.route");
const tacgiaRoutes = require("./routes/tacgia.route");
const diachiRoutes = require("./routes/diachi.route");
const nhaxuatbanRoutes = require("./routes/nhaxuatban.route");
const sachRoutes = require("./routes/sach.route");

app.use(cors());
app.use(express.json());

// Serve static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/nhanvien", nhanvienRoute);
app.use("/api/danhmuc", danhmucRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/tacgia", tacgiaRoutes);
app.use("/api/diachi", diachiRoutes);
app.use("/api/nhaxuatban", nhaxuatbanRoutes);
app.use("/api/sach", sachRoutes);

module.exports = app;
