var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var Promise = require('bluebird');

var messages = require('../server/messages');
var Chat = require('../server/database.js');

describe('Chat Timing', function() {
  before(function(done) {
    Promise.mapSeries(Array.apply(null, Array(11)), function(item, index) {
      return new Chat({user: 'user', text: 'text' + index, session: '4'}).save();
    }).then(() => done()).catch(done);
  });
  describe('#getPosts', function(done) {
    it('should return 10', function(done) {
      expect(messages.getPosts()).to.eventually.have.lengthOf(10)
      .then((m) => done()).catch(done);
    });
    it('should return only the new ones when sent a date', function(done) {
      var lastDate;
      messages.getPosts()
      .then((r) => {
        lastDate = r[r.length - 1].createdOn;
        console.log('last date', lastDate);
        expect(lastDate).to.not.be.null;
      })
      .then(() => messages.addPost('bill', 'new post', 'session'))
      .then(() => messages.getPosts(lastDate))
      .then((updated) => {
        expect(updated).to.have.lengthOf(1);
      })
      .then(() => done()).catch(done);
    });
  });
  after(function(done) {
    Chat.remove().then(() => done()).catch(done);
    done();
  });
});