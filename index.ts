import { stringToDomClasses } from "./helpers";
import {toKVSEntries, appendDoms, removeDoms} from "./utils";

// creating dom not affected by signs:  class-=a is equal to class=a
// when dom and html exist at the same time, content will be added in order
function cdom(tagName: string, ...options) {
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
        appendDoms($dom, val);
        break;
      default:
        $dom.setAttribute(key, val.toString());
        break;
    }
  });
  return $dom;
}

// you can chain rdom
function rdom(selector: string) {
  const $dom = document.querySelector(selector);
  // @ts-ignore
  $dom.rdom = $dom.querySelector;
  return $dom;
}
// rdoms cannot chain
function rdoms(selector: string) {
  return document.querySelectorAll(selector);
}

// when removing(-=), just write 'key-=' or {'key-':''}
function udom($dom, ...options) {
  let keyValSignEntries = toKVSEntries(options);
  keyValSignEntries.map(option => {
    const [key, val, sign] = option;
    switch (key) {
      case "class":
        _updateWithSigns(
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
        _updateWithSigns(
          sign,
          () => {
            $dom.style.cssText = val.toString();
          },
          () => {
            $dom.style.cssText += val.toString();
          },
          () => {
            const styleProperties = val.toString().split(";");
            styleProperties.map(item => {
              $dom.style.removeProperty(item);
            });
          }
        );
        break;
      case "text":
        _updateWithSigns(
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
        _updateWithSigns(
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
        _updateWithSigns(
          sign,
          () => {
            $dom.innerHTML = "";
            appendDoms($dom, val);
          },
          () => {
            appendDoms($dom, val);
          },
          () => {
            removeDoms($dom, val)
          }
        );
        break;
      default:
        _updateWithSigns(
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

function ddom($dom) {
  $dom.remove();
}

function _updateWithSigns(
  sign,
  overwriteHandler,
  appendHandler,
  removeHandler
) {
  if (sign == "=") overwriteHandler();
  if (sign == "+=") appendHandler();
  if (sign == "-=") removeHandler();
}
export { cdom, rdom, rdoms, udom, ddom };
