import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER, // your Gmail address
        pass: process.env.MAIL_APP_PASSWORD // your App Password
    }
});

interface SendMailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendMail = async ( email, subject, html) => {
    const info = await transporter.sendMail({
        from: `"Zentra" <${process.env.MAIL_USER}>`,
        to: email,
        subject,
        html
    });

    return info;
};
