const crypto = require("crypto");
const qs = require("qs");
const paymentConfig = require("../config/payment.config");

class VNPayHelper {
  // Format yyyyMMddHHmmss
  static formatDate(date) {
    const y = date.getFullYear().toString();
    const m = ("0" + (date.getMonth() + 1)).slice(-2);
    const d = ("0" + date.getDate()).slice(-2);
    const H = ("0" + date.getHours()).slice(-2);
    const i = ("0" + date.getMinutes()).slice(-2);
    const s = ("0" + date.getSeconds()).slice(-2);
    return y + m + d + H + i + s;
  }

  // Sort object keys alphabetically
  static sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach((key) => (sorted[key] = obj[key]));
    return sorted;
  }

  /**
   * Tạo URL thanh toán VNPay
   */
  static createPaymentUrl({
    orderId,
    amount,
    orderInfo,
    orderType = "other",
    locale = "vn",
    ipAddr,
    bankCode = "",
  }) {
    const date = new Date();

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: paymentConfig.vnpay.tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: orderType,
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: paymentConfig.vnpay.returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: this.formatDate(date),
    };

    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    // 1) Sort param
    vnp_Params = this.sortObject(vnp_Params);

    console.log("=== DEBUG VNPay CreatePaymentUrl ===");
    console.log("Sorted params:", JSON.stringify(vnp_Params, null, 2));

    // 2) Create signData → KHÔNG encode
    const signData = qs.stringify(vnp_Params, { encode: false });
    console.log("SignData:", signData);

    // 3) Tạo hash
    console.log("Secret Key:", paymentConfig.vnpay.hashSecret);
    const hmac = crypto.createHmac("sha512", paymentConfig.vnpay.hashSecret);
    const secureHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    console.log("SecureHash:", secureHash);
    
    vnp_Params["vnp_SecureHash"] = secureHash;

    // 4) Build URL → KHÔNG ENCODE (theo code mẫu VNPay)
    const vnpUrl =
      paymentConfig.vnpay.url +
      "?" +
      qs.stringify(vnp_Params, { encode: false });

    console.log("Final URL:", vnpUrl);
    console.log("=== END DEBUG ===\n");

    return vnpUrl;
  }

  /**
   * Xác thực URL trả về từ VNPay
   */
  static verifyReturnUrl(vnp_Params) {
    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = this.sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });

    const hmac = crypto.createHmac("sha512", paymentConfig.vnpay.hashSecret);
    const checkHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    return secureHash === checkHash;
  }

  static getResponseMessage(code) {
    const msg = {
      "00": "Giao dịch thành công",
      "07": "Giao dịch nghi ngờ gian lận",
      "09": "Thẻ chưa đăng ký InternetBanking",
      "10": "Xác thực thông tin sai quá 3 lần",
      "11": "Hết hạn thanh toán",
      "12": "Thẻ bị khóa",
      "13": "Sai OTP",
      "24": "Khách hàng hủy giao dịch",
      "51": "Không đủ số dư",
      "65": "Vượt hạn mức giao dịch",
      "75": "Ngân hàng bảo trì",
      "79": "Sai mật khẩu thanh toán",
      "99": "Lỗi không xác định",
    };
    return msg[code] || "Lỗi không xác định";
  }
}

module.exports = VNPayHelper;
