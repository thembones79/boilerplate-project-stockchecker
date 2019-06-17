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

mongoose.connect(process.env.DB, {
  useNewUrlParser: true
});
mongoose.set("useCreateIndex", true);
var db = mongoose.connection;

module.exports = function(app) {
  app.route("/api/stock-prices").get(function(req, res) {
    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress; //works also for proxy cases (source: https://stackfame.com/get-ip-address-node)
    var ipaddress = ip.split(",")[0]; //trimmed the fat :)

    // only one stock on input
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

            res.json(stockData);
          };

          // check if symbol is ok
          if (!stock) {
            res.send("incorrect quote symbol");
          }

          function jsonResult() {
            Stock.findSymbolAndGetNoOfIps(
              stock,
              createAndReturnStockDataObject
            );
          }

          // like on input is true
          if (req.query.like) {
            Stock.getStockBySymbol(stock, function(err, data) {
              if (err) {
                console.log({
                  err
                });
              }

              // check if stock with given symbol exists
              if (data.length) {
                // try to add ip to the stock (add if it is not already exists)
                Stock.findSymbolThenAddIp(stock, ipaddress, jsonResult);
              } else {
                // create stock in the database and add ip to it

                Stock.addStock(
                  {
                    symbol: stock,
                    ips: [ipaddress]
                  },
                  function(err, data) {
                    if (err) {
                      res.send(err.errmsg);
                      console.log(err.errmsg);
                    }

                    jsonResult();
                  }
                );
              }
            });
          } else {
            jsonResult();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      var stockData = {
        stockData: []
      };
      var stock1;
      var stock2;
      var price1;
      var price2;
      var likes1;
      var likes2;

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
          stock1 = quote["01. symbol"];
          price1 = quote["05. price"];
          var createStockDataArray = function(ips) {
            likes1 = ips;
          };

          // check if symbol is ok
          if (!stock1) {
            res.send("incorrect quote symbol");
          }

          function jsonResult() {
            Stock.findSymbolAndGetNoOfIps(stock1, createStockDataArray);
          }

          if (req.query.like) {
            Stock.getStockBySymbol(stock1, function(err, data) {
              if (err) {
                console.log({
                  err
                });
              }

              // check if stock with given symbol exists
              if (data.length) {
                // try to add ip to the stock (add if it is not already exists)
                Stock.findSymbolThenAddIp(stock1, ipaddress, jsonResult);
              } else {
                // create stock in the database and add ip to it

                Stock.addStock(
                  {
                    symbol: stock1,
                    ips: [ipaddress]
                  },
                  function(err, data) {
                    if (err) {
                      res.send(err.errmsg);
                      console.log(err.errmsg);
                    }

                    jsonResult();
                  }
                );
              }
            });
          } else {
            jsonResult();
          }
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
              stock2 = quote["01. symbol"];
              price2 = quote["05. price"];
              var createAndReturnStockDataArray = function(ips) {
                likes2 = ips;

                stockData["stockData"][0] = {
                  stock: stock1,
                  price: price1,
                  rel_likes: likes1 - likes2
                };

                stockData["stockData"][1] = {
                  stock: stock2,
                  price: price2,
                  rel_likes: likes2 - likes1
                };

                res.json(stockData);
              };

              // check if symbol is ok
              if (!stock2) {
                res.send("incorrect quote symbol");
              }

              function jsonResult() {
                Stock.findSymbolAndGetNoOfIps(
                  stock2,
                  createAndReturnStockDataArray
                );
              }

              if (req.query.like) {
                Stock.getStockBySymbol(stock2, function(err, data) {
                  if (err) {
                    console.log({
                      err
                    });
                  }

                  // check if stock with given symbol exists
                  if (data.length) {
                    // try to add ip to the stock (add if it is not already exists)
                    Stock.findSymbolThenAddIp(stock2, ipaddress, jsonResult);
                  } else {
                    // create stock in the database and add ip to it

                    Stock.addStock(
                      {
                        symbol: stock2,
                        ips: [ipaddress]
                      },
                      function(err, data) {
                        if (err) {
                          res.send(err.errmsg);
                          console.log(err.errmsg);
                        }

                        jsonResult();
                      }
                    );
                  }
                });
              } else {
                jsonResult();
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        });
    }
  });
};
