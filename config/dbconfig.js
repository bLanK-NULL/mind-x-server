const config = {
    // 服务器数据库
    dataBase: {
        DATABASE: 'mind-x-docker',
        USERNAME: 'root',
        PASSWORD: '252238Lzy',
        PORT: 3306,
        // HOST: 'localhost',
        // PORT: 3307,
        // HOST: 'mysql',
        HOST: 'mind-x-db',
        // HOST: '1.94.9.34',
        multipleStatements: true //允许一次执行多条sql
    }
}

module.exports = config