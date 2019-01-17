var Koa = require('koa2');
const jwt = require('jsonwebtoken')
const jwtKoa = require('koa-jwt')
const router = require('koa-router')();
 
const secret = 'jwt'
const util = require('util')
const verify = util.promisify(jwt.verify) // 解密
var app = new Koa();

// 401 权限错误
app.use((ctx,next)=>{
    return next().catch((err)=>{
        if(err.status ===401){
            ctx.status = 401;
            ctx.body='暂无权限';
        }else{
            throw err;
        }
    })
})

app.use(jwtKoa({secret}).unless({ path: [/^\/login/] }));

  router.post('/api/login', async (ctx,next) => {
        let userToken = {
            name: 'mengtianren'
        }
        const token = jwt.sign(userToken, secret, {expiresIn: '1h'})  //token签名 有效期为1小时
        ctx.body = {
            message: '获取token成功',
            code: 1,
            token
        }
})
.get('/api/userInfo', async (ctx) => {
    const token = ctx.header.authorization  // 获取jwt
    let payload
    if (token) {

        payload = await verify(token.split(' ')[1], secret)  // // 解密，获取payload
        ctx.body = {
            payload
        }
    } else {
        ctx.body = {
            message: 'token 错误',
            code: -1
        }
    }
})
app
    .use(router.routes())
    .use(router.allowedMethods())
app.listen(3000,() =>{
    console.log('listen:3000')
})