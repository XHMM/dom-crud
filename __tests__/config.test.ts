import { getCrudConfig, updateCrudConfig, readConfigByKey } from "../config";

// todo: is there a better way to test global change object?
// now i need to copy the original config object to test every time when original config changed and test order is important

describe("getCrudConfig", function() {
  test("get global crud config", () => {
    expect(getCrudConfig()).toEqual({
      // copy
      doms: {
        "+=": {
          beforeScript: false
        }
      },
      debug: false
    });
  });
});

describe("readConfigByKey", function() {
  test('get "doms" config from global config', () => {
    expect(readConfigByKey("doms")).toEqual({
      "+=": {
        beforeScript: false
      }
    });
  });
  test("when getting sub config, throw  if attribute not in global config", () => {
    expect(() => {
      readConfigByKey("ab");
    }).toThrow();
  });
});

describe("updateCrudConfig", function() {
  test("global config not updated if passed obj not subset of global config", () => {
    // @ts-ignore
    updateCrudConfig({ doms: { "=": { hi: true } } });
    expect(getCrudConfig()).toEqual({
      doms: {
        "+=": {
          beforeScript: false
        }
      },
      debug: false
    });
  });

  test('update "doms" config in global config', () => {
    updateCrudConfig({
      doms: {
        "+=": {
          beforeScript: true
        }
      }
    });
    expect(getCrudConfig()).toEqual({
      // copy
      doms: {
        "+=": {
          beforeScript: true
        }
      },
      debug: false
    });
  });
  test("when updating global config, throw if passed parameter not an object", () => {
    expect(() => {
      // @ts-ignore
      updateCrudConfig("str");
    }).toThrow();
  });
});
