import { getType, merge } from './helpers';
import { muteConsole, activateConsole } from './logger';

interface ICrudConfig {
  text: {
    pureText: boolean;
  };
  debug: boolean;
}

// config object must have at most two level depth and must can to be a  valid JSON
const _crudConfig: ICrudConfig = {
  text: {
    pureText: false
  },
  debug: false
};
const _crudConfigProxy = new Proxy(_crudConfig, {
  set(target, key, val) {
    if (key == 'debug') {
      if (val === false) {
        muteConsole();
      }
      if (val === true) {
        activateConsole();
      }
    }
    // @ts-ignore
    target[key] = val;
    return true;
  }
});

function getCrudConfig(): ICrudConfig {
  return JSON.parse(JSON.stringify(_crudConfigProxy));
}
function updateCrudConfig(newConfig: Partial<ICrudConfig>): void {
  const type = getType(newConfig);
  if (type !== 'object') throw new TypeError(`config should be an object, received type is ${type}`);
  merge(_crudConfigProxy, newConfig);
}
function readConfigByKey(key: string): any {
  if (key in _crudConfig && _crudConfig.hasOwnProperty(key)) {
    // @ts-ignore
    return _crudConfig[key];
  } else throw new Error(`${key} not exists in global crud config`);
}

export { getCrudConfig, updateCrudConfig, readConfigByKey };
