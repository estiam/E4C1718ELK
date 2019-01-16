var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// https://github.com/estiam/E4C1718ELK

/* GET home page. */
router.get('/', function (req, res, next) {
  mongoose.model('Movie').find({}, (err, items) => {
    if (err)
      return res.send(err);

    res.render('index', { title: 'Express', movies: items });
  });
});

router.get('/create', function (req, res, next) {
  res.render('create');
});

router.post('/create', function (req, res, next) {
  const film = req.body;

  film.seen = film.seen ? true : false;

  film.actors = film.actors.split(', ');

  mongoose.model('Movie').create(film, function (err, item) {
    if (!err)
      return res.redirect('/');
    res.send(err);
  });
});
// router.get .post .put .delete .head etc...

router.get('/edit/:id', function (req, res, next) {
  mongoose.model('Movie').findById(req.params.id, function (err, item) {
    if (err)
      return res.send(err);
      const film = item.toObject();
      let count = 0;

      if(item.actors)
        item.actors.forEach(actor => {
          film.actors += actor;
          if(count < item.actors - 1)
            film.actors += ', ';

          count += 1;
        })

    res.render('edit', { film: item });
  });
});

router.post('/edit/:id', function (req, res, next) {
  const film = req.body;
  
  film.actors = film.actors.split(', ');
  
  mongoose.model('Movie').findByIdAndUpdate(req.params.id, film, function (err, item) {
    if (!err)
      return res.redirect('/');

    res.send(err);
  });
});

router.get('/delete/:id', function (req, res, next) {
  mongoose.model('Movie').findByIdAndRemove(req.params.id, function (err, item) {
    if (!err)
      return res.redirect('/');

    res.send(err);
  });
});
module.exports = router;
