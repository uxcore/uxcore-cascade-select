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

export default {
  find,
};

