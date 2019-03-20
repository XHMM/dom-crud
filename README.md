<h1>dom-crud</h1>

Make dom manipulation easier, **c**(create) **r**(read) **u**(update) **d**(delete).

## Install
- if using `script` tag:
```html
<script src="https://unpkg.com/dom-crud@latest/build/index.umd.min.js"></script>
<script>
    crud.cdom(..)
    crud.rdom(..)
    crud.rdoms(..)
    crud.udom(..)
    crud.ddom(..)
</script>
```
- if using npm module: `npm i dom-crud` or `yarn add dom-crud`
```
import {cdom, rdom, rdoms, udom, ddom} from "dom-crud"
// usage below
```

## Usage
**Warning:**  pay attention to your use env, if using with script tag, don't forget add `crud.` when invoking methods. 
### c(create)
`cdom(tagName, str1, str2, obj1, str2, obj2...);`

You can pass any valid attributes when creating a dom:
```js
import {cdom} from 'dom-crud'

// pass many strings
const $input = cdom('input', 
'class=center big red', 
'style=font-size:3rem;font-weight:bold', 
'type=text'
);

// or pass many object
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

// above will create a dom like below:
// <input type='text' class='center big red' style='font-size:3rem;font-weight:bold'/>
```

### r(read)
`rdom(selector)`  
`rdoms(selector)` 

Dom(s) reading is just a wrapper of `querySelector(All)`
```js
import {rdom} from 'dom-crud'

const $input = rdom('.center').rdom('.word').rdom('.c'); // single dom can chain
const $inputs = rdoms('input'); // multi doms cannot chain
```
### u(update)
`udom(dom, str1, str2, obj1, str2, obj2...);`

Updating dom is very funny, there are three signs `=` `-=` `+=`, each of them has different mean:
- `=` mean overwrite
- `-=` mean delete
- `+=` mean append
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

// you can also mix string and object just like cdom(..)
```

### d(delete)
Deleting a dom js just remove it from document
```js
import {ddom, rdom} from 'dom-crud'

ddom(rdom('input')); 
```

### ps: cdom and udom
1. When using `udom` with `=`, the behavior is similar to `cdom` because `=` is a overwrite sign.  

2. Below list some additional keys can make crud more funny:
- `text`(string): this modify text conent in target dom
- `html`(string): this modify html content in target dom
- `doms`(array|array-like): this modify doms in target dom
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