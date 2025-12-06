const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

const nhanvienRoute = require("./routes/nhanvien.route");
const danhmucRoutes = require("./routes/danhmuc.route");
const tacgiaRoutes = require("./routes/tacgia.route");
const diachiRoutes = require("./routes/diachi.route");
const nhaxuatbanRoutes = require("./routes/nhaxuatban.route");
const sachRoutes = require("./routes/sach.route");
const docgiaRoutes = require("./routes/docgia.route");

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Serve static files (uploads) - đảm bảo CORS headers cho static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads"), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// Routes
app.use("/api/nhanvien", nhanvienRoute);
app.use("/api/danhmuc", danhmucRoutes);
app.use("/api/tacgia", tacgiaRoutes);
app.use("/api/diachi", diachiRoutes);
app.use("/api/nhaxuatban", nhaxuatbanRoutes);
app.use("/api/sach", sachRoutes);
app.use("/api/docgia", docgiaRoutes);

module.exports = app;
