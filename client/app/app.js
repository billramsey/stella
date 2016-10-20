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
  $scope.error = '';
  var timer;

  $scope.postChat = function(message) {
    Data.post($scope.message)
    .then(function(result) {
      if (result.error !== undefined) {
        $scope.error = 'Unable to post because: ' + result.error;
      } else {
        $scope.error = '';
        $scope.message = '';
      }
      getChats();
    });
  };
  $scope.loggedIn = User.loggedIn;
  $scope.logIn = function(requesteduser) {
    User.logIn(requesteduser)
    .then(poll)
    .then(function() {
      $scope.error = '';
    })
    .catch(function(err) {
      $scope.error = 'Unknown error' + err;
    });
    //todo handle error
  };
  $scope.logOut = function() {
    User.logOut()
    .then(function() {
      $timeout.cancel(timer);
      $scope.error = '';
    })
    .catch(function(err) {
      $scope.error = 'Unknown error' + err;
    });
    //todo handle error
  };
  $scope.currentUser = User.getUser;

  var storeChats = function(chats) {
    if (chats && chats.error) {
      $scope.error = 'Unable to retrieve results: ' + chats.error;
    } else {
      chats.forEach(function(chat) {
        $scope.chats.push(chat);
      });
      //Manage scroll to the bottom of the chat window on load.
      $timeout(function() {
        var messages = document.getElementById('messages');
        messages.scrollTop = messages.scrollHeight;
      }, 0, false);
    }
  };

  var getChats = function() {
    return Data.get()
    .then(storeChats)
    .catch(function(error) {
      $scope.error = 'Unknown error retrieving messages';
    });
  };
  var getPublicChats = function() {
    return Data.public()
    .then(storeChats)
    .catch(function(error) {
      $scope.error = 'Unknown error retrieving messages';
    });
  };
  var poll = function() {
    if (User.loggedIn()) {
      getChats();
      timer = $timeout(poll, 2000);
    }
  };
  var initializeChat = function() {
    getPublicChats()
    .then(poll);
  };

  initializeChat();
});
