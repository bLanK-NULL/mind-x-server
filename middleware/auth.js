const jwt = require('../utils/jwt')
//以api开头
const apiWhiteList = ['/login'];
const auth = async (ctx, next) => {
    if (needAuth(ctx.url)) {
        const { authorization = '', secret } = ctx.request.header;
        const token = authorization.replace('Bearer ', '');
        const info = jwt.verifyJWT(token);
        if (info) {
            ctx.state.userInfo = info; // 将用户信息存放到 state中, info 就是解析token 之后的信息
            // console.log('==========\n ', ctx.url, info)
            await next();
            ctx.body && (ctx.body.username = info.username);
        } else {
            //没验证过，不放行
            // ctx.status = 401;
            ctx.body = {
                code: 401,
                message: '未授权'
            }
            // console.log('unauth', ctx.url)
        }
    } else {
        await next();
    }

};
function needAuth(path) {
    const apiRegex = /^\/api/;
    if (apiRegex.test(path)) {// 是api
        if (apiWhiteList.some(whitePath => whitePath === path.replace(apiRegex, ''))) {
            return false;
        }
        // 否则，需要权限
        return true;
    }
    // 如果路径不以'/api'开头，那么不需要权限
    return false;
}

module.exports = auth;
