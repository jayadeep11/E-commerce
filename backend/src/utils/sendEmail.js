const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  // For production, use a service like SendGrid, Mailgun, or Gmail with App Passwords
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: `KORE <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
