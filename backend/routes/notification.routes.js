import express from "express";
import db from "../db/connection.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {

  const { userId } = req.params;
  const clientWeek = req.query.week;

  try {

    const notifications = [];

    /* 1️⃣ 14天內產檢提醒 */

    const [events] = await db.query(`
      SELECT 
        event_title,
        event_start_date,
        event_describe,
        DATEDIFF(event_start_date, CURDATE()) AS days_left
      FROM schedule
      WHERE personal_informations_user_id = ?
      AND event_start_date >= CURDATE()
      AND DATEDIFF(event_start_date, CURDATE()) <= 14
      ORDER BY event_start_date
    `, [userId]);

    events.forEach(e => {
      notifications.push({
        id: `check_${e.event_start_date}`,
        type: "checkup",
        title: e.event_title,
        date: e.event_start_date,
        message: `距離產檢還有 ${e.days_left} 天。${e.event_describe}`
      });
    });


    /* 2️⃣ 取得孕週 */

    let currentWeek = Number(clientWeek);

    if (!currentWeek && currentWeek !== 0) {

      const [user] = await db.query(`
        SELECT LMP 
        FROM personal_informations
        WHERE user_id = ?
      `, [userId]);

      if (user[0]?.LMP) {

        const lmp = new Date(user[0].LMP);
        const today = new Date();
        const diffDays = Math.floor((today - lmp) / (1000 * 60 * 60 * 24));
        currentWeek = Math.floor(diffDays / 7);

      }

    }

    if (!currentWeek && currentWeek !== 0) {
      return res.json(notifications);
    }


    /* 3️⃣ 未讀衛教 */

    const [education] = await db.query(`
      SELECT hp.he_pregnancy_id, hp.title_hepregnancy, hp.link_hepregnancy
      FROM he_pregnancy hp
      LEFT JOIN read_records rr
        ON hp.he_pregnancy_id = rr.he_pregnancy_id
        AND rr.personal_informations_user_id = ?
      WHERE ? BETWEEN hp.he_pregnancy_min_week AND hp.he_pregnancy_max_week
      AND rr.he_pregnancy_id IS NULL
    `,[userId,currentWeek]);

    education.forEach(e => {

      notifications.push({
        id: `edu_${e.he_pregnancy_id}`,
        type: "education",
        title: e.title_hepregnancy,
        link: e.link_hepregnancy,
        message: `您尚未閱讀「${e.title_hepregnancy}」孕期衛教`
      });

    });

    res.json(notifications);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "通知取得失敗" });

  }

});

export default router;