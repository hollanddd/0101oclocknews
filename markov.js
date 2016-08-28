var Markov = function(dataset) {
 this.terminals = {};
 this.startwords = [];
 this.wordstats = {};
 this.trainingset = dataset;
 if (dataset) this.train(dataset);
};

Markov.prototype.make = function(min_length) {
  if (this.trainingset.length < 1) 
    throw('You must provide a data set to train the machine');
  
  var choice = function(a) {
    var i = Math.floor(a.length * Math.random());
    return a[i];
  };

  var word = choice(this.startwords);
  var result = [word];
  
  while (this.wordstats.hasOwnProperty(word)) {
    var next_words = this.wordstats[word];
    word = choice(next_words);
    result.push(word);
    
    if (result.length > min_length &&
      this.terminals.hasOwnProperty(word))
      break;
  }
  
  if  (result.length < min_length)
    return this.make(min_length);
  
  return result.join(' ');
}

Markov.prototype.train = function(dataset) {
  if (typeof dataset != typeof [])
    throw('Array required');

  this.trainingset = dataset;
  
  for (var i = 0; i < this.trainingset.length; i++) {
    var words = this.trainingset[i].split(' ');
    this.terminals[words[words.length - 1]] = true;
    this.startwords.push(words[0]);
    
    for (var j = 0; j < words.length - 1; j++) {
      if (this.wordstats.hasOwnProperty(words[j])) {
        this.wordstats[words[j]].push(words[j + 1]);
      } else {
        this.wordstats[words[j]] = [words[j + 1]];
      }
    }
  }
}
module.exports = Markov;