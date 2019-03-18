/*
* split string and get its sign
*
* 'class-=a b c' ===>  ['class','a b c', '-=']
*
* */
function _splitBySign(str) {
    var res = [];
    if (str.includes('-=')) {
        var idx = str.indexOf('-=');
        res = [str.slice(0, idx).trim(), str.slice(idx + 2).trim(), '-='];
    }
    else if (str.includes('+=')) {
        var idx = str.indexOf('+=');
        res = [str.slice(0, idx).trim(), str.slice(idx + 2).trim(), '+='];
    }
    else if (str.includes('=')) {
        var idx = str.indexOf('=');
        res = [str.slice(0, idx).trim(), str.slice(idx + 1).trim(), '='];
    }
    if (res.length !== 3)
        throw new Error('options item not match key=val or key-=val or key+=val');
    return res;
}
// return type string: array string function null...
function _type(val) {
    var rightPart = Object.prototype.toString.call(val).split(' ')[1];
    return rightPart.slice(0, rightPart.length - 1).toLowerCase();
}
// ' a b c'  ===> ['a', 'b', 'c']
function _splitToDomClasses(str) {
    return str.trim().split(' ').filter(function (item) { return item !== ''; });
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
function _toKeyValSignEntries(options) {
    var res = [];
    for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
        var option = options_1[_i];
        if (_type(option) == 'string') {
            res.push(_splitBySign(option));
        }
        else if (_type(option) == 'object') {
            Object.entries(option).map(function (item) {
                if (item[0].endsWith('-')) {
                    res.push([item[0].slice(0, item[0].length - 1), item[1].toString().trim(), '-=']);
                }
                else if (item[0].endsWith('+')) {
                    res.push([item[0].slice(0, item[0].length - 1), item[1].toString().trim(), '+=']);
                }
                else
                    res.push([item[0], item[1].toString().trim(), '=']);
            });
        }
    }
    return res;
}

// creating dom not affected by signs:  class-=a is equal to class=a
function cdom(tagName) {
    var options = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        options[_i - 1] = arguments[_i];
    }
    var $dom = document.createElement(tagName);
    var keyValSignEntries = _toKeyValSignEntries(options);
    keyValSignEntries.map(function (option) {
        var _a;
        var key = option[0], val = option[1];
        if (key === "class")
            (_a = $dom.classList).add.apply(_a, _splitToDomClasses(val));
        else if (key === "style")
            $dom.style.cssText = val;
        else if (key === "text")
            $dom.textContent = val;
        else if (key === "html")
            $dom.innerHTML = val;
        else {
            $dom.setAttribute(key, val);
        }
    });
    return $dom;
}
// you can chain rdom
function rdom(selector) {
    var $dom = document.querySelector(selector);
    // @ts-ignore
    $dom.rdom = $dom.querySelector;
    return $dom;
}
function udom($dom) {
    var options = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        options[_i - 1] = arguments[_i];
    }
    var keyValSignEntries = _toKeyValSignEntries(options);
    keyValSignEntries.map(function (option) {
        var _a, _b, _c;
        var key = option[0], val = option[1], sign = option[2];
        if (key === "class") {
            if (sign == "-=") {
                (_a = $dom.classList).remove.apply(_a, _splitToDomClasses(val));
            }
            if (sign == "+=")
                (_b = $dom.classList).add.apply(_b, _splitToDomClasses(val));
            if (sign == "=") {
                $dom.className = "";
                (_c = $dom.classList).add.apply(_c, _splitToDomClasses(val));
            }
        }
        else if (key === "style") {
            // if remove class, options should not include right value, for example: 'style-=color;font-size;' or {'style-': 'color;font-size'}
            // if right value exists, it doesn't affect remove op
            if (sign == "-=") {
                var styleProperties = val.split(";");
                styleProperties.map(function (item) {
                    $dom.style.removeProperty(item);
                });
            }
            if (sign == "+=")
                $dom.style.cssText += val;
            if (sign == "=") {
                $dom.style.cssText = val;
            }
        }
        else if (key === "text") {
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
        }
        else if (key === "html") {
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
        }
        else {
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
