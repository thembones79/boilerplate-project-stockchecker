var mongoose = require("mongoose");

// Stock Schema
var stockSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
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

// Get Stock
module.exports.getStockById = function(id, callback) {
  Stock.findById(id, callback);
};

//Add Stock
module.exports.addStock = function(stock, callback) {
  Stock.create(stock, callback);
};

//Update Stock
module.exports.updateStock = function(id, stock, options, callback) {
  var query = { _id: id };
  var update = {
    name: stock.name
  };
  Stock.findOneAndUpdate(query, update, options, callback);
};

//Delete Stock
module.exports.deleteStock = function(id, callback) {
  var query = { _id: id };
  Stock.remove(query, callback);
};
