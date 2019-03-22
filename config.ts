import {getType, merge} from "./helpers";

interface ICrudConfig {
  doms: {
    "+=": {
      beforeScript: boolean;
    };
  };
}

// this object must have at most two level depth, must can to be a  valid JSON
const _crudConfig: ICrudConfig = {
  doms: {
    "+=": {
      beforeScript: false
    }
  }
};

function getCrudConfig(): ICrudConfig {
  return JSON.parse(JSON.stringify(_crudConfig));
}
function updateCrudConfig(newConfig: Partial<ICrudConfig>): void {
  const type = getType(newConfig);
  if(type !== 'object')
    throw new TypeError(`config should be an object, received type is ${type}`)
  merge(_crudConfig, newConfig);
}
function readConfigByKey(key: string) {
  if (key in _crudConfig && _crudConfig.hasOwnProperty(key)) {
    // @ts-ignore
    return _crudConfig[key];
  } else throw new Error(`${key} not exists in global curd config`);
}


export { getCrudConfig, updateCrudConfig, readConfigByKey };
