var express = require('express');
var router = express.Router();
const {readJson, writeJson, responseData, UUID} = require('../utils/utils');

/* 获取用户 */
router.get('/', function(req, res, next) {
  const userId = req.param('id');
  const userName = req.param('name');
  let resUser = undefined;

  //获取users.json
  readJson('users')
      .then( data => {
        let response = responseData(1, data);
        if(userId || userName){
          data.map( user => {
            if(userId === user.id || userName === user.name){
              resUser = user;
            }
          });
          if(resUser){
            response = responseData(1, resUser);
          }else {
            response = responseData(0);
          }
        }
        res.send(response);
      }).catch(err => {
        res.send(responseData(0,null))});
});

/* 新增用户 */
router.post('/', function(req, res, next) {
  //获取用户信息
  const userName = req.body.name;
  if(!userName){
    res.send(responseData(0, null));
    return;
  }
  const userId = UUID();
  //组装用户
  const user = {
    id: userId,
    name: userName,
    createTime: new Date().getTime()
  };
  //用户标签
  const bookMarks = {
    userId: userId,
    list:[],
  };
  try {
    writeJson('users',user);
    writeJson('bookMarks', bookMarks);
    res.send(responseData(1, user))
  }catch (err){
    console.log(err.message);
    res.send(responseData(0, null))
  }
});

/*删除用户*/
router.delete('/', function (req, res, next) {
  const userId = req.param('userId');
  if(!userId){
    res.send(responseData(0, null))
  }
  try {
    delJson('users',userId);
    res.send(responseData(1, userId))
  }catch (err){
    console.log(err.message);
    res.send(responseData(0, null))
  }
})

/**
 * 更新用户
 * Content-Type:application/x-www-form-urlencoded;charset=utf-8
 * */
router.put('/', function (req, res, next) {
  const id = req.param('id');
  console.log(req.body);
  const user = {name: req.body.name};
  try{
    const resData = updateUserJson('users', id, user);
    res.send(responseData(1, resData));
  }catch (err){
    console.log(err.message);
    res.send(responseData(0, null));
  }
});

module.exports = router;
