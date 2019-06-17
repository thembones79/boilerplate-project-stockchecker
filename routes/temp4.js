"use strict";

const expect = require("chai").expect;
const axios = require("axios");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

const StockSchema = new Schema({
  stockName: { type: String, required: true },
  stockPrice: { type: Number, required: true },
  stockLikes: { type: Number, required: true },
  stockLikesIp: [String]
});
const Stock = mongoose.model("Stock", StockSchema);

module.exports = app => {
  app.route("/api/stock-prices").get((req, res) => {
    if (!req.query.stock) return res.send("there wasn't send any stock");
    const stocks = req.query.stock;
    const like = req.query.like ? req.query.like === "true" : "false";
    const ip = req.header("x-forwarded-for")
      ? req.header("x-forwarded-for").split(",")[0]
      : "test";

    if (!stocks) return res.send("no stock specified");
    if (Array.isArray(stocks)) {
      //two stocks
      if (stocks < 2)
        return res.send("the comparison must be between only TWO stocks");

      let stock1Promise = axios.get(
        "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" +
          stocks[0] +
          "&apikey=" +
          process.env.ALPHA_VANTAGE_KEY
      );
      let stock2Promise = axios.get(
        "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" +
          stocks[1] +
          "&apikey=" +
          process.env.ALPHA_VANTAGE_KEY
      );

      Promise.all([stock1Promise, stock2Promise]).then(values => {
        //If one or both stock don't exist
        if (!values[0].data["Global Quote"] || !values[1].data["Global Quote"])
          return res.send("there was a problem");
        if (!values[0].data["Global Quote"].hasOwnProperty("01. symbol"))
          return res.send("stock " + stocks[0] + " doesn't exist");
        else if (!values[1].data["Global Quote"].hasOwnProperty("01. symbol"))
          return res.send("stock " + stocks[1] + " doesn't exist");

        Stock.findOne(
          { stockName: values[0].data["Global Quote"]["01. symbol"] },
          (err, stockDoc1) => {
            if (err) return res.send("There was an error");
            else if (stockDoc1) {
              //Modify existing stock on the db
              stockDoc1.stockPrice =
                values[0].data["Global Quote"]["05. price"]; //Update stock's price
              likeStock(stockDoc1, like, ip);
              stockDoc1.save(saveFirstStock(res, values[1].data, like, ip));
            } //Creates a new stock into the db
            else
              new Stock(createStock(values[0].data, like, ip)).save(
                saveFirstStock(res, values[1].data, like, ip)
              );
          }
        );
      });
    } else {
      //Only one stock
      axios
        .get(
          "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" +
            stocks +
            "&apikey=" +
            process.env.ALPHA_VANTAGE_KEY
        )
        .then(response => {
          //If stock doesn't exist
          if (!response.data["Global Quote"].hasOwnProperty("01. symbol"))
            return res.send("stock " + stocks + " doesn't exist");
          //Stock exists on alpha vantage db
          Stock.findOne(
            { stockName: response.data["Global Quote"]["01. symbol"] },
            (err, stockDoc) => {
              if (err) return res.send("There was an error");
              else if (stockDoc) {
                //Modify existing stock on the db
                stockDoc.stockPrice =
                  response.data["Global Quote"]["05. price"]; //Update stock's price
                likeStock(stockDoc, like, ip);
                stockDoc.save(saveSingleStock(res));
              } //Create a new stock on the db
              else
                new Stock(createStock(response.data, like, ip)).save(
                  saveSingleStock(res)
                );
            }
          );
        })
        .catch(e => res.send("Error"));
    }
  });
};

const createStock = (data, like, ip) => ({
  stockName: data["Global Quote"]["01. symbol"],
  stockPrice: data["Global Quote"]["05. price"],
  stockLikes: like ? 1 : 0,
  stockLikesIp: like ? [ip] : []
});

const saveFirstStock = (res, data, like, ip) => (err, s1) => {
  if (err) return res.send("error saving the document");
  else
    Stock.findOne(
      { stockName: data["Global Quote"]["01. symbol"] },
      (err, stockDoc2) => {
        if (err) return res.send("There was an error");
        else if (stockDoc2) {
          //Modify existing stock on the db
          stockDoc2.stockPrice = data["Global Quote"]["05. price"]; //Update stock's price
          likeStock(stockDoc2, like, ip);
          stockDoc2.save(saveSecondStock(res, s1));
        } else
          new Stock(createStock(data, like, ip)).save(saveSecondStock(res, s1));
      }
    );
};

const saveSecondStock = (res, s1) => (err, s2) => {
  if (err) return res.send("error saving the document");
  else
    return res.json({
      stockData: [
        {
          stock: s1.stockName,
          price: s1.stockPrice,
          rel_likes: s1.stockLikes - s2.stockLikes
        },
        {
          stock: s2.stockName,
          price: s2.stockPrice,
          rel_likes: s2.stockLikes - s1.stockLikes
        }
      ]
    });
};

const saveSingleStock = res => (err, s) => {
  if (err) return res.send("error saving the document");
  else
    return res.json({
      stockData: {
        stock: s.stockName,
        price: s.stockPrice,
        likes: s.stockLikes
      }
    });
};

const likeStock = (stockDoc, like, ip) => {
  //Like stock
  if (like && !stockDoc.stockLikesIp.includes(ip)) {
    stockDoc.stockLikes += 1;
    stockDoc.stockLikesIp.push(ip);
  }
  //Retire like from stock
  else if (!like && stockDoc.stockLikesIp.includes(ip)) {
    stockDoc.stockLikes -= 1;
    let ipIndex = stockDoc.stockLikesIp.indexOf(ip);
    stockDoc.stockLikesIp = [
      ...stockDoc.stockLikesIp.slice(0, ipIndex),
      ...stockDoc.stockLikesIp.slice(ipIndex + 1)
    ];
  }
};
