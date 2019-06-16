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
var mongoose = require("mongoose");
const axios = require("axios");

// Connect to mongoose
mongoose.connect(process.env.DB, {
  useNewUrlParser: true
});
mongoose.set("useCreateIndex", true);
var db = mongoose.connection;

module.exports = function(app) {
  app.route("/api/stock-prices").get(function(req, res) {
    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; //works also for proxy cases (source: https://stackfame.com/get-ip-address-node)
    var ipaddress = ip.split(",")[0]; //trimmed the fat :)

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
          var createAndReturnStockDataObject = function(ips) {
            var likes = ips;

            var stockData = {
              stockData: {
                stock,
                price,
                likes
              }
            };
            console.log(stockData);
            res.json(stockData);
          };

          function jsonResult() {
            Stock.findSymbolAndGetNoOfIps(
              stock,
              createAndReturnStockDataObject
            );
          }


          // check if symbol is ok
          if (!stock) {
            res.send("incorrect quote symbol");
          }


          if (req.query.like) {
            Stock.getStockBySymbol(stock, function(err, data) {
              if (err) {
                console.log({ err });
              }

              console.log({ data1: data });

              // check if stock with given symbol exists
              if (data.length) {
                // try to add ip to the stock (add if it is not already exists)
                Stock.findSymbolThenAddIp(stock, ipaddress, jsonResult);
              } else {
                // create stock in the database and add ip to it

                Stock.addStock({ symbol: stock, ips: [ipaddress] }, function(
                  err,
                  data
                ) {
                  if (err) {
                    res.send(err.errmsg);
                    console.log(err.errmsg);
                  }
                  console.log({ data2: data });
                  jsonResult();
                });
              }
            });
          } else {
            jsonResult();
          }
        })
        .catch(function(error) {
          console.log(error);
        })
        .finally(function(){});

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

        })
        .catch(function(error) {
          console.log(error);
        })
        .finally(function() {

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
