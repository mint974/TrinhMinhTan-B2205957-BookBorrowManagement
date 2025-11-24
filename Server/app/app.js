const express = require("express");
const cors = require("cors");

const app = express();

const nhanvienRoute = require("./routes/nhanvien.route");
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/nhanvien", nhanvienRoute);

module.exports = app;
