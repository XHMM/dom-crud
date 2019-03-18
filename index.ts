import { _toKeyValSignEntries, _splitToDomClasses } from "./utils";

// creating dom not affected by signs:  class-=a is equal to class=a
function cdom(tagName: string, ...options) {
  const $dom = document.createElement(tagName);
  let keyValSignEntries = _toKeyValSignEntries(options);
  keyValSignEntries.map(option => {
    const [key, val] = option;
    if (key === "class") $dom.classList.add(..._splitToDomClasses(val));
    else if (key === "style") $dom.style.cssText = val;
    else if (key === "text") $dom.textContent = val;
    else if (key === "html") $dom.innerHTML = val;
    else {
      $dom.setAttribute(key, val);
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

function udom($dom, ...options) {
  let keyValSignEntries = _toKeyValSignEntries(options);
  keyValSignEntries.map(option => {
    const [key, val, sign] = option;
    if (key === "class") {
      if (sign == "-=") {
        $dom.classList.remove(..._splitToDomClasses(val));
      }
      if (sign == "+=") $dom.classList.add(..._splitToDomClasses(val));
      if (sign == "=") {
        $dom.className = "";
        $dom.classList.add(..._splitToDomClasses(val));
      }
    } else if (key === "style") {
      // if remove class, options should not include right value, for example: 'style-=color;font-size;' or {'style-': 'color;font-size'}
      // if right value exists, it doesn't affect remove op
      if (sign == "-=") {
        const styleProperties = val.split(";");
        styleProperties.map(item => {
          $dom.style.removeProperty(item);
        });
      }
      if (sign == "+=") $dom.style.cssText += val;
      if (sign == "=") {
        $dom.style.cssText = val;
      }
    } else if (key === "text") {
      // if remove text, it's like style above, for example: 'text-=' or {'text-': ''}
      if (sign == "-=") {
        $dom.textContent = "";
      }
      if (sign == "+=") {
        $dom.textContent += val;
      }
      if (sign == "=") {
        $dom.textContent = val;
      }
    } else if (key === "html") {
      // same as style and text when removing html
      if (sign == "-=") {
        $dom.innerHTML = "";
      }
      if (sign == "+=") {
        $dom.innerHTML += val;
      }
      if (sign == "=") {
        $dom.innerHTML = val;
      }
    } else {
      if (sign == "-=") {
        $dom.removeAttribute(key);
      }
      if (sign == "+=") {
        $dom.setAttribute(key, val);
      }
      if (sign == "=") {
        $dom.setAttribute(key, val);
      }
    }
  });
  return $dom;
}

function ddom($dom) {
  $dom.remove();
}

export { cdom, rdom, udom, ddom };
