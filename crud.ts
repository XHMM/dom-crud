import {
  stringToDomClasses,
  toKVSEntries,
  isValidDomsValue,
  Sign, getType
} from "./helpers";
import {readConfigByKey, _console} from "./config";

interface ISignHandler {
  (): void;
}

// creating dom not affected by signs:  class-=a is equal to class=a
// when dom and html exist at the same time, content will be added in order
function cdom(
  tagName: string,
  ...options: Array<string | Record<string, any>>
): HTMLElement {
  const $dom = document.createElement(tagName);
  let keyValSignEntries = toKVSEntries(options);
  keyValSignEntries.map(option => {
    const [key, val] = option;
    switch (key) {
      case "class":
        $dom.classList.add(...stringToDomClasses(val.toString()));
        break;
      case "style":
        $dom.style.cssText = val.toString();
        break;
      case "text":
        $dom.textContent = val.toString();
        break;
      case "html":
        $dom.innerHTML += val.toString();
        break;
      case "doms":
        _appendDoms($dom, val);
        break;
      default:
        $dom.setAttribute(key, val.toString());
        break;
    }
  });
  return $dom;
}

// you can chain rdom
function rdom<E extends Element = Element>(selector: string): E | null {
  const $dom = document.querySelector<E>(selector);
  // @ts-ignore
  $dom.rdom = $dom.querySelector;
  return $dom;
}
// rdoms cannot chain
function rdoms<E extends Element = Element>(selector: string): NodeListOf<E> {
  return document.querySelectorAll<E>(selector);
}

// when removing(-=), just write 'key-=' or {'key-':''}
// you can chain udom
function udom(
  $dom: HTMLElement,
  ...options: Array<string | Record<string, any>>
): HTMLElement {
  let keyValSignEntries = toKVSEntries(options);
  keyValSignEntries.map(option => {
    const [key, val, sign] = option;
    switch (key) {
      case "class":
        _udomBySign(
          sign,
          () => {
            $dom.className = "";
            $dom.classList.add(...stringToDomClasses(val.toString()));
          },
          () => {
            $dom.classList.add(...stringToDomClasses(val.toString()));
          },
          () => {
            $dom.classList.remove(...stringToDomClasses(val.toString()));
          }
        );
        break;
      case "style":
        _udomBySign(
          sign,
          () => {
            $dom.style.cssText = val.toString();
          },
          () => {
            $dom.style.cssText += val.toString();
          },
          () => {
            const styleProperties = val.toString().split(";");
            styleProperties.map((item: string) => {
              $dom.style.removeProperty(item);
            });
          }
        );
        break;
      case "text":
        _udomBySign(
          sign,
          () => {
            $dom.textContent = val.toString();
          },
          () => {
            $dom.textContent += val.toString();
          },
          () => {
            $dom.textContent = "";
          }
        );
        break;
      case "html":
        _udomBySign(
          sign,
          () => {
            $dom.innerHTML = val.toString();
          },
          () => {
            $dom.innerHTML += val.toString();
          },
          () => {
            $dom.innerHTML = "";
          }
        );
        break;
      case "doms":
        _udomBySign(
          sign,
          () => {
            $dom.innerHTML = "";
            _appendDoms($dom, val);
          },
          () => {
            const config = readConfigByKey("doms");
            if (config["+="].beforeScript) _appendDoms($dom, val, "script");
            else _appendDoms($dom, val);
          },
          () => {
            _removeDoms($dom, val);
          }
        );
        break;
      default:
        _udomBySign(
          sign,
          () => {
            $dom.setAttribute(key, val.toString());
          },
          () => {
            $dom.setAttribute(key, val.toString());
          },
          () => {
            $dom.removeAttribute(key);
          }
        );
    }
  });
  return $dom;
}

function ddom($dom: HTMLElement|null): boolean {
  if($dom instanceof Element) {
    $dom.remove();
    return true
  }
  else {
    _console.warn(`[dom-crud:ddom] you passed an invalid parameter(type is ${getType($dom)}), ddom removed nothing`)
    return false
  }
}

function _appendDoms(
  $container: Element,
  doms: unknown,
  beforeTag: "script" | Element | "" = ""
) {
  if (!isValidDomsValue(doms))
    throw new TypeError(
      `when key is 'doms', value should be array/array-like and from one of Element[], HTMLCollection, NodeList`
    );
  if (beforeTag && beforeTag === "script") {
    const $script = $container.querySelector("script");
    // @ts-ignore
    for (const dom of doms) {
      $container.insertBefore(dom, $script);
    }
  } else if (beforeTag && beforeTag instanceof Element) {
    // @ts-ignore
    for (const dom of doms) {
      $container.insertBefore(dom, beforeTag);
    }
  } else {
    // @ts-ignore
    for (const dom of doms) {
      $container.appendChild(dom);
    }
  }
}
function _removeDoms($container: Element, doms: unknown) {
  if (!isValidDomsValue(doms))
    throw new TypeError(
      `when key is 'doms', value should be array/array-like and from one of Element[], HTMLCollection, NodeList`
    );
  // @ts-ignore
  for (const dom of doms) {
    if (dom.parentNode == $container) dom.remove();
    else {
      _console.warn(
        `encountered a dom that is not a child dom, removing skipped`
      );
    }
  }
}
function _udomBySign(
  sign: Sign,
  overwriteHandler: ISignHandler,
  appendHandler: ISignHandler,
  removeHandler: ISignHandler
) {
  if (sign == "=") overwriteHandler();
  if (sign == "+=") appendHandler();
  if (sign == "-=") removeHandler();
}

export { cdom, rdom, rdoms, udom, ddom };
