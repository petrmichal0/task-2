const express = require("express");
const authController = require("../controllers/authController");
const {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
} = require("../validators/userValidator");

const router = express.Router();

router
  .route("/signup")
  .get((req, res) => res.render("signup"))
  .post(signupValidator, authController.signup);

router
  .route("/login")
  .get((req, res) => res.render("login"))
  .post(loginValidator, authController.login);

router.route("/logout").get(authController.logout);

router
  .route("/forgot-password")
  .get((req, res) => res.render("forgotPassword"))
  .post(forgotPasswordValidator, authController.forgotPassword);

router
  .route("/reset-password/:token")
  .get(authController.verifyResetToken, (req, res) =>
    res.render("resetPassword", { token: req.params.token })
  )
  .post(authController.resetPassword);

module.exports = router;
