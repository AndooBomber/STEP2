// ページが表示されたときToDoリストを表示する
$(function () {
	getList();
});

// フォームを送信ボタンを押すと、ToDoを追加して再表示する。
$('#form').submit(function () {
	postList();
	return false;
});
// ToDo一覧を取得して表示する
function getList() {
	var param = $('#todoName').text();
	// すでに表示されている一覧を非表示にして削除する
	var $list = $('#list');
	$list.fadeOut(function () {
		$list.children().remove();
		// /todoにGETアクセスする
		$.post('/todoget', {
			param: param
		}, function (todos) {
			var details = todos.details;
			console.log(Object.keys(details).length);
			if (Object.keys(details).length !== 0) {
				// 取得したToDoを追加していく
				$.each(details, function (index, todo) {
					var limit = new Date(todo.limitDate);
					var created = new Date(todo.createdDate);
					var p1 = $('<p>').text(todo.text);
					var p2 = $('<p>').text('期限: ' + limit.getFullYear() + '年' + (limit.getMonth() + 1) + '月' + limit.getDate() + '日');
					var p3 = $('<p>').text('作成日: ' + created.getFullYear() + '年' + (created.getMonth() + 1) + '月' + created.getDate() + '日');
					var sp1 = $('<span>').append(p1, p2, p3);
					var Button1 = $('<Button>');
					Button1.val(todo._id);
					Button1.on('click', function (event) {
						$.post('/comp', {
							id: $(event.target).val(),
							tf: $(event.target).text(),
							param: param
						}, function (res) {
							console.log(res);
							getList();
						});
					});
					if (todo.isCheck) {
						Button1.text('完了');
					} else {
						Button1.text('未完了');
					}
					var div1 = $('<div>').append(sp1, Button1);
					$list.append(div1);
					//$list.append('<p><input type="checkbox" ' + (todo.isCheck ? 'checked' : '') + '>' + todo.text + ' (~' + limit.toLocaleString() + ')</p>');
				});
			} else {
				$list.append('<p style="color:#ff0000;">登録されたToDoはございません</p>');
			}
			// 一覧を表示する	
			$list.fadeIn();
		});
	});
}

// フォームに入力されたToDoを追加する
function postList() {
	// フォームに入力された値を取得
	var name = $('#text').val();
	var limitDate = new Date($('#limit').val());
	var param = $('#todoName').text();

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
	});
}