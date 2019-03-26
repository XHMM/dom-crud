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
/*---------------------------------------------------------------------------------------------*/
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
    if (type === 'array')
        return val.every(function (item) { return (item instanceof Element); });
    else
        return type === "nodelist" || type === "htmlcollection";
}
// function _isValidTypeValue() ...
// function _isValidXxxValue() ...
function _stringToKVSEntry(str) {
    var res;
    if (str.includes("-=")) {
        var idx = str.indexOf("-=");
        res = [str.slice(0, idx).trim(), str.slice(idx + 2).trim(), "-="];
    }
    else if (str.includes("+=")) {
        var idx = str.indexOf("+=");
        res = [str.slice(0, idx).trim(), str.slice(idx + 2).trim(), "+="];
    }
    else if (str.includes("=")) {
        var idx = str.indexOf("=");
        res = [str.slice(0, idx).trim(), str.slice(idx + 1).trim(), "="];
    }
    // @ts-ignore
    if (res.length !== 3) {
        throw new Error("options item not match key=val or key-=val or key+=val");
    }
    // @ts-ignore
    return res;
}
function _objectToKVSEntry(obj) {
    var res = [];
    Object.entries(obj).map(function (item) {
        if (item[0].endsWith("-")) {
            res.push([item[0].slice(0, item[0].length - 1), item[1], "-="]);
        }
        else if (item[0].endsWith("+")) {
            res.push([item[0].slice(0, item[0].length - 1), item[1], "+="]);
        }
        else
            res.push([item[0], item[1], "="]);
    });
    return res;
}
// below function not deal with KVS's  V part, it should be dealt depend on key in cdom/udom
function toKVSEntries(options) {
    var e_1, _a;
    var res = [];
    try {
        for (var options_1 = __values(options), options_1_1 = options_1.next(); !options_1_1.done; options_1_1 = options_1.next()) {
            var option = options_1_1.value;
            if (getType(option) == "string") {
                res.push(_stringToKVSEntry(option));
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
// only merge attributes target exist
function merge(target, source) {
    var targetType = getType(target);
    var sourceType = getType(source);
    if (targetType !== 'object' || sourceType !== 'object')
        throw new TypeError("target and source should both be object, received: target is " + targetType + ", source is " + sourceType);
    for (var sourceKey in source) {
        if (source.hasOwnProperty(sourceKey)) {
            if (sourceKey in target) {
                var subTargetTypeIsObj = getType(target[sourceKey]) == 'object';
                var subSourceTypeIsObj = getType(source[sourceKey]) == 'object';
                if ((!subSourceTypeIsObj) && (!subTargetTypeIsObj)) {
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
    doms: {
        "+=": {
            beforeScript: false
        }
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
        console.log('%c[dom-crud:log][%s]\n %c%s', "color:#18b7ff;background:rgba(0,0,0,0.02);padding:0.2rem", methodName, "background:rgba(0,0,0,0.02);padding:0.2rem", msg);
    };
    _console.warn = function (methodName, msg) {
        console.log('%c[dom-crud:warn][%s]\n %c%s', "color:orange;background:rgba(0,0,0,0.02);padding:0.2rem", methodName, "background:rgba(0,0,0,0.02);padding:0.2rem", msg);
    };
    _console.error = function (methodName, msg) {
        console.log('%c[dom-crud:error][%s]\n %c%s', "color:red;background:rgba(0,0,0,0.02);padding:0.2rem", methodName, "background:rgba(0,0,0,0.02);padding:0.2rem", msg);
    };
}
var _crudConfigProxy = new Proxy(_crudConfig, {
    set: function (target, key, val) {
        if (key == 'debug') {
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
    if (type !== 'object')
        throw new TypeError("config should be an object, received type is " + type);
    merge(_crudConfigProxy, newConfig);
}
function readConfigByKey(key) {
    if (key in _crudConfig && _crudConfig.hasOwnProperty(key)) {
        // @ts-ignore
        return _crudConfig[key];
    }
    else
        throw new Error(key + " not exists in global curd config");
}

// creating dom not affected by signs:  class-=a is equal to class=a
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
        var _b = __read(option, 2), key = _b[0], val = _b[1];
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
        var _a = __read(option, 3), key = _a[0], val = _a[1], sign = _a[2];
        switch (key) {
            case "class":
                _udomBySign(sign, function () {
                    var _a;
                    $dom.className = "";
                    (_a = $dom.classList).add.apply(_a, __spread(stringToDomClasses(val.toString())));
                }, function () {
                    var _a;
                    (_a = $dom.classList).add.apply(_a, __spread(stringToDomClasses(val.toString())));
                }, function () {
                    var _a;
                    (_a = $dom.classList).remove.apply(_a, __spread(stringToDomClasses(val.toString())));
                });
                break;
            case "style":
                _udomBySign(sign, function () {
                    $dom.style.cssText = val.toString();
                }, function () {
                    $dom.style.cssText += val.toString();
                }, function () {
                    var styleProperties = val.toString().split(";");
                    styleProperties.map(function (item) {
                        $dom.style.removeProperty(item);
                    });
                });
                break;
            case "text":
                _udomBySign(sign, function () {
                    $dom.textContent = val.toString();
                }, function () {
                    $dom.textContent += val.toString();
                }, function () {
                    $dom.textContent = "";
                });
                break;
            case "html":
                _udomBySign(sign, function () {
                    $dom.innerHTML = val.toString();
                }, function () {
                    $dom.innerHTML += val.toString();
                }, function () {
                    $dom.innerHTML = "";
                });
                break;
            case "doms":
                _udomBySign(sign, function () {
                    $dom.innerHTML = "";
                    _appendDoms($dom, val);
                }, function () {
                    var config = readConfigByKey("doms");
                    if (config["+="].beforeScript)
                        _appendDoms($dom, val, "script");
                    else
                        _appendDoms($dom, val);
                }, function () {
                    _removeDoms($dom, val);
                });
                break;
            default:
                _udomBySign(sign, function () {
                    $dom.setAttribute(key, val.toString());
                }, function () {
                    $dom.setAttribute(key, val.toString());
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
        _console.warn('ddom', "you passed an invalid parameter(type is " + getType($dom) + "), ddom removed nothing");
        return false;
    }
}
function _appendDoms($container, doms, beforeTag) {
    if (beforeTag === void 0) { beforeTag = ""; }
    var e_1, _a, e_2, _b, e_3, _c;
    if (!isValidDomsValue(doms))
        throw new TypeError("when key is 'doms', value should be array/array-like and from one of Element[], HTMLCollection, NodeList");
    if (beforeTag && beforeTag === "script") {
        var $script = $container.querySelector("script");
        try {
            // @ts-ignore
            for (var doms_1 = __values(doms), doms_1_1 = doms_1.next(); !doms_1_1.done; doms_1_1 = doms_1.next()) {
                var dom = doms_1_1.value;
                $container.insertBefore(dom, $script);
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
    else if (beforeTag && beforeTag instanceof Element) {
        try {
            // @ts-ignore
            for (var doms_2 = __values(doms), doms_2_1 = doms_2.next(); !doms_2_1.done; doms_2_1 = doms_2.next()) {
                var dom = doms_2_1.value;
                $container.insertBefore(dom, beforeTag);
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
    else {
        try {
            // @ts-ignore
            for (var doms_3 = __values(doms), doms_3_1 = doms_3.next(); !doms_3_1.done; doms_3_1 = doms_3.next()) {
                var dom = doms_3_1.value;
                $container.appendChild(dom);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (doms_3_1 && !doms_3_1.done && (_c = doms_3.return)) _c.call(doms_3);
            }
            finally { if (e_3) throw e_3.error; }
        }
    }
}
function _removeDoms($container, doms) {
    var e_4, _a;
    if (!isValidDomsValue(doms))
        throw new TypeError("when key is 'doms', value should be array/array-like and from one of Element[], HTMLCollection, NodeList");
    try {
        // @ts-ignore
        for (var doms_4 = __values(doms), doms_4_1 = doms_4.next(); !doms_4_1.done; doms_4_1 = doms_4.next()) {
            var dom = doms_4_1.value;
            if (dom.parentNode == $container)
                dom.remove();
            else {
                _console.warn('_removeDoms', "encountered a dom that is not a child dom, removing skipped");
            }
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (doms_4_1 && !doms_4_1.done && (_a = doms_4.return)) _a.call(doms_4);
        }
        finally { if (e_4) throw e_4.error; }
    }
}
function _udomBySign(sign, overwriteHandler, appendHandler, removeHandler) {
    if (sign == "=")
        overwriteHandler();
    if (sign == "+=")
        appendHandler();
    if (sign == "-=")
        removeHandler();
}

export { cdom, ddom, getCrudConfig, rdom, rdoms, udom, updateCrudConfig };
