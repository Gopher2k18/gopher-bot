var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var messageSchema = new Schema(
  {
    user: String,
    message: String,
    channel:String,
    tags: [String],
    time_send:String
  }, {
      timestamps: true
  }
);

module.exports = mongoose.model('Message', messageSchema);