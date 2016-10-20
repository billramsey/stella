var uuid = require('uuid');

var uuidHash = {};

var login = function(req, res, next) {
  var userName = req.body.username;
  if (userName === undefined || userName === '') {
    return req.json({error: 'Empty UserName'});
  }
  var secret = uuid.v1();
  //A v1 this close returns a very similar session, which is public.
  //Go with random.  Collision should be unlikely
  var sessionId = uuid.v4();
  uuidHash[secret] = {userName: userName, sessionID: sessionId};
  res.json({id: sessionId, secret: secret});
};
var logout = function(req, res, next) {
  var userHash = req.headers['secret'];
  delete uuidHash.userHash;
  res.json({}); 
};
var getUser = function(secret) {
  if (uuidHash.hasOwnProperty(secret)) {
    return uuidHash[secret];
  }
  return undefined;
};
module.exports = {
  login: login,
  logout: logout,
  getUser, getUser
};
