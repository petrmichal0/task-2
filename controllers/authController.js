const fs = require("fs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendPasswordResetEmail } = require("../utils/email");

require("dotenv").config();

const usersFile = "./data/users.json";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const getUsers = () => {
  if (fs.existsSync(usersFile)) {
    try {
      const data = fs.readFileSync(usersFile, "utf-8");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Chyba při čtení users.json:", error);
      return [];
    }
  }
  return [];
};

const saveUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

exports.signup = async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  let users = getUsers();

  if (users.some((user) => user.email === email)) {
    return res.status(400).json({ error: "Email již existuje" });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ error: "Hesla se neshodují" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password: hashedPassword,
  };

  users.push(newUser);
  saveUsers(users);

  const token = signToken(newUser.id);
  res.status(201).json({
    message: "Registrace úspěšná!",
    token,
    user: { id: newUser.id, name, email },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  let users = getUsers();

  const user = users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Nesprávný e-mail nebo heslo" });
  }

  const token = signToken(user.id);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    message: "Přihlášení úspěšné!",
    user: { id: user.id, name: user.name, email },
  });
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ message: "Odhlášení bylo úspěšné!" });
};

exports.isLoggedIn = async (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    res.locals.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    const users = getUsers();
    const currentUser = users.find((u) => u.id === decoded.id);

    if (!currentUser) {
      res.locals.user = null;
      return next();
    }

    res.locals.user = currentUser;
    next();
  } catch (err) {
    res.locals.user = null;
    next();
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const users = getUsers();

    const user = users.find((u) => u.email === req.body.email);

    if (!user) {
      return res
        .status(404)
        .json({ error: "Uživatel s tímto e-mailem neexistuje." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    saveUsers(users);

    try {
      const BASE_URL = process.env.BASE_URL || "http://localhost:3020";

      const resetURL = `${BASE_URL}/auth/reset-password/${resetToken}`;

      await sendPasswordResetEmail(user, resetURL);

      return res.status(200).json({ message: "Token byl odeslán na e-mail." });
    } catch (err) {
      console.error("❌ Chyba při odesílání e-mailu:", err);

      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      saveUsers(users);

      return res.status(500).json({
        error: "Nastala chyba při odesílání e-mailu. Zkuste to znovu později.",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Interní chyba serveru." });
  }
};

exports.resetPassword = async (req, res) => {
  const users = getUsers();
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = users.find(
    (u) =>
      u.passwordResetToken === hashedToken &&
      u.passwordResetExpires > Date.now()
  );

  if (!user) {
    return res.status(400).json({ error: "Token je neplatný nebo vypršel." });
  }

  user.password = await bcrypt.hash(req.body.password, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  saveUsers(users);

  const token = signToken(user.id);
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ message: "Heslo bylo úspěšně změněno!", token });
};

exports.verifyResetToken = (req, res, next) => {
  const users = getUsers();
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = users.find(
    (u) =>
      u.passwordResetToken === hashedToken &&
      u.passwordResetExpires > Date.now()
  );

  if (!user) {
    return res.status(400).send("Token je neplatný nebo vypršel.");
  }

  next();
};

exports.protect = (req, res, next) => {
  const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.error("❌ Chybí JWT token!");
    return res.status(401).json({ error: "Nejste přihlášeni." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const users = getUsers();
    const user = users.find((u) => u.id === decoded.id);

    if (!user) {
      console.error("❌ Uživatel nebyl nalezen!");
      return res.status(401).json({ error: "Uživatel neexistuje." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Chyba ověření JWT:", error);
    return res.status(401).json({ error: "Neplatný token." });
  }
};
