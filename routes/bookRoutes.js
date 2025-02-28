const express = require("express");
const axios = require("axios");
const router = express.Router();
const { isLoggedIn } = require("../controllers/authController");
const fs = require("fs");
const path = require("path");

const favoriteFilePath = path.join(__dirname, "../data/favorites.json");

router.route("/search").get(isLoggedIn, async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.render("home", { error: "Zadejte název knihy." });
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}`
    );

    const books = response.data.items.slice(0, 5).map((item) => {
      const volumeInfo = item.volumeInfo;
      return {
        title: volumeInfo.title || "Název neznámý",
        author: volumeInfo.authors
          ? volumeInfo.authors.join(", ")
          : "Autor neznámý",
        publishedDate: volumeInfo.publishedDate || "Datum neznámé",
        description: volumeInfo.description
          ? volumeInfo.description.slice(0, 200) + "..."
          : "Popis není k dispozici.",
        thumbnail: volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : "",
        favorite: false,
      };
    });

    let favorites = {};
    if (fs.existsSync(favoriteFilePath)) {
      try {
        favorites = JSON.parse(fs.readFileSync(favoriteFilePath, "utf-8"));
      } catch (error) {
        console.error("❌ Chyba při čtení favorites.json:", error);
      }
    }

    const userFavorites = res.locals.user
      ? favorites[res.locals.user.email] || []
      : [];

    books.forEach((book) => {
      book.favorite = userFavorites.some(
        (fav) => fav.title === book.title && fav.author === book.author
      );
    });

    return res.render("home", {
      books,
      user: res.locals.user || null,
    });
  } catch (error) {
    console.error("Chyba při vyhledávání knih:", error.message);
    return res.render("home", {
      error: `Pro dotaz "${query}" nebyly nalezeny žádné knihy.`,
    });
  }
});

module.exports = router;
