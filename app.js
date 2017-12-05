var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tl_test1');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

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

//ToDoTOP画面
app.get('/todoCreate', function (req, res) {
  var Todo = mongoose.model('Todo');
  Todo.find({}, function (err, todos) {
    res.send(todos);
  });
});

app.post('/todoCreate', function (req, res) {
  var name = req.body.name;
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

//ToDo詳細画面
app.post('/todoget', function (req, res) {
  var Todo = mongoose.model('Todo');
  // すべてのToDoを取得して送る
  var listName = String(req.body.param);
  Todo.findOne({
    listName: listName
  }, function (err, todos) {
    res.send(todos);
  });
});

app.post('/comp', function (req, res) { //mada
  var Todo = mongoose.model('Todo');
  var listName = req.body.param;
  var compName = req.body.tf;
  var id = req.body.id;
  console.log(compName);
  console.log(listName);
  console.log(id);
  var tf;
  if (compName == "完了") { //error
    tf = false;
  } else {
    tf = true;
  }
  console.log(tf);
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
});

app.post('/todo', function (req, res) { //mada
  var name = req.body.name;
  var limit = req.body.limit;
  var listName = req.body.param;
  // ToDoの名前と期限のパラーメタがあればMongoDBに保存
  if (name && limit && listName) {
    var Todo = mongoose.model('Todo');
    Todo.findOne({
      listName: listName
    }, function (err, todo) {
      var schema = {};
      schema.isCheck = false;
      schema.text = name;
      schema.limitDate = limit;
      schema.createdDate = Date.now();
      todo.details.push(schema);
      todo.save(function (err) {});
    });
    res.send(true);
  } else {
    res.send(false);
  }
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