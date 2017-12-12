// ページが表示されたときToDoリストを表示する
$(function () {
  getList();
  var todoNames = [];
  var createdTimes = [];
  var list = [];
});

// フォームを送信ボタンを押すと、ToDoリストを追加して再表示する。
$('#form').submit(function () {
  postList();
  return false;
});

// ToDoリスト一覧を取得して表示する
function getList() {
  // すでに表示されている一覧を非表示にして削除する
  var $list = $('#list');
  $list.fadeOut(function () {
    $list.children().remove();
    // /todoCreateにGETアクセスする
    $.get('todoCreate', function (todos) {
      todoNames = [];
      createdTimes = [];
      list = [];
      // 取得したToDoリストを追加していく
      $.each(todos, function (index, todo) {
        var li1 = $('<li>');
        var sp = $('<span>');
        var a1 = $('<a>').text(todo.listName);
        a1.attr('href', 'http://localhost:3000/list/' + todo.listName);
        todoNames.push(todo.listName);
        //ToDoリストの中身が空ならToDoがありませんと表示する
        if (Object.keys(todo.details).length === 0) {
          var pn = $('<p>ToDoがありません</p>');
          sp.append(a1, pn);
          li1.append(sp);
          $list.append(li1);
        } else {
          var details = todo.details;
          var count = 0;
          var dates = [];
          //ToDoリストの中身を確かめる
          $.each(details, function (index, detail) {
            //チェックされたToDoの個数を確かめ、されていない場合は期限をdatesに記録する
            if (detail.isCheck) {
              count++;
            } else {
              var date = new Date(detail.limitDate);
              dates.push(date);
            }
          });
          //登録されたToDoの数とチェック済みのToDoの数を表示する
          var p1 = $('<p>').text(details.length + '個中' + count + '個がチェック済み');
          //datesにToDoの期限が一つでも記録されている場合は、その中で一番期限が近い日付を表示する
          if (dates.length != 0) {
            dates.sort(function (a, b) {
              if (a.getTime() > b.getTime()) return 1;
              if (a.getTime() < b.getTime()) return -1;
              return 0;
            });
            var date1 = new Date(dates[0]);
            var p2 = $('<p>').text('~' + date1.getFullYear() + '年' + (date1.getMonth() + 1) + '月' + date1.getDate() + '日');
            sp.append(a1, p1, p2);
          } else {
            sp.append(a1, p1);
          }
          li1.append(sp);
          list.push(li1);
          // ToDoリストの中で一番新しいToDoの作成日をcreatedTimesに記録する
          var time = new Date(details[Object.keys(todo.details).length - 1].createdDate);
          createdTimes.push({
            time: time.getTime(),
            index: createdTimes.length
          });
        }
      });
      //createdTimesに記録されている作成日の中から、新しい順に一覧に追加していく
      createdTimes.sort(function (a, b) {
        if (a.time > b.time) return 1;
        if (a.time < b.time) return -1;
        return 0;
      });
      $.each(createdTimes, function (i, times) {
        $list.prepend(list[times.index]);
      });
    });
    //一覧を表示する
    $list.fadeIn('slow');
  });
}

// フォームに入力されたToDoリストを追加する
function postList() {
  // フォームに入力された値を取得
  var name = $('#text').val();
  // 入力された値が正しくない場合、赤文字でエラーを表示する
  if (name.length == 0) {
    alert('ToDoリストの名称は1文字以上にしてください', $('#visible'));
  } else if (name.length > 31) {
    alert('ToDoリストの名称は30文字以下にしてください', $('#visible'));
  } else if (todoNames.indexOf(name) >= 0) {
    alert('ToDoリストがすでに存在します', $('#visible'));
  } else {
    //入力項目を空にする
    $('#text').val('');
    // /todoCreateにPOSTアクセスする
    $.post('/todoCreate', {
      name: name
    }, function (res) {
      console.log(res);
      getList();
      // 入力された値が正しい場合、黒文字でメッセージを表示する
      $('#visible').text('新しいToDoリストが追加されました');
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