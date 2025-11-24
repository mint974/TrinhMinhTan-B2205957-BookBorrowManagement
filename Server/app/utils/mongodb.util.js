const mongoose = require("mongoose");

async function connect(uri) {
  try {
    await mongoose.connect(uri);
    console.log("Kết nối đến MongoDB thành công", uri);
  } catch (err) {
    console.error("Lỗi kết nối MongoDB:", err);
    process.exit(1);
  }
}

module.exports = { connect };
