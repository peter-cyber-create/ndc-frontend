// test-smtp.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.health.go.ug',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'moh.conference@health.go.ug',
    pass: process.env.SMTP_PASSWORD || 'Ministry@2025',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const mailOptions = {
  from: `"NDC Conference 2025" <${process.env.SMTP_USER || 'moh.conference@health.go.ug'}>`,
  to: 'peterpaulwagidoso@gmail.com', // Change to your test recipient
  subject: 'SMTP Test from NDC Conference App',
  text: 'This is a test email sent from the NDC Conference app SMTP test script.',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.error('Error sending test email:', error);
  }
  console.log('Test email sent:', info.response);
});
