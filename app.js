var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// mongooseを用いてMongoDBに接続する
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tl_test1');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// ToDoスキーマを定義する
var Schema = mongoose.Schema;
var todoSchema = new Schema({
  isCheck: {
    type: Boolean,
    default: false
  },
  text: String,
  createdDate: {
    type: Date,
    default: Date.now
  },
  limitDate: Date
});
var todoList = new Schema({
  listName: String,
  createdDate: {
    type: Date,
    default: Date.now
  },
  details: [todoSchema]
});
mongoose.model('Todo', todoList);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// ------------------------------Top画面に対するAPI------------------------------
// /todoCreateにGETアクセスしたとき、ToDoリスト一覧を取得するAPI
app.get('/todoCreate', function (req, res) {
  var Todo = mongoose.model('Todo');
  // すべてのToDoを取得して送る
  Todo.find({}, function (err, todos) {
    res.send(todos);
  });
});

// /todoCreateにPOSTアクセスしたとき、ToDoリストを追加するAPI
app.post('/todoCreate', function (req, res) {
  var name = req.body.name;
  // ToDoリストの名前のパラーメタがあればMongoDBに保存
  if (name) {
    var Todo = mongoose.model('Todo');
    var todo = new Todo();
    todo.listName = name;
    todo.save();
    res.send(true);
  } else {
    res.send(false);
  }
});

// ------------------------------ToDo詳細画面に対するAPI------------------------------
//　/todogetにPOSTアクセスしたとき、ToDoリスト名に応じてToDo一覧を取得するAPI
app.post('/todoget', function (req, res) {
  var Todo = mongoose.model('Todo');
  var listName = req.body.param;
  // リスト名に対するすべてのToDoを取得して送る
  Todo.findOne({
    listName: req.body.param
  }, function (err, todos) {
    res.send(todos);
  });
});

// /compにPOSTアクセスしたとき、ToDoの完了or未完了に応じて状態を反転させるAPI
app.post('/comp', function (req, res) {
  var Todo = mongoose.model('Todo');
  var listName = req.body.param;
  var compName = req.body.tf;
  var id = req.body.id;
  var tf;
  // 完了/未完了ボタンの名前に応じてtrue/falseを判定する
  if (compName == '完了') {
    tf = false;
  } else {
    tf = true;
  }
  // リスト名とToDoに割り振られたIDのパラメータがあれば、その条件に当てはまるToDoの状態を反転させる
  if (listName && id) {
    Todo.findOneAndUpdate({
      listName: listName,
      'details._id': id
    }, {
      $set: {
        'details.$.isCheck': tf
      }
    }, function (err, todos) {
      res.send(true);
    });
  } else {
    res.send(false);
  }
});

// /todoにPOSTアクセスしたとき、ToDoを追加するAPI
app.post('/todo', function (req, res) {
  var name = req.body.name;
  var limit = req.body.limit;
  var listName = req.body.param;
  // ToDoのリスト名と名前と期限のパラーメタがあればMongoDBに保存
  if (name && limit && listName) {
    var Todo = mongoose.model('Todo');
    Todo.findOne({
      listName: listName
    }, function (err, todos) {
      var schema = {};
      schema.isCheck = false;
      schema.text = name;
      schema.limitDate = limit;
      schema.createdDate = Date.now();
      todos.details.push(schema);
      todos.save(function (err) {});
    });
    res.send(true);
  } else {
    res.send(false);
  }
});

// ------------------------------検索画面に対するAPI------------------------------
// /todoSearchにPOSTアクセスしたとき、検索ワードに応じて検索結果を取得するAPI
app.post('/todoSearch', function (req, res) {
  var searchName = req.body.searchName;
  var Todo = mongoose.model('Todo');
  // 入力されたワードに対して、ToDoリスト名またはToDoの名前に当てはまるToDoを取得して送る
  Todo.find({
    $or: [{
        listName: new RegExp('.*' + searchName + '.*', 'i')
      },
      {
        'details.text': new RegExp('.*' + searchName + '.*', 'i')
      }
    ]
  }, function (err, todos) {
    res.send(todos);
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;