const jwt = require('../utils/jwt')

const auth = async (ctx, next) => {
    if (ctx.url !== '/login') {
        const { authorization = '' } = ctx.request.header;
        const token = authorization.replace('Bearer ', '');
        const info = jwt.verifyJWT(token);
        if (info) {
            ctx.state.userInfo = info; // 将用户信息存放到 state中, info 就是解析token 之后的信息
            await next();
        } else {
            //没验证过，不放行
            ctx.status = 401;
            ctx.body = {
                message: 'auth.js 验证不通过'
            }
        }
    }else {
        await next();
    }

};

module.exports = auth;
