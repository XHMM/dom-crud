// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.ts":[function(require,module,exports) {
var define;
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (factory) {
  if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports"], factory);
  }
})(function (require, exports) {
  "use strict"; // 创建dom，不受sign影响，即class-=a 等同于class=a

  function cdom(tagName) {
    var options = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      options[_i - 1] = arguments[_i];
    }

    var $dom = document.createElement(tagName);

    var keyValSignEntries = _toKeyValSignEntries(options);

    keyValSignEntries.map(function (option) {
      var _a;

      var key = option[0],
          val = option[1];
      if (key === 'class') (_a = $dom.classList).add.apply(_a, _splitToDomClasses(val));else if (key === 'style') $dom.style.cssText = val;else if (key === 'text') $dom.textContent = val;else if (key === 'html') $dom.innerHTML = val;else {
        $dom.setAttribute(key, val);
      }
    });
    return $dom;
  }

  function rdom(selector) {
    return document.querySelector(selector);
  }

  function rdoms(selector) {
    return document.querySelectorAll(selector);
  }

  function udom($dom) {
    var options = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      options[_i - 1] = arguments[_i];
    }

    var keyValSignEntries = _toKeyValSignEntries(options);

    keyValSignEntries.map(function (option) {
      var _a, _b, _c;

      var key = option[0],
          val = option[1],
          sign = option[2];

      if (key === 'class') {
        if (sign == '-=') {
          (_a = $dom.classList).remove.apply(_a, _splitToDomClasses(val));
        }

        if (sign == '+=') (_b = $dom.classList).add.apply(_b, _splitToDomClasses(val));

        if (sign == '=') {
          $dom.className = '';

          (_c = $dom.classList).add.apply(_c, _splitToDomClasses(val));
        }
      } // 更新style时，需要注意：
      else if (key === 'style') {
          // 如果是移除，则参数传入就是 'style-=color;font-size;' or {'style-': 'color;font-size'} ，即只包含属性名,
          if (sign == '-=') {
            var styleProperties = val.split(';');
            styleProperties.map(function (item) {
              $dom.style.removeProperty(item);
            });
          }

          if (sign == '+=') $dom.style.cssText += val;

          if (sign == '=') {
            $dom.style.cssText = val;
          }
        } else if (key === 'text') {
          // 如果是移除，则参数传入就是 'text-=' or {'text-': ''}
          if (sign == '-=') {
            $dom.textContent = '';
          }

          if (sign == '+=') {
            $dom.textContent += val;
          }

          if (sign == '=') {
            $dom.textContent = val;
          }
        } else if (key === 'html') {
          if (sign == '-=') {
            $dom.innerHTML = '';
          }

          if (sign == '+=') {
            $dom.innerHTML += val;
          }

          if (sign == '=') {
            $dom.innerHTML = val;
          }
        } else {
          if (sign == '-=') {
            $dom.removeAttribute(key);
          }

          if (sign == '+=') {
            $dom.setAttribute(key, val);
          }

          if (sign == '=') {
            $dom.setAttribute(key, val);
          }
        }
    });
    return $dom;
  }

  function ddom($dom) {
    $dom.remove();
  }

  function _splitBySign(str) {
    var res = [];

    if (str.includes('-=')) {
      var idx = str.indexOf('-=');
      res = [str.slice(0, idx), str.slice(idx + 2), '-='];
    }

    if (str.includes('+=')) {
      var idx = str.indexOf('+=');
      res = [str.slice(0, idx), str.slice(idx + 2), '+='];
    }

    if (str.includes('=')) {
      var idx = str.indexOf('=');
      res = [str.slice(0, idx), str.slice(idx + 1), '='];
    }

    if (res.length !== 3) throw new Error('options item not match key=val or key-=val or key+=val');
    return res;
  }

  function _type(val) {
    var rightPart = Object.prototype.toString.call(val).split(' ')[1];
    return rightPart.slice(0, rightPart.length - 1).toLowerCase();
  }

  function _splitToDomClasses(str) {
    return str.trim().split(' ');
  }
  /*
  * ['class-=a b c', 'id=a']
  * or
  * {
  *   'class-':'a b c',
  *   'id': 'a'
  * }
  * =====>
  * [['class','a b c', '-='], ['id', 'a', '=']]
  *
  * */


  function _toKeyValSignEntries(options) {
    var res = [];

    if (_type(options[0]) == 'object') {
      Object.entries(options[0]).map(function (item) {
        if (item[0].endsWith('-')) res.push([item[0].slice(0, item[0].length - 2), item[1], '-=']);else if (item[0].endsWith('+')) res.push([item[0].slice(0, item[0].length - 2), item[1], '+=']);else res.push([item[0], item[1], '=']);
      });
    }

    if (_type(options[0]) == 'string') {
      if (!options.every(function (option) {
        return _type(option) === 'string';
      })) throw new Error('If first option is string, all left must be string.');else {
        options.map(function (option) {
          res.push(_splitBySign(option));
        });
      }
    }

    return res;
  }
});
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52156" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)