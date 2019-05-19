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

// creating dom not affected by signs
// when dom and html exist at the same time, content will be added in order
function cdom(
  tagName: string,
  ...options: Array<string | Record<string, any>>
): HTMLElement {
  const $dom = document.createElement(tagName);
  let keyValSignEntries = toKVSEntries(options);
  keyValSignEntries.map(option => {
    const [key, val, sign, config] = option;
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
        $dom.innerHTML = val.toString();
        break;
      case "doms":
        _appendDoms($dom, val, null);
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
  if($dom) {
    // @ts-ignore
    $dom.rdom = $dom.querySelector;
    return $dom;
  }
  return null;
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
    const [key, value, sign, config] = option;
    switch (key) {
      case "class":
        _udomBySign(
          sign,
          () => {
            $dom.className = "";
            $dom.classList.add(...stringToDomClasses(value.toString()));
          },
          () => {
            $dom.classList.add(...stringToDomClasses(value.toString()));
          },
          () => {
            $dom.classList.remove(...stringToDomClasses(value.toString()));
          }
        );
        break;
      case "style":
        _udomBySign(
          sign,
          () => {
            $dom.style.cssText = value.toString();
          },
          () => {
            $dom.style.cssText += value.toString();
          },
          () => {
            const styleProperties = value.toString().split(";");
            styleProperties.map((item: string) => {
              $dom.style.removeProperty(item);
            });
          }
        );
        break;
      case "text":
        const isPureText = ('pureTex' in config) ?config.pureText : readConfigByKey('text').pureText;
        _udomBySign(
          sign,
          () => {
            if(isPureText)
              ($dom.firstChild! as Text).data = value.toString();
            else
              $dom.textContent = value.toString();
          },
          () => {
            if(isPureText)
              ($dom.firstChild! as Text).data += value.toString();
            else
              $dom.textContent += value.toString();
          },
          () => {
            if(isPureText)
              ($dom.firstChild! as Text).data = '';
            else
              $dom.textContent = '';
          }
        );
        break;
      case "html":
        _udomBySign(
          sign,
          () => {
            $dom.innerHTML = value.toString();
          },
          () => {
            $dom.innerHTML += value.toString();
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
            _appendDoms($dom, value, null);
          },
          () => {
            console.log(config)
            _appendDoms($dom, value, config.before || null);
          },
          () => {
            _removeDoms($dom, value);
          }
        );
        break;
      default:
        _udomBySign(
          sign,
          () => {
            $dom.setAttribute(key, value.toString());
          },
          () => {
            $dom.setAttribute(key, value.toString());
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
    _console.warn('ddom',`you passed an invalid parameter(type is ${getType($dom)}), ddom removed nothing`)
    return false
  }
}

function _appendDoms(
  $container: Element,
  doms: unknown,
  beforeElement: Element | null
) {
  if (!isValidDomsValue(doms))
    throw new TypeError(
      `when key is 'doms', value should be array/array-like and from one of Element[], HTMLCollection, NodeList`
    );
  if (beforeElement && beforeElement instanceof Element) {
    if(!$container.contains(beforeElement)) throw new Error('beForeElement not exist in containerElement')
    // @ts-ignore
    for (const dom of doms) {
      $container.insertBefore(dom, beforeElement);
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
      _console.warn('_removeDoms',`encountered a dom that is not a child dom, removing skipped`);
    }
  }
}
function _udomBySign(
  sign: Sign,
  overwriteHandler: ISignHandler,
  appendHandler: ISignHandler,
  removeHandler: ISignHandler
) {
  if (sign == "==") overwriteHandler();
  if (sign == "+=") appendHandler();
  if (sign == "-=") removeHandler();
}

export { cdom, rdom, rdoms, udom, ddom };
