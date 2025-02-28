# Backend aplikace Book Finder

## Název a popis projektu
Book Finder je backend aplikace napsaná v Node.js, která umožňuje vyhledávání knih pomocí Google Books API. Uživatelé si mohou registrovat účet, přihlásit se a přidávat knihy do seznamu oblíbených. Aplikace používá Mustache pro renderování šablon, JWT pro autentizaci a bcrypt pro šifrování hesel.
## Stav projektu
![Static Badge](https://img.shields.io/badge/status-online-brightgreen)

## Demo aplikace
[🔗 Demo aplikace](https://task-2-ec47674ccca5.herokuapp.com/)

## Obsah
- [Název a popis projektu](#název-a-popis-projektu)
- [Stav projektu](#stav-projektu)
- [Demo aplikace](#demo-aplikace)
- [Obsah](#obsah)
- [Funkce](#funkce)
- [Instalace](#instalace)
  - [Požadavky](#požadavky)
  - [Postup instalace](#postup-instalace)
  - [Nastavení proměnných prostředí](#nastavení-proměnných-prostředí)
- [Použití](#použití)
  - [Spuštění v režimu vývoje](#spuštění-v-režimu-vývoje)
  - [Spuštění v produkčním režimu](#spuštění-v-produkčním-režimu)
- [API Endpointy](#api-endpointy)
- [Struktura projektu](#struktura-projektu)
- [Použité technologie](#použité-technologie)
- [Knihovny třetích stran](#knihovny-třetích-stran)

## Funkce
- Registrace a přihlášení uživatelů
- Vyhledávání knih pomocí Google Books API
- Zpracování chyb a validace vstupních dat
- Přidávání a odebírání knih ze seznamu oblíbených
- Ochrana přístupu pomocí JWT autentizace
- Možnost resetování hesla
- Renderování šablon pomocí Mustache

## Instalace

### Požadavky
- Node.js (v21.0.0 nebo novější)
- npm (v11 nebo novější)

### Postup instalace

1. Naklonování repozitáře:
    ```bash
    git clone https://github.com/petrmichal0/task-2.git
    ```

2. Přejděte do složky projektu:
    ```bash
    cd task-2
    ```

3. Instalace závislostí:
    ```bash
    npm install
    ```

### Nastavení proměnných prostředí

1. **Vytvoření souboru `.env`:**  
   V kořenovém adresáři projektu vytvořte soubor `.env`.

2. **Definování požadovaných proměnných prostředí:**  
   Přidejte následující proměnné do vašeho souboru `.env`. 

    ```env
    NODE_ENV=development
    PORT=3020
    ```

3. **Zabezpečení souboru:**
   - Přidejte `.env` do `.gitignore`, aby nebyl nahrán do repozitáře a citlivé údaje zůstaly chráněné.

## Postup spuštění

### Spuštění v režimu vývoje

Spusťte vývojový server pomocí nodemon:

```bash
npm run dev
```

Aplikace se spustí s nodemonem, který ji automaticky restartuje při změně kódu.
Výchozí port: 3020
API bude dostupné na http://localhost:3020.

### Spuštění v produkčním režimu

To start the application in production mode, use the following command:

```bash
npm start
```
Aplikace poběží s `NODE_ENV=production`. na výchozím portu `3020`.

## API Endpointy

<table>
  <tr>
    <th style="background-color:#d6eaf8; color:#000000;">HTTP Metoda</th>
    <th style="background-color:#d6eaf8; color:#000000;">Endpoint</th>
    <th style="background-color:#d6eaf8; color:#000000;">Popis</th>
    <th style="background-color:#d6eaf8; color:#000000;">Příklad požadavku</th>
    <th style="background-color:#d6eaf8; color:#000000;">Příklad odpovědi</th>
  </tr>
  <tr>
    <td>GET</td>
    <td>/</td>
    <td>Zobrazení domovské stránky</td>
    <td>None</td>
    <td>
      HTML stránka s vyhledáváním knih
    </td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/books/search?query=název</td>
    <td>Vyhledávání knih podle názvu</td>
    <td>/books/search?query=Harry+Potter</td>
    <td>
      {
        "books": [
          {
            "title": "Harry Potter a Tajemná komnata",
            "author": "J.K. Rowling",
            "publishedDate": "2016-08-30",
            "description": "Pokračování příběhu o Harrym Potterovi...",
            "thumbnail": "URL obrázku",
            "favorite": false
          }
        ]
      }
    </td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/auth/signup</td>
    <td>Zobrazení registrační stránky</td>
    <td>None</td>
    <td>
      HTML stránka s formulářem pro registraci
    </td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/auth/signup</td>
    <td>Registrace nového uživatele</td>
    <td>{ "name": "Petr", "email": "petr@example.com", "password": "123456", "passwordConfirm": "123456" }</td>
    <td>
      {
        "message": "Registrace úspěšná!",
        "token": "JWT_TOKEN",
        "user": { "id": "abc123", "name": "Petr", "email": "petr@example.com" }
      }
    </td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/auth/login</td>
    <td>Zobrazení přihlašovací stránky</td>
    <td>None</td>
    <td>
      HTML stránka s formulářem pro přihlášení
    </td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/auth/login</td>
    <td>Přihlášení uživatele</td>
    <td>{ "email": "petr@example.com", "password": "123456" }</td>
    <td>
      {
        "message": "Přihlášení úspěšné!",
        "user": { "id": "abc123", "name": "Petr", "email": "petr@example.com" }
      }
    </td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/auth/logout</td>
    <td>Odhlášení uživatele</td>
    <td>None</td>
    <td>
      {
        "message": "Odhlášení bylo úspěšné!"
      }
    </td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/favorites</td>
    <td>Zobrazení oblíbených knih přihlášeného uživatele</td>
    <td>None</td>
    <td>
      {
        "favorites": [
          {
            "title": "Harry Potter a Tajemná komnata",
            "author": "J.K. Rowling",
            "publishedDate": "2016-08-30",
            "description": "Druhý díl série Harry Potter",
            "thumbnail": "URL obrázku",
            "favorite": true
          }
        ]
      }
    </td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/favorites/toggle</td>
    <td>Přidání/odebrání knihy z oblíbených</td>
    <td>{ "title": "Harry Potter a Tajemná komnata", "author": "J.K. Rowling" }</td>
    <td>
      {
        "favorites": [
         {
            "title": "Harry Potter a Tajemná komnata",
            "author": "J.K. Rowling",
            "publishedDate": "2016-08-30",
            "description": "Druhý díl série Harry Potter",
            "thumbnail": "URL obrázku",
            "favorite": false
          }
        ]
      }
    </td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/auth/forgot-password</td>
    <td>Zobrazení formuláře pro reset hesla</td>
    <td>None</td>
    <td>
      HTML stránka s formulářem pro reset hesla
    </td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/auth/forgot-password</td>
    <td>Odeslání e-mailu s odkazem na reset hesla</td>
    <td>{ "email": "petr@example.com" }</td>
    <td>
      {
        "message": "Token byl odeslán na e-mail."
      }
    </td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/auth/reset-password/:token</td>
    <td>Zobrazení formuláře pro reset hesla</td>
    <td>/auth/reset-password/abcd1234</td>
    <td>
      HTML stránka pro zadání nového hesla
    </td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/auth/reset-password/:token</td>
    <td>Resetování hesla</td>
    <td>{ "password": "novéheslo", "passwordConfirm": "novéheslo" }</td>
    <td>
      {
        "message": "Heslo bylo úspěšně změněno!",
        "token": "NOVÝ_JWT_TOKEN"
      }
    </td>
  </tr>
</table>

## Project Structure

```css
task2/
├── controllers/
│   ├── authController.js
│   ├── errorController.js
│   ├── favoriteController.js
├── data/
│   ├── favorites.json
│   ├── users.json
├── public/
│   ├── styles.css
├── routes/
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   ├── favoriteRoutes.js
│   ├── homeRoutes.js
├── utils/
│   ├── createAppError.js
│   ├── email.js
├── validators/
│   ├── userValidator.js
├── views/
│   ├── error.mustache
│   ├── favorites.mustache
│   ├── forgotPassword.mustache
│   ├── home.mustache
│   ├── login.mustache
│   ├── resetPassword.mustache
│   ├── signup.mustache
├── .env
├── .gitignore
├── app.js
├── package.json
├── server.js
```

## Použité technologie

[![Node.js Badge](https://img.shields.io/badge/-Node.js-43853D?style=for-the-badge&labelColor=black&logo=node.js&logoColor=43853D)](#)
[![Express Badge](https://img.shields.io/badge/-Express-000000?style=for-the-badge&labelColor=black&logo=express&logoColor=white)](#)

## Knihovny třetích stran

* **axios**: HTTP klient založený na promise pro provádění požadavků na externí API.
* **dotenv**: Modul pro načítání proměnných prostředí ze souboru `.env` do `process.env`.
* **express-validator**: Sada middlewarů pro validaci dat v aplikacích využívajících Express.js.
* **Mustache**: Šablonovací engine bez logiky pro renderování HTML šablon.
* **nodemon** (devDependency): Nástroj, který automaticky restartuje server Node.js při změně souborů během vývoje.
* **nodemailer**: Knihovna pro odesílání e-mailů.
* **bcryptjs**: Šifrování hesel.
* **jsonwebtoken**: Implementace JWT pro autentizaci.


