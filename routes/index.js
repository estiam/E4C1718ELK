var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  mongoose.model('Movie').find({}, (err, items) => {
    if(err)
      return res.send(err);

    res.render('index', { title: 'Express', movies: items });
  });
});

router.get('/create', function(req, res, next) {
  res.render('create');
});

router.post('/create', function(req, res, next) {
  const film = req.body;

  mongoose.model('Movie').create(film, function(err, item) {
    if(!err)
      return res.redirect('/');
    res.send(err);
  });
});
// router.get .post .put .delete .head etc...

router.get('/edit', function(req, res, next) {
  res.render('edit');
});

router.get('/edit', function(req, res, next) {
  res.render('edit');
});
module.exports = router;