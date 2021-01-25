const Mock = require('mockjs')
const Koa = require('koa')
const Router = require('koa-router')
const cors = require('koa-cors')
const app = new Koa();
const router = new Router();

app.use(cors());

router.get('/', async (ctx) => {
  ctx.body = JSON.stringify(Mock.mock({
    "code": 200,
    "msg": "请求成功",
    "resData": {
      "stepCode": "01",
      "mobi":'get请求'
    }
  }));
})
router.post('/goods',async(ctx)=>{
  const req = ctx.request.body;
  ctx.body = JSON.stringify(Mock.mock({
      "code": 200,
      "msg": "请求成功",
      "resData": {
        "stepCode": "02",
        "mobi":'123232343434'
      }
  }));
})
router.post('/goods2',async(ctx)=>{
  const req = ctx.request.body;
  ctx.body = JSON.stringify(Mock.mock({
      "code": 200,
      "msg": "请求成功",
      "resData": {
        "stepCode": "03",
        'name':"cici",
        "age":'12',
        "gender":"female"
      }
  }));
})
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000,function(){
  console.log(`project is running at http://localhost:3000`)
});







































//代理就是把以  xx 开头的http请求,都代理到 localhost:3000上，由koa提供mock数据，例如通过webpack设置的代理
// module.exports = {
//   devServer: {
//     proxy: {
//      // 将 `/api` 开头的 http 请求，都代理到 `localhost:3000` 上，由 koa 提供 mock 数据
//      '/api': {
//       target: 'http://localhost:3000',
//       secure: false
//      }
//     }
//   }
// }