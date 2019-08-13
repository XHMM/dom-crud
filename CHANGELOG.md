### 2019-8-13(3.0.0)
- [**Breaking**] when use as `script`，namespace `crud` is removed, so now you should call apis directly, such as `const div = rdom('div')` but not `const div = crud.rdom('div')`

### 2019-5-19(2.0.0)
- [**Breaking**] use `==` `-=` `+=` all the time no matter in string or object. you can not write like `text=hi`, `{text: 'hi}` anymore, you should write `text==hi`, `{'text==': 'hi' }`
- [**Breaking**] global config changed: removed `beforeScript` because it's not very useful; add `pureText`, see README for detail

- [**New**] add local config to control specific operation, you can see all available local config in special keys part in README