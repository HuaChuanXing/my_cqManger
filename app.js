// 导入包
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer')
const path = require('path');

// 自动生成一个接收上传文件的文件位置
var upload = multer({ dest: path.join(__dirname, 'www', 'uploads/') })

// 连接数据库
const c_hero = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'my_cq_db'
});

// 创建连接
c_hero.connect();

// 创建服务器
const app = express();

// 过如下代码就可以将 public 目录下的图片、CSS 文件、JavaScript 文件对外开放访问了
app.use(express.static('www'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// 路由地址
// 1.查询所有英雄
app.get('/hero/all', (request, response) => {
    let { search } = request.query;
    if (search != undefined) {
        // 表示是根据关键字来查询英雄
        c_hero.query(`select * from hero where isDelete='false' and heroName like '%${search}%' order by id desc`, (err, results) => {
            if (err) {
                response.send({
                    code: 500,
                    msg: '服务器内部错误！'
                });
            } else {
                response.send({
                    code: 200,
                    msg: '查询成功！',
                    data: results
                });
            };
        });
    } else {
        // 查询所有的英雄
        c_hero.query(`select * from hero where isDelete='false' order by id desc`, (error, results, fields) => {
            if (error) {
                response.send({
                    code: 500,
                    msg: '服务器内部错误！'
                });
            } else {
                response.send({
                    code: 200,
                    msg: '查询成功！',
                    data: results
                });
            };
        });
    };
});

// 2.根据id查询英雄（编辑的第一步）
app.get('/hero/user', (request, response) => {
    let { id } = request.query;
    c_hero.query(`select * from hero where id='${id}'`, (err, results) => {
        if (err) {
            response.send({
                code: 500,
                msg: '服务器内部错误！'
            });
        } else {
            response.send({
                code: 200,
                msg: '查询成功！',
                data: results[0]
            });
        };
    });
});

// 3.编辑英雄（编辑的第二步）
app.post('/hero/update', upload.single('heroIcon'), (request, response) => {
    let { heroName, heroSkill, id } = request.body;

    if (request.file == undefined) {
        // 没有传入头像文件
        c_hero.query(`update hero set heroName='${heroName}',heroSkill='${heroSkill}' where id='${id}'`, (err, results) => {
            if (err) {
                response.send({
                    code: 500,
                    msg: '服务器内部错误！'
                });
            } else {
                response.send({
                    code: 200,
                    msg: '更新成功！'
                });
            };
        });
    } else {
        let heroIcon = 'http://127.0.0.1:4399/uploads/' + request.file.filename;
        // 传入了头像文件
        c_hero.query(`update hero set heroName='${heroName}',heroSkill='${heroSkill}',heroIcon='${heroIcon}' where id='${id}'`, (err, results) => {
            if (err) {
                response.send({
                    code: 500,
                    msg: '服务器内部错误！'
                });
            } else {
                response.send({
                    code: 200,
                    msg: '更新成功！'
                });
            };
        });
    };
});

// 4.新增英雄
app.post('/hero/add', upload.single('heroIcon'), (request, response) => {
    let { heroName, heroSkill } = request.body;
    let heroIcon = 'http://127.0.0.1:4399/uploads/' + request.file.filename
    c_hero.query(`insert into hero (heroName,heroSkill,heroIcon) values ('${heroName}','${heroSkill}','${heroIcon}')`, (err, results) => {
        if (err) {
            response.send({
                code: 500,
                msg: '服务器内部错误！'
            });
        } else {
            response.send({
                code: 200,
                msg: '新增成功！'
            });
        };
    });
});

// 5.删除英雄
app.post('/hero/delete', (request, response) => {
    let { id } = request.body;
    // console.log(id);
    c_hero.query(`update hero set isDelete='true' where id='${id}'`, (err, results) => {
        if (err) {
            response.send({
                code: 500,
                msg: '服务器内部错误！'
            });
        } else {
            response.send({
                code: 200,
                msg: '删除成功！'
            });
        };
    });
});

// 6.

// 关闭连接
// c_hero.end();

// 开启服务器
app.listen(4399, () => {
    console.log('服务器开启成功！端口号是4399');
});