(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var es_array_filter = {};

	var globalThis_1;
	var hasRequiredGlobalThis;

	function requireGlobalThis () {
		if (hasRequiredGlobalThis) return globalThis_1;
		hasRequiredGlobalThis = 1;
		var check = function (it) {
		  return it && it.Math === Math && it;
		};

		// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
		globalThis_1 =
		  // eslint-disable-next-line es/no-global-this -- safe
		  check(typeof globalThis == 'object' && globalThis) ||
		  check(typeof window == 'object' && window) ||
		  // eslint-disable-next-line no-restricted-globals -- safe
		  check(typeof self == 'object' && self) ||
		  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
		  check(typeof globalThis_1 == 'object' && globalThis_1) ||
		  // eslint-disable-next-line no-new-func -- fallback
		  (function () { return this; })() || Function('return this')();
		return globalThis_1;
	}

	var objectGetOwnPropertyDescriptor = {};

	var fails;
	var hasRequiredFails;

	function requireFails () {
		if (hasRequiredFails) return fails;
		hasRequiredFails = 1;
		fails = function (exec) {
		  try {
		    return !!exec();
		  } catch (error) {
		    return true;
		  }
		};
		return fails;
	}

	var descriptors;
	var hasRequiredDescriptors;

	function requireDescriptors () {
		if (hasRequiredDescriptors) return descriptors;
		hasRequiredDescriptors = 1;
		var fails = requireFails();

		// Detect IE8's incomplete defineProperty implementation
		descriptors = !fails(function () {
		  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
		  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
		});
		return descriptors;
	}

	var functionBindNative;
	var hasRequiredFunctionBindNative;

	function requireFunctionBindNative () {
		if (hasRequiredFunctionBindNative) return functionBindNative;
		hasRequiredFunctionBindNative = 1;
		var fails = requireFails();

		functionBindNative = !fails(function () {
		  // eslint-disable-next-line es/no-function-prototype-bind -- safe
		  var test = (function () { /* empty */ }).bind();
		  // eslint-disable-next-line no-prototype-builtins -- safe
		  return typeof test != 'function' || test.hasOwnProperty('prototype');
		});
		return functionBindNative;
	}

	var functionCall;
	var hasRequiredFunctionCall;

	function requireFunctionCall () {
		if (hasRequiredFunctionCall) return functionCall;
		hasRequiredFunctionCall = 1;
		var NATIVE_BIND = requireFunctionBindNative();

		var call = Function.prototype.call;

		functionCall = NATIVE_BIND ? call.bind(call) : function () {
		  return call.apply(call, arguments);
		};
		return functionCall;
	}

	var objectPropertyIsEnumerable = {};

	var hasRequiredObjectPropertyIsEnumerable;

	function requireObjectPropertyIsEnumerable () {
		if (hasRequiredObjectPropertyIsEnumerable) return objectPropertyIsEnumerable;
		hasRequiredObjectPropertyIsEnumerable = 1;
		var $propertyIsEnumerable = {}.propertyIsEnumerable;
		// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
		var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

		// Nashorn ~ JDK8 bug
		var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

		// `Object.prototype.propertyIsEnumerable` method implementation
		// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
		objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
		  var descriptor = getOwnPropertyDescriptor(this, V);
		  return !!descriptor && descriptor.enumerable;
		} : $propertyIsEnumerable;
		return objectPropertyIsEnumerable;
	}

	var createPropertyDescriptor;
	var hasRequiredCreatePropertyDescriptor;

	function requireCreatePropertyDescriptor () {
		if (hasRequiredCreatePropertyDescriptor) return createPropertyDescriptor;
		hasRequiredCreatePropertyDescriptor = 1;
		createPropertyDescriptor = function (bitmap, value) {
		  return {
		    enumerable: !(bitmap & 1),
		    configurable: !(bitmap & 2),
		    writable: !(bitmap & 4),
		    value: value
		  };
		};
		return createPropertyDescriptor;
	}

	var functionUncurryThis;
	var hasRequiredFunctionUncurryThis;

	function requireFunctionUncurryThis () {
		if (hasRequiredFunctionUncurryThis) return functionUncurryThis;
		hasRequiredFunctionUncurryThis = 1;
		var NATIVE_BIND = requireFunctionBindNative();

		var FunctionPrototype = Function.prototype;
		var call = FunctionPrototype.call;
		var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

		functionUncurryThis = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
		  return function () {
		    return call.apply(fn, arguments);
		  };
		};
		return functionUncurryThis;
	}

	var classofRaw;
	var hasRequiredClassofRaw;

	function requireClassofRaw () {
		if (hasRequiredClassofRaw) return classofRaw;
		hasRequiredClassofRaw = 1;
		var uncurryThis = requireFunctionUncurryThis();

		var toString = uncurryThis({}.toString);
		var stringSlice = uncurryThis(''.slice);

		classofRaw = function (it) {
		  return stringSlice(toString(it), 8, -1);
		};
		return classofRaw;
	}

	var indexedObject;
	var hasRequiredIndexedObject;

	function requireIndexedObject () {
		if (hasRequiredIndexedObject) return indexedObject;
		hasRequiredIndexedObject = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var fails = requireFails();
		var classof = requireClassofRaw();

		var $Object = Object;
		var split = uncurryThis(''.split);

		// fallback for non-array-like ES3 and non-enumerable old V8 strings
		indexedObject = fails(function () {
		  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
		  // eslint-disable-next-line no-prototype-builtins -- safe
		  return !$Object('z').propertyIsEnumerable(0);
		}) ? function (it) {
		  return classof(it) === 'String' ? split(it, '') : $Object(it);
		} : $Object;
		return indexedObject;
	}

	var isNullOrUndefined;
	var hasRequiredIsNullOrUndefined;

	function requireIsNullOrUndefined () {
		if (hasRequiredIsNullOrUndefined) return isNullOrUndefined;
		hasRequiredIsNullOrUndefined = 1;
		// we can't use just `it == null` since of `document.all` special case
		// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
		isNullOrUndefined = function (it) {
		  return it === null || it === undefined;
		};
		return isNullOrUndefined;
	}

	var requireObjectCoercible;
	var hasRequiredRequireObjectCoercible;

	function requireRequireObjectCoercible () {
		if (hasRequiredRequireObjectCoercible) return requireObjectCoercible;
		hasRequiredRequireObjectCoercible = 1;
		var isNullOrUndefined = requireIsNullOrUndefined();

		var $TypeError = TypeError;

		// `RequireObjectCoercible` abstract operation
		// https://tc39.es/ecma262/#sec-requireobjectcoercible
		requireObjectCoercible = function (it) {
		  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
		  return it;
		};
		return requireObjectCoercible;
	}

	var toIndexedObject;
	var hasRequiredToIndexedObject;

	function requireToIndexedObject () {
		if (hasRequiredToIndexedObject) return toIndexedObject;
		hasRequiredToIndexedObject = 1;
		// toObject with fallback for non-array-like ES3 strings
		var IndexedObject = requireIndexedObject();
		var requireObjectCoercible = requireRequireObjectCoercible();

		toIndexedObject = function (it) {
		  return IndexedObject(requireObjectCoercible(it));
		};
		return toIndexedObject;
	}

	var isCallable;
	var hasRequiredIsCallable;

	function requireIsCallable () {
		if (hasRequiredIsCallable) return isCallable;
		hasRequiredIsCallable = 1;
		// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
		var documentAll = typeof document == 'object' && document.all;

		// `IsCallable` abstract operation
		// https://tc39.es/ecma262/#sec-iscallable
		// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
		isCallable = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
		  return typeof argument == 'function' || argument === documentAll;
		} : function (argument) {
		  return typeof argument == 'function';
		};
		return isCallable;
	}

	var isObject;
	var hasRequiredIsObject;

	function requireIsObject () {
		if (hasRequiredIsObject) return isObject;
		hasRequiredIsObject = 1;
		var isCallable = requireIsCallable();

		isObject = function (it) {
		  return typeof it == 'object' ? it !== null : isCallable(it);
		};
		return isObject;
	}

	var getBuiltIn;
	var hasRequiredGetBuiltIn;

	function requireGetBuiltIn () {
		if (hasRequiredGetBuiltIn) return getBuiltIn;
		hasRequiredGetBuiltIn = 1;
		var globalThis = requireGlobalThis();
		var isCallable = requireIsCallable();

		var aFunction = function (argument) {
		  return isCallable(argument) ? argument : undefined;
		};

		getBuiltIn = function (namespace, method) {
		  return arguments.length < 2 ? aFunction(globalThis[namespace]) : globalThis[namespace] && globalThis[namespace][method];
		};
		return getBuiltIn;
	}

	var objectIsPrototypeOf;
	var hasRequiredObjectIsPrototypeOf;

	function requireObjectIsPrototypeOf () {
		if (hasRequiredObjectIsPrototypeOf) return objectIsPrototypeOf;
		hasRequiredObjectIsPrototypeOf = 1;
		var uncurryThis = requireFunctionUncurryThis();

		objectIsPrototypeOf = uncurryThis({}.isPrototypeOf);
		return objectIsPrototypeOf;
	}

	var environmentUserAgent;
	var hasRequiredEnvironmentUserAgent;

	function requireEnvironmentUserAgent () {
		if (hasRequiredEnvironmentUserAgent) return environmentUserAgent;
		hasRequiredEnvironmentUserAgent = 1;
		var globalThis = requireGlobalThis();

		var navigator = globalThis.navigator;
		var userAgent = navigator && navigator.userAgent;

		environmentUserAgent = userAgent ? String(userAgent) : '';
		return environmentUserAgent;
	}

	var environmentV8Version;
	var hasRequiredEnvironmentV8Version;

	function requireEnvironmentV8Version () {
		if (hasRequiredEnvironmentV8Version) return environmentV8Version;
		hasRequiredEnvironmentV8Version = 1;
		var globalThis = requireGlobalThis();
		var userAgent = requireEnvironmentUserAgent();

		var process = globalThis.process;
		var Deno = globalThis.Deno;
		var versions = process && process.versions || Deno && Deno.version;
		var v8 = versions && versions.v8;
		var match, version;

		if (v8) {
		  match = v8.split('.');
		  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
		  // but their correct versions are not interesting for us
		  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
		}

		// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
		// so check `userAgent` even if `.v8` exists, but 0
		if (!version && userAgent) {
		  match = userAgent.match(/Edge\/(\d+)/);
		  if (!match || match[1] >= 74) {
		    match = userAgent.match(/Chrome\/(\d+)/);
		    if (match) version = +match[1];
		  }
		}

		environmentV8Version = version;
		return environmentV8Version;
	}

	var symbolConstructorDetection;
	var hasRequiredSymbolConstructorDetection;

	function requireSymbolConstructorDetection () {
		if (hasRequiredSymbolConstructorDetection) return symbolConstructorDetection;
		hasRequiredSymbolConstructorDetection = 1;
		/* eslint-disable es/no-symbol -- required for testing */
		var V8_VERSION = requireEnvironmentV8Version();
		var fails = requireFails();
		var globalThis = requireGlobalThis();

		var $String = globalThis.String;

		// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
		symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails(function () {
		  var symbol = Symbol('symbol detection');
		  // Chrome 38 Symbol has incorrect toString conversion
		  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
		  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
		  // of course, fail.
		  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
		    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
		    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
		});
		return symbolConstructorDetection;
	}

	var useSymbolAsUid;
	var hasRequiredUseSymbolAsUid;

	function requireUseSymbolAsUid () {
		if (hasRequiredUseSymbolAsUid) return useSymbolAsUid;
		hasRequiredUseSymbolAsUid = 1;
		/* eslint-disable es/no-symbol -- required for testing */
		var NATIVE_SYMBOL = requireSymbolConstructorDetection();

		useSymbolAsUid = NATIVE_SYMBOL &&
		  !Symbol.sham &&
		  typeof Symbol.iterator == 'symbol';
		return useSymbolAsUid;
	}

	var isSymbol;
	var hasRequiredIsSymbol;

	function requireIsSymbol () {
		if (hasRequiredIsSymbol) return isSymbol;
		hasRequiredIsSymbol = 1;
		var getBuiltIn = requireGetBuiltIn();
		var isCallable = requireIsCallable();
		var isPrototypeOf = requireObjectIsPrototypeOf();
		var USE_SYMBOL_AS_UID = requireUseSymbolAsUid();

		var $Object = Object;

		isSymbol = USE_SYMBOL_AS_UID ? function (it) {
		  return typeof it == 'symbol';
		} : function (it) {
		  var $Symbol = getBuiltIn('Symbol');
		  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
		};
		return isSymbol;
	}

	var tryToString;
	var hasRequiredTryToString;

	function requireTryToString () {
		if (hasRequiredTryToString) return tryToString;
		hasRequiredTryToString = 1;
		var $String = String;

		tryToString = function (argument) {
		  try {
		    return $String(argument);
		  } catch (error) {
		    return 'Object';
		  }
		};
		return tryToString;
	}

	var aCallable;
	var hasRequiredACallable;

	function requireACallable () {
		if (hasRequiredACallable) return aCallable;
		hasRequiredACallable = 1;
		var isCallable = requireIsCallable();
		var tryToString = requireTryToString();

		var $TypeError = TypeError;

		// `Assert: IsCallable(argument) is true`
		aCallable = function (argument) {
		  if (isCallable(argument)) return argument;
		  throw new $TypeError(tryToString(argument) + ' is not a function');
		};
		return aCallable;
	}

	var getMethod;
	var hasRequiredGetMethod;

	function requireGetMethod () {
		if (hasRequiredGetMethod) return getMethod;
		hasRequiredGetMethod = 1;
		var aCallable = requireACallable();
		var isNullOrUndefined = requireIsNullOrUndefined();

		// `GetMethod` abstract operation
		// https://tc39.es/ecma262/#sec-getmethod
		getMethod = function (V, P) {
		  var func = V[P];
		  return isNullOrUndefined(func) ? undefined : aCallable(func);
		};
		return getMethod;
	}

	var ordinaryToPrimitive;
	var hasRequiredOrdinaryToPrimitive;

	function requireOrdinaryToPrimitive () {
		if (hasRequiredOrdinaryToPrimitive) return ordinaryToPrimitive;
		hasRequiredOrdinaryToPrimitive = 1;
		var call = requireFunctionCall();
		var isCallable = requireIsCallable();
		var isObject = requireIsObject();

		var $TypeError = TypeError;

		// `OrdinaryToPrimitive` abstract operation
		// https://tc39.es/ecma262/#sec-ordinarytoprimitive
		ordinaryToPrimitive = function (input, pref) {
		  var fn, val;
		  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
		  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
		  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
		  throw new $TypeError("Can't convert object to primitive value");
		};
		return ordinaryToPrimitive;
	}

	var sharedStore = {exports: {}};

	var isPure;
	var hasRequiredIsPure;

	function requireIsPure () {
		if (hasRequiredIsPure) return isPure;
		hasRequiredIsPure = 1;
		isPure = false;
		return isPure;
	}

	var defineGlobalProperty;
	var hasRequiredDefineGlobalProperty;

	function requireDefineGlobalProperty () {
		if (hasRequiredDefineGlobalProperty) return defineGlobalProperty;
		hasRequiredDefineGlobalProperty = 1;
		var globalThis = requireGlobalThis();

		// eslint-disable-next-line es/no-object-defineproperty -- safe
		var defineProperty = Object.defineProperty;

		defineGlobalProperty = function (key, value) {
		  try {
		    defineProperty(globalThis, key, { value: value, configurable: true, writable: true });
		  } catch (error) {
		    globalThis[key] = value;
		  } return value;
		};
		return defineGlobalProperty;
	}

	var hasRequiredSharedStore;

	function requireSharedStore () {
		if (hasRequiredSharedStore) return sharedStore.exports;
		hasRequiredSharedStore = 1;
		var IS_PURE = requireIsPure();
		var globalThis = requireGlobalThis();
		var defineGlobalProperty = requireDefineGlobalProperty();

		var SHARED = '__core-js_shared__';
		var store = sharedStore.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

		(store.versions || (store.versions = [])).push({
		  version: '3.39.0',
		  mode: IS_PURE ? 'pure' : 'global',
		  copyright: '© 2014-2024 Denis Pushkarev (zloirock.ru)',
		  license: 'https://github.com/zloirock/core-js/blob/v3.39.0/LICENSE',
		  source: 'https://github.com/zloirock/core-js'
		});
		return sharedStore.exports;
	}

	var shared;
	var hasRequiredShared;

	function requireShared () {
		if (hasRequiredShared) return shared;
		hasRequiredShared = 1;
		var store = requireSharedStore();

		shared = function (key, value) {
		  return store[key] || (store[key] = value || {});
		};
		return shared;
	}

	var toObject;
	var hasRequiredToObject;

	function requireToObject () {
		if (hasRequiredToObject) return toObject;
		hasRequiredToObject = 1;
		var requireObjectCoercible = requireRequireObjectCoercible();

		var $Object = Object;

		// `ToObject` abstract operation
		// https://tc39.es/ecma262/#sec-toobject
		toObject = function (argument) {
		  return $Object(requireObjectCoercible(argument));
		};
		return toObject;
	}

	var hasOwnProperty_1;
	var hasRequiredHasOwnProperty;

	function requireHasOwnProperty () {
		if (hasRequiredHasOwnProperty) return hasOwnProperty_1;
		hasRequiredHasOwnProperty = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var toObject = requireToObject();

		var hasOwnProperty = uncurryThis({}.hasOwnProperty);

		// `HasOwnProperty` abstract operation
		// https://tc39.es/ecma262/#sec-hasownproperty
		// eslint-disable-next-line es/no-object-hasown -- safe
		hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
		  return hasOwnProperty(toObject(it), key);
		};
		return hasOwnProperty_1;
	}

	var uid;
	var hasRequiredUid;

	function requireUid () {
		if (hasRequiredUid) return uid;
		hasRequiredUid = 1;
		var uncurryThis = requireFunctionUncurryThis();

		var id = 0;
		var postfix = Math.random();
		var toString = uncurryThis(1.0.toString);

		uid = function (key) {
		  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
		};
		return uid;
	}

	var wellKnownSymbol;
	var hasRequiredWellKnownSymbol;

	function requireWellKnownSymbol () {
		if (hasRequiredWellKnownSymbol) return wellKnownSymbol;
		hasRequiredWellKnownSymbol = 1;
		var globalThis = requireGlobalThis();
		var shared = requireShared();
		var hasOwn = requireHasOwnProperty();
		var uid = requireUid();
		var NATIVE_SYMBOL = requireSymbolConstructorDetection();
		var USE_SYMBOL_AS_UID = requireUseSymbolAsUid();

		var Symbol = globalThis.Symbol;
		var WellKnownSymbolsStore = shared('wks');
		var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

		wellKnownSymbol = function (name) {
		  if (!hasOwn(WellKnownSymbolsStore, name)) {
		    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
		      ? Symbol[name]
		      : createWellKnownSymbol('Symbol.' + name);
		  } return WellKnownSymbolsStore[name];
		};
		return wellKnownSymbol;
	}

	var toPrimitive;
	var hasRequiredToPrimitive;

	function requireToPrimitive () {
		if (hasRequiredToPrimitive) return toPrimitive;
		hasRequiredToPrimitive = 1;
		var call = requireFunctionCall();
		var isObject = requireIsObject();
		var isSymbol = requireIsSymbol();
		var getMethod = requireGetMethod();
		var ordinaryToPrimitive = requireOrdinaryToPrimitive();
		var wellKnownSymbol = requireWellKnownSymbol();

		var $TypeError = TypeError;
		var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

		// `ToPrimitive` abstract operation
		// https://tc39.es/ecma262/#sec-toprimitive
		toPrimitive = function (input, pref) {
		  if (!isObject(input) || isSymbol(input)) return input;
		  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
		  var result;
		  if (exoticToPrim) {
		    if (pref === undefined) pref = 'default';
		    result = call(exoticToPrim, input, pref);
		    if (!isObject(result) || isSymbol(result)) return result;
		    throw new $TypeError("Can't convert object to primitive value");
		  }
		  if (pref === undefined) pref = 'number';
		  return ordinaryToPrimitive(input, pref);
		};
		return toPrimitive;
	}

	var toPropertyKey;
	var hasRequiredToPropertyKey;

	function requireToPropertyKey () {
		if (hasRequiredToPropertyKey) return toPropertyKey;
		hasRequiredToPropertyKey = 1;
		var toPrimitive = requireToPrimitive();
		var isSymbol = requireIsSymbol();

		// `ToPropertyKey` abstract operation
		// https://tc39.es/ecma262/#sec-topropertykey
		toPropertyKey = function (argument) {
		  var key = toPrimitive(argument, 'string');
		  return isSymbol(key) ? key : key + '';
		};
		return toPropertyKey;
	}

	var documentCreateElement;
	var hasRequiredDocumentCreateElement;

	function requireDocumentCreateElement () {
		if (hasRequiredDocumentCreateElement) return documentCreateElement;
		hasRequiredDocumentCreateElement = 1;
		var globalThis = requireGlobalThis();
		var isObject = requireIsObject();

		var document = globalThis.document;
		// typeof document.createElement is 'object' in old IE
		var EXISTS = isObject(document) && isObject(document.createElement);

		documentCreateElement = function (it) {
		  return EXISTS ? document.createElement(it) : {};
		};
		return documentCreateElement;
	}

	var ie8DomDefine;
	var hasRequiredIe8DomDefine;

	function requireIe8DomDefine () {
		if (hasRequiredIe8DomDefine) return ie8DomDefine;
		hasRequiredIe8DomDefine = 1;
		var DESCRIPTORS = requireDescriptors();
		var fails = requireFails();
		var createElement = requireDocumentCreateElement();

		// Thanks to IE8 for its funny defineProperty
		ie8DomDefine = !DESCRIPTORS && !fails(function () {
		  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
		  return Object.defineProperty(createElement('div'), 'a', {
		    get: function () { return 7; }
		  }).a !== 7;
		});
		return ie8DomDefine;
	}

	var hasRequiredObjectGetOwnPropertyDescriptor;

	function requireObjectGetOwnPropertyDescriptor () {
		if (hasRequiredObjectGetOwnPropertyDescriptor) return objectGetOwnPropertyDescriptor;
		hasRequiredObjectGetOwnPropertyDescriptor = 1;
		var DESCRIPTORS = requireDescriptors();
		var call = requireFunctionCall();
		var propertyIsEnumerableModule = requireObjectPropertyIsEnumerable();
		var createPropertyDescriptor = requireCreatePropertyDescriptor();
		var toIndexedObject = requireToIndexedObject();
		var toPropertyKey = requireToPropertyKey();
		var hasOwn = requireHasOwnProperty();
		var IE8_DOM_DEFINE = requireIe8DomDefine();

		// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
		var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

		// `Object.getOwnPropertyDescriptor` method
		// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
		objectGetOwnPropertyDescriptor.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
		  O = toIndexedObject(O);
		  P = toPropertyKey(P);
		  if (IE8_DOM_DEFINE) try {
		    return $getOwnPropertyDescriptor(O, P);
		  } catch (error) { /* empty */ }
		  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
		};
		return objectGetOwnPropertyDescriptor;
	}

	var objectDefineProperty = {};

	var v8PrototypeDefineBug;
	var hasRequiredV8PrototypeDefineBug;

	function requireV8PrototypeDefineBug () {
		if (hasRequiredV8PrototypeDefineBug) return v8PrototypeDefineBug;
		hasRequiredV8PrototypeDefineBug = 1;
		var DESCRIPTORS = requireDescriptors();
		var fails = requireFails();

		// V8 ~ Chrome 36-
		// https://bugs.chromium.org/p/v8/issues/detail?id=3334
		v8PrototypeDefineBug = DESCRIPTORS && fails(function () {
		  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
		  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
		    value: 42,
		    writable: false
		  }).prototype !== 42;
		});
		return v8PrototypeDefineBug;
	}

	var anObject;
	var hasRequiredAnObject;

	function requireAnObject () {
		if (hasRequiredAnObject) return anObject;
		hasRequiredAnObject = 1;
		var isObject = requireIsObject();

		var $String = String;
		var $TypeError = TypeError;

		// `Assert: Type(argument) is Object`
		anObject = function (argument) {
		  if (isObject(argument)) return argument;
		  throw new $TypeError($String(argument) + ' is not an object');
		};
		return anObject;
	}

	var hasRequiredObjectDefineProperty;

	function requireObjectDefineProperty () {
		if (hasRequiredObjectDefineProperty) return objectDefineProperty;
		hasRequiredObjectDefineProperty = 1;
		var DESCRIPTORS = requireDescriptors();
		var IE8_DOM_DEFINE = requireIe8DomDefine();
		var V8_PROTOTYPE_DEFINE_BUG = requireV8PrototypeDefineBug();
		var anObject = requireAnObject();
		var toPropertyKey = requireToPropertyKey();

		var $TypeError = TypeError;
		// eslint-disable-next-line es/no-object-defineproperty -- safe
		var $defineProperty = Object.defineProperty;
		// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
		var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
		var ENUMERABLE = 'enumerable';
		var CONFIGURABLE = 'configurable';
		var WRITABLE = 'writable';

		// `Object.defineProperty` method
		// https://tc39.es/ecma262/#sec-object.defineproperty
		objectDefineProperty.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
		  anObject(O);
		  P = toPropertyKey(P);
		  anObject(Attributes);
		  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
		    var current = $getOwnPropertyDescriptor(O, P);
		    if (current && current[WRITABLE]) {
		      O[P] = Attributes.value;
		      Attributes = {
		        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
		        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
		        writable: false
		      };
		    }
		  } return $defineProperty(O, P, Attributes);
		} : $defineProperty : function defineProperty(O, P, Attributes) {
		  anObject(O);
		  P = toPropertyKey(P);
		  anObject(Attributes);
		  if (IE8_DOM_DEFINE) try {
		    return $defineProperty(O, P, Attributes);
		  } catch (error) { /* empty */ }
		  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
		  if ('value' in Attributes) O[P] = Attributes.value;
		  return O;
		};
		return objectDefineProperty;
	}

	var createNonEnumerableProperty;
	var hasRequiredCreateNonEnumerableProperty;

	function requireCreateNonEnumerableProperty () {
		if (hasRequiredCreateNonEnumerableProperty) return createNonEnumerableProperty;
		hasRequiredCreateNonEnumerableProperty = 1;
		var DESCRIPTORS = requireDescriptors();
		var definePropertyModule = requireObjectDefineProperty();
		var createPropertyDescriptor = requireCreatePropertyDescriptor();

		createNonEnumerableProperty = DESCRIPTORS ? function (object, key, value) {
		  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
		} : function (object, key, value) {
		  object[key] = value;
		  return object;
		};
		return createNonEnumerableProperty;
	}

	var makeBuiltIn = {exports: {}};

	var functionName;
	var hasRequiredFunctionName;

	function requireFunctionName () {
		if (hasRequiredFunctionName) return functionName;
		hasRequiredFunctionName = 1;
		var DESCRIPTORS = requireDescriptors();
		var hasOwn = requireHasOwnProperty();

		var FunctionPrototype = Function.prototype;
		// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
		var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

		var EXISTS = hasOwn(FunctionPrototype, 'name');
		// additional protection from minified / mangled / dropped function names
		var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
		var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

		functionName = {
		  EXISTS: EXISTS,
		  PROPER: PROPER,
		  CONFIGURABLE: CONFIGURABLE
		};
		return functionName;
	}

	var inspectSource;
	var hasRequiredInspectSource;

	function requireInspectSource () {
		if (hasRequiredInspectSource) return inspectSource;
		hasRequiredInspectSource = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var isCallable = requireIsCallable();
		var store = requireSharedStore();

		var functionToString = uncurryThis(Function.toString);

		// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
		if (!isCallable(store.inspectSource)) {
		  store.inspectSource = function (it) {
		    return functionToString(it);
		  };
		}

		inspectSource = store.inspectSource;
		return inspectSource;
	}

	var weakMapBasicDetection;
	var hasRequiredWeakMapBasicDetection;

	function requireWeakMapBasicDetection () {
		if (hasRequiredWeakMapBasicDetection) return weakMapBasicDetection;
		hasRequiredWeakMapBasicDetection = 1;
		var globalThis = requireGlobalThis();
		var isCallable = requireIsCallable();

		var WeakMap = globalThis.WeakMap;

		weakMapBasicDetection = isCallable(WeakMap) && /native code/.test(String(WeakMap));
		return weakMapBasicDetection;
	}

	var sharedKey;
	var hasRequiredSharedKey;

	function requireSharedKey () {
		if (hasRequiredSharedKey) return sharedKey;
		hasRequiredSharedKey = 1;
		var shared = requireShared();
		var uid = requireUid();

		var keys = shared('keys');

		sharedKey = function (key) {
		  return keys[key] || (keys[key] = uid(key));
		};
		return sharedKey;
	}

	var hiddenKeys;
	var hasRequiredHiddenKeys;

	function requireHiddenKeys () {
		if (hasRequiredHiddenKeys) return hiddenKeys;
		hasRequiredHiddenKeys = 1;
		hiddenKeys = {};
		return hiddenKeys;
	}

	var internalState;
	var hasRequiredInternalState;

	function requireInternalState () {
		if (hasRequiredInternalState) return internalState;
		hasRequiredInternalState = 1;
		var NATIVE_WEAK_MAP = requireWeakMapBasicDetection();
		var globalThis = requireGlobalThis();
		var isObject = requireIsObject();
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
		var hasOwn = requireHasOwnProperty();
		var shared = requireSharedStore();
		var sharedKey = requireSharedKey();
		var hiddenKeys = requireHiddenKeys();

		var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
		var TypeError = globalThis.TypeError;
		var WeakMap = globalThis.WeakMap;
		var set, get, has;

		var enforce = function (it) {
		  return has(it) ? get(it) : set(it, {});
		};

		var getterFor = function (TYPE) {
		  return function (it) {
		    var state;
		    if (!isObject(it) || (state = get(it)).type !== TYPE) {
		      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
		    } return state;
		  };
		};

		if (NATIVE_WEAK_MAP || shared.state) {
		  var store = shared.state || (shared.state = new WeakMap());
		  /* eslint-disable no-self-assign -- prototype methods protection */
		  store.get = store.get;
		  store.has = store.has;
		  store.set = store.set;
		  /* eslint-enable no-self-assign -- prototype methods protection */
		  set = function (it, metadata) {
		    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
		    metadata.facade = it;
		    store.set(it, metadata);
		    return metadata;
		  };
		  get = function (it) {
		    return store.get(it) || {};
		  };
		  has = function (it) {
		    return store.has(it);
		  };
		} else {
		  var STATE = sharedKey('state');
		  hiddenKeys[STATE] = true;
		  set = function (it, metadata) {
		    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
		    metadata.facade = it;
		    createNonEnumerableProperty(it, STATE, metadata);
		    return metadata;
		  };
		  get = function (it) {
		    return hasOwn(it, STATE) ? it[STATE] : {};
		  };
		  has = function (it) {
		    return hasOwn(it, STATE);
		  };
		}

		internalState = {
		  set: set,
		  get: get,
		  has: has,
		  enforce: enforce,
		  getterFor: getterFor
		};
		return internalState;
	}

	var hasRequiredMakeBuiltIn;

	function requireMakeBuiltIn () {
		if (hasRequiredMakeBuiltIn) return makeBuiltIn.exports;
		hasRequiredMakeBuiltIn = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var fails = requireFails();
		var isCallable = requireIsCallable();
		var hasOwn = requireHasOwnProperty();
		var DESCRIPTORS = requireDescriptors();
		var CONFIGURABLE_FUNCTION_NAME = requireFunctionName().CONFIGURABLE;
		var inspectSource = requireInspectSource();
		var InternalStateModule = requireInternalState();

		var enforceInternalState = InternalStateModule.enforce;
		var getInternalState = InternalStateModule.get;
		var $String = String;
		// eslint-disable-next-line es/no-object-defineproperty -- safe
		var defineProperty = Object.defineProperty;
		var stringSlice = uncurryThis(''.slice);
		var replace = uncurryThis(''.replace);
		var join = uncurryThis([].join);

		var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
		  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
		});

		var TEMPLATE = String(String).split('String');

		var makeBuiltIn$1 = makeBuiltIn.exports = function (value, name, options) {
		  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
		    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
		  }
		  if (options && options.getter) name = 'get ' + name;
		  if (options && options.setter) name = 'set ' + name;
		  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
		    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
		    else value.name = name;
		  }
		  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
		    defineProperty(value, 'length', { value: options.arity });
		  }
		  try {
		    if (options && hasOwn(options, 'constructor') && options.constructor) {
		      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
		    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
		    } else if (value.prototype) value.prototype = undefined;
		  } catch (error) { /* empty */ }
		  var state = enforceInternalState(value);
		  if (!hasOwn(state, 'source')) {
		    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
		  } return value;
		};

		// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
		// eslint-disable-next-line no-extend-native -- required
		Function.prototype.toString = makeBuiltIn$1(function toString() {
		  return isCallable(this) && getInternalState(this).source || inspectSource(this);
		}, 'toString');
		return makeBuiltIn.exports;
	}

	var defineBuiltIn;
	var hasRequiredDefineBuiltIn;

	function requireDefineBuiltIn () {
		if (hasRequiredDefineBuiltIn) return defineBuiltIn;
		hasRequiredDefineBuiltIn = 1;
		var isCallable = requireIsCallable();
		var definePropertyModule = requireObjectDefineProperty();
		var makeBuiltIn = requireMakeBuiltIn();
		var defineGlobalProperty = requireDefineGlobalProperty();

		defineBuiltIn = function (O, key, value, options) {
		  if (!options) options = {};
		  var simple = options.enumerable;
		  var name = options.name !== undefined ? options.name : key;
		  if (isCallable(value)) makeBuiltIn(value, name, options);
		  if (options.global) {
		    if (simple) O[key] = value;
		    else defineGlobalProperty(key, value);
		  } else {
		    try {
		      if (!options.unsafe) delete O[key];
		      else if (O[key]) simple = true;
		    } catch (error) { /* empty */ }
		    if (simple) O[key] = value;
		    else definePropertyModule.f(O, key, {
		      value: value,
		      enumerable: false,
		      configurable: !options.nonConfigurable,
		      writable: !options.nonWritable
		    });
		  } return O;
		};
		return defineBuiltIn;
	}

	var objectGetOwnPropertyNames = {};

	var mathTrunc;
	var hasRequiredMathTrunc;

	function requireMathTrunc () {
		if (hasRequiredMathTrunc) return mathTrunc;
		hasRequiredMathTrunc = 1;
		var ceil = Math.ceil;
		var floor = Math.floor;

		// `Math.trunc` method
		// https://tc39.es/ecma262/#sec-math.trunc
		// eslint-disable-next-line es/no-math-trunc -- safe
		mathTrunc = Math.trunc || function trunc(x) {
		  var n = +x;
		  return (n > 0 ? floor : ceil)(n);
		};
		return mathTrunc;
	}

	var toIntegerOrInfinity;
	var hasRequiredToIntegerOrInfinity;

	function requireToIntegerOrInfinity () {
		if (hasRequiredToIntegerOrInfinity) return toIntegerOrInfinity;
		hasRequiredToIntegerOrInfinity = 1;
		var trunc = requireMathTrunc();

		// `ToIntegerOrInfinity` abstract operation
		// https://tc39.es/ecma262/#sec-tointegerorinfinity
		toIntegerOrInfinity = function (argument) {
		  var number = +argument;
		  // eslint-disable-next-line no-self-compare -- NaN check
		  return number !== number || number === 0 ? 0 : trunc(number);
		};
		return toIntegerOrInfinity;
	}

	var toAbsoluteIndex;
	var hasRequiredToAbsoluteIndex;

	function requireToAbsoluteIndex () {
		if (hasRequiredToAbsoluteIndex) return toAbsoluteIndex;
		hasRequiredToAbsoluteIndex = 1;
		var toIntegerOrInfinity = requireToIntegerOrInfinity();

		var max = Math.max;
		var min = Math.min;

		// Helper for a popular repeating case of the spec:
		// Let integer be ? ToInteger(index).
		// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
		toAbsoluteIndex = function (index, length) {
		  var integer = toIntegerOrInfinity(index);
		  return integer < 0 ? max(integer + length, 0) : min(integer, length);
		};
		return toAbsoluteIndex;
	}

	var toLength;
	var hasRequiredToLength;

	function requireToLength () {
		if (hasRequiredToLength) return toLength;
		hasRequiredToLength = 1;
		var toIntegerOrInfinity = requireToIntegerOrInfinity();

		var min = Math.min;

		// `ToLength` abstract operation
		// https://tc39.es/ecma262/#sec-tolength
		toLength = function (argument) {
		  var len = toIntegerOrInfinity(argument);
		  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
		};
		return toLength;
	}

	var lengthOfArrayLike;
	var hasRequiredLengthOfArrayLike;

	function requireLengthOfArrayLike () {
		if (hasRequiredLengthOfArrayLike) return lengthOfArrayLike;
		hasRequiredLengthOfArrayLike = 1;
		var toLength = requireToLength();

		// `LengthOfArrayLike` abstract operation
		// https://tc39.es/ecma262/#sec-lengthofarraylike
		lengthOfArrayLike = function (obj) {
		  return toLength(obj.length);
		};
		return lengthOfArrayLike;
	}

	var arrayIncludes;
	var hasRequiredArrayIncludes;

	function requireArrayIncludes () {
		if (hasRequiredArrayIncludes) return arrayIncludes;
		hasRequiredArrayIncludes = 1;
		var toIndexedObject = requireToIndexedObject();
		var toAbsoluteIndex = requireToAbsoluteIndex();
		var lengthOfArrayLike = requireLengthOfArrayLike();

		// `Array.prototype.{ indexOf, includes }` methods implementation
		var createMethod = function (IS_INCLUDES) {
		  return function ($this, el, fromIndex) {
		    var O = toIndexedObject($this);
		    var length = lengthOfArrayLike(O);
		    if (length === 0) return !IS_INCLUDES && -1;
		    var index = toAbsoluteIndex(fromIndex, length);
		    var value;
		    // Array#includes uses SameValueZero equality algorithm
		    // eslint-disable-next-line no-self-compare -- NaN check
		    if (IS_INCLUDES && el !== el) while (length > index) {
		      value = O[index++];
		      // eslint-disable-next-line no-self-compare -- NaN check
		      if (value !== value) return true;
		    // Array#indexOf ignores holes, Array#includes - not
		    } else for (;length > index; index++) {
		      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
		    } return !IS_INCLUDES && -1;
		  };
		};

		arrayIncludes = {
		  // `Array.prototype.includes` method
		  // https://tc39.es/ecma262/#sec-array.prototype.includes
		  includes: createMethod(true),
		  // `Array.prototype.indexOf` method
		  // https://tc39.es/ecma262/#sec-array.prototype.indexof
		  indexOf: createMethod(false)
		};
		return arrayIncludes;
	}

	var objectKeysInternal;
	var hasRequiredObjectKeysInternal;

	function requireObjectKeysInternal () {
		if (hasRequiredObjectKeysInternal) return objectKeysInternal;
		hasRequiredObjectKeysInternal = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var hasOwn = requireHasOwnProperty();
		var toIndexedObject = requireToIndexedObject();
		var indexOf = requireArrayIncludes().indexOf;
		var hiddenKeys = requireHiddenKeys();

		var push = uncurryThis([].push);

		objectKeysInternal = function (object, names) {
		  var O = toIndexedObject(object);
		  var i = 0;
		  var result = [];
		  var key;
		  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
		  // Don't enum bug & hidden keys
		  while (names.length > i) if (hasOwn(O, key = names[i++])) {
		    ~indexOf(result, key) || push(result, key);
		  }
		  return result;
		};
		return objectKeysInternal;
	}

	var enumBugKeys;
	var hasRequiredEnumBugKeys;

	function requireEnumBugKeys () {
		if (hasRequiredEnumBugKeys) return enumBugKeys;
		hasRequiredEnumBugKeys = 1;
		// IE8- don't enum bug keys
		enumBugKeys = [
		  'constructor',
		  'hasOwnProperty',
		  'isPrototypeOf',
		  'propertyIsEnumerable',
		  'toLocaleString',
		  'toString',
		  'valueOf'
		];
		return enumBugKeys;
	}

	var hasRequiredObjectGetOwnPropertyNames;

	function requireObjectGetOwnPropertyNames () {
		if (hasRequiredObjectGetOwnPropertyNames) return objectGetOwnPropertyNames;
		hasRequiredObjectGetOwnPropertyNames = 1;
		var internalObjectKeys = requireObjectKeysInternal();
		var enumBugKeys = requireEnumBugKeys();

		var hiddenKeys = enumBugKeys.concat('length', 'prototype');

		// `Object.getOwnPropertyNames` method
		// https://tc39.es/ecma262/#sec-object.getownpropertynames
		// eslint-disable-next-line es/no-object-getownpropertynames -- safe
		objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
		  return internalObjectKeys(O, hiddenKeys);
		};
		return objectGetOwnPropertyNames;
	}

	var objectGetOwnPropertySymbols = {};

	var hasRequiredObjectGetOwnPropertySymbols;

	function requireObjectGetOwnPropertySymbols () {
		if (hasRequiredObjectGetOwnPropertySymbols) return objectGetOwnPropertySymbols;
		hasRequiredObjectGetOwnPropertySymbols = 1;
		// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
		objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;
		return objectGetOwnPropertySymbols;
	}

	var ownKeys;
	var hasRequiredOwnKeys;

	function requireOwnKeys () {
		if (hasRequiredOwnKeys) return ownKeys;
		hasRequiredOwnKeys = 1;
		var getBuiltIn = requireGetBuiltIn();
		var uncurryThis = requireFunctionUncurryThis();
		var getOwnPropertyNamesModule = requireObjectGetOwnPropertyNames();
		var getOwnPropertySymbolsModule = requireObjectGetOwnPropertySymbols();
		var anObject = requireAnObject();

		var concat = uncurryThis([].concat);

		// all object keys, includes non-enumerable and symbols
		ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
		  var keys = getOwnPropertyNamesModule.f(anObject(it));
		  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
		  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
		};
		return ownKeys;
	}

	var copyConstructorProperties;
	var hasRequiredCopyConstructorProperties;

	function requireCopyConstructorProperties () {
		if (hasRequiredCopyConstructorProperties) return copyConstructorProperties;
		hasRequiredCopyConstructorProperties = 1;
		var hasOwn = requireHasOwnProperty();
		var ownKeys = requireOwnKeys();
		var getOwnPropertyDescriptorModule = requireObjectGetOwnPropertyDescriptor();
		var definePropertyModule = requireObjectDefineProperty();

		copyConstructorProperties = function (target, source, exceptions) {
		  var keys = ownKeys(source);
		  var defineProperty = definePropertyModule.f;
		  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
		  for (var i = 0; i < keys.length; i++) {
		    var key = keys[i];
		    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
		      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
		    }
		  }
		};
		return copyConstructorProperties;
	}

	var isForced_1;
	var hasRequiredIsForced;

	function requireIsForced () {
		if (hasRequiredIsForced) return isForced_1;
		hasRequiredIsForced = 1;
		var fails = requireFails();
		var isCallable = requireIsCallable();

		var replacement = /#|\.prototype\./;

		var isForced = function (feature, detection) {
		  var value = data[normalize(feature)];
		  return value === POLYFILL ? true
		    : value === NATIVE ? false
		    : isCallable(detection) ? fails(detection)
		    : !!detection;
		};

		var normalize = isForced.normalize = function (string) {
		  return String(string).replace(replacement, '.').toLowerCase();
		};

		var data = isForced.data = {};
		var NATIVE = isForced.NATIVE = 'N';
		var POLYFILL = isForced.POLYFILL = 'P';

		isForced_1 = isForced;
		return isForced_1;
	}

	var _export;
	var hasRequired_export;

	function require_export () {
		if (hasRequired_export) return _export;
		hasRequired_export = 1;
		var globalThis = requireGlobalThis();
		var getOwnPropertyDescriptor = requireObjectGetOwnPropertyDescriptor().f;
		var createNonEnumerableProperty = requireCreateNonEnumerableProperty();
		var defineBuiltIn = requireDefineBuiltIn();
		var defineGlobalProperty = requireDefineGlobalProperty();
		var copyConstructorProperties = requireCopyConstructorProperties();
		var isForced = requireIsForced();

		/*
		  options.target         - name of the target object
		  options.global         - target is the global object
		  options.stat           - export as static methods of target
		  options.proto          - export as prototype methods of target
		  options.real           - real prototype method for the `pure` version
		  options.forced         - export even if the native feature is available
		  options.bind           - bind methods to the target, required for the `pure` version
		  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
		  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
		  options.sham           - add a flag to not completely full polyfills
		  options.enumerable     - export as enumerable property
		  options.dontCallGetSet - prevent calling a getter on target
		  options.name           - the .name of the function if it does not match the key
		*/
		_export = function (options, source) {
		  var TARGET = options.target;
		  var GLOBAL = options.global;
		  var STATIC = options.stat;
		  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
		  if (GLOBAL) {
		    target = globalThis;
		  } else if (STATIC) {
		    target = globalThis[TARGET] || defineGlobalProperty(TARGET, {});
		  } else {
		    target = globalThis[TARGET] && globalThis[TARGET].prototype;
		  }
		  if (target) for (key in source) {
		    sourceProperty = source[key];
		    if (options.dontCallGetSet) {
		      descriptor = getOwnPropertyDescriptor(target, key);
		      targetProperty = descriptor && descriptor.value;
		    } else targetProperty = target[key];
		    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
		    // contained in target
		    if (!FORCED && targetProperty !== undefined) {
		      if (typeof sourceProperty == typeof targetProperty) continue;
		      copyConstructorProperties(sourceProperty, targetProperty);
		    }
		    // add a flag to not completely full polyfills
		    if (options.sham || (targetProperty && targetProperty.sham)) {
		      createNonEnumerableProperty(sourceProperty, 'sham', true);
		    }
		    defineBuiltIn(target, key, sourceProperty, options);
		  }
		};
		return _export;
	}

	var functionUncurryThisClause;
	var hasRequiredFunctionUncurryThisClause;

	function requireFunctionUncurryThisClause () {
		if (hasRequiredFunctionUncurryThisClause) return functionUncurryThisClause;
		hasRequiredFunctionUncurryThisClause = 1;
		var classofRaw = requireClassofRaw();
		var uncurryThis = requireFunctionUncurryThis();

		functionUncurryThisClause = function (fn) {
		  // Nashorn bug:
		  //   https://github.com/zloirock/core-js/issues/1128
		  //   https://github.com/zloirock/core-js/issues/1130
		  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
		};
		return functionUncurryThisClause;
	}

	var functionBindContext;
	var hasRequiredFunctionBindContext;

	function requireFunctionBindContext () {
		if (hasRequiredFunctionBindContext) return functionBindContext;
		hasRequiredFunctionBindContext = 1;
		var uncurryThis = requireFunctionUncurryThisClause();
		var aCallable = requireACallable();
		var NATIVE_BIND = requireFunctionBindNative();

		var bind = uncurryThis(uncurryThis.bind);

		// optional / simple context binding
		functionBindContext = function (fn, that) {
		  aCallable(fn);
		  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
		    return fn.apply(that, arguments);
		  };
		};
		return functionBindContext;
	}

	var isArray$3;
	var hasRequiredIsArray$3;

	function requireIsArray$3 () {
		if (hasRequiredIsArray$3) return isArray$3;
		hasRequiredIsArray$3 = 1;
		var classof = requireClassofRaw();

		// `IsArray` abstract operation
		// https://tc39.es/ecma262/#sec-isarray
		// eslint-disable-next-line es/no-array-isarray -- safe
		isArray$3 = Array.isArray || function isArray(argument) {
		  return classof(argument) === 'Array';
		};
		return isArray$3;
	}

	var toStringTagSupport;
	var hasRequiredToStringTagSupport;

	function requireToStringTagSupport () {
		if (hasRequiredToStringTagSupport) return toStringTagSupport;
		hasRequiredToStringTagSupport = 1;
		var wellKnownSymbol = requireWellKnownSymbol();

		var TO_STRING_TAG = wellKnownSymbol('toStringTag');
		var test = {};

		test[TO_STRING_TAG] = 'z';

		toStringTagSupport = String(test) === '[object z]';
		return toStringTagSupport;
	}

	var classof;
	var hasRequiredClassof;

	function requireClassof () {
		if (hasRequiredClassof) return classof;
		hasRequiredClassof = 1;
		var TO_STRING_TAG_SUPPORT = requireToStringTagSupport();
		var isCallable = requireIsCallable();
		var classofRaw = requireClassofRaw();
		var wellKnownSymbol = requireWellKnownSymbol();

		var TO_STRING_TAG = wellKnownSymbol('toStringTag');
		var $Object = Object;

		// ES3 wrong here
		var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

		// fallback for IE11 Script Access Denied error
		var tryGet = function (it, key) {
		  try {
		    return it[key];
		  } catch (error) { /* empty */ }
		};

		// getting tag from ES6+ `Object.prototype.toString`
		classof = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
		  var O, tag, result;
		  return it === undefined ? 'Undefined' : it === null ? 'Null'
		    // @@toStringTag case
		    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
		    // builtinTag case
		    : CORRECT_ARGUMENTS ? classofRaw(O)
		    // ES3 arguments fallback
		    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
		};
		return classof;
	}

	var isConstructor;
	var hasRequiredIsConstructor;

	function requireIsConstructor () {
		if (hasRequiredIsConstructor) return isConstructor;
		hasRequiredIsConstructor = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var fails = requireFails();
		var isCallable = requireIsCallable();
		var classof = requireClassof();
		var getBuiltIn = requireGetBuiltIn();
		var inspectSource = requireInspectSource();

		var noop = function () { /* empty */ };
		var construct = getBuiltIn('Reflect', 'construct');
		var constructorRegExp = /^\s*(?:class|function)\b/;
		var exec = uncurryThis(constructorRegExp.exec);
		var INCORRECT_TO_STRING = !constructorRegExp.test(noop);

		var isConstructorModern = function isConstructor(argument) {
		  if (!isCallable(argument)) return false;
		  try {
		    construct(noop, [], argument);
		    return true;
		  } catch (error) {
		    return false;
		  }
		};

		var isConstructorLegacy = function isConstructor(argument) {
		  if (!isCallable(argument)) return false;
		  switch (classof(argument)) {
		    case 'AsyncFunction':
		    case 'GeneratorFunction':
		    case 'AsyncGeneratorFunction': return false;
		  }
		  try {
		    // we can't check .prototype since constructors produced by .bind haven't it
		    // `Function#toString` throws on some built-it function in some legacy engines
		    // (for example, `DOMQuad` and similar in FF41-)
		    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
		  } catch (error) {
		    return true;
		  }
		};

		isConstructorLegacy.sham = true;

		// `IsConstructor` abstract operation
		// https://tc39.es/ecma262/#sec-isconstructor
		isConstructor = !construct || fails(function () {
		  var called;
		  return isConstructorModern(isConstructorModern.call)
		    || !isConstructorModern(Object)
		    || !isConstructorModern(function () { called = true; })
		    || called;
		}) ? isConstructorLegacy : isConstructorModern;
		return isConstructor;
	}

	var arraySpeciesConstructor;
	var hasRequiredArraySpeciesConstructor;

	function requireArraySpeciesConstructor () {
		if (hasRequiredArraySpeciesConstructor) return arraySpeciesConstructor;
		hasRequiredArraySpeciesConstructor = 1;
		var isArray = requireIsArray$3();
		var isConstructor = requireIsConstructor();
		var isObject = requireIsObject();
		var wellKnownSymbol = requireWellKnownSymbol();

		var SPECIES = wellKnownSymbol('species');
		var $Array = Array;

		// a part of `ArraySpeciesCreate` abstract operation
		// https://tc39.es/ecma262/#sec-arrayspeciescreate
		arraySpeciesConstructor = function (originalArray) {
		  var C;
		  if (isArray(originalArray)) {
		    C = originalArray.constructor;
		    // cross-realm fallback
		    if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;
		    else if (isObject(C)) {
		      C = C[SPECIES];
		      if (C === null) C = undefined;
		    }
		  } return C === undefined ? $Array : C;
		};
		return arraySpeciesConstructor;
	}

	var arraySpeciesCreate;
	var hasRequiredArraySpeciesCreate;

	function requireArraySpeciesCreate () {
		if (hasRequiredArraySpeciesCreate) return arraySpeciesCreate;
		hasRequiredArraySpeciesCreate = 1;
		var arraySpeciesConstructor = requireArraySpeciesConstructor();

		// `ArraySpeciesCreate` abstract operation
		// https://tc39.es/ecma262/#sec-arrayspeciescreate
		arraySpeciesCreate = function (originalArray, length) {
		  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
		};
		return arraySpeciesCreate;
	}

	var arrayIteration;
	var hasRequiredArrayIteration;

	function requireArrayIteration () {
		if (hasRequiredArrayIteration) return arrayIteration;
		hasRequiredArrayIteration = 1;
		var bind = requireFunctionBindContext();
		var uncurryThis = requireFunctionUncurryThis();
		var IndexedObject = requireIndexedObject();
		var toObject = requireToObject();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var arraySpeciesCreate = requireArraySpeciesCreate();

		var push = uncurryThis([].push);

		// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
		var createMethod = function (TYPE) {
		  var IS_MAP = TYPE === 1;
		  var IS_FILTER = TYPE === 2;
		  var IS_SOME = TYPE === 3;
		  var IS_EVERY = TYPE === 4;
		  var IS_FIND_INDEX = TYPE === 6;
		  var IS_FILTER_REJECT = TYPE === 7;
		  var NO_HOLES = TYPE === 5 || IS_FIND_INDEX;
		  return function ($this, callbackfn, that, specificCreate) {
		    var O = toObject($this);
		    var self = IndexedObject(O);
		    var length = lengthOfArrayLike(self);
		    var boundFunction = bind(callbackfn, that);
		    var index = 0;
		    var create = specificCreate || arraySpeciesCreate;
		    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
		    var value, result;
		    for (;length > index; index++) if (NO_HOLES || index in self) {
		      value = self[index];
		      result = boundFunction(value, index, O);
		      if (TYPE) {
		        if (IS_MAP) target[index] = result; // map
		        else if (result) switch (TYPE) {
		          case 3: return true;              // some
		          case 5: return value;             // find
		          case 6: return index;             // findIndex
		          case 2: push(target, value);      // filter
		        } else switch (TYPE) {
		          case 4: return false;             // every
		          case 7: push(target, value);      // filterReject
		        }
		      }
		    }
		    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
		  };
		};

		arrayIteration = {
		  // `Array.prototype.forEach` method
		  // https://tc39.es/ecma262/#sec-array.prototype.foreach
		  forEach: createMethod(0),
		  // `Array.prototype.map` method
		  // https://tc39.es/ecma262/#sec-array.prototype.map
		  map: createMethod(1),
		  // `Array.prototype.filter` method
		  // https://tc39.es/ecma262/#sec-array.prototype.filter
		  filter: createMethod(2),
		  // `Array.prototype.some` method
		  // https://tc39.es/ecma262/#sec-array.prototype.some
		  some: createMethod(3),
		  // `Array.prototype.every` method
		  // https://tc39.es/ecma262/#sec-array.prototype.every
		  every: createMethod(4),
		  // `Array.prototype.find` method
		  // https://tc39.es/ecma262/#sec-array.prototype.find
		  find: createMethod(5),
		  // `Array.prototype.findIndex` method
		  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
		  findIndex: createMethod(6),
		  // `Array.prototype.filterReject` method
		  // https://github.com/tc39/proposal-array-filtering
		  filterReject: createMethod(7)
		};
		return arrayIteration;
	}

	var arrayMethodHasSpeciesSupport;
	var hasRequiredArrayMethodHasSpeciesSupport;

	function requireArrayMethodHasSpeciesSupport () {
		if (hasRequiredArrayMethodHasSpeciesSupport) return arrayMethodHasSpeciesSupport;
		hasRequiredArrayMethodHasSpeciesSupport = 1;
		var fails = requireFails();
		var wellKnownSymbol = requireWellKnownSymbol();
		var V8_VERSION = requireEnvironmentV8Version();

		var SPECIES = wellKnownSymbol('species');

		arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
		  // We can't use this feature detection in V8 since it causes
		  // deoptimization and serious performance degradation
		  // https://github.com/zloirock/core-js/issues/677
		  return V8_VERSION >= 51 || !fails(function () {
		    var array = [];
		    var constructor = array.constructor = {};
		    constructor[SPECIES] = function () {
		      return { foo: 1 };
		    };
		    return array[METHOD_NAME](Boolean).foo !== 1;
		  });
		};
		return arrayMethodHasSpeciesSupport;
	}

	var hasRequiredEs_array_filter;

	function requireEs_array_filter () {
		if (hasRequiredEs_array_filter) return es_array_filter;
		hasRequiredEs_array_filter = 1;
		var $ = require_export();
		var $filter = requireArrayIteration().filter;
		var arrayMethodHasSpeciesSupport = requireArrayMethodHasSpeciesSupport();

		var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

		// `Array.prototype.filter` method
		// https://tc39.es/ecma262/#sec-array.prototype.filter
		// with adding support of @@species
		$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
		  filter: function filter(callbackfn /* , thisArg */) {
		    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
		  }
		});
		return es_array_filter;
	}

	var entryUnbind;
	var hasRequiredEntryUnbind;

	function requireEntryUnbind () {
		if (hasRequiredEntryUnbind) return entryUnbind;
		hasRequiredEntryUnbind = 1;
		var globalThis = requireGlobalThis();
		var uncurryThis = requireFunctionUncurryThis();

		entryUnbind = function (CONSTRUCTOR, METHOD) {
		  return uncurryThis(globalThis[CONSTRUCTOR].prototype[METHOD]);
		};
		return entryUnbind;
	}

	var filter$2;
	var hasRequiredFilter$2;

	function requireFilter$2 () {
		if (hasRequiredFilter$2) return filter$2;
		hasRequiredFilter$2 = 1;
		requireEs_array_filter();
		var entryUnbind = requireEntryUnbind();

		filter$2 = entryUnbind('Array', 'filter');
		return filter$2;
	}

	var filter$1;
	var hasRequiredFilter$1;

	function requireFilter$1 () {
		if (hasRequiredFilter$1) return filter$1;
		hasRequiredFilter$1 = 1;
		var parent = requireFilter$2();

		filter$1 = parent;
		return filter$1;
	}

	var filter;
	var hasRequiredFilter;

	function requireFilter () {
		if (hasRequiredFilter) return filter;
		hasRequiredFilter = 1;
		var parent = requireFilter$1();

		filter = parent;
		return filter;
	}

	requireFilter();

	var es_array_forEach = {};

	var arrayMethodIsStrict;
	var hasRequiredArrayMethodIsStrict;

	function requireArrayMethodIsStrict () {
		if (hasRequiredArrayMethodIsStrict) return arrayMethodIsStrict;
		hasRequiredArrayMethodIsStrict = 1;
		var fails = requireFails();

		arrayMethodIsStrict = function (METHOD_NAME, argument) {
		  var method = [][METHOD_NAME];
		  return !!method && fails(function () {
		    // eslint-disable-next-line no-useless-call -- required for testing
		    method.call(null, argument || function () { return 1; }, 1);
		  });
		};
		return arrayMethodIsStrict;
	}

	var arrayForEach;
	var hasRequiredArrayForEach;

	function requireArrayForEach () {
		if (hasRequiredArrayForEach) return arrayForEach;
		hasRequiredArrayForEach = 1;
		var $forEach = requireArrayIteration().forEach;
		var arrayMethodIsStrict = requireArrayMethodIsStrict();

		var STRICT_METHOD = arrayMethodIsStrict('forEach');

		// `Array.prototype.forEach` method implementation
		// https://tc39.es/ecma262/#sec-array.prototype.foreach
		arrayForEach = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
		  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
		// eslint-disable-next-line es/no-array-prototype-foreach -- safe
		} : [].forEach;
		return arrayForEach;
	}

	var hasRequiredEs_array_forEach;

	function requireEs_array_forEach () {
		if (hasRequiredEs_array_forEach) return es_array_forEach;
		hasRequiredEs_array_forEach = 1;
		var $ = require_export();
		var forEach = requireArrayForEach();

		// `Array.prototype.forEach` method
		// https://tc39.es/ecma262/#sec-array.prototype.foreach
		// eslint-disable-next-line es/no-array-prototype-foreach -- safe
		$({ target: 'Array', proto: true, forced: [].forEach !== forEach }, {
		  forEach: forEach
		});
		return es_array_forEach;
	}

	var forEach$2;
	var hasRequiredForEach$2;

	function requireForEach$2 () {
		if (hasRequiredForEach$2) return forEach$2;
		hasRequiredForEach$2 = 1;
		requireEs_array_forEach();
		var entryUnbind = requireEntryUnbind();

		forEach$2 = entryUnbind('Array', 'forEach');
		return forEach$2;
	}

	var forEach$1;
	var hasRequiredForEach$1;

	function requireForEach$1 () {
		if (hasRequiredForEach$1) return forEach$1;
		hasRequiredForEach$1 = 1;
		var parent = requireForEach$2();

		forEach$1 = parent;
		return forEach$1;
	}

	var forEach;
	var hasRequiredForEach;

	function requireForEach () {
		if (hasRequiredForEach) return forEach;
		hasRequiredForEach = 1;
		var parent = requireForEach$1();

		forEach = parent;
		return forEach;
	}

	requireForEach();

	var es_array_isArray = {};

	var hasRequiredEs_array_isArray;

	function requireEs_array_isArray () {
		if (hasRequiredEs_array_isArray) return es_array_isArray;
		hasRequiredEs_array_isArray = 1;
		var $ = require_export();
		var isArray = requireIsArray$3();

		// `Array.isArray` method
		// https://tc39.es/ecma262/#sec-array.isarray
		$({ target: 'Array', stat: true }, {
		  isArray: isArray
		});
		return es_array_isArray;
	}

	var path;
	var hasRequiredPath;

	function requirePath () {
		if (hasRequiredPath) return path;
		hasRequiredPath = 1;
		var globalThis = requireGlobalThis();

		path = globalThis;
		return path;
	}

	var isArray$2;
	var hasRequiredIsArray$2;

	function requireIsArray$2 () {
		if (hasRequiredIsArray$2) return isArray$2;
		hasRequiredIsArray$2 = 1;
		requireEs_array_isArray();
		var path = requirePath();

		isArray$2 = path.Array.isArray;
		return isArray$2;
	}

	var isArray$1;
	var hasRequiredIsArray$1;

	function requireIsArray$1 () {
		if (hasRequiredIsArray$1) return isArray$1;
		hasRequiredIsArray$1 = 1;
		var parent = requireIsArray$2();

		isArray$1 = parent;
		return isArray$1;
	}

	var isArray;
	var hasRequiredIsArray;

	function requireIsArray () {
		if (hasRequiredIsArray) return isArray;
		hasRequiredIsArray = 1;
		var parent = requireIsArray$1();

		isArray = parent;
		return isArray;
	}

	requireIsArray();

	var es_array_map = {};

	var hasRequiredEs_array_map;

	function requireEs_array_map () {
		if (hasRequiredEs_array_map) return es_array_map;
		hasRequiredEs_array_map = 1;
		var $ = require_export();
		var $map = requireArrayIteration().map;
		var arrayMethodHasSpeciesSupport = requireArrayMethodHasSpeciesSupport();

		var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');

		// `Array.prototype.map` method
		// https://tc39.es/ecma262/#sec-array.prototype.map
		// with adding support of @@species
		$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
		  map: function map(callbackfn /* , thisArg */) {
		    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
		  }
		});
		return es_array_map;
	}

	var map$2;
	var hasRequiredMap$2;

	function requireMap$2 () {
		if (hasRequiredMap$2) return map$2;
		hasRequiredMap$2 = 1;
		requireEs_array_map();
		var entryUnbind = requireEntryUnbind();

		map$2 = entryUnbind('Array', 'map');
		return map$2;
	}

	var map$1;
	var hasRequiredMap$1;

	function requireMap$1 () {
		if (hasRequiredMap$1) return map$1;
		hasRequiredMap$1 = 1;
		var parent = requireMap$2();

		map$1 = parent;
		return map$1;
	}

	var map;
	var hasRequiredMap;

	function requireMap () {
		if (hasRequiredMap) return map;
		hasRequiredMap = 1;
		var parent = requireMap$1();

		map = parent;
		return map;
	}

	requireMap();

	var es_object_keys = {};

	var objectKeys;
	var hasRequiredObjectKeys;

	function requireObjectKeys () {
		if (hasRequiredObjectKeys) return objectKeys;
		hasRequiredObjectKeys = 1;
		var internalObjectKeys = requireObjectKeysInternal();
		var enumBugKeys = requireEnumBugKeys();

		// `Object.keys` method
		// https://tc39.es/ecma262/#sec-object.keys
		// eslint-disable-next-line es/no-object-keys -- safe
		objectKeys = Object.keys || function keys(O) {
		  return internalObjectKeys(O, enumBugKeys);
		};
		return objectKeys;
	}

	var hasRequiredEs_object_keys;

	function requireEs_object_keys () {
		if (hasRequiredEs_object_keys) return es_object_keys;
		hasRequiredEs_object_keys = 1;
		var $ = require_export();
		var toObject = requireToObject();
		var nativeKeys = requireObjectKeys();
		var fails = requireFails();

		var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

		// `Object.keys` method
		// https://tc39.es/ecma262/#sec-object.keys
		$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
		  keys: function keys(it) {
		    return nativeKeys(toObject(it));
		  }
		});
		return es_object_keys;
	}

	var esnext_json_parse = {};

	var toString;
	var hasRequiredToString;

	function requireToString () {
		if (hasRequiredToString) return toString;
		hasRequiredToString = 1;
		var classof = requireClassof();

		var $String = String;

		toString = function (argument) {
		  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
		  return $String(argument);
		};
		return toString;
	}

	var createProperty;
	var hasRequiredCreateProperty;

	function requireCreateProperty () {
		if (hasRequiredCreateProperty) return createProperty;
		hasRequiredCreateProperty = 1;
		var DESCRIPTORS = requireDescriptors();
		var definePropertyModule = requireObjectDefineProperty();
		var createPropertyDescriptor = requireCreatePropertyDescriptor();

		createProperty = function (object, key, value) {
		  if (DESCRIPTORS) definePropertyModule.f(object, key, createPropertyDescriptor(0, value));
		  else object[key] = value;
		};
		return createProperty;
	}

	var parseJsonString;
	var hasRequiredParseJsonString;

	function requireParseJsonString () {
		if (hasRequiredParseJsonString) return parseJsonString;
		hasRequiredParseJsonString = 1;
		var uncurryThis = requireFunctionUncurryThis();
		var hasOwn = requireHasOwnProperty();

		var $SyntaxError = SyntaxError;
		var $parseInt = parseInt;
		var fromCharCode = String.fromCharCode;
		var at = uncurryThis(''.charAt);
		var slice = uncurryThis(''.slice);
		var exec = uncurryThis(/./.exec);

		var codePoints = {
		  '\\"': '"',
		  '\\\\': '\\',
		  '\\/': '/',
		  '\\b': '\b',
		  '\\f': '\f',
		  '\\n': '\n',
		  '\\r': '\r',
		  '\\t': '\t'
		};

		var IS_4_HEX_DIGITS = /^[\da-f]{4}$/i;
		// eslint-disable-next-line regexp/no-control-character -- safe
		var IS_C0_CONTROL_CODE = /^[\u0000-\u001F]$/;

		parseJsonString = function (source, i) {
		  var unterminated = true;
		  var value = '';
		  while (i < source.length) {
		    var chr = at(source, i);
		    if (chr === '\\') {
		      var twoChars = slice(source, i, i + 2);
		      if (hasOwn(codePoints, twoChars)) {
		        value += codePoints[twoChars];
		        i += 2;
		      } else if (twoChars === '\\u') {
		        i += 2;
		        var fourHexDigits = slice(source, i, i + 4);
		        if (!exec(IS_4_HEX_DIGITS, fourHexDigits)) throw new $SyntaxError('Bad Unicode escape at: ' + i);
		        value += fromCharCode($parseInt(fourHexDigits, 16));
		        i += 4;
		      } else throw new $SyntaxError('Unknown escape sequence: "' + twoChars + '"');
		    } else if (chr === '"') {
		      unterminated = false;
		      i++;
		      break;
		    } else {
		      if (exec(IS_C0_CONTROL_CODE, chr)) throw new $SyntaxError('Bad control character in string literal at: ' + i);
		      value += chr;
		      i++;
		    }
		  }
		  if (unterminated) throw new $SyntaxError('Unterminated string at: ' + i);
		  return { value: value, end: i };
		};
		return parseJsonString;
	}

	var hasRequiredEsnext_json_parse;

	function requireEsnext_json_parse () {
		if (hasRequiredEsnext_json_parse) return esnext_json_parse;
		hasRequiredEsnext_json_parse = 1;
		var $ = require_export();
		var DESCRIPTORS = requireDescriptors();
		var globalThis = requireGlobalThis();
		var getBuiltIn = requireGetBuiltIn();
		var uncurryThis = requireFunctionUncurryThis();
		var call = requireFunctionCall();
		var isCallable = requireIsCallable();
		var isObject = requireIsObject();
		var isArray = requireIsArray$3();
		var hasOwn = requireHasOwnProperty();
		var toString = requireToString();
		var lengthOfArrayLike = requireLengthOfArrayLike();
		var createProperty = requireCreateProperty();
		var fails = requireFails();
		var parseJSONString = requireParseJsonString();
		var NATIVE_SYMBOL = requireSymbolConstructorDetection();

		var JSON = globalThis.JSON;
		var Number = globalThis.Number;
		var SyntaxError = globalThis.SyntaxError;
		var nativeParse = JSON && JSON.parse;
		var enumerableOwnProperties = getBuiltIn('Object', 'keys');
		// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
		var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
		var at = uncurryThis(''.charAt);
		var slice = uncurryThis(''.slice);
		var exec = uncurryThis(/./.exec);
		var push = uncurryThis([].push);

		var IS_DIGIT = /^\d$/;
		var IS_NON_ZERO_DIGIT = /^[1-9]$/;
		var IS_NUMBER_START = /^[\d-]$/;
		var IS_WHITESPACE = /^[\t\n\r ]$/;

		var PRIMITIVE = 0;
		var OBJECT = 1;

		var $parse = function (source, reviver) {
		  source = toString(source);
		  var context = new Context(source, 0);
		  var root = context.parse();
		  var value = root.value;
		  var endIndex = context.skip(IS_WHITESPACE, root.end);
		  if (endIndex < source.length) {
		    throw new SyntaxError('Unexpected extra character: "' + at(source, endIndex) + '" after the parsed data at: ' + endIndex);
		  }
		  return isCallable(reviver) ? internalize({ '': value }, '', reviver, root) : value;
		};

		var internalize = function (holder, name, reviver, node) {
		  var val = holder[name];
		  var unmodified = node && val === node.value;
		  var context = unmodified && typeof node.source == 'string' ? { source: node.source } : {};
		  var elementRecordsLen, keys, len, i, P;
		  if (isObject(val)) {
		    var nodeIsArray = isArray(val);
		    var nodes = unmodified ? node.nodes : nodeIsArray ? [] : {};
		    if (nodeIsArray) {
		      elementRecordsLen = nodes.length;
		      len = lengthOfArrayLike(val);
		      for (i = 0; i < len; i++) {
		        internalizeProperty(val, i, internalize(val, '' + i, reviver, i < elementRecordsLen ? nodes[i] : undefined));
		      }
		    } else {
		      keys = enumerableOwnProperties(val);
		      len = lengthOfArrayLike(keys);
		      for (i = 0; i < len; i++) {
		        P = keys[i];
		        internalizeProperty(val, P, internalize(val, P, reviver, hasOwn(nodes, P) ? nodes[P] : undefined));
		      }
		    }
		  }
		  return call(reviver, holder, name, val, context);
		};

		var internalizeProperty = function (object, key, value) {
		  if (DESCRIPTORS) {
		    var descriptor = getOwnPropertyDescriptor(object, key);
		    if (descriptor && !descriptor.configurable) return;
		  }
		  if (value === undefined) delete object[key];
		  else createProperty(object, key, value);
		};

		var Node = function (value, end, source, nodes) {
		  this.value = value;
		  this.end = end;
		  this.source = source;
		  this.nodes = nodes;
		};

		var Context = function (source, index) {
		  this.source = source;
		  this.index = index;
		};

		// https://www.json.org/json-en.html
		Context.prototype = {
		  fork: function (nextIndex) {
		    return new Context(this.source, nextIndex);
		  },
		  parse: function () {
		    var source = this.source;
		    var i = this.skip(IS_WHITESPACE, this.index);
		    var fork = this.fork(i);
		    var chr = at(source, i);
		    if (exec(IS_NUMBER_START, chr)) return fork.number();
		    switch (chr) {
		      case '{':
		        return fork.object();
		      case '[':
		        return fork.array();
		      case '"':
		        return fork.string();
		      case 't':
		        return fork.keyword(true);
		      case 'f':
		        return fork.keyword(false);
		      case 'n':
		        return fork.keyword(null);
		    } throw new SyntaxError('Unexpected character: "' + chr + '" at: ' + i);
		  },
		  node: function (type, value, start, end, nodes) {
		    return new Node(value, end, type ? null : slice(this.source, start, end), nodes);
		  },
		  object: function () {
		    var source = this.source;
		    var i = this.index + 1;
		    var expectKeypair = false;
		    var object = {};
		    var nodes = {};
		    while (i < source.length) {
		      i = this.until(['"', '}'], i);
		      if (at(source, i) === '}' && !expectKeypair) {
		        i++;
		        break;
		      }
		      // Parsing the key
		      var result = this.fork(i).string();
		      var key = result.value;
		      i = result.end;
		      i = this.until([':'], i) + 1;
		      // Parsing value
		      i = this.skip(IS_WHITESPACE, i);
		      result = this.fork(i).parse();
		      createProperty(nodes, key, result);
		      createProperty(object, key, result.value);
		      i = this.until([',', '}'], result.end);
		      var chr = at(source, i);
		      if (chr === ',') {
		        expectKeypair = true;
		        i++;
		      } else if (chr === '}') {
		        i++;
		        break;
		      }
		    }
		    return this.node(OBJECT, object, this.index, i, nodes);
		  },
		  array: function () {
		    var source = this.source;
		    var i = this.index + 1;
		    var expectElement = false;
		    var array = [];
		    var nodes = [];
		    while (i < source.length) {
		      i = this.skip(IS_WHITESPACE, i);
		      if (at(source, i) === ']' && !expectElement) {
		        i++;
		        break;
		      }
		      var result = this.fork(i).parse();
		      push(nodes, result);
		      push(array, result.value);
		      i = this.until([',', ']'], result.end);
		      if (at(source, i) === ',') {
		        expectElement = true;
		        i++;
		      } else if (at(source, i) === ']') {
		        i++;
		        break;
		      }
		    }
		    return this.node(OBJECT, array, this.index, i, nodes);
		  },
		  string: function () {
		    var index = this.index;
		    var parsed = parseJSONString(this.source, this.index + 1);
		    return this.node(PRIMITIVE, parsed.value, index, parsed.end);
		  },
		  number: function () {
		    var source = this.source;
		    var startIndex = this.index;
		    var i = startIndex;
		    if (at(source, i) === '-') i++;
		    if (at(source, i) === '0') i++;
		    else if (exec(IS_NON_ZERO_DIGIT, at(source, i))) i = this.skip(IS_DIGIT, i + 1);
		    else throw new SyntaxError('Failed to parse number at: ' + i);
		    if (at(source, i) === '.') i = this.skip(IS_DIGIT, i + 1);
		    if (at(source, i) === 'e' || at(source, i) === 'E') {
		      i++;
		      if (at(source, i) === '+' || at(source, i) === '-') i++;
		      var exponentStartIndex = i;
		      i = this.skip(IS_DIGIT, i);
		      if (exponentStartIndex === i) throw new SyntaxError("Failed to parse number's exponent value at: " + i);
		    }
		    return this.node(PRIMITIVE, Number(slice(source, startIndex, i)), startIndex, i);
		  },
		  keyword: function (value) {
		    var keyword = '' + value;
		    var index = this.index;
		    var endIndex = index + keyword.length;
		    if (slice(this.source, index, endIndex) !== keyword) throw new SyntaxError('Failed to parse value at: ' + index);
		    return this.node(PRIMITIVE, value, index, endIndex);
		  },
		  skip: function (regex, i) {
		    var source = this.source;
		    for (; i < source.length; i++) if (!exec(regex, at(source, i))) break;
		    return i;
		  },
		  until: function (array, i) {
		    i = this.skip(IS_WHITESPACE, i);
		    var chr = at(this.source, i);
		    for (var j = 0; j < array.length; j++) if (array[j] === chr) return i;
		    throw new SyntaxError('Unexpected character: "' + chr + '" at: ' + i);
		  }
		};

		var NO_SOURCE_SUPPORT = fails(function () {
		  var unsafeInt = '9007199254740993';
		  var source;
		  nativeParse(unsafeInt, function (key, value, context) {
		    source = context.source;
		  });
		  return source !== unsafeInt;
		});

		var PROPER_BASE_PARSE = NATIVE_SYMBOL && !fails(function () {
		  // Safari 9 bug
		  return 1 / nativeParse('-0 \t') !== -Infinity;
		});

		// `JSON.parse` method
		// https://tc39.es/ecma262/#sec-json.parse
		// https://github.com/tc39/proposal-json-parse-with-source
		$({ target: 'JSON', stat: true, forced: NO_SOURCE_SUPPORT }, {
		  parse: function parse(text, reviver) {
		    return PROPER_BASE_PARSE && !isCallable(reviver) ? nativeParse(text) : $parse(text, reviver);
		  }
		});
		return esnext_json_parse;
	}

	var parse;
	var hasRequiredParse;

	function requireParse () {
		if (hasRequiredParse) return parse;
		hasRequiredParse = 1;
		requireEs_object_keys();
		requireEsnext_json_parse();
		var path = requirePath();

		parse = path.JSON.parse;
		return parse;
	}

	requireParse();

	var keys$2;
	var hasRequiredKeys$2;

	function requireKeys$2 () {
		if (hasRequiredKeys$2) return keys$2;
		hasRequiredKeys$2 = 1;
		requireEs_object_keys();
		var path = requirePath();

		keys$2 = path.Object.keys;
		return keys$2;
	}

	var keys$1;
	var hasRequiredKeys$1;

	function requireKeys$1 () {
		if (hasRequiredKeys$1) return keys$1;
		hasRequiredKeys$1 = 1;
		var parent = requireKeys$2();

		keys$1 = parent;
		return keys$1;
	}

	var keys;
	var hasRequiredKeys;

	function requireKeys () {
		if (hasRequiredKeys) return keys;
		hasRequiredKeys = 1;
		var parent = requireKeys$1();

		keys = parent;
		return keys;
	}

	requireKeys();

	var es_array_includes = {};

	var objectDefineProperties = {};

	var hasRequiredObjectDefineProperties;

	function requireObjectDefineProperties () {
		if (hasRequiredObjectDefineProperties) return objectDefineProperties;
		hasRequiredObjectDefineProperties = 1;
		var DESCRIPTORS = requireDescriptors();
		var V8_PROTOTYPE_DEFINE_BUG = requireV8PrototypeDefineBug();
		var definePropertyModule = requireObjectDefineProperty();
		var anObject = requireAnObject();
		var toIndexedObject = requireToIndexedObject();
		var objectKeys = requireObjectKeys();

		// `Object.defineProperties` method
		// https://tc39.es/ecma262/#sec-object.defineproperties
		// eslint-disable-next-line es/no-object-defineproperties -- safe
		objectDefineProperties.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
		  anObject(O);
		  var props = toIndexedObject(Properties);
		  var keys = objectKeys(Properties);
		  var length = keys.length;
		  var index = 0;
		  var key;
		  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
		  return O;
		};
		return objectDefineProperties;
	}

	var html;
	var hasRequiredHtml;

	function requireHtml () {
		if (hasRequiredHtml) return html;
		hasRequiredHtml = 1;
		var getBuiltIn = requireGetBuiltIn();

		html = getBuiltIn('document', 'documentElement');
		return html;
	}

	var objectCreate;
	var hasRequiredObjectCreate;

	function requireObjectCreate () {
		if (hasRequiredObjectCreate) return objectCreate;
		hasRequiredObjectCreate = 1;
		/* global ActiveXObject -- old IE, WSH */
		var anObject = requireAnObject();
		var definePropertiesModule = requireObjectDefineProperties();
		var enumBugKeys = requireEnumBugKeys();
		var hiddenKeys = requireHiddenKeys();
		var html = requireHtml();
		var documentCreateElement = requireDocumentCreateElement();
		var sharedKey = requireSharedKey();

		var GT = '>';
		var LT = '<';
		var PROTOTYPE = 'prototype';
		var SCRIPT = 'script';
		var IE_PROTO = sharedKey('IE_PROTO');

		var EmptyConstructor = function () { /* empty */ };

		var scriptTag = function (content) {
		  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
		};

		// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
		var NullProtoObjectViaActiveX = function (activeXDocument) {
		  activeXDocument.write(scriptTag(''));
		  activeXDocument.close();
		  var temp = activeXDocument.parentWindow.Object;
		  // eslint-disable-next-line no-useless-assignment -- avoid memory leak
		  activeXDocument = null;
		  return temp;
		};

		// Create object with fake `null` prototype: use iframe Object with cleared prototype
		var NullProtoObjectViaIFrame = function () {
		  // Thrash, waste and sodomy: IE GC bug
		  var iframe = documentCreateElement('iframe');
		  var JS = 'java' + SCRIPT + ':';
		  var iframeDocument;
		  iframe.style.display = 'none';
		  html.appendChild(iframe);
		  // https://github.com/zloirock/core-js/issues/475
		  iframe.src = String(JS);
		  iframeDocument = iframe.contentWindow.document;
		  iframeDocument.open();
		  iframeDocument.write(scriptTag('document.F=Object'));
		  iframeDocument.close();
		  return iframeDocument.F;
		};

		// Check for document.domain and active x support
		// No need to use active x approach when document.domain is not set
		// see https://github.com/es-shims/es5-shim/issues/150
		// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
		// avoid IE GC bug
		var activeXDocument;
		var NullProtoObject = function () {
		  try {
		    activeXDocument = new ActiveXObject('htmlfile');
		  } catch (error) { /* ignore */ }
		  NullProtoObject = typeof document != 'undefined'
		    ? document.domain && activeXDocument
		      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
		      : NullProtoObjectViaIFrame()
		    : NullProtoObjectViaActiveX(activeXDocument); // WSH
		  var length = enumBugKeys.length;
		  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
		  return NullProtoObject();
		};

		hiddenKeys[IE_PROTO] = true;

		// `Object.create` method
		// https://tc39.es/ecma262/#sec-object.create
		// eslint-disable-next-line es/no-object-create -- safe
		objectCreate = Object.create || function create(O, Properties) {
		  var result;
		  if (O !== null) {
		    EmptyConstructor[PROTOTYPE] = anObject(O);
		    result = new EmptyConstructor();
		    EmptyConstructor[PROTOTYPE] = null;
		    // add "__proto__" for Object.getPrototypeOf polyfill
		    result[IE_PROTO] = O;
		  } else result = NullProtoObject();
		  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
		};
		return objectCreate;
	}

	var addToUnscopables;
	var hasRequiredAddToUnscopables;

	function requireAddToUnscopables () {
		if (hasRequiredAddToUnscopables) return addToUnscopables;
		hasRequiredAddToUnscopables = 1;
		var wellKnownSymbol = requireWellKnownSymbol();
		var create = requireObjectCreate();
		var defineProperty = requireObjectDefineProperty().f;

		var UNSCOPABLES = wellKnownSymbol('unscopables');
		var ArrayPrototype = Array.prototype;

		// Array.prototype[@@unscopables]
		// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
		if (ArrayPrototype[UNSCOPABLES] === undefined) {
		  defineProperty(ArrayPrototype, UNSCOPABLES, {
		    configurable: true,
		    value: create(null)
		  });
		}

		// add a key to Array.prototype[@@unscopables]
		addToUnscopables = function (key) {
		  ArrayPrototype[UNSCOPABLES][key] = true;
		};
		return addToUnscopables;
	}

	var hasRequiredEs_array_includes;

	function requireEs_array_includes () {
		if (hasRequiredEs_array_includes) return es_array_includes;
		hasRequiredEs_array_includes = 1;
		var $ = require_export();
		var $includes = requireArrayIncludes().includes;
		var fails = requireFails();
		var addToUnscopables = requireAddToUnscopables();

		// FF99+ bug
		var BROKEN_ON_SPARSE = fails(function () {
		  // eslint-disable-next-line es/no-array-prototype-includes -- detection
		  return !Array(1).includes();
		});

		// `Array.prototype.includes` method
		// https://tc39.es/ecma262/#sec-array.prototype.includes
		$({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
		  includes: function includes(el /* , fromIndex = 0 */) {
		    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
		  }
		});

		// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
		addToUnscopables('includes');
		return es_array_includes;
	}

	var includes$2;
	var hasRequiredIncludes$2;

	function requireIncludes$2 () {
		if (hasRequiredIncludes$2) return includes$2;
		hasRequiredIncludes$2 = 1;
		requireEs_array_includes();
		var entryUnbind = requireEntryUnbind();

		includes$2 = entryUnbind('Array', 'includes');
		return includes$2;
	}

	var includes$1;
	var hasRequiredIncludes$1;

	function requireIncludes$1 () {
		if (hasRequiredIncludes$1) return includes$1;
		hasRequiredIncludes$1 = 1;
		var parent = requireIncludes$2();

		includes$1 = parent;
		return includes$1;
	}

	var includes;
	var hasRequiredIncludes;

	function requireIncludes () {
		if (hasRequiredIncludes) return includes;
		hasRequiredIncludes = 1;
		var parent = requireIncludes$1();

		includes = parent;
		return includes;
	}

	requireIncludes();

	var errorTimeout = 10 * 1000;
	var errorHandler = function (reason) {
	    var msg = reason.message || reason;
	    var container = document.getElementById("message");
	    if (container) {
	        var elem_1 = container.appendChild(document.createElement("pre"));
	        elem_1.appendChild(document.createTextNode(msg));
	        setTimeout(function () { var _a; return (_a = elem_1 === null || elem_1 === void 0 ? void 0 : elem_1.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(elem_1); }, errorTimeout);
	    }
	    else {
	        alert(msg);
	    }
	};
	var errorWrapper = function (func) {
	    return function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        try {
	            return func.apply(void 0, args);
	        }
	        catch (e) {
	            errorHandler(e);
	        }
	    };
	};

	var numericKeys = [1, 4, 5, 6, 7, 10, 11];
	var parseIsoDate = function (date) {
	    var minutesOffset = 0;
	    var struct;
	    // 1 YYYY
	    // 2 MM
	    // 3 DD
	    // 4 HH
	    // 5 mm
	    // 6 ss
	    // 7 msec
	    // 8 Z
	    // 9 ±
	    // 10 tzHH
	    // 11 tzmm
	    struct =
	        /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(date);
	    if (!struct) {
	        return undefined;
	    }
	    // avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
	    for (var i = 0, k; (k = numericKeys[i]); ++i) {
	        struct[k] = +struct[k] || 0;
	    }
	    // allow undefined days and months
	    struct[2] = (+struct[2] || 1) - 1;
	    struct[3] = +struct[3] || 1;
	    if (struct[8] !== "Z" && struct[9] !== undefined) {
	        minutesOffset = struct[10] * 60 + struct[11];
	        if (struct[9] === "+") {
	            minutesOffset = 0 - minutesOffset;
	        }
	    }
	    return Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
	};

	var refreshInterval$1 = 10 * 60 * 1000;
	var defaultGraphHeight = 52;
	var defaultGraphTicks = 3;
	var defaultGraphWidth = 135;
	var BasicDashboardAction = /** @class */ (function () {
	    function BasicDashboardAction(dashboard, config) {
	        var _this = this;
	        this.refresh = errorWrapper(function () {
	            var _a;
	            _this.dashboard.request("POST", "/api/services/" +
	                ((_a = _this.config) === null || _a === void 0 ? void 0 : _a.action.replace(".", "/")) +
	                "?return_response", undefined, errorWrapper(_this.update));
	            _this.refreshToken = setTimeout(_this.refresh, _this.dashboard.config.refresh || refreshInterval$1);
	        });
	        this.update = errorWrapper(function (data) {
	            _this.data = JSON.parse(data);
	            _this.render();
	        });
	        this.render = errorWrapper(function () {
	            var _a, _b, _c, _d;
	            if (!_this.config)
	                return;
	            _this.element.id = (_a = _this.config) === null || _a === void 0 ? void 0 : _a.action;
	            _this.element.innerHTML = "";
	            // name
	            if ((_b = _this.config) === null || _b === void 0 ? void 0 : _b.name) {
	                var name_1 = _this.element.appendChild(document.createElement("div"));
	                name_1.className = "name";
	                name_1.appendChild(document.createTextNode((_c = _this.config) === null || _c === void 0 ? void 0 : _c.name));
	            }
	            if ((_d = _this.config) === null || _d === void 0 ? void 0 : _d.chart) {
	                _this.renderChart();
	            }
	        });
	        this.renderChart = errorWrapper(function () {
	            var _a, _b, _c, _d, _e;
	            if (!((_a = _this.config) === null || _a === void 0 ? void 0 : _a.chart)) {
	                return;
	            }
	            var graphHeight = ((_c = (_b = _this.config) === null || _b === void 0 ? void 0 : _b.chart) === null || _c === void 0 ? void 0 : _c.height) || defaultGraphHeight;
	            var graphWidth = ((_e = (_d = _this.config) === null || _d === void 0 ? void 0 : _d.chart) === null || _e === void 0 ? void 0 : _e.width) || defaultGraphWidth;
	            var svg = _this.element.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
	            svg.setAttribute("height", graphHeight.toString());
	            svg.setAttribute("width", graphWidth.toString());
	            svg.setAttribute("viewBox", "0 0 ".concat(graphWidth, " ").concat(graphHeight));
	            _this.config.chart.data.forEach(function (entry) {
	                return _this.renderChartEntry(_this.config.chart, entry, svg);
	            });
	        });
	        this.renderChartEntry = function (chartCfg, entryCfg, svg) {
	            var graphHeight = parseInt(svg.getAttribute("height"));
	            var graphWidth = parseInt(svg.getAttribute("width"));
	            var isEmpty = svg.childNodes.length == 0;
	            var ticks = chartCfg.ticks || defaultGraphTicks;
	            // limits and points
	            var points = [];
	            var minX = Number.MAX_VALUE;
	            var maxX = Number.MIN_VALUE;
	            var minY = Number.MAX_VALUE;
	            var maxY = Number.MIN_VALUE;
	            var prevY = undefined;
	            entryCfg.data.reduce(function (data, key) { return data[key]; }, _this.data).forEach(function (point, idx) {
	                var _a;
	                var val = point[entryCfg.x];
	                var x = Date.parse(val) || parseIsoDate(val) || parseFloat(val) || idx;
	                var y = point[entryCfg.y] * ((_a = entryCfg.factor) !== null && _a !== void 0 ? _a : 1);
	                minX = Math.min(x, minX);
	                maxX = Math.max(x, maxX);
	                minY = Math.min(y, minY);
	                maxY = Math.max(y, maxY);
	                if (entryCfg.stepline && prevY !== undefined) {
	                    points.push([x, prevY]);
	                }
	                points.push([x, y]);
	                prevY = y;
	            });
	            var scaleY = graphHeight / (maxY - minY);
	            var scaleX = graphWidth / (maxX - minX);
	            // now
	            if (isEmpty && chartCfg.now) {
	                var x = (Date.now() - minX) * scaleX;
	                var now = svg.appendChild(document.createElementNS(svg.namespaceURI, "line"));
	                now.setAttribute("x1", x.toFixed(2));
	                now.setAttribute("y1", "0");
	                now.setAttribute("x2", x.toFixed(2));
	                now.setAttribute("y2", graphHeight.toFixed());
	                now.setAttribute("class", "now");
	            }
	            // ticks
	            if (isEmpty && ticks > 0) {
	                var step = (maxY - minY) / (ticks - 1);
	                for (var i = 0; i < ticks; i++) {
	                    var val = minY + i * step;
	                    var y = graphHeight - (val - minY) * scaleY;
	                    var align = i == 0 ? "after-edge" : i == ticks - 1 ? "before-edge" : "middle";
	                    var tick = svg.appendChild(document.createElementNS(svg.namespaceURI, "line"));
	                    tick.setAttribute("x1", "0");
	                    tick.setAttribute("y1", y.toFixed(2));
	                    tick.setAttribute("x2", graphWidth.toFixed());
	                    tick.setAttribute("y2", y.toFixed(2));
	                    tick.setAttribute("class", "tick");
	                    var text = svg.appendChild(document.createElementNS(svg.namespaceURI, "text"));
	                    text.setAttribute("x", "0");
	                    text.setAttribute("y", y.toFixed(2));
	                    text.setAttribute("alignment-baseline", align);
	                    text.appendChild(document.createTextNode(val.toFixed(1)));
	                    text.setAttribute("class", "tick");
	                }
	            }
	            // data line
	            svg
	                .appendChild(document.createElementNS("http://www.w3.org/2000/svg", "polyline"))
	                .setAttribute("points", points
	                .map(function (_a) {
	                var x = _a[0], y = _a[1];
	                return "".concat((x - minX) * scaleX, ",").concat(graphHeight - (y - minY) * scaleY);
	            })
	                .join(" "));
	        };
	        this.dashboard = dashboard;
	        this.config = config;
	        this.element = this.dashboard.elEntities.appendChild(document.createElement("div"));
	        this.element.className = "box chart";
	    }
	    return BasicDashboardAction;
	}());

	// Material Design Icons v7.4.47
	var mdiAccount = "M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z";
	var mdiAccountArrowRight = "M18 16H14V18H18V20L21 17L18 14V16M11 4C8.8 4 7 5.8 7 8S8.8 12 11 12 15 10.2 15 8 13.2 4 11 4M11 14C6.6 14 3 15.8 3 18V20H12.5C12.2 19.2 12 18.4 12 17.5C12 16.3 12.3 15.2 12.9 14.1C12.3 14.1 11.7 14 11 14";
	var mdiAirFilter = "M19,18.31V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V16.3C4.54,16.12 3.95,16 3,16A1,1 0 0,1 2,15A1,1 0 0,1 3,14C3.82,14 4.47,14.08 5,14.21V12.3C4.54,12.12 3.95,12 3,12A1,1 0 0,1 2,11A1,1 0 0,1 3,10C3.82,10 4.47,10.08 5,10.21V8.3C4.54,8.12 3.95,8 3,8A1,1 0 0,1 2,7A1,1 0 0,1 3,6C3.82,6 4.47,6.08 5,6.21V4A2,2 0 0,1 7,2H17A2,2 0 0,1 19,4V6.16C20.78,6.47 21.54,7.13 21.71,7.29C22.1,7.68 22.1,8.32 21.71,8.71C21.32,9.1 20.8,9.09 20.29,8.71V8.71C20.29,8.71 19.25,8 17,8C15.74,8 14.91,8.41 13.95,8.9C12.91,9.41 11.74,10 10,10C9.64,10 9.31,10 9,9.96V7.95C9.3,8 9.63,8 10,8C11.26,8 12.09,7.59 13.05,7.11C14.09,6.59 15.27,6 17,6V4H7V20H17V18C18.5,18 18.97,18.29 19,18.31M17,10C15.27,10 14.09,10.59 13.05,11.11C12.09,11.59 11.26,12 10,12C9.63,12 9.3,12 9,11.95V13.96C9.31,14 9.64,14 10,14C11.74,14 12.91,13.41 13.95,12.9C14.91,12.42 15.74,12 17,12C19.25,12 20.29,12.71 20.29,12.71V12.71C20.8,13.1 21.32,13.1 21.71,12.71C22.1,12.32 22.1,11.69 21.71,11.29C21.5,11.08 20.25,10 17,10M17,14C15.27,14 14.09,14.59 13.05,15.11C12.09,15.59 11.26,16 10,16C9.63,16 9.3,16 9,15.95V17.96C9.31,18 9.64,18 10,18C11.74,18 12.91,17.41 13.95,16.9C14.91,16.42 15.74,16 17,16C19.25,16 20.29,16.71 20.29,16.71V16.71C20.8,17.1 21.32,17.1 21.71,16.71C22.1,16.32 22.1,15.69 21.71,15.29C21.5,15.08 20.25,14 17,14Z";
	var mdiAirHumidifier = "M11 9C8.79 9 7 10.79 7 13S8.79 17 11 17 15 15.21 15 13 13.21 9 11 9M11 15C9.9 15 9 14.11 9 13S9.9 11 11 11 13 11.9 13 13 12.11 15 11 15M7 4H14C16.21 4 18 5.79 18 8V9H16V8C16 6.9 15.11 6 14 6H7C5.9 6 5 6.9 5 8V20H16V18H18V22H3V8C3 5.79 4.79 4 7 4M19 10.5C19 10.5 21 12.67 21 14C21 15.1 20.1 16 19 16S17 15.1 17 14C17 12.67 19 10.5 19 10.5";
	var mdiAirHumidifierOff = "M22.1 21.5L2.4 1.7L1.1 3L3.8 5.7C3.3 6.3 3 7.1 3 8V22H18V19.9L20.8 22.7L22.1 21.5M9.6 11.5L12.4 14.3C12.1 14.7 11.6 15 11 15C9.9 15 9 14.1 9 13C9 12.4 9.3 11.9 9.6 11.5M16 17.9V20H5V8C5 7.7 5.1 7.4 5.2 7.1L8.2 10.1C7.5 10.8 7 11.9 7 13C7 15.2 8.8 17 11 17C12.1 17 13.2 16.5 13.9 15.8L16 17.9M17 13.8C17.1 12.5 19 10.5 19 10.5S21 12.7 21 14C21 15 20.2 15.9 19.2 16L17 13.8M9.2 6L7.2 4H14C16.2 4 18 5.8 18 8V9H16V8C16 6.9 15.1 6 14 6H9.2Z";
	var mdiAlert = "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z";
	var mdiAlertCircle = "M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";
	var mdiAlertDecagramOutline = "M23,12L20.56,14.78L20.9,18.46L17.29,19.28L15.4,22.46L12,21L8.6,22.47L6.71,19.29L3.1,18.47L3.44,14.78L1,12L3.44,9.21L3.1,5.53L6.71,4.72L8.6,1.54L12,3L15.4,1.54L17.29,4.72L20.9,5.54L20.56,9.22L23,12M20.33,12L18.5,9.89L18.74,7.1L16,6.5L14.58,4.07L12,5.18L9.42,4.07L8,6.5L5.26,7.09L5.5,9.88L3.67,12L5.5,14.1L5.26,16.9L8,17.5L9.42,19.93L12,18.81L14.58,19.92L16,17.5L18.74,16.89L18.5,14.1L20.33,12M11,15H13V17H11V15M11,7H13V13H11V7";
	var mdiAppleSafari = "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,14.09 4.8,16 6.11,17.41L9.88,9.88L17.41,6.11C16,4.8 14.09,4 12,4M12,20A8,8 0 0,0 20,12C20,9.91 19.2,8 17.89,6.59L14.12,14.12L6.59,17.89C8,19.2 9.91,20 12,20M12,12L11.23,11.23L9.7,14.3L12.77,12.77L12,12M12,17.5H13V19H12V17.5M15.88,15.89L16.59,15.18L17.65,16.24L16.94,16.95L15.88,15.89M17.5,12V11H19V12H17.5M12,6.5H11V5H12V6.5M8.12,8.11L7.41,8.82L6.35,7.76L7.06,7.05L8.12,8.11M6.5,12V13H5V12H6.5Z";
	var mdiArrowCollapseHorizontal = "M13,20V4H15.03V20H13M10,20V4H12.03V20H10M5,8L9.03,12L5,16V13H2V11H5V8M20,16L16,12L20,8V11H23V13H20V16Z";
	var mdiArrowDownBox = "M3,5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5M11,6V14.5L7.5,11L6.08,12.42L12,18.34L17.92,12.42L16.5,11L13,14.5V6H11Z";
	var mdiArrowSplitVertical = "M18,16V13H15V22H13V2H15V11H18V8L22,12L18,16M2,12L6,16V13H9V22H11V2H9V11H6V8L2,12Z";
	var mdiArrowUpBox = "M21,19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19C20.11,3 21,3.9 21,5V19M13,18V9.5L16.5,13L17.92,11.58L12,5.66L6.08,11.58L7.5,13L11,9.5V18H13Z";
	var mdiAudioVideo = "M20,7H4A2,2 0 0,0 2,9V15A2,2 0 0,0 4,17H5V18C5,18.6 5.4,19 6,19H8C8.6,19 9,18.6 9,18V17H15V18C15,18.6 15.4,19 16,19H18C18.6,19 19,18.6 19,18V17H20A2,2 0 0,0 22,15V9A2,2 0 0,0 20,7M14,12H4V10H14V12M18,13A2,2 0 0,1 16,11A2,2 0 0,1 18,9A2,2 0 0,1 20,11A2,2 0 0,1 18,13M6,15H4V14H6V15M10,15H8V14H10V15M14,15H12V14H14V15Z";
	var mdiAudioVideoOff = "M22.1 21.5L2.4 1.7L1.1 3L5.1 7H4C2.9 7 2 7.9 2 9V15C2 16.1 2.9 17 4 17H5V18C5 18.6 5.4 19 6 19H8C8.6 19 9 18.6 9 18V17H15V18C15 18.6 15.4 19 16 19H17.1L20.8 22.7L22.1 21.5M6 15H4V14H6V15M4 12V10H8.1L10.1 12H4M10 15H8V14H10V15M12 15V14H12.1L13.1 15H12M14 10V10.8L20.2 17C21.2 16.9 22 16.1 22 15V9C22 7.9 21.1 7 20 7H10.2L13.2 10H14M18 9C19.1 9 20 9.9 20 11S19.1 13 18 13 16 12.1 16 11 16.9 9 18 9Z";
	var mdiBattery = "M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z";
	var mdiBatteryAlert = "M13 14H11V8H13M13 18H11V16H13M16.7 4H15V2H9V4H7.3C6.6 4 6 4.6 6 5.3V20.6C6 21.4 6.6 22 7.3 22H16.6C17.3 22 17.9 21.4 17.9 20.7V5.3C18 4.6 17.4 4 16.7 4Z";
	var mdiBatteryCharging = "M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.66C6,21.4 6.6,22 7.33,22H16.66C17.4,22 18,21.4 18,20.67V5.33C18,4.6 17.4,4 16.67,4M11,20V14.5H9L13,7V12.5H15";
	var mdiBatteryOutline = "M16,20H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z";
	var mdiBell = "M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21";
	var mdiBlindsHorizontal = "M20 19V3H4V19H2V21H22V19H20M16 9H18V11H16V9M14 11H6V9H14V11M18 7H16V5H18V7M14 5V7H6V5H14M6 19V13H14V14.82C13.55 15.14 13.25 15.66 13.25 16.25C13.25 17.22 14.03 18 15 18S16.75 17.22 16.75 16.25C16.75 15.66 16.45 15.13 16 14.82V13H18V19H6Z";
	var mdiBlindsHorizontalClosed = "M20 19V3H4V19H2V21H13.25C13.25 21.97 14.03 22.75 15 22.75S16.75 21.97 16.75 21H22V19H20M18 11H16V9H18V11M14 11H6V9H14V11M14 13V15H6V13H14M16 13H18V15H16V13M18 7H16V5H18V7M14 5V7H6V5H14M6 19V17H14V19H6M16 19V17H18V19H16Z";
	var mdiBrightness5 = "M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z";
	var mdiBrightness7 = "M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z";
	var mdiBullhorn = "M12,8H4A2,2 0 0,0 2,10V14A2,2 0 0,0 4,16H5V20A1,1 0 0,0 6,21H8A1,1 0 0,0 9,20V16H12L17,20V4L12,8M21.5,12C21.5,13.71 20.54,15.26 19,16V8C20.53,8.75 21.5,10.3 21.5,12Z";
	var mdiButtonPointer = "M20 20.5C20 21.3 19.3 22 18.5 22H13C12.6 22 12.3 21.9 12 21.6L8 17.4L8.7 16.6C8.9 16.4 9.2 16.3 9.5 16.3H9.7L12 18V9C12 8.4 12.4 8 13 8S14 8.4 14 9V13.5L15.2 13.6L19.1 15.8C19.6 16 20 16.6 20 17.1V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.1 2.9 14 4 14H8V12H4V4H20V12H18V14H20C21.1 14 22 13.1 22 12V4C22 2.9 21.1 2 20 2Z";
	var mdiCalendar = "M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z";
	var mdiCalendarClock = "M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z";
	var mdiCast = "M1,10V12A9,9 0 0,1 10,21H12C12,14.92 7.07,10 1,10M1,14V16A5,5 0 0,1 6,21H8A7,7 0 0,0 1,14M1,18V21H4A3,3 0 0,0 1,18M21,3H3C1.89,3 1,3.89 1,5V8H3V5H21V19H14V21H21A2,2 0 0,0 23,19V5C23,3.89 22.1,3 21,3Z";
	var mdiCastConnected = "M21,3H3C1.89,3 1,3.89 1,5V8H3V5H21V19H14V21H21A2,2 0 0,0 23,19V5C23,3.89 22.1,3 21,3M1,10V12A9,9 0 0,1 10,21H12C12,14.92 7.07,10 1,10M19,7H5V8.63C8.96,9.91 12.09,13.04 13.37,17H19M1,14V16A5,5 0 0,1 6,21H8A7,7 0 0,0 1,14M1,18V21H4A3,3 0 0,0 1,18Z";
	var mdiCastOff = "M1.6,1.27L0.25,2.75L1.41,3.8C1.16,4.13 1,4.55 1,5V8H3V5.23L18.2,19H14V21H20.41L22.31,22.72L23.65,21.24M6.5,3L8.7,5H21V16.14L23,17.95V5C23,3.89 22.1,3 21,3M1,10V12A9,9 0 0,1 10,21H12C12,14.92 7.08,10 1,10M1,14V16A5,5 0 0,1 6,21H8A7,7 0 0,0 1,14M1,18V21H4A3,3 0 0,0 1,18Z";
	var mdiChartSankey = "M22 5H4V2H2V22H22V20H4V9C8.09 9 10.13 11 12.29 13.21S17.09 18 22 18V16C17.91 16 15.87 14 13.71 11.79S8.91 7 4 7H22Z";
	var mdiChatSleep = "M12 3C6.5 3 2 6.58 2 11C2 13.13 3.05 15.07 4.75 16.5C4.7 17.1 4.33 18.67 2 21C2 21 5.55 21 8.47 18.5C9.57 18.82 10.76 19 12 19C17.5 19 22 15.42 22 11S17.5 3 12 3M15 9.3L11.76 13H15V15H9V12.7L12.24 9H9V7H15V9.3Z";
	var mdiCheckCircle = "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z";
	var mdiCheckCircleOutline = "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z";
	var mdiCheckDecagram = "M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z";
	var mdiCheckNetworkOutline = "M15,20A1,1 0 0,0 14,19H13V17H17A2,2 0 0,0 19,15V5A2,2 0 0,0 17,3H7A2,2 0 0,0 5,5V15A2,2 0 0,0 7,17H11V19H10A1,1 0 0,0 9,20H2V22H9A1,1 0 0,0 10,23H14A1,1 0 0,0 15,22H22V20H15M7,15V5H17V15H7M8,10.37L9.24,9.13L10.93,10.83L14.76,7L16,8.5L10.93,13.57L8,10.37Z";
	var mdiCheckboxMarkedCircle = "M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";
	var mdiCircle = "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";
	var mdiCircleSlice8 = "M12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z";
	var mdiClipboardList = "M19 3H14.82C14.4 1.84 13.3 1 12 1S9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M7 8H9V12H8V9H7V8M10 17V18H7V17.08L9 15H7V14H9.25C9.66 14 10 14.34 10 14.75C10 14.95 9.92 15.14 9.79 15.27L8.12 17H10M11 4C11 3.45 11.45 3 12 3S13 3.45 13 4 12.55 5 12 5 11 4.55 11 4M17 17H12V15H17V17M17 11H12V9H17V11Z";
	var mdiClock = "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z";
	var mdiCloseCircleOutline = "M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z";
	var mdiCloseNetworkOutline = "M15,20A1,1 0 0,0 14,19H13V17H17A2,2 0 0,0 19,15V5A2,2 0 0,0 17,3H7A2,2 0 0,0 5,5V15A2,2 0 0,0 7,17H11V19H10A1,1 0 0,0 9,20H2V22H9A1,1 0 0,0 10,23H14A1,1 0 0,0 15,22H22V20H15M7,15V5H17V15H7M15.54,12.12L13.41,10L15.53,7.87L14.12,6.46L12,8.59L9.88,6.46L8.47,7.87L10.59,10L8.47,12.13L9.88,13.54L12,11.41L14.12,13.54L15.54,12.12Z";
	var mdiCloudUpload = "M11 20H6.5Q4.22 20 2.61 18.43 1 16.85 1 14.58 1 12.63 2.17 11.1 3.35 9.57 5.25 9.15 5.88 6.85 7.75 5.43 9.63 4 12 4 14.93 4 16.96 6.04 19 8.07 19 11 20.73 11.2 21.86 12.5 23 13.78 23 15.5 23 17.38 21.69 18.69 20.38 20 18.5 20H13V12.85L14.6 14.4L16 13L12 9L8 13L9.4 14.4L11 12.85Z";
	var mdiCog = "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z";
	var mdiCommentAlert = "M9 22C8.4 22 8 21.6 8 21V18H4C2.9 18 2 17.1 2 16V4C2 2.9 2.9 2 4 2H20C21.1 2 22 2.9 22 4V16C22 17.1 21.1 18 20 18H13.9L10.2 21.7C10 21.9 9.8 22 9.5 22H9M13 11V5H11V11M13 15V13H11V15H13Z";
	var mdiCounter = "M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M4,6V18H11V6H4M20,18V6H18.76C19,6.54 18.95,7.07 18.95,7.13C18.88,7.8 18.41,8.5 18.24,8.75L15.91,11.3L19.23,11.28L19.24,12.5L14.04,12.47L14,11.47C14,11.47 17.05,8.24 17.2,7.95C17.34,7.67 17.91,6 16.5,6C15.27,6.05 15.41,7.3 15.41,7.3L13.87,7.31C13.87,7.31 13.88,6.65 14.25,6H13V18H15.58L15.57,17.14L16.54,17.13C16.54,17.13 17.45,16.97 17.46,16.08C17.5,15.08 16.65,15.08 16.5,15.08C16.37,15.08 15.43,15.13 15.43,15.95H13.91C13.91,15.95 13.95,13.89 16.5,13.89C19.1,13.89 18.96,15.91 18.96,15.91C18.96,15.91 19,17.16 17.85,17.63L18.37,18H20M8.92,16H7.42V10.2L5.62,10.76V9.53L8.76,8.41H8.92V16Z";
	var mdiCropPortrait = "M17,19H7V5H17M17,3H7A2,2 0 0,0 5,5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V5C19,3.89 18.1,3 17,3Z";
	var mdiCurtains = "M23 3H1V1H23V3M2 22H6C6 19 4 17 4 17C10 13 11 4 11 4H2V22M22 4H13C13 4 14 13 20 17C20 17 18 19 18 22H22V4Z";
	var mdiCurtainsClosed = "M23 3H1V1H23V3M2 22H11V4H2V22M22 4H13V22H22V4Z";
	var mdiDoorClosed = "M16,11H18V13H16V11M12,3H19C20.11,3 21,3.89 21,5V19H22V21H2V19H10V5C10,3.89 10.89,3 12,3M12,5V19H19V5H12Z";
	var mdiDoorOpen = "M12,3C10.89,3 10,3.89 10,5H3V19H2V21H22V19H21V5C21,3.89 20.11,3 19,3H12M12,5H19V19H12V5M5,11H7V13H5V11Z";
	var mdiFan = "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z";
	var mdiFanOff = "M12.5,2C9.64,2 8.57,4.55 9.29,7.47L15,13.16C15.87,13.37 16.81,13.81 17.28,14.73C18.46,17.1 22.03,17 22.03,12.5C22.03,8.92 18.05,8.13 14.35,10.13C14.03,9.73 13.61,9.42 13.13,9.22C13.32,8.29 13.76,7.24 14.75,6.75C17.11,5.57 17,2 12.5,2M3.28,4L2,5.27L4.47,7.73C3.22,7.74 2,8.87 2,11.5C2,15.07 5.96,15.85 9.65,13.87C9.97,14.27 10.4,14.59 10.89,14.79C10.69,15.71 10.25,16.75 9.27,17.24C6.91,18.42 7,22 11.5,22C13.8,22 14.94,20.36 14.94,18.21L18.73,22L20,20.72L3.28,4Z";
	var mdiFire = "M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z";
	var mdiFlower = "M3,13A9,9 0 0,0 12,22C12,17 7.97,13 3,13M12,5.5A2.5,2.5 0 0,1 14.5,8A2.5,2.5 0 0,1 12,10.5A2.5,2.5 0 0,1 9.5,8A2.5,2.5 0 0,1 12,5.5M5.6,10.25A2.5,2.5 0 0,0 8.1,12.75C8.63,12.75 9.12,12.58 9.5,12.31C9.5,12.37 9.5,12.43 9.5,12.5A2.5,2.5 0 0,0 12,15A2.5,2.5 0 0,0 14.5,12.5C14.5,12.43 14.5,12.37 14.5,12.31C14.88,12.58 15.37,12.75 15.9,12.75C17.28,12.75 18.4,11.63 18.4,10.25C18.4,9.25 17.81,8.4 16.97,8C17.81,7.6 18.4,6.74 18.4,5.75C18.4,4.37 17.28,3.25 15.9,3.25C15.37,3.25 14.88,3.41 14.5,3.69C14.5,3.63 14.5,3.56 14.5,3.5A2.5,2.5 0 0,0 12,1A2.5,2.5 0 0,0 9.5,3.5C9.5,3.56 9.5,3.63 9.5,3.69C9.12,3.41 8.63,3.25 8.1,3.25A2.5,2.5 0 0,0 5.6,5.75C5.6,6.74 6.19,7.6 7.03,8C6.19,8.4 5.6,9.25 5.6,10.25M12,22A9,9 0 0,0 21,13C16,13 12,17 12,22Z";
	var mdiFormTextbox = "M17,7H22V17H17V19A1,1 0 0,0 18,20H20V22H17.5C16.95,22 16,21.55 16,21C16,21.55 15.05,22 14.5,22H12V20H14A1,1 0 0,0 15,19V5A1,1 0 0,0 14,4H12V2H14.5C15.05,2 16,2.45 16,3C16,2.45 16.95,2 17.5,2H20V4H18A1,1 0 0,0 17,5V7M2,7H13V9H4V15H13V17H2V7M20,15V9H17V15H20Z";
	var mdiFormatListBulleted = "M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z";
	var mdiGarage = "M19,20H17V11H7V20H5V9L12,5L19,9V20M8,12H16V14H8V12M8,15H16V17H8V15M16,18V20H8V18H16Z";
	var mdiGarageOpen = "M19,20H17V11H7V20H5V9L12,5L19,9V20M8,12H16V14H8V12Z";
	var mdiGate = "M9 6V11H7V7H5V11H3V9H1V21H3V19H5V21H7V19H9V21H11V19H13V21H15V19H17V21H19V19H21V21H23V9H21V11H19V7H17V11H15V6H13V11H11V6H9M3 13H5V17H3V13M7 13H9V17H7V13M11 13H13V17H11V13M15 13H17V17H15V13M19 13H21V17H19V13Z";
	var mdiGateArrowRight = "M15 6V11H13V7H11V11H9V9H7V21H9V19H11V21H12.09C12.03 20.67 12 20.34 12 20C12 18.82 12.35 17.67 13 16.69V13H15V14.81C15.62 14.45 16.3 14.21 17 14.09V13H19V14.09C19.7 14.21 20.38 14.45 21 14.81V13H22V11H21V6H19V11H17V6H15M9 13H11V17H9V13M19 17V19H15V21H19V23L22 20L19 17Z";
	var mdiGateOpen = "M7 21V7H5V11H3V9H1V21H3V19H5V21H7M3 17V13H5V17H3M21 9V11H19V7H17V21H19V19H21V21H23V9H21M21 17H19V13H21V17Z";
	var mdiGoogleAssistant = "M7,2A6,6 0 0,0 1,8A6,6 0 0,0 7,14A6,6 0 0,0 13,8A6,6 0 0,0 7,2M21.5,6A1.5,1.5 0 0,0 20,7.5A1.5,1.5 0 0,0 21.5,9A1.5,1.5 0 0,0 23,7.5A1.5,1.5 0 0,0 21.5,6M17,8A3,3 0 0,0 14,11A3,3 0 0,0 17,14A3,3 0 0,0 20,11A3,3 0 0,0 17,8M17,15A3.5,3.5 0 0,0 13.5,18.5A3.5,3.5 0 0,0 17,22A3.5,3.5 0 0,0 20.5,18.5A3.5,3.5 0 0,0 17,15Z";
	var mdiGoogleCirclesCommunities = "M15,12C13.89,12 13,12.89 13,14A2,2 0 0,0 15,16A2,2 0 0,0 17,14C17,12.89 16.1,12 15,12M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M14,9C14,7.89 13.1,7 12,7C10.89,7 10,7.89 10,9A2,2 0 0,0 12,11A2,2 0 0,0 14,9M9,12A2,2 0 0,0 7,14A2,2 0 0,0 9,16A2,2 0 0,0 11,14C11,12.89 10.1,12 9,12Z";
	var mdiHome = "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z";
	var mdiHomeAssistant = "M21.8,13H20V21H13V17.67L15.79,14.88L16.5,15C17.66,15 18.6,14.06 18.6,12.9C18.6,11.74 17.66,10.8 16.5,10.8A2.1,2.1 0 0,0 14.4,12.9L14.5,13.61L13,15.13V9.65C13.66,9.29 14.1,8.6 14.1,7.8A2.1,2.1 0 0,0 12,5.7A2.1,2.1 0 0,0 9.9,7.8C9.9,8.6 10.34,9.29 11,9.65V15.13L9.5,13.61L9.6,12.9A2.1,2.1 0 0,0 7.5,10.8A2.1,2.1 0 0,0 5.4,12.9A2.1,2.1 0 0,0 7.5,15L8.21,14.88L11,17.67V21H4V13H2.25C1.83,13 1.42,13 1.42,12.79C1.43,12.57 1.85,12.15 2.28,11.72L11,3C11.33,2.67 11.67,2.33 12,2.33C12.33,2.33 12.67,2.67 13,3L17,7V6H19V9L21.78,11.78C22.18,12.18 22.59,12.59 22.6,12.8C22.6,13 22.2,13 21.8,13M7.5,12A0.9,0.9 0 0,1 8.4,12.9A0.9,0.9 0 0,1 7.5,13.8A0.9,0.9 0 0,1 6.6,12.9A0.9,0.9 0 0,1 7.5,12M16.5,12C17,12 17.4,12.4 17.4,12.9C17.4,13.4 17,13.8 16.5,13.8A0.9,0.9 0 0,1 15.6,12.9A0.9,0.9 0 0,1 16.5,12M12,6.9C12.5,6.9 12.9,7.3 12.9,7.8C12.9,8.3 12.5,8.7 12,8.7C11.5,8.7 11.1,8.3 11.1,7.8C11.1,7.3 11.5,6.9 12,6.9Z";
	var mdiHomeAutomation = "M12,3L2,12H5V20H19V12H22L12,3M12,8.5C14.34,8.5 16.46,9.43 18,10.94L16.8,12.12C15.58,10.91 13.88,10.17 12,10.17C10.12,10.17 8.42,10.91 7.2,12.12L6,10.94C7.54,9.43 9.66,8.5 12,8.5M12,11.83C13.4,11.83 14.67,12.39 15.6,13.3L14.4,14.47C13.79,13.87 12.94,13.5 12,13.5C11.06,13.5 10.21,13.87 9.6,14.47L8.4,13.3C9.33,12.39 10.6,11.83 12,11.83M12,15.17C12.94,15.17 13.7,15.91 13.7,16.83C13.7,17.75 12.94,18.5 12,18.5C11.06,18.5 10.3,17.75 10.3,16.83C10.3,15.91 11.06,15.17 12,15.17Z";
	var mdiHomeOutline = "M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22";
	var mdiImage = "M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z";
	var mdiImageFilterFrames = "M18,8H6V18H18M20,20H4V6H8.5L12.04,2.5L15.5,6H20M20,4H16L12,0L8,4H4A2,2 0 0,0 2,6V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V6A2,2 0 0,0 20,4Z";
	var mdiLightbulb = "M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z";
	var mdiLock = "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z";
	var mdiLockAlert = "M10 17C11.1 17 12 16.1 12 15C12 13.9 11.1 13 10 13C8.9 13 8 13.9 8 15S8.9 17 10 17M16 8C17.1 8 18 8.9 18 10V20C18 21.1 17.1 22 16 22H4C2.9 22 2 21.1 2 20V10C2 8.9 2.9 8 4 8H5V6C5 3.2 7.2 1 10 1S15 3.2 15 6V8H16M10 3C8.3 3 7 4.3 7 6V8H13V6C13 4.3 11.7 3 10 3M22 13H20V7H22V13M22 17H20V15H22V17Z";
	var mdiLockClock = "M8.5,2C6,2 4,4 4,6.5V7C2.89,7 2,7.89 2,9V18C2,19.11 2.89,20 4,20H8.72C10.18,21.29 12.06,22 14,22A8,8 0 0,0 22,14A8,8 0 0,0 14,6C13.66,6 13.32,6.03 13,6.08C12.76,3.77 10.82,2 8.5,2M8.5,4A2.5,2.5 0 0,1 11,6.5V7H6V6.5A2.5,2.5 0 0,1 8.5,4M14,8A6,6 0 0,1 20,14A6,6 0 0,1 14,20A6,6 0 0,1 8,14A6,6 0 0,1 14,8M13,10V15L16.64,17.19L17.42,15.9L14.5,14.15V10H13Z";
	var mdiLockOpen = "M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10A2,2 0 0,1 6,8H15V6A3,3 0 0,0 12,3A3,3 0 0,0 9,6H7A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,17A2,2 0 0,0 14,15A2,2 0 0,0 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17Z";
	var mdiMailbox = "M17,4H7A5,5 0 0,0 2,9V20H20A2,2 0 0,0 22,18V9A5,5 0 0,0 17,4M10,18H4V9A3,3 0 0,1 7,6A3,3 0 0,1 10,9V18M19,15H17V13H13V11H19V15M9,11H5V9H9V11Z";
	var mdiMapMarkerRadius = "M12,2C15.31,2 18,4.66 18,7.95C18,12.41 12,19 12,19C12,19 6,12.41 6,7.95C6,4.66 8.69,2 12,2M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M20,19C20,21.21 16.42,23 12,23C7.58,23 4,21.21 4,19C4,17.71 5.22,16.56 7.11,15.83L7.75,16.74C6.67,17.19 6,17.81 6,18.5C6,19.88 8.69,21 12,21C15.31,21 18,19.88 18,18.5C18,17.81 17.33,17.19 16.25,16.74L16.89,15.83C18.78,16.56 20,17.71 20,19Z";
	var mdiMeterGas = "M16 4H15V2H13V4H11V2H9V4H8C5.79 4 4 5.79 4 8V18C4 20.21 5.79 22 8 22H16C18.21 22 20 20.21 20 18V8C20 5.79 18.21 4 16 4M12 18C10.62 18 9.5 16.9 9.5 15.54C9.5 14.45 9.93 14.15 12 11.75C14.05 14.13 14.5 14.45 14.5 15.54C14.5 16.9 13.38 18 12 18M16 10H8V8H16V10Z";
	var mdiMicrophoneMessage = "M8,7A2,2 0 0,1 10,9V14A2,2 0 0,1 8,16A2,2 0 0,1 6,14V9A2,2 0 0,1 8,7M14,14C14,16.97 11.84,19.44 9,19.92V22H7V19.92C4.16,19.44 2,16.97 2,14H4A4,4 0 0,0 8,18A4,4 0 0,0 12,14H14M21.41,9.41L17.17,13.66L18.18,10H14A2,2 0 0,1 12,8V4A2,2 0 0,1 14,2H20A2,2 0 0,1 22,4V8C22,8.55 21.78,9.05 21.41,9.41Z";
	var mdiMotionSensor = "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z";
	var mdiMotionSensorOff = "M11.4 8.2H15V10H13.2L11.4 8.2M19.67 1H18.33C18.33 3.58 20.42 5.67 23 5.67V4.33C21.16 4.33 19.67 2.84 19.67 1M21 1C21 2.11 21.9 3 23 3V1H21M17 1H15.67C15.67 5.05 18.95 8.33 23 8.33V7C19.69 7 17 4.31 17 1M10 3.8C11 3.8 11.8 3 11.8 2S11 .2 10 .2 8.2 1 8.2 2 9 3.8 10 3.8M2.39 1.73L1.11 3L3.46 5.35L2 5.8V11H3.8V7.33L5.05 6.94L5.68 7.57L2 22H3.8L6.67 13.89L9 17V22H10.8V15.59L8.31 11.05L8.5 10.37L20.84 22.73L22.11 21.46L2.39 1.73M9.38 4.87C9.08 4.37 8.54 4.03 7.92 4.03C7.75 4.03 7.58 4.06 7.42 4.11L7.34 4.14L11.35 8.15L9.38 4.87Z";
	var mdiMusicNote = "M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17S7.79 21 10 21 14 19.21 14 17V7H18V3H12Z";
	var mdiMusicNoteOff = "M4.27 3L3 4.27L12 13.27V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17S7.79 21 10 21 14 19.21 14 17V15.27L19.73 21L21 19.73L4.27 3M14 7H18V3H12V8.18L14 10.18Z";
	var mdiPackage = "M5.12,5H18.87L17.93,4H5.93L5.12,5M20.54,5.23C20.83,5.57 21,6 21,6.5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V6.5C3,6 3.17,5.57 3.46,5.23L4.84,3.55C5.12,3.21 5.53,3 6,3H18C18.47,3 18.88,3.21 19.15,3.55L20.54,5.23M6,18H12V15H6V18Z";
	var mdiPackageUp = "M20.54,5.23C20.83,5.57 21,6 21,6.5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V6.5C3,6 3.17,5.57 3.46,5.23L4.84,3.55C5.12,3.21 5.53,3 6,3H18C18.47,3 18.88,3.21 19.15,3.55L20.54,5.23M5.12,5H18.87L17.93,4H5.93L5.12,5M12,9.5L6.5,15H10V17H14V15H17.5L12,9.5Z";
	var mdiPalette = "M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z";
	var mdiPipeValve = "M22 13V21H20V19H16.58C15.81 20.76 14.05 22 12 22S8.19 20.76 7.42 19H4V21H2V13H4V15H7.43C7.93 13.85 8.85 12.93 10 12.42V11H8V9H16V11H14V12.42C15.15 12.93 16.07 13.85 16.57 15H20V13H22M17 2H7C6.45 2 6 2.45 6 3S6.45 4 7 4H10V5H11V8H13V5H14V4H17C17.55 4 18 3.55 18 3S17.55 2 17 2Z";
	var mdiPlay = "M8,5.14V19.14L19,12.14L8,5.14Z";
	var mdiPowerPlug = "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z";
	var mdiPowerPlugOff = "M20.84 22.73L15.31 17.2L14.5 18V21H9.5V18L6 14.5V9C6 8.7 6.1 8.41 6.25 8.14L1.11 3L2.39 1.73L22.11 21.46L20.84 22.73M18 14.5V9C18 8 17 7 16 7V3H14V7H10.2L17.85 14.65L18 14.5M10 3H8V4.8L10 6.8V3Z";
	var mdiRadioboxBlank = "M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";
	var mdiRayVertex = "M2,11H9.17C9.58,9.83 10.69,9 12,9C13.31,9 14.42,9.83 14.83,11H22V13H14.83C14.42,14.17 13.31,15 12,15C10.69,15 9.58,14.17 9.17,13H2V11Z";
	var mdiRemote = "M12,0C8.96,0 6.21,1.23 4.22,3.22L5.63,4.63C7.26,3 9.5,2 12,2C14.5,2 16.74,3 18.36,4.64L19.77,3.23C17.79,1.23 15.04,0 12,0M7.05,6.05L8.46,7.46C9.37,6.56 10.62,6 12,6C13.38,6 14.63,6.56 15.54,7.46L16.95,6.05C15.68,4.78 13.93,4 12,4C10.07,4 8.32,4.78 7.05,6.05M12,15A2,2 0 0,1 10,13A2,2 0 0,1 12,11A2,2 0 0,1 14,13A2,2 0 0,1 12,15M15,9H9A1,1 0 0,0 8,10V22A1,1 0 0,0 9,23H15A1,1 0 0,0 16,22V10A1,1 0 0,0 15,9Z";
	var mdiRobot = "M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z";
	var mdiRobotConfused = "M20 4H18V3H20.5C20.78 3 21 3.22 21 3.5V5.5C21 5.78 20.78 6 20.5 6H20V7H19V5H20V4M19 9H20V8H19V9M17 3H16V7H17V3M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C14.34 7 14.67 7.03 15 7.08V10H19.74C20.53 11.13 21 12.5 21 14H22C22.55 14 23 14.45 23 15M10 15.5C10 14.12 8.88 13 7.5 13S5 14.12 5 15.5 6.12 18 7.5 18 10 16.88 10 15.5M19 15.5C19 14.12 17.88 13 16.5 13S14 14.12 14 15.5 15.12 18 16.5 18 19 16.88 19 15.5M17 8H16V9H17V8Z";
	var mdiRobotMower = "M1 14V5H13C18.5 5 23 9.5 23 15V17H20.83C20.42 18.17 19.31 19 18 19C16.69 19 15.58 18.17 15.17 17H10C9.09 18.21 7.64 19 6 19C3.24 19 1 16.76 1 14M6 11C4.34 11 3 12.34 3 14C3 15.66 4.34 17 6 17C7.66 17 9 15.66 9 14C9 12.34 7.66 11 6 11M15 10V12H20.25C19.92 11.27 19.5 10.6 19 10H15Z";
	var mdiRobotOff = "M23 15V18C23 18.5 22.64 18.88 22.17 18.97L18.97 15.77C19 15.68 19 15.59 19 15.5C19 14.12 17.88 13 16.5 13C16.41 13 16.32 13 16.23 13.03L10.2 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M22.11 21.46L20.84 22.73L19.89 21.78C19.62 21.92 19.32 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 11.53 4.29 9.36 6.22 8.11L1.11 3L2.39 1.73L22.11 21.46M10 15.5C10 14.12 8.88 13 7.5 13S5 14.12 5 15.5 6.12 18 7.5 18 10 16.88 10 15.5M16.07 17.96L14.04 15.93C14.23 16.97 15.04 17.77 16.07 17.96Z";
	var mdiRobotVacuum = "M12,2C14.65,2 17.19,3.06 19.07,4.93L17.65,6.35C16.15,4.85 14.12,4 12,4C9.88,4 7.84,4.84 6.35,6.35L4.93,4.93C6.81,3.06 9.35,2 12,2M3.66,6.5L5.11,7.94C4.39,9.17 4,10.57 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,10.57 19.61,9.17 18.88,7.94L20.34,6.5C21.42,8.12 22,10.04 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12C2,10.04 2.58,8.12 3.66,6.5M12,6A6,6 0 0,1 18,12C18,13.59 17.37,15.12 16.24,16.24L14.83,14.83C14.08,15.58 13.06,16 12,16C10.94,16 9.92,15.58 9.17,14.83L7.76,16.24C6.63,15.12 6,13.59 6,12A6,6 0 0,1 12,6M12,8A1,1 0 0,0 11,9A1,1 0 0,0 12,10A1,1 0 0,0 13,9A1,1 0 0,0 12,8Z";
	var mdiRollerShade = "M20 19V3H4V19H2V21H22V19H20M6 19V13H11V14.8C10.6 15.1 10.2 15.6 10.2 16.2C10.2 17.2 11 18 12 18S13.8 17.2 13.8 16.2C13.8 15.6 13.5 15.1 13 14.8V13H18V19H6Z";
	var mdiRollerShadeClosed = "M20 19V3H4V19H2V21H10.25C10.25 21.97 11.03 22.75 12 22.75S13.75 21.97 13.75 21H22V19H20M6 19V17H11V19H6M13 19V17H18V19H13Z";
	var mdiScriptText = "M17.8,20C17.4,21.2 16.3,22 15,22H5C3.3,22 2,20.7 2,19V18H5L14.2,18C14.6,19.2 15.7,20 17,20H17.8M19,2C20.7,2 22,3.3 22,5V6H20V5C20,4.4 19.6,4 19,4C18.4,4 18,4.4 18,5V18H17C16.4,18 16,17.6 16,17V16H5V5C5,3.3 6.3,2 8,2H19M8,6V8H15V6H8M8,10V12H14V10H8Z";
	var mdiSmokeDetector = "M12,18A6,6 0 0,0 18,12C18,8.68 15.31,6 12,6C8.68,6 6,8.68 6,12A6,6 0 0,0 12,18M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19M8,12A4,4 0 0,1 12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12Z";
	var mdiSmokeDetectorAlert = "M10 18C13.3 18 16 15.3 16 12C16 8.7 13.3 6 10 6C6.7 6 4 8.7 4 12C4 15.3 6.7 18 10 18M17 3C18.1 3 19 3.9 19 5V19C19 20.1 18.1 21 17 21H3C1.9 21 1 20.1 1 19V5C1 3.9 1.9 3 3 3H17M6 12C6 9.8 7.8 8 10 8S14 9.8 14 12 12.2 16 10 16 6 14.2 6 12M23 7H21V13H23V8M23 15H21V17H23V15Z";
	var mdiSmokeDetectorVariant = "M12 4C16.41 4 20 7.59 20 12S16.41 20 12 20 4 16.41 4 12 7.59 4 12 4M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 11C11.45 11 11 11.45 11 12S11.45 13 12 13 13 12.55 13 12 12.55 11 12 11M10.72 9.3C11.11 9.11 11.54 9 12 9S12.89 9.11 13.29 9.3L14 8.57C13.43 8.22 12.74 8 12 8S10.58 8.22 10 8.57L10.72 9.3M15 12C15 12.46 14.89 12.89 14.7 13.29L15.43 14C15.79 13.43 16 12.74 16 12S15.79 10.58 15.43 10L14.7 10.72C14.89 11.11 15 11.54 15 12M9 12C9 11.54 9.11 11.11 9.3 10.72L8.57 10C8.22 10.58 8 11.26 8 12S8.22 13.43 8.57 14L9.3 13.29C9.11 12.89 9 12.46 9 12M13.29 14.7C12.89 14.89 12.46 15 12 15S11.11 14.89 10.72 14.7L10 15.43C10.58 15.79 11.26 16 12 16S13.43 15.79 14 15.43L13.29 14.7M16.89 8.53L16.17 9.25C16.69 10.04 17 11 17 12S16.69 13.96 16.17 14.75L16.89 15.47C17.59 14.5 18 13.3 18 12S17.59 9.5 16.89 8.53M9.25 7.83C10.04 7.31 11 7 12 7S13.96 7.31 14.75 7.83L15.47 7.11C14.5 6.42 13.3 6 12 6S9.5 6.42 8.53 7.11L9.25 7.83M14.75 16.17C13.96 16.69 13 17 12 17S10.04 16.69 9.25 16.17L8.53 16.89C9.5 17.59 10.7 18 12 18S14.5 17.59 15.47 16.89L14.75 16.17M7.83 14.75C7.31 13.96 7 13 7 12S7.31 10.04 7.83 9.25L7.11 8.53C6.42 9.5 6 10.7 6 12S6.42 14.5 7.11 15.47L7.83 14.75Z";
	var mdiSmokeDetectorVariantAlert = "M10 4C14.4 4 18 7.6 18 12S14.4 20 10 20 2 16.4 2 12 5.6 4 10 4M10 2C4.5 2 0 6.5 0 12S4.5 22 10 22 20 17.5 20 12 15.5 2 10 2M10 11C9.4 11 9 11.4 9 12S9.4 13 10 13 11 12.6 11 12 10.6 11 10 11M8.7 9.3C9.1 9.1 9.5 9 10 9S10.9 9.1 11.3 9.3L12 8.6C11.4 8.2 10.7 8 10 8S8.6 8.2 8 8.6L8.7 9.3M13 12C13 12.5 12.9 12.9 12.7 13.3L13.4 14C13.8 13.4 14 12.7 14 12S13.8 10.6 13.4 10L12.7 10.7C12.9 11.1 13 11.5 13 12M7 12C7 11.5 7.1 11.1 7.3 10.7L6.6 10C6.2 10.6 6 11.3 6 12S6.2 13.4 6.6 14L7.3 13.3C7.1 12.9 7 12.5 7 12M11.3 14.7C10.9 14.9 10.5 15 10 15S9.1 14.9 8.7 14.7L8 15.4C8.6 15.8 9.3 16 10 16S11.4 15.8 12 15.4L11.3 14.7M14.9 8.5L14.2 9.2C14.7 10 15 11 15 12S14.7 14 14.2 14.8L14.9 15.5C15.6 14.5 16 13.3 16 12S15.6 9.5 14.9 8.5M7.2 7.8C8 7.3 9 7 10 7S12 7.3 12.8 7.8L13.5 7.1C12.5 6.4 11.3 6 10 6S7.5 6.4 6.5 7.1L7.2 7.8M12.8 16.2C12 16.7 11 17 10 17S8 16.7 7.2 16.2L6.5 16.9C7.5 17.6 8.7 18 10 18S12.5 17.6 13.5 16.9L12.8 16.2M5.8 14.8C5.3 14 5 13 5 12S5.3 10 5.8 9.2L5.1 8.5C4.4 9.5 4 10.7 4 12S4.4 14.5 5.1 15.5L5.8 14.8M24 7H22V13H24V8M24 15H22V17H24V15Z";
	var mdiSnowflake = "M20.79,13.95L18.46,14.57L16.46,13.44V10.56L18.46,9.43L20.79,10.05L21.31,8.12L19.54,7.65L20,5.88L18.07,5.36L17.45,7.69L15.45,8.82L13,7.38V5.12L14.71,3.41L13.29,2L12,3.29L10.71,2L9.29,3.41L11,5.12V7.38L8.5,8.82L6.5,7.69L5.92,5.36L4,5.88L4.47,7.65L2.7,8.12L3.22,10.05L5.55,9.43L7.55,10.56V13.45L5.55,14.58L3.22,13.96L2.7,15.89L4.47,16.36L4,18.12L5.93,18.64L6.55,16.31L8.55,15.18L11,16.62V18.88L9.29,20.59L10.71,22L12,20.71L13.29,22L14.7,20.59L13,18.88V16.62L15.5,15.17L17.5,16.3L18.12,18.63L20,18.12L19.53,16.35L21.3,15.88L20.79,13.95M9.5,10.56L12,9.11L14.5,10.56V13.44L12,14.89L9.5,13.44V10.56Z";
	var mdiSpeaker = "M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z";
	var mdiSpeakerMessage = "M16.5 3H21.5C22.3 3 23 3.7 23 4.5V7.5C23 8.3 22.3 9 21.5 9H18L15 12V4.5C15 3.7 15.7 3 16.5 3M3 3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H11C12.1 21 13 20.1 13 19V5C13 3.9 12.1 3 11 3H3M7 5C8.1 5 9 5.9 9 7S8.1 9 7 9 5 8.1 5 7 5.9 5 7 5M7 11C9.2 11 11 12.8 11 15S9.2 19 7 19 3 17.2 3 15 4.8 11 7 11M7 13C5.9 13 5 13.9 5 15S5.9 17 7 17 9 16.1 9 15 8.1 13 7 13";
	var mdiSpeakerOff = "M2,5.27L3.28,4L21,21.72L19.73,23L18.27,21.54C17.93,21.83 17.5,22 17,22H7C5.89,22 5,21.1 5,20V8.27L2,5.27M12,18A3,3 0 0,1 9,15C9,14.24 9.28,13.54 9.75,13L8.33,11.6C7.5,12.5 7,13.69 7,15A5,5 0 0,0 12,20C13.31,20 14.5,19.5 15.4,18.67L14,17.25C13.45,17.72 12.76,18 12,18M17,15A5,5 0 0,0 12,10H11.82L5.12,3.3C5.41,2.54 6.14,2 7,2H17A2,2 0 0,1 19,4V17.18L17,15.17V15M12,4C10.89,4 10,4.89 10,6A2,2 0 0,0 12,8A2,2 0 0,0 14,6C14,4.89 13.1,4 12,4Z";
	var mdiSpeakerPause = "M12.28 19.81C11.87 19.92 11.45 20 11 20C8.24 20 6 17.76 6 15S8.24 10 11 10C12.89 10 14.5 11.06 15.37 12.61C16.16 12.23 17.06 12 18 12V4C18 2.89 17.1 2 16 2H6C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H13.54C13 21.37 12.54 20.63 12.28 19.81M11 4C12.11 4 13 4.89 13 6S12.11 8 11 8C9.89 8 9 7.1 9 6C9 4.89 9.89 4 11 4M13.74 13.78C12.7 14.82 12.06 16.24 12 17.81C11.69 17.93 11.36 18 11 18C9.34 18 8 16.66 8 15S9.34 12 11 12C12.22 12 13.27 12.73 13.74 13.78M19 15H21V21H19M15 15H17V21H15V15Z";
	var mdiSpeakerPlay = "M16 15V21L21 18L16 15M12.28 19.81C11.87 19.92 11.45 20 11 20C8.24 20 6 17.76 6 15S8.24 10 11 10C12.89 10 14.5 11.06 15.37 12.61C16.16 12.23 17.06 12 18 12V4C18 2.89 17.1 2 16 2H6C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H13.54C13 21.37 12.54 20.63 12.28 19.81M11 4C12.11 4 13 4.89 13 6S12.11 8 11 8C9.89 8 9 7.1 9 6C9 4.89 9.89 4 11 4M13.74 13.78C12.7 14.82 12.06 16.24 12 17.81C11.69 17.93 11.36 18 11 18C9.34 18 8 16.66 8 15S9.34 12 11 12C12.22 12 13.27 12.73 13.74 13.78Z";
	var mdiSquare = "M3,3V21H21V3";
	var mdiSquareOutline = "M3,3H21V21H3V3M5,5V19H19V5H5Z";
	var mdiStop = "M18,18H6V6H18V18Z";
	var mdiSwapHorizontal = "M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z";
	var mdiTelevision = "M21,17H3V5H21M21,3H3A2,2 0 0,0 1,5V17A2,2 0 0,0 3,19H8V21H16V19H21A2,2 0 0,0 23,17V5A2,2 0 0,0 21,3Z";
	var mdiTelevisionOff = "M0.5,2.77L1.78,1.5L21,20.72L19.73,22L16.73,19H16V21H8V19H3A2,2 0 0,1 1,17V5C1,4.5 1.17,4.07 1.46,3.73L0.5,2.77M21,17V5H7.82L5.82,3H21A2,2 0 0,1 23,5V17C23,17.85 22.45,18.59 21.7,18.87L19.82,17H21M3,17H14.73L3,5.27V17Z";
	var mdiTelevisionPause = "M3 3C1.89 3 1 3.89 1 5V17C1 18.1 1.9 19 3 19H8V21H16V19H21C22.1 19 23 18.1 23 17V5C23 3.89 22.1 3 21 3M3 5H21V17H3M9 8V14H11V8M13 8V14H15V8";
	var mdiTelevisionPlay = "M21,3H3C1.89,3 1,3.89 1,5V17A2,2 0 0,0 3,19H8V21H16V19H21A2,2 0 0,0 23,17V5C23,3.89 22.1,3 21,3M21,17H3V5H21M16,11L9,15V7";
	var mdiThermometer = "M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z";
	var mdiThermostat = "M16.95,16.95L14.83,14.83C15.55,14.1 16,13.1 16,12C16,11.26 15.79,10.57 15.43,10L17.6,7.81C18.5,9 19,10.43 19,12C19,13.93 18.22,15.68 16.95,16.95M12,5C13.57,5 15,5.5 16.19,6.4L14,8.56C13.43,8.21 12.74,8 12,8A4,4 0 0,0 8,12C8,13.1 8.45,14.1 9.17,14.83L7.05,16.95C5.78,15.68 5,13.93 5,12A7,7 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z";
	var mdiTimerOutline = "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z";
	var mdiToggleSwitch = "M17,7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7M17,15A3,3 0 0,1 14,12A3,3 0 0,1 17,9A3,3 0 0,1 20,12A3,3 0 0,1 17,15Z";
	var mdiToggleSwitchOffOutline = "M17 6H7c-3.31 0-6 2.69-6 6s2.69 6 6 6h10c3.31 0 6-2.69 6-6s-2.69-6-6-6zm0 10H7c-2.21 0-4-1.79-4-4s1.79-4 4-4h10c2.21 0 4 1.79 4 4s-1.79 4-4 4zM7 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z";
	var mdiVibrate = "M16,19H8V5H16M16.5,3H7.5A1.5,1.5 0 0,0 6,4.5V19.5A1.5,1.5 0 0,0 7.5,21H16.5A1.5,1.5 0 0,0 18,19.5V4.5A1.5,1.5 0 0,0 16.5,3M19,17H21V7H19M22,9V15H24V9M3,17H5V7H3M0,15H2V9H0V15Z";
	var mdiVideo = "M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z";
	var mdiVideoOff = "M3.27,2L2,3.27L4.73,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16C16.2,18 16.39,17.92 16.54,17.82L19.73,21L21,19.73M21,6.5L17,10.5V7A1,1 0 0,0 16,6H9.82L21,17.18V6.5Z";
	var mdiWater = "M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z";
	var mdiWaterBoiler = "M8 2C6.89 2 6 2.89 6 4V16C6 17.11 6.89 18 8 18H9V20H6V22H9C10.11 22 11 21.11 11 20V18H13V20C13 21.11 13.89 22 15 22H18V20H15V18H16C17.11 18 18 17.11 18 16V4C18 2.89 17.11 2 16 2H8M12 4.97A2 2 0 0 1 14 6.97A2 2 0 0 1 12 8.97A2 2 0 0 1 10 6.97A2 2 0 0 1 12 4.97M10 14.5H14V16H10V14.5Z";
	var mdiWaterBoilerOff = "M10 6.82L6.25 3.05C6.59 2.42 7.24 2 8 2H16C17.11 2 18 2.89 18 4V14.8L12.16 8.96C13.19 8.87 14 8 14 6.97C14 5.87 13.11 4.97 12 4.97C10.95 4.97 10.1 5.78 10 6.82M15 18V20H18V22H15C13.89 22 13 21.11 13 20V18H11V20C11 21.11 10.11 22 9 22H6V20H9V18H8C6.89 18 6 17.11 6 16V7.89L1.11 3L2.39 1.73L22.11 21.46L20.84 22.73L16.1 18C16.06 18 16.03 18 16 18H15M14 16V15.89L12.61 14.5H10V16H14Z";
	var mdiWaterOff = "M20.84 22.73L16.29 18.18C15.2 19.3 13.69 20 12 20C8.69 20 6 17.31 6 14C6 12.67 6.67 11.03 7.55 9.44L1.11 3L2.39 1.73L22.11 21.46L20.84 22.73M18 14C18 10 12 3.25 12 3.25S10.84 4.55 9.55 6.35L17.95 14.75C18 14.5 18 14.25 18 14Z";
	var mdiWeatherNight = "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z";
	var mdiWeatherPartlyCloudy = "M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z";
	var mdiWhiteBalanceSunny = "M3.55 19.09L4.96 20.5L6.76 18.71L5.34 17.29M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12C18 8.68 15.31 6 12 6M20 13H23V11H20M17.24 18.71L19.04 20.5L20.45 19.09L18.66 17.29M20.45 5L19.04 3.6L17.24 5.39L18.66 6.81M13 1H11V4H13M6.76 5.39L4.96 3.6L3.55 5L5.34 6.81L6.76 5.39M1 13H4V11H1M13 20H11V23H13";
	var mdiWindowClosed = "M6,11H10V9H14V11H18V4H6V11M18,13H6V20H18V13M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2Z";
	var mdiWindowOpen = "M6,8H10V6H14V8H18V4H6V8M18,10H6V15H18V10M6,20H18V17H6V20M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2Z";
	var mdiWindowShutter = "M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12M8 15H16V17H8V15M8 18H16V20H8V18Z";
	var mdiWindowShutterOpen = "M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9Z";

	var iconViewbox = "0 0 24 24";
	var actionIcons = {
	    failure: mdiAlertDecagramOutline,
	    success: mdiCheckDecagram,
	};
	// based on https://github.com/home-assistant/frontend/blob/dev/src/common/entity/domain_icon.ts
	var circles = {
	    off: mdiCheckCircle,
	    on: mdiAlertCircle,
	};
	var icons = {
	    air_quality: mdiAirFilter,
	    // alarm_control_panel is specific
	    alert: mdiAlert,
	    automation: {
	        unavailable: mdiRobotConfused,
	        off: mdiRobotOff,
	        default: mdiRobot,
	    },
	    battery: { off: mdiBatteryAlert, on: mdiBattery },
	    binary_sensor: {
	        battery: {
	            off: mdiBattery,
	            on: mdiBatteryOutline,
	        },
	        battery_charging: {
	            off: mdiBattery,
	            on: mdiBatteryCharging,
	        },
	        carbon_monoxide: {
	            off: mdiSmokeDetector,
	            on: mdiSmokeDetectorAlert,
	        },
	        cold: {
	            off: mdiThermometer,
	            on: mdiSnowflake,
	        },
	        connectivity: {
	            off: mdiCloseNetworkOutline,
	            on: mdiCheckNetworkOutline,
	        },
	        door: {
	            off: mdiDoorClosed,
	            on: mdiDoorOpen,
	        },
	        garage_door: {
	            off: mdiGarage,
	            on: mdiGarageOpen,
	        },
	        gas: circles,
	        heat: {
	            off: mdiThermometer,
	            on: mdiFire,
	        },
	        light: {
	            off: mdiBrightness5,
	            on: mdiBrightness7,
	        },
	        lock: {
	            off: mdiLock,
	            on: mdiLockOpen,
	        },
	        moisture: {
	            off: mdiWaterOff,
	            on: mdiWater,
	        },
	        motion: {
	            off: mdiMotionSensorOff,
	            on: mdiMotionSensor,
	        },
	        occupancy: {
	            off: mdiHomeOutline,
	            on: mdiHome,
	        },
	        opening: {
	            off: mdiSquare,
	            on: mdiSquareOutline,
	        },
	        power: {
	            off: mdiPowerPlugOff,
	            on: mdiPowerPlug,
	        },
	        problem: circles,
	        presence: {
	            off: mdiHomeOutline,
	            on: mdiHome,
	        },
	        plug: {
	            off: mdiPowerPlugOff,
	            on: mdiPowerPlug,
	        },
	        running: {
	            off: mdiStop,
	            on: mdiPlay,
	        },
	        safety: circles,
	        smoke: {
	            off: mdiSmokeDetectorVariant,
	            on: mdiSmokeDetectorVariantAlert,
	        },
	        sound: {
	            off: mdiMusicNoteOff,
	            on: mdiMusicNote,
	        },
	        tamper: circles,
	        update: {
	            off: mdiPackage,
	            on: mdiPackageUp,
	        },
	        vibration: {
	            off: mdiCropPortrait,
	            on: mdiVibrate,
	        },
	        window: {
	            off: mdiWindowClosed,
	            on: mdiWindowOpen,
	        },
	        off: mdiRadioboxBlank,
	        on: mdiCheckboxMarkedCircle,
	    },
	    // button is specific
	    calendar: mdiCalendar,
	    camera: { off: mdiVideoOff, default: mdiVideo },
	    climate: mdiThermostat,
	    cover: {
	        garage: {
	            opening: mdiArrowUpBox,
	            closing: mdiArrowDownBox,
	            closed: mdiGarage,
	            default: mdiGarageOpen,
	        },
	        gate: {
	            opening: mdiGateArrowRight,
	            closing: mdiGateArrowRight,
	            closed: mdiGate,
	            default: mdiGateOpen,
	        },
	        door: { open: mdiDoorOpen, default: mdiDoorClosed },
	        damper: { open: mdiCircle, default: mdiCircleSlice8 },
	        shutter: {
	            opening: mdiArrowUpBox,
	            closing: mdiArrowDownBox,
	            closed: mdiWindowShutter,
	            default: mdiWindowShutterOpen,
	        },
	        curtain: {
	            opening: mdiArrowSplitVertical,
	            closing: mdiArrowCollapseHorizontal,
	            closed: mdiCurtainsClosed,
	            default: mdiCurtains,
	        },
	        blind: {
	            opening: mdiArrowUpBox,
	            closing: mdiArrowDownBox,
	            closed: mdiBlindsHorizontalClosed,
	            default: mdiBlindsHorizontal,
	        },
	        shade: {
	            opening: mdiArrowUpBox,
	            closing: mdiArrowDownBox,
	            closed: mdiRollerShadeClosed,
	            default: mdiRollerShade,
	        },
	        window: {
	            opening: mdiArrowUpBox,
	            closing: mdiArrowDownBox,
	            closed: mdiWindowClosed,
	            default: mdiWindowOpen,
	        },
	    },
	    configurator: mdiCog,
	    conversation: mdiMicrophoneMessage,
	    counter: mdiCounter,
	    datetime: mdiCalendarClock,
	    date: mdiCalendar,
	    demo: mdiHomeAssistant,
	    device_tracker: { not_home: mdiAccountArrowRight, default: mdiAccount },
	    // event
	    fan: { off: mdiFanOff, default: mdiFan },
	    google_assistant: mdiGoogleAssistant,
	    group: mdiGoogleCirclesCommunities,
	    homeassistant: mdiHomeAssistant,
	    homekit: mdiHomeAutomation,
	    humidifier: { off: mdiAirHumidifierOff, default: mdiAirHumidifier },
	    image: mdiImage,
	    image_processing: mdiImageFilterFrames,
	    input_boolean: { on: mdiCheckCircleOutline, default: mdiCloseCircleOutline },
	    input_button: mdiButtonPointer,
	    // input_datetime is specific
	    input_datetime: mdiCalendarClock,
	    input_number: mdiRayVertex,
	    input_select: mdiFormatListBulleted,
	    input_text: mdiFormTextbox,
	    lawn_mower: mdiRobotMower,
	    light: mdiLightbulb,
	    lock: {
	        unlocked: mdiLockOpen,
	        jammed: mdiLockAlert,
	        locking: mdiLockClock,
	        unlocking: mdiLockClock,
	        default: mdiLock,
	    },
	    mailbox: mdiMailbox,
	    media_player: {
	        speaker: {
	            playing: mdiSpeakerPlay,
	            paused: mdiSpeakerPause,
	            off: mdiSpeakerOff,
	            default: mdiSpeaker,
	        },
	        tv: {
	            playing: mdiTelevisionPlay,
	            paused: mdiTelevisionPause,
	            off: mdiTelevisionOff,
	            default: mdiTelevision,
	        },
	        receiver: {
	            off: mdiAudioVideoOff,
	            default: mdiAudioVideo,
	        },
	        default: {
	            playing: mdiCastConnected,
	            paused: mdiCastConnected,
	            off: mdiCastOff,
	            default: mdiCast,
	        },
	    },
	    notify: mdiCommentAlert,
	    // number is specific
	    number: mdiRayVertex,
	    persistent_notification: mdiBell,
	    person: { not_home: mdiAccountArrowRight, default: mdiAccount },
	    plant: mdiFlower,
	    proximity: mdiAppleSafari,
	    remote: mdiRemote,
	    scene: mdiPalette,
	    schedule: mdiCalendarClock,
	    script: mdiScriptText,
	    select: mdiFormatListBulleted,
	    // sensor is specific
	    // sensor: mdiEye,
	    simple_alarm: mdiBell,
	    siren: mdiBullhorn,
	    stt: mdiMicrophoneMessage,
	    sun: { above_horizon: mdiWhiteBalanceSunny, default: mdiWeatherNight },
	    switch: {
	        outlet: { on: mdiPowerPlug, default: mdiPowerPlugOff },
	        //switch: { on: mdiToggleSwitchVariant, default: mdiToggleSwitchVariantOff },
	        //default: mdiToggleSwitchVariant,
	        switch: { on: mdiToggleSwitch, default: mdiToggleSwitchOffOutline },
	        on: mdiToggleSwitch,
	        default: mdiToggleSwitchOffOutline,
	    },
	    switch_as_x: mdiSwapHorizontal,
	    text: mdiFormTextbox,
	    threshold: mdiChartSankey,
	    todo: mdiClipboardList,
	    time: mdiClock,
	    timer: mdiTimerOutline,
	    tts: mdiSpeakerMessage,
	    updater: mdiCloudUpload,
	    update: { on: mdiPackageUp, default: mdiPackage },
	    vacuum: mdiRobotVacuum,
	    valve: { water: mdiPipeValve, gas: mdiMeterGas, default: mdiPipeValve },
	    wake_word: mdiChatSleep,
	    water_heater: { off: mdiWaterBoilerOff, default: mdiWaterBoiler },
	    // weather is specific
	    weather: mdiWeatherPartlyCloudy,
	    zone: mdiMapMarkerRadius,
	};
	var isString = function (value) {
	    return typeof value === "string" || value instanceof String;
	};
	var isNumber = function (value) { return !isNaN(parseFloat(value)) && isFinite(value); };
	var getIconInner = function (icons, state) {
	    var _a;
	    return !isNumber(state) &&
	        (((icons === null || icons === void 0 ? void 0 : icons.hasOwnProperty(state)) && icons[state]) ||
	            (((_a = icons === null || icons === void 0 ? void 0 : icons.default) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(state)) && icons.default[state]) ||
	            (icons === null || icons === void 0 ? void 0 : icons.default));
	};
	var getActionIcon = function (action) { return actionIcons[action]; };
	var getEntityIcon = function (entity) {
	    var _a, _b;
	    var domain = entity.entity_id.split(".")[0];
	    return (
	    // device_class based
	    (entity.attributes.device_class &&
	        getIconInner((_a = icons[domain]) === null || _a === void 0 ? void 0 : _a[entity.attributes.device_class], entity.state)) ||
	        getIconInner((_b = icons[domain]) === null || _b === void 0 ? void 0 : _b.default, entity.state) ||
	        // state based
	        getIconInner(icons[domain], entity.state) ||
	        // domain based
	        (isString(icons[domain]) && icons[domain]));
	};

	var refreshInterval = 60 * 1000;
	var actionTimeout = 3 * 1000;
	var BasicDashboardEntity = /** @class */ (function () {
	    function BasicDashboardEntity(dashboard, config) {
	        var _this = this;
	        var _a;
	        this.refresh = errorWrapper(function () {
	            var _a, _b;
	            _this.dashboard.request("GET", "/api/states/" + (((_a = _this.entity) === null || _a === void 0 ? void 0 : _a.entity_id) || ((_b = _this.config) === null || _b === void 0 ? void 0 : _b.entity_id)), undefined, errorWrapper(function (response) { return _this.update(JSON.parse(response)); }));
	            _this.refreshToken = setTimeout(_this.refresh, _this.dashboard.config.refresh || refreshInterval);
	        });
	        this.update = errorWrapper(function (entity) {
	            _this.entity = entity;
	            _this.render();
	        });
	        this.render = errorWrapper(function () {
	            var _a, _b, _c, _d;
	            if (!_this.element)
	                clearTimeout(_this.refreshToken);
	            if (!_this.entity)
	                return;
	            _this.element.id = _this.entity.entity_id;
	            _this.element.innerHTML = "";
	            // name
	            var name = _this.element.appendChild(document.createElement("div"));
	            name.className = "name";
	            name.appendChild(document.createTextNode(((_a = _this.config) === null || _a === void 0 ? void 0 : _a.name) ||
	                ((_b = _this.entity.attributes) === null || _b === void 0 ? void 0 : _b.friendly_name) ||
	                _this.entity.entity_id));
	            // state
	            var icon = getEntityIcon(_this.entity);
	            var wrapper = _this.element.appendChild(document.createElement("div"));
	            wrapper.className = "state";
	            // attribute
	            if ((_c = _this.config) === null || _c === void 0 ? void 0 : _c.attribute) {
	                (Array.isArray(_this.config.attribute)
	                    ? _this.config.attribute
	                    : [_this.config.attribute]).forEach(function (attr) { return _this.renderState(wrapper, attr); });
	            }
	            // icon
	            else if (icon) {
	                wrapper.setAttribute("title", _this.entity.state);
	                var svg = wrapper.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
	                svg.setAttribute("viewBox", iconViewbox);
	                svg
	                    .appendChild(document.createElementNS(svg.namespaceURI, "path"))
	                    .setAttribute("d", icon);
	            }
	            // state
	            else {
	                _this.renderState(wrapper);
	            }
	            // clickable
	            if ((_d = _this.config) === null || _d === void 0 ? void 0 : _d.service) {
	                _this.element.className += " action";
	                _this.element.addEventListener("click", _this.onClick);
	            }
	        });
	        this.renderState = errorWrapper(function (parent, attr) {
	            var _a;
	            var elem = parent.appendChild(document.createElement("span"));
	            function inner(state, unit) {
	                elem.appendChild(document.createTextNode(state));
	                if (unit) {
	                    elem.appendChild(document.createTextNode(unit));
	                }
	            }
	            attr
	                ? inner(_this.entity.attributes[attr], ((_a = _this.config) === null || _a === void 0 ? void 0 : _a.unit_of_measurement) ||
	                    _this.entity.attributes[attr + "_unit"])
	                : inner(_this.entity.state, _this.entity.attributes.unit_of_measurement);
	            parent.appendChild(document.createTextNode(" "));
	        });
	        this.actionFeedback = errorWrapper(function (action) {
	            setTimeout(_this.refresh, actionTimeout);
	            var icon = getActionIcon(action);
	            if (!icon)
	                return;
	            var svg = _this.element.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
	            svg.setAttribute("class", "action");
	            svg.setAttribute("viewBox", iconViewbox);
	            svg
	                .appendChild(document.createElementNS(svg.namespaceURI, "path"))
	                .setAttribute("d", icon);
	        });
	        this.onClick = errorWrapper(function (event) {
	            var _a, _b, _c;
	            event.stopPropagation();
	            _this.dashboard.request("POST", "/api/services/" + ((_b = (_a = _this.config) === null || _a === void 0 ? void 0 : _a.service) === null || _b === void 0 ? void 0 : _b.replace(".", "/")), JSON.stringify((_c = _this.config) === null || _c === void 0 ? void 0 : _c.service_data), function () { return _this.actionFeedback("success"); }, function () { return _this.actionFeedback("failure"); });
	        });
	        this.dashboard = dashboard;
	        this.config = config;
	        this.element = this.dashboard.elEntities.appendChild(document.createElement("div"));
	        this.element.className = "box entity";
	        this.element.id = (_a = this.config) === null || _a === void 0 ? void 0 : _a.entity_id;
	    }
	    return BasicDashboardEntity;
	}());

	var requestTimout = 5 * 1000;
	var BasicDashboard = /** @class */ (function () {
	    function BasicDashboard() {
	        var _this = this;
	        var _a, _b, _c;
	        this.switchFloor = errorWrapper(function (floor) {
	            _this.elEntities.innerHTML = "";
	            _this.floor = floor;
	            var floorConfig = _this.config.floors[_this.floor];
	            if (Array.isArray(floorConfig)) {
	                floorConfig.forEach(_this.createElement);
	            }
	            else {
	                _this.refresh();
	            }
	        });
	        this.refresh = errorWrapper(function () {
	            return _this.request("GET", "/api/states", undefined, errorWrapper(function (response) {
	                var floor = _this.config.floors[_this.floor];
	                // data
	                var entities = JSON.parse(response);
	                entities
	                    .filter(function (entity) {
	                    // nothing defined
	                    return floor === null ||
	                        // regex
	                        ((typeof floor === "string" || floor instanceof String) &&
	                            new RegExp(floor).test(entity.entity_id));
	                })
	                    .forEach(function (entity) {
	                    new BasicDashboardEntity(_this).update(entity);
	                });
	            }));
	        });
	        // https://developers.home-assistant.io/docs/api/rest/
	        this.request = errorWrapper(function (method, url, body, callback, errorCallback) {
	            var _a, _b;
	            var xhr = new XMLHttpRequest();
	            xhr.timeout = requestTimout;
	            xhr.open(method, (((_a = _this.config) === null || _a === void 0 ? void 0 : _a.base) || "") + url);
	            xhr.setRequestHeader("Authorization", "Bearer " + ((_b = _this.config) === null || _b === void 0 ? void 0 : _b.token));
	            xhr.onreadystatechange = function () {
	                if (xhr.readyState == 4 /* XMLHttpRequest.DONE */) {
	                    // date
	                    _this.elStatus.innerHTML = new Date().toLocaleTimeString(undefined, {
	                        // @ts-ignore:next-line
	                        timeStyle: "medium",
	                    });
	                    switch (xhr.status) {
	                        case 200:
	                            callback && callback(xhr.responseText);
	                            break;
	                        default:
	                            xhr.dispatchEvent(new Event("error"));
	                    }
	                }
	            };
	            xhr.addEventListener("error", function () {
	                errorCallback && errorCallback(xhr);
	                console.error(xhr.responseText);
	            });
	            xhr.send(body);
	        });
	        this.createElement = function (config) {
	            if ("entity_id" in config) {
	                new BasicDashboardEntity(_this, config).refresh();
	            }
	            else if ("action" in config) {
	                new BasicDashboardAction(_this, config).refresh();
	            }
	            else {
	                console.log("unknown config entry");
	            }
	        };
	        this.throwException = function (reason) {
	            throw new Error(reason);
	        };
	        // containers
	        var elFloors = (_a = document.getElementById("floors")) !== null && _a !== void 0 ? _a : this.throwException("unable to find floors element");
	        this.elEntities =
	            (_b = document.getElementById("entities")) !== null && _b !== void 0 ? _b : this.throwException("unable to find entities element");
	        this.elStatus =
	            (_c = document.getElementById("status")) !== null && _c !== void 0 ? _c : this.throwException("unable to find status element");
	        // config
	        this.request("GET", "config.json", undefined, errorWrapper(function (response) {
	            _this.config = JSON.parse(response);
	            Object.keys(_this.config.floors || []).map(function (floor) {
	                var elem = elFloors.appendChild(document.createElement("div"));
	                elem.appendChild(document.createTextNode(floor));
	                elem.className = "box floor action";
	                elem.addEventListener("click", function () { return _this.switchFloor(floor); });
	            });
	            _this.switchFloor(Object.keys(_this.config.floors || [])[0]);
	        }));
	    }
	    return BasicDashboard;
	}());

	addEventListener("error", errorHandler);
	addEventListener("load", errorWrapper(function () { return new BasicDashboard(); }));

})();
//# sourceMappingURL=index.js.map
