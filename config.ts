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
interface IConsole {
  log(methodName:string, msg:any):void
  warn(methodName:string, msg:any):void
  error(methodName:string, msg:any):void
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
// todo: add more debug info for apis
// @ts-ignore
let _console: IConsole = {} ;
function _muteConsole() {
  _console.log = function() {}
  _console.warn = function () {}
  _console.error = function () {}
}
function _activateConsole() {
  _console.log = function(methodName:string, msg:any) {
    console.log('%c[dom-crud:log][%s]\n %c%s',"color:#18b7ff;background:rgba(0,0,0,0.02);padding:0.2rem", methodName,"background:rgba(0,0,0,0.02);padding:0.2rem", msg)
  }
  _console.warn = function (methodName:string, msg:any) {
    console.log('%c[dom-crud:warn][%s]\n %c%s',"color:orange;background:rgba(0,0,0,0.02);padding:0.2rem", methodName,"background:rgba(0,0,0,0.02);padding:0.2rem", msg)
  }
  _console.error = function (methodName:string, msg:any) {
    console.log('%c[dom-crud:error][%s]\n %c%s',"color:red;background:rgba(0,0,0,0.02);padding:0.2rem", methodName,"background:rgba(0,0,0,0.02);padding:0.2rem", msg)
  }
}
const _crudConfigProxy = new Proxy(_crudConfig, {
  set(target, key, val) {
    if(key == 'debug') {
      if(val == false) {
        _muteConsole()
      }
      else {
        _activateConsole();
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
