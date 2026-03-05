import express from "express";
import db from "../db/connection.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// 取得登入使用者的產檢資料
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.user_id; // 從 JWT 解出 user id

    const [rows] = await db.query(
      `SELECT *
        FROM prenatal_checkup
        WHERE personal_informations_user_id = ?
        AND visit_date <= CURDATE()
        ORDER BY visit_date DESC`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "取得產檢資料失敗" });
  }
});

export default router;