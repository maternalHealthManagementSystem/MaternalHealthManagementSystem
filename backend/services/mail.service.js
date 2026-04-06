import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // 使用 Gmail SMTP 服務
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

export const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: `"孕產婦健康照護管理系統" <${process.env.EMAIL_USER}>`,
    to,
    subject: `${otp}：登入【孕產婦健康照護管理系統】的 OTP 驗證碼"`,
    html: `<h2>您的驗證碼為：${otp}</h2><p style="color: red;font-weight: bold;font-size: 18px;">5分鐘內有效</p>`,
  });
};