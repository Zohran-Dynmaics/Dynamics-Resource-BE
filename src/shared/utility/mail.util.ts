import transporter from "src/config/nodemailer.config";

interface SendMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendMail = async (options: SendMailOptions) => {
  try {
    const mailOptions = {
      from: '"Dynamics+" zeerasheed97@gmail.com',
      to: options.to,
      subject: options.subject,
      text: options.text || "",
      html: options.html || "",
    };
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};
