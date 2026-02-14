import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db/connection.js';


import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//API 路由
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend API is running');
});

app.listen(3000, () => {
  console.log('API running at http://localhost:3000');
});

app.get("/api/profile/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM personal_information WHERE user_id = ?",
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "查無資料" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("SQL 查詢失敗原因:", err); // 這行非常重要！會在後端終端機印出詳細原因
    res.status(500).json({ message: "伺服器錯誤", error: err.message }); // 暫時把錯誤傳回前端看
  }
});

// 更新個人資料的 API

app.put("/api/profile/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const data = req.body;

  try {
    const query = `
      UPDATE personal_information 
      SET 
        name = ?, 
        birthday = ?, 
        phone_number = ?, 
        landline = ?, 
        email = ?, 
        address = ?, 
        ice_name = ?, 
        ice_relationship = ?, 
        ice_phone_number = ?, 
        blood_type = ?, 
        height = ?, 
        weight = ?,
        user_file_path = ?
      WHERE user_id = ?
    `;

    const values = [
      data.name,
      data.birthday,
      data.phone_number,
      data.landline,
      data.email,
      data.address,
      data.ice_name,
      data.ice_relationship,
      data.ice_phone_number,
      data.blood_type,
      data.height,
      data.weight,
      data.user_file_path,
      user_id
    ];

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "找不到該使用者或資料未變更" });
    }

    res.json({ success: true, message: "資料庫更新成功" });
  } catch (err) {
    console.error("更新失敗:", err);
    res.status(500).json({ success: false, message: "伺服器更新錯誤", error: err.message });
  }
});

