import express from "express";
import db from "../db/connection.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {

  const { userId } = req.params;
  const clientWeek = req.query.week;

  console.log(`User: ${userId}, Received Week: ${clientWeek}`); // 確認收到的 userId 和 week

  try {

    const notifications = [];

    /* 1️⃣ 14天內產檢提醒 */

    const [events] = await db.query(`
      SELECT 
        event_title,
        event_type,
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

      let message = "";

      switch (e.event_type) {

        case "產檢":
          message = `您距離下一次產檢「${e.event_title}」，還有 ${e.days_left} 天。`;
          break;

        case "預約":
          message = `您有一個預約「${e.event_title}」，距離預約還有 ${e.days_left} 天。`;
          break;

        case "提醒":
          message = `提醒您：「${e.event_title}」還有 ${e.days_left} 天。`;
          break;

        case "其他":
          message = `即將到來的行程：「${e.event_title}」，${e.days_left} 天後開始。`;
          break;

        default:
          message = `距離「${e.event_title}」還有 ${e.days_left} 天。`;
      }

      if (e.event_describe) {
        message += ` ${e.event_describe}`;
      }

      // 特別提示今天的行程
      if (e.days_left === 0) {
        message = `今天有行程：「${e.event_title}」`;
      }

      notifications.push({
        id: e.event_id,
        type: "checkup",
        title: e.event_title,
        date: e.event_start_date,
        message: message
      });
    });


    /* 2️⃣ 取得孕週 */

    let currentWeek = Number(clientWeek);

    if (!currentWeek && currentWeek !== 0) {

      const [user] = await db.query(`
        SELECT LMP
        FROM personal_information
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
      SELECT 
        hp.he_pregnancy_id,
        hp.title_hepregnancy,
        hp.link_hepregnancy
      FROM he_pregnancy hp
      WHERE hp.he_pregnancy_min_week <= ? 
        AND hp.he_pregnancy_id NOT IN (
          SELECT he_pregnancy_id 
          FROM read_records 
          WHERE personal_informations_user_id = ?
        )
      ORDER BY hp.he_pregnancy_min_week ASC
    `, [currentWeek, userId]); 

    console.log("Found Education Count:", education.length);

    education.forEach(e => {

      notifications.push({
        type: "education",
        article_id: e.he_pregnancy_id,
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