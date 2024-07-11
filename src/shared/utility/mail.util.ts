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
            from: '"Your Name" <your-email@example.com>', // Replace with your name and email
            to: options.to,
            subject: options.subject,
            text: options.text || '',
            html: options.html || '',
        };
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};
