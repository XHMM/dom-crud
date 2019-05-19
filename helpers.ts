/* eslint-disable @typescript-eslint/no-non-null-assertion */
type Sign = "==" | "+=" | "-=";

/*
KVSC string:
xx==aa
xx-=aa
x-=aa
xx+=aa
xx=aa?configA=xx&configB=xx

KVSC entry
[xx, yy, sign, {xx"xx}]
[xx, yy, sign, {}]

K,V,S 必不为空字符串
C 可为空对象
* */
type KVSCEntryFromString = [string, string, Sign, Record<string, any>];
type KVSCEntryFromObject = [string, any, Sign, Record<string, any>];

// define accepted valid type for V(value) in KVSC
type ValidDomsValue = Element[] | NodeList | HTMLCollection;
// export type ValidTypeValue = xx
// export type ValidXxxValue = xx

/*----------------------------------------------------------------------------*/

// return type string: array string function null...
function getType(val: any): string {
  const rightPart = Object.prototype.toString.call(val).split(" ")[1];
  return rightPart.slice(0, rightPart.length - 1).toLowerCase();
}

/*
 * class name cannot contain space
 * ' a b c'  ===> ['a', 'b', 'c']
 * */
function stringToDomClasses(str: string): string[] {
  return str
    .trim()
    .split(" ")
    .filter(item => item !== "");
}

function isValidDomsValue(val: any): boolean {
  let type = getType(val);
  if (type === "array") return val.every((item: any) => item instanceof Element);
  else return type === "nodelist" || type === "htmlcollection";
}
// function isValidTypeValue() ...
// function isValidXxxValue() ...

/*
cdom('div',
  {
    'doms+=': {
      value: [cdom('div', 'text==hi!')], // value必须存在，值可为任意类型
      config: { // config可有可无
       ca:xx,
       cb:xx
      }
    },
    "text==": {
      value:'hi'
    }
   'text+=': 'hi',
   'style+=': 'hi?configA=xx'
  },

  'text+=hi?configA=xx&configB=xx'
)

 ===>

 ['doms', value, '+=',  { configA:xx, configB:xx}]
 其中value因ley而异，可能去任何类型的值

* */
function _stringToKVSCEntry(str: string): KVSCEntryFromString {
  let res: KVSCEntryFromString;
  let sign: Sign | "" = "";

  if (str.includes("-=")) {
    sign = "-=";
  } else if (str.includes("+=")) {
    sign = "+=";
  } else if (str.includes("==")) {
    sign = "==";
  }
  if (sign) {
    const idx = str.indexOf(sign);
    const k = str.slice(0, idx).trim();
    const vc = _vcStringToObject(str.slice(idx + 2));
    res = [k, vc.v, sign, vc.c];
    if (res.length !== 4) {
      throw new Error("options item format not correct");
    } else return res;
  } else {
    throw new Error("options item format not correct");
  }
}
function _objectToKVSEntry(obj: Record<string, any>): KVSCEntryFromObject[] {
  let res: KVSCEntryFromObject[] = [];
  try {
    Object.entries(obj).map(item => {
      let key = item[0];
      let value = item[1];
      let sign: Sign | "" = "";
      if (key.endsWith("-=")) {
        sign = "-=";
      } else if (key.endsWith("+=")) {
        sign = "+=";
      } else if (key.endsWith("==")) {
        sign = "==";
      }
      if (sign) {
        const k = key.match(/.+(?=[-+=]=)/)![0];
        let v, c;
        const valueType = getType(value);
        if (valueType === "string") {
          const vc = _vcStringToObject(value);
          v = vc.v;
          c = vc.c;
        } else if (valueType === "object") {
          if (!value.value) {
            throw new Error("options item format not correct");
          }
          v = value.value;
          c = value.config || {};
        } else {
          // eg: {'doms+=': [xx, xx] }
          v = value;
          c = {};
        }
        res.push([k, v, sign, c]);
      } else {
        throw new Error("options item format not correct");
      }
    });
    return res;
  } catch (e) {
    throw e;
  }
}
function _vcStringToObject(str: string): { v: string; c: Record<string, string | boolean | number> } {
  let v = "",
    c = {};
  const vc = str.trim().match(/(.*)\?([0-9a-zA-Z&=]*)/); // 不能写成 /(.+) .../  因为当value传入了空内容时会导致匹配出错
  // 为null表示没有配置项
  if (vc === null) {
    v = str;
  } else if (vc && vc.length === 3) {
    v = vc[1];
    c = vc[2].split("&").reduce((acc: Record<string, string | boolean | number>, cur) => {
      const arr = cur.split("=");
      let value;
      if (arr[1] === "true") value = true;
      else if (arr[1] === "false") value = false;
      else if (arr[1].match(/[0-9]+/g)) value = +arr[1];
      else acc[arr[0]] = arr[1];
      return acc;
    }, {});
  }
  return {
    v,
    c
  };
}

// below function not deal with KVS's  V part, it should be dealt depend on key in cdom/udom
function toKVSEntries(options: any[]): Array<KVSCEntryFromString | KVSCEntryFromObject> {
  let res = [];
  for (const option of options) {
    if (getType(option) == "string") {
      res.push(_stringToKVSCEntry(option));
    } else if (getType(option) == "object") {
      res.push(..._objectToKVSEntry(option));
    }
  }
  return res;
}

// merge attributes if target and source both have
function merge(target: any, source: any): void {
  const targetType = getType(target);
  const sourceType = getType(source);
  if (targetType !== "object" || sourceType !== "object")
    throw new TypeError(
      `target and source should both be object, received: target is ${targetType}, source is ${sourceType}`
    );
  for (const sourceKey in source) {
    if (source.hasOwnProperty(sourceKey)) {
      if (sourceKey in target) {
        const subTargetTypeIsObj = getType(target[sourceKey]) == "object";
        const subSourceTypeIsObj = getType(source[sourceKey]) == "object";
        if (!subSourceTypeIsObj && !subTargetTypeIsObj) {
          target[sourceKey] = source[sourceKey];
        } else if (subTargetTypeIsObj && subSourceTypeIsObj) {
          merge(target[sourceKey], source[sourceKey]);
        }
      }
    }
  }
}

export {
  getType,
  stringToDomClasses,
  isValidDomsValue,
  toKVSEntries,
  merge,
  Sign,
  KVSCEntryFromString,
  KVSCEntryFromObject,
  ValidDomsValue
};
