var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/chat', function(req, res, next) {
  res.render('chat2');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req,res){
  var username = req.body.username;
  console.log("username = " + username);
  req.username = username
  res.redirect('/chat');
});

module.exports = router;
