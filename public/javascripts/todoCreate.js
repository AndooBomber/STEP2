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

    });
    $list.fadeIn();
  });
}

function postList() {
  var name = $("#text").val();
  $("#text").val('');
  $.post('todoCreate', {
    name: name
  }, function (res) {
    console.log(res);
    getList();
  });
}