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
    subject: `${otp} is your verification code`, 

    text: `
    ${otp} is your verification code

    ${otp}

    This code will expire in 5 minutes.

    您的驗證碼為 ${otp}
    5分鐘內有效
    `.trim(),

    html: `
      <div style="text-align:center; font-family:sans-serif;">
        <p>Your verification code is:</p>
        <h1 style="font-size:32px; letter-spacing:5px;">${otp}</h1>

        <p>Use this code to sign in</p>
        <p>Valid for 5 minutes</p>

        <hr />

        <p>您的驗證碼為 ${otp}</p>
        <p>5分鐘內有效</p>
      </div>
    `,
  });
};