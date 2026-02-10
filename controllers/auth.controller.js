// 控制器：處理登入邏輯
import db from '../db/connection.js';

export const login = async (req, res) => {
  console.log('收到 Body:', req.body);
  try {
    const { national_id, phone_number } = req.body;

    // 1. 基本檢查
    if (!national_id || !phone_number) {
      return res.status(400).json({
        success: false,
        message: '請輸入身分證字號與手機號碼',
      });
    }

    // 2. 查詢使用者
    const [rows] = await db.query(
      'SELECT user_id, name, national_id, phone_number FROM personal_information WHERE national_id = ? AND phone_number = ?',
      [national_id, phone_number]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: '身分證字號或手機號碼錯誤',
      });
    }

    const user = rows[0];

    // 3. 登入成功
    res.json({
      success: true,
      message: '登入成功',
      user: {
        user_id: user.user_id,
        name: user.name,
        national_id: user.national_id,
        phone_number: user.phone_number,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: '伺服器錯誤',
    });
  }
};
