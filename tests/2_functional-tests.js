/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");
var noOfLikes;

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("GET /api/stock-prices => stockData object", function() {
    test("1 stock", function(done) {
      this.enableTimeouts(false);
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog" })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "body must be an object");
          assert.equal(res.body.stockData.stock, "GOOG");
          assert.isNumber(
            parseFloat(res.body.stockData.price),
            "the price must be a number"
          );
          assert.isNumber(
            res.body.stockData.likes,
            "the likes must be a number"
          );
          done();
        });
    });

    test("1 stock with like", function(done) {
      this.enableTimeouts(false);
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog", like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "body must be an object");
          assert.equal(res.body.stockData.stock, "GOOG");
          assert.isNumber(
            parseFloat(res.body.stockData.price),
            "the price must be a number"
          );
          assert.isNumber(
            res.body.stockData.likes,
            "the likes must be a number"
          );
          assert.isAbove(
            res.body.stockData.likes,
            0,
            "number of likes must be greater than 0"
          );

          // get number of likes to use in another test
          noOfLikes = res.body.stockData.likes;
          done();
        });
    });

    test("1 stock with like again (ensure likes arent double counted)", function(done) {
      this.enableTimeouts(false);
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: "goog", like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "body must be an object");
          assert.equal(res.body.stockData.stock, "GOOG");
          assert.isNumber(
            parseFloat(res.body.stockData.price),
            "the price must be a number"
          );
          assert.isNumber(
            res.body.stockData.likes,
            "the likes must be a number"
          );
          assert.isAbove(
            res.body.stockData.likes,
            0,
            "number of likes must be greater than 0"
          );
          assert.equal(
            res.body.stockData.likes,
            noOfLikes,
            "number of likes should be the same as in the previous test"
          );
          done();
        });
    });

    test("2 stocks", function(done) {
      this.enableTimeouts(false);
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["goog", "msft"] })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "body must be an object");
          assert.isArray(res.body.stockData, "stockData must be an array");
          assert.equal(res.body.stockData[0].stock, "GOOG");
          assert.equal(res.body.stockData[1].stock, "MSFT");
          assert.isNumber(
            parseFloat(res.body.stockData[0].price),
            "the price must be a number"
          );
          assert.isNumber(
            parseFloat(res.body.stockData[1].price),
            "the price must be a number"
          );
          assert.isNumber(
            res.body.stockData[0].rel_likes,
            "the rel_likes must be a number"
          );
          assert.isNumber(
            res.body.stockData[1].rel_likes,
            "the rel_likes must be a number"
          );
          assert.equal(
            res.body.stockData[1].rel_likes,
            -1 * res.body.stockData[0].rel_likes,
            "rel_likes of one stock must be equal to -rel_likes of the second"
          );
          done();
        });
    });

    test("2 stocks with like", function(done) {
      this.enableTimeouts(false);
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: ["goog", "msft"], like: true })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "body must be an object");
          assert.isArray(res.body.stockData, "stockData must be an array");
          assert.equal(res.body.stockData[0].stock, "GOOG");
          assert.equal(res.body.stockData[1].stock, "MSFT");
          assert.isNumber(
            parseFloat(res.body.stockData[0].price),
            "the price must be a number"
          );
          assert.isNumber(
            parseFloat(res.body.stockData[1].price),
            "the price must be a number"
          );
          assert.isNumber(
            res.body.stockData[0].rel_likes,
            "the rel_likes must be a number"
          );
          assert.isNumber(
            res.body.stockData[1].rel_likes,
            "the rel_likes must be a number"
          );
          assert.equal(
            res.body.stockData[1].rel_likes,
            -1 * res.body.stockData[0].rel_likes,
            "rel_likes of one stock must be equal to -rel_likes of the second"
          );
          done();
        });
    });
  });
});
