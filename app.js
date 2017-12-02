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
  listName: {
    type: String,
    default: "Todo"
  },
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
mongoose.model('Todo', todoSchema);

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

  });
});

//ToDo詳細画面
app.get('/todo', function (req, res) {
  var Todo = mongoose.model('Todo');
  // すべてのToDoを取得して送る
  if (Todo) {
    Todo.find({}, function (err, todos) {
      res.send(todos);
    });
  } else {
    res.send(false);
  }
});

app.post('/comp', function (req, res) {
  var Todo = mongoose.model('Todo');
  Todo.findById(mongoose.Types.ObjectId(req.body.id), function (err, docs) {
    var tf = !docs.isCheck;
    Todo.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.id), {
        $set: {
          isCheck: tf
        }
      }, {
        upsert: false
      },
      function (err) {});
  });
  res.send(true);
});

app.post('/todo', function (req, res) {
  var name = req.body.name;
  var limit = req.body.limit;
  // ToDoの名前と期限のパラーメタがあればMongoDBに保存
  if (name && limit) {
    var Todo = mongoose.model('Todo');
    var todo = new Todo();
    todo.text = name;
    todo.limitDate = limit;
    todo.save();
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