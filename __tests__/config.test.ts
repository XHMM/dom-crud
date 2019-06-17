import { getCrudConfig, updateCrudConfig, readConfigByKey } from '../src/config';

// todo: is there a better way to test global change object?
// now i need to copy the original config object to test every time when original config changed and test order is important

describe('getCrudConfig', function() {
  test('get global crud config', () => {
    expect(getCrudConfig()).toEqual({
      text: {
        pureText: false
      },
      debug: false
    });
  });
});

describe('readConfigByKey', function() {
  test('get "text" config from global config', () => {
    expect(readConfigByKey('text')).toEqual({
      pureText: false
    });
  });
  test('throw error if key not in global config', () => {
    expect(() => {
      readConfigByKey('ab');
    }).toThrow();
  });
});

describe('updateCrudConfig', function() {
  test('global config not updated if passed object not a subset of global config', () => {
    // @ts-ignore
    updateCrudConfig({ text: { newConfig: { hi: true } } });
    expect(getCrudConfig()).toEqual({
      text: {
        pureText: false
      },
      debug: false
    });
  });

  test('update "text" config in global config', () => {
    updateCrudConfig({
      text: {
        pureText: true
      }
    });
    expect(getCrudConfig()).toEqual({
      text: {
        pureText: true
      },
      debug: false
    });
  });
  test('when updating global config, throw if parameter not an object', () => {
    expect(() => {
      // @ts-ignore
      updateCrudConfig('str');
    }).toThrow();
  });
});
