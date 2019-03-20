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

// below all all **pure functions**
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

// we call xx=aa xx-=aa xx+=aa xx-= xx+= xx= KVS string
// we call [xx, yy, sign] KVS entry
function _isValidDomsValue(val) {
    var type = getType(val);
    return type === "array" || type === "nodelist" || type === "htmlcollection";
}
// function _isValidTypeValue() ...
// function _isValidXxxValue() ...
function _stringToKVSEntry(str) {
    var res = [];
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
    if (res.length !== 3) {
        throw new Error("options item not match key=val or key-=val or key+=val");
    }
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
function appendDoms($container, doms) {
    var e_2, _a;
    if (!_isValidDomsValue(doms))
        throw new TypeError("when key is 'doms', value should be array/array-like and from one of Element[], HTMLCollection, NodeList");
    try {
        for (var doms_1 = __values(doms), doms_1_1 = doms_1.next(); !doms_1_1.done; doms_1_1 = doms_1.next()) {
            var dom = doms_1_1.value;
            $container.appendChild(dom);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (doms_1_1 && !doms_1_1.done && (_a = doms_1.return)) _a.call(doms_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
}
function removeDoms($container, doms) {
    var e_3, _a;
    if (!_isValidDomsValue(doms))
        throw new TypeError("when key is 'doms', value should be array/array-like and from one of Element[], HTMLCollection, NodeList");
    try {
        for (var doms_2 = __values(doms), doms_2_1 = doms_2.next(); !doms_2_1.done; doms_2_1 = doms_2.next()) {
            var dom = doms_2_1.value;
            if (dom.parentNode == $container)
                dom.remove();
            else {
                console.warn("encountered a dom that is not a child dom, removing skipped");
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (doms_2_1 && !doms_2_1.done && (_a = doms_2.return)) _a.call(doms_2);
        }
        finally { if (e_3) throw e_3.error; }
    }
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
function rdom(selector) {
    var $dom = document.querySelector(selector);
    // @ts-ignore
    $dom.rdom = $dom.querySelector;
    return $dom;
}
// when removing(-=), just write 'key-=' or {'key-':''}
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
                _updateWithSigns(sign, function () {
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
                _updateWithSigns(sign, function () {
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
                _updateWithSigns(sign, function () {
                    $dom.textContent = val.toString();
                }, function () {
                    $dom.textContent += val.toString();
                }, function () {
                    $dom.textContent = "";
                });
                break;
            case "html":
                _updateWithSigns(sign, function () {
                    $dom.innerHTML = val.toString();
                }, function () {
                    $dom.innerHTML += val.toString();
                }, function () {
                    $dom.innerHTML = "";
                });
                break;
            case "doms":
                _updateWithSigns(sign, function () {
                    $dom.innerHTML = "";
                    appendDoms($dom, val);
                }, function () {
                    appendDoms($dom, val);
                }, function () {
                    removeDoms($dom, val);
                });
                break;
            default:
                _updateWithSigns(sign, function () {
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
    $dom.remove();
}
function _updateWithSigns(sign, overwriteHandler, appendHandler, removeHandler) {
    if (sign == "=")
        overwriteHandler();
    if (sign == "+=")
        appendHandler();
    if (sign == "-=")
        removeHandler();
}

export { cdom, rdom, udom, ddom };
