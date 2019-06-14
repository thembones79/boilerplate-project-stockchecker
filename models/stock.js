var mongoose = require("mongoose");

// Stock Schema
var stockSchema = mongoose.Schema({
  symbol: {
    type: String,
    required: true
  },
  ips: [String]
});

var Stock = (module.exports = mongoose.model("Stock", stockSchema));

// Get Stocks
module.exports.getStocks = function(callback, limit) {
  Stock.find(callback).limit(limit);
};

// Get Stocks for Selected User
module.exports.getStocksByQueryObject = function(obj) {
  Stock.find(obj.queryObject, obj.callback)
    .limit(obj.limit)
    .sort(obj.sortingOrder)
    .select(obj.filterObject);
};

// Get Stock by Symbol
module.exports.getStockBySymbol = function(symbol, callback) {
  Stock.find({ symbol }, callback);
};

// Get Stock
module.exports.getStockById = function(id, callback) {
  Stock.findById(id, callback);
};

//Add Stock
module.exports.addStock = function(stock, callback) {
  Stock.create(stock, callback);
};

//Update Stock
module.exports.updateStock = function(symbol, stock, options, callback) {
  var query = { symbol };
  var update = {
    name: stock.name
  };
  Stock.findOneAndUpdate(query, update, options, callback);
};

module.exports.findSymbolThenAddIp = function(symbol, ip) {
  Stock.find({ symbol }, (err, data) => {
    if (err) {
      console.log(err);
    }

    if (data.ips.indexOf(ip) === -1) {
      data.ips.push(ip);
      data.save((err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log(null, data);
        }
      });
    } else {
      console.log("ip already exists");
    }
  });
};

module.exports.findSymbolAndGetNoOfIps = function(symbol) {
  Stock.find({ symbol }, (err, data) => {
    if (err) {
      return 0;
    }

    return data.ips.length;
  });
};

//Delete Stock
module.exports.deleteStock = function(id, callback) {
  var query = { _id: id };
  Stock.remove(query, callback);
};
