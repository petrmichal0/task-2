const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const sendEmail = async (to, subject, htmlContent) => {
  try {
    if (
      !process.env.EMAIL_HOST ||
      !process.env.EMAIL_PORT ||
      !process.env.EMAIL_FROM ||
      !process.env.EMAIL_PASSWORD
    ) {
      throw new Error("❌ Chybí e-mailové nastavení v .env souboru.");
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        console.error("❌ SMTP připojení selhalo:", error);
      } else {
        console.log("✅ SMTP připojení funguje!");
      }
    });

    const mailOptions = {
      from: `Book Finder <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ Chyba při odesílání e-mailu:", error.message);
  }
};

const sendPasswordResetEmail = async (user, resetURL) => {
  try {
    if (!user || !user.email || !user.name) {
      throw new Error("❌ Neplatný uživatel nebo chybějící e-mailová adresa.");
    }

    const firstName = user.name.split(" ")[0];

    const htmlContent = `
      <p>Ahoj ${firstName},</p>
      <p>požádali jste o resetování hesla. Klikněte na odkaz níže a nastavte si nové heslo:</p>
      <p><a href="${resetURL}">Resetovat heslo</a></p>
      <p>Pokud jste o reset hesla nežádali, tento e-mail ignorujte.</p>
      <br>
      <p>Tým Book Finder</p>
    `;

    await sendEmail(
      user.email,
      "Obnova hesla - Book Finder (platí 10 minut)",
      htmlContent
    );
  } catch (error) {
    console.error(
      "❌ Chyba při odesílání resetovacího e-mailu:",
      error.message
    );
  }
};

module.exports = { sendPasswordResetEmail };
