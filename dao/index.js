const mysql = require('mysql')
const config = require('../config/dbconfig')

const pool = mysql.createPool({
    host: config.dataBase.HOST,
    user: config.dataBase.USERNAME,
    password: config.dataBase.PASSWORD,
    database: config.dataBase.DATABASE,
    port: config.dataBase.PORT
})

// 连接线程池，做sql查找
let allService = {
    query: function (sql, values) {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {  //连接数据库
                if (err) {
                    reject(err)
                } else {//连接成功
                    connection.query(sql, values, (err, rows) => { //执行 sql
                        if (err) {
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                        connection.release() //释放连接
                    })
                }
            })
        })
    }
}

// 查找用户是否存在
const login = function (username, password) {
    let _sql = `select * from user where username="${username}" and password="${password}";`
    return allService.query(_sql)
}
const uploadProject = function (uid, pname, data, stamp) {
    // let _sql = `insert into project (uid, pname, data) values (${uid},"${pname}","${data}");`
    // let _sql = `insert into project (uid, pname, data) values (?,?,?);`
    let _sql = `INSERT INTO project (pname, uid, data, stamp)
    VALUES ('${pname}', ${uid}, '${data}', '${stamp}')
    ON DUPLICATE KEY UPDATE data = '${data}', stamp = '${stamp}';`
    return allService.query(_sql)
}
const getProject = function (uid, pname) {
    let _sql = `select * from project where uid=${uid} and pname="${pname}";`
    return allService.query(_sql)
}
const getAllProject = function (uid) {
    let _sql = `select pname, stamp from project where uid=${uid};`
    return allService.query(_sql)
}
const getProjectByPname = function (uid, pname) {
    let _sql = `select * from project where pname="${pname}" and uid=${uid};`
    return allService.query(_sql)
}
const renameProject = function (uid, newPname, oldPname) {
    const _sql = `update project set pname="${newPname}" where pname="${oldPname}" and uid=${uid};`
    return allService.query(_sql)
}
const deleteProject = function(uid, pname) {
    const _sql = `DELETE FROM project where pname="${pname}" and uid=${uid};`
    return allService.query(_sql)
}
module.exports = {
    login,
    uploadProject,
    getProject,
    getAllProject,
    getProjectByPname,
    renameProject,
    deleteProject
}