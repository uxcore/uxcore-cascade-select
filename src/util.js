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

const getArrayLeafItemContainsKey = (array, key, nLevel = 0, aRet = []) => {
  let level = nLevel;
  const ret = aRet;
  console.log(array);
  for (let i = 0, l = array.length; i < l; i++) {
    if (array[i].children) {
      getArrayLeafItemContainsKey(array[i].children, key, ++level, ret);
    } else if (`${array[i].value}_` === `${key}_`) {
      console.log(array);
      ret[level] = key;
    }
  }
  return ret;
};

export default {
  find,
  i18n,
  getArrayLeafItemContainsKey,
};

