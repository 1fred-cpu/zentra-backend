import { sendMail } from "../utils/mailer";

export async function sendVerificationLink(link: string, email: string) {
    const subject = "Verify your email address for Zentra";
    const html = `<h2>Verify your Zentra account</h2>
<p>Thank you for signing up! Please verify your email address by clicking the button below:</p>

<a href="${link}" style="display:inline-block;background-color:#4f46e5;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;font-weight:bold;">
  Verify Email
</a>

<p>If you didn’t create a Zentra account, you can safely ignore this email.</p>
<p>— The Zentra Team</p>`;

    const info = await sendMail(email, subject, html);
    console.log(info);
}
