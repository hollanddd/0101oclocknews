'user strict'
var Feed = require('rss-to-json');
var async = require('async');
var Markov = require('./markov.js');
var Twit = require('./twit.js');
var newsfeeds = require('./newsfeeds.js')

function randomNumber(min, max) {
  return Math.floor(
    Math.random() * (max - min) + min);
}

function makeSportsNews() {
  async.mapValues(newsfeeds.sports,
  function(source,key,callback) {
    Feed.load(source, callback);
  },
  function(err,results) {
    if (err) console.log(err);
      var titles = [];
      for (var source in results) {
        if (results.hasOwnProperty(source)) {
          for (var article of results[source].items) {
            var title = article.title.replace('<![CDATA[', '').replace(']]>', '').replace('&apos;', '\'');
            if (title.length > 1) titles.push(title);
          }
        }
      }
      var headlines = new Markov(titles).make(randomNumber(6, 12));
      if (headlines.length < 130) {
        var Twitter = new Twit();
        Twitter.updateStatus(headlines)
      }
  });
}

function makeHeadlineNews() {
  async.mapValues(newsfeeds.breaking,
  function(source,key,callback) {
    Feed.load(source, callback);
  },
  function(err,results) {
    if (err) console.log(err);
      var titles = [];
      for (var source in results) {
        if (results.hasOwnProperty(source)) {
          for (var article of results[source].items) {
            var title = article.title.replace('<![CDATA[', '').replace(']]>', '').replace('&apos;', '\'');
            if (title.length > 1) titles.push(title);
          }
        }
      }
      var headlines = new Markov(titles).make(randomNumber(6, 12));
      
      if (headlines.length < 130) {
        var Twitter = new Twit();
        Twitter.updateStatus(headlines)
      }
  });
}

function broadcastNews() {
  makeSportsNews();
  makeHeadlineNews();
}

exports.handler = (event, context) => {
  broadcastNews();
}