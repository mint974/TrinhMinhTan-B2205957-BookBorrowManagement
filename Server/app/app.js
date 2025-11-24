const express = require("express");
const cors = require("cors");

const app = express();

const nhanvienRoute = require("./routes/nhanvien.route");
const danhmucRoutes = require("./routes/danhmuc.route");
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/nhanvien", nhanvienRoute);
app.use("/api/danhmuc", danhmucRoutes);


module.exports = app;
