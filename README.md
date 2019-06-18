**FreeCodeCamp**- Information Security and Quality Assurance
------

# 📈 ISQA_5 - Nasdaq Stock Price Checker

1) SET NODE_ENV to `test` without quotes and set DB to your mongo connection string
2) Complete the project in `routes/api.js` or by creating a handler/controller
3) You will add any security features to `server.js`
4) You will create all of the functional tests in `tests/2_functional-tests.js`

-------

## Solution:
[https://spice-checking.glitch.me/](https://spice-checking.glitch.me/)


## Source:
[https://github.com/thembones79/boilerplate-project-stockchecker](https://github.com/thembones79/boilerplate-project-stockchecker)


------


### User Stories
- Set the content security policies to only allow loading of scripts and css from your server.
- I can GET `/api/stock-prices` with form data containing a Nasdaq stock ticker and recieve back an object stockData.
- In stockData, I can see the `stock`(string, the ticker), `price`(decimal in string format), and `likes`(int).
- I can also pass along field like as `true`(boolean) to have my like added to the stock(s). Only 1 like per ip should be accepted.
- If I pass along 2 stocks, the return object will be an array with both stock's info but instead of likes, it will display `rel_likes`(the difference betwwen the likes) on both.
- A good way to recieve current price is the following external API(replacing 'GOOG' with your stock): `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=GOOG&apikey=yourFreeKey`
- All 5 functional tests are complete and passing.
### Example usage:
```
/api/stock-prices?stock=goog
/api/stock-prices?stock=goog&like=true
/api/stock-prices?stock=goog&stock=msft
/api/stock-prices?stock=goog&stock=msft&like=true
```
### Example return:
```
{"stockData":{"stock":"GOOG","price":"786.90","likes":1}}
{"stockData":[{"stock":"MSFT","price":"62.30","rel_likes":-1},{"stock":"GOOG","price":"786.90","rel_likes":1}]}
```

