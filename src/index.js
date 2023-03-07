// Pievienojam nepieciešamās bibliotēkas
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

// Pievienojam savu datubāzes savienojumu un metodes
const connect = require("./db");
const UserAuth = require("./method");

// Izveidojam maršrutētāju
const router = express.Router();

// Veicam savienojumu ar datubāzi
connect();

// Norādām portu, kurā strādāsim
const port = process.env.PORT || 3000;

// Izveidojam Express aplikāciju
const app = express();

// Pievienojam Express middleware
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// Norādām ceļu uz mūsu HTML templātiem
const tempelatePath = path.join(__dirname, "../templates");
const publicPath = path.join(__dirname, "../public");

// Pievienojam bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Norādām, ka izmantosim "hbs" kā templātu dzinēju
app.set("view engine", "hbs");
app.set("views", tempelatePath);

// Pievienojam static middleware, lai serveris varētu servēt mūsu publisko failu direktoriju
app.use(express.static(publicPath));

// Izveidojam "/login" maršrutu
app.get("/", (req, res) => {
  res.render("login");
});

// Izveidojam "/signup" maršrutu
app.get("/signup", (req, res) => {
  res.render("signup");
});

// Pievienojam "/login" POST maršrutu, izmantojot UserAuth.login metodi
app.post("/login", UserAuth.login);

// Pievienojam "/signup" POST maršrutu, izmantojot UserAuth.signUp metodi
app.post("/signup", UserAuth.signUp);

// Uztveram uz norādīto portu
app.listen(port, () => {
  console.log("Server started on http://localhost:3000");
});
