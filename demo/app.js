const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bubbleServ = require("../middleware");

// parse data from body of POST, PUT... requests
app.use(bodyParser.json());

app.get("/demo", (req, res) => {
  res.sendFile("./index.html", { root: __dirname });
});

// configure BubbleServ
app.use(
  bubbleServ({
    // location of API files according to project root
    apiRoot: "demo/api",
	  // show in console files serving requests
    traceScriptResolving: false,
    // convert numerical strings to numbers
    numerizeGetParams: true,
    // convert numerical strings to numbers
    numerizePathParams: true,
  })
);

// START server
app.listen(3000, function () {
  console.log(`listening http://localhost:3000`);
  console.log(`Go to  http://localhost:3000/demo to see series of requests.`);
});

