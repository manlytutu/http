import axios,{AxiosRequestConfig, AxiosResponse,} from 'axios';
import Qs from 'qs';
import Storage from './storage'
import CryptoHelper from './encryption'
const storage = new Storage();
const cryptoHelper = new CryptoHelper('cacheKey');

// instance.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded'
const CANCELTTYPE = {
  CACHE: 1,
  REPEAT: 2,
};
// 请求通用配置.
const axiosConfig: AxiosRequestConfig = {
  // 请求后的数据处理
  transformResponse: [
    (data: AxiosResponse) => {
      return data;
    }
  ],
  transformRequest: [
    function (data) {
      let ret = "";
      for (let it in data) {
        ret +=
          encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
      }
      ret = ret.substring(0, ret.lastIndexOf("&"));
      return ret;
    }
  ],
  responseType: "json",
};
//使用自定义配置新建一个 axios 实例
const instance = axios.create(axiosConfig)

instance.interceptors.request.use(function (req:Record<string,any>) {
  console.log(1,req)
  //为每一次请求生成一个cancelToken
  const source = axios.CancelToken.source();
  req.cancelToken = source.token
  //获取缓存数据
  let data
  if(req.cache){
    data = storage.get(cryptoHelper.encrypt(req.url + JSON.stringify(req.data) + (req.method || '')));
    console.log(2,data)
  }
  //判断是否缓存命中，缓存是否过期
  if(data && (Date.now() <= data.experies)){ //缓存未过期
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
    if(res.config && res.config.cache){
        if(!res.config.cacheTime){
          res.config.cacheTime = 1000*3
        }
        storage.set(cryptoHelper.encrypt(res.config.url + res.config.data + (res.config.method || '')), {
          data: res.data.resData, // 响应体数据
          experies: Date.now() + res.config.cacheTime, // 设置过期时间
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
    const{url,data,baseURL,cache,cacheTime} = req
    return this.request({method:"GET",url,params:data,baseURL,cache,cacheTime});
  }
  public static post(req:any):Promise<object>{
    const{url,data,baseURL,cache,cacheTime} = req
    return this.request({method:"POST",url,data:data||{},baseURL,cache,cacheTime});
  }
  public static put(req:any):Promise<object>{
    const{url,data,baseURL,cache,cacheTime} = req
    return this.request({method:"PUT",url,data:data,baseURL,cache,cacheTime});
  }
  public static delete(req:any):Promise<object>{
    const{url,data,baseURL,cache,cacheTime} = req
    return this.request({method:"DELETE",url,data:data,baseURL,cache,cacheTime});
  }
}

export {Instance}

//todo 清除缓存