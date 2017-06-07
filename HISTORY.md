# history

## 0.3.4

* `ADD`: columnWidth prop, remove dropDownWidth prop

## 0.3.3

* `FIXED`: hover and focus color.

## 0.3.2

* `FIXED`: arrow color.

## 0.3.1

* `FIXED`: default color is transparent.

## 0.3.0

* `New Feature`: add select display mode.

## 0.2.11

* `ADD`: trigger onChange when on click `the ok button`.

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