const Koa = require('koa2');
const app = new Koa();
const router = require('./router/index')
const { koaBody } = require('koa-body');
const cors = require('koa2-cors');
const auth = require('./middleware/auth')
const serve = require('koa-static')
const path = require('path')
const port = 3000;

app.use(cors())
    .use(koaBody())
    .use(auth)
    // .use(errorHandler)
    .use(serve(path.resolve(__dirname, 'dist'))) 
    .use(router.routes()).use(router.allowedMethods())

app.on('error', (err, ctx) => {
    console.error('server error!!!\n', err)
    ctx.body = err;
})

app.listen(port, () => {
    console.log('Server listening on http://localhost:3000');
});