# uxcore-cascade-select

API Document.

## API

```javascript
import CascadeSelect from 'uxcore-cascade-select'
import { render } from 'react-dom'

render(<CascadeSelect />, document.getElementById('root'))
```

## Props
| Name | Type | Required | Default | Comments |
|---|---|---|---|---|
| className | string | false | '' | 自定义类名 |
| options | object | false | null | 可选项数据源，格式可见下方Demo |
| defaultValue | array | false | null | 默认值 |
| placeholder | string | false | 'Please Select' or '请选择' | placeholder |
| onChange | `function(value, selectedOptions)` | false | null | 选择完成后回调 |
| disabled | boolean | false | false | 是否禁用 |
| clearable | boolean | false | false | 是否支持清除 |
| changeOnSelect | boolean | false | false | 是否将每次选择立刻显示在控件中 |
| expandTrigger | 次级菜单展开方式 | string | 'click' | 次级菜单展开方式，支持 click 和 hover |
| beforeRender | 选择后展示的渲染函数 | `function(label, selectedOptions)` | `label => label.join(' / ')` | 处理要显示的内容 |

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
