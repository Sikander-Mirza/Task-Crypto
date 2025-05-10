import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:"sikandersunny2017@gmail.com",      // your Gmail address
    pass: "hzfb liaf toeo txbl"       // app password
  }
});

export const sendBudgetAlert = async (to, subject, text) => {
  await transporter.sendMail({
    from: "sikandersunny2017@gmail.com",
    to,
    subject,
    text
  });
};
