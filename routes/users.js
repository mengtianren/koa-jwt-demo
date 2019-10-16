const router = require("koa-router")();

router.prefix("/users");

router.get("/", function(ctx, next) {
  ctx.body = "this is a users response!";
});

router.get("/bar", function(ctx, next) {
  ctx.body = "this is a users/bar response";
});

router
  .post("/login", async (ctx, next) => {
    let userToken = {
      name: "mengtianren"
    };
    const token = jwt.sign(userToken, secret, { expiresIn: "1h" }); //token签名 有效期为1小时
    ctx.body = {
      message: "获取token成功",
      code: 1,
      token
    };
  })
  .get("/userInfo", async ctx => {
    const token = ctx.header.authorization; // 获取jwt
    let payload;
    if (token) {
      payload = await verify(token.split(" ")[1], secret); // // 解密，获取payload
      ctx.body = {
        payload
      };
    } else {
      ctx.body = {
        message: "token 错误",
        code: -1
      };
    }
  });

module.exports = router;
