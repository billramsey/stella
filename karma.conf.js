module.exports = function(config) {
  config.set({
    basePath: '',
    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/ngstorage/ngStorage.js',
      'client/**/*.js',
      'tests/client.spec.js'
    ],
    frameworks: ['jasmine'],
    //...
  });
};