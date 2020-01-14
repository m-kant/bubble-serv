module.exports = function (req, res) { 
      const origin = req.headers.origin || "*";
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Credentials", "true");
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PATCH, PUT, DELETE"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      res.header("Content-Type", "application/json; charset=utf-8");
}