
export function checkParams(req: Record<string, any>){
  const formatData:Record<string,any> = {}
  const splitArray = req.data.split('&')
  let item: any[] 
  let checkParamsFlag = true
  for(var i = 0; i < splitArray.length; i++){
    item = splitArray[i].split('=')
    formatData[item[0]]=item[1]
  }
  
  const checkList:Record<string,Array<string>> ={
    'goods':['account','pwd','test'],
    'goods2':['account','pwd']
  }
  const checkItem = checkList[req.url]
  checkItem.forEach(function (item) {
      if(formatData[item] === undefined){
        console.log('接口'+req.url+'缺少必须参数' + item);
        checkParamsFlag = false
      }
  })
  return checkParamsFlag
}