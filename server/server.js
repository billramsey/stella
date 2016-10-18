var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static(__dirname + './../client'));


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + './../client/index.html'));
});


require('./chat.js')(app, express);

var port = 3000;
app.listen(port, () => {
  console.log('application started on port', port);
});