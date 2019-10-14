# history

## 0.7.19

* `FIX` 当 isMustSelectLeaf 为 true ，外部又设置过 ['leafCode'] 这种只有叶子节点的值时，会造成无法回填及二次选择。

## 0.7.18

* `FEAT` async load will be occurred after clicking a item of search result.

## 0.7.17

* `FIX` state not change when component destroy

## 0.7.16

* `FIX` fix autocomplete dropdown max height 

## 0.7.15

* `UPDATE` optionFilter ignore camel-case.

## 0.7.14

* `FIXED` modified option[].children empty logic.

## 0.7.13

* `FIXED` Can not get the right value when there is not any children and isMustSelectLeaf=true.
* `ADD` Separate the CascadeSubmenu Component.
* `ADD` props.cascaderHeight

## 0.7.12

* `CHANGED` style adjustment

## 0.7.11

* `FIXED` can not clear value from outside.

## 0.7.10

* `CHANGED` support js style export

## 0.7.9

* `NEW`: New feature, new props optionFilterProps and optionFilterCount for filter by keywords

## 0.7.8

* `FIXED`: onOk click should not occurred when isMustLeaf is true

## 0.7.7

* `FIXED`: Fix column width.

## 0.7.6

* `FIXED` Display props.value when options is empty at runtime.

## 0.7.5

* `NEW` Display value when options not found.

## 0.7.4

* `FIXED` The selected text could not be displayed in the input when showSearch is true.

## 0.7.3

* `NEW` add 'dropdownClassName' prop
* `NEW` add 'showSearch' and 'onSearch' prop

## 0.7.2

* `NEW` add description display feature

## 0.7.1

* `CHANGED` update `uxcore-dropdown` to `^0.5.0`
* `CHANGED` update `uxcore-select2` to `^0.5.0`

## 0.7.0

* `CHANGED`: upgrade react16

## 0.6.4

* `FIXED`: placeholder color follow Select2 placeholder color.

## 0.6.3

* `FIXED`: Could not occur onChange by clicking clear button when props.isMustSelectLeaf is true.

## 0.6.2

* `FIXED`: get selectedOptions error

## 0.6.1

* `FIXED`: fixed selectedOptions[0].hasOwnProperty error

## 0.6.0

* `FIXED`: modified disabled style priority.
* `CHANGED`: updated dropdown dom structure and style.

## 0.5.8

* `FIXED`: revert to 0.5.6

## 0.5.7

* `FIXED`: modified disabled style priority.

## 0.5.6

* `FIXED`: could not clear display-value from outside.

## 0.5.5

* `CHANGED`: optimized visual display

## 0.5.4

* `FIXED`: the component's height has 2 px more in the small or middle size mode.

## 0.5.3

* `FIXED`: the selection has no display result after clear the first selection.

## 0.5.2

* `FIXED`: input has duplicated onChange event in IE11 browser under search mode.

## 0.5.1

* `NEW`: searchOption prop
* `NEW`: 'search' option of displayMode
* `FIXED`: give value before options could not display the result

## 0.5.0

* `NEW`: onSelect prop

## 0.4.1

* `NEW`: isMustSelectLeaf: whether or not to select the leaf option

## 0.4.0

* `CHANGED`: react 15

## 0.3.5

* `NEW`: size prop

## 0.3.4

* `NEW`: columnWidth prop, remove dropDownWidth prop

## 0.3.3

* `FIXED`: hover and focus color.

## 0.3.2

* `FIXED`: arrow color.

## 0.3.1

* `FIXED`: default color is transparent.

## 0.3.0

* `New Feature`: add select display mode.

## 0.2.11

* `NEW`: trigger onChange when on click `the ok button`.

## 0.2.10

* `FIXED`: display selection text immediately when the `changeOnSelect=true`

## 0.2.9

* `FIXED`: `dropDownWidth` prop type check.

## 0.2.8

* `NEW`: new prop, `dropDownWidth`(number): define the dropdown width.

## 0.2.7

* `NEW`: new display mode, `miniMode=false` will display the rich style with button and selection.

## 0.2.3

* `CHANGED` update i18n.

## 0.2.2

* `NEW`: Pass the only `[key]` as the value will be treated as the choosed leaf **key**.
* `FIXED`: `e.stopPropagation()` when click the clear button.

## 0.2.1

* `NEW` add new prop `getPopupContainer`

## 0.2.0

* `CHANGED` update `uxcore-dropdown` to `~0.4.0`

## 0.1.12

* `FIXED` even if default value is error, options should show correctly [#11](https://github.com/uxcore/uxcore-cascade-select/issues/11)

## 0.1.11

* `FIXED` throw error if options cannot match value [#9](https://github.com/uxcore/uxcore-cascade-select/issues/9)

## 0.1.10

* `CHANGED` another efficient way to fix issue #7

## 0.1.9

* `CHANGED` subMenu won't be hide before selected options's length is larger than cascadeSize when cascadeSize is not equal to options level. [#7](https://github.com/uxcore/uxcore-cascade-select/issues/7)

## 0.1.8

* `FIXED` add support for browsers that does not implement array.prototype.find. 

## 0.1.7

* `CHANGED` beforeRender default value optimazition

## 0.1.6

* `FIXED` input height bug

## 0.1.5

* `FIXED` fix value/onChange logic

## 0.1.4

* `CHANGED` remove dependency rc-trigger (trigger bug has been fixed)

## 0.1.3

* `FIXED` specify rc-trigger@~1.6.0 
