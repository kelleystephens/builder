(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    $('#login').click(login);
    $('#seed').click(seed);
    $('#getforest').click(getForest);
    $('#forest').on('click', '.tree.alive.notchopped > #grow', grow);
    $('#forest').on('click', '.tree.alive.adult.notchopped > #chop', chop);
  }
  function chop() {
    var tree = $(this).parent();
    var treeId = tree.data('id');
    console.log(treeId);
    $.ajax({
      url: ("/tree/" + treeId + "/chop"),
      type: 'PUT',
      success: (function(t) {
        tree.replaceWith(t.html);
        $('#woodTotal').text(t.user.wood);
      })
    });
  }
  function grow() {
    var tree = $(this).parent();
    var treeId = tree.data('id');
    console.log(treeId);
    $.ajax({
      url: ("/tree/" + treeId + "/grow"),
      type: 'PUT',
      dataType: 'html',
      success: (function(t) {
        tree.replaceWith(t);
      })
    });
  }
  function getForest() {
    var userId = $('#username').data('id');
    $.ajax({
      url: ("/forest/" + userId),
      type: 'GET',
      dataType: 'html',
      success: (function(trees) {
        $('#forest').empty().append(trees);
      })
    });
  }
  function seed() {
    var userId = $('#username').data('id');
    $.ajax({
      url: '/seed',
      type: 'POST',
      dataType: 'html',
      data: {userId: userId},
      success: (function(tree) {
        $('#forest').append(tree);
      })
    });
  }
  function login(event) {
    var data = $(this).closest('form').serialize();
    $.ajax({
      url: '/login',
      type: 'POST',
      data: data,
      success: (function(r) {
        $('#login').prev().val('');
        $('#username').attr('data-id', r._id);
        $('#username').text(r.username);
      })
    });
    event.preventDefault();
  }
})();

//# sourceMappingURL=game.map
