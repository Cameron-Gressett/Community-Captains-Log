
var port = process.env.PORT || 8080;
var logController = require('./controllers/LogController');
var captainsLogController = require('./controllers/CaptainsLogController');
var submissionLogController = require('./controllers/SubmissionLogController');
var FAQ = require('./controllers/FAQController');
var motd = require('./models/MOTDModel')
var worker = require('./BackgroundVoteSubTimeWorker');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');
var app = express();
var http = require('http');
var config = require('./config');

var connected_users = {};

mongoose.connect('mongodb://' + config.monguser + ':' + config.mongpass + '@ds117899.mlab.com:17899/captainslog');

var users = require('./routes/users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.set('views', __dirname + '/assets');
app.use(express.static(__dirname + '/assets'));

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

app.use('/users', users);

logController(app);
captainsLogController(app);
submissionLogController(app);

FAQ(app);

process.on('uncaughtException', function (err) {
  console.log(err);
});

//We didn't find it nessessary to make an MOTD controller considering how few functions it would have


app.get('/MOTD', function (req, res) {
  motd.find({}, function (err, message) {
    res.send(message[0]);
  });
});

app.post('/MOTD/update', function (req, res) {
  var newmessage = motd(
    {
      Content: req.body.Content,
    });

  motd.find({}, function (err, mes) {
    motd.findByIdAndRemove(mes[0]._id, function (err) {
    });
  });

  newmessage.save(function (err) {
    if (err) throw err;
    res.send(true);
  });
});

app.get('/', function (req, res) {
  res.render('CCL');
});
//runs the worker function which posts the most voted submission, and unmutes/unmods users.
setInterval(function () {
  worker();
}, 10000);


app.listen(config.port);
