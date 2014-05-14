/* jshint unused:false */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#login').click(login);
    $('#seed').click(seed);
    $('#getforest').click(getForest);
    $('#forest').on('click', '.tree.alive.notchopped > #grow', grow);
    $('#forest').on('click', '.tree.alive.adult.notchopped > #chop', chop);
  }

  function chop(){
    var tree = $(this).parent();
    var treeId = tree.data('id');
    console.log(treeId);
    $.ajax({
      url: `/tree/${treeId}/chop`,
      type: 'PUT',
      success: t => {
        tree.replaceWith(t.html);
        $('#woodTotal').text(t.user.wood);
      }
    });
  }

  function grow(){
    var tree = $(this).parent();
    var treeId = tree.data('id');
    console.log(treeId);
    $.ajax({
      url: `/tree/${treeId}/grow`,
      type: 'PUT',
      dataType: 'html',  //tells is that not getting an object back, getting html
      success: t => {
        tree.replaceWith(t);
      }
    });
  }

  function getForest(){
    var userId = $('#username').data('id');

    $.ajax({
      url: `/forest/${userId}`,  // take out data bc will show in req.query, bc is a GET
      type: 'GET',
      dataType: 'html',  //tells is that not getting an object back, getting html
      success: trees => {
        $('#forest').empty().append(trees);
      }
    });
  }

  function seed(){
    var userId = $('#username').data('id');

    $.ajax({
      url: '/seed',
      type: 'POST',
      dataType: 'html',
      data: {userId:userId},  //will show in req.body, bc is a POST
      success: tree => {
        $('#forest').append(tree);
      }
    });

  }

  function login(event){
    var data = $(this).closest('form').serialize();

    $.ajax({
      url: '/login',
      type: 'POST',
      data: data,
      success: r => {
        $('#login').prev().val('');  //prev is previous sibling, next is next sibling
        $('#username').attr('data-id', r._id);
        $('#username').text(r.username);
      }
    });

    event.preventDefault();
  }
  })();
