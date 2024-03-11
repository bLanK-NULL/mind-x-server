const Router = require('koa-router');
const router = new Router();
const { login, uploadProject, getProject, getAllProjectName, getProjectByPname } = require('../dao/index')
const { generateJWT, verifyJWT } = require('../utils/jwt')

router.post('/login', async (ctx, next) => {
    console.log('访问 /login')
    const { username, password } = ctx.request.body;
    const user = await login(username, password);
    if (user.length) {
        const payload = {
            uid: user[0].uid,
            username: user[0].username
        }
        const token = generateJWT(payload, '7d')
        ctx.body = {
            token,
            ...payload,
            message: '登陆成功'
        }
    } else {
        ctx.status = 401;
        ctx.body = {
            message: '用户名或密码错误'
        }
    }
});

router.post('/uploadProject', async (ctx, next) => {
    //通过中间件auth把token解析后存在了ctx.state.user中
    console.log('访问 /uploadProject')
    const { uid, username } = ctx.state.userInfo;
    let result;
    try {
        result = await uploadProject(uid, ctx.request.body.pname, ctx.request.body.data, ctx.request.body.stamp)
    } catch (err) {
        ctx.body = {
            success: false,
            message: '上传失败'
        }
    }
    if (result.affectedRows) {
        ctx.body = {
            success: true,
            message: '上传成功'
        }
    } else {
        ctx.body = {
            success: false,
            message: '上传失败'
        }
    }
})
router.post('/getProjectFromServer', async (ctx, next) => {
    const { uid, username } = ctx.state.userInfo;
    const { pname, stamp } = ctx.request.body;
    let result;
    try {
        result = await getProject(uid, pname)
        if (result.length) {
            if (result[0].stamp > stamp) //服务器的数据新
                ctx.body = {
                    success: true,
                    message: '请求成功',
                    data: result[0].data
                }
            else ctx.body = { //本地的数据最新
                success: true,
                message: '使用本地数据',
            }
        } else {
            ctx.body = {
                success: false,
                message: '没有找到该项目'
            }
        }
    } catch (err) {
        ctx.body = {
            success: false,
            message: '/getProjectFromServer 请求失败'
        }
    }
})
router.get('/getAllProjectName', async (ctx, next) => {
    const { uid } = ctx.state.userInfo;
    try {
        const result = await getAllProjectName(uid);
        ctx.body = {
            success: true,
            message: '请求成功',
            data: result
        }
    } catch (err) {
        ctx.body = {
            success: false,
            message: '/getAllProjectName 请求失败'
        }
    }


})

router.post('/getProjectByPname', async (ctx) => {
    const { uid } = ctx.state.userInfo;
    const { pname } = ctx.request.body;
    try {
        const result = await getProjectByPname(uid, pname);
        if (result.length > 0) {
            ctx.body = {
                success: true,
                message: '请求成功',
                data: result[0]
            }
        } else ctx.body = {
            success: false,
            message: '没有找到该项目'
        }
    } catch (err) {
        ctx.body = {
            success: false,
            message: '/getProjectByPname 请求失败'
        }
        throw err
    }
})

router.get('/users/:id', async (ctx, next) => {
    const id = ctx.params.id;
    ctx.body = `User id: ${id}`;
});




module.exports = router;