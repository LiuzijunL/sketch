//数据库模块
const mysql = require('mysql')

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sketch',
    // 开启执行多条Sql语句的功能
    multipleStatements: true
});

module.exports = conn