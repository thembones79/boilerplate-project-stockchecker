/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb");
var Stock = require("../models/stock");

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const axios = require("axios");

module.exports = function(app) {
  app.route("/api/stock-prices").get(function(req, res) {
    /*
  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; //works also for proxy cases (source: https://stackfame.com/get-ip-address-node)
  var ipaddress = ip.split(",")[0]; //trimmed the fat :)

 console.log("--------------------");
 console.log(ip);
 console.log("--------------------");
 console.log(ipaddress);
 console.log("--------------------");
      */

    axios
      .get("https://www.alphavantage.co/query", {
        params: {
          function: "GLOBAL_QUOTE",
          symbol: req.query.stock,
          apikey: "GIXVFXXXUWZ78ZDG"
        }
      })
      .then(function(response) {
        var quote = response.data["Global Quote"];
        var stockData = {
          stockData: {
            stock: quote["01. symbol"],
            price: quote["05. price"],
            likes: 1
          }
        };
        res.json(stockData);
      })
      .catch(function(error) {
        console.log(error);
      })
      .then(function() {});

    /*

 if (!Array.isArray(req.query.stock)){


      axios.get('https://www.alphavantage.co/query', {
    params: {
      function: "GLOBAL_QUOTE",
      symbol: req.query.stock,
      apikey: "GIXVFXXXUWZ78ZDG"
    }
  })
  .then(function (response) {
    var quote = response.data["Global Quote"];
    var stockData = {"stockData":
                     {"stock": quote["01. symbol"],
                      "price": quote["05. price"],
                      "likes":1}}
    res.json(stockData);
  })
  .catch(function (error) {
    console.log(error);
  })







 } else {

 var stockData = {"stockData": []};





      axios.get('https://www.alphavantage.co/query', {
    params: {
      function: "GLOBAL_QUOTE",
      symbol: req.query.stock[0],
      apikey: "GIXVFXXXUWZ78ZDG"
    }
  })
  .then(function (response) {
    var quote = response.data["Global Quote"];
    stockData["stockData"][0]= {"stock": quote["01. symbol"], "price": quote["05. price"], "likes":1}
    // res.json(stockData);







  })
  .catch(function (error) {
    console.log(error);
  })
 .finally(function () {
    // always executed
         axios.get('https://www.alphavantage.co/query', {
    params: {
      function: "GLOBAL_QUOTE",
      symbol: req.query.stock[1],
      apikey: "GIXVFXXXUWZ78ZDG"
    }
  })
  .then(function (response) {
    var quote = response.data["Global Quote"];
    stockData["stockData"][1]= {"stock": quote["01. symbol"], "price": quote["05. price"], "likes":1}
     res.json(stockData);






  })
  .catch(function (error) {
    console.log(error);
  })
  });













 }



    */
  });
};
