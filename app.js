const fs = require("fs");
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
rule.minute = 08;
let x = {};

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

app.get("/", (req, res) => {
  res.json(x.data);
  fs.readFile(`${__dirname}/message.json`, (err, data) => {
    if (err) throw err;
    console.log(JSON.parse(data));
  });
});

port = 3000 || process.env.PORT;

app.listen(port, (req, res) => {
  console.log(`Server running at port : ${port}`);
});