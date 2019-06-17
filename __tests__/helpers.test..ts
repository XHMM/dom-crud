import { getType, stringToDomClasses, isValidDomsValue, toKVSEntries, merge } from '../src/helpers';

describe('getType', () => {
  test('return concrete type name', () => {
    expect(getType('a')).toBe('string');
    expect(getType(1)).toBe('number');
    expect(getType(true)).toBe('boolean');
    expect(getType(null)).toBe('null');
    expect(getType(undefined)).toBe('undefined');
    expect(getType([])).toBe('array');
    expect(getType({})).toBe('object');
    expect(getType(function() {})).toBe('function');
    expect(getType(document.createElement('div'))).toBe('htmldivelement');
  });
});

describe('stringToDomClasses', () => {
  test('return string arr', () => {
    expect(stringToDomClasses('a b c')).toEqual(['a', 'b', 'c']);
  });
  test('remove extra white space', () => {
    expect(stringToDomClasses(' a b c ')).toEqual(['a', 'b', 'c']);
    expect(stringToDomClasses(' a   b   c ')).toEqual(['a', 'b', 'c']);
  });
});

describe('isValidDomsValue', function() {
  const $div1 = document.createElement('div');
  $div1.setAttribute('id', 'div1');
  const $div2 = document.createElement('div');
  document.body.append($div1, $div2);
  test('return false if value not array or nodeList or HTMLCollection', () => {
    expect(isValidDomsValue('str')).toBeFalsy();
    expect(isValidDomsValue(document.querySelector('div'))).toBeFalsy();
    expect(isValidDomsValue(document.getElementById('div1'))).toBeFalsy();
  });
  test('when value is array, elements should be element', () => {
    expect(isValidDomsValue([document.querySelector('#div1')])).toBeTruthy();
    expect(isValidDomsValue(['str'])).toBeFalsy();
  });
});

describe('toKVSCEntries', () => {
  test('when array includes both valid KVS string and object, works', () => {
    const objArr = [
      'class+=a b c',
      {
        'type-=': 'text',
        'id==': 'a',
        'test==': {
          value: 'hi',
          config: {
            color: 'red'
          }
        }
      }
    ];
    expect(toKVSEntries(objArr)).toEqual([
      ['class', 'a b c', '+=', {}],
      ['type', 'text', '-=', {}],
      ['id', 'a', '==', {}],
      ['test', 'hi', '==', { color: 'red' }]
    ]);
  });
});

describe('merge', function() {
  let target: any;
  let source: any;
  beforeEach(() => {
    target = {};
    source = {};
  });
  test('throw error if not objects', () => {
    target = 'str';
    expect(() => {
      merge(target, source);
    }).toThrow();
  });
  test('merge if source key exists in target', () => {
    target = { a: 1 };
    source = { a: 2, b: 2 };
    merge(target, source);
    expect(target).toEqual({ a: 2 });
  });
  test('recurse merge if next level is still object', () => {
    target = { a: { b: 1 }, c: true };
    source = { a: { b: 2 }, c: false, d: 'hi' };
    merge(target, source);
    expect(target).toEqual({
      a: { b: 2 },
      c: false
    });
  });
});
