import {cdom,rdom,rdoms,udom,ddom} from '../crud'
import {getCrudConfig, updateCrudConfig} from "../config";

describe('cdom', () => {
  test('create a dom without attributes', ()=>{
    const $dom = cdom('div');
    expect($dom.tagName.toLowerCase()).toBe('div');
  })
  test('create a dom with attributes using different way', ()=>{
    const $dom1 = cdom('div', 'text=hi', 'style=color:red');
    expect($dom1.tagName.toLowerCase()).toBe('div');
    expect($dom1.textContent).toBe('hi');
    expect($dom1.style.color).toBe('red');

    const $dom2 = cdom('div', {html:'<span>word</span>'}, {style:'color:red;font-size:2rem'});
    expect($dom2.tagName.toLowerCase()).toBe('div');
    expect($dom2.innerHTML).toBe('<span>word</span>');
    expect($dom2.style.color).toBe('red');
    expect($dom2.style.fontSize).toBe('2rem');

    const $dom3 = cdom('div', 'text=hi', {style:'font-size:2rem'});
    expect($dom3.tagName.toLowerCase()).toBe('div');
    expect($dom3.textContent).toBe('hi');
    expect($dom3.style.fontSize).toBe('2rem');
  })
})

describe('rdom', () => {
  test('read by id', () => {
    const $div = cdom('div', 'id=d');
    document.body.appendChild($div);
    expect(rdom('#d')).toEqual($div)
  })
})

describe('rdoms', () => {
  test('read by class', () => {
    const $div1 = cdom('div', 'class=a');
    const $div2 = cdom('div', 'class=a');
    document.body.append($div1, $div2);
    expect(rdoms('.a')).toHaveLength(2)
  })
})

describe('udom', () => {
  test('overwrite', () => {
    const $div = cdom('div', 'style=color:red');
    udom($div, {
      style:'font-size:2rem'
    });
    expect($div.style.color).toBe('')
    expect($div.style.fontSize).toBe('2rem')
  })
  test('append', () => {
    const $div = cdom('div', 'style=color:red');
    udom($div, {
      'style+':'font-size:2rem'
    });
    expect($div.style.color).toBe('red')
    expect($div.style.fontSize).toBe('2rem')
  })
  test('append', () => {
    const $div = cdom('div', 'style=color:red');
    udom($div, {
      'style+':'font-size:2rem'
    });
    expect($div.style.color).toBe('red')
    expect($div.style.fontSize).toBe('2rem')
  })
  test('remove', () => {
    const $div = cdom('div', 'style=color:red');
    udom($div, {
      'style-':'color'
    });
    expect($div.style.color).toBe('')
  })
})
describe('udom with global config', () => {
  const configClone = Object.freeze(JSON.parse(JSON.stringify(getCrudConfig())));
  const $div1 = cdom('div', 'id=a');
  const $div2 = cdom('div', 'id=b');
  function initHtmlWithOneScriptTag() {
    document.body.innerHTML = '';
    document.body.append(document.createElement('script'));
  }

  beforeEach( ()=> {
    updateCrudConfig(configClone);
    initHtmlWithOneScriptTag();
  })

  test('with default config, doms+= append doms orderly', () => {
    udom(document.body, {
      'doms+': [$div1, $div2]
    });
    const allDoms = document.body.querySelectorAll('*');
    expect(allDoms[0].tagName).toBe('SCRIPT')
    expect(allDoms[1].getAttribute('id')).toBe('a')
    expect(allDoms[2].getAttribute('id')).toBe('b')
  })

  test('with changed config, doms+= append doms before script tag within body', () => {
    updateCrudConfig({
      'doms':{
        "+=":{
          beforeScript:true
        }
      }
    })
    udom(document.body, {
      'doms+': [$div1, $div2]
    });
    const allDoms = document.body.querySelectorAll('*');
    expect(allDoms[0].getAttribute('id')).toBe('a')
    expect(allDoms[1].getAttribute('id')).toBe('b')
    expect(allDoms[2].tagName).toBe('SCRIPT')
  })
})

describe('ddom', () => {
  test('delete a existing dom and return true', () => {
    const $div = cdom('div', 'id=a');
    document.body.append($div);
    expect(document.body.contains($div)).toBeTruthy();
    ddom($div);
    expect(document.body.contains($div)).toBeFalsy();
  })
  test('if dom not exist, return false', () => {
    expect(ddom(document.querySelector('#notExist'))).toBeFalsy();
  })
})