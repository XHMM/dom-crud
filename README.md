<h1  align="center">dom-crud</h1>
<div  align="center">Make dom manipulation funny while create, read, update, delete</div>

## 👉 Install

- use with `script` tag :

  **warning: currently no polyfill is added.**

  **help:  I am so curious why `rollup-plugin-babel` not work in my `rollup.config.js`.** 

```ht
<script src="https://unpkg.com/dom-crud@latest/build/index.browser.min.js"></script>
<script>
    const $div = rdom("div");
    // go on reading to see details
</script>
```

- use as es module: `npm i dom-crud` or `yarn add dom-crud` :

```js
import { cdrom, rdom, udom, ddom, getCrudConfig, updateCrudConfig } from "dom-crud"
// go on reading to see details
```



## 👉 Basic Knowledge

Before going on, there are some terms you should know ：

- **Sign** represents a string contains two character, there are three signs ：
  - `==` mean overwrite/replace
  - `-=` mean delete
  - `+=` mean append
- **KVS string** (short for "Key Value Sign") is a function parameter format in string style  what will be used often：there are some [Builtin Keys](#Builtin Keys)  for use, every other keys will be used with `setAttribute` method.  Examples : 
  - `class-=a b c`
  - `style==color:red;font-size:2rem`
  - `html+=<span>hi</span>`
  - `id==a`
- **KVSC string** ("C" is short for "Config"), because some keys can have additional configs, details will discuss later. Examples : 
  - `id==a?configA=xx&configB=yy`
- **KVS object**  is a function parameter format in object style  what will be used often. Examples : 
  - `{ 'id==': {value:'a'}}`
  - you can also specify value directly:  `{ 'id==':'a'}` is equal to above
  - `{ 'class-=': {value: 'a b c'}}` or `{ 'class-=': 'a b c'}`
  - `{ 'style==': 'color:red;font-size:2rem'}`
  - `{ 'html+=': '<span>hi</span>'}`
- **KVSC object** , Example : 
  - use `config` key and `value` key at the same time if you need to pass configs:  `{ 'text==': { value:"new text", config: {purText: true} }}`



## 👉 API

### `cdom(htmlTagName, strOrObj1, strOrObj2, strOrObj3, strOrObj4, ...)`

- htmlTagName : `string`  
- strOrObj : `KVS(C) string` or `KVS(C) object`)
- **return** :  `Element`

```js
import { cdom } from 'dom-crud'

// below will create a dom like this:
// <input type='text' class='center big red' style='font-size:3rem;font-weight:bold'/>

// you can pass only KVS strings
const $input = cdom('input', 
'class==center big red', 
'style==font-size:3rem;font-weight:bold', 
'type==text'
);

// or pass only KVS objects
const $input2 = cdom('input', 
{
  'class==': 'center big red',
  'style==': "font-size:3rem;font-weight:bold",
}, 
{
  'type': 'text'
});

// or mixed
const $input3 = cdom('input', 
'class==center big red',
{
  'style==': "font-size:3rem;font-weight:bold",
  'type==': 'text'
});
```

### `rdom(selector)`  

- selector :  `string`    same as `querySelector`
- **return** :  `Element`

```js
import { rdom } from 'dom-crud'

// you can chain it
const $input = rdom('.center').rdom('.word').rdom('.c'); 
```

### `rdoms(selector)` 

- selector : `string`   same as `querySelectorAll`
- **return** : `NodeList`

```js
import { rdoms } from 'dom-crud'

// cannot chain
const $inputs = rdoms('input'); 
```

### `udom(dom, strOrObj1, strOrObj2, strOrObj3, strOrObj4, ...);`

- dom : `Element`
- strOrObj : `KVS(C) string` or `KVS(C) object` 
- **return** : void

```js
import { udom, rdom } from 'dom-crud'

// below will remove all inline styles and then add blue color
udom(rdom('input'), 'style==color:blue;');
// object style
udom(rdom('input'), {
    'style==':'color:blue'
});


// below will only remove color and font-size from inline styles if exists
udom(rdom('input'), 'style-=color;font-size')
// object style
udom(rdom('input'), {
    'style-=':'color;font-size'
})

// below will append color to inline styles
udom(rdom('input'), 'style+=color:blue;')
// object style
udom(rdom('input'), {
    'style+=':'color:blue'
})
```

### `ddom(dom)`

- dom : `Element`
- **return** : `boolean`   whether or not removed dom

```js
import { ddom, rdom } from 'dom-crud'

ddom(rdom('input')); 
```

### `getCrudConfig()`

- **return** : global config object

  currently, the default global config  is very simple as below:

```js
import { getCrudConfig } from 'dom-crud'
const config = getCrudConfig();
console.log(config);
/*
{
  text: {
    // detailed below
    pureText: false
  },
  // whether log debug info(currently, nothing cumbersome logged)
  debug: false
} 
*/
```

### `updateCrudConfig(config)`

- config : it should be a subset of global config object, anything else will be ignored
- **return** : void

```js
import { getCrudConfig, updateCrudConfig } from 'dom-crud'
const config = getCrudConfig();
updateCrudConfig({
    text: {
        pureText: true,
        elseConfig: 'yes' // ignored because global config not contains this
    },
})

```



## 👉 Builtin Keys

Below list all builtin keys which made `dom-crud` funny. Remind:  any other keys will be used in `setAttribute(key, value)` ：

### `text`

This key modifies text conent in target dom, V(value) should be `string`. This key's configs as below:

| name     | type      | description                                                  |
| -------- | --------- | ------------------------------------------------------------ |
| pureText | `boolean` | If your dom content is 100% plain text, set it to true to make performance boost. This config can be changed by global config. |

### `html`

This key modifies html content in target dom, V(value) should be `string`.

### `doms`

This key modifies doms in target dom，V(value) should be one of below :

- `array`  contains `Emelent`
- `NodeList`
- `HTMLCollection`  

This key's configs as below:

| name   | type      | description                                    |
| ------ | --------- | ---------------------------------------------- |
| before | `Element` | Remind: Element should child of parent element |

### `style`

This key modifies dom inline styles.

### `class`

This key modifies dom classes.



**For more keys? Please give me advice**🤣