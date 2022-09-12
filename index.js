const cheerio = require("cheerio");
const express = require("express");
const axios = require("axios");
const path = require("path");
const { setPriority } = require("os");
const PORT = 3000;

const app = express();

const url = "https://coinmarketcap.com/";



//Array of objects? Try figure this out

async function getCrytoPrices() {
  //Add try/catch for error handling
  try{
//Fetch data using axios
const { data } = await axios.get(url);
//Load html in cheerio. We parse it the html data
const $ = cheerio.load(data);
//Access data
const elemSelector =
  "#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr";
//Store results
const crytoDataKeys = [
  "position", 
  "name", 
  "price", 
  "1hr%", 
  "24h%", 
  "7day%",
  "marketCap",
  "volume24h",
  "circulatingSupply"
];

const crytoObjectArray = [];

  $(elemSelector).each((parentIndex, parentElement) => {
//We have a key index variable set to 0. This is so we can increment the index
// to allow the key-value pairs to be ordered appropriately. 
  let cryptoKeyIndex = 0;
  const crypoObject = {}
  //parent index set to <=9 because we only want top 10 crytpo prices
  if (parentIndex <= 9) {
    $(parentElement)
      .children()
      .each((childIndex, childElement) => {
        let tableCellValue = $(childElement).text();
        // below we are tidying up the name, marketcap and 24hr volume.
        //First, we pass in child to cheerio. I used the dev tools to 
        //see how I could use selectors to target the specific data I wanted
        if(cryptoKeyIndex === 1){
          tableCellValue = $('p:first-child', $(childElement).html()).text();
         }
        if(cryptoKeyIndex === 6){
         tableCellValue = $('p span:first-child', $(childElement).html()).text();
        }
        if(cryptoKeyIndex === 7){
          tableCellValue = $('div a p:first-child', $(childElement).html()).text();
         }

      
        //   Filter out blank space. Will check if tableCellVale is false
        if (tableCellValue) {
          // console.log(crytoDataArray[cryptoKeyIndex]);
          crypoObject[crytoDataKeys[cryptoKeyIndex]] = tableCellValue;

          //Every time the above function runs, we will increment by 1
          cryptoKeyIndex++;
        }
      });
      crytoObjectArray.push(crypoObject);
  }
});
return crytoObjectArray;

  }catch (error){
    console.log(error)
  }
}


//Set view engine to ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try{
    const cryptoEjsData = await getCrytoPrices();

    res.render("index", {cryptoEjsData});


  }catch(error){
    console.log(error)
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});


// Current setPriority - Filter out marketcap and volume 24 extra text