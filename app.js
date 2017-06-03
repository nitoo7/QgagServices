
var express = require('express');
var app = express();
const bluebird = require('bluebird');
const _ = require('lodash');
var bodyParser = require('body-parser')
var base64Img = require('base64-img');
app.use(bodyParser());

var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/example');
// mongoose.connect('mongodb://nitoo7:manchester007@ds051585.mongolab.com:51585/sampletestdb');
mongoose.connect('mongodb://admin:password@ds049436.mlab.com:49436/qgag_services');

var Schema = mongoose.Schema;
var gagSchema = new Schema({
  gagName: String,
  gagDesc: String,
  time:{ type: Date, default: Date.now },
  gagImg: String,
  likes: Number,
  dislikes: Number
});

var commentSchema = new Schema({
  commentDetails: String,
  gagID: String,
  userID: String,
  time: { type: Date, default: Date.now }
});

var userSchema = new Schema({
  userName: String,
  userDp: String,
  userEmail: String
});
var Gag = mongoose.model('gag', gagSchema);
var Comment = mongoose.model('comment', commentSchema);
var User = mongoose.model('user', userSchema);


app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/getGags', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log('###===>', req.query.id)
  if(req.query.id) {
    Gag.find({_id: req.query.id}).exec().then(function(data){console.log('****==>', data);return res.send(data[0])})
  } else {
    Gag.find({}).exec().then(function(data){
      data.map((gag) => {
        gag.gagImg = base64Img.base64Sync(gag.gagImg);
      })
      return res.send(data)
    })
  }
});

app.get('/getComments', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if(req.query.id) {
    Comment.find({_id: req.query.id}).exec().then(function(data){return res.send(data[0])})
  } else {
    Comment.find({}).exec().then(function(data){return res.send(data)})
  }
});

app.get('/getUserInfo', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if(req.query.id) {
    User.find({_id: req.query.id}).exec().then(function(data){return res.send(data[0])})
  } else {
    User.find({}).exec().then(function(data){return res.send(data)})
  }
});

// POST method route
app.post('/addGags', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST','OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 // console.log('REquest==>', req.body)
  var t = "";
  var filepath = base64Img.imgSync(req.body.gagImg, 'dest', Date.now());

  var gagData = {
    "gagName": req.body.gagTitle,
    "gagDesc": req.body.gagDesc,
    "gagImg": filepath,
    "likes": 5,
    "dislikes": 6
  }
   Gag.create(gagData);
    res.send(req.body)
  })

app.options('/addGags', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.send(req.body)
})

app.post('/addComments', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  Comment.create(req.body);
  res.send(req.body)
})

app.post('/addUsers', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  User.create(req.body);
  res.send(req.body)
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});
