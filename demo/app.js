const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bubbleServ = require("../middleware");
// const bubbleServ = require("bubble-serv");

// POST data parsing
app.use(bodyParser.json());

app.use(express.static('static'));

app.get("/", (req, res) => {
  res.sendFile("./static/index.html", { root: __dirname });
});

app.use(
  '/api',
  bubbleServ({
    apiRoot: "/demo/api-files",
    traceScriptResolving: false,
    numerizeGetParams: true,
    numerizePathParams: true,
  })
);

// START server
app.listen(3000, function () {
  console.log(`listening http://localhost:3000/api`);
  console.log(`Go to  http://localhost:3000 to see series of requests.`);
});
