<h1>dom-crud</h1>

Make dom manipulation easier, **c**(create) **r**(read) **u**(update) **d**(delete).


## Install
- if using `script` tag, **you need to invoke apis using `crud.`**:
```html
<script src="https://unpkg.com/dom-crud@latest/build/index.umd.min.js"></script>
<script>
    // using crud as a namespace to invoke methods
    crud.methodName(...)
</script>
```
- if using npm module: `npm i dom-crud` or `yarn add dom-crud`
```js
import { methodName } from "dom-crud"
// detail usage are below
```

## Api
Before going on, there are some terms you should know ：
1. **Sign** represents a string contains one or two character, there are three signs ：
    - `=` mean overwrite/replace
    - `-=` mean delete
    - `+=` mean append

2. **KeyValueSign entry**(short for **KVS entry**) is an array always contains three element - `[Key, Value, Sign]`, `Key` and `Sign` are string and `Value` can be any types.

Parameters passed to dom-crud apis will be converted to `KVS entries` internally, so what we do is not pass KVS entry array but **`string` or `object`** as detailed below ：

- string style (let's call it **KVS string**) : for example `id=a`, `class-=a b c`, `style=color:red;font-size:2rem`, `html+=<span>hi</span>`
- object style (let's call it **KVS object**) : for example: `{id:'a'}`, `{'class-': 'a b c'}`, `{'style': 'color:red;font-size:2rem'}`, `{'html+': '<span>hi</span>'}`



### create
#### `cdom(tagName, strOrObj1, strOrObj2, strOrObj3, strOrObj4, ...)`
- tagName: `string`
- strOrObj: `KVS string` or `KVS object` (some special `Key` name are showed [at the end](#special-keys) )
- **return**: a html element

```js
import {cdom} from 'dom-crud'

// below will create a dom like this:
// <input type='text' class='center big red' style='font-size:3rem;font-weight:bold'/>

// you can pass only KVS strings
const $input = cdom('input', 
'class=center big red', 
'style=font-size:3rem;font-weight:bold', 
'type=text'
);

// or pass only KVS objects
const $input2 = cdom('input', 
{
  class:'center big red',
  style:"font-size:3rem;font-weight:bold",
}, 
{
  type:'text'
});

// or mixed
const $input3 = cdom('input', 
'class=center big red',
{
  style:"font-size:3rem;font-weight:bold",
  type:'text'
});
```

### read
#### `rdom(selector)`  
- selector: string
- **return**: a html element
#### `rdoms(selector)` 
- selector: string
- **return**: nodeList

```js
import {rdom} from 'dom-crud'

// when reading single dom, you can chain it
const $input = rdom('.center').rdom('.word').rdom('.c'); 
// multi doms cannot chain
const $inputs = rdoms('input'); 
```
### update
#### `udom(dom, strOrObj1, strOrObj2, strOrObj3, strOrObj4, ...);`
- dom: element
- strOrObj: `KVS string` or `KVS object` (some special `Key` names are showed [at the end](#special-keys) )
- **return**: void

```js
import {udom, rdom} from 'dom-crud'

// below will remove all inline styles and then add blue color
udom(rdom('input'), 'style=color:blue;');
// object style
udom(rdom('input'), {
    style:'color:blue'
});


// below will only remove color and font-size from inline styles if exists
udom(rdom('input'), 'style-=color;font-size')
// object style
udom(rdom('input'), {
    'style-':'color;font-size'
})

// below will append color to inline styles
udom(rdom('input'), 'style+=color:blue;')
// object style
udom(rdom('input'), {
    'style+':'color:blue'
})
```

### delete
#### `ddom(dom)`
- dom: element
- **return**: boolean -- whether removed dom
```js
import {ddom, rdom} from 'dom-crud'

ddom(rdom('input')); 
```

### config
In order to be more flexible, we added a global config object to **control how `udom` works**(not worked for `cdom`) ：

#### `getCrudConfig()`
- **return**: global config object

    currently, the default global config object is very simple as below:
    ```js
    import { getCrudConfig } from 'dom-crud'
    const config = getCrudConfig();
    console.log(config);
    /*
    {
      doms: {
        "+=": {
          // whether append dom before script tags
          beforeScript: false
        }
      },
      // whether log debug info(currently, nothing cumbersome logged)
      debug: false
    } 
    */
    ```

#### `updateCrudConfig(config)`
- config: it should be a subset of global config object, anything else will be ignored
- **return**: void
```js
import { getCrudConfig, updateCrudConfig } from 'dom-crud'
const config = getCrudConfig();
updateCrudConfig({
    doms: {
        "+=": {
            beforeScript: true
        },
        '=': 'xx' // this will be ignored
    }
})

```

### special keys
Below list all special keys can make crud more funny, **any other keys will be used in `setAttribute(key, value)`**:

#### `text`
This key modifies text conent in target dom, V(value) should be `string`


#### `html`
This modify html content in target dom, V(value) should be `string`

#### `doms`
This modify doms in target dom， V(value) should be one of `array`  contains Element as elements, or `NodeList`, or `HTMLCollection`
```js
const parent = rdom('#container')
const child = rdom('#child');
udom(parent, {
    // append a new div to parent
    'doms+': [ cdom('div', 'text=iam new')],
     // child removed from parent
    'doms-': [child],
    // clear parent inner html and add a new div
    'doms': [ cdom('div', 'text=only left me')]
})
```

## License
MIT