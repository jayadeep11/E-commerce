const { Resend } = require('resend');

const sendEmail = async (options) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: 'KORE Registration <onboarding@resend.dev>',
    to: options.email,
    subject: options.subject,
    html: options.html,
    text: options.message,
  });

  if (error) {
    throw new Error(error.message);
  }
};

module.exports = sendEmail;
