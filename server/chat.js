var Chat = require('./database');

module.exports = (app, express) => {

  var authenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.sendStatus(401);
  };

  app.get('/api/chats/:lastDate?', authenticated, function(req, res, next) {
    console.log('lastdate', req.params.lastDate);
    Chat.find(function(err, chats) {
      if (err) {
        return res.json({error: err});
      }
      return res.json(chats);
    });
  });
  var isValid = function(text) {
    return (text !== null && text !== undefined && text.trim() !== '');
  };
  app.post('/api/post', authenticated, function(req, res, next) {
    var user = req.user;
    var text = req.body.text;
    var sessionId = req.sessionID;

    console.log('user', user, 'text', text);
    if (!isValid(user)) {
      return res.json({error: 'empty user' + user});
    }
    if (!isValid(text)) {
      return res.json({error: 'empty text' + text});
    }

    console.log('last date', req.params.lastDate);
    var message = new Chat({user: user, text: text, session: sessionId});
    message.save(function(err, m) {
      if (err) {
        return res.json({error: err});
      }
      return res.json(m);
    });
  });
};