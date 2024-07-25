import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "zeerasheed97@gmail.com",
    pass: "kjdz vicl gfib xrhu",
  },
});

export default transporter;
