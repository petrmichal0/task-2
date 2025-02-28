const fs = require("fs").promises;
const Mustache = require("mustache");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const renderErrorTemplate = async (templatePath, data) => {
  try {
    const template = await fs.readFile(templatePath, "utf8");
    return Mustache.render(template, data);
  } catch (err) {
    console.error(`❌ Chyba při načítání šablony: ${templatePath}`, err);
    throw new Error("Chyba při vykreslování šablony.");
  }
};

const sendErrorResponse = async (err, req, res) => {
  const statusCode = err.statusCode || 500;
  const templatePath = path.join(__dirname, "../views/error.mustache");

  try {
    const rendered = await renderErrorTemplate(templatePath, {
      statusCode,
      message: err.isOperational ? err.message : "Něco se hodně pokazilo!",
    });

    res.status(statusCode).send(rendered);
  } catch (templateError) {
    console.error("❌ Chyba při renderování error šablony:", templateError);
    res
      .status(500)
      .send("<h1>Chyba serveru</h1><p>Něco se hodně pokazilo!</p>");
  }
};

const handleErrors = async (err, req, res, next) => {
  console.error("💥 Chyba:", err);
  await sendErrorResponse(err, req, res);
};

module.exports = { handleErrors };
