var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var messages = require('./messages');

app.use(express.static(__dirname + './../client'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + './../client/index.html'));
});

require('./session.js')(app, express);

var authenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
};
app.get('/api/chats/:lastDate?', authenticated, messages.getPostsRoute);
app.get('/api/public', messages.getPostsRoute);
app.post('/api/post', authenticated, messages.addPostRoute);

var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('application started on port', port);
});