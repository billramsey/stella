//app.js
angular.module('app', ['ngStorage', 'app.users', 'app.data'])
.config(function($httpProvider) {
  //This allows us to notice when a user was logged out by the server.
  $httpProvider.interceptors.push(function($q, $injector) {

    return {
      response: function(response) {
        // do something on success
        return response;
      },
      responseError: function(response) {
        if (response.status === 401) {
          //Get around circular dependencies.
          var User = $injector.get('User');
          User.clearSession();
        }
        return $q.reject(response);
      }
    };
  });
})
.controller('AppController', function($scope, $timeout, Data, User) {
  $scope.chats = [];
  var timer;

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
  $scope.loggedIn = User.loggedIn;
  $scope.logIn = function(requesteduser) {
    User.logIn(requesteduser)
    .then(initializeChat);
    //todo handle error
  };
  $scope.logOut = function() {
    User.logOut()
    .then(function() {
      console.log('cancelling timer', timer);
      console.log($timeout.cancel(timer));
    });
    //todo handle error
  };
  $scope.currentUser = User.getUser;

  var getChats = function() {
    Data.get()
    .then(function(chats) {
      chats.forEach(function(chat) {
        $scope.chats.push(chat);
      });
      //Manage scroll to the bottom of the chat window on load.
      $timeout(function() {
        var messages = document.getElementById('messages');
        messages.scrollTop = messages.scrollHeight;
      }, 0, false);
    });
  };

  var poll = function() {
    if (User.loggedIn()) {
      getChats();
      timer = $timeout(poll, 5000);
    }
  };
  var initializeChat = function() {
    poll();
  };
  initializeChat();
});
