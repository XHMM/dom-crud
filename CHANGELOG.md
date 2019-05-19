### 2019-5-19(2.0.0@alpha)
- [**Breaking**] use `==` `-=` `+=` all the time no matter in string or object. you can not write like `text=hi`, `{text: 'hi}` anymore, you should write like `text==hi`, `{'text==': 'hi' }`
- [**Breaking**] global config changed: removed `beforeScript` because it's not very useful; add `pureText`, see README for detail

- [**New**] add local config to control specific operation, you can see all available local config in special keys part in README