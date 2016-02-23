var express = require('express');
var app = express();
var PORT = process.env.NODE_ENV || 3000;

app.get('/', function(req, res) {
  res.send("Server is functioning...");
});



app.listen(PORT, function() {
  console.log("App listening on port %s", PORT);
});