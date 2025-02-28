const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/").get(authController.isLoggedIn, (req, res) => {
  res.render("home", { user: res.locals.user });
});

module.exports = router;
