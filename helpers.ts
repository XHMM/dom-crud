type Sign = "=" | "+=" | "-=";

// we call xx=aa xx-=aa xx+=aa xx-= xx+= xx= KVS string
// we call [xx, yy, sign] KVS entry
type KVSEntryFromString = [string, string, Sign];
type KVSEntryFromObject = [string, any, Sign];

// define accepted valid type for V(value) in KVS
type ValidDomsValue = Element[] | NodeList | HTMLCollection;
// export type ValidTypeValue = xx
// export type ValidXxxValue = xx

/*---------------------------------------------------------------------------------------------*/

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
// function _isValidTypeValue() ...
// function _isValidXxxValue() ...

function _stringToKVSEntry(str: string): KVSEntryFromString {
  let res: KVSEntryFromString;
  if (str.includes("-=")) {
    const idx = str.indexOf("-=");
    res = [str.slice(0, idx).trim(), str.slice(idx + 2).trim(), "-="];
  } else if (str.includes("+=")) {
    const idx = str.indexOf("+=");
    res = [str.slice(0, idx).trim(), str.slice(idx + 2).trim(), "+="];
  } else if (str.includes("=")) {
    const idx = str.indexOf("=");
    res = [str.slice(0, idx).trim(), str.slice(idx + 1).trim(), "="];
  }
  // @ts-ignore
  if (res.length !== 3) {
    throw new Error("options item not match key=val or key-=val or key+=val");
  }
  // @ts-ignore
  return res;
}
function _objectToKVSEntry(obj: Record<string, any>): KVSEntryFromObject[] {
  let res: KVSEntryFromObject[] = [];
  Object.entries(obj).map(item => {
    if (item[0].endsWith("-")) {
      res.push([item[0].slice(0, item[0].length - 1), item[1], "-="]);
    } else if (item[0].endsWith("+")) {
      res.push([item[0].slice(0, item[0].length - 1), item[1], "+="]);
    } else res.push([item[0], item[1], "="]);
  });
  return res;
}
// below function not deal with KVS's  V part, it should be dealt depend on key in cdom/udom
function toKVSEntries(options: any[]): Array<KVSEntryFromString | KVSEntryFromObject> {
  let res = [];
  for (const option of options) {
    if (getType(option) == "string") {
      res.push(_stringToKVSEntry(option));
    } else if (getType(option) == "object") {
      res.push(..._objectToKVSEntry(option));
    }
  }
  return res;
}

// only merge attributes target exist
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
  KVSEntryFromString,
  KVSEntryFromObject,
  ValidDomsValue
};
