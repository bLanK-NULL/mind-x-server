const jwt = require("jsonwebtoken");
const secret = 'mind-x-server-secret';

/**
 * 
 * @param {*} value 用户 id信息
 * @param {*} expires token有效时间
 */
const generateJWT = (value, expires) => {  // 创建 token
    try {
        return jwt.sign(value, secret, { expiresIn: expires });
    } catch (err) {
        throw ('catch error in jwt.js:\n', err)
    }
}
const verifyJWT = (token) => {  // 查看 token
    try {
        return jwt.verify(token, secret); // 如果过期将返回false
    } catch (err) {
        return false;
    }
}

module.exports = {
    generateJWT,
    verifyJWT
}
