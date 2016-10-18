//app.js
angular.module('app', [])
.controller('AppController', function($scope, Data) {
  
  
  var getChats = function() {
    Data.get()
    .then(function(chats) {
      $scope.chats = chats;
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
      console.log('got chats from server', chats.data);
      return chats.data;
    });
  };
  return {
    get: get,
    post: post
  };
});