// ページが表示されたときToDoリストを表示する
$(function () {
  getList();
  var todoNames = [];
});

// フォームを送信ボタンを押すと、ToDoを追加して再表示する。
$('#form').submit(function () {
  postList();
  return false;
});

// ToDo一覧を取得して表示する
function getList() {
  // フォームに入力された値を取得
  var param = $('#todoName').text();
  // すでに表示されている一覧を非表示にして削除する
  var $list = $('#list');
  $list.fadeOut(function () {
    $list.children().remove();
    // /todogetにPOSTアクセスする
    $.post('/todoget', {
      param: param
    }, function (todos) {
      todoNames = [];
      var details = todos.details;
      //ToDoリストの中身が空でない場合、ToDoを追加する
      if (Object.keys(details).length !== 0) {
        // 取得したToDoを追加していく
        $.each(details, function (index, todo) {
          todoNames.push(todo.text);
          var limit = new Date(todo.limitDate);
          var created = new Date(todo.createdDate);
          var p1 = $('<p>').text(todo.text);
          p1.addClass('todoText');
          var p2 = $('<p>').html('期限:&nbsp&nbsp&nbsp&nbsp' + limit.getFullYear() + '年' + (limit.getMonth() + 1) + '月' + limit.getDate() + '日');
          var p3 = $('<p>').text('作成日: ' + created.getFullYear() + '年' + (created.getMonth() + 1) + '月' + created.getDate() + '日');
          var sp1 = $('<span>').append(p1, p2, p3);
          var Button1 = $('<Button>');
          Button1.val(todo._id);
          //完了ボタンが押された時の処理
          Button1.on('click', function (event) {
            // /compにPOSTアクセスする
            $.post('/comp', {
              id: $(event.target).val(),
              tf: $(event.target).text(),
              param: param
            }, function (res) {
              console.log(res);
              getList();
            });
          });
          // ToDoの状態が完了/未完了かどうかを確かめ、ボタンの表示を変更する
          if (todo.isCheck) {
            Button1.text('完了');
            Button1.toggleClass('compButton');
          } else {
            Button1.text('未完了');
          }
          var sp2 = $('<span>').append(Button1);
          sp2.addClass('btn');
          var li = $('<li>').append(sp1, sp2);
          $list.prepend(li);
        });
      } else {
        //ToDoリストの中身が空の場合、登録されたToDoはございませんと表示する
        $list.append('<p style="color: #ff0000" class="todoSearchResult ">登録されたToDoはございません</p>');
      }
      // 一覧を表示する	
      $list.fadeIn('slow');
    });
  });
}

// フォームに入力されたToDoを追加する
function postList() {
  // フォームに入力された値を取得
  var name = $('#text').val();
  var limitDate = new Date($('#limit').val());
  var param = $('#todoName').text();
  // 入力された値が正しくない場合、赤文字でエラーを表示する
  if (name.length == 0) {
    alert('ToDoの名称は1文字以上にしてください', $('#visible'));
  } else if (name.length > 31) {
    alert('ToDoの名称は30文字以下にしてください', $('#visible'));
  } else if (todoNames.indexOf(name) >= 0) {
    alert('ToDoがすでに存在します', $('#visible'));
  } else if (!limitDate.getTime()) {
    alert('日付が無効です', $('#visible'));
  } else {
    //入力項目を空にする
    $('#text').val('');
    $('#limit').val('');
    // /todoにPOSTアクセスする
    $.post('/todo', {
      param: param,
      name: name,
      limit: limitDate
    }, function (res) {
      console.log(res);
      //再度表示する
      getList();
      $('#visible').text('新しいToDoが追加されました');
      $('#visible').css({
        'display': 'inline',
        'color': '#ffffff'
      });
    });
  }
}

//赤文字でエラー表示をするための関数
function alert(text, jqname) {
  jqname.text(text);
  jqname.css({
    'display': 'inline',
    'color': '#ff0000'
  });
}