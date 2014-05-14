'use strict';

var users = global.nss.db.collection('users');
var trees = global.nss.db.collection('trees');
var Mongo = require('mongodb');
var treeHelper = require('../lib/tree-helper'); //is an object
var _ = require('lodash');

exports.index = (req, res)=>{
  res.render('game/index', {title: 'Builder'});
};

exports.login = (req, res)=>{
  var user = {};
  user.username = req.body.username;
  user.wood = 0;
  user.cash = 0;

  users.findOne({username:user.username}, (e, obj)=>{
    if(obj){
      res.send(obj);
    }else{
      users.save(user, (e, obj)=>res.send(obj));
    }
  });
};

exports.seed = (req, res)=>{
  var userId = Mongo.ObjectID(req.body.userId);

  var tree = {};
  tree.height = 0;
  tree.userId = userId;
  tree.isHealthy = true;
  tree.isChopped = false;

  trees.save(tree, (e,obj)=>{
    res.render('game/tree', {tree: obj, treeHelper:treeHelper}, (e, html)=>{
      res.send(html);
    });
  });
};

exports.forest = (req, res)=>{
  var userId = Mongo.ObjectID(req.params.userId);
  trees.find({userId:userId}).toArray((e,objs)=>{
    res.render('game/forest', {trees: objs, treeHelper:treeHelper}, (e, html)=>{
      res.send(html);
    });
  });
};

exports.grow = (req, res)=>{
  var treeId = Mongo.ObjectID(req.params.treeId);
  trees.findOne({_id:treeId}, (e, tree)=>{
    tree.height += _.random(0, 2);
    tree.isHealthy = _.random(0, 100) !== 70;
    trees.save(tree, (e, count)=>{
      res.render('game/tree', {tree: tree, treeHelper:treeHelper}, (e, html)=>{
        res.send(html);
      });
    });
  });
};

exports.chop = (req, res)=>{
  var treeId = Mongo.ObjectID(req.params.treeId);
  trees.findOne({_id:treeId}, (e, tree)=>{
    var wood = tree.height/2;
    tree.isChopped = true;
    console.log(wood);
    trees.save(tree, (e, count)=>{
      console.log(tree);
      // users.findOne({_id:tree.userId}, (e, user)=>{
      //   user.wood += wood;
      //   users.save(user, (e, count)=>{
      //     res.render('game/tree', {tree: tree, user:user, treeHelper:treeHelper}, (e, html)=>{
      //       var both ={html: html, user: user};
      //       console.log(both);
      //       res.send(both);
      //     });
      //   });
      // });
    });

  });
};
