// @ts-ignore
import cloneDeep from 'lodash.clonedeep';
import {getType, merge} from "./helpers";

interface ICrudConfig {
  doms: {
    "+=": {
      beforeScript: boolean;
    };
  };
  debug: boolean
}

// this object must have at most two level depth, must can to be a  valid JSON
const _crudConfig: ICrudConfig = {
  doms: {
    "+=": {
      beforeScript: false
    }
  },
  debug: false
};
const _nativeConsoleClone = cloneDeep(console);
// for debug use todo: add more useful debug info to console
let _console = console ;
function _muteConsole() {
  _console.log = function() {}
  _console.warn = function () {}
  _console.error = function () {}
}
const _crudConfigProxy = new Proxy(_crudConfig, {
  set(target, key, val) {
    if(key == 'debug') {
      console.log(key, val)
      if(val == false) {
        _muteConsole()
      }
      else {
        _console = _nativeConsoleClone;
      }
    }
    // @ts-ignore
    target[key] = val;
    return true;
  }
})
// debug is false default, so need to call this manually to mute _console
_muteConsole();


function getCrudConfig(): ICrudConfig {
  return JSON.parse(JSON.stringify(_crudConfigProxy));
}
function updateCrudConfig(newConfig: Partial<ICrudConfig>): void {
  const type = getType(newConfig);
  if(type !== 'object')
    throw new TypeError(`config should be an object, received type is ${type}`)
  merge(_crudConfigProxy, newConfig);
}
function readConfigByKey(key: string) {
  if (key in _crudConfig && _crudConfig.hasOwnProperty(key)) {
    // @ts-ignore
    return _crudConfig[key];
  } else throw new Error(`${key} not exists in global curd config`);
}

export { getCrudConfig, updateCrudConfig, readConfigByKey, _console };
