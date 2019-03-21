import {getType, stringToDomClasses} from "../helpers";


describe('getType', ()=> {
  test('return concrete type name', ()=>{
    expect(getType('a')).toBe('string')
    expect(getType(1)).toBe('number')
    expect(getType(true)).toBe('boolean')
    expect(getType(null)).toBe('null')
    expect(getType(undefined)).toBe('undefined')
    expect(getType([])).toBe('array')
    expect(getType({})).toBe('object')
    expect(getType(function(){})).toBe('function')
    // todo add for dom
  })
})

describe('stringToDomClasses', () =>{
  test('return string arr', ()=> {
    expect(stringToDomClasses('a b c')).toEqual(['a', 'b', 'c'])
  })
  test('remove extra white space', ()=> {
    expect(stringToDomClasses(' a b c ')).toEqual(['a', 'b', 'c'])
    expect(stringToDomClasses(' a   b   c ')).toEqual(['a', 'b', 'c'])
  })
})

