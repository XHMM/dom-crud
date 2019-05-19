<h1>dom-crud</h1>

Make dom manipulation funny, **c**(create) **r**(read) **u**(update) **d**(delete).


## Install
- if using `script` tag, **you need to invoke apis using `crud.` prefix**:
```html
<script src="https://unpkg.com/dom-crud@latest/build/index.umd.min.js"></script>
<script>
    // using crud as a namespace to invoke methods
    crud.methodName(...)
</script>
```
- if using as es module: `npm i dom-crud` or `yarn add dom-crud`
```js
import { methodName } from "dom-crud"
// detail usage are below
```

## Basic
Before going on, there are some terms you should know ：
- **Sign** represents a string contains two character, there are three signs ：
    - `==` mean overwrite/replace
    - `-=` mean delete
    - `+=` mean append

- **KeyValueSignConfig entry**(short for **KVSC entry**) is an array always contains four element - `[Key, Value, Sign, Config]`, `Key` and `Sign` are string and `Value` can be any types, `Config` is an object.

Arguments passed to dom-crud apis will be converted to `KVSC entries` internally, so what we do is not pass KVS entry array but **`string` or `object`** as detailed below ：

-  **KVS string** , for example: 
    - `class-=a b c`
    - `style==color:red;font-size:2rem`
    - `html+=<span>hi</span>`

- **KVSC string** , for example: 
    - `id==a?configA=xx&configB=yy`

- **KVS object** , for example: 
    - `{ 'id==':'a'}` (equal to `{ 'id==': {value:'a'}}`)
    - `{ 'class-=': 'a b c'}`
    - `{ 'style==': 'color:red;font-size:2rem'}`
    - `{ 'html+=': '<span>hi</span>'}`

- **KVSC object** , for example: 
    - `{ 'text==': { value:"new text", config: {purText: true} }}`


## Api

### `cdom(tagName, strOrObj1, strOrObj2, strOrObj3, strOrObj4, ...)`
- tagName: `string`
- strOrObj: `KVS(C) string` or `KVS(C) object` (some special `Key` name are showed [at the end](#special-keys) )
- **return**: a html element

```js
import {cdom} from 'dom-crud'

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
- selector: string
- **return**: a html element
```js
import {rdom} from 'dom-crud'

// when reading single dom, you can chain it
const $input = rdom('.center').rdom('.word').rdom('.c'); 
```

### `rdoms(selector)` 
- selector: string
- **return**: nodeList

```js
import {rdoms} from 'dom-crud'

// multi doms cannot chain
const $inputs = rdoms('input'); 
```

### `udom(dom, strOrObj1, strOrObj2, strOrObj3, strOrObj4, ...);`
- dom: Element
- strOrObj: `KVS(C) string` or `KVS(C) object` (some special `Key` names are showed [at the end](#special-keys) )
- **return**: void

```js
import {udom, rdom} from 'dom-crud'

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
- dom: Element
- **return**: boolean -- whether removed dom
```js
import {ddom, rdom} from 'dom-crud'

ddom(rdom('input')); 
```

### global config
Global config can changed some crud behaviors.
#### `getCrudConfig()`
- **return**: global config object

    currently, the default global config object is very simple as below:
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

#### `updateCrudConfig(config)`
- config: it should be a subset of global config object, anything else will be ignored
- **return**: void
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

### local config
Some crud operation may need some special config to make it better, such as I want to  append doms before specific dom. Local configs are used in `KVSC string/object`:
```js
import { cdom, udom} from 'dom-crud';

const $p = cdom('div');
const $c1 = cdom('div', 'text==c1');
const $c2 = cdom('div', 'text==c2');

udom($p, {'doms+=': [$c1, $c2]});

/*
<body>
    <div>
        <div>c1</div>
        <div>c2</div>
    </div>
</body>
*/
udom(document.body, {'doms+=': [$p]});


/*
<body>
    <div>
        <div>c1</div>
        <div>c3</div>
        <div>c2</div>
    </div>
</body>
*/
udom( $p, {
  'doms+=': {
    value: [cdom('div', 'text==c3')],
    config: {
      before: $c2
    }
  }
})
```



### special keys
Below list all special keys can make crud more funny, **any other keys will be used in `setAttribute(key, value)`**:

#### text
This key modifies text conent in target dom, V(value) should be `string`  

**valid local config:**
```text
{
 // if your dom content is 100% text and no other doms, set it to true to make performance boost. This config can be changed by global config
  pureText: boolean
}
```



#### html
This modify html content in target dom, V(value) should be `string`

#### doms
This modify doms in target dom， V(value) should be one of `array`  contains Element as elements, or `NodeList`, or `HTMLCollection`  

**valid local config:** 
```text
{
  before: Element // element should child of parent element
}
```


## License
MIT