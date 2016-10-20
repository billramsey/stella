describe('Testing of chat client', function() {
  beforeEach(module('app'));

  var $controller, $httpBackend, getPostsHandler;

  beforeEach(inject(function(_$controller_, $injector) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $httpBackend = $injector.get('$httpBackend');
    getPostsHandler = $httpBackend.when('GET', '/api/chats/')
                            .respond([{createdOn: '2016-10-19T23:42:31.554Z',
                                      session: '9_xWgnUFs-0P8RNrCTnva_BhyoAA90k5',
                                      text: 'test',
                                      user: 'test'}]);
  }));

  it('App to store last entries', function() {
    var $scope = {};
    var appController = $controller('AppController', {$scope: $scope});
    //Implement more tests!
    expect(true).toBe(true);
  });
});