var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index2', {
    title: 'Top'
  });
});

router.get('/search', function (req, res, next) {
  res.render('search', {
    title: 'Search'
  });
});

router.get('/list/:id', function (req, res, next) {
  var param = req.params.id;
  res.render('index', {
    title: 'ToDo',
    param: param
  });
});

module.exports = router;