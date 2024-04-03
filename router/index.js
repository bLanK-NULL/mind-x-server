const Router = require('koa-router');
const router = new Router();
const { login, uploadProject, getProject, getAllProject, getProjectByPname, renameProject, deleteProject } = require('../dao/index')
const { generateJWT } = require('../utils/jwt')
router.prefix('/api')
router.post('/login', async (ctx, next) => {
    const { username, password } = ctx.request.body;
    if (!username || !password) {
        ctx.body = {
            message: '账号或密码不能为空'
        }
        return;
    }
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
router.get('/getAllProject', async (ctx, next) => {
    const { uid } = ctx.state.userInfo;
    try {
        const result = await getAllProject(uid);
        ctx.body = {
            success: true,
            message: '请求成功',
            data: result
        }
    } catch (err) {
        ctx.body = {
            success: false,
            message: '/getAllProject 请求失败'
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

router.post('/renameProject', async (ctx) => {
    const { uid } = ctx.state.userInfo;
    const { oldPname, newPname } = ctx.request.body;
    try {
        const result = await renameProject(uid, newPname, oldPname);
        if (result.affectedRows) {
            ctx.body = {
                success: true,
                message: '重命名成功',
                newPname: newPname
            }
        } else {
            ctx.body = {
                success: false,
                message: '/renameProject 请求失败',
            }
        }
    } catch (error) {
        ctx.body = {
            success: false,
            message: '禁止重复命名',

        }
    }
})
router.post('/deleteProject', async (ctx) => {
    const { uid } = ctx.state.userInfo;
    const { pname } = ctx.request.body;
    try {
        const result = await deleteProject(uid, pname)
        if (result.affectedRows) {
            ctx.body = {
                success: true,
                message: '删除成功',
            }
        } else {
            ctx.body = {
                success: false,
                message: '删除失败'
            }
        }
    } catch (error) {
        ctx.body = {
            success: false,
            message: '删除失败'
        }
    }
})
router.get('/checkToken', async (ctx) => {
    ctx.body = {};
})
module.exports = router;