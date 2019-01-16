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

    if (item.actors)
      item.actors.forEach(actor => {
        film.actors += actor;
        if (count < item.actors - 1)
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

router.get('/search', (req, res, next) => {

  // localhost:3000/search?q=<MA RECHERCHE>
  // req.query.q

  mongoose.model('Movie').search({
    dis_max: {
      queries: [
        {
          function_score: {
            query: {
              match: {
                'title.ngram': req.query.q
              }
            },
            script_score: {
              script: '_score * 0.7'
            }
          }
        },
        {
          term: {
            'title.keyword': {
              'value': req.query.q,
              boost: 5
            }
          }
        }
      ]
    }
  }, (err, items) => {
    if (err)
      return res.send(err);
    res.render('index', { movies: items.hits.hits.map(item => {
      const temp = item._source;
      temp.score = item._score;
      return temp;
    }) });
  });
});


// localhost:3000/notseen => q= 

// localhost:3000/seen?q=batman
router.get('/seen', (req, res, next) => {
  let match = req.query.q ? { match: { "title": req.query.q } } : { match_all: {} };

  mongoose.model('Movie').search({
    bool: {
      must: { // must, filter, must_not, should
        match
      },
      filter: {
        term: { seen: true }
      }
    }
  }, (err, items) => {
    if (err)
      return res.send(err);
    res.render('index', { movies: items.hits.hits.map(item => item._source) });
  });
});

router.get('/notseen', (req, res, next) => {
  let match = req.query.q ? { match: { "title": req.query.q } } : { match_all: {} };

  mongoose.model('Movie').search({
    bool: {
      must: { // must, filter, must_not, should
        match
      },
      filter: {
        term: { seen: false }
      }
    }
  }, (err, items) => {
    if (err)
      return res.send(err);
    res.render('index', { movies: items.hits.hits.map(item => item._source) });
  });
});

module.exports = router;
