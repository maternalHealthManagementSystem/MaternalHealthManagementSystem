import db from '../db/connection.js';

// 暫存 OTP（正式專案建議用 Redis）
const otpStore = {};

/**
 * 第一步：確認身分 + 產生 OTP
 */
export const requestOtp = async (req, res) => {
  try {
    const { national_id, phone_number } = req.body;

    if (!national_id || !phone_number) {
      return res.status(400).json({
        success: false,
        message: '請輸入身分證字號與手機號碼',
      });
    }

    const idRegex = /^[A-Z][12]\d{8}$/;
    if (!idRegex.test(national_id)) {
      return res.status(400).json({
        success: false,
        message: '身分證格式錯誤',
      });
    }

    // 查詢使用者
    const [rows] = await db.query(
      `SELECT user_id, name, national_id, phone_number 
       FROM personal_information 
       WHERE national_id = ? AND phone_number = ?`,
      [national_id, phone_number]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: '身分證字號或手機號碼錯誤',
      });
    }

    const user = rows[0];

    // 產生 6 位 OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 存入暫存（5分鐘有效）
    otpStore[user.user_id] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    };

    console.log(`使用者 ${user.user_id} OTP:`, otp);

    return res.json({
      success: true,
      message: '驗證碼已發送',
      user_id: user.user_id,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: '伺服器錯誤',
    });
  }
};


/**
 * 第二步：驗證 OTP + 正式登入
 */
export const verifyOtp = async (req, res) => {
  try {
    const { user_id, otp } = req.body;

    console.log("收到驗證:", user_id, otp);
    console.log("目前儲存:", otpStore[user_id]);


    if (!user_id || !otp) {
      return res.status(400).json({
        success: false,
        message: '缺少驗證資料',
      });
    }

    const record = otpStore[user_id];

    if (!record) {
      return res.status(400).json({
        success: false,
        message: '請先請求驗證碼',
      });
    }

    if (Date.now() > record.expires) {
      delete otpStore[user_id];
      return res.status(400).json({
        success: false,
        message: '驗證碼已過期',
      });
    }

    if (record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: '驗證碼錯誤',
      });
    }

    // 驗證成功，刪除OTP
    delete otpStore[user_id];

    // 撈使用者資料
    const [rows] = await db.query(
      `SELECT user_id, name, national_id, phone_number 
       FROM personal_information 
       WHERE user_id = ?`,
      [user_id]
    );

    const user = rows[0];

    return res.json({
      success: true,
      message: '登入成功',
      user,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: '伺服器錯誤',
    });
  }
};