/* eslint-disable no-unsanitized/property */
import { stringToDomClasses, toKVSEntries, isValidDomsValue, Sign, getType } from './helpers';
import { readConfigByKey } from './config';
import logger from './logger';

interface ISignHandler {
  (): void;
}
interface IWithRDom {
  rdom: typeof rdom;
}
interface IWithUDom {
  rdom: typeof rdom;
}
interface IWithDDom {
  rdom: typeof rdom;
}

function cdom<E extends HTMLElement = HTMLElement>(
  tagName: string,
  ...options: Array<string | Record<string, any>>
): E {
  const $dom = document.createElement(tagName);
  let keyValSignEntries = toKVSEntries(options);
  keyValSignEntries.map(option => {
    const [key, val] = option;
    switch (key) {
      case 'class':
        $dom.classList.add(...stringToDomClasses(val.toString()));
        break;
      case 'style':
        $dom.style.cssText = val.toString();
        break;
      case 'text':
        $dom.textContent = val.toString();
        break;
      case 'html':
        $dom.innerHTML = val.toString();
        break;
      case 'doms':
        _appendDoms($dom, val, null);
        break;
      default:
        $dom.setAttribute(key, val.toString());
        break;
    }
  });
  return $dom as E;
}

function rdom<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] & IWithRDom | null;
function rdom<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] & IWithRDom | null;
function rdom<E extends Element = Element>(selectors: string): E & IWithRDom | null;
function rdom(selector: any): any {
  const $dom = document.querySelector(selector);
  if ($dom) {
    $dom.rdom = $dom.querySelector;
    return $dom;
  }
  return null;
}

function rdoms<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
function rdoms<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
function rdoms<E extends Element = Element>(selectors: string): NodeListOf<E>;
function rdoms(selector: any): any {
  return document.querySelectorAll(selector);
}

function udom($dom: HTMLElement, ...options: Array<string | Record<string, any>>): void {
  let keyValSignEntries = toKVSEntries(options);
  keyValSignEntries.map(option => {
    const [key, value, sign, config] = option;
    switch (key) {
      case 'class':
        _udomBySign(
          sign,
          () => {
            $dom.className = '';
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
      case 'style':
        _udomBySign(
          sign,
          () => {
            $dom.style.cssText = value.toString();
          },
          () => {
            $dom.style.cssText += value.toString();
          },
          () => {
            const styleProperties = value.toString().split(';');
            styleProperties.map((item: string) => {
              $dom.style.removeProperty(item);
            });
          }
        );
        break;
      case 'text':
        const isPureText = 'pureTex' in config ? config.pureText : readConfigByKey('text').pureText;
        _udomBySign(
          sign,
          () => {
            if (isPureText) ($dom.firstChild! as Text).data = value.toString();
            else $dom.textContent = value.toString();
          },
          () => {
            if (isPureText) ($dom.firstChild! as Text).data += value.toString();
            else $dom.textContent += value.toString();
          },
          () => {
            if (isPureText) ($dom.firstChild! as Text).data = '';
            else $dom.textContent = '';
          }
        );
        break;
      case 'html':
        _udomBySign(
          sign,
          () => {
            $dom.innerHTML = value.toString();
          },
          () => {
            $dom.innerHTML += value.toString();
          },
          () => {
            $dom.innerHTML = '';
          }
        );
        break;
      case 'doms':
        _udomBySign(
          sign,
          () => {
            $dom.innerHTML = '';
            _appendDoms($dom, value, null);
          },
          () => {
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
}

function ddom($dom: HTMLElement | null): boolean {
  if ($dom instanceof Element) {
    $dom.remove();
    return true;
  } else {
    logger.warn('ddom', `you passed an invalid parameter(type is ${getType($dom)}), ddom removed nothing`);
    return false;
  }
}

function _appendDoms(
  $container: Element,
  doms: Element[] | HTMLCollection | NodeList,
  beforeElement: Element | null
): void {
  if (!isValidDomsValue(doms))
    throw new TypeError(
      `when key is 'doms', value should be array/array-like and from one of Element[], HTMLCollection, NodeList`
    );
  if (beforeElement && beforeElement instanceof Element) {
    if (!$container.contains(beforeElement)) throw new Error('beForeElement not exist in containerElement');
    for (const dom of doms) {
      $container.insertBefore(dom, beforeElement);
    }
  } else {
    for (const dom of doms) {
      $container.appendChild(dom);
    }
  }
}
function _removeDoms($container: Element, doms: Element[] | HTMLCollection | NodeList): void {
  if (!isValidDomsValue(doms))
    throw new TypeError(
      `when key is 'doms', value should be array/array-like and from one of Element[], HTMLCollection, NodeList`
    );
  for (const dom of doms) {
    if (dom.parentNode == $container) dom.remove();
    else {
      logger.warn('_removeDoms', `encountered a dom that is not a child dom, removing skipped`);
    }
  }
}
function _udomBySign(
  sign: Sign,
  overwriteHandler: ISignHandler,
  appendHandler: ISignHandler,
  removeHandler: ISignHandler
): void {
  if (sign == '==') overwriteHandler();
  if (sign == '+=') appendHandler();
  if (sign == '-=') removeHandler();
}

export { cdom, rdom, rdoms, udom, ddom };
