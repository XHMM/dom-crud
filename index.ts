// 创建dom，不受sign影响，即class-=a 等同于class=a
function cdom(tagName:string, ...options) {
  const $dom = document.createElement(tagName);
  let keyValSignEntries = _toKeyValSignEntries(options);
  keyValSignEntries.map(option => {
    const [key, val] = option;
    if(key==='class')
      $dom.classList.add(..._splitToDomClasses(val));
    else if(key === 'style')
      $dom.style.cssText = val;
    else if(key === 'text')
      $dom.textContent = val;
    else if(key === 'html')
      $dom.innerHTML = val;
    else {
      $dom.setAttribute(key, val)
    }
  })
  return $dom;
}
function rdom(selector:string) {
  return document.querySelector(selector);
}
function rdoms(selector:string) {
  return document.querySelectorAll(selector);
}
function udom($dom, ...options) {
  let keyValSignEntries = _toKeyValSignEntries(options);
  keyValSignEntries.map(option => {
    const [key, val, sign] = option;
    if(key==='class') {
      if(sign=='-=') {
        $dom.classList.remove(..._splitToDomClasses(val))
      }
      if(sign=='+=')
        $dom.classList.add(..._splitToDomClasses(val));
      if(sign=='=') {
        $dom.className = '';
        $dom.classList.add(..._splitToDomClasses(val));
      }
    }
    // 更新style时，需要注意：
    else if(key === 'style') {
      // 如果是移除，则参数传入就是 'style-=color;font-size;' or {'style-': 'color;font-size'} ，即只包含属性名,
      if(sign=='-=') {
        const styleProperties = val.split(';');
        styleProperties.map(item => {
          $dom.style.removeProperty(item);
        })
      }
      if(sign=='+=')
        $dom.style.cssText += val;
      if(sign=='=') {
        $dom.style.cssText = val;
      }
    }
    else if(key === 'text') {
      // 如果是移除，则参数传入就是 'text-=' or {'text-': ''}
      if(sign=='-=') {
        $dom.textContent = '';
      }
      if(sign=='+=') {
        $dom.textContent+= val;
      }
      if(sign=='=') {
        $dom.textContent = val;
      }
    }
    else if(key === 'html') {
      if(sign=='-=') {
        $dom.innerHTML = '';
      }
      if(sign=='+=') {
        $dom.innerHTML+= val;
      }
      if(sign=='=') {
        $dom.innerHTML = val;
      }
    }
    else {
      if(sign=='-=') {
        $dom.removeAttribute(key);
      }
      if(sign=='+=') {
        $dom.setAttribute(key, val);
      }
      if(sign=='=') {
        $dom.setAttribute(key, val);
      }
    }
  })
  return $dom;
}
function ddom($dom) {
  $dom.remove();
}


function _splitBySign(str:string) {
  let res = [];
  if(str.includes('-=')) {
    const idx = str.indexOf('-=');
    res = [str.slice(0, idx), str.slice(idx+2), '-=']
  }
  if(str.includes('+=')) {
    const idx = str.indexOf('+=');
    res = [str.slice(0, idx), str.slice(idx+2), '+=']
  }
  if(str.includes('=')) {
    const idx = str.indexOf('=');
    res = [str.slice(0, idx), str.slice(idx+1), '=']
  }
  if(res.length!==3) throw new Error('options item not match key=val or key-=val or key+=val')
  return res;
}
function _type(val:any):string {
  const rightPart = Object.prototype.toString.call(val).split(' ')[1]
  return rightPart.slice(0, rightPart.length-1).toLowerCase()
}
function _splitToDomClasses(str:string):string[] {
  return str.trim().split(' ');
}
/*
* ['class-=a b c', 'id=a']
* or
* {
*   'class-':'a b c',
*   'id': 'a'
* }
* =====>
* [['class','a b c', '-='], ['id', 'a', '=']]
*
* */
function _toKeyValSignEntries(options:any[]):Array<[string,string, '='|'+='|'-=']> {
  let res = [];
  if(_type(options[0]) =='object') {
    Object.entries(options[0]).map( item => {
      if(item[0].endsWith('-')) res.push([item[0].slice(0, item[0].length-2), item[1], '-=']);
      else if(item[0].endsWith('+')) res.push([item[0].slice(0, item[0].length-2), item[1], '+=']);
      else res.push([item[0], item[1], '=']);
    })
  }
  if(_type(options[0]) =='string') {
    if(!options.every(option => _type(option) ==='string')) throw new Error('If first option is string, all left must be string.')
    else {
      options.map(option => {
        res.push(_splitBySign(option))
      })
    }
  }
  return res;
}