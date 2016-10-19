//user.js
angular.module('app.users', [])
  .service('User', function($http, $sessionStorage) {
    var user;

    var logIn = function(userName) {
      return $http({
        method: 'POST',
        url: '/api/login',
        data: {username: userName, password: 'password'}
      })
      .then(function(sessionInfo) {
        if (sessionInfo && sessionInfo.data) {
          user = {username: userName, session: sessionInfo.data.id};
          $sessionStorage.user = user;
        }
      });
    };
    var clearSession = function() {
      user = undefined;
      delete $sessionStorage.user;
    };
    var logOut = function() {
      return $http({
        method: 'POST',
        url: '/api/logout',
      })
      .then(function() {
        clearSession();
      });
    };
    var getUser = function() {
      return user || $sessionStorage.user;
    };
    //check if logged in;
    var loggedIn = function() {
      return !!getUser();
    };
    return {
      getUser: getUser,
      loggedIn: loggedIn,
      logIn: logIn,
      logOut: logOut,
      clearSession: clearSession
    };
  });