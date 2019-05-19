/* eslint-disable compat/compat */
if (!Object.entries)
    Object.entries = function (obj) {
        var ownProps = Object.keys(obj), i = ownProps.length, resArray = new Array(i); // preallocate the Array
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];
        return resArray;
    };

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

// export type ValidTypeValue = xx
// export type ValidXxxValue = xx
/*----------------------------------------------------------------------------*/
// return type string: array string function null...
function getType(val) {
    var rightPart = Object.prototype.toString.call(val).split(" ")[1];
    return rightPart.slice(0, rightPart.length - 1).toLowerCase();
}
/*
 * class name cannot contain space
 * ' a b c'  ===> ['a', 'b', 'c']
 * */
function stringToDomClasses(str) {
    return str
        .trim()
        .split(" ")
        .filter(function (item) { return item !== ""; });
}
function isValidDomsValue(val) {
    var type = getType(val);
    if (type === "array")
        return val.every(function (item) { return item instanceof Element; });
    else
        return type === "nodelist" || type === "htmlcollection";
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
function _stringToKVSCEntry(str) {
    var res;
    var sign = "";
    if (str.includes("-=")) {
        sign = "-=";
    }
    else if (str.includes("+=")) {
        sign = "+=";
    }
    else if (str.includes("==")) {
        sign = "==";
    }
    if (sign) {
        var idx = str.indexOf(sign);
        var k = str.slice(0, idx).trim();
        var vc = _vcStringToObject(str.slice(idx + 2));
        res = [k, vc.v, sign, vc.c];
        if (res.length !== 4) {
            throw new Error("options item format not correct");
        }
        else
            return res;
    }
    else {
        throw new Error("options item format not correct");
    }
}
function _objectToKVSEntry(obj) {
    var res = [];
    try {
        Object.entries(obj).map(function (item) {
            var key = item[0];
            var value = item[1];
            var sign = "";
            if (key.endsWith("-=")) {
                sign = "-=";
            }
            else if (key.endsWith("+=")) {
                sign = "+=";
            }
            else if (key.endsWith("==")) {
                sign = "==";
            }
            if (sign) {
                var k = key.match(/.+(?=[-+=]=)/)[0];
                var v = void 0, c = void 0;
                var valueType = getType(value);
                if (valueType === "string") {
                    var vc = _vcStringToObject(value);
                    v = vc.v;
                    c = vc.c;
                }
                else if (valueType === "object") {
                    if (!value.value) {
                        throw new Error("options item format not correct");
                    }
                    v = value.value;
                    c = value.config || {};
                }
                else {
                    // eg: {'doms+=': [xx, xx] }
                    v = value;
                    c = {};
                }
                res.push([k, v, sign, c]);
            }
            else {
                throw new Error("options item format not correct");
            }
        });
        return res;
    }
    catch (e) {
        throw e;
    }
}
function _vcStringToObject(str) {
    var v = "", c = {};
    var vc = str.trim().match(/(.*)\?([0-9a-zA-Z&=]*)/); // 不能写成 /(.+) .../  因为当value传入了空内容时会导致匹配出错
    // 为null表示没有配置项
    if (vc === null) {
        v = str;
    }
    else if (vc && vc.length === 3) {
        v = vc[1];
        c = vc[2].split("&").reduce(function (acc, cur) {
            var arr = cur.split("=");
            var value;
            if (arr[1] === "true")
                value = true;
            else if (arr[1] === "false")
                value = false;
            else if (arr[1].match(/[0-9]+/g))
                value = +arr[1];
            else
                acc[arr[0]] = arr[1];
            return acc;
        }, {});
    }
    return {
        v: v,
        c: c
    };
}
// below function not deal with KVS's  V part, it should be dealt depend on key in cdom/udom
function toKVSEntries(options) {
    var e_1, _a;
    var res = [];
    try {
        for (var options_1 = __values(options), options_1_1 = options_1.next(); !options_1_1.done; options_1_1 = options_1.next()) {
            var option = options_1_1.value;
            if (getType(option) == "string") {
                res.push(_stringToKVSCEntry(option));
            }
            else if (getType(option) == "object") {
                res.push.apply(res, __spread(_objectToKVSEntry(option)));
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (options_1_1 && !options_1_1.done && (_a = options_1.return)) _a.call(options_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return res;
}
// merge attributes if target and source both have
function merge(target, source) {
    var targetType = getType(target);
    var sourceType = getType(source);
    if (targetType !== "object" || sourceType !== "object")
        throw new TypeError("target and source should both be object, received: target is " + targetType + ", source is " + sourceType);
    for (var sourceKey in source) {
        if (source.hasOwnProperty(sourceKey)) {
            if (sourceKey in target) {
                var subTargetTypeIsObj = getType(target[sourceKey]) == "object";
                var subSourceTypeIsObj = getType(source[sourceKey]) == "object";
                if (!subSourceTypeIsObj && !subTargetTypeIsObj) {
                    target[sourceKey] = source[sourceKey];
                }
                else if (subTargetTypeIsObj && subSourceTypeIsObj) {
                    merge(target[sourceKey], source[sourceKey]);
                }
            }
        }
    }
}

// this object must have at most two level depth, must can to be a  valid JSON
var _crudConfig = {
    text: {
        pureText: false
    },
    debug: false
};
// todo: add more debug info for apis
// @ts-ignore
var _console = {};
function _muteConsole() {
    _console.log = function () { };
    _console.warn = function () { };
    _console.error = function () { };
}
function _activateConsole() {
    _console.log = function (methodName, msg) {
        console.log("%c[dom-crud:log][%s]\n %c%s", "color:#18b7ff;background:rgba(0,0,0,0.02);padding:0.2rem", methodName, "background:rgba(0,0,0,0.02);padding:0.2rem", msg);
    };
    _console.warn = function (methodName, msg) {
        console.log("%c[dom-crud:warn][%s]\n %c%s", "color:orange;background:rgba(0,0,0,0.02);padding:0.2rem", methodName, "background:rgba(0,0,0,0.02);padding:0.2rem", msg);
    };
    _console.error = function (methodName, msg) {
        console.log("%c[dom-crud:error][%s]\n %c%s", "color:red;background:rgba(0,0,0,0.02);padding:0.2rem", methodName, "background:rgba(0,0,0,0.02);padding:0.2rem", msg);
    };
}
var _crudConfigProxy = new Proxy(_crudConfig, {
    set: function (target, key, val) {
        if (key == "debug") {
            if (val == false) {
                _muteConsole();
            }
            else {
                _activateConsole();
            }
        }
        // @ts-ignore
        target[key] = val;
        return true;
    }
});
// debug is false default, so need to call this manually to mute _console
_muteConsole();
function getCrudConfig() {
    return JSON.parse(JSON.stringify(_crudConfigProxy));
}
function updateCrudConfig(newConfig) {
    var type = getType(newConfig);
    if (type !== "object")
        throw new TypeError("config should be an object, received type is " + type);
    merge(_crudConfigProxy, newConfig);
}
function readConfigByKey(key) {
    if (key in _crudConfig && _crudConfig.hasOwnProperty(key)) {
        // @ts-ignore
        return _crudConfig[key];
    }
    else
        throw new Error(key + " not exists in global crud config");
}

// creating dom not affected by signs
// when dom and html exist at the same time, content will be added in order
function cdom(tagName) {
    var options = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        options[_i - 1] = arguments[_i];
    }
    var $dom = document.createElement(tagName);
    var keyValSignEntries = toKVSEntries(options);
    keyValSignEntries.map(function (option) {
        var _a;
        var _b = __read(option, 4), key = _b[0], val = _b[1], sign = _b[2], config = _b[3];
        switch (key) {
            case "class":
                (_a = $dom.classList).add.apply(_a, __spread(stringToDomClasses(val.toString())));
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
function rdom(selector) {
    var $dom = document.querySelector(selector);
    if ($dom) {
        // @ts-ignore
        $dom.rdom = $dom.querySelector;
        return $dom;
    }
    return null;
}
// rdoms cannot chain
function rdoms(selector) {
    return document.querySelectorAll(selector);
}
// when removing(-=), just write 'key-=' or {'key-':''}
// you can chain udom
function udom($dom) {
    var options = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        options[_i - 1] = arguments[_i];
    }
    var keyValSignEntries = toKVSEntries(options);
    keyValSignEntries.map(function (option) {
        var _a = __read(option, 4), key = _a[0], value = _a[1], sign = _a[2], config = _a[3];
        switch (key) {
            case "class":
                _udomBySign(sign, function () {
                    var _a;
                    $dom.className = "";
                    (_a = $dom.classList).add.apply(_a, __spread(stringToDomClasses(value.toString())));
                }, function () {
                    var _a;
                    (_a = $dom.classList).add.apply(_a, __spread(stringToDomClasses(value.toString())));
                }, function () {
                    var _a;
                    (_a = $dom.classList).remove.apply(_a, __spread(stringToDomClasses(value.toString())));
                });
                break;
            case "style":
                _udomBySign(sign, function () {
                    $dom.style.cssText = value.toString();
                }, function () {
                    $dom.style.cssText += value.toString();
                }, function () {
                    var styleProperties = value.toString().split(";");
                    styleProperties.map(function (item) {
                        $dom.style.removeProperty(item);
                    });
                });
                break;
            case "text":
                var isPureText_1 = "pureTex" in config ? config.pureText : readConfigByKey("text").pureText;
                _udomBySign(sign, function () {
                    if (isPureText_1)
                        $dom.firstChild.data = value.toString();
                    else
                        $dom.textContent = value.toString();
                }, function () {
                    if (isPureText_1)
                        $dom.firstChild.data += value.toString();
                    else
                        $dom.textContent += value.toString();
                }, function () {
                    if (isPureText_1)
                        $dom.firstChild.data = "";
                    else
                        $dom.textContent = "";
                });
                break;
            case "html":
                _udomBySign(sign, function () {
                    $dom.innerHTML = value.toString();
                }, function () {
                    $dom.innerHTML += value.toString();
                }, function () {
                    $dom.innerHTML = "";
                });
                break;
            case "doms":
                _udomBySign(sign, function () {
                    $dom.innerHTML = "";
                    _appendDoms($dom, value, null);
                }, function () {
                    console.log(config);
                    _appendDoms($dom, value, config.before || null);
                }, function () {
                    _removeDoms($dom, value);
                });
                break;
            default:
                _udomBySign(sign, function () {
                    $dom.setAttribute(key, value.toString());
                }, function () {
                    $dom.setAttribute(key, value.toString());
                }, function () {
                    $dom.removeAttribute(key);
                });
        }
    });
    return $dom;
}
function ddom($dom) {
    if ($dom instanceof Element) {
        $dom.remove();
        return true;
    }
    else {
        _console.warn("ddom", "you passed an invalid parameter(type is " + getType($dom) + "), ddom removed nothing");
        return false;
    }
}
function _appendDoms($container, doms, beforeElement) {
    var e_1, _a, e_2, _b;
    if (!isValidDomsValue(doms))
        throw new TypeError("when key is 'doms', value should be array/array-like and from one of Element[], HTMLCollection, NodeList");
    if (beforeElement && beforeElement instanceof Element) {
        if (!$container.contains(beforeElement))
            throw new Error("beForeElement not exist in containerElement");
        try {
            // @ts-ignore
            for (var doms_1 = __values(doms), doms_1_1 = doms_1.next(); !doms_1_1.done; doms_1_1 = doms_1.next()) {
                var dom = doms_1_1.value;
                $container.insertBefore(dom, beforeElement);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (doms_1_1 && !doms_1_1.done && (_a = doms_1.return)) _a.call(doms_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    else {
        try {
            // @ts-ignore
            for (var doms_2 = __values(doms), doms_2_1 = doms_2.next(); !doms_2_1.done; doms_2_1 = doms_2.next()) {
                var dom = doms_2_1.value;
                $container.appendChild(dom);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (doms_2_1 && !doms_2_1.done && (_b = doms_2.return)) _b.call(doms_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
}
function _removeDoms($container, doms) {
    var e_3, _a;
    if (!isValidDomsValue(doms))
        throw new TypeError("when key is 'doms', value should be array/array-like and from one of Element[], HTMLCollection, NodeList");
    try {
        // @ts-ignore
        for (var doms_3 = __values(doms), doms_3_1 = doms_3.next(); !doms_3_1.done; doms_3_1 = doms_3.next()) {
            var dom = doms_3_1.value;
            if (dom.parentNode == $container)
                dom.remove();
            else {
                _console.warn("_removeDoms", "encountered a dom that is not a child dom, removing skipped");
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (doms_3_1 && !doms_3_1.done && (_a = doms_3.return)) _a.call(doms_3);
        }
        finally { if (e_3) throw e_3.error; }
    }
}
function _udomBySign(sign, overwriteHandler, appendHandler, removeHandler) {
    if (sign == "==")
        overwriteHandler();
    if (sign == "+=")
        appendHandler();
    if (sign == "-=")
        removeHandler();
}

export { cdom, ddom, getCrudConfig, rdom, rdoms, udom, updateCrudConfig };
