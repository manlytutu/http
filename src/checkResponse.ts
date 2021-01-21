export function checkResponse(res:any){
  const checkResponseList:Record<string,any> ={
    "goods":["stepCode","mobi"],
    "goods2":["stepCode","name","gender","age","output"]
  }
  const checkItem =checkResponseList[res.config.url]
  checkItem.forEach(function(item: any){
    if(res.data.resData[item]===undefined){
      console.log('接口'+res.config.url+'出参缺少参数'+item)
    }
  })
  return res
}