
var express = require('express');
var app = express();
const bluebird = require('bluebird');
const _ = require('lodash');

var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/example');
mongoose.connect('mongodb://nitoo7:manchester007@ds051585.mongolab.com:51585/sampletestdb');

var Schema = mongoose.Schema;
var movieSchema = new Schema({
 title: String,
  year: Number,
  director: String,
  rating: String
});
var Movie = mongoose.model('movie', movieSchema);


app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/details', function (req, res) {
  Movie.findOne({}).exec().then(function(data){return res.send(data)})
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});
