var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

//I am using passport and session to generate a unique id for generating
//a user's avatar.  That way you can have two 'bill's in a chat room and tell
//them apart.  You can't set your avatar so you can't impersonate someone 
module.exports = (app, express) => {
  app.use(session({
    secret: 'stella',
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(id, done) {
    done(null, id.username);
  });
  passport.use(new LocalStrategy(function(username, password, done) {
    return done(null, {username: username});
  }));
  app.post('/api/login', passport.authenticate('local'),
    function(req, res) {
      res.json({id: req.sessionID});
    }
  );
  app.post('/api/logout', function(req, res, next) {
    //logout was unreliable in destroying session.
    req.session.destroy();
    res.json({});
  });
};