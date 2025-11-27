const NhanVienService = require("../services/nhanvien.service");
const jwt = require("../utils/jwt");

exports.login = async (req, res) => {
  // console.log("Login API đã được gọi!");
  // console.log("Body nhận được:", req.body);
  const { Email, Password } = req.body;
  // console.log("email:", Email);
  // console.log("password:", Password);
  const nv = await NhanVienService.login(Email, Password);
  if (!nv) {
    return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
  }

  const token = jwt.sign({
    id: nv._id,
    role: nv.ChucVu,
  });

  res.json({
    message: "Đăng nhập thành công",
    token,
    nhanvien: {
      id: nv._id,
      TenNV: nv.HoTen,
      Email: nv.Email,
      ChucVu: nv.ChucVu,
    },
  });
};
