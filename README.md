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
| value | array | false | `[]` | 可由外部控制的值 |
| defaultValue | array | false | `[]` | 初始默认值 |
| dropdownClassName | string | false | `''` | dropdown 容器的自定义样式
| placeholder | string | false | `'Please Select'` or `'请选择'` | placeholder |
| onChange | function | false | `function(value, selectedOptions)` | 选择完成后回调 |
| disabled | boolean | false | `false` | 是否禁用 |
| clearable | boolean | false | `false` | 是否支持清除 |
| changeOnSelect | boolean | false | `false` | 是否将每次选择立刻显示在控件中 |
| expandTrigger | string | false | `'click'` | 次级菜单展开方式，支持 `click` 和 `hover` |
| beforeRender | function | false | `(value, selectedOptions) => selectedOptions.map(o => o && o.label).join(' / ')` | 处理要显示的内容 |
| cascadeSize | number | false | `3` | 级联的层级数 |
| getPopupContainer | function():HTMLElement | false | / | 返回一个 html 元素用作 Popup 面板的容器，默认是插在body 中的一个 div |
| locale | string | false | `'zh-cn'` | `'en-us'`
| miniMode | boolean | false | true | 是否是简洁显示风格
| columnWidth | number | false | null | dropdown中每一列的宽度, 如为空，整体宽度等于input输入框的宽度
| displayMode | string | false | `dropdown` | `select` 或者 `dropdown` 或者 `search(已废弃)`
| getSelectPlaceholder | func | false | `function(idx){ return '请选择' }` | select显示模式下的placeholder生成函数
| size | string | false | `large` | 尺寸，枚举值：`large`, `middle`, `small` 
| isMustSelectLeaf | bool | false | `false` | 是否必须选择到叶子节点
| onSelect | function | false | null | 异步加载层级，需要 return 一个数组，具体用法参考下方 demo
| searchOption | function | false | null | `(已废弃)` 开启关键词搜索的配置，当 dispalyMode 为 search 时启用，具体配置方式[参考下方](props.searchOption)
| showSearch | boolean | false | false | 是否开启搜索模式
| onSearch | function | false | null | 开启关键词过滤模式，可以通过外部重新设置 options，onSearch 不能与 optionFilterProps 和 optionFilterCount 一起使用，onSearch 优先级更高
| optionFilterProps | string[] | false | `['label']` | showSearch=true 时，optionFilterProp 为 options[i] 中的属性名称，此时搜索会进行过滤
| optionFilterCount | number | false | 20 | 当使用过滤功能时 dropdown 里最多显示的条数
| cascaderHeight | number | false | null | 级联选择区域的高度

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

### 当不指定 dropdown 宽度时，还可以使用css来定制dropdown宽度

```less
.kuma-cascader-submenu-empty,
.kuma-dropdown-menu-submenu {
  width: 400px; // 你想要的 dropdown 宽度
}
```

### props.onSelect

```javascript
<CascadeSelect
  /**
   * @param resolve 请求成功了调用resolve()
   * @param reject 请求失败则调用reject()
   * @param key key为父级的value
   * @param level level为父级所在的层数，如上面的options的['zhengjiang']， level为1
   */ 
  showSearch={true}
  onSelect={(resolve, reject, key, level) => {
    ajax({
      url: 'xxx/xx.json',
      data: {
        key
      },
      success(content) {
        resolve(content); // content必须为array
      },
      error() {
        reject();
      }
    })
  }}
/>
```

### props.searchOption

```javascript
{
  doSearch(keyword, afterSearch) { // 异步搜索函数
    // keyword 为搜索的关键词
    // afterSearch 为搜索完成之后需要将结果显示在页面中，afterSearch 接收的参数为 [{ label, value }, ...]
    Fetch('/search?keyword=' + keyword).then(result => afterSearch(result))
  }
}
```

### props.optionFilterProp

```javascript
<CascadeSelect
  options={this.state.options}
  showSearch={true}
  optionFilterProps={['label']}
  optionFilterCount={10}
/>
```

## 只用面板

只是用面板时 props.value 必须是受控模式

```javascript
<CascadeSelect.CascadeSubmenu
  options={options}
  value={this.state.value}
  onChange={(value) => {
    this.setState({ value });
  }}
  renderCustomItem={(item) => {
    return <span style={{ color: 'red' }}>{item.label}</span>
  }}
/>
```

### CascadeSelect.CascadeSubmenu.props

| Name | Type | Required | Default | Comments |
| --- | --- | --- | --- | --- |
| value | array | Yes | [] | 受控值
| options | array | Yes | [] | 候选集，格式参考上方
| onChange | function | Yes | null | value 改变的回调函数
| columnWidth | number | No | null | 每一列的宽度
| cascaderHeight | number | NO | null | 级联选择区域的高度
| renderCustomItem | function | No | null | 自定义渲染选项