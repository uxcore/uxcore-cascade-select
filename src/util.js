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

const i18n = (key, locale = 'zh_CN') => {
  const langs = {};

  langs.zh_CN = {
    placeholder: '请选择',
  };

  langs.en_US = {
    placeholder: 'Please select',
  };

  return langs[locale][key] || '';
};

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
      if (`${options[i].value}_` === `${value[0]}_`) {
        return getOptions(options[i].children, value.slice(1), level - 1);
      }
    }
  }
  return [];
};

export default {
  find,
  i18n,
  getArrayLeafItemContains,
  deepCopy,
  getOptions,
};
