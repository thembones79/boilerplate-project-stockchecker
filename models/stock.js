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

// Get Stock by Symbol
module.exports.getStockBySymbol = function(symbol, callback) {
  Stock.find({ symbol }, callback);
};

// Add Stock
module.exports.addStock = function(stock, callback) {
  Stock.create(stock, callback);
};

// Find the stock symbol and add IP to it (if IP does not already exists)
module.exports.findSymbolThenAddIp = function(symbol, ip, callback) {
  Stock.find({ symbol }, (err, data) => {
    if (err) {
      console.log({ err });
    }

    if (data[0].ips.indexOf(ip) === -1) {
      data[0].ips.push(ip);

      data[0].save((err, data) => {
        if (err) {
          console.log(err);
        } else {
          callback();
        }
      });
    } else {
      callback();
    }
  });
};

// Find stock symbol and get number of realted IPs
module.exports.findSymbolAndGetNoOfIps = function(symbol, callback) {
  Stock.find({ symbol }, (err, data) => {
    if (err) {
      console.log({ err });
    }
    if (data.length !== 0) {
      callback(data[0].ips.length || 0);
    } else {
      callback(0);
    }
  });
};
