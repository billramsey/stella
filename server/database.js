var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/stella');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

db.once('open', function() {
  console.log('connection established with database');
});

var chatSchema = new mongoose.Schema({
  user: String,
  text: String,
  session: String,
  createdOn: { type: Date, default: Date.now}
});

var Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;