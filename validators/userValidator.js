const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const signupValidator = [
  body("name").notEmpty().withMessage("Jméno je povinné"),

  body("email")
    .isEmail()
    .withMessage("Neplatný formát e-mailu")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Heslo musí mít alespoň 6 znaků"),

  body("passwordConfirm")
    .notEmpty()
    .withMessage("Potvrzení hesla je povinné")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Hesla se neshodují");
      }
      return true;
    }),

  handleValidationErrors,
];

const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Neplatný formát e-mailu")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Heslo je povinné"),
  handleValidationErrors,
];

const forgotPasswordValidator = [
  body("email")
    .isEmail()
    .withMessage("Neplatný formát e-mailu")
    .normalizeEmail(),
  handleValidationErrors,
];

module.exports = { signupValidator, loginValidator, forgotPasswordValidator };
