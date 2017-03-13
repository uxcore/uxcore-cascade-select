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

const getArrayLeafItemContains = (options, keyArr, p = [], c = [], level = 1) => {
  let parents = deepCopy(p);
  let cache = deepCopy(c);
  for (let i = 0, l = options.length; i < l; i++) {
    if (level === 1) {
      cache = [];
      parents = [];
    }
    if (`${keyArr[0]}_` === `${options[i].value}_`) {
      const mySelf = deepCopy(options[i]);
      delete mySelf.children;
      if (parents && parents.length) {
        cache = cache.concat(parents, [mySelf]);
      } else {
        cache.push(mySelf);
      }
      return cache;
    } else if (options[i].children && options[i].children.length) {
      const mySelf = deepCopy(options[i]);
      delete mySelf.children;
      parents[level - 1] = mySelf;
      const ret = getArrayLeafItemContains(options[i].children, keyArr, parents, cache, level + 1);
      if (ret && ret.length) {
        return ret;
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
};
