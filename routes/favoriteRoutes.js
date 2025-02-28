const express = require("express");
const router = express.Router();
const { protect } = require("../controllers/authController");
const {
  getFavorites,
  toggleFavorite,
} = require("../controllers/favoriteController");

router.route("/").get(protect, getFavorites);

router.route("/toggle").post(protect, toggleFavorite);

module.exports = router;
