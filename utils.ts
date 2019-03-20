import { getType } from "./helpers";

type Sign = "=" | "+=" | "-=";
type KVSEntryFromString = [string, string, Sign];
type KVSEntryFromObject = [string, any, Sign];
// we call xx=aa xx-=aa xx+=aa xx-= xx+= xx= KVS string
// we call [xx, yy, sign] KVS entry




export function _isValidDomsValue(val: any) {
  let type = getType(val);
  return type === "array" || type === "nodelist" || type === "htmlcollection";
}
// function _isValidTypeValue() ...
// function _isValidXxxValue() ...






export function _stringToKVSEntry(str: string): KVSEntryFromString {
  let res: any = [];
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
  if (res.length !== 3) {
    throw new Error("options item not match key=val or key-=val or key+=val");
  }
  return res;
}
export function _objectToKVSEntry(obj: Record<string, any>): KVSEntryFromObject[] {
  let res=[];
  Object.entries(obj).map(item => {
    if (item[0].endsWith("-")) {
      res.push([item[0].slice(0, item[0].length - 1), item[1], "-="])
    } else if (item[0].endsWith("+")) {
      res.push([item[0].slice(0, item[0].length - 1), item[1], "+="])
    } else res.push([item[0], item[1], "="]);
  });
  return res;
}
// below function not deal with KVS's  V part, it should be dealt depend on key in cdom/udom
export function toKVSEntries(options: any[]): Array<KVSEntryFromString | KVSEntryFromObject> {
  let res = [];
  for (const option of options) {
    if (getType(option) == "string") {
      res.push(_stringToKVSEntry(option));
    } else if (getType(option) == "object") {
      res.push(..._objectToKVSEntry(option))
    }
  }
  return res;
}






export function appendDoms($container, doms: any) {
  if (!_isValidDomsValue(doms))
    throw new TypeError(
      `when key is 'doms', value should be array/array-like and from one of Element[], HTMLCollection, NodeList`
    );
  for (const dom of doms) {
    $container.appendChild(dom);
  }
}
export function removeDoms($container, doms: any) {
  if (!_isValidDomsValue(doms))
    throw new TypeError(
      `when key is 'doms', value should be array/array-like and from one of Element[], HTMLCollection, NodeList`
    );
  for (const dom of doms) {
    if(dom.parentNode == $container)
      dom.remove();
    else {
      console.warn(`encountered a dom that is not a child dom, removing skipped`)
    }
  }
}