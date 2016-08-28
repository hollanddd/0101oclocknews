var Twitter = require('twitter');
var creds   = require('./creds.js');

var Twit = function() {
  this.client = new Twitter(creds);
}

Twit.prototype.updateStatus = function(text) {
  var params = {status: text};
  this.client.post('statuses/update', params, function(error,tweet,response) {
    
    if (error){
      console.log(error);
      throw error
    } 
    console.log('status updated: ' + tweet.text);
  })
}
module.exports = Twit;