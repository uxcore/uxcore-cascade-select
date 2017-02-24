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

const getArrayLeafItemContains = (arr, key, aCache = [], aParents = []) => {
  const cache = aCache;
  const array = JSON.parse(JSON.stringify(arr));
  for (let i = 0, l = array.length; i < l; i++) {
    cache[cache.length] = (array[i]);
    if (aParents.length > 0) {
      array[i].parents = aParents;
    }
    if (array[i].children) {
      const parents = aParents.concat([array[i]]);
      getArrayLeafItemContains(array[i].children, key, cache, parents);
      delete array[i].children;
    }
    aParents = []; // 一组循环结束清除当前 parents 标记
  }
  for (let i = 0, l = cache.length; i < l; i++) {
    if (`${cache[i].value}_` === `${key}_`) {
      return cache[i].parents ? cache[i].parents.concat([cache[i]]) : [cache[i]];
    }
  }
  return []; // 当用户传递了一个不存在的key时会返回空数组
};

export default {
  find,
  i18n,
  getArrayLeafItemContains,
};
