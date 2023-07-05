const PORT = process.env.PORT || 3001;
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
  {
    name: "nmwildlife",
    address: "https://www.wildlife.state.nm.us/hunting/hunting-news/",
    base: "",
  },
  {
    name: "gohunt",
    address: "https://www.gohunt.com/category/news",
    base: "https://www.gohunt.com",
  },
  {
    name: "meateater",
    address: "https://www.themeateater.com/",
    base: "https://www.themeateater.com",
  },
  {
    name: "fieldandstream",
    address: "https://www.fieldandstream.com/",
    base: "",
  },
  {
    name: "wisconsin",
    address: "https://dnr.wisconsin.gov",
    base: "https://dnr.wisconsin.gov",
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

app.get("/news/:newspaperId", (req, res) => {
  const newspaperId = req.params.newspaperId;

  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $('a:contains("hunt")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
