import axios from 'axios';
import Qs from 'qs';
//使用自定义配置新建一个 axios 实例
const instance = axios.create()
instance.interceptors.request.use(function (config) {
  console.log(config)
  return config;
}, function (error) {
  
  return Promise.reject(error);
});


instance.interceptors.response.use(function (response) {
  
  return response;
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
    const{url,data} = req
    return this.request({method:"GET",url,params:data});
  }
  public static post(req:any):Promise<object>{
    const{url,data} = req
    return this.request({method:"POST",url,params:data});
  }
  public static put(req:any):Promise<object>{
    const{url,data} = req
    return this.request({method:"PUT",url,params:data});
  }
  public static delete(req:any):Promise<object>{
    const{url,data} = req
    return this.request({method:"DELETE",url,params:data});
  }
}

export {Instance}
