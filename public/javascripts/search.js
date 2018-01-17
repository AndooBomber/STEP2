// ページが表示されたときToDoリストを表示する
$(function () {
  var list1 = [];
  var list2 = [];
  var createdTimes1 = [];
  var createdTimes2 = [];
});

// フォームを送信ボタンを押すと、ToDoを追加して再表示する
$('#form').submit(function () {
  var searchName = $('#text').val();
  // 入力された値が正しい場合、再表示する
  if (searchName.length > 0) {
    $('#visible').text();
    $('#visible').css({
      'display': 'none',
      'color': '#000000'
    });
    search();
  } else {
    // 入力された値が正しくない場合、赤文字でエラーを表示する
    alert('名称は1文字以上にしてください', $('#visible'));
  }
  return false;
});

// ToDo一覧を取得して表示する
function search() {
  // フォームに入力された値を取得
  var searchName = $('#text').val();
  var $list1 = $('#ul1');
  var $list2 = $('#ul2');
  var todoNum = $('#todoNum');
  var todoListNum = $('#todoListNum');
  // すでに表示されている一覧を非表示にして削除する
  $list1.fadeOut(function () {
    $list1.children().remove();
    $list2.fadeOut(function () {
      $list2.children().remove();
      // /todoSearchにPOSTアクセスする
      $.post('/todoSearch', {
        searchName: searchName
      }, function (todos) {
        list1 = [];
        list2 = [];
        createdTimes1 = [];
        createdTimes2 = [];
        var count1 = 0;
        var count2 = 0;
        // 取得したToDoリスト、ToDoを追加していく
        $.each(todos, function (index, todo) {
          //ToDoリストに検索した値が存在する場合、取得したToDoリストを追加する
          if (todo.listName.indexOf(searchName) > -1) {
            count1++;
            var li1 = $('<li>');
            var a1 = $('<a>').text(todo.listName);
            a1.attr('href', 'http://localhost:3000/list/' + todo.listName);
            var created = new Date(todo.createdDate);
            var p1 = $('<p>').text('作成日: ' + created.getFullYear() + '年' + (created.getMonth() + 1) + '月' + created.getDate() + '日');
            // ToDoリストの作成日をcreatedTimes1に記録する
            createdTimes1.push({
              time: created.getTime(),
              index: createdTimes1.length
            });
            li1.append(a1, p1);
            list1.push(li1);
          }
          var details = todo.details;
          //ToDoに検索した値がある場合、取得したToDoを追加していく
          $.each(details, function (i, detail) {
            if (detail.text.indexOf(searchName) > -1) {
              count2++;
              var li2 = $('<li>');
              var a2 = $('<a>').text(detail.text);
              a2.attr('href', 'http://localhost:3000/list/' + todo.listName);
              var p2 = $('<p>').text('リスト: ' + todo.listName);
              var limit = new Date(detail.limitDate);
              var created = new Date(detail.createdDate);
              var p3 = $('<p>').text('期限: ' + limit.getFullYear() + '年' + (limit.getMonth() + 1) + '月' + limit.getDate() + '日');
              var p4 = $('<p>').text('作成日: ' + created.getFullYear() + '年' + (created.getMonth() + 1) + '月' + created.getDate() + '日');
              // ToDoの作成日をcreatedTimes2に記録する
              createdTimes2.push({
                time: created.getTime(),
                index: createdTimes2.length
              });
              li2.append(a2, p2, p3, p4);
              list2.push(li2);
            }
          });
        });
        //createdTimes1に記録されている作成日の中から、新しい順に一覧($list2)に追加していく
        createdTimes1.sort(function (a, b) {
          if (a.time > b.time) return 1;
          if (a.time < b.time) return -1;
          return 0;
        });
        $.each(createdTimes1, function (i, times) {
          $list2.prepend(list1[times.index]);
        });
        //検索した結果、見つかったToDoリストの数を表示
        if (count1 == 0) {
          alert('対象のToDoリストは見つかりません', todoListNum);
        } else {
          alert('ToDoリストが' + count1 + '件見つかりました', todoListNum);
        }
        //createdTimes2に記録されている作成日の中から、新しい順に一覧($list1)に追加していく
        createdTimes2.sort(function (a, b) {
          if (a.time > b.time) return 1;
          if (a.time < b.time) return -1;
          return 0;
        });
        $.each(createdTimes2, function (i, times) {
          $list1.prepend(list2[times.index]);
        });
        //検索した結果、見つかったToDoの数を表示
        if (count2 == 0) {
          alert('対象のToDoは見つかりません', todoNum);
        } else {
          alert('ToDoが' + count2 + '件見つかりました', todoNum);
        }
      });
      // 一覧を表示する
      $list2.fadeIn('slow');
    });
    // 一覧を表示する
    $list1.fadeIn('slow');
  });
}

//赤文字でエラー表示をするための関数
function alert(text, jqname) {
  jqname.text(text);
  jqname.css({
    'display': 'inline',
    'color': '#ff0000'
  });
}