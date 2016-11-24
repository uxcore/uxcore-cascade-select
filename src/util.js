const supportNativeFind = !!Array.prototype.find;

exports.find = (() => {
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

const getLevel = (ary, level) => {
  const levels = ary.filter(o => Array.isArray(o.children))
    .map(o => getLevel(o.children, level));
  let max;
  if (levels.length > 0) {
    max = Math.max.apply(null, levels);
  } else {
    max = 0;
  }
  return max + level;
};

exports.getTreeLevel = data => getLevel(data, 1);

