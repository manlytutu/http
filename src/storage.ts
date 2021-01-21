class Storage {
  public set(realKeyObj:any, realValueObj: any) {
    if (typeof realKeyObj == 'string') {
      localStorage.setItem(realKeyObj, JSON.stringify(realValueObj));
    }
    if (typeof realKeyObj == 'object') {
      for (var j = 0; j < realKeyObj.length; j++) {
        localStorage.setItem(realKeyObj[j], JSON.stringify(realValueObj[j]));
      }
    }
  }
  public get(realKey: any) {
    //@ts-ignore
    return JSON.parse(localStorage.getItem(realKey))
  }
  public remove(realKeyObj: any) {
    if (typeof realKeyObj == 'string') {
      localStorage.removeItem(realKeyObj);
    }
    if (typeof realKeyObj == 'object') {
      for (var i = 0; i < realKeyObj.length; i++) {
        localStorage.removeItem(realKeyObj[i]);
      }
    }
  }
}

export default Storage;