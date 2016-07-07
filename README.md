## uxcore-cascade-select

React cascade select

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Dependency Status][dep-image]][dep-url]
[![devDependency Status][devdep-image]][devdep-url]
[![NPM downloads][downloads-image]][npm-url]

[![Sauce Test Status][sauce-image]][sauce-url]

[npm-image]: http://img.shields.io/npm/v/uxcore-cascade-select.svg?style=flat-square
[npm-url]: http://npmjs.org/package/uxcore-cascade-select
[travis-image]: https://img.shields.io/travis/uxcore/uxcore-cascade-select.svg?style=flat-square
[travis-url]: https://travis-ci.org/uxcore/uxcore-cascade-select
[coveralls-image]: https://img.shields.io/coveralls/uxcore/uxcore-cascade-select.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/uxcore/uxcore-cascade-select?branch=master
[dep-image]: http://img.shields.io/david/uxcore/uxcore-cascade-select.svg?style=flat-square
[dep-url]: https://david-dm.org/uxcore/uxcore-cascade-select
[devdep-image]: http://img.shields.io/david/dev/uxcore/uxcore-cascade-select.svg?style=flat-square
[devdep-url]: https://david-dm.org/uxcore/uxcore-cascade-select#info=devDependencies
[downloads-image]: https://img.shields.io/npm/dm/uxcore-cascade-select.svg
[sauce-image]: https://saucelabs.com/browser-matrix/uxcore-cascade-select.svg
[sauce-url]: https://saucelabs.com/u/uxcore-cascade-select


### Development

```sh
git clone https://github.com/uxcore/uxcore-cascade-select
cd uxcore-cascade-select
npm install
npm run server
```

if you'd like to save your install time，you can use uxcore-tools globally.

```sh
npm install uxcore-tools -g
git clone https://github.com/uxcore/uxcore-cascade-select
cd uxcore-cascade-select
npm install
npm run dep
npm run start
```

### Test Case

```sh
npm run test
```

### Coverage

```sh
npm run coverage
```

## Demo

http://uxcore.github.io/components/cascade-select

## Contribute

Yes please! See the [CONTRIBUTING](https://github.com/uxcore/uxcore/blob/master/CONTRIBUTING.md) for details.

## API

```javascript
import CascadeSelect from 'uxcore-cascade-select'
import { render } from 'react-dom'

render(<CascadeSelect />, document.getElementById('root'))
```

## Props
| Name | Type | Required | Default | Comments |
|---|---|---|---|---|
| prefixCls | string | false | `'kuma-cascader'` | 默认的类名前缀 |
| className | string | false | `''` | 自定义类名 |
| options | array | false | `[]` | 选项数据源，格式可见下方Demo |
| value | array | false | `null` | 可由外部控制的值 |
| defaultValue | array | false | `[]` | 初始默认值 |
| placeholder | string | false | `'Please Select'` or `'请选择'` | placeholder |
| onChange | function | false | `function(value, selectedOptions)` | 选择完成后回调 |
| disabled | boolean | false | `false` | 是否禁用 |
| clearable | boolean | false | `false` | 是否支持清除 |
| changeOnSelect | boolean | false | `false` | 是否将每次选择立刻显示在控件中 |
| expandTrigger | string | false | `'click'` | 次级菜单展开方式，支持 `click` 和 `hover` |
| beforeRender | function | false | `(value, selectedOptions) => selectedOptions.map(o => o.label).join(' / ')` | 处理要显示的内容 |
| cascadeSize | number | false | `3` | 级联的层级数 |

## Demos

### props.options

```javascript
const options = [{
  value: 'zhejiang',
  label: '浙江',
  children: [{
    value: 'hangzhou',
    label: '杭州',
    children: [{
      value: 'xihu',
      label: '西湖',
    }],
  }],
}, {
  value: 'jiangsu',
  label: '江苏',
  children: [{
    value: 'nanjing',
    label: '南京',
    children: [{
      value: 'zhonghuamen',
      label: '中华门',
    }],
  }],
}];
```
