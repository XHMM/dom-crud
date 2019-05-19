import {cdom,rdom,rdoms,udom,ddom} from '../crud'
import {getCrudConfig, updateCrudConfig} from "../config";

describe('cdom', () => {
  test('create a dom without attributes', ()=>{
    const $dom = cdom('div');
    expect($dom.tagName.toLowerCase()).toBe('div');
  })
  test('create a dom with attributes using different way', ()=>{
    const $dom1 = cdom('div', 'text==hi', 'style==color:red');
    expect($dom1.tagName.toLowerCase()).toBe('div');
    expect($dom1.textContent).toBe('hi');
    expect($dom1.style.color).toBe('red');

    const $dom2 = cdom('div', {'html==':'<span>word</span>'}, {'style==':'color:red;font-size:2rem'});
    expect($dom2.tagName.toLowerCase()).toBe('div');
    expect($dom2.innerHTML).toBe('<span>word</span>');
    expect($dom2.style.color).toBe('red');
    expect($dom2.style.fontSize).toBe('2rem');

    const $dom3 = cdom('div', 'text==hi', {'style==':'font-size:2rem'});
    expect($dom3.tagName.toLowerCase()).toBe('div');
    expect($dom3.textContent).toBe('hi');
    expect($dom3.style.fontSize).toBe('2rem');
  })
})

/* todo: 1.add test for chain 2. add test for null check*/
describe('rdom', () => {
  test('read by id', () => {
    const $div = cdom('div', 'id==d');
    document.body.appendChild($div);
    expect(rdom('#d')).toEqual($div)
  })
})

describe('rdoms', () => {
  test('read by class', () => {
    const $div1 = cdom('div', 'class==a');
    const $div2 = cdom('div', 'class==a');
    document.body.append($div1, $div2);
    expect(rdoms('.a')).toHaveLength(2)
  })
})

describe('udom', () => {
  test('overwrite', () => {
    const $div = cdom('div', 'style==color:red');
    udom($div, {
      'style==':'font-size:2rem'
    });
    expect($div.style.color).toBe('')
    expect($div.style.fontSize).toBe('2rem')
  })
  test('append', () => {
    const $div = cdom('div', 'style==color:red');
    udom($div, {
      'style+=':'font-size:2rem'
    });
    expect($div.style.color).toBe('red')
    expect($div.style.fontSize).toBe('2rem')
  })
  test('remove', () => {
    const $div = cdom('div', 'style==color:red');
    udom($div, {
      'style-=':'color'
    });
    expect($div.style.color).toBe('')
  })
  test('append with local config', () => {
    const $p = cdom('div');
    const $c1 = cdom('div', 'text==c1');
    const $c2 = cdom('div', 'text==c2');
    udom($p, {'doms+=': [$c1, $c2]});
    udom(document.body, {'doms+=': [$p]});
    udom( $p, {
      'doms+=': {
        value: [cdom('div', 'text==c3')],
        config: {
          before: $c2
        }
      }
    })
    expect( $p.childNodes.length).toBe(3)
  })
})

describe('ddom', () => {
  test('delete a existing dom and return true', () => {
    const $div = cdom('div', 'id==a');
    document.body.append($div);
    expect(document.body.contains($div)).toBeTruthy();
    ddom($div);
    expect(document.body.contains($div)).toBeFalsy();
  })
  test('if dom not exist, return false', () => {
    expect(ddom(document.querySelector('#notExist'))).toBeFalsy();
  })
})