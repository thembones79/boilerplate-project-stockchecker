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

    // if like===true
    // connect to the database and check if the queried symbol exists
    // if not: create it and then push user's ip into the ips array
    // if is: execute findSymbolThenAddIp function providing ip and symbol ino it

    if (!Array.isArray(req.query.stock)) {
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
          var stock = quote["01. symbol"];
          var price = quote["05. price"];
          if (!stock) {
            res.send("incorrect quote symbol");
          }

          if (req.query.like) {
          } else {
          }

          var stockData = {
            stockData: {
              stock,
              price,
              likes: 1
            }
          };

          res.json(stockData);
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      var stockData = { stockData: [] };

      axios
        .get("https://www.alphavantage.co/query", {
          params: {
            function: "GLOBAL_QUOTE",
            symbol: req.query.stock[0],
            apikey: "GIXVFXXXUWZ78ZDG"
          }
        })
        .then(function(response) {
          var quote = response.data["Global Quote"];
          var stock = quote["01. symbol"];
          var price = quote["05. price"];
          if (!stock) {
            res.send("incorrect quote symbol");
          }
          stockData["stockData"][0] = {
            stock,
            price,
            likes: 1
          };
          // res.json(stockData);
        })
        .catch(function(error) {
          console.log(error);
        })
        .finally(function() {
          // always executed
          axios
            .get("https://www.alphavantage.co/query", {
              params: {
                function: "GLOBAL_QUOTE",
                symbol: req.query.stock[1],
                apikey: "GIXVFXXXUWZ78ZDG"
              }
            })
            .then(function(response) {
              var quote = response.data["Global Quote"];
              var stock = quote["01. symbol"];
              var price = quote["05. price"];
              if (!stock) {
                res.send("incorrect quote symbol");
              }
              stockData["stockData"][1] = {
                stock,
                price,
                likes: 1
              };
              res.json(stockData);
            })
            .catch(function(error) {
              console.log(error);
            });
        });
    }
  });
};
