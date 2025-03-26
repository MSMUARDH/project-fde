const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    // cgbc rsfo pfhb jmfo
  },
});

const sendInvitaion = async (email, otp, firstName, invitationLink) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Invitation to Set Your Password",
    text: `Hello ${firstName},\n\nClick the following link to set your password: ${invitationLink} \n\n This is your OTP - ${otp}`,
  });

  console.log("Email Has been sent....");
};

module.exports = sendInvitaion;
