angular.module('app.data', [])
.service('Data', function($http) {
  var lastGoodDataDate = null;
  var lookingUp = false;
  var get = function() {
    return new Promise(function(resolve, reject) {
      console.log('run');
      if (!lookingUp) {
        lookingUp = true;
        $http({
          method: 'GET',
          url: '/api/chats/' + lastGoodDataDate
        })
        .then(function(chats) {
          console.log('finish');
          if (chats && chats.data && Array.isArray(chats.data) && chats.data.length > 0) {
            lastGoodDataDate = chats.data[chats.data.length - 1].createdOn;
          }
          lookingUp = false;
          resolve(chats.data);
        }).catch(function(err) {
          lookingUp = false;
          reject(err);
        });
      } else {
        promise.resolve([]);
      }
    });
  };
  var public = function() {
    return $http({
      method: 'GET',
      url: '/api/public'
    })
    .then(function(chats) {
      if (chats && chats.data && Array.isArray(chats.data) && chats.data.length > 0) {
        lastGoodDataDate = chats.data[chats.data.length - 1].createdOn;
      }
      return chats.data;
    });
  };
  var post = function(message) {
    return $http({
      method: 'POST',
      url: '/api/post',
      data: {text: message}
    })
    .then(function(chats) {
      return chats.data;
    });
  };
  return {
    get: get,
    post: post,
    public: public
  };
});