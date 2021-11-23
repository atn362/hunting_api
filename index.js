const PORT = 3001;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();

const newspapers = [
  {
    name: "minnesotadnr",
    address: "https://www.dnr.state.mn.us/hunting/index.html",
    base: "https://www.dnr.state.mn.us/",
  },
  {
    name: "outdoornews",
    address: "https://www.outdoornews.com/outdoor-news-hunting/",
    base: "",
  },
  {
    name: "usnews",
    address: "https://www.usnews.com/topics/subjects/hunting",
    base: "",
  },
  {
    name: "deeranddeerhunting",
    address:
      "https://www.deeranddeerhunting.com/category/content/articles/deer-news",
    base: "",
  },
  {
    name: "foxnews",
    address: "https://www.foxnews.com/category/great-outdoors/hunting",
    base: "https://www.foxnews.com/",
  },
];

const articles = [];

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    $('a:contains("hunt")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Welcome to my hunting API");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperId", async (req, res) => {
 const newspaperId = req.params.newspaperId

 const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
  console.log(newspaperAddress);
  // axios.get()
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));