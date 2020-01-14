var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = 3000;
var cors = require("cors");

var bubbleServ = require("./custom-modules/bubble-serv");
var apiIsgadnDeprecated = require('./api-isgadn-deprecated/');


// CORS requests support
app.use(cors());

// POST data parsing
app.use(bodyParser.json());

app.use(
  "/api-isgadn",
  bubbleServ({
    apiRoot: "api-isgadn",
    numerizeGetParams: true,
    numerizePathParams: true,
  })
);

app.use(
  "/api-telematic",
  bubbleServ({
    apiRoot: "api-telematic",
    numerizeGetParams: true,
    numerizePathParams: true,
  })
);


// ISGADN API
app.get		('/api-isgadn-deprecated/:module/:dataname/:id/:field',  apiIsgadnDeprecated);
app.put		('/api-isgadn-deprecated/:module/:dataname/:id/:field',  apiIsgadnDeprecated);
app.post	('/api-isgadn-deprecated/:module/:dataname/:id/:field',  apiIsgadnDeprecated);
app.get		('/api-isgadn-deprecated/:module/:dataname/:method',     apiIsgadnDeprecated);
app.post	('/api-isgadn-deprecated/:module/:dataname/:method',     apiIsgadnDeprecated);
app.get		('/api-isgadn-deprecated/:module/:dataname/',		apiIsgadnDeprecated);
app.post	('/api-isgadn-deprecated/:module/:dataname/',		apiIsgadnDeprecated);
app.patch	('/api-isgadn-deprecated/:module/:dataname/:id',	apiIsgadnDeprecated);
app.patch	('/api-isgadn-deprecated/:module/:dataname/',		apiIsgadnDeprecated);
app.delete	('/api-isgadn-deprecated/:module/:dataname/:ids',  apiIsgadnDeprecated);
app.put		('/api-isgadn-deprecated/:module/:dataname/',		apiIsgadnDeprecated);
app.post	('/api-isgadn-deprecated/:method',     apiIsgadnDeprecated); // logout

app.get('/', function (req, res) {
  res.send('use "/api-isgadn/module/asset/method" to get to API');
});

// START server
app.listen(port, function () {
  console.log(`listening http://localhost:${port}`);
});

