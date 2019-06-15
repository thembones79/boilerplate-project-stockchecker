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

module.exports.findSymbolThenAddIp = function(symbol, ip, callback) {
  Stock.find({ symbol }, (err, data) => {
    console.log({ older_data: data });
    console.log({ ip });
    console.log({ indexOfIp: data[0].ips.indexOf(ip) });
    console.log({ niggalicious: data[0].symbol });

    if (err) {
      console.log({ err });
    }

    if (data[0].ips.indexOf(ip) === -1) {
      console.log("inside if");
      data[0].ips.push(ip);
      console.log({ old_data: data[0].ips });
      data[0].save((err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log({ new_data: data });
          callback;
        }
      });
    } else {
      console.log("ip already exists");
      callback;
    }
  });
};

module.exports.findSymbolAndGetNoOfIps = function(symbol, callback) {
  Stock.find({ symbol }, (err, data) => {
    if (err) {
      console.log({ err });
    }
    console.log({ xdata: data[0].ips.length });
    callback(data[0].ips.length);
  });
};
