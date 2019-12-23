const fs = require("fs");
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const schedule = require("node-schedule");
const axios = require("axios");
const cors = require("cors");

const app = express();

const link =
  "https://www.googleapis.com/youtube/v3/search?key=AIzaSyBbuowm3VW22ZC5U3VS2trjCJHMhLiYQ6c&channelId=UCwW9nPcEM2wGfsa06LTYlFg&part=snippet,id&order=date&maxResults=50";

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = 11;
rule.minute = 20;
let x = {};
axios.get(link).then(function(response) {
  // handle success
  console.log(response);
  x = response;
});

var j = schedule.scheduleJob(rule, () => {
  axios.get(link).then(function(response) {
    // handle success

    x = response;

    fs.writeFile("message.json", JSON.stringify(response.data), err => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
  });
});

app.get("/api", (req, res) => {
  res.json(x.data);
  fs.readFile(`${__dirname}/message.json`, (err, data) => {
    if (err) throw err;
    console.log(JSON.parse(data));
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(process.env.PORT || 4000, function() {
  console.log("Your node js server is running");
});
