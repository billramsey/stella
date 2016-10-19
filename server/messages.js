var Chat = require('./database');

var getPosts = function(lastDate) {
  return new Promise((resolve, reject) => {
    var query;
    if (lastDate !== 'null' && lastDate !== null && lastDate !== undefined) {
      query = Chat.find({createdOn: {'$gt': lastDate}}).sort({ createdOn: -1 });
    } else {
      query = Chat.find().sort({createdOn: -1 }).limit(10);
    }
    query.exec(function(err, chats) {
      if (err) {
        return reject(err);
      }
      return resolve(chats.reverse());
    });      
  });
};

var getPostsRoute = function(req, res, next) {
  getPosts(req.params.lastDate)
  .then((chats) => {
    res.json(chats);
  })
  .catch((err) => {
    console.log('Error looking up messages', err);
    res.json({error: err});
  });
};
var isValid = function(text) {
  return (text !== null && text !== undefined && text.trim() !== '');
};

var addPost = function(user, text, sessionId) {
  return new Promise((resolve, reject) => {

    if (!isValid(user)) {
      return reject('empty user ' + user);
    }
    if (!isValid(text)) {
      return reject('empty text ' + text);
    }
    if (!isValid(sessionId)) {
      return reject('invalid session' + sessionId);
    }

    var message = new Chat({user: user, text: text, session: sessionId});
    message.save(function(err, m) {
      if (err) {
        return reject(err);
      }
      return resolve(m);
    });
  });
};

var addPostRoute = function(req, res, next) {
  var user = req.user;
  var text = req.body.text;
  var sessionId = req.sessionID;
  addPost(user, text, sessionId)
  .then((message) => {
    res.json(message);
  })
  .catch((err) => {
    console.log('Error posting new message', err);
    res.json({error: err});
  });
};

module.exports = {
  getPostsRoute: getPostsRoute,
  getPosts: getPosts,
  addPost: addPost,
  addPostRoute: addPostRoute
};

