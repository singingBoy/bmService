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
  const userName = req.param('name');
  if(!userName){
    res.send(responseData(0, null))
  }
  //组装用户
  const user = {
    id: UUID(),
    name: userName,
    createTime: new Date().getTime()
  };
  try {
    writeJson('users',user);
    res.send(responseData(1, user))
  }catch (err){
    res.send(responseData(0, null))
  }
});

/*删除用户*/

module.exports = router;
