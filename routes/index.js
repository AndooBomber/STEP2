var express = require('express');
var router = express.Router();

/* TOP画面ページの取得 */
router.get('/', function (req, res, next) {
  res.render('index2', {
    title: 'Top'
  });
});

/* 検索画面ページの取得  */
router.get('/search', function (req, res, next) {
  res.render('search', {
    title: 'Search'
  });
});

/* ToDo詳細画面ページの取得 */
router.get('/list/:id', function (req, res, next) {
  var param = req.params.id;
  //リスト名をパラメータとして渡す
  res.render('index', {
    title: 'ToDo',
    param: param
  });
});

module.exports = router;