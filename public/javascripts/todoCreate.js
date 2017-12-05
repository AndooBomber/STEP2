$(function () {
  getList();
});

$('#form').submit(function () {
  postList();
  return false;
});

function getList() {
  var $list = $('#list');
  $list.fadeOut(function () {
    $list.children().remove();
    // /todoにGETアクセスする
    $.get('todoCreate', function (todos) {
      $.each(todos, function (index, todo) {
        var a1 = $('<a>').text(todo.listName);
        a1.attr('href', 'http://localhost:3000/list/' + todo.listName);
        if (Object.keys(todo.details).length === 0) {
          var pn = $('<p>ToDoがありません</p>');
          $list.append(a1, pn);
        } else {
          var details = todo.details;
          var count = 0;
          var count2 = 0;
          var date1 = new Date(details[0].limitDate);
          var date = date1.getTime();
          $.each(details, function (index, detail) {
            if (detail.isCheck) {
              count++;
            }
            var date2 = new Date(detail.limitDate);
            if (date > date2.getTime() && !detail.isCheck) {
              date = date2.getTime();
              count2 = index;
            }
          });
          var p1 = $('<p>').text(details.length + '個中' + count + '個がチェック済み');
          var limit = new Date(details[count2].limitDate);
          var p2 = $('<p>').text('~' + limit.getFullYear() + '年' + (limit.getMonth() + 1) + '月' + limit.getDate() + '日');
          $list.append(a1, p1, p2);
        }
      });
    });
    $list.fadeIn();
  });
}

function postList() {
  var name = $("#text").val();
  $("#text").val('');
  console.log(name);
  $.post('/todoCreate', {
    name: name
  }, function (res) {
    console.log(res);
    getList();
  });
}