<h1 align='center'>dom-crud</h1>


### Description
Make dom manipulation easier, **c**(create) **r**(read) **u**(update) **d**(delete).
### Install
- if using `script` tag:
```
<script src="path/to/index.min.js"></script>
<script>
    cdom(..)
    rdoms(..)
    udom(..)
    ddom(..)
</script>
```
- if using npm module: `npm i dom-crud` or `yarn add dom-crud`
```
import "@xhmm/dom-crud"
cdom(..)
rdoms(..)
udom(..)
ddom(..)
```

### Usage
#### c(create)
You can pass any valid attributes when creating a dom, two ways are allowed:
```js
// pass many strings
const $input = cdom('input', 
'class=center big red', 
'style=font-size:3rem;font-weight:bold', 
'type=text'
);

// or pass an object
const $input2 = cdom('input', {
  class:'center big red',
  style:"font-size:3rem;font-weight:bold",
  type:'text'
});

// above will create a dom like below:
// <input type='text' class='center big red' style='font-size:3rem;font-weight:bold'/>
```

#### r(read)
Dom(s) reading is just a wrapper of `querySelector(All)`
```js
const $input = rdom('.center');
const $inputs = rdoms('input');
```
#### u(update)
Updating dom is very funny, there are three signs `=` `-=` `+=`, each of them has different mean:
- `=` mean overwrite
- `-=` mean delete
- `+=` mean append
```js
// below will remove all inline styles and then add blue clor
udom($input, 'style=color:blue;');
// below will only remove color and font-size from inline styles if exists
udom($input, 'style-=color;font-size')
// below will append color to inline styles
udom($input, 'style+=color:blue;')

```
#### d(delete)
Deleting a dom js just remove it from document
```js
ddom($input); 
```

### License
MIT