(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var ProtoSparker = (function () {
	'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	  this.size = 0;
	}

	var _listCacheClear = listCacheClear;

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	var eq_1 = eq;

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq_1(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}

	var _assocIndexOf = assocIndexOf;

	/** Used for built-in method references. */
	var arrayProto = Array.prototype;

	/** Built-in value references. */
	var splice = arrayProto.splice;

	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = _assocIndexOf(data, key);

	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  --this.size;
	  return true;
	}

	var _listCacheDelete = listCacheDelete;

	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = _assocIndexOf(data, key);

	  return index < 0 ? undefined : data[index][1];
	}

	var _listCacheGet = listCacheGet;

	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return _assocIndexOf(this.__data__, key) > -1;
	}

	var _listCacheHas = listCacheHas;

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = _assocIndexOf(data, key);

	  if (index < 0) {
	    ++this.size;
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	var _listCacheSet = listCacheSet;

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `ListCache`.
	ListCache.prototype.clear = _listCacheClear;
	ListCache.prototype['delete'] = _listCacheDelete;
	ListCache.prototype.get = _listCacheGet;
	ListCache.prototype.has = _listCacheHas;
	ListCache.prototype.set = _listCacheSet;

	var _ListCache = ListCache;

	/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */
	function stackClear() {
	  this.__data__ = new _ListCache;
	  this.size = 0;
	}

	var _stackClear = stackClear;

	/**
	 * Removes `key` and its value from the stack.
	 *
	 * @private
	 * @name delete
	 * @memberOf Stack
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function stackDelete(key) {
	  var data = this.__data__,
	      result = data['delete'](key);

	  this.size = data.size;
	  return result;
	}

	var _stackDelete = stackDelete;

	/**
	 * Gets the stack value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Stack
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function stackGet(key) {
	  return this.__data__.get(key);
	}

	var _stackGet = stackGet;

	/**
	 * Checks if a stack value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Stack
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function stackHas(key) {
	  return this.__data__.has(key);
	}

	var _stackHas = stackHas;

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

	var _freeGlobal = freeGlobal;

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = _freeGlobal || freeSelf || Function('return this')();

	var _root = root;

	/** Built-in value references. */
	var Symbol = _root.Symbol;

	var _Symbol = Symbol;

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/** Built-in value references. */
	var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty.call(value, symToStringTag),
	      tag = value[symToStringTag];

	  try {
	    value[symToStringTag] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag] = tag;
	    } else {
	      delete value[symToStringTag];
	    }
	  }
	  return result;
	}

	var _getRawTag = getRawTag;

	/** Used for built-in method references. */
	var objectProto$1 = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString$1 = objectProto$1.toString;

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString$1.call(value);
	}

	var _objectToString = objectToString;

	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';

	/** Built-in value references. */
	var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag$1 && symToStringTag$1 in Object(value))
	    ? _getRawTag(value)
	    : _objectToString(value);
	}

	var _baseGetTag = baseGetTag;

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}

	var isObject_1 = isObject;

	/** `Object#toString` result references. */
	var asyncTag = '[object AsyncFunction]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    proxyTag = '[object Proxy]';

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  if (!isObject_1(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = _baseGetTag(value);
	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}

	var isFunction_1 = isFunction;

	/** Used to detect overreaching core-js shims. */
	var coreJsData = _root['__core-js_shared__'];

	var _coreJsData = coreJsData;

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}

	var _isMasked = isMasked;

	/** Used for built-in method references. */
	var funcProto = Function.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to convert.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	var _toSource = toSource;

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for built-in method references. */
	var funcProto$1 = Function.prototype,
	    objectProto$2 = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString$1 = funcProto$1.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject_1(value) || _isMasked(value)) {
	    return false;
	  }
	  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
	  return pattern.test(_toSource(value));
	}

	var _baseIsNative = baseIsNative;

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}

	var _getValue = getValue;

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = _getValue(object, key);
	  return _baseIsNative(value) ? value : undefined;
	}

	var _getNative = getNative;

	/* Built-in method references that are verified to be native. */
	var Map = _getNative(_root, 'Map');

	var _Map = Map;

	/* Built-in method references that are verified to be native. */
	var nativeCreate = _getNative(Object, 'create');

	var _nativeCreate = nativeCreate;

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
	  this.size = 0;
	}

	var _hashClear = hashClear;

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
	  var result = this.has(key) && delete this.__data__[key];
	  this.size -= result ? 1 : 0;
	  return result;
	}

	var _hashDelete = hashDelete;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/** Used for built-in method references. */
	var objectProto$3 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (_nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
	}

	var _hashGet = hashGet;

	/** Used for built-in method references. */
	var objectProto$4 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
	}

	var _hashHas = hashHas;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  this.size += this.has(key) ? 0 : 1;
	  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
	  return this;
	}

	var _hashSet = hashSet;

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `Hash`.
	Hash.prototype.clear = _hashClear;
	Hash.prototype['delete'] = _hashDelete;
	Hash.prototype.get = _hashGet;
	Hash.prototype.has = _hashHas;
	Hash.prototype.set = _hashSet;

	var _Hash = Hash;

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.size = 0;
	  this.__data__ = {
	    'hash': new _Hash,
	    'map': new (_Map || _ListCache),
	    'string': new _Hash
	  };
	}

	var _mapCacheClear = mapCacheClear;

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	var _isKeyable = isKeyable;

	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return _isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}

	var _getMapData = getMapData;

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  var result = _getMapData(this, key)['delete'](key);
	  this.size -= result ? 1 : 0;
	  return result;
	}

	var _mapCacheDelete = mapCacheDelete;

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return _getMapData(this, key).get(key);
	}

	var _mapCacheGet = mapCacheGet;

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return _getMapData(this, key).has(key);
	}

	var _mapCacheHas = mapCacheHas;

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  var data = _getMapData(this, key),
	      size = data.size;

	  data.set(key, value);
	  this.size += data.size == size ? 0 : 1;
	  return this;
	}

	var _mapCacheSet = mapCacheSet;

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `MapCache`.
	MapCache.prototype.clear = _mapCacheClear;
	MapCache.prototype['delete'] = _mapCacheDelete;
	MapCache.prototype.get = _mapCacheGet;
	MapCache.prototype.has = _mapCacheHas;
	MapCache.prototype.set = _mapCacheSet;

	var _MapCache = MapCache;

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/**
	 * Sets the stack `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Stack
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the stack cache instance.
	 */
	function stackSet(key, value) {
	  var data = this.__data__;
	  if (data instanceof _ListCache) {
	    var pairs = data.__data__;
	    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
	      pairs.push([key, value]);
	      this.size = ++data.size;
	      return this;
	    }
	    data = this.__data__ = new _MapCache(pairs);
	  }
	  data.set(key, value);
	  this.size = data.size;
	  return this;
	}

	var _stackSet = stackSet;

	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Stack(entries) {
	  var data = this.__data__ = new _ListCache(entries);
	  this.size = data.size;
	}

	// Add methods to `Stack`.
	Stack.prototype.clear = _stackClear;
	Stack.prototype['delete'] = _stackDelete;
	Stack.prototype.get = _stackGet;
	Stack.prototype.has = _stackHas;
	Stack.prototype.set = _stackSet;

	var _Stack = Stack;

	/** Used to stand-in for `undefined` hash values. */

	/**
	 * Checks if `value` is in the array cache.
	 *
	 * @private
	 * @name has
	 * @memberOf SetCache
	 * @param {*} value The value to search for.
	 * @returns {number} Returns `true` if `value` is found, else `false`.
	 */

	/**
	 * A specialized version of `_.some` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {boolean} Returns `true` if any element passes the predicate check,
	 *  else `false`.
	 */

	/**
	 * Checks if a `cache` value for `key` exists.
	 *
	 * @private
	 * @param {Object} cache The cache to query.
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */

	/** Built-in value references. */
	var Uint8Array = _root.Uint8Array;

	var _Uint8Array = Uint8Array;

	/**
	 * Converts `map` to its key-value pairs.
	 *
	 * @private
	 * @param {Object} map The map to convert.
	 * @returns {Array} Returns the key-value pairs.
	 */

	/**
	 * Converts `set` to an array of its values.
	 *
	 * @private
	 * @param {Object} set The set to convert.
	 * @returns {Array} Returns the values.
	 */

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = _Symbol ? _Symbol.prototype : undefined,
	    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

	/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;

	var isArray_1 = isArray;

	/**
	 * A specialized version of `_.filter` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 */

	/**
	 * This method returns a new empty array.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {Array} Returns the new empty array.
	 * @example
	 *
	 * var arrays = _.times(2, _.stubArray);
	 *
	 * console.log(arrays);
	 * // => [[], []]
	 *
	 * console.log(arrays[0] === arrays[1]);
	 * // => false
	 */

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);

	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}

	var _baseTimes = baseTimes;

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}

	var isObjectLike_1 = isObjectLike;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';

	/**
	 * The base implementation of `_.isArguments`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 */
	function baseIsArguments(value) {
	  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
	}

	var _baseIsArguments = baseIsArguments;

	/** Used for built-in method references. */
	var objectProto$6 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

	/** Built-in value references. */
	var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
	  return isObjectLike_1(value) && hasOwnProperty$4.call(value, 'callee') &&
	    !propertyIsEnumerable$1.call(value, 'callee');
	};

	var isArguments_1 = isArguments;

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}

	var stubFalse_1 = stubFalse;

	var isBuffer_1 = createCommonjsModule(function (module, exports) {
	/** Detect free variable `exports`. */
	var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Built-in value references. */
	var Buffer = moduleExports ? _root.Buffer : undefined;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

	/**
	 * Checks if `value` is a buffer.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	 * @example
	 *
	 * _.isBuffer(new Buffer(2));
	 * // => true
	 *
	 * _.isBuffer(new Uint8Array(2));
	 * // => false
	 */
	var isBuffer = nativeIsBuffer || stubFalse_1;

	module.exports = isBuffer;
	});

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  var type = typeof value;
	  length = length == null ? MAX_SAFE_INTEGER : length;

	  return !!length &&
	    (type == 'number' ||
	      (type != 'symbol' && reIsUint.test(value))) &&
	        (value > -1 && value % 1 == 0 && value < length);
	}

	var _isIndex = isIndex;

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER$1 = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
	}

	var isLength_1 = isLength;

	/** `Object#toString` result references. */
	var argsTag$1 = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag$1 = '[object Boolean]',
	    dateTag$1 = '[object Date]',
	    errorTag$1 = '[object Error]',
	    funcTag$1 = '[object Function]',
	    mapTag$1 = '[object Map]',
	    numberTag$1 = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag$1 = '[object RegExp]',
	    setTag$1 = '[object Set]',
	    stringTag$1 = '[object String]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag$1 = '[object ArrayBuffer]',
	    dataViewTag$1 = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag$1] = typedArrayTags[boolTag$1] =
	typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag$1] =
	typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] =
	typedArrayTags[mapTag$1] = typedArrayTags[numberTag$1] =
	typedArrayTags[objectTag] = typedArrayTags[regexpTag$1] =
	typedArrayTags[setTag$1] = typedArrayTags[stringTag$1] =
	typedArrayTags[weakMapTag] = false;

	/**
	 * The base implementation of `_.isTypedArray` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 */
	function baseIsTypedArray(value) {
	  return isObjectLike_1(value) &&
	    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
	}

	var _baseIsTypedArray = baseIsTypedArray;

	/**
	 * The base implementation of `_.unary` without support for storing metadata.
	 *
	 * @private
	 * @param {Function} func The function to cap arguments for.
	 * @returns {Function} Returns the new capped function.
	 */
	function baseUnary(func) {
	  return function(value) {
	    return func(value);
	  };
	}

	var _baseUnary = baseUnary;

	var _nodeUtil = createCommonjsModule(function (module, exports) {
	/** Detect free variable `exports`. */
	var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Detect free variable `process` from Node.js. */
	var freeProcess = moduleExports && _freeGlobal.process;

	/** Used to access faster Node.js helpers. */
	var nodeUtil = (function() {
	  try {
	    return freeProcess && freeProcess.binding && freeProcess.binding('util');
	  } catch (e) {}
	}());

	module.exports = nodeUtil;
	});

	/* Node.js helper references. */
	var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

	var isTypedArray_1 = isTypedArray;

	/** Used for built-in method references. */
	var objectProto$7 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
	  var isArr = isArray_1(value),
	      isArg = !isArr && isArguments_1(value),
	      isBuff = !isArr && !isArg && isBuffer_1(value),
	      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
	      skipIndexes = isArr || isArg || isBuff || isType,
	      result = skipIndexes ? _baseTimes(value.length, String) : [],
	      length = result.length;

	  for (var key in value) {
	    if ((inherited || hasOwnProperty$5.call(value, key)) &&
	        !(skipIndexes && (
	           // Safari 9 has enumerable `arguments.length` in strict mode.
	           key == 'length' ||
	           // Node.js 0.10 has enumerable non-index properties on buffers.
	           (isBuff && (key == 'offset' || key == 'parent')) ||
	           // PhantomJS 2 has enumerable non-index properties on typed arrays.
	           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
	           // Skip index properties.
	           _isIndex(key, length)
	        ))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _arrayLikeKeys = arrayLikeKeys;

	/** Used for built-in method references. */
	var objectProto$8 = Object.prototype;

	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$8;

	  return value === proto;
	}

	var _isPrototype = isPrototype;

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	var _overArg = overArg;

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength_1(value.length) && !isFunction_1(value);
	}

	var isArrayLike_1 = isArrayLike;

	/* Built-in method references that are verified to be native. */
	var DataView = _getNative(_root, 'DataView');

	var _DataView = DataView;

	/* Built-in method references that are verified to be native. */
	var Promise = _getNative(_root, 'Promise');

	var _Promise = Promise;

	/* Built-in method references that are verified to be native. */
	var Set = _getNative(_root, 'Set');

	var _Set = Set;

	/* Built-in method references that are verified to be native. */
	var WeakMap = _getNative(_root, 'WeakMap');

	var _WeakMap = WeakMap;

	/** `Object#toString` result references. */
	var mapTag$2 = '[object Map]',
	    objectTag$1 = '[object Object]',
	    promiseTag = '[object Promise]',
	    setTag$2 = '[object Set]',
	    weakMapTag$1 = '[object WeakMap]';

	var dataViewTag$2 = '[object DataView]';

	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = _toSource(_DataView),
	    mapCtorString = _toSource(_Map),
	    promiseCtorString = _toSource(_Promise),
	    setCtorString = _toSource(_Set),
	    weakMapCtorString = _toSource(_WeakMap);

	/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	var getTag = _baseGetTag;

	// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
	if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
	    (_Map && getTag(new _Map) != mapTag$2) ||
	    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
	    (_Set && getTag(new _Set) != setTag$2) ||
	    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
	  getTag = function(value) {
	    var result = _baseGetTag(value),
	        Ctor = result == objectTag$1 ? value.constructor : undefined,
	        ctorString = Ctor ? _toSource(Ctor) : '';

	    if (ctorString) {
	      switch (ctorString) {
	        case dataViewCtorString: return dataViewTag$2;
	        case mapCtorString: return mapTag$2;
	        case promiseCtorString: return promiseTag;
	        case setCtorString: return setTag$2;
	        case weakMapCtorString: return weakMapTag$1;
	      }
	    }
	    return result;
	  };
	}

	/**
	 * A specialized version of `matchesProperty` for source values suitable
	 * for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @param {*} srcValue The value to match.
	 * @returns {Function} Returns the new spec function.
	 */

	/** Error message constants. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/**
	 * Creates a function that memoizes the result of `func`. If `resolver` is
	 * provided, it determines the cache key for storing the result based on the
	 * arguments provided to the memoized function. By default, the first argument
	 * provided to the memoized function is used as the map cache key. The `func`
	 * is invoked with the `this` binding of the memoized function.
	 *
	 * **Note:** The cache is exposed as the `cache` property on the memoized
	 * function. Its creation may be customized by replacing the `_.memoize.Cache`
	 * constructor with one whose instances implement the
	 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
	 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to have its output memoized.
	 * @param {Function} [resolver] The function to resolve the cache key.
	 * @returns {Function} Returns the new memoized function.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': 2 };
	 * var other = { 'c': 3, 'd': 4 };
	 *
	 * var values = _.memoize(_.values);
	 * values(object);
	 * // => [1, 2]
	 *
	 * values(other);
	 * // => [3, 4]
	 *
	 * object.a = 2;
	 * values(object);
	 * // => [1, 2]
	 *
	 * // Modify the result cache.
	 * values.cache.set(object, ['a', 'b']);
	 * values(object);
	 * // => ['a', 'b']
	 *
	 * // Replace `_.memoize.Cache`.
	 * _.memoize.Cache = WeakMap;
	 */
	function memoize(func, resolver) {
	  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  var memoized = function() {
	    var args = arguments,
	        key = resolver ? resolver.apply(this, args) : args[0],
	        cache = memoized.cache;

	    if (cache.has(key)) {
	      return cache.get(key);
	    }
	    var result = func.apply(this, args);
	    memoized.cache = cache.set(key, result) || cache;
	    return result;
	  };
	  memoized.cache = new (memoize.Cache || _MapCache);
	  return memoized;
	}

	// Expose `MapCache`.
	memoize.Cache = _MapCache;

	var memoize_1 = memoize;

	/** Used as the maximum memoize cache size. */
	var MAX_MEMOIZE_SIZE = 500;

	/**
	 * A specialized version of `_.memoize` which clears the memoized function's
	 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
	 *
	 * @private
	 * @param {Function} func The function to have its output memoized.
	 * @returns {Function} Returns the new memoized function.
	 */
	function memoizeCapped(func) {
	  var result = memoize_1(func, function(key) {
	    if (cache.size === MAX_MEMOIZE_SIZE) {
	      cache.clear();
	    }
	    return key;
	  });

	  var cache = result.cache;
	  return result;
	}

	var _memoizeCapped = memoizeCapped;

	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;

	/**
	 * Converts `string` to a property path array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the property path array.
	 */
	var stringToPath = _memoizeCapped(function(string) {
	  var result = [];
	  if (string.charCodeAt(0) === 46 /* . */) {
	    result.push('');
	  }
	  string.replace(rePropName, function(match, number, quote, subString) {
	    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	});

	/**
	 * A specialized version of `_.map` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */

	/** Used to convert symbols to primitives and strings. */
	var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
	    symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

	/**
	 * The base implementation of `_.hasIn` without support for deep paths.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */

	/**
	 * This method returns the first argument it receives.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 *
	 * console.log(_.identity(object) === object);
	 * // => true
	 */
	function identity(value) {
	  return value;
	}

	var identity_1 = identity;

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */

	/**
	 * The base implementation of `_.findIndex` and `_.findLastIndex` without
	 * support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {number} fromIndex The index to search from.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */

	/**
	 * The base implementation of `_.isNaN` without support for number objects.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	 */

	/**
	 * A specialized version of `_.indexOf` which performs strict equality
	 * comparisons of values, i.e. `===`.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */

	/**
	 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var index = -1,
	        iterable = Object(object),
	        props = keysFunc(object),
	        length = props.length;

	    while (length--) {
	      var key = props[fromRight ? length : ++index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}

	var _createBaseFor = createBaseFor;

	/**
	 * The base implementation of `baseForOwn` which iterates over `object`
	 * properties returned by `keysFunc` and invokes `iteratee` for each property.
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = _createBaseFor();

	var _baseFor = baseFor;

	var defineProperty = (function() {
	  try {
	    var func = _getNative(Object, 'defineProperty');
	    func({}, '', {});
	    return func;
	  } catch (e) {}
	}());

	var _defineProperty = defineProperty;

	/**
	 * The base implementation of `assignValue` and `assignMergeValue` without
	 * value checks.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function baseAssignValue(object, key, value) {
	  if (key == '__proto__' && _defineProperty) {
	    _defineProperty(object, key, {
	      'configurable': true,
	      'enumerable': true,
	      'value': value,
	      'writable': true
	    });
	  } else {
	    object[key] = value;
	  }
	}

	var _baseAssignValue = baseAssignValue;

	/**
	 * This function is like `assignValue` except that it doesn't assign
	 * `undefined` values.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignMergeValue(object, key, value) {
	  if ((value !== undefined && !eq_1(object[key], value)) ||
	      (value === undefined && !(key in object))) {
	    _baseAssignValue(object, key, value);
	  }
	}

	var _assignMergeValue = assignMergeValue;

	var _cloneBuffer = createCommonjsModule(function (module, exports) {
	/** Detect free variable `exports`. */
	var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Built-in value references. */
	var Buffer = moduleExports ? _root.Buffer : undefined,
	    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

	/**
	 * Creates a clone of  `buffer`.
	 *
	 * @private
	 * @param {Buffer} buffer The buffer to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Buffer} Returns the cloned buffer.
	 */
	function cloneBuffer(buffer, isDeep) {
	  if (isDeep) {
	    return buffer.slice();
	  }
	  var length = buffer.length,
	      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

	  buffer.copy(result);
	  return result;
	}

	module.exports = cloneBuffer;
	});

	/**
	 * Creates a clone of `arrayBuffer`.
	 *
	 * @private
	 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
	 * @returns {ArrayBuffer} Returns the cloned array buffer.
	 */
	function cloneArrayBuffer(arrayBuffer) {
	  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
	  new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
	  return result;
	}

	var _cloneArrayBuffer = cloneArrayBuffer;

	/**
	 * Creates a clone of `typedArray`.
	 *
	 * @private
	 * @param {Object} typedArray The typed array to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned typed array.
	 */
	function cloneTypedArray(typedArray, isDeep) {
	  var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
	  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
	}

	var _cloneTypedArray = cloneTypedArray;

	/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */
	function copyArray(source, array) {
	  var index = -1,
	      length = source.length;

	  array || (array = Array(length));
	  while (++index < length) {
	    array[index] = source[index];
	  }
	  return array;
	}

	var _copyArray = copyArray;

	/** Built-in value references. */
	var objectCreate = Object.create;

	/**
	 * The base implementation of `_.create` without support for assigning
	 * properties to the created object.
	 *
	 * @private
	 * @param {Object} proto The object to inherit from.
	 * @returns {Object} Returns the new object.
	 */
	var baseCreate = (function() {
	  function object() {}
	  return function(proto) {
	    if (!isObject_1(proto)) {
	      return {};
	    }
	    if (objectCreate) {
	      return objectCreate(proto);
	    }
	    object.prototype = proto;
	    var result = new object;
	    object.prototype = undefined;
	    return result;
	  };
	}());

	var _baseCreate = baseCreate;

	/** Built-in value references. */
	var getPrototype = _overArg(Object.getPrototypeOf, Object);

	var _getPrototype = getPrototype;

	/**
	 * Initializes an object clone.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneObject(object) {
	  return (typeof object.constructor == 'function' && !_isPrototype(object))
	    ? _baseCreate(_getPrototype(object))
	    : {};
	}

	var _initCloneObject = initCloneObject;

	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike_1(value) && isArrayLike_1(value);
	}

	var isArrayLikeObject_1 = isArrayLikeObject;

	/** `Object#toString` result references. */
	var objectTag$3 = '[object Object]';

	/** Used for built-in method references. */
	var funcProto$2 = Function.prototype,
	    objectProto$12 = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString$2 = funcProto$2.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty$9 = objectProto$12.hasOwnProperty;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString$2.call(Object);

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag$3) {
	    return false;
	  }
	  var proto = _getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty$9.call(proto, 'constructor') && proto.constructor;
	  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
	    funcToString$2.call(Ctor) == objectCtorString;
	}

	var isPlainObject_1 = isPlainObject;

	/**
	 * Gets the value at `key`, unless `key` is "__proto__".
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function safeGet(object, key) {
	  return key == '__proto__'
	    ? undefined
	    : object[key];
	}

	var _safeGet = safeGet;

	/** Used for built-in method references. */
	var objectProto$13 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$10 = objectProto$13.hasOwnProperty;

	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty$10.call(object, key) && eq_1(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    _baseAssignValue(object, key, value);
	  }
	}

	var _assignValue = assignValue;

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
	  var isNew = !object;
	  object || (object = {});

	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];

	    var newValue = customizer
	      ? customizer(object[key], source[key], key, object, source)
	      : undefined;

	    if (newValue === undefined) {
	      newValue = source[key];
	    }
	    if (isNew) {
	      _baseAssignValue(object, key, newValue);
	    } else {
	      _assignValue(object, key, newValue);
	    }
	  }
	  return object;
	}

	var _copyObject = copyObject;

	/**
	 * This function is like
	 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * except that it includes inherited enumerable properties.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function nativeKeysIn(object) {
	  var result = [];
	  if (object != null) {
	    for (var key in Object(object)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _nativeKeysIn = nativeKeysIn;

	/** Used for built-in method references. */
	var objectProto$14 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$11 = objectProto$14.hasOwnProperty;

	/**
	 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeysIn(object) {
	  if (!isObject_1(object)) {
	    return _nativeKeysIn(object);
	  }
	  var isProto = _isPrototype(object),
	      result = [];

	  for (var key in object) {
	    if (!(key == 'constructor' && (isProto || !hasOwnProperty$11.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _baseKeysIn = baseKeysIn;

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
	}

	var keysIn_1 = keysIn;

	/**
	 * Converts `value` to a plain object flattening inherited enumerable string
	 * keyed properties of `value` to own properties of the plain object.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {Object} Returns the converted plain object.
	 * @example
	 *
	 * function Foo() {
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.assign({ 'a': 1 }, new Foo);
	 * // => { 'a': 1, 'b': 2 }
	 *
	 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
	 * // => { 'a': 1, 'b': 2, 'c': 3 }
	 */
	function toPlainObject(value) {
	  return _copyObject(value, keysIn_1(value));
	}

	var toPlainObject_1 = toPlainObject;

	/**
	 * A specialized version of `baseMerge` for arrays and objects which performs
	 * deep merges and tracks traversed objects enabling objects with circular
	 * references to be merged.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {string} key The key of the value to merge.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} mergeFunc The function to merge values.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
	  var objValue = _safeGet(object, key),
	      srcValue = _safeGet(source, key),
	      stacked = stack.get(srcValue);

	  if (stacked) {
	    _assignMergeValue(object, key, stacked);
	    return;
	  }
	  var newValue = customizer
	    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
	    : undefined;

	  var isCommon = newValue === undefined;

	  if (isCommon) {
	    var isArr = isArray_1(srcValue),
	        isBuff = !isArr && isBuffer_1(srcValue),
	        isTyped = !isArr && !isBuff && isTypedArray_1(srcValue);

	    newValue = srcValue;
	    if (isArr || isBuff || isTyped) {
	      if (isArray_1(objValue)) {
	        newValue = objValue;
	      }
	      else if (isArrayLikeObject_1(objValue)) {
	        newValue = _copyArray(objValue);
	      }
	      else if (isBuff) {
	        isCommon = false;
	        newValue = _cloneBuffer(srcValue, true);
	      }
	      else if (isTyped) {
	        isCommon = false;
	        newValue = _cloneTypedArray(srcValue, true);
	      }
	      else {
	        newValue = [];
	      }
	    }
	    else if (isPlainObject_1(srcValue) || isArguments_1(srcValue)) {
	      newValue = objValue;
	      if (isArguments_1(objValue)) {
	        newValue = toPlainObject_1(objValue);
	      }
	      else if (!isObject_1(objValue) || (srcIndex && isFunction_1(objValue))) {
	        newValue = _initCloneObject(srcValue);
	      }
	    }
	    else {
	      isCommon = false;
	    }
	  }
	  if (isCommon) {
	    // Recursively merge objects and arrays (susceptible to call stack limits).
	    stack.set(srcValue, newValue);
	    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
	    stack['delete'](srcValue);
	  }
	  _assignMergeValue(object, key, newValue);
	}

	var _baseMergeDeep = baseMergeDeep;

	/**
	 * The base implementation of `_.merge` without support for multiple sources.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} [customizer] The function to customize merged values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMerge(object, source, srcIndex, customizer, stack) {
	  if (object === source) {
	    return;
	  }
	  _baseFor(source, function(srcValue, key) {
	    if (isObject_1(srcValue)) {
	      stack || (stack = new _Stack);
	      _baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
	    }
	    else {
	      var newValue = customizer
	        ? customizer(_safeGet(object, key), srcValue, (key + ''), object, source, stack)
	        : undefined;

	      if (newValue === undefined) {
	        newValue = srcValue;
	      }
	      _assignMergeValue(object, key, newValue);
	    }
	  }, keysIn_1);
	}

	var _baseMerge = baseMerge;

	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply(func, thisArg, args) {
	  switch (args.length) {
	    case 0: return func.call(thisArg);
	    case 1: return func.call(thisArg, args[0]);
	    case 2: return func.call(thisArg, args[0], args[1]);
	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}

	var _apply = apply;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax$2 = Math.max;

	/**
	 * A specialized version of `baseRest` which transforms the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @param {Function} transform The rest array transform.
	 * @returns {Function} Returns the new function.
	 */
	function overRest(func, start, transform) {
	  start = nativeMax$2(start === undefined ? (func.length - 1) : start, 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax$2(args.length - start, 0),
	        array = Array(length);

	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    index = -1;
	    var otherArgs = Array(start + 1);
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = transform(array);
	    return _apply(func, this, otherArgs);
	  };
	}

	var _overRest = overRest;

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new constant function.
	 * @example
	 *
	 * var objects = _.times(2, _.constant({ 'a': 1 }));
	 *
	 * console.log(objects);
	 * // => [{ 'a': 1 }, { 'a': 1 }]
	 *
	 * console.log(objects[0] === objects[1]);
	 * // => true
	 */
	function constant(value) {
	  return function() {
	    return value;
	  };
	}

	var constant_1 = constant;

	/**
	 * The base implementation of `setToString` without support for hot loop shorting.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var baseSetToString = !_defineProperty ? identity_1 : function(func, string) {
	  return _defineProperty(func, 'toString', {
	    'configurable': true,
	    'enumerable': false,
	    'value': constant_1(string),
	    'writable': true
	  });
	};

	var _baseSetToString = baseSetToString;

	/** Used to detect hot functions by number of calls within a span of milliseconds. */
	var HOT_COUNT = 800,
	    HOT_SPAN = 16;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeNow = Date.now;

	/**
	 * Creates a function that'll short out and invoke `identity` instead
	 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
	 * milliseconds.
	 *
	 * @private
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new shortable function.
	 */
	function shortOut(func) {
	  var count = 0,
	      lastCalled = 0;

	  return function() {
	    var stamp = nativeNow(),
	        remaining = HOT_SPAN - (stamp - lastCalled);

	    lastCalled = stamp;
	    if (remaining > 0) {
	      if (++count >= HOT_COUNT) {
	        return arguments[0];
	      }
	    } else {
	      count = 0;
	    }
	    return func.apply(undefined, arguments);
	  };
	}

	var _shortOut = shortOut;

	/**
	 * Sets the `toString` method of `func` to return `string`.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var setToString = _shortOut(_baseSetToString);

	var _setToString = setToString;

	/**
	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 */
	function baseRest(func, start) {
	  return _setToString(_overRest(func, start, identity_1), func + '');
	}

	var _baseRest = baseRest;

	/**
	 * Checks if the given arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
	 *  else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject_1(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	        ? (isArrayLike_1(object) && _isIndex(index, object.length))
	        : (type == 'string' && index in object)
	      ) {
	    return eq_1(object[index], value);
	  }
	  return false;
	}

	var _isIterateeCall = isIterateeCall;

	/**
	 * Creates a function like `_.assign`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return _baseRest(function(object, sources) {
	    var index = -1,
	        length = sources.length,
	        customizer = length > 1 ? sources[length - 1] : undefined,
	        guard = length > 2 ? sources[2] : undefined;

	    customizer = (assigner.length > 3 && typeof customizer == 'function')
	      ? (length--, customizer)
	      : undefined;

	    if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    object = Object(object);
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, index, customizer);
	      }
	    }
	    return object;
	  });
	}

	var _createAssigner = createAssigner;

	/**
	 * This method is like `_.assign` except that it recursively merges own and
	 * inherited enumerable string keyed properties of source objects into the
	 * destination object. Source properties that resolve to `undefined` are
	 * skipped if a destination value exists. Array and plain object properties
	 * are merged recursively. Other objects and value types are overridden by
	 * assignment. Source objects are applied from left to right. Subsequent
	 * sources overwrite property assignments of previous sources.
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.5.0
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * var object = {
	 *   'a': [{ 'b': 2 }, { 'd': 4 }]
	 * };
	 *
	 * var other = {
	 *   'a': [{ 'c': 3 }, { 'e': 5 }]
	 * };
	 *
	 * _.merge(object, other);
	 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
	 */
	var merge = _createAssigner(function(object, source, srcIndex) {
	  _baseMerge(object, source, srcIndex);
	});

	var merge_1 = merge;

	var transitions = {
	  fade: function(nav, layerA, layerB, overlay) {
	    var transition;
	    return transition = {
	      layerA: {
	        show: {
	          opacity: 1,
	          options: {
	            time: timeDefault
	          }
	        },
	        hide: {
	          opacity: 0,
	          options: {
	            time: timeDefault
	          }
	        }
	      },
	      layerB: {
	        show: {
	          opacity: 1,
	          options: {
	            time: timeDefault
	          }
	        },
	        hide: {
	          opacity: 0,
	          options: {
	            time: timeDefault
	          }
	        }
	      }
	    };
	  },
	  slideUp: function(nav, layerA, layerB, overlay) {
	    var transition;
	    return transition = {
	      layerA: {
	        show: {
	          opacity: 1,
	          options: {
	            time: timeFast
	          }
	        },
	        hide: {
	          opacity: 0.5,
	          options: {
	            time: timeFast
	          }
	        }
	      },
	      layerB: {
	        show: {
	          y: 0,
	          opacity: 1,
	          options: {
	            time: timeDefault
	          }
	        },
	        hide: {
	          y: 500,
	          opacity: 0,
	          options: {
	            time: timeDefault
	          }
	        }
	      }
	    };
	  },
	  slideDown: function(nav, layerA, layerB, overlay) {
	    var transition;
	    return transition = {
	      layerA: {
	        show: {
	          opacity: 1,
	          options: {
	            time: timeFast
	          }
	        },
	        hide: {
	          opacity: 0.5,
	          options: {
	            time: timeFast
	          }
	        }
	      },
	      layerB: {
	        show: {
	          y: 0,
	          opacity: 1,
	          options: {
	            time: timeDefault
	          }
	        },
	        hide: {
	          y: -500,
	          opacity: 0,
	          options: {
	            time: timeDefault
	          }
	        }
	      }
	    };
	  },
	  slideLeft: function(nav, layerA, layerB, overlay) {
	    var transition;
	    return transition = {
	      layerA: {
	        show: {
	          opacity: 1,
	          options: {
	            time: timeFast
	          }
	        },
	        hide: {
	          opacity: 0.5,
	          options: {
	            time: timeFast
	          }
	        }
	      },
	      layerB: {
	        show: {
	          x: 0,
	          opacity: 1,
	          options: {
	            time: timeDefault
	          }
	        },
	        hide: {
	          x: 500,
	          opacity: 0,
	          options: {
	            time: timeDefault
	          }
	        }
	      }
	    };
	  },
	  slideRight: function(nav, layerA, layerB, overlay) {
	    var transition;
	    return transition = {
	      layerA: {
	        show: {
	          opacity: 1,
	          options: {
	            time: timeFast
	          }
	        },
	        hide: {
	          opacity: 0.5,
	          options: {
	            time: timeFast
	          }
	        }
	      },
	      layerB: {
	        show: {
	          x: 0,
	          opacity: 1,
	          options: {
	            time: timeDefault
	          }
	        },
	        hide: {
	          x: -500,
	          opacity: 0,
	          options: {
	            time: timeDefault
	          }
	        }
	      }
	    };
	  }
	};

	var getFillDefs, getRootG, getUseDefs, getViewBox;

	var getViewBox_1 = getViewBox = function(node) {
	  var svg, viewBox;
	  svg = node.closest('svg');
	  viewBox = svg.getAttribute('viewBox');
	  if (!viewBox) {
	    return [0, 0, 0, 0];
	  }
	  viewBox = viewBox.split(" ").map(function(item) {
	    return parseFloat(item);
	  });
	  return viewBox;
	};

	var getRootG_1 = getRootG = function(node) {
	  var child, i, len, ref, rootG, svg;
	  rootG = null;
	  svg = node.closest('svg');
	  ref = svg.children;
	  for (i = 0, len = ref.length; i < len; i++) {
	    child = ref[i];
	    if (!rootG && child.nodeName === 'g') {
	      rootG = child;
	    }
	  }
	  return rootG;
	};

	var getUseDefs_1 = getUseDefs = function(node) {
	  var defs, fillDefs, i, len, link, linked, linkedSelector, svg;
	  svg = node.closest("svg");
	  linkedSelector = node.getAttribute("xlink:href");
	  linked = svg.querySelectorAll(linkedSelector);
	  defs = [];
	  for (i = 0, len = linked.length; i < len; i++) {
	    link = linked[i];
	    defs.push(link.cloneNode());
	  }
	  fillDefs = getFillDefs(node);
	  if (fillDefs) {
	    defs = defs.concat(fillDefs); // comes cloned
	  }
	  return defs;
	};

	var getFillDefs_1 = getFillDefs = function(node) {
	  var defs, fill, fillUrl, i, len, svg, use, useDefs, uses;
	  defs = [];
	  if (node.hasAttribute("fill") && node.getAttribute("fill").match("url")) {
	    svg = node.closest("svg");
	    fillUrl = node.getAttribute('fill').replace(/(^url\()(.+)(\)$)/, '$2');
	    fill = svg.querySelector(fillUrl);
	    defs.push(fill.cloneNode(true));
	    // get uses if this fill contains them
	    if (fill.querySelector('use')) {
	      uses = fill.querySelectorAll('use');
	      for (i = 0, len = uses.length; i < len; i++) {
	        use = uses[i];
	        useDefs = getUseDefs(use);
	        if (useDefs) {
	          defs = defs.concat(useDefs); // comes cloned
	        }
	      }
	    }
	  }
	  return defs;
	};

	var utils = {
		getViewBox: getViewBox_1,
		getRootG: getRootG_1,
		getUseDefs: getUseDefs_1,
		getFillDefs: getFillDefs_1
	};

	var getRootG$1, getViewBox$1;

	({getViewBox: getViewBox$1, getRootG: getRootG$1} = utils);

	var loadFile = function(file, index) {
	  var fileFullName, fileName, importNode, rootG, svg, viewBox, xhr;
	  console.log(`loading ${file}`);
	  xhr = new XMLHttpRequest();
	  xhr.open("GET", file, false);
	  xhr.overrideMimeType("image/svg+xml");
	  xhr.send("");
	  svg = xhr.responseXML.documentElement;
	  fileFullName = xhr.responseURL.split('/').filter(function(item) {
	    // gets the part of url that contains the svg file
	    if (item.match('.svg')) {
	      return true;
	    } else {
	      return false;
	    }
	  })[0];
	  fileName = fileFullName.replace('.svg', '');
	  // gets root group and sets a name if it doesnt have one already
	  rootG = getRootG$1(svg);
	  if (rootG && !rootG.hasAttribute('data-name') && !rootG.hasAttribute('id')) {
	    rootG.setAttribute('data-name', fileName);
	  }
	  if (svg.getAttribute('viewBox')) {
	    viewBox = getViewBox$1.call(this, svg);
	    if (!svg.getAttribute('width')) {
	      svg.setAttribute('width', viewBox[2]);
	    }
	    if (!svg.getAttribute('height')) {
	      svg.setAttribute('height', viewBox[3]);
	    }
	  }
	  importNode = document.createElement('div');
	  importNode.setAttribute('data-import-id', index);
	  importNode.appendChild(svg);
	  /*
	      There's some bug when I import svgs. The first imported svg is fine,
	      but the other ones start getting the sizes and positions messed up.
	      Since I can't understand what is causing that, everytime I import svgs
	      I put them at the first child, so that they stay with the right sizes
	  */
	  return this.svgContainer.insertAdjacentElement('afterbegin', importNode);
	};

	var style = "html, body {\n    margin: 0;\n    padding: 0;\n}\n#svgContainer {\n    visibility: hidden;\n    display: block;\n    position: relative;\n    z-index: 999;\n}\n#svgContainer [data-import-id] {\n    position: absolute;\n    top: 0;\n    left: 0;\n    z-index: 1;\n}\n#svgContainer [data-import-id].active {\n    z-index: 2;\n    position: relative;\n}";

	var svgContainerStyle;

	svgContainerStyle = style;

	var setupContainer = function() {
	  var css, head, style$$1;
	  // create a container for the svgs
	  this.svgContainer = document.createElement('div');
	  this.svgContainer.id = 'svgContainer';
	  document.body.insertAdjacentElement('afterbegin', this.svgContainer);
	  // create style and classes for the svgContainer
	  css = svgContainerStyle;
	  head = document.head || document.getElementsByTagName('head')[0];
	  style$$1 = document.createElement('style');
	  style$$1.type = 'text/css';
	  if (style$$1.styleSheet) {
	    style$$1.styleSheet.cssText = css;
	  } else {
	    style$$1.appendChild(document.createTextNode(css));
	  }
	  return head.appendChild(style$$1);
	};

	var getUseDefs$1, getViewBox$2, traverse;

	({getViewBox: getViewBox$2, getUseDefs: getUseDefs$1} = utils);

	var traverse_1 = traverse = function(node, parent, parentLayer) {
	  var ancestor, child, clipPath, clipPathBBox, clipPathBounds, clipSelector, computedStyle, createdLayer, def, defs, i, importId, inner, j, k, l, layer, layerDefs, layerParams, layerSvg, len, len1, len2, len3, len4, m, mask, maskSelector, n, name, nodeBBox, nodeBounds, path, ref, ref1, ref2, results, style, svg, url, viewBox;
	  // ignoring mask
	  if (node.nodeName === 'mask') {
	    return false;
	  }
	  // setting active classes to hidden layers so that we can calculate getBoundingClientRect() correctly
	  if (node.parentNode && node.parentNode.nodeName === 'svg') {
	    importId = node.closest('[data-import-id]').getAttribute('data-import-id');
	    document.querySelectorAll("#svgContainer > [data-import-id]").forEach(function(el) {
	      if (el.getAttribute('data-import-id' === importId)) {
	        return el.classList.add('active');
	      } else {
	        return el.classList.remove('active');
	      }
	    });
	  }
	  // main variables
	  viewBox = getViewBox$2(node);
	  createdLayer = null;
	  svg = node.closest('svg');
	  nodeBounds = node.getBoundingClientRect();
	  nodeBBox = node.getBBox();
	  name = node.getAttribute('data-name') ? node.getAttribute('data-name') : node.id;
	  computedStyle = getComputedStyle(node);
	  // qt = decodeMatrix node

	  // get default layer params
	  layerParams = {
	    name: name,
	    frame: {},
	    screenFrame: {},
	    style: {},
	    clip: false,
	    // backgroundColor: 'rgba(0,0,0,0.1)'
	    x: Math.floor(nodeBounds.x),
	    y: Math.floor(nodeBounds.y),
	    width: Math.floor(nodeBBox.width),
	    height: Math.floor(nodeBBox.height)
	  };
	  // calculates relative position from parent's absolute position
	  if (parentLayer) {
	    layerParams.x -= parentLayer.screenFrame.x;
	    layerParams.y -= parentLayer.screenFrame.y;
	  }
	  // this element will be used to store information that will be rendered inside layerParams.image
	  layerSvg = document.createElement('svg');
	  layerSvg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
	  layerSvg.setAttribute('xmlns:xlink', "http://www.w3.org/1999/xlink");
	  layerSvg.setAttribute('style', 'position: relative; display: block;');
	  layerDefs = document.createElement('defs');
	  layerSvg.appendChild(layerDefs);
	  /*
	   * Generating inner html and applying transforms so that the svg
	   * is rendered at 0,0 position of the layer
	   */
	  if (node.nodeName === 'use') {
	    layerSvg.setAttribute('width', nodeBBox.width);
	    layerSvg.setAttribute('height', nodeBBox.height);
	    defs = getUseDefs$1(node);
	    if (defs) {
	      for (j = 0, len = defs.length; j < len; j++) {
	        def = defs[j];
	        layerSvg.querySelector('defs').insertAdjacentElement('beforeend', def);
	      }
	    }
	    inner = node.cloneNode();
	    inner.setAttribute('transform', `translate(${-nodeBBox.x} ${-nodeBBox.y})`);
	    layerSvg.insertAdjacentElement('afterbegin', inner);
	  } else if (node.nodeName !== 'g') { // dont clone child nodes because they will be traversed
	    layerSvg.setAttribute('width', nodeBBox.width);
	    layerSvg.setAttribute('height', nodeBBox.height);
	    inner = node.cloneNode(true);
	    inner.setAttribute('transform', `translate(${-nodeBBox.x} ${-nodeBBox.y})`);
	    layerSvg.insertAdjacentElement('afterbegin', inner);
	  }
	  /*
	   * Extra layer info
	   */
	  // some clip-paths are applied as classes
	  if (node.hasAttribute('clip-path') || (computedStyle.clipPath && computedStyle.clipPath !== 'none')) {
	    url = node.getAttribute('clip-path') || computedStyle.clipPath;
	    // removes "" and ''
	    url = url.replace('url("', 'url(').replace('url(\'', 'url(').replace(/\"\)$/, ')').replace(/\'\)$/, ')');
	    clipSelector = url.replace(/(^url\((.+)\)$)/, '$2');
	    clipPath = svg.querySelector(clipSelector);
	    clipPathBBox = clipPath.getBBox();
	    clipPathBounds = clipPath.getBoundingClientRect();
	    layerParams.width = Math.ceil(clipPathBBox.width);
	    layerParams.height = Math.ceil(clipPathBBox.height);
	    // bug? some layers come with a wrong getBoundingClientRect(), like x: -2000.
	    // trying to simplify with 0.
	    // layerParams.x = clipPathBounds.x
	    // layerParams.y = clipPathBounds.y
	    // if parentLayer
	    //     layerParams.x -= parentLayer.screenFrame.x
	    //     layerParams.y -= parentLayer.screenFrame.y
	    layerParams.x = 0;
	    layerParams.y = 0;
	    layerParams.clip = true;
	    if (clipPath.children.length === 1 && node.children[0].nodeName === 'path') {
	      path = node.children[0];
	      layerParams.backgroundColor = path.getAttribute('fill');
	    }
	  }
	  if (node.hasAttribute('opacity')) {
	    layerParams.opacity = parseFloat(node.getAttribute('opacity'));
	  }
	  if (node.closest('[mask]') && node.nodeName !== 'g') {
	    ancestor = node.closest('[mask]');
	    maskSelector = ancestor.getAttribute('mask').replace(/(^url\()(.+)(\)$)/, '$2');
	    mask = svg.querySelector(maskSelector);
	    ref = mask.querySelectorAll('*');
	    for (k = 0, len1 = ref.length; k < len1; k++) {
	      child = ref[k];
	      if (child.nodeName === 'use') {
	        defs = getUseDefs$1(child);
	        for (l = 0, len2 = defs.length; l < len2; l++) {
	          def = defs[l];
	          layerSvg.querySelector('defs').insertAdjacentElement('beforeend', def);
	        }
	        child.setAttribute('transform', `translate(${-child.getBBox().x} ${-child.getBBox().y})`);
	      }
	    }
	    ref1 = layerSvg.children;
	    // apply mask attribute if node does not already have it
	    for (m = 0, len3 = ref1.length; m < len3; m++) {
	      child = ref1[m];
	      if (child.nodeName === node.nodeName) {
	        if (!child.hasAttribute('mask')) {
	          child.setAttribute('mask', `url(${maskSelector})`);
	        }
	      }
	    }
	    // adds mask to layerSvg
	    layerSvg.insertAdjacentElement('afterbegin', mask.cloneNode(true));
	  }
	  // TODO: print only the css required for the node to render. maybe render svg
	  // style only one time, parse it and reuse it everytime to get the right string?
	  if (node.hasAttribute('class')) {
	    style = svg.querySelector('style');
	    layerSvg.querySelector('defs').insertAdjacentElement('afterbegin', style.cloneNode(true));
	  }
	  /*
	   * End of inner html
	   */
	  // applies svg to image data
	  layerParams.image = `data:image/svg+xml;charset=UTF-8,${layerSvg.outerHTML.replace(/\n|\t/g, ' ') // removes line breaks
}`;
	  
	  // creating Framer layer
	  layer = new Layer(layerParams);
	  if (parentLayer) {
	    layer.parent = parentLayer;
	  }
	  createdLayer = layer;
	  ref2 = node.children;
	  // continue traversing
	  results = [];
	  for (i = n = 0, len4 = ref2.length; n < len4; i = ++n) {
	    child = ref2[i];
	    results.push(traverse(child, node, createdLayer != null ? createdLayer : {
	      createdLayer: null
	    }));
	  }
	  return results;
	};

	var SvgImporter, loadFile$1, setupContainer$1, traverse$1;

	loadFile$1 = loadFile;

	setupContainer$1 = setupContainer;

	traverse$1 = traverse_1;

	var svgImporter = SvgImporter = (function() {
	  class SvgImporter {
	    constructor(files = []) {
	      var file, i, index, len, ref;
	      this.files = files;
	      if (!this.files) {
	        return false;
	      }
	      this.setupContainer();
	      ref = this.files;
	      for (index = i = 0, len = ref.length; i < len; index = ++i) {
	        file = ref[index];
	        this.loadFile(file, index);
	      }
	    }

	    loadFile(file, index) {
	      var svgTraverse;
	      loadFile$1.call(this, file, index);
	      svgTraverse = document.querySelector(`[data-import-id='${index}'] svg > g`);
	      // traversing
	      return traverse$1(svgTraverse);
	    }

	  }
	  SvgImporter.prototype.type = 'svg';

	  SvgImporter.prototype.svgContainer = null;

	  SvgImporter.prototype.setupContainer = setupContainer$1;

	  return SvgImporter;

	}).call(commonjsGlobal);

	// f, ff
	var _findAll, _getHierarchy, _match;

	_getHierarchy = function(layer) {
	  var a, i, len, ref, string;
	  string = '';
	  ref = layer.ancestors();
	  for (i = 0, len = ref.length; i < len; i++) {
	    a = ref[i];
	    // if the layer has a ._info.originalName, it's from sketch and the string is intact. otherwise, the layer name replaced spaces with "_"
	    if (a._info && a._info.originalName) {
	      string = a._info.originalName + '>' + string;
	    } else {
	      string = a.name + '>' + string;
	    }
	  }
	  // if the layer has a ._info.originalName, it's from sketch and the string is intact. otherwise, the layer name replaced spaces with "_"
	  if (layer._info && layer._info.originalName) {
	    string = string + layer._info.originalName;
	  } else {
	    string = string + layer.name;
	  }
	  return string;
	};

	_match = function(hierarchy, string) {
	  var regExp, regexString;
	  // prepare regex tokens
	  string = string.replace(/\s*>\s*/g, '>'); // clean up spaces around arrows
	  string = string.split('*').join('[^>]*'); // asteriks as layer name wildcard
	  string = string.split(' ').join('(?:.*)>'); // space as structure wildcard
	  string = string.split(',').join('$|'); // allow multiple searches using comma
	  regexString = "(^|>)" + string + "$"; // always bottom layer, maybe part of hierarchy
	  regExp = new RegExp(regexString);
	  return hierarchy.match(regExp);
	};

	_findAll = function(selector, fromLayer) {
	  var layers, stringNeedsRegex;
	  layers = Framer.CurrentContext._layers;
	  if (selector != null) {
	    stringNeedsRegex = find(['*', ' ', '>', ','], function(c) {
	      return includes(selector, c);
	    });
	    if (!(stringNeedsRegex || fromLayer)) {
	      return layers = filter(layers, function(layer) {
	        // if the layer has a ._info.originalName, it's from sketch and the string is intact. otherwise, the layer name replaced spaces with "_"
	        if (layer._info && layer._info.originalName) {
	          if (layer._info.originalName === selector) {
	            return true;
	          }
	        } else {
	          if (layer.name === selector) {
	            return true;
	          }
	        }
	      });
	    } else {
	      return layers = filter(layers, function(layer) {
	        var hierarchy;
	        hierarchy = _getHierarchy(layer);
	        if (fromLayer != null) {
	          // if the layer has a ._info.originalName, it's from sketch and the string is intact. otherwise, the layer name replaced spaces with "_"
	          if (fromLayer._info && fromLayer._info.originalName) {
	            return _match(hierarchy, fromLayer._info.originalName + ' ' + selector);
	          } else {
	            return _match(hierarchy, fromLayer.name + ' ' + selector);
	          }
	        } else {
	          return _match(hierarchy, selector);
	        }
	      });
	    }
	  } else {
	    return layers;
	  }
	};

	var f = function(selector, fromLayer) {
	  return _findAll(selector, fromLayer)[0];
	};

	var ff = function(selector, fromLayer) {
	  return _findAll(selector, fromLayer);
	};

	var find_1$1 = {
		f: f,
		ff: ff
	};

	/*
	= TODO LIST
	*/
	var SvgImporter$1, f$1, ff$1, merge$1, parse, transitions$1;

	merge$1 = merge_1;

	transitions$1 = transitions;

	SvgImporter$1 = svgImporter;

	transitions$1 = transitions;

	f$1 = find_1$1.f;

	ff$1 = find_1$1.ff;

	var parse_1 = parse = function(string) {
	  var actions, acts, regexAction, regexOption, regexOptions;
	  // if actions are divided with spaces, ignore spaces "action1:target; action2:target;"
	  string = string.replace(/;_/gi, ';');
	  regexAction = /^(.*?)(?::|$)(.*?)(\[.*|$)/;
	  regexAction = /^(.*?(?=:|\[|$))(?::?)(.*?(?=\[.*)|.*$)(\[.*)?/;
	  regexOptions = /\[(.*?)\]$/;
	  regexOption = /(.*?)(\:|$)(.*)/;
	  // action:target[option:value, option:value];action:target;action;
	  actions = [];
	  acts = string.split(';');
	  acts.filter(function(action) {
	    var matches, options, opts, target;
	    matches = action.match(regexAction);
	    action = matches[1];
	    target = matches[2];
	    options = [];
	    if (matches[3]) {
	      opts = matches[3].match(regexOptions);
	      if (opts[1]) {
	        opts = opts[1].split(',');
	      }
	      opts.forEach(function(opt) {
	        var name, value;
	        matches = opt.match(regexOption);
	        name = matches[1];
	        value = matches[3];
	        return options.push({
	          name: name.trim(),
	          value: value.trim()
	        });
	      });
	    }
	    return actions.push({
	      action: action,
	      target: target,
	      options: options
	    });
	  });
	  return actions;
	};

	var ProtoSparker = (function() {
	  class ProtoSparker {
	    constructor(options1 = {}) {
	      var all, base, base1, base2, base3, bg, default_h, default_w, hRatio, hackedScreenHeight, ratio, screen_height, screen_width, vRatio;
	      this.options = options1;
	      // Opts
	      if ((base = this.options).firstPage == null) {
	        base.firstPage = null;
	      }
	      if ((base1 = this.options).textField == null) {
	        base1.textField = {};
	      }
	      this.options.textField = merge$1(this.defaultTextField, this.options.textField);
	      if ((base2 = this.options).selectField == null) {
	        base2.selectField = {};
	      }
	      this.options.selectField = merge$1(this.defaultSelectField, this.options.selectField);
	      if ((base3 = this.options).svgImport == null) {
	        base3.svgImport = null;
	      }
	      if (this.options.svgImport) {
	        // setup import before instantianting ProtoSparker
	        this.importer = new SvgImporter$1(this.options.svgImport);
	        return false;
	      }
	      this.actions = [
	        {
	          selector: "goback",
	          fn: this.goBack
	        },
	        {
	          selector: "goto:",
	          fn: this.goTo
	        },
	        {
	          selector: "overlay:",
	          fn: this.overlay
	        },
	        {
	          selector: "setElement:",
	          fn: this.setElement
	        }
	      ];
	      document.body.style.height = "auto";
	      // body.scrollTop = 0
	      default_w = this.options.firstPage.width;
	      default_h = this.options.firstPage.height;
	      screen_width = Framer.Device.screen.width;
	      screen_height = Framer.Device.screen.height;
	      // Something is fucked up when running the prototype on framer.cloud on chrome.
	      // Prototype is seems to overflow window height.
	      // I tried to solve this but I couldn't. Good luck.
	      hackedScreenHeight = 0;
	      if (window.location.origin.match('framer.cloud') && Utils.isMobile()) {
	        hackedScreenHeight = 170;
	        screen_height -= hackedScreenHeight;
	      }
	      hRatio = screen_width / default_w;
	      vRatio = screen_height / default_h;
	      ratio = hRatio;
	      if (vRatio < hRatio) {
	        ratio = vRatio;
	      }
	      Framer.Defaults.Layer.force2d = true;
	      all = new Layer({
	        width: default_w, // <-- The width will be 750
	        height: default_h, // <-- The height will be 1334
	        scale: ratio, // <-- The ratio we got from the equation
	        originY: 0, // <-- This moves the origin of scale to top left
	        y: 0, // <-- Make this layer to the top
	        backgroundColor: "#000000"
	      });
	      bg = new Layer({
	        width: screen_width,
	        height: screen_height,
	        y: 0,
	        x: 0,
	        backgroundColor: "#000000"
	      });
	      bg.height += hackedScreenHeight;
	      all.parent = bg;
	      all.centerX();
	      // Set up FlowComponent
	      this.flow = new FlowComponent;
	      this.flow.width = this.options.firstPage.width;
	      this.flow.height = this.options.firstPage.height;
	      this.flow.parent = all;
	      this.flow.showNext(this.options.firstPage);
	      // Get all layers that have actions
	      this.actions.forEach((action) => {
	        var layers;
	        layers = ff$1(`*${action.selector}*`);
	        return this.actionLayers = this.actionLayers.concat(layers);
	      });
	      //  break into commands separated by ; and run them in order
	      this.actionLayers.forEach((layer) => {
	        var action, actions, destinationLayer, layerActionsArray, layerFns, layerName, overlayIndex;
	        layerFns = [];
	        layerActionsArray = [];
	        // if the layer has a ._info.originalName, it's from sketch and the string is intact. otherwise, the layer name replaced spaces with "_"
	        if (layer._info && layer._info.originalName) {
	          layerActionsArray = layer._info.originalName.split(';');
	        } else {
	          layerActionsArray = layer.name.split(';');
	        }
	        layerActionsArray.forEach((layerAction) => {
	          // check if this layerAction matches a registered actionLayers
	          return this.actions.forEach((action) => {
	            if (layerAction.match(action.selector)) {
	              return layerFns.push(action.fn);
	            }
	          });
	        });
	        layer.onClick(() => {
	          return layerFns.forEach((fn) => {
	            return fn.call(this, layer);
	          });
	        });
	        layerName = this.getLayerName(layer);
	        actions = parse(layerName);
	        overlayIndex = actions.findIndex(function(i) {
	          return i.action === "overlay";
	        });
	        if (overlayIndex >= 0) {
	          // hide overlay layers when prototype boots up
	          action = actions[overlayIndex];
	          destinationLayer = f$1(action.target);
	          return destinationLayer.visible = false;
	        }
	      });
	      this.generateFields();
	      this.generateScrolls();
	      this.generateElements();
	    }

	    testParser() {
	      print(parse("action"));
	      print(parse("action[op1, op2:2]"));
	      print(parse("action:target"));
	      return print(parse("action:target[op1:1, op2:2, op3]"));
	    }

	    getLayerName(layer) {
	      var layerName, treatedLayerName;
	      try {
	        layerName = "";
	        // if the layer has a ._info.originalName, it's from sketch and the string is intact. otherwise, the layer name replaced spaces with "_"
	        if (layer._info && layer._info.originalName) {
	          layerName = layer._info.originalName;
	        } else {
	          layerName = layer.name;
	        }
	        // ignore suffix _123 on duplicates
	        treatedLayerName = layerName.replace(/_[0-9]+$/, '');
	        if (f$1(treatedLayerName)) {
	          layerName = treatedLayerName;
	        }
	        return layerName;
	      } catch (error) {
	        return false;
	      }
	    }

	    goBack(layer) {
	      return this.flow.showPrevious();
	    }

	    goTo(layer) {
	      var action, actions, destinationLayer, layerName, transition;
	      layerName = this.getLayerName(layer);
	      actions = parse(layerName).filter(function(action) {
	        return action.action === 'goto';
	      });
	      action = actions[0];
	      destinationLayer = f$1(action.target);
	      destinationLayer.x = 0;
	      destinationLayer.y = 0;
	      transition = action.options.findIndex(function(i) {
	        return i.name === "transition";
	      });
	      if (transition < 0) {
	        transition = false;
	      }
	      if (typeof transition === 'number') { // this is the index
	        transition = transitions$1[action.options[transition].value];
	        return this.flow.transition(destinationLayer, transition);
	      } else {
	        return this.flow.showNext(destinationLayer);
	      }
	    }

	    overlay(layer) {
	      var action, actions, bottomIndex, centerIndex, destinationLayer, layerName, leftIndex, rightIndex, topIndex;
	      layerName = this.getLayerName(layer);
	      actions = parse(layerName).filter(function(action) {
	        return action.action === 'overlay';
	      });
	      action = actions[0];
	      destinationLayer = f$1(action.target);
	      topIndex = action.options.findIndex(function(i) {
	        return i.name === "top";
	      });
	      rightIndex = action.options.findIndex(function(i) {
	        return i.name === "right";
	      });
	      bottomIndex = action.options.findIndex(function(i) {
	        return i.name === "bottom";
	      });
	      leftIndex = action.options.findIndex(function(i) {
	        return i.name === "left";
	      });
	      centerIndex = action.options.findIndex(function(i) {
	        return i.name === "center";
	      });
	      if (topIndex >= 0) {
	        return this.flow.showOverlayTop(destinationLayer);
	      } else if (rightIndex >= 0) {
	        return this.flow.showOverlayRight(destinationLayer);
	      } else if (bottomIndex >= 0) {
	        return this.flow.showOverlayBottom(destinationLayer);
	      } else if (leftIndex >= 0) {
	        return this.flow.showOverlayLeft(destinationLayer);
	      } else if (centerIndex >= 0) {
	        return this.flow.showOverlayCenter(destinationLayer);
	      } else {
	        return this.flow.showOverlayCenter(destinationLayer);
	      }
	    }

	    toggleElement(layer) {
	      var action, actions, currentIndex, defaultElement, elementLayers, elementName, layerName, nextElement;
	      layerName = this.getLayerName(layer);
	      actions = parse(layerName).filter(function(action) {
	        return action.action === 'element';
	      });
	      action = actions[0] || null;
	      if (!action || !action.options.length) {
	        return;
	      }
	      elementName = action.target;
	      currentIndex = null;
	      nextElement = null;
	      defaultElement = null;
	      elementLayers = ff$1(`*element:${elementName},*element:${elementName}*;,*element:${elementName}[*`);
	      elementLayers.forEach((element, index) => {
	        var stateIndex;
	        layerName = this.getLayerName(element);
	        actions = parse(layerName).filter(function(action) {
	          return action.action === 'element';
	        });
	        action = actions[0] || null;
	        if (action) {
	          // for safety, save default element
	          stateIndex = action.options.findIndex(function(i) {
	            return i.name === "state";
	          });
	          if (!action.options[stateIndex] || action.options[stateIndex] && action.options[stateIndex].value === "default") {
	            defaultElement = element;
	          }
	          // try grabbing the next state
	          if (element === layer) {
	            return currentIndex = index;
	          }
	        }
	      });
	      if (elementLayers[currentIndex + 1]) {
	        nextElement = elementLayers[currentIndex + 1];
	      } else if (elementLayers[currentIndex - 1]) {
	        nextElement = elementLayers[currentIndex - 1];
	      } else {
	        nextElement = defaultElement;
	      }
	      if (nextElement) {
	        layerName = this.getLayerName(nextElement);
	        actions = parse(layerName).filter(function(action) {
	          return action.action === 'element';
	        });
	        action = actions[0] || null;
	        return this.setElement(nextElement, {
	          action: "setElement",
	          target: action.target,
	          options: action.options
	        });
	      }
	    }

	    setElement(layer, action) {
	      var actions, defaultElement, elementName, hasMatch, layerName, state, stateIndex;
	      // print "start"
	      if (!action) {
	        layerName = this.getLayerName(layer);
	        actions = parse(layerName).filter(function(action) {
	          return action.action === 'setElement';
	        });
	        action = actions[0] || null;
	      }
	      if (!action || !action.options.length) {
	        return;
	      }
	      stateIndex = action.options.findIndex(function(i) {
	        return i.name === "state";
	      });
	      if (stateIndex < 0) {
	        action.options.push({
	          name: "state",
	          value: "default"
	        });
	        stateIndex = action.options.length - 1; // last one
	      }
	      
	      // Setting state
	      if (stateIndex >= 0) {
	        state = action.options[stateIndex].value;
	        elementName = action.target;
	        // gets all element states that match this state and turn them on
	        // elements that dont match this state are turned off
	        hasMatch = false;
	        defaultElement = null;
	        ff$1(`*element:${elementName}*`).forEach((element) => {
	          layerName = this.getLayerName(element);
	          actions = parse(layerName).filter(function(action) {
	            return action.action === 'element';
	          });
	          action = actions[0] || null;
	          if (!action) {
	            return null;
	          }
	          stateIndex = action.options.findIndex(function(i) {
	            return i.name === "state";
	          });
	          if (!action.options[stateIndex] || action.options[stateIndex] && action.options[stateIndex].value === "default") {
	            defaultElement = element;
	          }
	          if (stateIndex >= 0 && action.options[stateIndex].value === state) {
	            hasMatch = true;
	            return element.visible = true;
	          } else {
	            return element.visible = false;
	          }
	        });
	        // if no element was matched, fall back to default element
	        if (!hasMatch && defaultElement) {
	          return defaultElement.visible = true;
	        }
	      }
	    }

	    generateFields() {
	      var _class, _key, _value, css, fieldString, head, key, placeholderString, ref, ref1, ref2, ref3, ref4, ref5, style, value;
	      css = "";
	      ref = this.options.textField.styles;
	      // Generating Text Fields css for each styles
	      for (key in ref) {
	        value = ref[key];
	        _class = key;
	        if (_class === "default") {
	          _class = this.options.textField.defaultClass;
	        }
	        fieldString = "";
	        placeholderString = "";
	        ref1 = value.field;
	        for (_key in ref1) {
	          _value = ref1[_key];
	          fieldString += `${_key}:${_value};`;
	        }
	        ref2 = value.placeholder;
	        for (_key in ref2) {
	          _value = ref2[_key];
	          placeholderString += `${_key}:${_value};`;
	        }
	        // adding placeHolder style
	        css += `.${_class} 						   		{ ${fieldString} }.${_class}:focus						{ outline: none; }.${_class}::-webkit-input-placeholder 	{ ${placeholderString} }.${_class}::-moz-placeholder 			{ ${placeholderString} }.${_class}:-ms-input-placeholder 		{ ${placeholderString} }.${_class}::-ms-input-placeholder 		{ ${placeholderString} }.${_class}:placeholder-shown 			{ ${placeholderString} }`;
	      }
	      ref3 = this.options.selectField.styles;
	      // Generating Select Fields css for each styles
	      for (key in ref3) {
	        value = ref3[key];
	        // print key, value
	        _class = key;
	        if (_class === "default") {
	          _class = this.options.selectField.defaultClass;
	        }
	        fieldString = "";
	        placeholderString = "";
	        ref4 = value.field;
	        for (_key in ref4) {
	          _value = ref4[_key];
	          fieldString += `${_key}:${_value};`;
	        }
	        ref5 = value.placeholder;
	        for (_key in ref5) {
	          _value = ref5[_key];
	          placeholderString += `${_key}:${_value};`;
	        }
	        // adding placeHolder style
	        css += `.${_class} 						   		{ ${fieldString} }.${_class}:focus						{ outline: none; }.${_class}.empty						{ ${placeholderString} }`;
	      }
	      // Creating style element
	      head = document.head || document.getElementsByTagName('head')[0];
	      style = document.createElement('style');
	      style.type = 'text/css';
	      if (style.styleSheet) {
	        style.styleSheet.cssText = css;
	      } else {
	        style.appendChild(document.createTextNode(css));
	      }
	      head.appendChild(style);
	      // Generating text fields
	      ff$1('text-field*,text_field*').forEach((field) => {
	        return field.html = `<input placeholder="${this.options.textField.placeholderText}" class="${this.options.textField.defaultClass}" />`;
	      });
	      // Generating select boxes
	      return ff$1('select-field*,select_field*').forEach((field, index) => {
	        var action, actions, j, layerName, len, opt, optString, ref6;
	        optString = `<option selected disabled style="color: red">${this.options.selectField.placeholderText}</option>`;
	        layerName = this.getLayerName(field);
	        actions = parse(layerName).filter(function(action) {
	          // if the layer has a ._info.originalName, it's from sketch and the string is intact. otherwise, the layer name replaced spaces with "_"
	          if (field._info && field._info.originalName) {
	            return action.action === 'select-field';
	          } else {
	            return action.action === 'select_field';
	          }
	        });
	        action = actions[0] || null;
	        if (action) {
	          ref6 = action.options;
	          for (j = 0, len = ref6.length; j < len; j++) {
	            opt = ref6[j];
	            optString += `<option value="${opt.value}">${opt.name.replace(/\_/g, ' ').trim()}</option>`;
	          }
	        }
	        return field.html = `<select class="${this.options.selectField.defaultClass} empty" onChange="this.classList.remove('empty');">${optString}</select>`;
	      });
	    }

	    generateScrolls() {
	      return ff$1('scroll*').forEach((layer) => {
	        var action, actions, layerHeight, layerName, layerWidth, parent, scroll, x, y;
	        layerName = this.getLayerName(layer);
	        actions = parse(layerName).filter(function(action) {
	          return action.action === 'scroll';
	        });
	        action = actions[0];
	        parent = layer.parent;
	        x = layer.x;
	        y = layer.y;
	        layerHeight = layer.height;
	        layerWidth = layer.width;
	        scroll = ScrollComponent.wrap(layer);
	        scroll.parent = parent;
	        scroll.x = x;
	        scroll.y = y;
	        scroll.width = layerWidth;
	        scroll.height = layerHeight;
	        scroll.mouseWheelEnabled = true;
	        scroll.scrollVertical = false;
	        scroll.scrollHorizontal = false;
	        scroll.on(Events.Scroll, function(evt) {
	          if (!evt) {
	            return;
	          }
	          evt.preventDefault();
	          evt.stopPropagation();
	          return evt.stopImmediatePropagation();
	        });
	        if (action && action.options && action.options.length) {
	          if (action.options[0].name === 'horizontal') {
	            scroll.scrollHorizontal = true;
	          }
	          if (action.options[0].name === 'vertical') {
	            return scroll.scrollHorizontal = true;
	          }
	        } else {
	          // defaults to vertical scrolling
	          return scroll.scrollVertical = true;
	        }
	      });
	    }

	    generateElements() {
	      return ff$1('*element:*').forEach((element) => {
	        var action, defaultElement, elementName, layerName, toggleIndex;
	        layerName = this.getLayerName(element);
	        action = parse(layerName)[0] || null;
	        if (!action) {
	          return false;
	        }
	        // get default state for this element
	        elementName = action.target;
	        defaultElement = null;
	        // this distinguishes item-label and item-label-dark
	        ff$1(`*element:${elementName},*element:${elementName}*;,*element:${elementName}[*`).forEach((element) => {
	          var stateIndex;
	          layerName = this.getLayerName(element);
	          action = parse(layerName)[0] || null;
	          if (action) {
	            stateIndex = action.options.findIndex(function(i) {
	              return i.name === "state";
	            });
	            if (!action.options[stateIndex] || action.options[stateIndex] && action.options[stateIndex].value === "default") {
	              defaultElement = element;
	              return false;
	            }
	          }
	        });
	        toggleIndex = action.options.findIndex(function(i) {
	          return i.name === "toggle";
	        });
	        if (action.options[toggleIndex]) {
	          element.onClick(() => {
	            return this.toggleElement(element);
	          });
	        }
	        if (defaultElement && defaultElement !== element) {
	          element.parent = defaultElement.parent;
	          element.placeBehind(defaultElement);
	          element.x = defaultElement.x;
	          element.y = defaultElement.y;
	          return element.visible = false;
	        }
	      });
	    }

	  }
	  ProtoSparker.prototype.actions = [];

	  ProtoSparker.prototype.actionLayers = [];

	  ProtoSparker.prototype.importer = null;

	  ProtoSparker.prototype.defaultTextField = {
	    defaultClass: "ps-text-field",
	    placeholderText: "",
	    styles: {
	      default: {
	        field: {
	          "position": "absolute",
	          "top": 0,
	          "left": 0,
	          "right": 0,
	          "bottom": 0,
	          "box-sizing": "border-box",
	          "font-size": "14px",
	          "background": "transparent"
	        },
	        // "border": "1px solid red"
	        placeholder: {}
	      }
	    }
	  };

	  ProtoSparker.prototype.defaultSelectField = {
	    defaultClass: "ps-select-field",
	    placeholderText: "",
	    styles: {
	      default: {
	        field: {
	          "position": "absolute",
	          "top": 0,
	          "left": 0,
	          "right": 0,
	          "bottom": 0,
	          "box-sizing": "border-box",
	          "font-size": "14px",
	          "background": "transparent",
	          "-webkit-appearance": "none",
	          "-moz-appearance": "none",
	          "text-indent": "1px",
	          "text-overflow": "",
	          "border-radius": "0"
	        },
	        placeholder: {}
	      }
	    }
	  };

	  return ProtoSparker;

	}).call(commonjsGlobal);

	var core = {
		parse: parse_1,
		ProtoSparker: ProtoSparker
	};

	// require('coffee-script/register');
	var ProtoSparker$1;

	({ProtoSparker: ProtoSparker$1} = core);

	var ProtoSparker_1 = ProtoSparker$1;

	return ProtoSparker_1;

}());
