import { toKVSEntries, _stringToKVSEntry, _objectToKVSEntry } from "../utils";

describe('_stringToKVSEntry', () => {
  test('return an three elements array', () =>{
    const str1 = 'class-=a b c';
    const str2 = 'class=a b c';
    const str3 = 'class+=a b c';
    expect(_stringToKVSEntry(str1)).toHaveLength(3)
    expect(_stringToKVSEntry(str1)).toEqual(['class','a b c','-='])
    expect(_stringToKVSEntry(str2)).toHaveLength(3)
    expect(_stringToKVSEntry(str2)).toEqual(['class','a b c','='])
    expect(_stringToKVSEntry(str3)).toHaveLength(3)
    expect(_stringToKVSEntry(str3)).toEqual(['class','a b c','+='])
  })
  test('remove extra white space', () =>{
    const str = ' class -= a b c';
    expect(_stringToKVSEntry(str)).toEqual(['class','a b c','-='])
  })
  test('throw error if not includes = += -=', ()=>{
    expect(()=>{_stringToKVSEntry('class')}).toThrow();
    expect(()=>{_stringToKVSEntry('class-a')}).toThrow();
  })
})
describe('_objectToKVSEntry', () => {
  test('return an three elements array', () =>{
    const obj1 = { 'class-': 'a b c', 'color':'red'};
    const obj2 = { 'class': 'a b c'};
    const obj3 = { 'class+': 'a b c'}
    expect(_objectToKVSEntry(obj1)).toHaveLength(2)
    expect(_objectToKVSEntry(obj1)).toEqual([['class','a b c','-='], ['color', 'red', '=']])
    expect(_objectToKVSEntry(obj2)).toHaveLength(1)
    expect(_objectToKVSEntry(obj2)).toEqual([['class','a b c','=']])
    expect(_objectToKVSEntry(obj3)).toHaveLength(1)
    expect(_objectToKVSEntry(obj3)).toEqual([['class','a b c','+=']])
  })
  test('not remove white space', () =>{
    const obj = {'type': ' input '};
    expect(_objectToKVSEntry(obj)).toEqual([['type',' input ','=']])
  })
  test('whatever types will be reversed', () =>{
    const fn = function(){}
    const obj1 = { 'class-': 12};
    const obj2 = { 'class': false};
    const obj3 = { 'class+': fn}
    expect(_objectToKVSEntry(obj1)).toHaveLength(1)
    expect(_objectToKVSEntry(obj1)).toEqual([['class',12,'-=']])
    expect(_objectToKVSEntry(obj2)).toHaveLength(1)
    expect(_objectToKVSEntry(obj2)).toEqual([['class',false,'=']])
    expect(_objectToKVSEntry(obj3)).toHaveLength(1)
    expect(_objectToKVSEntry(obj3)).toEqual([['class',fn,'+=']])
  })
})


describe('toKVSEntries', () => {
  test('when array includes both valid KVS string and object, works', ()=> {
    const objArr = ['class+=a b c', {
      'type': 'text',
      id: 'a'
    }]
    expect(toKVSEntries(objArr)).toEqual([['class','a b c', '+='],['type','text','='],['id','a','=']])
  })
})