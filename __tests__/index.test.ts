import {_splitBySign, _type, _splitToDomClasses, _toKeyValSignEntries} from "../utils";

describe('_splitBySign = += -=', () => {
  test('return an three elements array', () =>{
    const str1 = 'class-=a b c';
    const str2 = 'class=a b c';
    const str3 = 'class+=a b c';
    expect(_splitBySign(str1)).toHaveLength(3)
    expect(_splitBySign(str1)).toEqual(['class','a b c','-='])
    expect(_splitBySign(str2)).toHaveLength(3)
    expect(_splitBySign(str2)).toEqual(['class','a b c','='])
    expect(_splitBySign(str3)).toHaveLength(3)
    expect(_splitBySign(str3)).toEqual(['class','a b c','+='])
  })
  test('remove extra white space', () =>{
    const str = ' class -= a b c';
    expect(_splitBySign(str)).toEqual(['class','a b c','-='])
  })
  test('throw error if not includes = += -=', ()=>{
    expect(()=>{_splitBySign('class')}).toThrow();
    expect(()=>{_splitBySign('class-a')}).toThrow();
  })
})

describe('_type', ()=> {
  test('return concrete type name', ()=>{
    expect(_type('a')).toBe('string')
    expect(_type(1)).toBe('number')
    expect(_type(true)).toBe('boolean')
    expect(_type(null)).toBe('null')
    expect(_type(undefined)).toBe('undefined')
    expect(_type([])).toBe('array')
    expect(_type({})).toBe('object')
    expect(_type(function(){})).toBe('function')
  })
})

describe('_splitToDomClasses', () =>{
  test('return string arr', ()=> {
    expect(_splitToDomClasses('a b c')).toEqual(['a', 'b', 'c'])
  })
  test('remove extra white space', ()=> {
    expect(_splitToDomClasses(' a b c ')).toEqual(['a', 'b', 'c'])
    expect(_splitToDomClasses(' a   b   c ')).toEqual(['a', 'b', 'c'])
  })
})

describe('_toKeyValSignEntries', () => {
  test('when array elements are all valid string, works', ()=>{
    const stringArr1 = ['class-=a b c', 'id=a'];
    const stringArr2 = [' class -= a b c', 'id =a'];
    expect(_toKeyValSignEntries(stringArr1)).toEqual([['class','a b c', '-='], ['id', 'a', '=']])
    expect(_toKeyValSignEntries(stringArr2)).toEqual([['class','a b c', '-='], ['id', 'a', '=']])
  })
  test('when array elements include invalid string, throw error', ()=>{
    const stringArr = [' class -= a b c', 'id'];
    expect(()=>{_toKeyValSignEntries(stringArr)}).toThrow()
  })
  test('when array elements include object but value not string, will convert to string', ()=>{
    const objArr = [{
      'class-':'a b c',
      id: 2
    }];
    expect(_toKeyValSignEntries(objArr)).toEqual([['class','a b c', '-='], ['id', '2', '=']])
  })
  test('when array elements are all valid object, works', ()=>{
    const objArr = [{
      'class-':'a b c',
      id:'a'
    },{
      'class':' a b c ',
      type:' input '
    }];
    expect(_toKeyValSignEntries(objArr)).toEqual([['class','a b c', '-='], ['id', 'a', '='], ['class','a b c', '='],['type','input', '=']])
  })

  test('when array includes both valid string and object, works', ()=> {
    const objArr = ['class+=a b c', {
      'type': 'text',
      id: 'a'
    }]
    expect(_toKeyValSignEntries(objArr)).toEqual([['class','a b c', '+='],['type','text','='],['id','a','=']])
  })
})