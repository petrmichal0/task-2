const express = require("express");
const path = require("path");
const mustacheExpress = require("mustache-express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const homeRoutes = require("./routes/homeRoutes");

const { handleErrors } = require("./controllers/errorController");
const createAppError = require("./utils/createAppError");

const app = express();

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/favorites", favoriteRoutes);

app.all("*", (req, res, next) => {
  next(
    createAppError(
      `Nemohu najít ${req.method} ${req.originalUrl} na tomto serveru!`,
      404
    )
  );
});

app.use(handleErrors);

module.exports = app;
