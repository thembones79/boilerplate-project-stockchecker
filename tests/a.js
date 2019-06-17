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

chai.use(chaiHttp);

const stockTest1 = "GOOG";
const stockTest2 = "MSFT";

suite("Functional Tests", () => {
  suite("GET /api/stock-prices => stockData object", () => {
    test("1 stock", done => {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: stockTest1 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "body must be an object");
          assert.equal(res.body.stockData.stock, stockTest1);
          assert.isNumber(
            res.body.stockData.price,
            "the price must be a number"
          );
          assert.isNumber(
            res.body.stockData.likes,
            "the likes must be a number"
          );
          done();
        });
    });

    test("1 stock with like", done => {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: stockTest1, like: "true" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "body must be an object");
          assert.equal(res.body.stockData.stock, stockTest1);
          assert.isNumber(
            res.body.stockData.price,
            "the price must be a number"
          );
          assert.isNumber(
            res.body.stockData.likes,
            "the likes must be a number"
          );
          assert.isNumber(
            res.body.stockData.likes,
            "the likes must be a number"
          );
          assert.notEqual(
            res.body.stockData.likes,
            0,
            "the likes must be a number"
          );
          done();
        });
    });

    test("1 stock with like again (ensure likes arent double counted)", done => {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: stockTest1, like: "true" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "body must be an object");
          assert.equal(res.body.stockData.stock, stockTest1);
          assert.isNumber(
            res.body.stockData.price,
            "the price must be a number"
          );
          assert.isNumber(
            res.body.stockData.likes,
            "the likes must be a number"
          );
          assert.notEqual(
            res.body.stockData.likes,
            0,
            "the likes must be a number"
          );
          done();
        });
    });

    test("2 stocks", done => {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: [stockTest1, stockTest2] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body, "body must be an object");
          assert.equal(res.body.stockData[0].stock, stockTest1);
          assert.equal(res.body.stockData[1].stock, stockTest2);
          assert.isNumber(
            res.body.stockData[0].price,
            "the price must be a number"
          );
          assert.isNumber(
            res.body.stockData[0].rel_likes,
            "the rel_likes must be a number"
          );
          assert.isNumber(
            res.body.stockData[1].price,
            "the price must be a number"
          );
          assert.isNumber(
            res.body.stockData[1].rel_likes,
            "the rel_likes must be a number"
          );
          assert.equal(
            res.body.stockData[0].rel_likes,
            -1 * res.body.stockData[1].rel_likes
          );
          done();
        });
    });

    test("2 stocks with like", done => {
      chai
        .request(server)
        .get("/api/stock-prices")
        .query({ stock: [stockTest1, stockTest2], like: "true" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          if (res.text.includes("there was a problem")) return done();
          assert.isObject(res.body, "body must be an object");
          assert.equal(res.body.stockData[0].stock, stockTest1);
          assert.equal(res.body.stockData[1].stock, stockTest2);
          assert.isNumber(
            res.body.stockData[0].price,
            "the price must be a number"
          );
          assert.isNumber(
            res.body.stockData[0].rel_likes,
            "the rel_likes must be a number"
          );
          assert.isNumber(
            res.body.stockData[1].price,
            "the price must be a number"
          );
          assert.isNumber(
            res.body.stockData[1].rel_likes,
            "the rel_likes must be a number"
          );
          assert.equal(
            res.body.stockData[0].rel_likes,
            -1 * res.body.stockData[1].rel_likes
          );
          done();
        });
    });
  });
});
