const fs = require("fs");
const path = require("path");

const favoriteFilePath = path.join(__dirname, "../data/favorites.json");

const getFavorites = (req, res) => {
  const email = req.user.email;

  if (!fs.existsSync(favoriteFilePath)) {
    console.warn("⚠️ Soubor favorites.json neexistuje, vytvářím nový.");
    fs.writeFileSync(favoriteFilePath, JSON.stringify({}, null, 2));
  }

  const data = fs.readFileSync(favoriteFilePath, "utf-8") || "{}";
  const favorites = JSON.parse(data);
  const userFavorites = favorites[email] || [];

  res.render("favorites", { favorites: userFavorites });
};

const saveFavorites = (favorites) => {
  try {
    fs.writeFileSync(favoriteFilePath, JSON.stringify(favorites, null, 2));
  } catch (error) {
    console.error("❌ Chyba při ukládání favorites.json:", error);
  }
};

const toggleFavorite = (req, res) => {
  if (!req.user) {
    console.error("❌ Uživatel není přihlášen!");
    return res.status(401).json({ error: "Nejste přihlášeni." });
  }

  const email = req.user.email;

  const { title, author, publishedDate, description, thumbnail } = req.body;

  if (!title || !author) {
    return res.status(400).json({ error: "Chybí informace o knize." });
  }

  let favorites = {};
  if (fs.existsSync(favoriteFilePath)) {
    try {
      const data = fs.readFileSync(favoriteFilePath, "utf-8");
      favorites = data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("❌ Chyba při čtení favorites.json:", error);
      favorites = {};
    }
  }

  if (!favorites[email]) {
    favorites[email] = [];
  }

  const existingIndex = favorites[email].findIndex(
    (book) => book.title === title && book.author === author
  );

  if (existingIndex !== -1) {
    favorites[email].splice(existingIndex, 1);
  } else {
    favorites[email].push({
      title,
      author,
      publishedDate: publishedDate || "N/A",
      description: description || "No description available",
      thumbnail: thumbnail || "",
      favorite: true,
    });
  }

  saveFavorites(favorites);

  res.json({ favorites: favorites[email] });
};

module.exports = { getFavorites, toggleFavorite };
