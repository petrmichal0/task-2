const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.error(`UNCAUGHT EXCEPTION! 💥 Vypínání...\n${err.stack}`);
  process.exit(1);
});

dotenv.config();
const app = require("./app");

const PORT = process.env.PORT || 3020;

const server = app.listen(PORT, () => {
  console.log(`✅ Aplikace běží na portu ${PORT}...`);
});

process.on("unhandledRejection", (err) => {
  console.error(`UNHANDLED REJECTION! 💥 Vypínání...\n${err.stack}`);
  server.close(() => process.exit(1));
});
