// const nodemailer = require("nodemailer");
// require("dotenv").config();
// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   secure: false, // true for port 465, false for other ports
//   auth: {
//     user: process.env.EMAIL_NAME,
//     pass: process.env.EMAIL_APP_PASSWORD,
//   },
// });

// // async..await is not allowed in global scope, must use a wrapper
// async function main(email, html) {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({
//     from: '"ShopSphere" <no-reply@gmail.com>', // sender address
//     to: email, // list of receivers
//     subject: "Forgot password", // Subject line
//     // text: "Hello world?", // plain text body
//     html: html, // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
// }

// main().catch(console.error);

// module.exports = main;
const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendMail = asyncHandler(async ({ email, html }) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_NAME, // email của bạn (ví dụ: example@gmail.com)
        pass: process.env.EMAIL_APP_PASSWORD, // mật khẩu ứng dụng 16 ký tự từ Google
      },
    });

    // Kiểm tra kết nối trước khi gửi
    await transporter.verify();
    console.log("✅ Kết nối với máy chủ email thành công!");

    // Gửi email
    let info = await transporter.sendMail({
      from: '"ShopSphere" <no-reply@gmail.com>',
      to: email,
      subject: "Forgot password",
      html: html,
    });

    console.log("Email đã được gửi:", info.messageId);
    return info;
  } catch (error) {
    console.error("Lỗi khi gửi email:", error.message);
    throw new Error(
      "Email sending failed. Please check your configuration or try again later."
    );
  }
});

module.exports = sendMail;
