const supportNativeFind = !!Array.prototype.find;

const find = (() => {
  if (supportNativeFind) {
    return (ary, ...params) => ary.find(...params);
  }
  return (ary, predicate) => {
    if (this === null) {
      throw new TypeError('find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    const length = ary.length >>> 0;
    const ctx = arguments[2];
    let value;

    for (let i = 0; i < length; i++) {
      value = ary[i];
      if (predicate.call(ctx, value, i, ary)) {
        return value;
      }
    }
    return undefined;
  };
})();

const deepCopy = o => JSON.parse(JSON.stringify(o));

const getArrayLeafItemContains = (options, keyArr) => {
  let position;
  let isFound = false;
  const selectedOptions = [];
  function recursion(opts, pos = '0') {
    opts.forEach((opt, index) => {
      if (isFound) return;
      if (`${keyArr[0]}_` === `${opt.value}_`) {
        position = `${pos}-${index}`;
        isFound = true;
      }
      if (opt.children) {
        recursion(opt.children, `${pos}-${index}`);
      }
    });
  }
  recursion(options);
  if (!position) return [];
  let parents = options;
  position.split('-').slice(1).forEach((pos) => {
    selectedOptions.push(parents[pos]);
    parents = parents[pos].children;
  });

  return selectedOptions;
};

const getOptions = (options, value = [], level = 0) => {
  if (level === 0 && options) {
    return options;
  }
  if (value.length) {
    for (let i = 0, l = options.length; i < l; i++) {
      if (`${options[i].value}_` === `${value[0]}_` && options[i].children) {
        return getOptions(options[i].children, value.slice(1), level - 1);
      }
    }
  }
  return [];
};

const stringify = val => JSON.stringify(val);

/** 将 options 结构转换成拍平数组，同时使用传入的关键词进行过滤 */
const searchArrayOfOptions = (
  {
    options,
    keywords,
    filterProps,
    filterCount,
  },
  parentName = [],
  parentValue = [],
  parentKeywords = [],
  data = [],
  level = 0,
) => {
  for (let i = 0, l = options.length; i < l; i++) {
    if (data.length >= filterCount) {
      break;
    }

    parentName = parentName.slice(0, level); // eslint-disable-line
    parentValue = parentValue.slice(0, level); // eslint-disable-line
    parentKeywords = parentKeywords.slice(0, level); // eslint-disable-line
    const optionsItem = options[i];
    parentName.push(optionsItem.label);
    parentValue.push(optionsItem.value);
    if (filterProps && filterProps.length > 0) {
      const myKeywords = [];
      filterProps.forEach((propName) => { // eslint-disable-line
        if (optionsItem[propName]) {
          myKeywords.push(optionsItem[propName]);
        }
      });
      parentKeywords.push(myKeywords.join('_'));
    }

    if (optionsItem.children) {
      searchArrayOfOptions({
        options: optionsItem.children,
        keywords,
        filterProps,
        filterCount,
      }, parentName, parentValue, parentKeywords, data, level + 1);
    } else {
      const dataItem = {
        id: parentValue.join('_'),
        label: parentName.join(' / '),
        value: parentValue,
        keywords: parentKeywords.join('_'),
      };
      if (dataItem.keywords.toUpperCase().indexOf(keywords.toUpperCase()) > -1) {
        data.push(dataItem);
      }
    }
  }

  return data;
};

function isEmptyArray(o) {
  return !o || o.length === 0;
}

export default {
  find,
  getArrayLeafItemContains,
  deepCopy,
  getOptions,
  stringify,
  searchArrayOfOptions,
  isEmptyArray,
};
