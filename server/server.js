var express = require('express');
var app = express();



app.use(express.static(__dirname + './../client'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + './../client/index.html'));
});

var port = 3000;
app.listen(port, () => {
  console.log('application started on port', port);
});