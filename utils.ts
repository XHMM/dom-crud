/*
* split string and get its sign
*
* 'class-=a b c' ===>  ['class','a b c', '-=']
*
* */
export function _splitBySign(str:string):[string,string, '='|'+='|'-='] {
  let res:any = [];
  if(str.includes('-=')) {
    const idx = str.indexOf('-=');
    res = [str.slice(0, idx).trim(), str.slice(idx+2).trim(), '-=']
  }
  else if(str.includes('+=')) {
    const idx = str.indexOf('+=');
    res = [str.slice(0, idx).trim(), str.slice(idx+2).trim(), '+=']
  }
  else if(str.includes('=')) {
    const idx = str.indexOf('=');
    res = [str.slice(0, idx).trim(), str.slice(idx+1).trim(), '=']
  }
  if(res.length!==3) throw new Error('options item not match key=val or key-=val or key+=val')
  return res;
}
// return type string: array string function null...
export function _type(val:any):string {
  const rightPart = Object.prototype.toString.call(val).split(' ')[1]
  return rightPart.slice(0, rightPart.length-1).toLowerCase()
}
// ' a b c'  ===> ['a', 'b', 'c']
export function _splitToDomClasses(str:string):string[] {
  return str.trim().split(' ').filter(item => item !=='');
}
/*
*
* ['class-=a b c', 'id=a', ...]
* or
* {
*   'class-':'a b c',
*   'id': 'a',
*   ...
* }
*
* =====>
*
* [['class','a b c', '-='], ['id', 'a', '='], ...]
* */
export function _toKeyValSignEntries(options:any[]):Array<[string,string, '='|'+='|'-=']> {
  let res = [];
  for (const option of options) {
    if(_type(option) == 'string') {
      res.push(_splitBySign(option))
    }
    else if(_type(option) == 'object') {
      Object.entries(option).map( item => {
        if(item[0].endsWith('-')) {
          res.push([item[0].slice(0, item[0].length-1), item[1].toString().trim(), '-=']);
        }
        else if(item[0].endsWith('+')) {
          res.push([item[0].slice(0, item[0].length-1), item[1].toString().trim(), '+=']);
        }
        else res.push([item[0], item[1].toString().trim(), '=']);
      })
    }
  }
  return res;
}