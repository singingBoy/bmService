'use strict';
const fs = require('fs');
const Path = './public/data/';

/*读取json文件*/
function readJson(target) {
    const filePath = `${Path}${target}.json`;//文件路径
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, function (err, res) {
            if(err){
                reject(new Error());
            }
            if(res){
                //data 处理为对象
                const data = JSON.parse(res.toString());
                resolve(data);
            }
        })
    });
}

/*写数据进json文件*/
function writeJson(target, source) {
    try{
        const filePath = `${Path}${target}.json`;//文件路径
        const res = fs.readFileSync(filePath).toString();
        const resArr = JSON.parse(res);
        resArr.splice(0,0,source);
        fs.writeFileSync(filePath, JSON.stringify(resArr));
    }catch (err){
        throw err
    }
}

/*删除数据 file删除文件,删除id*/
function delJson(file, id) {
    try{
        const filePath = `${Path}${file}.json`;//文件路径
        const res = fs.readFileSync(filePath).toString();
        const resArr = JSON.parse(res);
        resArr.map( (item, index)=>{
            if(item.id == id){
                resArr.splice(index, 1);
            }
        });
        fs.writeFileSync(filePath, JSON.stringify(resArr));
    }catch(err){
        throw err
    }
}

/*更新用户数据*/
function updateUserJson(file, id, target) {
    try {
        const filePath = `${Path}${file}.json`;//文件路径
        const res = fs.readFileSync(filePath).toString();
        const resArr = JSON.parse(res);
        let resData = undefined;
        resArr.map( (item, index)=>{
            if(item.id == id){
                targetFor:
                for(let targetKey of Object.keys(target)){
                    for(let key of Object.keys(item)){
                       if(targetKey == key){
                           item[key] = target[targetKey];
                           break targetFor;
                       }
                   }
                }
                resData = item;
            }
        });
        fs.writeFileSync(filePath, JSON.stringify(resArr));
        return resData;
    }catch (err){
        throw err
    }
}

/*resful返回处理*/
function responseData(status, data) {
    return {status: status, data: data};
}

function UUID() {
    const s = [];
    const hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    return s.join("");;
}

module.exports = {
    readJson,
    writeJson,
    delJson,
    updateUserJson,
    responseData,
    UUID
};