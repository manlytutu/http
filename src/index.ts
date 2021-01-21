import axios from 'axios';
import Qs from 'qs';
import Storage from './storage'
import CryptoHelper from './encryption'
import { checkParams } from './checkParams';
import { checkResponse } from './checkResponse';

const storage = new Storage();
const cryptoHelper = new CryptoHelper('cacheKey');

const CANCELTTYPE = {
  CACHE: 1,
  REPEAT: 2,
};

//使用自定义配置新建一个 axios 实例
const instance = axios.create()

instance.interceptors.request.use(function (req:Record<string,any>) {
  const source = axios.CancelToken.source();
  req.cancelToken = source.token
  
  //done 请求入参校验
  var checkParamsFlag = checkParams(req);
  if(!checkParamsFlag){
    source.cancel()
  }

  //done 请求数据缓存
  /**
   * 为每一次请求生成一个cancelToken
   * 尝试获取缓存数据
   * 判断是否缓存命中，缓存是否过期
   * 缓存未过期，将缓存数据通过cancle方法回传给请求方法
   */

  //获取缓存数据
  let data
  if(req.cache){
    data = storage.get(cryptoHelper.encrypt(req.url + req.data + (req.method || '')));
    // console.log(2,data)
  }
  //判断是否缓存命中，缓存是否过期
  if(data && (Date.now() <= data.expiries)){ //缓存未过期
    console.log('migzhong')
    //缓存未过期，将缓存数据通过cancle方法回传给请求方法
    source.cancel(JSON.stringify({
      type: CANCELTTYPE.CACHE,
      data: data.data,
    }));
  }
  return req;
}, function (error: any) {
  
  return Promise.reject(error);
});


instance.interceptors.response.use(function (res:any) {
  console.log(3,res)
  if(res.data && res.data.code ==200){
    //todo 增加接口出参校验
    checkResponse(res)


    if(res.config && res.config.cache){
        if(!res.config.cacheTime){
          res.config.cacheTime = 1000*3
        }
        storage.set(cryptoHelper.encrypt(res.config.url + res.config.data + (res.config.method || '')), {
          data: res.data.resData, // 响应体数据
          expiries: Date.now() + res.config.cacheTime, // 设置过期时间
        })
    }
    return res.data.resData;
  }
}, function (error) {
  
  return Promise.reject(error);
});

class Instance {
  //用request又包一层
  //主要是为了对请求参数做处理，比如参数统一加时间戳
  public static async request(params:any):Promise<object>{
    return await instance(params)
  }
  
  public static get(req: any):Promise<object>{
    const{params} = req
    return this.request({...req,method:"GET",params:params});
  }
  public static post(req:any):Promise<object>{
    // console.log('req',req)
    const{data} = req
    return this.request({...req,method:"POST",data:Qs.stringify(data)||{}});
  }
  public static put(req:any):Promise<object>{
    const{data} = req
    return this.request({...req,method:"PUT",data:data});
  }
  public static delete(req:any):Promise<object>{
    const{data} = req
    return this.request({...req,method:"DELETE",data:data});
  }
}

export {Instance}

//todo 清除缓存