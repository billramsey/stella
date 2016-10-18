var Chat = require('./database');


module.exports = (app, express) => {
  app.get('/api/chats/:lastDate?', function(req, res, next) {
    console.log(req.params.lastDate);
    Chat.find(function(err, chats) {
      if (err) {
        return res.json({error: err});
      }
      return res.json(chats);
    });
    // res.json([
    //   {user: 'bill', text: 'hi'},
    //   {user: 'michael', text: 'yo'}
    // ]);
  });
  var isValid = function(text) {
    return (text !== null && text !== undefined && text.trim() !== '');
  };
  app.post('/api/post', function(req, res, next) {
    var user = req.body.user;
    var text = req.body.text;
    console.log('user', user, 'text', text);
    if (!isValid(user)) {
      return res.json({error: 'empty user' + user});
    }
    if (!isValid(text)) {
      return res.json({error: 'empty text' + text});
    }

    console.log(req.params.lastDate);
    var message = new Chat({user: user, text: text});
    message.save(function(err, m) {
      if (err) {
        return res.json({error: err});
      }
      return res.json(m);
    });
  });
};