const Koa = require("koa");
const app = new Koa();
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");

const jwt = require("jsonwebtoken");
const jwtKoa = require("koa-jwt");


const logUtil = require("./utils/log_util");
const index = require("./routes/index");
const users = require("./routes/users");
// jwt关键字
const secret = "jwt";
const util = require("util");
const verify = util.promisify(jwt.verify); // 解密
// error handler
onerror(app);

// 401 权限错误
app.use((ctx, next) => {
  console.log(1)
  return next().catch(err => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = "暂无权限";
    } else {
      throw err;
    }
  });
});
app.use(jwtKoa({secret}).unless({ path: [/^\/login/] }));
// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"]
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));



// logger
app.use(async (ctx, next) => {
  //响应开始时间
  const start = new Date();
  //响应间隔时间
  var ms;
  try {
    //开始进入到下一个中间件
    await next();
    ms = new Date() - start;
    console.log(ms)
    //记录响应日志
    logUtil.logResponse(ctx, ms);
  } catch (error) {
    ms = new Date() - start;
    //记录异常日志
    logUtil.logError(ctx, error, ms);
  }
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
