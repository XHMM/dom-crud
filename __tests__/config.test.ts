import { getCrudConfig, updateCrudConfig, readConfigByKey } from '../config'


describe('getCrudConfig', function () {
  // i know freeze not work for nested object, it's is just a reminder that i should not change configClone for test
  const configClone = Object.freeze({
    doms: {
      "+=": {
        beforeScript: false
      }
    }
  })

  test('get global crud config', () => {
    expect( getCrudConfig()).toEqual(configClone)
  })
  test('get "doms" config from global config', () => {
    expect(readConfigByKey('doms')).toEqual(configClone.doms)
  })
  test('when getting sub config, throw  if attribute not in global config', () => {
    expect(() => {
      readConfigByKey('ab')
    }).toThrow()
  })
  test('update "doms" config in global config', () => {
  updateCrudConfig({
    doms: {
      '+=': {
        beforeScript: true
      }
    }
  })
  expect( getCrudConfig()).toEqual({
    doms: {
      '+=': {
        beforeScript: true
      }
    }
  })
})
  test('when updating global config, throw if passed parameter not an object', () => {
    expect(()=>{
      // @ts-ignore
      updateCrudConfig('str')}).toThrow()
  })
  test('global config not updated if passed obj not subset of global config', () => {
    // @ts-ignore
    updateCrudConfig({doms: {'=': {hi: true}}})
    expect(getCrudConfig()).toEqual(configClone)
  })
});
