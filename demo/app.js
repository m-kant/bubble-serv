var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var bubbleServ = require("../index");

// POST data parsing
app.use(bodyParser.json());

app.get("/demo", (req, res) => {
  res.sendFile("./demo.html", { root: __dirname });
});

app.use(
  bubbleServ({
    apiRoot: "./demo/api",
	traceScriptResolving: false,
    numerizeGetParams: true,
    numerizePathParams: true,
  })
);




// START server
app.listen(3000, function () {
  console.log(`listening http://localhost:3000`);
});

