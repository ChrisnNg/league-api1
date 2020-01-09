// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var cors = require("cors");
const morgan = require("morgan");
const path = require("path");
var qs = require("qs");
const axios = require("axios");
// PG database client/connection setup

// const dbParams = require('./lib/db.js');
// const db = new Pool(dbParams);
// db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("req recieved");
  // res.json({ test: true });
});

app.post("/summonerSearch", (req, res) => {
  let summoner = req.body.username;

  var summonerInfoRequest = {
    method: "GET",
    url: `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}`,
    headers: {
      Origin: "https://developer.riotgames.com",
      "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Riot-Token": process.env.API_KEY,
      "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36"
    },
    json: true
  };

  axios(summonerInfoRequest)
    .then(function(response) {
      res.send(response.data);
    })
    .catch(function(error) {
      console.log(error);
    });
});

app.post("/matchHistory", (req, res) => {
  let accountId = req.body.accountId;

  axios
    .get(
      `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?api_key=${process.env.API_KEY}`
    )
    .then(response => {
      res.send(response.data);
    });
});

app.post("/leagues", (req, res) => {
  let summonerId = req.body.summonerId;

  axios
    .get(
      `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${process.env.API_KEY}`
    )
    .then(response => {
      res.send(response.data);
    });
});

app.post("/masteries", (req, res) => {
  let summonerId = req.body.summonerId;

  axios
    .get(
      `https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}?api_key=${process.env.API_KEY}`
    )
    .then(response => {
      res.send(response.data);
    });
});

app.post("/matchInfo", (req, res) => {
  let matchId = req.body.matchId;

  axios
    .get(
      `https://na1.api.riotgames.com/lol/match/v4/matches/${matchId}?api_key=${process.env.API_KEY}`
    )
    .then(response => {
      res.send(response.data);
    });
});

app.listen(PORT, () => {
  console.log(`League of Legends Backend listening on port ${PORT}`);
});
