//app.js
angular.module('app', ['ngStorage'])
.config(function($httpProvider) {
  $httpProvider.interceptors.push(function($q, $location, $sessionStorage) {
    return {
      response: function(response) {
        // do something on success
        return response;
      },
      responseError: function(response) {
        if (response.status === 401) {
          delete $sessionStorage.userName;
          delete $sessionStorage.sessionId;
        }
        return $q.reject(response);
      }
    };
  });
})
.controller('AppController', function($scope, $timeout, Data, User) {
  var getChats = function() {
    Data.get()
    .then(function(chats) {
      $scope.chats = chats;
      //Manage scroll to the bottom of the chat window on load.
      $timeout(function() {
        var messages = document.getElementById('messages');
        messages.scrollTop = messages.scrollHeight;
      }, 0, false);
    });
  };
  getChats();
  $scope.postChat = function(message) {
    Data.post($scope.message)
    .then(function(result) {
      console.log('result', result);
      if (result.error !== undefined) {
        console.log('error', result.error);
      } else {
        $scope.message = '';
      }
      getChats();
    });
  };
  $scope.getUser = User.getUser;
  $scope.setUser = function() {
    User.setUser($scope.requesteduser)
    .then(getChats);
  };
  $scope.logOut = function() {
    User.logOut();
  };
})
.service('Data', function($http) {
  var lastGoodDataDate = null;
  var get = function() {
    return $http({
      method: 'GET',
      url: '/api/chats/' + lastGoodDataDate
    })
    .then(function(chats) {
      console.log('got chats from server', chats.data);
      return chats.data;
    });
  };
  var post = function(message) {
    return $http({
      method: 'POST',
      url: '/api/post',
      data: {user: 'bill', text: message}
    })
    .then(function(chats) {
      console.log('posted', chats.data);
      return chats.data;
    });
  };
  return {
    get: get,
    post: post
  };
})
.service('User', function($http, $sessionStorage) {
  var serverLogin = function(userName) {
    console.log('logging in ', userName);
    return $http({
      method: 'POST',
      url: '/api/login',
      data: {username: userName, password: 'password'}
    })
    .then(function(session) {
      console.log('sessiondata', session.data);
      return session.data;
    }).catch(function(err) {
      console.log('error logging in', err);
    });
  };
  var serverLogout = function() {
    return $http({
      method: 'POST',
      url: '/api/logout',
    });
  };
  var deleteSession = function() {
    delete $sessionStorage.userName;
    delete $sessionStorage.sessionId;
  };
  var logOut = function() {
    serverLogout()
    .then(function() {
      console.log('loggin out');
      deleteSession();
    });
  };

  var setUser = function(userName) {
    return serverLogin(userName)
    .then(function(session) {
      if (session && session.id) {
        //store it in the session
        $sessionStorage.userName = userName;
        $sessionStorage.sessionId = session.id;
      } else {
        console.log('No session returned');
      }
    });
  };
  var getUser = function() {
    return {
      username: $sessionStorage.userName,
      session: $sessionStorage.sessionId
    };
  };
  return {
    setUser: setUser,
    getUser: getUser,
    logOut: logOut,
    deleteSession: deleteSession
  };
});

//http://api.adorable.io/avatar/200/bob

