import {getType, stringToDomClasses, isValidDomsValue, toKVSEntries, merge} from "../helpers";

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
    expect(getType(document.createElement('div'))).toBe('htmlelement')
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

describe('isValidDomsValue', function () {
  const $div1 = document.createElement('div');
  $div1.setAttribute('id', 'div1');
  const $div2 = document.createElement('div');
  document.body.append($div1, $div2);
  test('return false if value not array or nodeList or HTMLCollection', () => {
    expect(isValidDomsValue('str')).toBeFalsy()
    expect(isValidDomsValue(document.querySelector('div'))).toBeFalsy()
    expect(isValidDomsValue(document.getElementById('div1'))).toBeFalsy()
  })
  test('when value is array, elements should be element', () => {
    expect(isValidDomsValue( [document.querySelector('#div1')])).toBeTruthy();
    expect(isValidDomsValue( ['str'])).toBeFalsy();
  })
});

/*describe('_stringToKVSEntry', () => {
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
})*/
describe('toKVSEntries', () => {
  test('when array includes both valid KVS string and object, works', ()=> {
    const objArr = ['class+=a b c', {
      'type': 'text',
      id: 'a'
    }]
    expect(toKVSEntries(objArr)).toEqual([['class','a b c', '+='],['type','text','='],['id','a','=']])
  })
})

describe('merge', function () {
  let target:any;
  let source:any;
  beforeEach(() => {
    target = {}
    source = {}
  })
  test('throw error if not objects', () => {
    target = 'str';
    expect(()=> {merge(target, source)}).toThrow()
  })
  test('merge if source key exists in target', () => {
    target = {a:1};
    source = {a:2, b:2};
    merge(target, source);
    expect(target).toEqual({a:2})
  })
  test('recurse merge if next level is still object', () => {
    target = {a:{b:1}, c:true};
    source = {a:{b:2}, c:false, d:'hi'};
    merge(target, source);
    expect(target).toEqual({
      a:{b:2},
      c:false
    })
  })
});