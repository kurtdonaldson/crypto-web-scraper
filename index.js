const cheerio = require("cheerio");
const express = require("express");
const axios = require("axios");
const path = require("path");
const PORT = 3000;

const app = express();

const url = "https://coinmarketcap.com/";

const crytoData = {
  number: "",
  name: "",
  price: "",
  change24h: "",
};

const crytoDataArray = [];

async function getCrytoPrices() {
  //Fetch data using axios
  const { data } = await axios.get(url);
  //Load html in cheerio. We parse it the html data
  const $ = cheerio.load(data);
  //Access data
  const elemSelector =
    "#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr";
  $(elemSelector).each((index, element) => {
    if (index <= 10) {
      $(element)
        .children()
        .each((childIndex, childElement) => {
          const tableCellValue = $(childElement).text();

          //   Filter out blank space. Will check if tableCellVale is false
          if (tableCellValue) {
            console.log(tableCellValue);
          }
        });
    }
  });
}

getCrytoPrices();

//Set view engine to ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
