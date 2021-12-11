(function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    /**
     * @this {Promise}
     */
    function finallyConstructor(callback) {
      var constructor = this.constructor;
      return this.then(
        function(value) {
          // @ts-ignore
          return constructor.resolve(callback()).then(function() {
            return value;
          });
        },
        function(reason) {
          // @ts-ignore
          return constructor.resolve(callback()).then(function() {
            // @ts-ignore
            return constructor.reject(reason);
          });
        }
      );
    }

    // Store setTimeout reference so promise-polyfill will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var setTimeoutFunc = setTimeout;

    function isArray(x) {
      return Boolean(x && typeof x.length !== 'undefined');
    }

    function noop() {}

    // Polyfill for Function.prototype.bind
    function bind(fn, thisArg) {
      return function() {
        fn.apply(thisArg, arguments);
      };
    }

    /**
     * @constructor
     * @param {Function} fn
     */
    function Promise$1(fn) {
      if (!(this instanceof Promise$1))
        throw new TypeError('Promises must be constructed via new');
      if (typeof fn !== 'function') throw new TypeError('not a function');
      /** @type {!number} */
      this._state = 0;
      /** @type {!boolean} */
      this._handled = false;
      /** @type {Promise|undefined} */
      this._value = undefined;
      /** @type {!Array<!Function>} */
      this._deferreds = [];

      doResolve(fn, this);
    }

    function handle(self, deferred) {
      while (self._state === 3) {
        self = self._value;
      }
      if (self._state === 0) {
        self._deferreds.push(deferred);
        return;
      }
      self._handled = true;
      Promise$1._immediateFn(function() {
        var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
        if (cb === null) {
          (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
          return;
        }
        var ret;
        try {
          ret = cb(self._value);
        } catch (e) {
          reject(deferred.promise, e);
          return;
        }
        resolve(deferred.promise, ret);
      });
    }

    function resolve(self, newValue) {
      try {
        // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
        if (newValue === self)
          throw new TypeError('A promise cannot be resolved with itself.');
        if (
          newValue &&
          (typeof newValue === 'object' || typeof newValue === 'function')
        ) {
          var then = newValue.then;
          if (newValue instanceof Promise$1) {
            self._state = 3;
            self._value = newValue;
            finale(self);
            return;
          } else if (typeof then === 'function') {
            doResolve(bind(then, newValue), self);
            return;
          }
        }
        self._state = 1;
        self._value = newValue;
        finale(self);
      } catch (e) {
        reject(self, e);
      }
    }

    function reject(self, newValue) {
      self._state = 2;
      self._value = newValue;
      finale(self);
    }

    function finale(self) {
      if (self._state === 2 && self._deferreds.length === 0) {
        Promise$1._immediateFn(function() {
          if (!self._handled) {
            Promise$1._unhandledRejectionFn(self._value);
          }
        });
      }

      for (var i = 0, len = self._deferreds.length; i < len; i++) {
        handle(self, self._deferreds[i]);
      }
      self._deferreds = null;
    }

    /**
     * @constructor
     */
    function Handler(onFulfilled, onRejected, promise) {
      this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
      this.onRejected = typeof onRejected === 'function' ? onRejected : null;
      this.promise = promise;
    }

    /**
     * Take a potentially misbehaving resolver function and make sure
     * onFulfilled and onRejected are only called once.
     *
     * Makes no guarantees about asynchrony.
     */
    function doResolve(fn, self) {
      var done = false;
      try {
        fn(
          function(value) {
            if (done) return;
            done = true;
            resolve(self, value);
          },
          function(reason) {
            if (done) return;
            done = true;
            reject(self, reason);
          }
        );
      } catch (ex) {
        if (done) return;
        done = true;
        reject(self, ex);
      }
    }

    Promise$1.prototype['catch'] = function(onRejected) {
      return this.then(null, onRejected);
    };

    Promise$1.prototype.then = function(onFulfilled, onRejected) {
      // @ts-ignore
      var prom = new this.constructor(noop);

      handle(this, new Handler(onFulfilled, onRejected, prom));
      return prom;
    };

    Promise$1.prototype['finally'] = finallyConstructor;

    Promise$1.all = function(arr) {
      return new Promise$1(function(resolve, reject) {
        if (!isArray(arr)) {
          return reject(new TypeError('Promise.all accepts an array'));
        }

        var args = Array.prototype.slice.call(arr);
        if (args.length === 0) return resolve([]);
        var remaining = args.length;

        function res(i, val) {
          try {
            if (val && (typeof val === 'object' || typeof val === 'function')) {
              var then = val.then;
              if (typeof then === 'function') {
                then.call(
                  val,
                  function(val) {
                    res(i, val);
                  },
                  reject
                );
                return;
              }
            }
            args[i] = val;
            if (--remaining === 0) {
              resolve(args);
            }
          } catch (ex) {
            reject(ex);
          }
        }

        for (var i = 0; i < args.length; i++) {
          res(i, args[i]);
        }
      });
    };

    Promise$1.resolve = function(value) {
      if (value && typeof value === 'object' && value.constructor === Promise$1) {
        return value;
      }

      return new Promise$1(function(resolve) {
        resolve(value);
      });
    };

    Promise$1.reject = function(value) {
      return new Promise$1(function(resolve, reject) {
        reject(value);
      });
    };

    Promise$1.race = function(arr) {
      return new Promise$1(function(resolve, reject) {
        if (!isArray(arr)) {
          return reject(new TypeError('Promise.race accepts an array'));
        }

        for (var i = 0, len = arr.length; i < len; i++) {
          Promise$1.resolve(arr[i]).then(resolve, reject);
        }
      });
    };

    // Use polyfill for setImmediate for performance gains
    Promise$1._immediateFn =
      // @ts-ignore
      (typeof setImmediate === 'function' &&
        function(fn) {
          // @ts-ignore
          setImmediate(fn);
        }) ||
      function(fn) {
        setTimeoutFunc(fn, 0);
      };

    Promise$1._unhandledRejectionFn = function _unhandledRejectionFn(err) {
      if (typeof console !== 'undefined' && console) {
        console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
      }
    };

    var Polyfill = /** @class */ (function () {
        function Polyfill() {
        }
        Polyfill.prototype.initPolyfill = function () {
            this.initArrayIncludesPolyfill();
            this.initObjectAssignPolyfill();
            this.initArrayFillPolyfill();
            this.initClosestPolyfill();
            this.initIncludesPolyfill();
            this.initEndsWithPoly();
            this.initCustomEventPolyfill();
            this.promisesPolyfil();
        };
        Polyfill.prototype.initArrayIncludesPolyfill = function () {
            var _this = this;
            if (!Array.prototype.includes) {
                Object.defineProperty(Array.prototype, 'includes', {
                    value: function (searchElement) {
                        var args = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            args[_i - 1] = arguments[_i];
                        }
                        if (_this == null) {
                            throw new TypeError('Array.prototype.includes called on null or undefined');
                        }
                        var O = Object(_this);
                        var len = parseInt(O.length, 10) || 0;
                        if (len === 0) {
                            return false;
                        }
                        var n = args[1] || 0;
                        var k;
                        if (n >= 0) {
                            k = n;
                        }
                        else {
                            k = len + n;
                            if (k < 0) {
                                k = 0;
                            }
                        }
                        var currentElement;
                        while (k < len) {
                            currentElement = O[k];
                            if (searchElement === currentElement ||
                                (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
                                return true;
                            }
                            k++;
                        }
                        return false;
                    },
                    writable: true,
                    configurable: true,
                });
            }
        };
        Polyfill.prototype.initEndsWithPoly = function () {
            if (!String.prototype.endsWith) {
                Object.defineProperty(String.prototype, 'endsWith', {
                    value: function (search, this_len) {
                        if (this_len === undefined || this_len > this.length) {
                            this_len = this.length;
                        }
                        return this.substring(this_len - search.length, this_len) === search;
                    },
                    writable: true,
                    configurable: true
                });
            }
        };
        Polyfill.prototype.initClosestPolyfill = function () {
            if (!Element.prototype.matches) {
                Element.prototype.matches = Element.prototype.msMatchesSelector ||
                    Element.prototype.webkitMatchesSelector;
            }
            if (!Element.prototype.closest) {
                Object.defineProperty(Element.prototype, 'closest', {
                    value: function (s) {
                        var el = this;
                        do {
                            if (el.matches(s)) {
                                return el;
                            }
                            el = el.parentElement || el.parentNode;
                        } while (el !== null && el.nodeType === 1);
                        return null;
                    },
                    writable: true,
                    configurable: true
                });
            }
        };
        Polyfill.prototype.initIncludesPolyfill = function () {
            if (!String.prototype.includes) {
                Object.defineProperty(String.prototype, 'includes', {
                    value: function (search, start) {
                        if (typeof start !== 'number') {
                            start = 0;
                        }
                        if (start + search.length > this.length) {
                            return false;
                        }
                        else {
                            return this.indexOf(search, start) !== -1;
                        }
                    },
                    writable: true,
                    configurable: true
                });
            }
        };
        Polyfill.prototype.initObjectAssignPolyfill = function () {
            if (typeof Object.assign !== 'function') {
                // Must be writable: true, enumerable: false, configurable: true
                Object.defineProperty(Object, 'assign', {
                    value: function assign(target, varArgs) {
                        if (target == null) {
                            // TypeError if undefined or null
                            throw new TypeError('Cannot convert undefined or null to object');
                        }
                        var to = Object(target);
                        for (var index = 1; index < arguments.length; index++) {
                            var nextSource = arguments[index];
                            if (nextSource != null) {
                                // Skip over if undefined or null
                                for (var nextKey in nextSource) {
                                    // Avoid bugs when hasOwnProperty is shadowed
                                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                        to[nextKey] = nextSource[nextKey];
                                    }
                                }
                            }
                        }
                        return to;
                    },
                    writable: true,
                    configurable: true
                });
            }
        };
        Polyfill.prototype.initArrayFillPolyfill = function () {
            if (!Array.prototype.fill) {
                Object.defineProperty(Array.prototype, 'fill', {
                    value: function (value) {
                        // Steps 1-2.
                        if (this == null) {
                            throw new TypeError('this is null or not defined');
                        }
                        var O = Object(this);
                        // Steps 3-5.
                        var len = O.length >>> 0;
                        // Steps 6-7.
                        var start = arguments[1];
                        var relativeStart = start >> 0;
                        // Step 8.
                        var k = relativeStart < 0
                            ? Math.max(len + relativeStart, 0)
                            : Math.min(relativeStart, len);
                        // Steps 9-10.
                        var end = arguments[2];
                        var relativeEnd = end === undefined ? len : end >> 0;
                        // Step 11.
                        var finalVal = relativeEnd < 0
                            ? Math.max(len + relativeEnd, 0)
                            : Math.min(relativeEnd, len);
                        // Step 12.
                        while (k < finalVal) {
                            O[k] = value;
                            k++;
                        }
                        // Step 13.
                        return O;
                    }
                });
            }
        };
        // CustomEvent polyfill
        // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
        Polyfill.prototype.initCustomEventPolyfill = function () {
            if (typeof window.CustomEvent === 'function') {
                return false;
            } // If CustomEvent supported return
            function CustomEvent(event, params) {
                params = params || {
                    bubbles: false,
                    cancelable: false,
                    detail: undefined
                };
                var evt = document.createEvent('CustomEvent');
                evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                return evt;
            }
            CustomEvent.prototype = window.Event.prototype;
            window.CustomEvent = CustomEvent;
        };
        Polyfill.prototype.insertViewPortTag = function () {
            var viewport = document.querySelector('meta[name="viewport"]');
            var meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1';
            if (!viewport) {
                document.head.appendChild(meta);
            }
        };
        Polyfill.prototype.promisesPolyfil = function () {
            if (typeof Promise === 'undefined') {
                window.Promise = Promise$1;
            }
        };
        return Polyfill;
    }());
    var polyfill = new Polyfill();

    var ModuleInitializer = /** @class */ (function () {
        function ModuleInitializer() {
        }
        return ModuleInitializer;
    }());
    var moduleInitializer = new ModuleInitializer();

    var ModuleHelper = /** @class */ (function () {
        function ModuleHelper() {
        }
        ModuleHelper.prototype.convertKeyValueLowerCase = function (keyValueObject) {
            // tslint:disable-next-line: forin
            for (var i in keyValueObject) {
                if (!keyValueObject[i.toLowerCase()]) {
                    keyValueObject[i.toLowerCase()] = keyValueObject[i].toLowerCase();
                    delete keyValueObject[i];
                }
            }
            return keyValueObject;
        };
        ModuleHelper.prototype.getValidUrl = function (url) {
            if (!url) {
                return;
            }
            var urlWithHttpRegex = /^(http)s?:\/\//i;
            // http(s)://domain.com
            var protocolRelativeUrlRegex = /^:\/\//; // ://domain.com
            if (url.match(protocolRelativeUrlRegex)) {
                return 'http' + url;
            }
            else if (!url.match(urlWithHttpRegex)) {
                return 'http://' + url;
            }
            else {
                return url;
            }
        };
        ModuleHelper.prototype.hexToRgb = function (hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                }
                : null;
        };
        // Returns comma delimited string from array
        ModuleHelper.prototype.serialiseArrayToString = function (cookieGroupsArray) {
            return cookieGroupsArray.toString();
        };
        // Returns array from comma delimited string
        ModuleHelper.prototype.deserialiseStringToArray = function (cookieGroupsString) {
            if (!cookieGroupsString) {
                return [];
            }
            return cookieGroupsString.split(',');
        };
        /* JS Helper functions start */
        ModuleHelper.prototype.empty = function (id) {
            var elem = document.getElementById(id);
            if (elem) {
                while (elem.hasChildNodes()) {
                    elem.removeChild(elem.lastChild);
                }
            }
        };
        ModuleHelper.prototype.show = function (id) {
            var elem = document.getElementById(id);
            if (elem) {
                elem.style.display = 'block';
            }
        };
        ModuleHelper.prototype.remove = function (id) {
            var elem = document.getElementById(id);
            if (elem && elem.parentNode) {
                elem.parentNode.removeChild(elem);
            }
        };
        ModuleHelper.prototype.appendTo = function (id, element) {
            var elem = document.getElementById(id);
            var div;
            if (elem) {
                div = document.createElement('div');
                div.innerHTML = element;
                elem.appendChild(div);
            }
        };
        ModuleHelper.prototype.contains = function (array, item) {
            var i;
            for (i = 0; i < array.length; i += 1) {
                if (array[i].toString().toLowerCase() === item.toString().toLowerCase()) {
                    return true;
                }
            }
            return false;
        };
        ModuleHelper.prototype.indexOf = function (array, item) {
            var i;
            for (i = 0; i < array.length; i += 1) {
                if (array[i] === item) {
                    return i;
                }
            }
            return -1;
        };
        ModuleHelper.prototype.endsWith = function (str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        };
        ModuleHelper.prototype.param = function (obj) {
            var str = '';
            var key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (str !== '') {
                        str += '&';
                    }
                    str += key + '=' + encodeURIComponent(obj[key]).replace(/%20/g, '+');
                }
            }
            return str;
        };
        ModuleHelper.prototype.generateUUID = function () {
            var d = new Date().getTime();
            if (typeof performance !== 'undefined' &&
                typeof performance.now === 'function') {
                d += performance.now(); // use high-precision timer if available
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
            });
        };
        ModuleHelper.prototype.convertIABVendorPurposeArrayToObject = function (IabData) {
            var result = {};
            IabData.map(function (item) {
                var data = item.split(':');
                result[parseInt(data[0])] = data[1] === 'true';
            });
            return result;
        };
        ModuleHelper.prototype.getActiveIdArray = function (arrayData) {
            return arrayData
                .filter(function (item) {
                return item.split(':')[1] === 'true';
            })
                .map(function (item1) {
                return parseInt(item1.split(':')[0]);
            });
        };
        ModuleHelper.prototype.distinctArray = function (arrayData) {
            var result = new Array();
            arrayData.forEach(function (item) {
                if (result.indexOf(item) < 0) {
                    result.push(item);
                }
            });
            return result;
        };
        ModuleHelper.prototype.getIdArray = function (keyValueArray) {
            return keyValueArray.map(function (item) {
                return parseInt(item.split(':')[0]);
            });
        };
        /* JS Helper functions end */
        ModuleHelper.prototype.getURL = function (href) {
            var l = document.createElement('a');
            l.href = href;
            return l;
        };
        ModuleHelper.prototype.removeURLPrefixes = function (url) {
            return url
                .toLowerCase()
                .replace(/(^\w+:|^)\/\//, '')
                .replace('www.', '');
        };
        ModuleHelper.prototype.getFilteredVenderList = function (vendors, param) {
            vendors = vendors.filter(function (vendor) {
                var res = parseInt(vendor.split(':')[0]);
                return this.indexOf(res) > -1;
            }, param);
            var vendorsWithNoConsent = param.filter(function (vendor) {
                var res = vendor + ':true';
                return this.indexOf(res) <= -1;
            }, vendors);
            vendorsWithNoConsent.forEach(function (vendor) {
                vendors.push(vendor + ':false');
            });
            return vendors;
        };
        ModuleHelper.prototype.removeChild = function (ele) {
            if (ele) {
                if (ele instanceof NodeList) {
                    for (var i = 0; i < ele.length; i++) {
                        ele[i].parentElement.removeChild(ele[i]);
                    }
                }
                else {
                    ele.parentElement.removeChild(ele);
                }
            }
        };
        ModuleHelper.prototype.getRelativeURL = function (url, isoffline) {
            if (isoffline) {
                return "./" + url.replace(/^(http|https):\/\//, '').split('/').slice(1).join('/').replace('.json', '') + ".js";
            }
            else {
                return url;
            }
        };
        ModuleHelper.prototype.setCheckedAttribute = function (selector, element, checked) {
            if (selector) {
                element = document.querySelector(selector);
            }
            if (element) {
                element.checked = checked;
                element.setAttribute('aria-checked', checked.toString());
                element.setAttribute('checked', checked.toString());
            }
        };
        return ModuleHelper;
    }());
    var moduleHelper = new ModuleHelper();

    var GROUP_TYPES = {
        'BUNDLE': 'BRANCH',
        'COOKIE': 'COOKIE',
        'IAB1_PURPOSE': 'IAB',
        'IAB2_FEATURE': 'IAB2_FEATURE',
        'IAB2_PURPOSE': 'IAB2_PURPOSE',
        'IAB2_SPL_FEATURE': 'IAB2_SPL_FEATURE',
        'IAB2_SPL_PURPOSE': 'IAB2_SPL_PURPOSE',
        'IAB2_STACK': 'IAB2_STACK',
    };
    var IAB_GROUP_TYPES = ['IAB', 'IAB2_PURPOSE', 'IAB2_STACK', 'IAB2_FEATURE', 'IAB2_SPL_PURPOSE', 'IAB2_SPL_FEATURE'];
    var CONSENTABLE_GROUPS = ['COOKIE', 'BRANCH', 'IAB2_STACK'];
    var CONSENTABLE_IAB_GROUPS = ['IAB', 'IAB2_PURPOSE', 'IAB2_SPL_FEATURE'];
    var NON_CONSENTABLE_GROUPS = ['IAB2_FEATURE', 'IAB2_SPL_PURPOSE'];
    var IAB2_GROUPS_WITH_LEGAL_TEXT = ['IAB2_PURPOSE', 'IAB2_SPL_PURPOSE', 'IAB2_FEATURE', 'IAB2_SPL_FEATURE'];

    var GroupsHelper = /** @class */ (function () {
        function GroupsHelper() {
        }
        GroupsHelper.prototype.getGroupIdForCookie = function (group) {
            if (group.CustomGroupId) {
                return group.CustomGroupId;
                // TODO check to make sure this isnt a bug- type says OptanonGroupId should be string
            }
            else if (group.OptanonGroupId === 0) {
                return '0_' + group.GroupId;
            }
            else {
                return group.OptanonGroupId;
            }
        };
        /**
         * ShowInPopup -  is mapped to hideIABGroup
         * IAB enabled
         * If gorup has cookies
         * Sub groups should have cookies (only if group is parent group)
         */
        GroupsHelper.prototype.isValidConsentNoticeGroup = function (group, isIABEnabled) {
            var _this = this;
            if (!group.ShowInPopup) {
                return false;
            }
            var groupHasCookies = group.FirstPartyCookies.length || group.Hosts.length;
            // does current group have visible sub groups with cookies or is a subgroup with cookies
            var hasValidSubGroupsWithCookies = false;
            var hasValidSubGroupWithHosts = false;
            var isValidIabBundle = false;
            if (this.isTopLevelGroup(group)) {
                if (group.SubGroups.length) {
                    // Check for valid sub group with cookies
                    hasValidSubGroupsWithCookies = group.SubGroups.some(function (subGroup) {
                        return _this.safeGroupName(subGroup) &&
                            subGroup.ShowInPopup &&
                            subGroup.FirstPartyCookies.length;
                    });
                    // Check for valid sub group with hosts
                    hasValidSubGroupWithHosts = group.SubGroups.some(function (subGroup) {
                        return _this.safeGroupName(subGroup) &&
                            subGroup.ShowInPopup &&
                            subGroup.Hosts.length;
                    });
                    // Check if all sub groups are iab and parent is iab bundle group
                    // TODO: can check for type(branch) after BE change
                    if (isIABEnabled &&
                        (!group.FirstPartyCookies.length || !group.Hosts.length)) {
                        isValidIabBundle = !group.SubGroups.some(function (subGroup) { return IAB_GROUP_TYPES.indexOf(subGroup.Type) === -1; });
                    }
                }
                var groupHasIABSubGroup = group.SubGroups.some(function (subGroup) { return IAB_GROUP_TYPES.indexOf(subGroup.Type) > -1; });
                if (IAB_GROUP_TYPES.indexOf(group.Type) > -1 || groupHasIABSubGroup) {
                    group.ShowVendorList = true;
                }
                if (group.Hosts.length || hasValidSubGroupWithHosts || hasValidSubGroupsWithCookies) {
                    group.ShowHostList = true;
                }
            }
            return (groupHasCookies ||
                IAB_GROUP_TYPES.indexOf(group.Type) > -1 ||
                hasValidSubGroupsWithCookies ||
                hasValidSubGroupWithHosts ||
                isValidIabBundle);
        };
        GroupsHelper.prototype.isTopLevelGroup = function (group) {
            return group && !group.Parent;
        };
        GroupsHelper.prototype.safeGroupName = function (group) {
            if (group && group.GroupName) {
                return group.GroupName;
            }
            return '';
        };
        return GroupsHelper;
    }());
    var groupsHelper = new GroupsHelper();

    var LanguageSwitcher = /** @class */ (function () {
        function LanguageSwitcher() {
        }
        LanguageSwitcher.prototype.setUseDocumentLanguage = function (isDocumentLanguage) {
            this.useDocumentLanguage = isDocumentLanguage;
        };
        LanguageSwitcher.prototype.getLanguageSwitcherScriptElement = function (partialScriptUrl) {
            var script = document.querySelector("script[src*='" + partialScriptUrl + "']");
            return script;
        };
        return LanguageSwitcher;
    }());
    var languageSwitcher = new LanguageSwitcher();

    var CONSENT_MODEL = {
        OPT_IN: 'opt-in',
        OPT_OUT: 'opt-out',
        IMPLIED_CONSENT: 'implied-consent',
        NOTICE_ONLY: 'notice-only',
    };

    var BannerCloseSource;
    (function (BannerCloseSource) {
        BannerCloseSource[BannerCloseSource["Unknown"] = 0] = "Unknown";
        BannerCloseSource[BannerCloseSource["BannerCloseButton"] = 1] = "BannerCloseButton";
        BannerCloseSource[BannerCloseSource["ConfirmChoiceButton"] = 2] = "ConfirmChoiceButton";
        BannerCloseSource[BannerCloseSource["AcceptAll"] = 3] = "AcceptAll";
        BannerCloseSource[BannerCloseSource["RejectAll"] = 4] = "RejectAll";
    })(BannerCloseSource || (BannerCloseSource = {}));
    var ConsentGroupType;
    (function (ConsentGroupType) {
        ConsentGroupType[ConsentGroupType["Purpose"] = 1] = "Purpose";
        ConsentGroupType[ConsentGroupType["SpecialFeature"] = 2] = "SpecialFeature";
    })(ConsentGroupType || (ConsentGroupType = {}));

    /**
     * *********
     * Every file depends on this file.
     * Thus it's crucial that we avoid this file depending on other major files to avoid circular dependencies.
     * Keep this in mind when adding any new imports.
     * Sanity Check: does the new file import externalData? Does it import files that import externalData?
     * If so, it won't work.
     * *********
     */
    var ExternalData = /** @class */ (function () {
        function ExternalData() {
            this.otCookieData = (window.OneTrust && window.OneTrust.otCookieData) || [];
            this.userLocation = {
                country: '',
                state: ''
            };
            this.iabGroups = {
                purposes: {},
                legIntPurposes: {},
                specialPurposes: {},
                features: {},
                specialFeatures: {}
            };
            this.stubFileName = 'otSDKStub';
            this.defaultLang = 'EN'; // As per the IAB 2.0
            this.initData();
        }
        ExternalData.prototype.setbannerDataParentURL = function (url) {
            this.bannerDataParentURL = url;
        };
        ExternalData.prototype.setDefaultCookiesData = function () {
            // set geolocation flag
            this.setGeolocationInCookies();
            // set 3rd Party consent flag to false if IAB is not enabled, skip if param not present
            this.setOrUpdate3rdPartyIABConsentFlag();
        };
        ExternalData.prototype.initializeBannerVariables = function (bannerData) {
            return __awaiter(this, void 0, void 0, function () {
                var domainData, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            domainData = bannerData.DomainData;
                            this.iabType = domainData.IabType;
                            // Update the cookie names based on the template type
                            if (domainData.IabType === 'IAB2') {
                                this.BannerVariables.oneTrustIABCookieName = 'eupubconsent-v2';
                                this.BannerVariables.oneTrustIAB3rdPartyCookieName = 'euconsent-v2';
                            }
                            this.setPublicDomainData(JSON.parse(JSON.stringify(domainData))); // Set data for Public API
                            this.domainDataMapper(domainData);
                            this.commonDataMapper(bannerData);
                            this.setDefaultCookiesData();
                            if (!this.BannerVariables.domainData.IsIabEnabled) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.loadCMP()];
                        case 1:
                            _b.sent();
                            this.setIABModuleData(); // Copying IAB lib's global scope reference to OT scope
                            this.setIabData();
                            if (!!this.isIABCrossConsentEnabled()) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.iabTypeIsChanged()];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            if (!
                            // get IAB data from blob
                            (this.iabType === 'IAB')) 
                            // get IAB data from blob
                            return [3 /*break*/, 5];
                            return [4 /*yield*/, this.populateVendorListCMP()];
                        case 4:
                            _a = _b.sent();
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, this.populateVendorListTCF()];
                        case 6:
                            _a = _b.sent();
                            _b.label = 7;
                        case 7:
                            this.populateIABCookies();
                            _b.label = 8;
                        case 8:
                            if (this.BannerVariables.domainData.IsConsentLoggingEnabled) {
                                this.setConsentData();
                            }
                            this.setAboutCookieName();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ExternalData.prototype.removeInActiveVendorsForTcf = function (gvl) {
            var _this = this;
            Object.keys(gvl.vendors).forEach(function (vendorId) {
                if (_this.BannerVariables.domainData.Vendors.indexOf(Number(vendorId)) > -1) {
                    delete gvl.vendors[vendorId];
                }
            });
        };
        ExternalData.prototype.populateVendorListTCF = function (initializeVendor) {
            if (initializeVendor === void 0) { initializeVendor = false; }
            return __awaiter(this, void 0, void 0, function () {
                var tcfSDKReference, iabData, vendorlistUrl, gvl, _a, _b, _c, _d, cloneModel;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            tcfSDKReference = this.iabStringSDK();
                            iabData = this.BannerVariables.iabData;
                            vendorlistUrl = this.updateCorrectIABUrl(iabData.globalVendorListUrl);
                            if (!!this.checkMobileOfflineRequest(this.getBannerVersionUrl())) return [3 /*break*/, 1];
                            this.BannerVariables.mobileOnlineURL.push(vendorlistUrl); // Iab json url
                            if (this.BannerVariables.iabData.consentLanguage !== this.defaultLang) { // Translations url 
                                this.BannerVariables.mobileOnlineURL.push(vendorlistUrl.slice(0, vendorlistUrl.lastIndexOf('/')));
                            }
                            gvl = tcfSDKReference.gvl(vendorlistUrl, 'LATEST');
                            return [3 /*break*/, 3];
                        case 1:
                            _b = (_a = tcfSDKReference).gvl;
                            _c = [null];
                            return [4 /*yield*/, this.otFetchOfflineFile(moduleHelper.getRelativeURL(vendorlistUrl, true))];
                        case 2:
                            gvl = _b.apply(_a, _c.concat([_e.sent()]));
                            _e.label = 3;
                        case 3: return [4 /*yield*/, gvl.readyPromise];
                        case 4:
                            _e.sent(); // wait for gvl ready promise
                            // Remove de-activated vendors from list when EU not enabled
                            if (!this.BannerVariables.domainData.IsIabThirdPartyCookieEnabled) {
                                this.removeInActiveVendorsForTcf(gvl);
                            }
                            this.BannerVariables.oneTrustIABConsent.vendorList = gvl;
                            this.assignIABDataWithGlobalVendorList(gvl); // Transforming data for UI
                            _d = this;
                            return [4 /*yield*/, tcfSDKReference.tcModel(gvl)];
                        case 5:
                            _d.tcModel = _e.sent(); // Tcmodel instance
                            // Initializing these values when it's not available from gvl
                            this.tcModel.cmpId = parseInt(this.BannerVariables.iabData.cmpId);
                            this.tcModel.cmpVersion = parseInt(this.BannerVariables.iabData.cmpVersion);
                            try {
                                this.tcModel.consentLanguage = this.BannerVariables.iabData.consentLanguage;
                            }
                            catch (_f) {
                                // TCF supported only in few languages so adding fallback value
                                this.tcModel.consentLanguage = 'EN';
                            }
                            this.tcModel.consentScreen = parseInt(this.BannerVariables.iabData.consentScreen);
                            this.tcModel.isServiceSpecific = false;
                            if (this.userLocation.country) {
                                this.tcModel.publisherCountryCode = this.userLocation.country;
                            }
                            this.cmpApi = tcfSDKReference.cmpApi(this.tcModel.cmpId, this.tcModel.cmpVersion); // Create cmpApi instance
                            if (!this.isAlertBoxClosedAndValid()) {
                                cloneModel = this.tcModel.clone();
                                cloneModel.unsetAll();
                                this.cmpApi.tcModel = cloneModel;
                            }
                            this.cmpApi.uiVisible = true;
                            if (initializeVendor) {
                                this.setIABVendor(this.BannerVariables.domainData.VendorConsentModel === CONSENT_MODEL.OPT_OUT);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        ExternalData.prototype.removeInActiveVendorsForCmp = function (gvl) {
            for (var index = 0; index < gvl.vendors.length; index++) {
                if (this.BannerVariables.domainData.Vendors.indexOf(Number(gvl.vendors[index].id)) > -1) {
                    gvl.vendors.splice(index, 1);
                    index--;
                }
            }
        };
        ExternalData.prototype.populateVendorListCMP = function (initializeVendor) {
            if (initializeVendor === void 0) { initializeVendor = false; }
            return __awaiter(this, void 0, void 0, function () {
                var iabData, vendorlistUrl, vendorlist;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            iabData = this.BannerVariables.iabData;
                            vendorlistUrl = this.updateCorrectIABUrl(iabData.globalVendorListUrl);
                            if (!this.checkMobileOfflineRequest(this.getBannerVersionUrl())) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.otFetchOfflineFile(moduleHelper.getRelativeURL(vendorlistUrl, true))];
                        case 1:
                            vendorlist = _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.otFetch(vendorlistUrl)];
                        case 3:
                            vendorlist = _a.sent();
                            _a.label = 4;
                        case 4:
                            if (vendorlist) {
                                // Remove de-activated vendors from list when EU not enabled
                                if (!this.BannerVariables.domainData.IsIabThirdPartyCookieEnabled) {
                                    this.removeInActiveVendorsForCmp(vendorlist);
                                }
                                this.BannerVariables.oneTrustIABConsent.vendorList = vendorlist;
                                this.assignIABDataWithGlobalVendorList(vendorlist);
                                if (initializeVendor) {
                                    this.setIABVendor(this.BannerVariables.domainData.VendorConsentModel === CONSENT_MODEL.OPT_OUT);
                                }
                            }
                            else {
                                throw new URIError();
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        ExternalData.prototype.setIABModuleData = function () {
            moduleInitializer.moduleInitializer.otIABModuleData = window.otIabModule;
        };
        ExternalData.prototype.loadCMP = function () {
            var _this = this;
            if (this.BannerVariables.domainData.IsIabEnabled) {
                if (this.iabType && this.iabType === 'IAB2') {
                    return new Promise(function (resolve) {
                        _this.jsonp(_this.getBannerVersionUrl() + "/otTCF.js", resolve, resolve);
                    });
                }
                else {
                    return new Promise(function (resolve) {
                        _this.jsonp(_this.getBannerVersionUrl() + "/otCMP.js", resolve, resolve);
                    });
                }
            }
        };
        ExternalData.prototype.jsonp = function (url, successCallBack, errorCallBack) {
            if (!this.checkMobileOfflineRequest(url)) {
                this.BannerVariables.mobileOnlineURL.push(url);
            }
            var script = document.createElement('script'), head = document.getElementsByTagName('head')[0];
            function success() {
                // Handle Success Here after jsonp call is fixed on server.
                successCallBack();
            }
            function error() {
                errorCallBack();
            }
            script.onreadystatechange = function () {
                if (this.readyState === 'loaded' ||
                    this.readyState === 'complete') {
                    success();
                }
            };
            script.onload = success;
            script.onerror = error;
            script.type = 'text/javascript';
            script.async = true;
            script.src = url;
            head.appendChild(script);
        };
        ExternalData.prototype.checkMobileOfflineRequest = function (url) {
            return (moduleInitializer.moduleInitializer.MobileSDK &&
                new RegExp('^file://', 'i').test(url));
        };
        ExternalData.prototype.commonDataMapper = function (bannerData) {
            var commonData = bannerData.CommonData;
            this.BannerVariables.commonData = {
                iabThirdPartyConsentUrl: commonData.IabThirdPartyCookieUrl,
                optanonHideAcceptButton: commonData.OptanonHideAcceptButton,
                optanonHideCookieSettingButton: commonData.OptanonHideCookieSettingButton,
                optanonStyle: commonData.OptanonStyle,
                optanonStaticContentLocation: commonData.OptanonStaticContentLocation,
                bannerCustomCSS: commonData.BannerCustomCSS.replace(/\\n/g, ''),
                pcCustomCSS: commonData.PCCustomCSS.replace(/\\n/g, ''),
                textColor: commonData.TextColor,
                buttonColor: commonData.ButtonColor,
                buttonTextColor: commonData.ButtonTextColor,
                backgroundColor: commonData.BackgroundColor,
                bannerAccordionBackgroundColor: commonData.BannerAccordionBackgroundColor,
                pcTextColor: commonData.PcTextColor,
                pcButtonColor: commonData.PcButtonColor,
                pcButtonTextColor: commonData.PcButtonTextColor,
                pcAccordionBackgroundColor: commonData.PcAccordionBackgroundColor,
                pcLinksTextColor: commonData.PcLinksTextColor,
                bannerLinksTextColor: commonData.BannerLinksTextColor,
                pcEnableToggles: commonData.PcEnableToggles,
                pcBackgroundColor: commonData.PcBackgroundColor,
                pcMenuColor: commonData.PcMenuColor,
                pcMenuHighLightColor: commonData.PcMenuHighLightColor,
                legacyBannerLayout: commonData.LegacyBannerLayout,
                optanonLogo: commonData.OptanonLogo,
                optanonCookieDomain: commonData.OptanonCookieDomain,
                optanonGroupIdPerformanceCookies: commonData.OptanonGroupIdPerformanceCookies,
                optanonGroupIdFunctionalityCookies: commonData.OptanonGroupIdFunctionalityCookies,
                optanonGroupIdTargetingCookies: commonData.OptanonGroupIdTargetingCookies,
                optanonGroupIdSocialCookies: commonData.OptanonGroupIdSocialCookies,
                optanonShowSubGroupCookies: commonData.ShowSubGroupCookies,
                cssPath: commonData.CssFilePathUrl,
                useRTL: commonData.UseRTL,
                showBannerCookieSettings: commonData.ShowBannerCookieSettings,
                showBannerAcceptButton: commonData.ShowBannerAcceptButton,
                showCookieList: commonData.ShowCookieList,
                allowHostOptOut: commonData.AllowHostOptOut,
                CookiesV2NewCookiePolicy: commonData.CookiesV2NewCookiePolicy,
                cookieListTitleColor: commonData.CookieListTitleColor,
                cookieListGroupNameColor: commonData.CookieListGroupNameColor,
                cookieListTableHeaderColor: commonData.CookieListTableHeaderColor,
                CookieListTableHeaderBackgroundColor: commonData.CookieListTableHeaderBackgroundColor,
                cookieListPrimaryColor: commonData.CookieListPrimaryColor,
                cookieListCustomCss: commonData.CookieListCustomCss,
                pcShowCookieHost: commonData.PCShowCookieHost,
                pcShowCookieDuration: commonData.PCShowCookieDuration,
                pcShowCookieType: commonData.PCShowCookieType,
                pcShowCookieCategory: commonData.PCShowCookieCategory,
                pcShowCookieDescription: commonData.PCShowCookieDescription,
                ConsentIntegration: commonData.ConsentIntegration,
                ConsentPurposesText: commonData.ConsentPurposesText || 'Consent Purposes',
                FeaturesText: commonData.FeaturesText || 'Features',
                LegitimateInterestPurposesText: commonData.LegitimateInterestPurposesText || 'Legitimate Interest Purposes',
            };
            this.BannerVariables.isRTL = commonData.UseRTL;
        };
        ExternalData.prototype.otFetch = function (url) {
            return __awaiter(this, void 0, void 0, function () {
                var resp, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!externalData.checkMobileOfflineRequest(url)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.otFetchOfflineFile(url)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            _a.trys.push([2, 8, , 9]);
                            this.BannerVariables.mobileOnlineURL.push(url);
                            if (!(typeof fetch === 'undefined')) return [3 /*break*/, 4];
                            return [4 /*yield*/, new Promise(function (resolve) {
                                    _this.getJSON(url, resolve, resolve);
                                })];
                        case 3: return [2 /*return*/, _a.sent()];
                        case 4: return [4 /*yield*/, fetch(url)];
                        case 5:
                            resp = _a.sent();
                            return [4 /*yield*/, resp.json()];
                        case 6: return [2 /*return*/, _a.sent()];
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            error_1 = _a.sent();
                            console.log('Error in fetch URL : ' + url + ' Exception : ' + error_1);
                            return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        ExternalData.prototype.getJSON = function (url, callback, error) {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.onload = function () {
                if (this.status >= 200 && this.status < 400) {
                    // Success!
                    var data = JSON.parse(this.responseText);
                    callback(data);
                }
                else {
                    // We reached our target server, but it returned an error
                    error({
                        message: 'Error Loading Data',
                        statusCode: this.status
                    });
                }
            };
            request.onerror = function (err) {
                // There was a connection error of some sort
                error(err);
            };
            request.send();
        };
        ExternalData.prototype.otFetchOfflineFile = function (url) {
            return __awaiter(this, void 0, void 0, function () {
                var urlPath, fileName, fileObject;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = url.replace('.json', '.js');
                            urlPath = url.split('/');
                            fileName = urlPath[urlPath.length - 1];
                            fileObject = fileName.split('.js')[0];
                            return [4 /*yield*/, new Promise(function (resolve) {
                                    var PromiseResolve = function () {
                                        resolve(window[fileObject]);
                                    };
                                    externalData.jsonp(url, PromiseResolve, PromiseResolve);
                                })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        ExternalData.prototype.initData = function () {
            this.BannerVariables = {
                otSDKVersion: 'VERSION',
                optanonCookieName: 'OptanonConsent',
                optanonAlertBoxClosedCookieName: 'OptanonAlertBoxClosed',
                optanonDoNotTrackEnabled: navigator.doNotTrack === 'yes' || navigator.doNotTrack === '1',
                doNotTrackText: 'do not track',
                optanonIsOptInMode: false,
                optanonIsSoftOptInMode: false,
                optanonHostList: [],
                optanonHtmlGroupData: [],
                optanonWrapperScriptExecutedGroups: [],
                optanonWrapperHtmlExecutedGroups: [],
                optanonWrapperScriptExecutedGroupsTemp: [],
                optanonWrapperHtmlExecutedGroupsTemp: [],
                optanonAboutCookiesGroupName: '',
                optanonNotLandingPageName: 'NotLandingPage',
                optanonAwaitingReconsentName: 'AwaitingReconsent',
                isWebsiteContainFixedHeader: false,
                consentIntegrationParam: 'consentId',
                bannerInteractionParam: 'interactionCount',
                isRTL: false,
                isClassic: false,
                isPCVisible: false,
                oneTrustHostConsent: [],
                oneTrustIABConsent: {
                    purpose: [],
                    specialFeatures: [],
                    vendors: [],
                    vendorList: null,
                    defaultPurpose: [],
                    IABCookieValue: ''
                },
                dataGroupState: [],
                oneTrustIABCookieName: 'eupubconsent',
                oneTrustIAB3rdPartyCookieName: 'euconsent',
                oneTrustIABgdprAppliesGlobally: true,
                oneTrustIsIABCrossConsentEnableParam: 'isIABGlobal',
                onetrustJsonData: {},
                useGeoLocationService: true,
                geolocationCookiesParam: 'geolocation',
                pagePushedDown: false,
                constant: {
                    IMPLIEDCONSENT: 'implied consent',
                    DOWNLOADTOLOCAL: 'LOCAL',
                    TESTSCRIPT: 'TEST',
                    EUCOUNTRIES: ['BE', 'BG', 'CZ', 'DK', 'DE', 'EE', 'IE', 'GR', 'ES', 'FR', 'IT', 'CY', 'LV', 'LT', 'LU',
                        'HU', 'MT', 'NL', 'AT', 'PL', 'PT', 'RO', 'SI', 'SK', 'FI', 'SE', 'GB', 'HR', 'LI', 'NO', 'IS'],
                    GLOBAL: 'global',
                    documentLanguageAttibute: 'data-document-language',
                    dataLanguage: 'data-language',
                    IGNOREGA: 'data-ignore-ga',
                    TRANSACTIONTYPE: {
                        CONFIRMED: 'CONFIRMED',
                        OPT_OUT: 'OPT_OUT',
                        NO_CHOICE: 'NO_CHOICE',
                        NOT_GIVEN: 'NOTGIVEN'
                    },
                    IGNOREHTMLCSS: 'data-ignore-html',
                    GROUPSTATUS: {
                        ALWAYSACTIVE: 'always active',
                        ACTIVE: 'active',
                        INACTIVELANDINGPAGE: 'inactive landingpage',
                        INACTIVE: 'inactive',
                    },
                },
                vendors: {
                    list: [],
                    pageList: [],
                    searchParam: '',
                    currentPage: 1,
                    numberPerPage: 50,
                    numberOfPages: 1,
                    vendorTemplate: null,
                },
                hosts: {
                    hostTemplate: null,
                    hostCookieTemplate: null,
                },
                publicDomainData: undefined,
                domainData: undefined,
                iabData: undefined,
                consentData: undefined,
                cookieGroupData: [],
                languageSwitcherJson: undefined,
                commonData: undefined,
                ignoreGoogleAnlyticsCall: false,
                isCookieList: false,
                filterByCategories: [],
                filterByIABCategories: [],
                currentGlobalFilteredList: [],
                oneTrustCategories: [],
                mobileOnlineURL: [],
                ignoreInjectingHtmlCss: false
            };
        };
        ExternalData.prototype.getBannerSDKAssestsUrl = function () {
            return this.getBannerVersionUrl() + "/assets";
        };
        ExternalData.prototype.getBannerVersionUrl = function () {
            var baseUrl = this.bannerScriptElement.getAttribute('src').split(this.stubFileName)[0];
            return "" + baseUrl + moduleInitializer.moduleInitializer.Version;
        };
        ExternalData.prototype.getBannerScriptElement = function () {
            return this.bannerScriptElement;
        };
        ExternalData.prototype.setConsentModelFlag = function (isOptInModel, isSoftOptInModel) {
            this.BannerVariables.optanonIsOptInMode = isOptInModel;
            this.BannerVariables.optanonIsSoftOptInMode = isSoftOptInModel;
        };
        ExternalData.prototype.setBannerScriptData = function () {
            return __awaiter(this, void 0, void 0, function () {
                var regionRule, culture, url, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            regionRule = this.getRegionRule();
                            this.setLanguageSwitcherJson(regionRule);
                            culture = externalData.getDataLanguageCulture().toLowerCase();
                            this.consentLanguage = culture.substr(0, 2);
                            url = this.getBannerDataParentUrl() + "/" + regionRule.Id + "/" + culture;
                            return [4 /*yield*/, this.otFetch(url + ".json")];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, Promise.resolve(response)];
                    }
                });
            });
        };
        ExternalData.prototype.setRegionRule = function (regionRule) {
            this.regionRuleObject = regionRule;
        };
        ExternalData.prototype.getRegionRule = function () {
            return this.regionRuleObject;
        };
        ExternalData.prototype.getBannerDataParentUrl = function () {
            return this.bannerDataParentURL;
        };
        ExternalData.prototype.populateGroups = function (groups, domainData) {
            var _this = this;
            var groupMap = {};
            var subGroups = [];
            groups.forEach(function (group) {
                var groupId = groupsHelper.getGroupIdForCookie(group);
                // remove Iab Category if not enabled
                if (!domainData.IsIabEnabled && IAB_GROUP_TYPES.indexOf(group.Type) > -1) {
                    return;
                }
                group.SubGroups = [];
                if (!group.Parent) {
                    groupMap[groupId] = group;
                }
                else {
                    subGroups.push(group);
                }
                // Construct IAB groups as per IAB json data
                if (_this.iabType === 'IAB2' && IAB_GROUP_TYPES.indexOf(group.Type) > -1) {
                    var iabGrpId = _this.extractGroupIdForIabGroup(groupId);
                    var iabGrp = {
                        description: group.GroupDescription,
                        descriptionLegal: group.DescriptionLegal,
                        id: Number(iabGrpId),
                        name: group.GroupName
                    };
                    switch (group.Type) {
                        case GROUP_TYPES.IAB2_PURPOSE:
                        case GROUP_TYPES.IAB1_PURPOSE:
                            _this.iabGroups.purposes[iabGrpId] = iabGrp;
                            break;
                        case GROUP_TYPES.IAB2_SPL_PURPOSE:
                            _this.iabGroups.specialPurposes[iabGrpId] = iabGrp;
                            break;
                        case GROUP_TYPES.IAB2_FEATURE:
                            _this.iabGroups.features[iabGrpId] = iabGrp;
                            break;
                        case GROUP_TYPES.IAB2_SPL_FEATURE:
                            _this.iabGroups.specialFeatures[iabGrpId] = iabGrp;
                            break;
                    }
                }
            });
            subGroups.forEach(function (subGroup) {
                // If subgroup has cookie only or if it's a IAB related groups then will be shown in the ui
                if (groupMap[subGroup.Parent] &&
                    (subGroup.ShowInPopup
                        && (subGroup.FirstPartyCookies.length
                            || subGroup.Hosts.length
                            || IAB_GROUP_TYPES.indexOf(subGroup.Type) > -1))) {
                    groupMap[subGroup.Parent].SubGroups.push(subGroup);
                }
            });
            var list = [];
            Object.keys(groupMap)
                .forEach(function (groupId) {
                if (groupsHelper.isValidConsentNoticeGroup(groupMap[groupId], domainData.IsIabEnabled)) {
                    // Sorting sub groups by order
                    groupMap[groupId].SubGroups.sort(function (a, b) { return a.Order - b.Order; });
                    list.push(groupMap[groupId]);
                }
            });
            // Sorting parent groups order
            return list.sort(function (a, b) { return a.Order - b.Order; });
        };
        ExternalData.prototype.setPublicDomainData = function (responseDomainData) {
            this.BannerVariables.publicDomainData = {
                cctId: responseDomainData.cctId,
                MainText: responseDomainData.MainText,
                MainInfoText: responseDomainData.MainInfoText,
                AboutText: responseDomainData.AboutText,
                AboutCookiesText: responseDomainData.AboutCookiesText,
                ConfirmText: responseDomainData.ConfirmText,
                AllowAllText: responseDomainData.PreferenceCenterConfirmText,
                ManagePreferenceText: responseDomainData.PreferenceCenterManagePreferencesText,
                CookiesUsedText: responseDomainData.CookiesUsedText,
                AboutLink: responseDomainData.AboutLink,
                HideToolbarCookieListAboutLink: responseDomainData.HideToolbarCookieListAboutLink,
                ActiveText: responseDomainData.ActiveText,
                AlwaysActiveText: responseDomainData.AlwaysActiveText,
                AlertNoticeText: responseDomainData.AlertNoticeText,
                AlertCloseText: responseDomainData.AlertCloseText,
                AlertMoreInfoText: responseDomainData.AlertMoreInfoText,
                AlertAllowCookiesText: responseDomainData.AlertAllowCookiesText,
                CloseShouldAcceptAllCookies: responseDomainData.CloseShouldAcceptAllCookies,
                BannerTitle: responseDomainData.BannerTitle,
                ForceConsent: responseDomainData.ForceConsent,
                LastReconsentDate: responseDomainData.LastReconsentDate,
                InactiveText: responseDomainData.InactiveText,
                CookiesText: responseDomainData.CookiesText,
                CookieSettingButtonText: responseDomainData.CookieSettingButtonText,
                CategoriesText: responseDomainData.CategoriesText,
                IsLifespanEnabled: responseDomainData.IsLifespanEnabled,
                LifespanText: responseDomainData.LifespanText,
                Groups: null,
                Language: responseDomainData.Language,
                showBannerCloseButton: responseDomainData.showBannerCloseButton,
                ShowPreferenceCenterCloseButton: responseDomainData.ShowPreferenceCenterCloseButton,
                FooterDescriptionText: responseDomainData.FooterDescriptionText,
                CustomJs: responseDomainData.CustomJs,
                LifespanTypeText: responseDomainData.LifespanTypeText,
                LifespanDurationText: responseDomainData.LifespanDurationText,
                CloseText: responseDomainData.CloseText,
                BannerCloseButtonText: responseDomainData.BannerCloseButtonText,
                HideToolbarCookieList: responseDomainData.HideToolbarCookieList,
                AlertLayout: responseDomainData.AlertLayout,
                AddLinksToCookiepedia: responseDomainData.AddLinksToCookiepedia,
                ShowAlertNotice: responseDomainData.ShowAlertNotice,
                IsIABEnabled: responseDomainData.IsIabEnabled,
                IabType: responseDomainData.IabType,
                BannerPosition: responseDomainData.BannerPosition,
                PreferenceCenterPosition: responseDomainData.PreferenceCenterPosition,
                // Enabling Vendor list by default if IAB is Enable
                VendorLevelOptOut: responseDomainData.IsIabEnabled,
                ConsentModel: { Name: responseDomainData.ConsentModel },
                VendorConsentModel: responseDomainData.VendorConsentModel,
                IsConsentLoggingEnabled: responseDomainData.IsConsentLoggingEnabled,
                IsIabThirdPartyCookieEnabled: responseDomainData.IsIabThirdPartyCookieEnabled,
                ScrollCloseBanner: responseDomainData.ScrollCloseBanner,
                ScrollAcceptAllCookies: responseDomainData.ScrollAcceptAllCookies,
                OnClickCloseBanner: responseDomainData.OnClickCloseBanner,
                OnClickAcceptAllCookies: responseDomainData.OnClickAcceptAllCookies,
                NextPageCloseBanner: responseDomainData.NextPageCloseBanner,
                NextPageAcceptAllCookies: responseDomainData.NextPageAcceptAllCookies,
                VendorListText: responseDomainData.VendorListText,
                ThirdPartyCookieListText: responseDomainData.ThirdPartyCookieListText,
                CookieListDescription: responseDomainData.CookieListDescription,
                CookieListTitle: responseDomainData.CookieListTitle,
                BannerPurposeTitle: responseDomainData.BannerPurposeTitle,
                BannerPurposeDescription: responseDomainData.BannerPurposeDescription,
                BannerFeatureTitle: responseDomainData.BannerFeatureTitle,
                BannerFeatureDescription: responseDomainData.BannerFeatureDescription,
                BannerInformationTitle: responseDomainData.BannerInformationTitle,
                BannerInformationDescription: responseDomainData.BannerInformationDescription,
                BannerIABPartnersLink: responseDomainData.BannerIABPartnersLink,
                BannerShowRejectAllButton: responseDomainData.BannerShowRejectAllButton,
                BannerRejectAllButtonText: responseDomainData.BannerRejectAllButtonText,
                BannerSettingsButtonDisplayLink: responseDomainData.BannerSettingsButtonDisplayLink,
                ConsentIntegrationData: null,
                PCFirstPartyCookieListText: responseDomainData.PCFirstPartyCookieListText,
                PCViewCookiesText: responseDomainData.PCViewCookiesText,
                IsBannerLoaded: false,
                PCenterBackText: responseDomainData.PCenterBackText,
                PCenterVendorsListText: responseDomainData.PCenterVendorsListText,
                PCenterViewPrivacyPolicyText: responseDomainData.PCenterViewPrivacyPolicyText,
                PCenterClearFiltersText: responseDomainData.PCenterClearFiltersText,
                PCenterApplyFiltersText: responseDomainData.PCenterApplyFiltersText,
                PCenterEnableAccordion: responseDomainData.PCenterEnableAccordion,
                PCenterExpandToViewText: responseDomainData.PCenterExpandToViewText,
                PCenterAllowAllConsentText: responseDomainData.PCenterAllowAllConsentText,
                PCenterCookiesListText: responseDomainData.PCenterCookiesListText,
                PCenterCancelFiltersText: responseDomainData.PCenterCancelFiltersText,
            };
            var groups = [];
            responseDomainData.Groups.forEach(function (group) {
                // remove Iab Category if not enable
                if (!responseDomainData.IsIabEnabled && group.IsIabPurpose) { // TODO: check for type here 
                    return;
                }
                group.Cookies = JSON.parse(JSON.stringify(group.FirstPartyCookies));
                groups.push(group);
            });
            this.BannerVariables.publicDomainData.Groups = groups;
        };
        ExternalData.prototype.setConsentIntegrationDataInPublicDomainData = function (consentData) {
            this.BannerVariables.publicDomainData.ConsentIntegrationData = consentData;
        };
        ExternalData.prototype.domainDataMapper = function (responseDomainData) {
            this.BannerVariables.domainData = {
                cctId: responseDomainData.cctId,
                MainText: responseDomainData.MainText,
                MainInfoText: responseDomainData.MainInfoText,
                AboutText: responseDomainData.AboutText,
                AboutCookiesText: responseDomainData.AboutCookiesText,
                ConfirmText: responseDomainData.ConfirmText,
                AllowAllText: responseDomainData.PreferenceCenterConfirmText,
                ManagePreferenceText: responseDomainData.PreferenceCenterManagePreferencesText,
                CookiesUsedText: responseDomainData.CookiesUsedText,
                AboutLink: responseDomainData.AboutLink,
                HideToolbarCookieListAboutLink: responseDomainData.HideToolbarCookieListAboutLink,
                ActiveText: responseDomainData.ActiveText,
                AlwaysActiveText: responseDomainData.AlwaysActiveText,
                AlertNoticeText: responseDomainData.AlertNoticeText,
                AlertCloseText: responseDomainData.AlertCloseText,
                AlertMoreInfoText: responseDomainData.AlertMoreInfoText,
                AlertAllowCookiesText: responseDomainData.AlertAllowCookiesText,
                CloseShouldAcceptAllCookies: responseDomainData.CloseShouldAcceptAllCookies,
                BannerTitle: responseDomainData.BannerTitle,
                ForceConsent: responseDomainData.ForceConsent,
                LastReconsentDate: responseDomainData.LastReconsentDate,
                InactiveText: responseDomainData.InactiveText,
                CookiesText: responseDomainData.CookiesText,
                CategoriesText: responseDomainData.CategoriesText,
                CookieSettingButtonText: responseDomainData.CookieSettingButtonText,
                IsLifespanEnabled: responseDomainData.IsLifespanEnabled,
                LifespanText: responseDomainData.LifespanText,
                Groups: this.populateGroups(responseDomainData.Groups, responseDomainData),
                Language: responseDomainData.Language,
                showBannerCloseButton: responseDomainData.showBannerCloseButton,
                ShowPreferenceCenterCloseButton: responseDomainData.ShowPreferenceCenterCloseButton,
                FooterDescriptionText: responseDomainData.FooterDescriptionText,
                CustomJs: responseDomainData.CustomJs,
                LifespanTypeText: responseDomainData.LifespanTypeText,
                LifespanDurationText: responseDomainData.LifespanDurationText,
                CloseText: responseDomainData.CloseText,
                BannerCloseButtonText: responseDomainData.BannerCloseButtonText,
                HideToolbarCookieList: responseDomainData.HideToolbarCookieList,
                AlertLayout: responseDomainData.AlertLayout,
                AddLinksToCookiepedia: responseDomainData.AddLinksToCookiepedia,
                ShowAlertNotice: responseDomainData.ShowAlertNotice,
                IsIabEnabled: responseDomainData.IsIabEnabled,
                IabType: responseDomainData.IabType,
                BannerPosition: responseDomainData.BannerPosition,
                PreferenceCenterPosition: responseDomainData.PreferenceCenterPosition,
                // Enabling Vendor list by default if IAB is Enable
                VendorLevelOptOut: responseDomainData.IsIabEnabled,
                ConsentModel: {
                    Name: responseDomainData.ConsentModel,
                },
                VendorConsentModel: responseDomainData.VendorConsentModel,
                IsConsentLoggingEnabled: responseDomainData.IsConsentLoggingEnabled,
                IsIabThirdPartyCookieEnabled: responseDomainData.IsIabThirdPartyCookieEnabled,
                ScrollCloseBanner: responseDomainData.ScrollCloseBanner,
                ScrollAcceptAllCookies: responseDomainData.ScrollAcceptAllCookies,
                OnClickCloseBanner: responseDomainData.OnClickCloseBanner,
                OnClickAcceptAllCookies: responseDomainData.OnClickAcceptAllCookies,
                NextPageCloseBanner: responseDomainData.NextPageCloseBanner,
                NextPageAcceptAllCookies: responseDomainData.NextPageAcceptAllCookies,
                VendorListText: responseDomainData.VendorListText,
                ThirdPartyCookieListText: responseDomainData.ThirdPartyCookieListText,
                CookieListDescription: responseDomainData.CookieListDescription,
                CookieListTitle: responseDomainData.CookieListTitle,
                PreferenceCenterMoreInfoScreenReader: responseDomainData.PreferenceCenterMoreInfoScreenReader,
                BannerPushDown: responseDomainData.BannerPushDown,
                // banner selected
                Flat: responseDomainData.Flat,
                FloatingFlat: responseDomainData.FloatingFlat,
                FloatingRoundedCorner: responseDomainData.FloatingRoundedCorner,
                FloatingRoundedIcon: responseDomainData.FloatingRoundedIcon,
                FloatingRounded: responseDomainData.FloatingRounded,
                CenterRounded: responseDomainData.CenterRounded,
                // prefarence center
                Center: responseDomainData.Center,
                Panel: responseDomainData.Panel,
                Popup: responseDomainData.Popup,
                List: responseDomainData.List,
                Tab: responseDomainData.Tab,
                BannerPurposeTitle: responseDomainData.BannerPurposeTitle,
                BannerPurposeDescription: responseDomainData.BannerPurposeDescription,
                BannerFeatureTitle: responseDomainData.BannerFeatureTitle,
                BannerFeatureDescription: responseDomainData.BannerFeatureDescription,
                BannerInformationTitle: responseDomainData.BannerInformationTitle,
                BannerInformationDescription: responseDomainData.BannerInformationDescription,
                BannerIABPartnersLink: responseDomainData.BannerIABPartnersLink,
                BannerShowRejectAllButton: responseDomainData.BannerShowRejectAllButton,
                BannerRejectAllButtonText: responseDomainData.BannerRejectAllButtonText,
                BannerSettingsButtonDisplayLink: responseDomainData.BannerSettingsButtonDisplayLink,
                PCFirstPartyCookieListText: responseDomainData.PCFirstPartyCookieListText,
                PCViewCookiesText: responseDomainData.PCViewCookiesText,
                PCenterBackText: responseDomainData.PCenterBackText,
                PCenterVendorsListText: responseDomainData.PCenterVendorsListText,
                PCenterViewPrivacyPolicyText: responseDomainData.PCenterViewPrivacyPolicyText,
                PCenterClearFiltersText: responseDomainData.PCenterClearFiltersText,
                PCenterApplyFiltersText: responseDomainData.PCenterApplyFiltersText,
                PCenterEnableAccordion: responseDomainData.PCenterEnableAccordion,
                PCenterExpandToViewText: responseDomainData.PCenterExpandToViewText,
                PCenterAllowAllConsentText: responseDomainData.PCenterAllowAllConsentText,
                PCenterCookiesListText: responseDomainData.PCenterCookiesListText,
                PCenterCancelFiltersText: responseDomainData.PCenterCancelFiltersText,
                Vendors: responseDomainData.Vendors
            };
            if (!moduleInitializer.moduleInitializer.MobileSDK) {
                this.BannerVariables.pagePushedDown = responseDomainData.BannerPushesDownPage;
            }
        };
        ExternalData.prototype.setLanguageSwitcherJson = function (regionRule) {
            this.BannerVariables.languageSwitcherJson = regionRule.LanguageSwitcherPlaceholder;
        };
        ExternalData.prototype.setAboutCookieName = function () {
            this.BannerVariables.optanonAboutCookiesGroupName = this.BannerVariables.domainData.AboutCookiesText;
        };
        ExternalData.prototype.setIabData = function () {
            var iabType = externalData.iabType;
            this.BannerVariables.iabData = iabType === 'IAB'
                ? moduleInitializer.moduleInitializer.IabData
                : moduleInitializer.moduleInitializer.IabV2Data;
            this.BannerVariables.iabData.consentLanguage = this.consentLanguage.toLocaleLowerCase();
        };
        ExternalData.prototype.setConsentData = function () {
            var consentPayload = {};
            consentPayload.requestInformation = externalData.BannerVariables.commonData.ConsentIntegration.RequestInformation;
            this.BannerVariables.consentData = {
                consentApi: externalData.BannerVariables.commonData.ConsentIntegration.ConsentApi,
                consentPayload: consentPayload,
            };
        };
        // TODO this smells like it could be DRY'd up
        ExternalData.prototype.assignIABDataWithGlobalVendorList = function (vendorList) {
            var _this = this;
            this.BannerVariables.iabData.vendorListVersion = vendorList.vendorListVersion;
            if (this.iabType === 'IAB2') {
                this.BannerVariables.iabData.vendors = [];
                Object.keys(vendorList.vendors).forEach(function (vendorId) {
                    var vendorData = {};
                    vendorData.vendorId = vendorList.vendors[vendorId].id;
                    vendorData.vendorName = vendorList.vendors[vendorId].name;
                    vendorData.policyUrl = vendorList.vendors[vendorId].policyUrl;
                    // leg-int purposes
                    vendorData.legIntPurposes = vendorList.vendors[vendorId].legIntPurposes.map(function (purposeId) {
                        var detail;
                        if (_this.iabGroups.purposes[purposeId]) {
                            detail = {
                                description: _this.iabGroups.purposes[purposeId].description,
                                purposeId: _this.iabGroups.purposes[purposeId].id,
                                purposeName: _this.iabGroups.purposes[purposeId].name
                            };
                        }
                        return detail;
                    });
                    // features
                    vendorData.features = vendorList.vendors[vendorId].features.map(function (featureId) {
                        var detail;
                        if (_this.iabGroups.features[featureId]) {
                            detail = {
                                description: _this.iabGroups.features[featureId].description,
                                featureId: _this.iabGroups.features[featureId].id,
                                featureName: _this.iabGroups.features[featureId].name
                            };
                        }
                        return detail;
                    });
                    // Special features
                    vendorData.specialFeatures = vendorList.vendors[vendorId].specialFeatures.map(function (specialFeatureId) {
                        var detail;
                        if (_this.iabGroups.specialFeatures[specialFeatureId]) {
                            detail = {
                                description: _this.iabGroups.specialFeatures[specialFeatureId].description,
                                featureId: _this.iabGroups.specialFeatures[specialFeatureId].id,
                                featureName: _this.iabGroups.specialFeatures[specialFeatureId].name
                            };
                        }
                        return detail;
                    });
                    // purposes
                    vendorData.purposes = vendorList.vendors[vendorId].purposes.map(function (purposeId) {
                        var detail;
                        if (_this.iabGroups.purposes[purposeId]) {
                            detail = {
                                description: _this.iabGroups.purposes[purposeId].description,
                                purposeId: _this.iabGroups.purposes[purposeId].id,
                                purposeName: _this.iabGroups.purposes[purposeId].name
                            };
                        }
                        return detail;
                    });
                    // Special Purposes
                    vendorData.specialPurposes = vendorList.vendors[vendorId].specialPurposes.map(function (purposeId) {
                        var detail;
                        if (_this.iabGroups.specialPurposes[purposeId]) {
                            detail = {
                                description: _this.iabGroups.specialPurposes[purposeId].description,
                                purposeId: _this.iabGroups.specialPurposes[purposeId].id,
                                purposeName: _this.iabGroups.specialPurposes[purposeId].name
                            };
                        }
                        return detail;
                    });
                    _this.BannerVariables.iabData.vendors.push(vendorData);
                });
            }
            else {
                this.BannerVariables.iabData.vendors = vendorList.vendors.reduce(function (finalist, vendor) {
                    if (!finalist)
                        finalist = [];
                    vendor.vendorId = vendor.id;
                    vendor.vendorName = vendor.name;
                    // leg-int purposes
                    vendor.legIntPurposes = vendor.legIntPurposeIds.map(function (purposeId) {
                        var detail;
                        vendorList.purposes.some(function (purpose) {
                            if (purpose.id === purposeId) {
                                detail = {
                                    description: purpose.description,
                                    purposeId: purpose.id,
                                    purposeName: purpose.name
                                };
                                return true;
                            }
                        });
                        return detail;
                    });
                    // features
                    vendor.features = vendor.featureIds.map(function (featureId) {
                        var detail;
                        vendorList.features.some(function (feature) {
                            if (feature.id === featureId) {
                                detail = {
                                    description: feature.description,
                                    featureId: feature.id,
                                    featureName: feature.name
                                };
                                return true;
                            }
                        });
                        return detail;
                    });
                    // purposes
                    vendor.purposes = vendor.purposeIds.map(function (purposeId) {
                        var detail;
                        vendorList.purposes.some(function (purpose) {
                            if (purpose.id === purposeId) {
                                detail = {
                                    description: purpose.description,
                                    purposeId: purpose.id,
                                    purposeName: purpose.name
                                };
                                return true;
                            }
                        });
                        return detail;
                    });
                    finalist.push(vendor);
                    return finalist;
                }, []);
            }
        };
        ExternalData.prototype.populateIABCookies = function () {
            if (this.isIABCrossConsentEnabled()) {
                try {
                    this.setIAB3rdPartyCookie(this.BannerVariables.oneTrustIAB3rdPartyCookieName, '', 0, true);
                }
                catch (error) {
                    this.setIABCookieData();
                    this.writeCookieParam(this.BannerVariables.optanonCookieName, this.BannerVariables.oneTrustIsIABCrossConsentEnableParam, false);
                }
            }
            else if (!externalData.needReconsent()) {
                this.setIABCookieData();
            }
        };
        ExternalData.prototype.setIAB3rdPartyCookie = function (name, value, days, isFirstRequest) {
            var IABUrl = this.BannerVariables.commonData.iabThirdPartyConsentUrl;
            try {
                if (IABUrl && document.body) {
                    return this.updateThirdPartyConsent(IABUrl, name, value, days, isFirstRequest);
                }
                else {
                    throw new ReferenceError();
                }
            }
            catch (error) {
                throw error;
            }
        };
        ExternalData.prototype.setIABCookieData = function () {
            this.BannerVariables.oneTrustIABConsent.IABCookieValue = this.getCookie(this.BannerVariables.oneTrustIABCookieName);
        };
        ExternalData.prototype.getPcContent = function (clearCache) {
            if (clearCache === void 0) { clearCache = false; }
            return __awaiter(this, void 0, void 0, function () {
                var assestsUrl, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(!this.preferenceCenterContent || clearCache)) return [3 /*break*/, 2];
                            assestsUrl = void 0;
                            if (this.BannerVariables.domainData.Center) {
                                assestsUrl = this.getBannerSDKAssestsUrl() + "/otPcCenter.json";
                            }
                            else if (this.BannerVariables.domainData.Panel) {
                                assestsUrl = this.getBannerSDKAssestsUrl() + "/otPcPanel.json";
                            }
                            else if (this.BannerVariables.domainData.Popup) {
                                assestsUrl = this.getBannerSDKAssestsUrl() + "/otPcPopup.json";
                            }
                            else if (this.BannerVariables.domainData.List) {
                                assestsUrl = this.getBannerSDKAssestsUrl() + "/otPcList.json";
                            }
                            else if (this.BannerVariables.domainData.Tab) {
                                assestsUrl = this.getBannerSDKAssestsUrl() + "/otPcTab.json";
                            }
                            if (!assestsUrl) return [3 /*break*/, 2];
                            _a = this;
                            return [4 /*yield*/, this.otFetch(assestsUrl)];
                        case 1:
                            _a.preferenceCenterContent = _b.sent();
                            _b.label = 2;
                        case 2: return [2 /*return*/, this.preferenceCenterContent];
                    }
                });
            });
        };
        ExternalData.prototype.getBannerContent = function (clearCache) {
            if (clearCache === void 0) { clearCache = false; }
            return __awaiter(this, void 0, void 0, function () {
                var assestsUrl, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(!this.bannerContent || clearCache)) return [3 /*break*/, 2];
                            assestsUrl = void 0;
                            if (this.BannerVariables.domainData.Flat) {
                                assestsUrl = this.getBannerSDKAssestsUrl() + "/otFlat.json";
                            }
                            else if (this.BannerVariables.domainData.FloatingRoundedCorner) {
                                assestsUrl = this.getBannerSDKAssestsUrl() + "/otFloatingRoundedCorner.json";
                            }
                            else if (this.BannerVariables.domainData.FloatingFlat) {
                                assestsUrl = this.getBannerSDKAssestsUrl() + "/otFloatingFlat.json";
                            }
                            else if (this.BannerVariables.domainData.FloatingRounded) {
                                assestsUrl = this.getBannerSDKAssestsUrl() + "/otFloatingRounded.json";
                            }
                            else if (this.BannerVariables.domainData.FloatingRoundedIcon) {
                                assestsUrl = this.getBannerSDKAssestsUrl() + "/otFloatingRoundedIcon.json";
                            }
                            else if (this.BannerVariables.domainData.CenterRounded) {
                                assestsUrl = this.getBannerSDKAssestsUrl() + "/otCenterRounded.json";
                            }
                            if (!assestsUrl) return [3 /*break*/, 2];
                            _a = this;
                            return [4 /*yield*/, this.otFetch(assestsUrl)];
                        case 1:
                            _a.bannerContent = _b.sent();
                            _b.label = 2;
                        case 2: return [2 /*return*/, this.bannerContent];
                    }
                });
            });
        };
        ExternalData.prototype.updateThirdPartyConsent = function (IABUrl, name, value, days, isFirstRequest) {
            return __awaiter(this, void 0, void 0, function () {
                var url, i_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            url = window.location.protocol + "//" + IABUrl + "/?name=" + name + "&value=" + value + "&expire=" + days + "&isFirstRequest=" + isFirstRequest;
                            if (!document.getElementById('onetrustIabCookie')) return [3 /*break*/, 1];
                            document
                                .getElementById('onetrustIabCookie')
                                .contentWindow.location.replace(url);
                            return [3 /*break*/, 3];
                        case 1:
                            i_1 = document.createElement('iframe');
                            i_1.style.display = 'none';
                            i_1.id = 'onetrustIabCookie';
                            i_1.setAttribute('title', 'OneTrust IAB Cookie');
                            i_1.src = url;
                            document.body.appendChild(i_1);
                            return [4 /*yield*/, new Promise(function (resolve) {
                                    i_1.onload = function () {
                                        resolve();
                                    };
                                    i_1.onerror = function () {
                                        resolve();
                                        throw new URIError();
                                    };
                                })];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        ExternalData.prototype.setIABVendor = function (isActive) {
            var _this = this;
            if (isActive === void 0) { isActive = true; }
            var jsonIABData = this.BannerVariables.iabData;
            if (jsonIABData &&
                jsonIABData.vendors &&
                jsonIABData.vendors.length > 0) {
                jsonIABData.vendors.forEach(function (vendor) {
                    _this.BannerVariables.oneTrustIABConsent.vendors.push(vendor.vendorId.toString() + ":" + isActive);
                });
            }
        };
        ExternalData.prototype.updateCorrectIABUrl = function (sourceUrl) {
            var sourceUrI = moduleHelper.getURL(sourceUrl);
            var bannerScriptElement = this.getBannerScriptElement();
            var bannerScriptURL = bannerScriptElement && bannerScriptElement.getAttribute('src')
                ? moduleHelper.getURL(bannerScriptElement.getAttribute('src'))
                : null;
            if (moduleInitializer.moduleInitializer.ScriptType === this.BannerVariables.constant.DOWNLOADTOLOCAL) {
                if (bannerScriptURL && sourceUrI && bannerScriptURL.hostname !== sourceUrI.hostname) {
                    bannerScriptURL = "" + this.getBannerDataParentUrl();
                    sourceUrl = bannerScriptURL + sourceUrI.pathname.split('/').pop().replace(/(^\/?)/, '/');
                    sourceUrl = sourceUrl.replace(sourceUrI.hostname, bannerScriptURL.hostname);
                }
            }
            return sourceUrl;
        };
        ExternalData.prototype.updateCorrectUrl = function (sourceUrl, skipForLocal) {
            if (skipForLocal === void 0) { skipForLocal = false; }
            var sourceUrI = moduleHelper.getURL(sourceUrl);
            var bannerScriptElement = this.getBannerScriptElement();
            var bannerScriptURL = bannerScriptElement && bannerScriptElement.getAttribute('src')
                ? moduleHelper.getURL(bannerScriptElement.getAttribute('src'))
                : null;
            if (bannerScriptURL &&
                sourceUrI &&
                bannerScriptURL.hostname !== sourceUrI.hostname) {
                if (moduleInitializer.moduleInitializer.ScriptType ===
                    this.BannerVariables.constant.DOWNLOADTOLOCAL) {
                    if (skipForLocal) {
                        return sourceUrl;
                    }
                    bannerScriptURL = this.getBannerDataParentUrl() + "/" + this.getRegionRule().Id;
                    sourceUrl = bannerScriptURL + sourceUrI.pathname.replace(/(^\/?)/, '/');
                    return sourceUrl;
                }
                sourceUrl = sourceUrl.replace(sourceUrI.hostname, bannerScriptURL.hostname);
            }
            return sourceUrl;
        };
        ExternalData.prototype.getDataLanguageCulture = function () {
            var scriptElement = this.getBannerScriptElement();
            // get data-language attibute to get correct data API
            if (scriptElement &&
                scriptElement.getAttribute(externalData.BannerVariables.constant.dataLanguage)) {
                return scriptElement
                    .getAttribute(externalData.BannerVariables.constant.dataLanguage)
                    .toLowerCase();
            }
            else {
                // detect from languge switcher
                return externalData.detectDocumentOrBrowserLanguage().toLowerCase();
            }
        };
        ExternalData.prototype.detectDocumentOrBrowserLanguage = function () {
            var languageSwitcherLanguage = moduleHelper.convertKeyValueLowerCase(this.BannerVariables.languageSwitcherJson);
            var userLang = this.getUserLanguge().toLowerCase();
            var languageCulture = '';
            languageCulture = languageSwitcherLanguage[userLang]
                || languageSwitcherLanguage[userLang + '-' + userLang]
                || (languageSwitcherLanguage['default'] === userLang ? languageSwitcherLanguage['default'] : null);
            if (!languageCulture) {
                if (userLang.length === 2) {
                    for (var i = 0; i < Object.keys(languageSwitcherLanguage).length; i += 1) {
                        var languageKey = Object.keys(languageSwitcherLanguage)[i];
                        if (languageKey.substr(0, 2) === userLang) {
                            languageCulture = languageSwitcherLanguage[languageKey];
                            break;
                        }
                    }
                }
                else if (userLang.length > 2) {
                    languageCulture = languageSwitcherLanguage[userLang.substr(0, 2)];
                }
            }
            if (!languageCulture) {
                languageCulture = languageSwitcherLanguage['default'];
            }
            return languageCulture;
        };
        ExternalData.prototype.getUserLanguge = function () {
            var userLang = '';
            if (languageSwitcher.useDocumentLanguage) {
                userLang = document.documentElement.lang;
            }
            else {
                userLang =
                    navigator.languages && navigator.languages.length
                        ? navigator.languages[0]
                        : navigator.language || navigator.userLanguage;
            }
            return userLang;
        };
        // Stuff from cookie- so many circular dependencies...
        // setting 3rdparty consent flag in cookie for stub to make judgement on calling 3rd party consent or not
        ExternalData.prototype.setOrUpdate3rdPartyIABConsentFlag = function () {
            var iabCrossConsentFlag = this.getIABCrossConsentflagData();
            if (this.BannerVariables.domainData.IsIabEnabled) {
                if (!iabCrossConsentFlag || this.reconsentRequired()) {
                    this.writeCookieParam(this.BannerVariables.optanonCookieName, this.BannerVariables
                        .oneTrustIsIABCrossConsentEnableParam, this.BannerVariables.domainData
                        .IsIabThirdPartyCookieEnabled);
                }
            }
            else {
                if (!iabCrossConsentFlag || this.reconsentRequired() || this.isIABCrossConsentEnabled()) {
                    this.writeCookieParam(this.BannerVariables.optanonCookieName, this.BannerVariables
                        .oneTrustIsIABCrossConsentEnableParam, false);
                }
            }
        };
        ExternalData.prototype.isIABCrossConsentEnabled = function () {
            return this.getIABCrossConsentflagData() === 'true';
        };
        ExternalData.prototype.getIABCrossConsentflagData = function () {
            return this.readCookieParam(this.BannerVariables.optanonCookieName, this.BannerVariables.oneTrustIsIABCrossConsentEnableParam);
        };
        ExternalData.prototype.setGeolocationInCookies = function () {
            var userGeolocation = this.readCookieParam(this.BannerVariables.optanonCookieName, this.BannerVariables.geolocationCookiesParam);
            if (this.userLocation && (!userGeolocation && this.isAlertBoxClosedAndValid())) {
                var userLocation = this.userLocation.country + ";" + this.userLocation.state;
                this.setUpdateGeolocationCookiesData(userLocation);
            }
            else if (this.reconsentRequired() && userGeolocation) {
                this.setUpdateGeolocationCookiesData('');
            }
        };
        ExternalData.prototype.iabStringSDK = function (consentData) {
            if (consentData === void 0) { consentData = ''; }
            if (this.BannerVariables.domainData.IsIabEnabled && moduleInitializer.moduleInitializer.otIABModuleData) {
                if (this.iabType === 'IAB2') {
                    return {
                        gvl: moduleInitializer.moduleInitializer.otIABModuleData.tcfSdkRef.gvl,
                        tcModel: moduleInitializer.moduleInitializer.otIABModuleData.tcfSdkRef.tcModel,
                        tcString: moduleInitializer.moduleInitializer.otIABModuleData.tcfSdkRef.tcString,
                        cmpApi: moduleInitializer.moduleInitializer.otIABModuleData.tcfSdkRef.cmpApi
                    };
                }
                else {
                    return moduleInitializer.moduleInitializer.otIABModuleData.consentString(consentData);
                }
            }
        };
        ExternalData.prototype.setUpdateGeolocationCookiesData = function (geolocation) {
            this.writeCookieParam(this.BannerVariables.optanonCookieName, this.BannerVariables.geolocationCookiesParam, geolocation);
        };
        ExternalData.prototype.writeCookieParam = function (cookieName, paramName, paramValue) {
            var data = {};
            var cookie = this.getCookie(cookieName);
            var i;
            var values;
            var pair;
            var value;
            var json = this.BannerVariables.domainData;
            if (cookie) {
                values = cookie.split('&');
                for (i = 0; i < values.length; i += 1) {
                    pair = values[i].split('=');
                    data[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]).replace(/\+/g, ' ');
                }
            }
            data[paramName] = paramValue;
            data.datestamp = new Date().toString();
            data.version = this.BannerVariables.otSDKVersion;
            value = moduleHelper.param(data);
            this.setCookie(cookieName, value, 365);
        };
        ExternalData.prototype.readCookieParam = function (cookieName, paramName) {
            var cookie = this.getCookie(cookieName);
            var i;
            var data;
            var values;
            var pair;
            if (cookie) {
                data = {};
                values = cookie.split('&');
                for (i = 0; i < values.length; i += 1) {
                    pair = values[i].split('=');
                    data[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]).replace(/\+/g, ' ');
                }
                if (paramName && data[paramName]) {
                    // Found cookie value for valid param
                    return data[paramName];
                }
                if (paramName && !data[paramName]) {
                    // Found no cookie value for valid param
                    return '';
                }
                // Invalid param, returns entire cookie
                return data;
            }
            return '';
        };
        ExternalData.prototype.getCookie = function (name) {
            if (moduleInitializer.moduleInitializer.MobileSDK) {
                var data = this.getCookieDataObj(name);
                if (data) {
                    return data.value;
                }
            }
            var nameEq = name + '=';
            var ca = document.cookie.split(';');
            var i;
            var c;
            for (i = 0; i < ca.length; i += 1) {
                c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEq) === 0) {
                    return c.substring(nameEq.length, c.length);
                }
            }
            return null;
        };
        ExternalData.prototype.setCookie = function (name, value, days, deleteCookie) {
            if (deleteCookie === void 0) { deleteCookie = false; }
            var expires, date;
            if (days) {
                date = new Date();
                date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
                expires = '; expires=' + date.toUTCString();
            }
            else {
                expires = deleteCookie ? "; expires=" + new Date(0).toUTCString() : '';
            }
            var domainAndPath = this.BannerVariables.commonData.optanonCookieDomain.split('/');
            if (domainAndPath.length <= 1) {
                domainAndPath[1] = '';
            }
            if (moduleInitializer.moduleInitializer.ScriptType ===
                this.BannerVariables.constant.TESTSCRIPT ||
                moduleInitializer.moduleInitializer.MobileSDK) {
                var cookie = value + expires + '; path=/; Samesite=Lax';
                if (moduleInitializer.moduleInitializer.MobileSDK) {
                    this.setCookieDataObj({
                        name: name,
                        value: value,
                        expires: expires,
                        date: date,
                        domainAndPath: domainAndPath
                    });
                }
                else {
                    document.cookie = name + '=' + cookie;
                }
            }
            else {
                var cookie = value +
                    expires +
                    '; path=/' +
                    domainAndPath[1] +
                    '; domain=.' +
                    domainAndPath[0] +
                    '; Samesite=Lax';
                document.cookie = name + '=' + cookie;
            }
        };
        ExternalData.prototype.reconsentRequired = function () {
            return (moduleInitializer.moduleInitializer.MobileSDK || this.awaitingReconsent()) && this.needReconsent();
        };
        ExternalData.prototype.awaitingReconsent = function () {
            return (this.readCookieParam(this.BannerVariables.optanonCookieName, this.BannerVariables.optanonAwaitingReconsentName) === 'true');
        };
        ExternalData.prototype.needReconsent = function () {
            var json = this.BannerVariables.domainData;
            var cookieDate = this.alertBoxCloseDate();
            var reconsentDate = json.LastReconsentDate;
            return (cookieDate &&
                reconsentDate &&
                new Date(reconsentDate) > new Date(cookieDate));
        };
        ExternalData.prototype.iabTypeIsChanged = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.isIabCookieValid()) {
                        externalData.setCookie(externalData.BannerVariables.optanonAlertBoxClosedCookieName, '', 0, true);
                    }
                    return [2 /*return*/];
                });
            });
        };
        ExternalData.prototype.alertBoxCloseDate = function () {
            return this.getCookie(this.BannerVariables.optanonAlertBoxClosedCookieName);
        };
        // From externalResource
        // TODO need to make sure publicAPI references this otCookieData
        ExternalData.prototype.setCookieDataObj = function (data) {
            if (data) {
                if (!this.otCookieData) {
                    if (window.OneTrust && window.OneTrust.otCookieData) {
                        this.otCookieData = window.OneTrust.otCookieData;
                    }
                    else {
                        this.otCookieData = [];
                    }
                }
                var idx_1 = -1;
                this.otCookieData.some(function (val, index) {
                    if (val.name === data.name) {
                        idx_1 = index;
                        return true;
                    }
                });
                if (idx_1 > -1) {
                    this.otCookieData[idx_1] = data;
                }
                else {
                    this.otCookieData.push(data);
                }
            }
        };
        ExternalData.prototype.getCookieDataObj = function (name) {
            if (!this.otCookieData) {
                if (window.OneTrust && window.OneTrust.otCookieData) {
                    this.otCookieData = window.OneTrust.otCookieData;
                }
                else {
                    this.otCookieData = [];
                }
            }
            var idx = -1;
            this.otCookieData.some(function (val, index) {
                if (val.name === name) {
                    idx = index;
                    return true;
                }
            });
            if (idx >= 0) {
                var val = this.otCookieData[idx];
                if (val.date) {
                    var expire = new Date(val.date);
                    var now = new Date();
                    if (expire < now) {
                        this.otCookieData[idx] = null;
                        return null;
                    }
                    else {
                        return val;
                    }
                }
            }
            return null;
        };
        ExternalData.prototype.isIabCookieValid = function () {
            var isIabCookieValid = null;
            switch (externalData.iabType) {
                case 'IAB':
                    isIabCookieValid = this.getCookie('eupubconsent'); // TODO: read it from enums
                    break;
                case 'IAB2':
                    isIabCookieValid = this.getCookie('eupubconsent-v2');
                    break;
            }
            return isIabCookieValid === null ? false : true;
        };
        // From PublicAPI
        ExternalData.prototype.isAlertBoxClosedAndValid = function () {
            if (this.alertBoxCloseDate() === null) {
                return false;
            }
            return !this.reconsentRequired();
        };
        ExternalData.prototype.extractGroupIdForIabGroup = function (purposeId) {
            if (this.iabType === 'IAB') {
                purposeId = purposeId.replace('IAB', '');
            }
            else if (this.iabType === 'IAB2') {
                if (purposeId.indexOf('ISPV2_') > -1) { // Special purpose
                    purposeId = purposeId.replace('ISPV2_', '');
                }
                else if (purposeId.indexOf('IABV2_') > -1) { // Purpose
                    purposeId = purposeId.replace('IABV2_', '');
                }
                else if (purposeId.indexOf('IFEV2_') > -1) { // Feature
                    purposeId = purposeId.replace('IFEV2_', '');
                }
                else if (purposeId.indexOf('ISFV2_') > -1) { // Spcieal feature
                    purposeId = purposeId.replace('ISFV2_', '');
                }
            }
            return purposeId;
        };
        ExternalData.prototype.getOptanonIdForIabGroup = function (id, groupType) {
            var optanonId;
            if (this.iabType === 'IAB') {
                optanonId = 'IAB' + id;
            }
            else if (this.iabType === 'IAB2') {
                if (groupType === ConsentGroupType.Purpose) {
                    optanonId = 'IABV2_' + id;
                }
                else if (groupType === ConsentGroupType.SpecialFeature) {
                    optanonId = 'ISFV2_' + id;
                }
            }
            return optanonId;
        };
        return ExternalData;
    }());
    var externalData = new ExternalData();

    var OneTrustBannerLibrary = /** @class */ (function () {
        function OneTrustBannerLibrary(el, type) {
            if (type === void 0) { type = ''; }
            this.selector = el;
            this.useEl = false;
            switch (type) {
                case 'ce':
                    var browerType = OneTrustBannerLibrary.browser().type.toLowerCase();
                    var browerVersion = OneTrustBannerLibrary.browser().version;
                    if ((browerVersion < 10 && browerType === 'safari') ||
                        (browerType === 'chrome' && browerVersion <= 44) ||
                        (browerVersion <= 40 && browerType === 'firefox')) {
                        var tmp = document.implementation.createHTMLDocument();
                        tmp.body.innerHTML = el;
                        this.el = tmp.body.children[0];
                    }
                    else {
                        var documentFragment = document
                            .createRange()
                            .createContextualFragment(el);
                        this.el = documentFragment.firstChild;
                    }
                    this.length = 1;
                    break;
                case '':
                    this.el =
                        el === document || el === window
                            ? document.documentElement
                            : typeof el !== 'string'
                                ? el
                                : document.querySelectorAll(el);
                    this.length =
                        el === document || el === window || typeof el !== 'string'
                            ? 1
                            : this.el.length;
                    break;
                default:
                    this.length = 0;
            }
        }
        OneTrustBannerLibrary.insertAfter = function (newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        };
        OneTrustBannerLibrary.insertBefore = function (newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode);
        };
        OneTrustBannerLibrary.inArray = function (value, arr) {
            return arr.indexOf(value);
        };
        OneTrustBannerLibrary.otFetchOfflineFile = function (url) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    externalData.otFetchOfflineFile(url);
                    return [2 /*return*/];
                });
            });
        };
        OneTrustBannerLibrary.ajax = function (options) {
            var type, url, dataType, contentType, data, success, error = null, sync = false;
            var request = new XMLHttpRequest();
            (type = options.type, url = options.url, dataType = options.dataType, contentType = options.contentType, data = options.data, success = options.success, error = options.error, sync = options.sync);
            request.open(type, url, !sync);
            request.setRequestHeader('Content-Type', contentType);
            request.onload = function () {
                if (this.status >= 200 && this.status < 400) {
                    // Success!
                    var response = JSON.parse(this.responseText);
                    success(response);
                }
                else {
                    // We reached our target server, but it returned an error
                    error({
                        message: 'Error Loading Data',
                        statusCode: this.status
                    });
                }
            };
            request.onerror = function (err) {
                // There was a connection error of some sort
                error(err);
            };
            type.toLowerCase() === 'post' || type.toLowerCase() === 'put'
                ? request.send(data)
                : request.send();
        };
        OneTrustBannerLibrary.getJSON = function (url, callback, error) {
            externalData.getJSON(url, callback, error);
        };
        OneTrustBannerLibrary.prevNextHelper = function (property, item, modifier) {
            var domEl = [];
            typeof item === 'string'
                ? Array.prototype.forEach.call(document.querySelectorAll(item), function (element, idx) {
                    executePrevNextHelper(property, element, modifier);
                })
                : executePrevNextHelper(property, item, modifier);
            function executePrevNextHelper(property, element, modifier) {
                if (element[property] && modifier) {
                    if (modifier.includes('.')) {
                        if (element[property].classList[0] ||
                            (element[property].classList.value &&
                                element[property].classList.value.includes(modifier.split('.')[1]))) {
                            domEl.push(element[property]);
                        }
                    }
                    else if (modifier.includes('#')) {
                        if (element[property].id === modifier.split('#')[1]) {
                            domEl.push(element[property]);
                        }
                    }
                    else {
                        if (element[property].tagName ===
                            document.createElement(modifier.trim()).tagName) {
                            domEl.push(element[property]);
                        }
                    }
                }
                else {
                    if (element[property]) {
                        domEl.push(element[property]);
                    }
                }
            }
            return domEl;
        };
        OneTrustBannerLibrary.browser = function () {
            navigator.sayswho = (function () {
                var ua = navigator.userAgent;
                var tem;
                var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
                if (/trident/i.test(M[1])) {
                    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                    return 'IE ' + (tem[1] || '');
                }
                if (M[1] === 'Chrome') {
                    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
                    if (tem != null) {
                        return tem
                            .slice(1)
                            .join(' ')
                            .replace('OPR', 'Opera');
                    }
                }
                M = M[2]
                    ? [M[1], M[2]]
                    : [navigator.appName, navigator.appVersion, '-?'];
                if ((tem = ua.match(/version\/(\d+)/i)) != null) {
                    M.splice(1, 1, tem[1]);
                }
                return M.join(' ');
            })();
            var version = parseInt(navigator.sayswho.split(' ')[1]);
            var type = navigator.sayswho.split(' ')[0];
            var specs = {
                version: version,
                type: type,
                userAgent: navigator.userAgent
            };
            return specs;
        };
        OneTrustBannerLibrary.isNodeList = function (obj) {
            if (Object.prototype.toString.call(obj) === '[object NodeList]') {
                return true;
            }
            else {
                return false;
            }
        };
        OneTrustBannerLibrary.jsonp = function (url, successCallBack, errorCallBack) {
            if (!externalData.checkMobileOfflineRequest(url)) {
                externalData.BannerVariables.mobileOnlineURL.push(url);
            }
            var script = document.createElement('script'), head = document.getElementsByTagName('head')[0];
            function success() {
                // Handle Success Here after jsonp call is fixed on server.
                successCallBack();
            }
            function error() {
                errorCallBack();
            }
            script.onreadystatechange = function () {
                if (this.readyState === 'loaded' || this.readyState === 'complete') {
                    success();
                }
            };
            script.onload = success;
            script.onerror = error;
            script.type = 'text/javascript';
            script.async = true;
            script.src = url || '';
            head.appendChild(script);
        };
        OneTrustBannerLibrary.prototype.fadeOut = function (duration) {
            var _this = this;
            if (duration === void 0) { duration = 60; }
            if (this.el.length >= 1) {
                for (var i = 0; i < this.el.length; i++) {
                    this.el[i].style.visibility = 'hidden';
                    this.el[i].style.opacity = '0';
                    this.el[i].style.transition = "visibility 0s " + duration + "ms, opacity " + duration + "ms linear";
                }
            }
            var timer = setInterval(function () {
                if (_this.el.length >= 1) {
                    for (var i = 0; i < _this.el.length; i++) {
                        if (_this.el[i].style.opacity <= 0) {
                            _this.el[i].style.display = 'none';
                            clearInterval(timer);
                            // Reset inline styles added to popup background
                            if (_this.el[i].id === 'optanon-popup-bg') {
                                _this.el[i].setAttribute('style', '');
                            }
                        }
                    }
                }
            }, duration);
            return this;
        };
        OneTrustBannerLibrary.prototype.hide = function () {
            if (this.el.length >= 1) {
                for (var i = 0; i < this.el.length; i++) {
                    this.el[i].style.display = 'none';
                }
            }
            else {
                if (!OneTrustBannerLibrary.isNodeList(this.el)) {
                    this.el.style.display = 'none';
                }
            }
            return this;
        };
        OneTrustBannerLibrary.prototype.show = function (displayType) {
            if (displayType === void 0) { displayType = 'block'; }
            if (this.el.length >= 1) {
                for (var i = 0; i < this.el.length; i++) {
                    this.el[i].style.display = displayType;
                }
            }
            else {
                if (!OneTrustBannerLibrary.isNodeList(this.el)) {
                    this.el.style.display = displayType;
                }
            }
            return this;
        };
        OneTrustBannerLibrary.prototype.remove = function () {
            if (this.el.length >= 1) {
                for (var i = 0; i < this.el.length; i++) {
                    this.el[i].parentNode.removeChild(this.el[i]);
                }
            }
            else {
                this.el.parentNode.removeChild(this.el);
            }
            return this;
        };
        OneTrustBannerLibrary.prototype.css = function (val) {
            if (val) {
                if (this.el.length >= 1) {
                    if (val.includes(':')) {
                        for (var i = 0; i < this.el.length; i++) {
                            this.el[i].setAttribute('style', val);
                        }
                    }
                    else {
                        for (var i = 0; i < this.el.length; i++) {
                            return this.el[i].style[val];
                        }
                    }
                }
                else {
                    if (val.includes(':')) {
                        this.el.setAttribute('style', val);
                    }
                    else {
                        return this.el.style[val];
                    }
                }
            }
            return this;
        };
        OneTrustBannerLibrary.prototype.offset = function () {
            if (this.el.length >= 1) {
                return this.el[0].getBoundingClientRect();
            }
            else {
                return this.el.getBoundingClientRect();
            }
        };
        OneTrustBannerLibrary.prototype.prop = function (prop, value) {
            if (this.el.length >= 1) {
                for (var i = 0; i < this.el.length; i++) {
                    this.el[i][prop] = value;
                }
            }
            else {
                this.el[prop] = value;
            }
            return this;
        };
        OneTrustBannerLibrary.prototype.removeClass = function (className) {
            if (this.el.length >= 1) {
                for (var i = 0; i < this.el.length; i++) {
                    if (this.el[i].classList) {
                        this.el[i].classList.remove(className);
                    }
                    else {
                        this.el[i].className = this.el[i].className.replace(new RegExp('(^|\\b)' +
                            className.split(' ').join('|') +
                            '(\\b|$)', 'gi'), ' ');
                    }
                }
            }
            else {
                if (this.el.classList) {
                    this.el.classList.remove(className);
                }
                else {
                    this.el.className = this.el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
                }
            }
            return this;
        };
        OneTrustBannerLibrary.prototype.addClass = function (className) {
            if (this.el.length >= 1) {
                for (var i = 0; i < this.el.length; i++) {
                    if (this.el[i].classList) {
                        this.el[i].classList.add(className);
                    }
                    else {
                        this.el[i].className += " " + className;
                    }
                }
            }
            else {
                if (this.el.classList) {
                    this.el.classList.add(className);
                }
                else {
                    this.el.className += " " + className;
                }
            }
            return this;
        };
        OneTrustBannerLibrary.prototype.on = function (eventName, option1, option2) {
            var _this = this;
            if (typeof option1 !== 'string') {
                if ((this.el.nodeName === 'HTML' && eventName === 'load') ||
                    eventName === 'resize' ||
                    eventName === 'scroll') {
                    switch (eventName) {
                        case 'load':
                            window.onload = option1;
                            break;
                        case 'resize':
                            window.onresize = option1;
                            break;
                        case 'scroll':
                            window.onscroll = option1;
                            break;
                    }
                }
                else {
                    if (this.el.length >= 1) {
                        for (var i = 0; i < this.el.length; i++) {
                            this.el[i].addEventListener(eventName, option1);
                        }
                    }
                    else {
                        this.el.addEventListener(eventName, option1);
                    }
                }
            }
            else {
                if ((this.el.nodeName === 'HTML' && eventName === 'load') ||
                    eventName === 'resize' ||
                    eventName === 'scroll') {
                    switch (eventName) {
                        case 'load':
                            window.onload = option2;
                            break;
                        case 'resize':
                            window.onresize = option2;
                            break;
                        case 'scroll':
                            window.onscroll = option2;
                            break;
                    }
                }
                else {
                    var parentEvent_1 = function (e) {
                        var element = e.target;
                        _this.el.eventExecuted = true;
                        Array.prototype.forEach.call(document.querySelectorAll(option1), function (el, idx) {
                            el.addEventListener(eventName, option2);
                            if (el === element && option2) {
                                option2.call(el, e);
                            }
                        });
                        if (_this.el[0]) {
                            _this.el[0].removeEventListener(eventName, parentEvent_1);
                        }
                        else {
                            _this.el.removeEventListener(eventName, parentEvent_1);
                        }
                    };
                    if (this.el.length >= 1) {
                        for (var i = 0; i < this.el.length; i++) {
                            this.el[i].eventExecuted = false;
                            if (!this.el[i].eventExecuted) {
                                this.el[i].addEventListener(eventName, parentEvent_1);
                            }
                        }
                    }
                    else {
                        this.el.eventExecuted = false;
                        if (!this.el.eventExecuted) {
                            this.el.addEventListener(eventName, parentEvent_1);
                        }
                    }
                }
            }
            return this;
        };
        OneTrustBannerLibrary.prototype.off = function (eventName, eventHandler) {
            if (this.el.length >= 1) {
                for (var i = 0; i < this.el.length; i++) {
                    this.el[i].removeEventListener(eventName, eventHandler);
                }
            }
            else {
                this.el.removeEventListener(eventName, eventHandler);
            }
            return this;
        };
        OneTrustBannerLibrary.prototype.one = function (eventName, eventHandler) {
            if (this.el.length >= 1) {
                for (var i = 0; i < this.el.length; i++) {
                    this.el[i].addEventListener(eventName, function (e) {
                        e.stopPropagation();
                        if (e.currentTarget.dataset.triggered) {
                            return;
                        }
                        eventHandler();
                        e.currentTarget.dataset.triggered = true;
                    });
                }
            }
            else {
                this.el.addEventListener(eventName, function (e) {
                    e.stopPropagation();
                    if (e.currentTarget.dataset.triggered) {
                        return;
                    }
                    eventHandler();
                    e.currentTarget.dataset.triggered = true;
                });
            }
            return this;
        };
        OneTrustBannerLibrary.prototype.trigger = function (customEvent) {
            var event = new CustomEvent(customEvent, {
                customEvent: 'yes'
            });
            this.el.dispatchEvent(event);
            return this;
        };
        OneTrustBannerLibrary.prototype.focus = function () {
            if (this.el.length >= 1) {
                this.el[0].focus();
            }
            else {
                this.el.focus();
            }
            return this;
        };
        OneTrustBannerLibrary.prototype.attr = function (attribute, value) {
            if (this.el.length >= 1) {
                if (value) {
                    if (attribute === 'class') {
                        this.addClass(value);
                    }
                    else {
                        this.el[0].setAttribute(attribute, value);
                    }
                    return this;
                }
                else {
                    return this.el[0].getAttribute(attribute);
                }
            }
            else {
                if (value) {
                    if (attribute === 'class') {
                        this.addClass(value);
                    }
                    else {
                        this.el.setAttribute(attribute, value);
                    }
                    return this;
                }
                else {
                    return this.el.getAttribute(attribute);
                }
            }
        };
        OneTrustBannerLibrary.prototype.html = function (element) {
            if (element === undefined || element === null) {
                if (this.el.length >= 1) {
                    for (var i = 0; i < this.el.length; i++) {
                        return this.el[i].innerHTML;
                    }
                }
                else {
                    return this.el.innerHTML;
                }
            }
            else {
                if (this.el.length >= 1) {
                    for (var i = 0; i < this.el.length; i++) {
                        this.el[i].innerHTML = element;
                    }
                }
                else {
                    this.el.innerHTML = element;
                }
            }
            return this;
        };
        OneTrustBannerLibrary.prototype.append = function (element) {
            if (typeof element === 'string' &&
                !element.includes('<') &&
                !element.includes('>')) {
                this.el.insertAdjacentText('beforeend', element);
            }
            else {
                if (Array.isArray(element)) {
                    var self_1 = this;
                    Array.prototype.forEach.call(element, function (domEl, idx) {
                        document
                            .querySelector(self_1.selector)
                            .appendChild(new OneTrustBannerLibrary(domEl, 'ce').el);
                    });
                }
                else if (typeof element !== 'string' && !Array.isArray(element)) {
                    if (typeof this.selector === 'string') {
                        document.querySelector(this.selector).appendChild(element);
                    }
                    else {
                        if (element.length >= 1) {
                            for (var i = 0; i < element.length; i++) {
                                this.selector.appendChild(element[i]);
                            }
                        }
                        else {
                            this.selector.appendChild(element);
                        }
                    }
                }
                else {
                    if (typeof this.selector === 'string') {
                        document
                            .querySelector(this.selector)
                            .appendChild(new OneTrustBannerLibrary(element, 'ce').el);
                    }
                    else {
                        if (this.useEl) {
                            var frag_1 = document.createDocumentFragment();
                            var isTableEl_1 = !!(element.includes('<th') ||
                                element.includes('<td'));
                            if (isTableEl_1) {
                                var el = element
                                    .split(' ')[0]
                                    .split('<')[1];
                                frag_1.appendChild(document.createElement(el));
                                frag_1.firstChild.innerHTML = element;
                            }
                            Array.prototype.forEach.call(this.el, function (domEl, idx) {
                                if (isTableEl_1) {
                                    domEl.appendChild(frag_1.firstChild);
                                }
                                else {
                                    domEl.appendChild(new OneTrustBannerLibrary(element, 'ce').el);
                                }
                            });
                        }
                        else {
                            this.selector.appendChild(new OneTrustBannerLibrary(element, 'ce').el);
                        }
                    }
                }
            }
            return this;
        };
        OneTrustBannerLibrary.prototype.text = function (string) {
            if (this.el) {
                if (this.el.length >= 1) {
                    if (!string) {
                        return this.el[0].textContent;
                    }
                    else {
                        Array.prototype.forEach.call(this.el, function (element, idx) {
                            element.textContent = string;
                        });
                    }
                }
                else {
                    if (!string) {
                        return this.el.textContent;
                    }
                    else {
                        this.el.textContent = string;
                    }
                }
                return this;
            }
        };
        OneTrustBannerLibrary.prototype.data = function (key, value) {
            if (this.el.length < 1) {
                return this;
            }
            else {
                if (this.el.length >= 1) {
                    Array.prototype.forEach.call(this.el, function (element, idx) {
                        executeData(element, value);
                    });
                }
                else {
                    return executeData(this.el, value);
                }
            }
            function executeData(element, value) {
                if (!value) {
                    return JSON.parse(element.getAttribute('data-' + key));
                }
                else {
                    if (typeof value === 'object') {
                        element.setAttribute('data-' + key, JSON.stringify(value));
                    }
                    else {
                        element.setAttribute('data-' + key, value);
                    }
                }
            }
            return this;
        };
        OneTrustBannerLibrary.prototype.height = function (value) {
            if (this.el.length) {
                this.el = this.el[0];
            }
            var pt = parseInt(window
                .getComputedStyle(this.el, null)
                .getPropertyValue('padding-top')
                .split('px')[0]);
            var pb = parseInt(window
                .getComputedStyle(this.el, null)
                .getPropertyValue('padding-bottom')
                .split('px')[0]);
            var mt = parseInt(window
                .getComputedStyle(this.el, null)
                .getPropertyValue('margin-top')
                .split('px')[0]);
            var mb = parseInt(window
                .getComputedStyle(this.el, null)
                .getPropertyValue('margin-bottom')
                .split('px')[0]);
            var height = parseInt(window
                .getComputedStyle(this.el, null)
                .getPropertyValue('height')
                .split('px')[0]);
            var arr = [pt, pb, mt, mb];
            var totalHeight = 0;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] > 0) {
                    totalHeight += arr[i];
                }
            }
            if (value) {
                var unit = value.toString().split(parseInt(value))[1]
                    ? value.toString().split(parseInt(value))[1]
                    : 'px';
                var extractedValue = typeof value === 'number'
                    ? value
                    : parseInt(value.toString().split(unit)[0]);
                if ((unit && unit === 'px') ||
                    unit === '%' ||
                    unit === 'em' ||
                    unit === 'rem') {
                    if (extractedValue > 0) {
                        this.el.style.height = totalHeight + extractedValue + unit;
                    }
                    else {
                        if (value === 'auto') {
                            this.el.style.height = value;
                        }
                    }
                }
            }
            else {
                if (this.selector === document) {
                    return height;
                }
                else {
                    return this.el.clientHeight - totalHeight;
                }
            }
            return this;
        };
        OneTrustBannerLibrary.prototype.find = function (selector) {
            var list = [];
            if (selector) {
                // Id, Class, Tag, DOM Element
                if (typeof selector === 'string') {
                    var isClass = selector.split('')[0] === '.';
                    var isId = selector.split('')[0] === '#';
                    if (!isClass && !isId) {
                        Array.prototype.forEach.call(this.el.childNodes, function (element, idx) {
                            if (element.tagName.toLowerCase() === selector) {
                                list.push(element);
                            }
                        });
                    }
                    else {
                        var identifier_1 = isClass ? 'classList' : 'id';
                        Array.prototype.forEach.call(this.el.childNodes, function (element, idx) {
                            if (typeof element[identifier_1].includes ===
                                'function' &&
                                element[identifier_1].includes(selector.split(selector.split('')[0])[1])) {
                                list.push(element);
                            }
                            else {
                                if (element[identifier_1] &&
                                    element[identifier_1].contains(selector.split(selector.split('')[0])[1])) {
                                    list.push(element);
                                }
                            }
                        });
                    }
                }
                this.el = list;
                this.useEl = true;
            }
            return this;
        };
        OneTrustBannerLibrary.prototype.each = function (callback) {
            var convertBack = false;
            if (this.el.length === undefined) {
                this.el = [this.el];
                convertBack = true;
            }
            Array.prototype.forEach.call(this.el, callback);
            if (convertBack) {
                this.el = this.el[0];
            }
            return this;
        };
        OneTrustBannerLibrary.prototype.parent = function (selector) {
            var list = [];
            var isList = Object.prototype.toString
                .call(this.el)
                .includes('NodeList');
            if (isList) {
                Array.prototype.forEach.call(this.el, function (element, idx) {
                    list.push(element.parentNode);
                });
            }
            else {
                list.push(this.el.parentNode);
            }
            list = list.filter(function (x, i, a) {
                return a.indexOf(x) === i;
            });
            if (selector) {
                var filteredList_1 = [];
                list.forEach(function (item) {
                    if (selector.includes('.')) {
                        for (var i = 0; i < item.classList.length; i++) {
                            if (item.classList[i].includes(selector.split('.')[1])) {
                                filteredList_1.push(item);
                            }
                        }
                    }
                    else {
                        if (item.id === selector.split('#')[1]) {
                            filteredList_1.push(item);
                        }
                    }
                });
                list = filteredList_1;
            }
            this.el = list;
            return this;
        };
        OneTrustBannerLibrary.prototype.is = function (selector) {
            if (this.el.length) {
                return (this.el[0].matches ||
                    this.el[0].matchesSelector ||
                    this.el[0].msMatchesSelector ||
                    this.el[0].mozMatchesSelector ||
                    this.el[0].webkitMatchesSelector ||
                    this.el[0].oMatchesSelector).call(this.el[0], selector);
            }
            else {
                return (this.el.matches ||
                    this.el.matchesSelector ||
                    this.el.msMatchesSelector ||
                    this.el.mozMatchesSelector ||
                    this.el.webkitMatchesSelector ||
                    this.el.oMatchesSelector).call(this.el, selector);
            }
        };
        OneTrustBannerLibrary.prototype.hasClass = function (className) {
            if (this.el.length === undefined) {
                return this.el.classList.contains(className);
            }
            else {
                return this.el[0].classList.contains(className);
            }
        };
        OneTrustBannerLibrary.prototype.filter = function (filterFn) {
            this.el = Array.prototype.filter.call(document.querySelectorAll(this.selector), filterFn);
            return this;
        };
        OneTrustBannerLibrary.prototype.replaceWith = function (string) {
            if (typeof this.selector !== 'string') {
                this.el.outerHTML = string;
            }
            else {
                Array.prototype.forEach.call(document.querySelectorAll(this.selector), function (element, idx) {
                    element.outerHTML = string;
                });
            }
            return this;
        };
        OneTrustBannerLibrary.prototype.prepend = function (el) {
            Array.prototype.forEach.call(document.querySelectorAll(this.selector), function (parent, idx) {
                parent.insertBefore(new OneTrustBannerLibrary(el, 'ce').el, parent.firstChild);
            });
            return this;
        };
        OneTrustBannerLibrary.prototype.prev = function (modifier) {
            this.el = OneTrustBannerLibrary.prevNextHelper('previousElementSibling', this.selector, modifier);
            return this;
        };
        OneTrustBannerLibrary.prototype.next = function (modifier) {
            this.el = OneTrustBannerLibrary.prevNextHelper('nextElementSibling', this.selector, modifier);
            return this;
        };
        OneTrustBannerLibrary.prototype.before = function (htmlString) {
            Array.prototype.forEach.call(document.querySelectorAll(this.selector), function (element, idx) {
                element.insertAdjacentHTML('beforebegin', htmlString);
            });
            return this;
        };
        OneTrustBannerLibrary.prototype.after = function (htmlString) {
            Array.prototype.forEach.call(document.querySelectorAll(this.selector), function (element, idx) {
                element.insertAdjacentHTML('afterend', htmlString);
            });
            return this;
        };
        OneTrustBannerLibrary.prototype.siblings = function () {
            var _this = this;
            return Array.prototype.filter.call(this.el[0].parentNode.children, function (child) {
                return child !== _this.el[0];
            });
        };
        OneTrustBannerLibrary.prototype.outerHeight = function () {
            if (typeof this.selector !== 'string') {
                Array.prototype.forEach.call(this.selector, function (element, idx) {
                    return element.offsetHeight;
                });
            }
            else {
                return document.querySelector(this.selector)
                    .offsetHeight;
            }
        };
        OneTrustBannerLibrary.prototype.animate = function (properties, duration) {
            var _this = this;
            this.el = document.querySelector(this.selector);
            var _loop_1 = function (prop) {
                var animate = function () {
                    var value = parseInt(properties[prop]);
                    var unit = properties[prop].split(parseInt(properties[prop]))[1]
                        ? properties[prop].split(parseInt(properties[prop]))[1]
                        : 'px';
                    var keyFrames = "\n                      @keyframes slide-" + (prop === 'top' ? 'up' : 'down') + "-custom {\n                          0% {\n                              " + (prop === 'top' ? 'top' : 'bottom') + ": " + (prop === 'top'
                        ? _this.el.getBoundingClientRect().top
                        : window.innerHeight) + "px !important;\n                          }\n                          100% {\n                              " + (prop === 'top' ? 'top' : 'bottom') + ": " + (value +
                        unit) + ";\n                          }\n                      }\n                      @-webkit-keyframes slide-" + (prop === 'top' ? 'up' : 'down') + "-custom {\n                          0% {\n                              " + (prop === 'top' ? 'top' : 'bottom') + ": " + (prop === 'top'
                        ? _this.el.getBoundingClientRect().top
                        : window.innerHeight) + "px !important;\n                          }\n                          100% {\n                              " + (prop === 'top' ? 'top' : 'bottom') + ": " + (value +
                        unit) + ";\n                          }\n                      }\n                      @-moz-keyframes slide-" + (prop === 'top' ? 'up' : 'down') + "-custom {\n                          0% {\n                              " + (prop === 'top' ? 'top' : 'bottom') + ": " + (prop === 'top'
                        ? _this.el.getBoundingClientRect().top
                        : window.innerHeight) + "px !important;\n                          }\n                          100% {\n                              " + (prop === 'top' ? 'top' : 'bottom') + ": " + (value +
                        unit) + ";\n                          }\n                      }\n                      ";
                    var currentCSS = document.head.querySelector('#onetrust-style');
                    if (currentCSS) {
                        currentCSS.innerHTML += keyFrames;
                    }
                    else {
                        var style = document.createElement('style');
                        style.id = 'onetrust-legacy-style';
                        style.type = 'text/css';
                        style.innerHTML = keyFrames;
                        document.head.appendChild(style);
                    }
                    if ((OneTrustBannerLibrary.browser().type =
                        OneTrustBannerLibrary.browser().version <= 8)) {
                        var animation = prop === 'top'
                            ? '-webkit-animation: slide-up-custom '
                            : '-webkit-animation: slide-down-custom ' +
                                duration +
                                'ms' +
                                ' ease-out forwards;';
                        _this.el.setAttribute('style', animation);
                    }
                    else {
                        _this.el.style.animationName =
                            prop === 'top'
                                ? 'slide-up-custom'
                                : 'slide-down-custom';
                        _this.el.style.animationDuration = duration + 'ms';
                        _this.el.style.animationFillMode = 'forwards';
                        _this.el.style.animationTimingFunction = 'ease-out';
                    }
                };
                animate();
            };
            for (var prop in properties) {
                _loop_1(prop);
            }
            return this;
        };
        OneTrustBannerLibrary.prototype.wrap = function (wrappingElement) {
            Array.prototype.forEach.call(document.querySelectorAll(this.selector), function (element, idx) {
                var wrapper;
                var browerType = OneTrustBannerLibrary.browser().type.toLowerCase();
                var browerVersion = OneTrustBannerLibrary.browser().version;
                if ((browerVersion < 10 && browerType === 'safari') ||
                    (browerType === 'chrome' && browerVersion <= 44) ||
                    (browerVersion <= 40 && browerType === 'firefox')) {
                    var tmp = document.implementation.createHTMLDocument();
                    tmp.body.innerHTML = wrappingElement;
                    wrapper = tmp.body.children[0];
                }
                else {
                    wrapper = document
                        .createRange()
                        .createContextualFragment(wrappingElement).firstChild;
                }
                element.parentNode.insertBefore(wrapper, element);
                wrapper.appendChild(element);
            });
            return this;
        };
        OneTrustBannerLibrary.prototype.scrollTop = function () {
            return this.el.scrollTop;
        };
        return OneTrustBannerLibrary;
    }());
    var OT = function (el, type) {
        if (type === void 0) { type = ''; }
        return new OneTrustBannerLibrary(el, type);
    };

    /**
     * This class holds things from externalData that are dependent on other classes to avoid circular dependencies
     * We may want to rename this at some point.
     */
    var HelperNext = /** @class */ (function () {
        function HelperNext() {
        }
        // TODO typing
        HelperNext.prototype.setUseDocumentLanguage = function (isDocumentLanguage) {
            languageSwitcher.setUseDocumentLanguage(isDocumentLanguage);
        };
        HelperNext.prototype.getCookie = function (cookieName) {
            return externalData.getCookie(cookieName);
        };
        HelperNext.prototype.isIABCrossConsentEnabled = function () {
            return externalData.isIABCrossConsentEnabled();
        };
        HelperNext.prototype.setDomainElementAttributes = function () {
            if (!externalData.bannerScriptElement) {
                return;
            }
            if (externalData.bannerScriptElement.hasAttribute(externalData.BannerVariables.constant.documentLanguageAttibute)) {
                helperNext.setUseDocumentLanguage(externalData.bannerScriptElement.getAttribute(externalData.BannerVariables.constant.documentLanguageAttibute) === 'true');
            }
            if (externalData.bannerScriptElement.hasAttribute(externalData.BannerVariables.constant.IGNOREGA)) {
                externalData.BannerVariables.ignoreGoogleAnlyticsCall =
                    externalData.bannerScriptElement.getAttribute(externalData.BannerVariables.constant.IGNOREGA) === 'true';
            }
            if (externalData.bannerScriptElement.hasAttribute(externalData.BannerVariables.constant.IGNOREHTMLCSS)) {
                externalData.BannerVariables.ignoreInjectingHtmlCss =
                    externalData.bannerScriptElement.getAttribute(externalData.BannerVariables.constant.IGNOREHTMLCSS) === 'true';
            }
        };
        HelperNext.prototype.setBannerScriptElement = function (scriptElement) {
            externalData.bannerScriptElement = scriptElement;
            this.setDomainElementAttributes();
        };
        return HelperNext;
    }());
    var helperNext;
    function initializeHelperNext() {
        helperNext = new HelperNext();
    }

    var IabNext = /** @class */ (function () {
        function IabNext() {
        }
        IabNext.prototype.getIABConsentData = function () {
            if (externalData.BannerVariables.domainData.IabType === 'IAB2') {
                var tcfSDKReference = externalData.iabStringSDK();
                var tcString = tcfSDKReference.tcString();
                // Unset all puposes and vendors
                externalData.tcModel.unsetAllPurposeConsents();
                externalData.tcModel.unsetAllVendorConsents();
                externalData.tcModel.unsetAllSpecialFeatureOptIns();
                // Update purposes consent based on selection
                externalData.tcModel.purposeConsents.set(moduleHelper.getActiveIdArray(externalData.BannerVariables.oneTrustIABConsent.purpose));
                // Update vendors consent based on selection
                externalData.tcModel.vendorConsents.set(moduleHelper.getActiveIdArray(moduleHelper.distinctArray(externalData.BannerVariables.oneTrustIABConsent.vendors)));
                // Update special features consent based on selection
                externalData.tcModel.specialFeatureOptIns.set(moduleHelper.getActiveIdArray(externalData.BannerVariables.oneTrustIABConsent.specialFeatures));
                externalData.cmpApi.tcModel = externalData.tcModel; // Copy to cmpApi tcModel
                return tcString.encode(externalData.tcModel);
            }
            else {
                var IABJsonData = externalData.BannerVariables.iabData; // IAB data from domain json
                var consentData = void 0;
                if (externalData.BannerVariables.oneTrustIABConsent.IABCookieValue &&
                    !externalData.reconsentRequired()) {
                    // When consent is already given and require reconsent not enabled
                    consentData = externalData.iabStringSDK(externalData.BannerVariables.oneTrustIABConsent.IABCookieValue);
                }
                else {
                    consentData = externalData.iabStringSDK();
                    consentData.setCmpId(parseInt(IABJsonData.cmpId)); // CMP id
                    consentData.setCmpVersion(parseInt(IABJsonData.cmpVersion)); // CMP version
                    consentData.setConsentLanguage(IABJsonData.consentLanguage); // Consent language
                    consentData.setConsentScreen(parseInt(IABJsonData.consentScreen)); // Consent screen
                }
                consentData.setGlobalVendorList(externalData.BannerVariables.oneTrustIABConsent.vendorList); // Initialize the lib with IAB json
                // Update purposes consent
                consentData.setPurposesAllowed(moduleHelper.getActiveIdArray(externalData.BannerVariables.oneTrustIABConsent.purpose));
                // Update vendors consent
                consentData.setVendorsAllowed(moduleHelper.getActiveIdArray(moduleHelper.distinctArray(externalData.BannerVariables.oneTrustIABConsent.vendors)));
                return consentData.getConsentString(); // Returns base 64 string
            }
        };
        IabNext.prototype.decodeTCString = function (tcString) {
            var tcfSDKReference = externalData.iabStringSDK();
            return tcfSDKReference.tcString().decode(tcString);
        };
        IabNext.prototype.getPingRequest = function (callback) {
            var pingData = {
                gdprAppliesGlobally: externalData.BannerVariables.oneTrustIABgdprAppliesGlobally,
                cmpLoaded: externalData.BannerVariables.oneTrustIABConsent.vendorList &&
                    !(externalData.BannerVariables.oneTrustIABgdprAppliesGlobally == null)
            };
            return callback(pingData, true);
        };
        IabNext.prototype.getVendorConsentsRequest = function (callback, param) {
            var IABJsonData = externalData.BannerVariables.iabData; // IAB data from domain json
            var vendorsArray = moduleHelper.distinctArray(externalData.BannerVariables.oneTrustIABConsent.vendors);
            if (param && Array.isArray(param)) { // Filter vendors based on param
                vendorsArray = moduleHelper.getFilteredVenderList(vendorsArray, param);
            }
            var consentString = iabNext.getIABConsentData();
            var iabConsentData = externalData.iabStringSDK(consentString);
            var venderConsentData = {
                metadata: consentString,
                gdprApplies: externalData.BannerVariables.oneTrustIABgdprAppliesGlobally,
                hasGlobalScope: externalData.isIABCrossConsentEnabled(),
                cookieVersion: IABJsonData.cookieVersion,
                created: IABJsonData.createdTime,
                lastUpdated: IABJsonData.updatedTime,
                cmpId: iabConsentData.getCmpId(),
                cmpVersion: iabConsentData.getCmpVersion(),
                consentLanguage: iabConsentData.getConsentLanguage(),
                consentScreen: iabConsentData.getConsentScreen(),
                vendorListVersion: iabConsentData.getVendorListVersion(),
                maxVendorId: iabConsentData.getMaxVendorId(),
                purposeConsents: moduleHelper.convertIABVendorPurposeArrayToObject(externalData.BannerVariables.oneTrustIABConsent.purpose),
                vendorConsents: moduleHelper.convertIABVendorPurposeArrayToObject(vendorsArray)
            };
            return callback(venderConsentData, true);
        };
        IabNext.prototype.getConsentDataRequest = function (callback) {
            var consentData = {
                gdprApplies: externalData.BannerVariables.oneTrustIABgdprAppliesGlobally,
                hasGlobalScope: helperNext.isIABCrossConsentEnabled(),
                consentData: externalData.BannerVariables.oneTrustIABConsent.IABCookieValue ||
                    iabNext.getIABConsentData()
            };
            return callback(consentData, true);
        };
        IabNext.prototype.getVendorConsentsRequestV2 = function (callback) {
            var result;
            window.__tcfapi('getInAppTCData', 2, function (inAppTCData, success) {
                result = [
                    inAppTCData,
                    success,
                ];
            });
            return callback.apply(this, result);
        };
        IabNext.prototype.getPingRequestForTcf = function (callback) {
            var result;
            window.__tcfapi('ping', 2, function (pingReturn) {
                result = [
                    pingReturn
                ];
            });
            return callback.apply(this, result);
        };
        IabNext.prototype.populateVendorAndPurposeFromCookieData = function () {
            if (externalData.BannerVariables.domainData.IabType === 'IAB2') {
                // Decode TC string
                var tcModel = iabNext.decodeTCString(externalData.BannerVariables.oneTrustIABConsent.IABCookieValue);
                // Re-store vendor consent
                tcModel.vendorConsents.forEach(function (value, id) {
                    externalData.BannerVariables.oneTrustIABConsent.vendors.push(id + ":" + value);
                });
                // Re-store purpose consent
                tcModel.purposeConsents.forEach(function (value, id) {
                    var idx = id;
                    externalData.BannerVariables.oneTrustIABConsent.purpose.some(function (selectionStr, index) {
                        if (selectionStr.split(':')[0] === id.toString()) {
                            idx = index;
                            return true;
                        }
                    });
                    externalData.BannerVariables.oneTrustIABConsent.purpose[idx] = id + ":" + value;
                });
                // Re-store special feature consent
                tcModel.specialFeatureOptIns.forEach(function (value, id) {
                    var idx = id;
                    externalData.BannerVariables.oneTrustIABConsent.specialFeatures.some(function (selectionStr, index) {
                        if (selectionStr.split(':')[0] === id.toString()) {
                            idx = index;
                            return true;
                        }
                    });
                    externalData.BannerVariables.oneTrustIABConsent.specialFeatures[idx] = id + ":" + value;
                });
                tcModel.gvl = externalData.tcModel.gvl; // Copy gvl
                externalData.tcModel = tcModel; // Assign updated tcModel to the scope
                externalData.cmpApi.tcModel = tcModel;
            }
            else {
                var consentData = externalData.iabStringSDK(externalData.BannerVariables.oneTrustIABConsent.IABCookieValue);
                // Re-store vendors consent
                consentData.getVendorsAllowed().forEach(function (vendor) {
                    externalData.BannerVariables.oneTrustIABConsent.vendors.push(vendor.toString() + ":true");
                });
                // Re-store purposes consent
                consentData.getPurposesAllowed().forEach(function (purposeId) {
                    var idx;
                    externalData.BannerVariables.oneTrustIABConsent.purpose.some(function (selectionStr, index) {
                        if (selectionStr.split(':')[0] === purposeId.toString()) {
                            idx = index;
                            return true;
                        }
                    });
                    externalData.BannerVariables.oneTrustIABConsent.purpose[idx] = purposeId.toString() + ":true";
                });
            }
        };
        IabNext.prototype.isInitIABCookieData = function (OnetrustIABCookie) {
            return OnetrustIABCookie === 'init' || externalData.needReconsent();
        };
        IabNext.prototype.updateFromGlobalConsent = function (OnetrustIABCookies) {
            externalData.BannerVariables.oneTrustIABConsent.IABCookieValue = OnetrustIABCookies;
            externalData.BannerVariables.oneTrustIABConsent.purpose = [];
            externalData.BannerVariables.oneTrustIABConsent.vendors = [];
            externalData.BannerVariables.oneTrustIABConsent.specialFeatures = [];
            iabNext.populateVendorAndPurposeFromCookieData();
            // delete 1st party cookie if exist
            externalData.setCookie(externalData.BannerVariables.oneTrustIABCookieName, '', -1);
        };
        return IabNext;
    }());
    var iabNext;
    function initializeIabNext() {
        iabNext = new IabNext();
    }

    var IAB_COOKIE_DURATION = 390;
    // TODO: add duration of all other cookies here

    var Cookie = /** @class */ (function () {
        function Cookie() {
        }
        Cookie.prototype.getCookieLabel = function (cookie, isFirstParty) {
            if (isFirstParty === void 0) { isFirstParty = true; }
            if (!cookie) {
                return '';
            }
            var json = externalData.BannerVariables.domainData;
            var cookiepediaUrl = isFirstParty
                ? 'http://cookiepedia.co.uk/cookies/'
                : 'http://cookiepedia.co.uk/host/';
            var cookieLabel = cookie.Name;
            // first party cookie linked by name
            if (json.AddLinksToCookiepedia) {
                cookieLabel = "<a href=\"" + cookiepediaUrl + cookie.Name + "\" target=\"_blank\"\n            style=\"text-decoration: underline;\">" + cookie.Name + "</a>";
            }
            return cookieLabel;
        };
        Cookie.prototype.writeHostCookieParam = function (cookieName, data) {
            if (data === void 0) { data = null; }
            if (data) {
                externalData.writeCookieParam(cookieName, 'hosts', moduleHelper.serialiseArrayToString(data));
            }
            else {
                externalData.writeCookieParam(cookieName, 'hosts', moduleHelper.serialiseArrayToString(externalData.BannerVariables.oneTrustHostConsent));
            }
        };
        Cookie.prototype.writeCookieGroupsParam = function (cookieName, groupData) {
            if (groupData === void 0) { groupData = null; }
            if (groupData) {
                externalData.writeCookieParam(cookieName, 'groups', moduleHelper.serialiseArrayToString(groupData));
            }
            else {
                externalData.writeCookieParam(cookieName, 'groups', moduleHelper.serialiseArrayToString(externalData.BannerVariables.optanonHtmlGroupData));
            }
            if (externalData.BannerVariables.domainData.IsIabEnabled &&
                externalData.isAlertBoxClosedAndValid()) {
                this.insertOrUpdateIabCookies();
            }
        };
        Cookie.prototype.insertOrUpdateIabCookies = function () {
            if (externalData.BannerVariables.oneTrustIABConsent.purpose &&
                externalData.BannerVariables.oneTrustIABConsent.vendors) {
                externalData.BannerVariables.oneTrustIABConsent.IABCookieValue = iabNext.getIABConsentData();
                if (!externalData.isIABCrossConsentEnabled()) {
                    externalData.setCookie(externalData.BannerVariables.oneTrustIABCookieName, externalData.BannerVariables.oneTrustIABConsent.IABCookieValue, IAB_COOKIE_DURATION);
                }
                else {
                    externalData.setIAB3rdPartyCookie(externalData.BannerVariables.oneTrustIAB3rdPartyCookieName, externalData.BannerVariables.oneTrustIABConsent.IABCookieValue, IAB_COOKIE_DURATION, false);
                }
            }
            // TODO: check if it's required
            if (moduleInitializer.moduleInitializer.UseTCF) {
                this.triggerCustomTCEvents();
            }
        };
        Cookie.prototype.triggerCustomTCEvents = function () {
            var events = new CustomEvent('otTCCustomEvent');
            events.success = true;
            window.dispatchEvent(events);
        };
        return Cookie;
    }());
    var cookieClass;
    function initializeCookie() {
        cookieClass = new Cookie();
    }

    var GroupsNext = /** @class */ (function () {
        function GroupsNext() {
        }
        GroupsNext.prototype.checkIsActiveByDefault = function (group) {
            if (!this.safeGroupDefaultStatus(group)) {
                return true;
            }
            else {
                var groupStatus = this.safeGroupDefaultStatus(group).toLowerCase();
                if (group.Parent && groupStatus !== externalData.BannerVariables.constant.GROUPSTATUS.ALWAYSACTIVE) {
                    groupStatus = this.safeGroupDefaultStatus(this.getParentGroup(group.Parent)).toLowerCase();
                }
                return (groupStatus ===
                    externalData.BannerVariables.constant.GROUPSTATUS.ALWAYSACTIVE ||
                    groupStatus ===
                        externalData.BannerVariables.constant.GROUPSTATUS
                            .INACTIVELANDINGPAGE ||
                    groupStatus ===
                        externalData.BannerVariables.constant.GROUPSTATUS.ACTIVE ||
                    (groupStatus === externalData.BannerVariables.doNotTrackText &&
                        !externalData.BannerVariables.optanonDoNotTrackEnabled));
            }
        };
        GroupsNext.prototype.safeGroupDefaultStatus = function (group) {
            if (!(group && group.Status)) {
                return '';
            }
            if (externalData.BannerVariables.optanonDoNotTrackEnabled &&
                group.IsDntEnabled) {
                return externalData.BannerVariables.doNotTrackText;
            }
            return group.Status;
        };
        GroupsNext.prototype.getParentGroup = function (groupId) {
            if (groupId) {
                var groups = externalData.BannerVariables.domainData.Groups.filter(function (group) { return group.OptanonGroupId === groupId; });
                return groups.length > 0 ? groups[0] : null;
            }
            return null;
        };
        // If cookie exists, ensures to add any new groups and remove any redundant groups to data
        GroupsNext.prototype.synchroniseCookieGroupData = function () {
            var _this = this;
            var groupDataFromCookies = externalData.readCookieParam(externalData.BannerVariables.optanonCookieName, 'groups');
            var cookieGroupData = moduleHelper.deserialiseStringToArray(groupDataFromCookies);
            var cookieGroupDataStripped = moduleHelper.deserialiseStringToArray(groupDataFromCookies.replace(/:0|:1/g, ''));
            var json = externalData.BannerVariables.domainData;
            var toUpdateCookie = false;
            // Adding missing groups to cookie
            json.Groups.forEach(function (group) {
                group.SubGroups.concat([group]).forEach(function (grp) {
                    if (IAB_GROUP_TYPES.indexOf(grp.Type) > -1) {
                        return;
                    }
                    var groupId = groupsHelper.getGroupIdForCookie(grp);
                    if (moduleHelper.indexOf(cookieGroupDataStripped, groupId) === -1) {
                        // Json group does not exist in cookie
                        toUpdateCookie = true;
                        cookieGroupData.push("" + groupId + (_this.checkIsActiveByDefault(grp) ? ':1' : ':0'));
                    }
                });
            });
            // Removing redundant groups from cookie
            cookieGroupData.forEach(function (groupData, index, cookieGroups) {
                var groupDataId = groupData.replace(/:0|:1/g, '');
                var foundMatchingJsonGroup = json.Groups.some(function (group) {
                    if (groupsHelper.getGroupIdForCookie(group) === groupDataId) {
                        return true;
                    }
                    return group.SubGroups.some(function (subGroup) { return groupsHelper.getGroupIdForCookie(subGroup) === groupDataId; });
                });
                if (!foundMatchingJsonGroup) {
                    toUpdateCookie = true;
                    cookieGroups.splice(index, 1);
                }
            });
            // Writing updated cookie
            if (toUpdateCookie) {
                cookieClass.writeCookieGroupsParam(externalData.BannerVariables.optanonCookieName, cookieGroupData);
            }
        };
        GroupsNext.prototype.synchroniseCookieHostData = function () {
            var _this = this;
            var hostDataFromCookies = externalData.readCookieParam(externalData.BannerVariables.optanonCookieName, 'hosts');
            var cookiehostData = moduleHelper.deserialiseStringToArray(hostDataFromCookies);
            var cookiehostDataStripped = moduleHelper.deserialiseStringToArray(hostDataFromCookies.replace(/:0|:1/g, ''));
            var json = externalData.BannerVariables.domainData;
            var toUpdateHost = false;
            // Adding missing groups to cookie
            json.Groups.forEach(function (group) {
                group.SubGroups.concat([group]).forEach(function (grp) {
                    if (grp.Hosts.length) {
                        grp.Hosts.forEach(function (host) {
                            if (moduleHelper.indexOf(cookiehostDataStripped, host.HostId) === -1) {
                                toUpdateHost = true;
                                cookiehostData.push("" + host.HostId + (_this.checkIsActiveByDefault(grp) ? ':1' : ':0'));
                            }
                        });
                    }
                });
            });
            // Removing redundant groups from cookie
            cookiehostData.forEach(function (hostData, index, cookiehost) {
                var hostDataId = hostData.replace(/:0|:1/g, '');
                var foundMatchingJsonGroup = json.Groups.some(function (group) {
                    return group.SubGroups.concat([group]).some(function (grp) {
                        return grp.Hosts.some(function (host) { return host.HostId === hostDataId; });
                    });
                });
                if (!foundMatchingJsonGroup) {
                    toUpdateHost = true;
                    cookiehost.splice(index, 1);
                }
            });
            // Writing updated cookie
            if (toUpdateHost) {
                cookieClass.writeHostCookieParam(externalData.BannerVariables.optanonCookieName, cookiehostData);
            }
        };
        GroupsNext.prototype.getGroupById = function (groupId) {
            var json = externalData.BannerVariables.domainData;
            var result;
            json.Groups.some(function (group) {
                return group.SubGroups.concat([group]).some(function (grp) {
                    if (groupsHelper.getGroupIdForCookie(grp) === groupId) {
                        result = grp;
                        return true;
                    }
                });
            });
            return result;
        };
        // Enable / Disbale hosts by group
        GroupsNext.prototype.toggleGroupHosts = function (group, isEnabled) {
            group.Hosts.forEach(function (host) {
                externalData.BannerVariables.oneTrustHostConsent.some(function (hostId, index) {
                    if (!host.isActive && host.HostId === hostId.replace(/:0|:1/g, '')) {
                        externalData.BannerVariables.oneTrustHostConsent[index] = host.HostId + ":" + (isEnabled ? '1' : '0');
                        return true;
                    }
                });
            });
        };
        return GroupsNext;
    }());
    var groupsNext;
    function initializeGroupsNext() {
        groupsNext = new GroupsNext();
    }

    var ConsentIntegration = /** @class */ (function () {
        function ConsentIntegration() {
        }
        ConsentIntegration.prototype.ensureConsentId = function (isdefaultRequest) {
            var bannerInteraction, addDefaultInteraction = false;
            var dataSubject = externalData.readCookieParam(externalData.BannerVariables.optanonCookieName, externalData.BannerVariables.consentIntegrationParam);
            if (!dataSubject) {
                if (!isdefaultRequest) {
                    addDefaultInteraction = true;
                    bannerInteraction = 1;
                }
                else {
                    bannerInteraction = 0;
                }
                externalData.writeCookieParam(externalData.BannerVariables.optanonCookieName, externalData.BannerVariables.consentIntegrationParam, moduleHelper.generateUUID());
                externalData.writeCookieParam(externalData.BannerVariables.optanonCookieName, externalData.BannerVariables.bannerInteractionParam, bannerInteraction);
                dataSubject = externalData.readCookieParam(externalData.BannerVariables.optanonCookieName, externalData.BannerVariables.consentIntegrationParam);
            }
            else {
                var interaction = parseInt(externalData.readCookieParam(externalData.BannerVariables.optanonCookieName, externalData.BannerVariables.bannerInteractionParam), 10);
                if (!isNaN(interaction)) {
                    bannerInteraction = ++interaction;
                }
                else if (!isdefaultRequest) {
                    addDefaultInteraction = true;
                    bannerInteraction = 1;
                }
                else {
                    bannerInteraction = 0;
                }
                // Update banner interaction
                externalData.writeCookieParam(externalData.BannerVariables.optanonCookieName, externalData.BannerVariables.bannerInteractionParam, bannerInteraction);
            }
            var consentUserData = {
                dataSubjectIdentifier: dataSubject,
                bannerInteractionCount: bannerInteraction,
                addDefaultInteraction: addDefaultInteraction
            };
            return consentUserData;
        };
        ConsentIntegration.prototype.createConsentTransaction = function (isdefaultRequest) {
            var consentUserData = this.ensureConsentId(isdefaultRequest);
            var consentData = externalData.BannerVariables.consentData;
            if (this.canCreateTransaction(consentData, consentUserData)) {
                consentData.consentPayload.identifier =
                    consentUserData.dataSubjectIdentifier;
                consentData.consentPayload.customPayload = {
                    Interaction: consentUserData.bannerInteractionCount,
                    AddDefaultInteraction: consentUserData.addDefaultInteraction
                };
                consentData.consentPayload.purposes = this.getConsetPurposes();
                if (!moduleInitializer.moduleInitializer.MobileSDK && consentData.consentPayload) {
                    if (consentData.consentPayload.purposes.length) {
                        OneTrustBannerLibrary.ajax({
                            url: consentData.consentApi,
                            type: 'post',
                            dataType: 'json',
                            contentType: 'application/json',
                            data: JSON.stringify(consentData.consentPayload),
                            sync: isdefaultRequest,
                            success: function () { },
                            error: function () { }
                        });
                    }
                }
                externalData.setConsentIntegrationDataInPublicDomainData(consentData);
            }
        };
        ConsentIntegration.prototype.getGroupDetails = function (items, consentGroupType) {
            var groupData = [];
            items.forEach(function (purpose) {
                // item format: "id:value". Example: "5:true"
                var idValueArray = purpose.split(':');
                var id = idValueArray[0];
                var value = idValueArray[1] === 'true' ? '1' : '0';
                var optanonId = externalData.getOptanonIdForIabGroup(id, consentGroupType);
                groupData.push(optanonId + ':' + value);
            });
            return groupData;
        };
        ConsentIntegration.prototype.getConsetPurposes = function () {
            var _this = this;
            var consentPurposes = [];
            var allConsentGroupData = [];
            var purposesGroupData = [];
            var specialFeaturesGroupData = [];
            purposesGroupData = this.getGroupDetails(externalData.BannerVariables.oneTrustIABConsent.purpose, ConsentGroupType.Purpose);
            specialFeaturesGroupData = this.getGroupDetails(externalData.BannerVariables.oneTrustIABConsent.specialFeatures, ConsentGroupType.SpecialFeature);
            allConsentGroupData = externalData.BannerVariables.optanonHtmlGroupData.concat(purposesGroupData, specialFeaturesGroupData);
            allConsentGroupData.forEach(function (item) {
                var groupData = item.split(':');
                var group = groupsNext.getGroupById(groupData[0]);
                if (group.PurposeId) {
                    var consentPurpose = {};
                    consentPurpose.Id = group.PurposeId;
                    if (group.Status === externalData.BannerVariables.constant.GROUPSTATUS.ALWAYSACTIVE) {
                        consentPurpose.TransactionType = externalData.BannerVariables.constant.TRANSACTIONTYPE.NO_CHOICE;
                    }
                    /** First time use case: User clicking x on the banner and the consent model is opt-in,
                    transation type of consent should be set to Not given.
                    Once the banner is closed coz of the interation, it would not show up so 2nd time load
                    should be come here.
                    **/
                    else if (externalData.BannerVariables.bannerCloseSource === BannerCloseSource.BannerCloseButton
                        && group.Status === externalData.BannerVariables.constant.GROUPSTATUS.INACTIVE) {
                        consentPurpose.TransactionType
                            = externalData.BannerVariables.constant.TRANSACTIONTYPE.NOT_GIVEN;
                    }
                    else {
                        consentPurpose.TransactionType = _this.getPurposeTransactionType(groupData[1]);
                    }
                    consentPurposes.push(consentPurpose);
                }
            });
            externalData.BannerVariables.bannerCloseSource = BannerCloseSource.Unknown;
            return consentPurposes;
        };
        ConsentIntegration.prototype.getPurposeTransactionType = function (groupStatus) {
            if (groupStatus === '0') {
                return externalData.BannerVariables.constant.TRANSACTIONTYPE.OPT_OUT;
            }
            else {
                return externalData.BannerVariables.constant.TRANSACTIONTYPE.CONFIRMED;
            }
        };
        ConsentIntegration.prototype.canCreateTransaction = function (consentData, consentUserData) {
            var isValid = consentData &&
                consentData.consentApi &&
                consentData.consentPayload &&
                consentData.consentPayload.requestInformation &&
                consentUserData.dataSubjectIdentifier;
            return isValid ? true : false;
        };
        return ConsentIntegration;
    }());
    var consentIntegration;
    function initializeConsentIntegration() {
        consentIntegration = new ConsentIntegration();
    }

    var OtCookiePolicy = /** @class */ (function () {
        function OtCookiePolicy() {
            this.assets = function () {
                return {
                    name: "otCookiePolicy",
                    html: "<div class=\"ot-sdk-cookie-policy ot-sdk-container\">\n    <h3 id=\"cookie-policy-title\">Cookie Tracking Table</h3>\n    <div id=\"cookie-policy-description\"></div>\n    <section>\n        <h4 class=\"ot-sdk-cookie-policy-group\">Strictly Necessary Cookies</h4>\n        <p class=\"ot-sdk-cookie-policy-group-desc\">group description</p>\n        <h6 class=\"cookies-used-header\">Cookies Used</h6>\n        <ul class=\"cookies-list\">\n            <li>Cookie 1</li>\n        </ul>\n        <table>\n            <thead>\n                <tr>\n                    <th class=\"table-header host\">Host</th>\n                    <th class=\"table-header host-description\">Host Description</th>\n                    <th class=\"table-header cookies\">Cookies</th>\n                    <th class=\"table-header life-span\">Life Span</th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr>\n                    <td class=\"host-td\" data-label=\"Host\"><span class=\"mobile-border\"></span><a\n                            href=\"https://cookiepedia.co.uk/host/.app.onetrust.com?_ga=2.157675898.1572084395.1556120090-1266459230.1555593548&_ga=2.157675898.1572084395.1556120090-1266459230.1555593548\">Azure</a>\n                    </td>\n                    <td class=\"host-description-td\" data-label=\"Host Description\"><span\n                            class=\"mobile-border\"></span>These\n                        cookies are used to make sure\n                        visitor page requests are routed to the same server in all browsing sessions.</td>\n                    <td class=\"cookies-td\" data-label=\"Cookies\">\n                        <span class=\"mobile-border\"></span>\n                        <ul>\n                            <li>ARRAffinity</li>\n                        </ul>\n                    </td>\n                    <td class=\"life-span-td\" data-label=\"Life Span\"><span class=\"mobile-border\"></span>\n                        <ul>\n                            <li>100 days</li>\n                        </ul>\n                    </td>\n                </tr>\n            </tbody>\n        </table>\n    </section>\n    <section class=\"subgroup\">\n        <h4 class=\"ot-sdk-cookie-policy-group\">Strictly Necessary Cookies</h4>\n        <p class=\"ot-sdk-cookie-policy-group-desc\">description</p>\n        <h6 class=\"cookies-used-header\">Cookies Used</h6>\n        <ul class=\"cookies-list\">\n            <li>Cookie 1</li>\n        </ul>\n        <table>\n            <thead>\n                <tr>\n                    <th class=\"table-header host\">Host</th>\n                    <th class=\"table-header host-description\">Host Description</th>\n                    <th class=\"table-header cookies\">Cookies</th>\n                    <th class=\"table-header life-span\">Life Span</th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr>\n                    <td class=\"host-td\" data-label=\"Host\"><span class=\"mobile-border\"></span><a\n                            href=\"https://cookiepedia.co.uk/host/.app.onetrust.com?_ga=2.157675898.1572084395.1556120090-1266459230.1555593548&_ga=2.157675898.1572084395.1556120090-1266459230.1555593548\">Azure</a>\n                    </td>\n                    <td class=\"host-description-td\" data-label=\"Host Description\">\n                        <span class=\"mobile-border\"></span>\n                        cookies are used to make sureng sessions.\n                    </td>\n                    <td class=\"cookies-td\" data-label=\"Cookies\">\n                        <span class=\"mobile-border\"></span>\n                        <ul>\n                            <li>ARRAffinity</li>\n                        </ul>\n                    </td>\n                    <td class=\"life-span-td\" data-label=\"Life Span\"><span class=\"mobile-border\"></span>\n                        <ul>\n                            <li>100 days</li>\n                        </ul>\n                    </td>\n                </tr>\n            </tbody>\n        </table>\n    </section>\n</div>\n<!-- New Cookies policy Link-->\n<div id=\"ot-sdk-cookie-policy-v2\" class=\"ot-sdk-cookie-policy ot-sdk-container\">\n    <h3 id=\"cookie-policy-title\" class=\"ot-sdk-cookie-policy-title\">Cookie Tracking Table</h3>\n    <div id=\"cookie-policy-description\"></div>\n    <section>\n        <h4 class=\"ot-sdk-cookie-policy-group\">Strictly Necessary Cookies</h4>\n        <p class=\"ot-sdk-cookie-policy-group-desc\">group description</p>\n        <section class=\"ot-sdk-subgroup\">\n            <ul>\n                <li>\n                    <h4 class=\"ot-sdk-cookie-policy-group\">Strictly Necessary Cookies</h4>\n                    <p class=\"ot-sdk-cookie-policy-group-desc\">description</p>\n                </li>\n            </ul>\n        </section>\n        <table>\n            <thead>\n                <tr>\n                    <th class=\"ot-table-header ot-host\">Host</th>\n                    <th class=\"ot-table-header ot-host-description\">Host Description</th>\n                    <th class=\"ot-table-header ot-cookies\">Cookies</th>\n                    <th class=\"ot-table-header ot-cookies-type\">Type</th>\n                    <th class=\"ot-table-header ot-life-span\">Life Span</th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr>\n                    <td class=\"ot-host-td\" data-label=\"Host\"><span class=\"mobile-border\"></span><a\n                            href=\"https://cookiepedia.co.uk/host/.app.onetrust.com?_ga=2.157675898.1572084395.1556120090-1266459230.1555593548&_ga=2.157675898.1572084395.1556120090-1266459230.1555593548\">Azure</a>\n                    </td>\n                    <td class=\"ot-host-description-td\" data-label=\"Host Description\">\n                        <span class=\"ot-mobile-border\"></span>\n                        cookies are used to make sureng sessions.\n                    </td>\n                    <td class=\"ot-cookies-td\" data-label=\"Cookies\">\n                        <span class=\"mobile-border\"></span>\n                        <span class=\"ot-cookies-td-content\">ARRAffinity</span>\n                    </td>\n                    <td class=\"ot-cookies-type\" data-label=\"Type\">\n                        <span class=\"ot-mobile-border\"></span>\n                        <span class=\"ot-cookies-type-td-content\">1st Party</span>\n                    </td>\n                    <td class=\"ot-life-span-td\" data-label=\"Life Span\">\n                        <span class=\"ot-mobile-border\"></span>\n                        <span class=\"ot-life-span-td-content\">100 days</span>\n                    </td>\n                </tr>\n            </tbody>\n        </table>\n    </section>\n</div>\n",
                    css: ".ot-sdk-cookie-policy{font-family:inherit;font-size:16px}.ot-sdk-cookie-policy h3,.ot-sdk-cookie-policy h4,.ot-sdk-cookie-policy h6,.ot-sdk-cookie-policy p,.ot-sdk-cookie-policy li,.ot-sdk-cookie-policy a,.ot-sdk-cookie-policy th,.ot-sdk-cookie-policy #cookie-policy-description,.ot-sdk-cookie-policy .ot-sdk-cookie-policy-group,.ot-sdk-cookie-policy #cookie-policy-title{color:dimgray}.ot-sdk-cookie-policy #cookie-policy-description{margin-bottom:1em}.ot-sdk-cookie-policy h4{font-size:1.2em}.ot-sdk-cookie-policy h6{font-size:1em;margin-top:2em}.ot-sdk-cookie-policy th{min-width:75px}.ot-sdk-cookie-policy a,.ot-sdk-cookie-policy a:hover{background:#fff}.ot-sdk-cookie-policy thead{background-color:#f6f6f4;font-weight:bold}.ot-sdk-cookie-policy .mobile-border{display:none}.ot-sdk-cookie-policy section{margin-bottom:2em}.ot-sdk-cookie-policy table{border-collapse:inherit}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy{font-family:inherit;font-size:16px}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy h3,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy h4,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy h6,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy p,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy li,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy a,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy th,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy #cookie-policy-description,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-sdk-cookie-policy-group,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy #cookie-policy-title{color:dimgray}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy #cookie-policy-description{margin-bottom:1em}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-sdk-subgroup{margin-left:1.5rem}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy #cookie-policy-description,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-sdk-cookie-policy-group-desc,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-table-header,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy a,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy span{font-size:.9rem}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-sdk-cookie-policy-group{font-size:1rem;margin-bottom:.6rem}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-sdk-cookie-policy-title{margin-bottom:1.2rem}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy>section{margin-bottom:1rem}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy th{min-width:75px}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy a,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy a:hover{background:#fff}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy thead{background-color:#f6f6f4;font-weight:bold}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-mobile-border{display:none}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy section{margin-bottom:2em}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-sdk-subgroup ul li{list-style:disc;margin-left:1.5rem}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-sdk-subgroup ul li h4{display:inline-block}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table{border-collapse:inherit;margin:auto;border:1px solid #d7d7d7;border-radius:5px;border-spacing:initial;width:100%;overflow:hidden}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table th,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table td{border-bottom:1px solid #d7d7d7;border-right:1px solid #d7d7d7}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table tr:last-child td{border-bottom:0px}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table tr th:last-child,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table tr td:last-child{border-right:0px}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table .ot-host,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table .ot-cookies-type{width:25%}.ot-sdk-cookie-policy[dir=rtl]{text-align:left}@media only screen and (max-width: 530px){.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) table,.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) thead,.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) tbody,.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) th,.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) td,.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) tr{display:block}.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) thead tr{position:absolute;top:-9999px;left:-9999px}.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) tr{margin:0 0 1rem 0}.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) tr:nth-child(odd),.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) tr:nth-child(odd) a{background:#f6f6f4}.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) td{border:none;border-bottom:1px solid #eee;position:relative;padding-left:50%}.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) td:before{position:absolute;height:100%;left:6px;width:40%;padding-right:10px}.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) .mobile-border{display:inline-block;background-color:#e4e4e4;position:absolute;height:100%;top:0;left:45%;width:2px}.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) td:before{content:attr(data-label);font-weight:bold}.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) li{word-break:break-word;word-wrap:break-word}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table{overflow:hidden}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table td{border:none;border-bottom:1px solid #d7d7d7}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy thead,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy tbody,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy th,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy td,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy tr{display:block}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table .ot-host,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table .ot-cookies-type{width:auto}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy tr{margin:0 0 1rem 0}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy td:before{height:100%;width:40%;padding-right:10px}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy td:before{content:attr(data-label);font-weight:bold}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy li{word-break:break-word;word-wrap:break-word}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy thead tr{position:absolute;top:-9999px;left:-9999px;z-index:-9999}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table tr:last-child td{border-bottom:1px solid #d7d7d7;border-right:0px}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table tr:last-child td:last-child{border-bottom:0px}}",
                    cssRTL: ".ot-sdk-cookie-policy{font-family:inherit;font-size:16px}.ot-sdk-cookie-policy h3,.ot-sdk-cookie-policy h4,.ot-sdk-cookie-policy h6,.ot-sdk-cookie-policy p,.ot-sdk-cookie-policy li,.ot-sdk-cookie-policy a,.ot-sdk-cookie-policy th,.ot-sdk-cookie-policy #cookie-policy-description,.ot-sdk-cookie-policy .ot-sdk-cookie-policy-group,.ot-sdk-cookie-policy #cookie-policy-title{color:dimgray}.ot-sdk-cookie-policy #cookie-policy-description{margin-bottom:1em}.ot-sdk-cookie-policy h4{font-size:1.2em}.ot-sdk-cookie-policy h6{font-size:1em;margin-top:2em}.ot-sdk-cookie-policy th{min-width:75px}.ot-sdk-cookie-policy a,.ot-sdk-cookie-policy a:hover{background:#fff}.ot-sdk-cookie-policy thead{background-color:#f6f6f4;font-weight:bold}.ot-sdk-cookie-policy .mobile-border{display:none}.ot-sdk-cookie-policy section{margin-bottom:2em}.ot-sdk-cookie-policy table{border-collapse:inherit}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy{font-family:inherit;font-size:16px}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy h3,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy h4,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy h6,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy p,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy li,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy a,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy th,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy #cookie-policy-description,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-sdk-cookie-policy-group,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy #cookie-policy-title{color:dimgray}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy #cookie-policy-description{margin-bottom:1em}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-sdk-subgroup{margin-right:1.5rem}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy #cookie-policy-description,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-sdk-cookie-policy-group-desc,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-table-header,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy a,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy span{font-size:.9rem}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-sdk-cookie-policy-group{font-size:1rem;margin-bottom:.6rem}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-sdk-cookie-policy-title{margin-bottom:1.2rem}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy>section{margin-bottom:1rem}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy th{min-width:75px}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy a,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy a:hover{background:#fff}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy thead{background-color:#f6f6f4;font-weight:bold}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-mobile-border{display:none}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy section{margin-bottom:2em}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-sdk-subgroup ul li{list-style:disc;margin-right:1.5rem}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-sdk-subgroup ul li h4{display:inline-block}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table{border-collapse:inherit;margin:auto;border:1px solid #d7d7d7;border-radius:5px;border-spacing:initial;width:100%;overflow:hidden}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table th,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table td{border-bottom:1px solid #d7d7d7;border-left:1px solid #d7d7d7}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table tr:last-child td{border-bottom:0px}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table tr th:last-child,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table tr td:last-child{border-left:0px}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table .ot-host,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table .ot-cookies-type{width:25%}.ot-sdk-cookie-policy[dir=rtl]{text-align:right}@media only screen and (max-width: 530px){.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) table,.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) thead,.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) tbody,.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) th,.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) td,.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) tr{display:block}.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) thead tr{position:absolute;top:-9999px;right:-9999px}.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) tr{margin:0 0 1rem 0}.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) tr:nth-child(odd),.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) tr:nth-child(odd) a{background:#f6f6f4}.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) td{border:none;border-bottom:1px solid #eee;position:relative;padding-right:50%}.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) td:before{position:absolute;height:100%;right:6px;width:40%;padding-left:10px}.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) .mobile-border{display:inline-block;background-color:#e4e4e4;position:absolute;height:100%;top:0;right:45%;width:2px}.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) td:before{content:attr(data-label);font-weight:bold}.ot-sdk-cookie-policy:not(#ot-sdk-cookie-policy-v2) li{word-break:break-word;word-wrap:break-word}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table{overflow:hidden}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table td{border:none;border-bottom:1px solid #d7d7d7}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy thead,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy tbody,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy th,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy td,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy tr{display:block}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table .ot-host,#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table .ot-cookies-type{width:auto}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy tr{margin:0 0 1rem 0}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy td:before{height:100%;width:40%;padding-left:10px}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy td:before{content:attr(data-label);font-weight:bold}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy li{word-break:break-word;word-wrap:break-word}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy thead tr{position:absolute;top:-9999px;right:-9999px;z-index:-9999}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table tr:last-child td{border-bottom:1px solid #d7d7d7;border-left:0px}#ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table tr:last-child td:last-child{border-bottom:0px}}"
                };
            };
        }
        return OtCookiePolicy;
    }());

    var LandingPathNext = /** @class */ (function () {
        function LandingPathNext() {
        }
        LandingPathNext.prototype.isLandingPage = function () {
            var landingPath = externalData.readCookieParam(externalData.BannerVariables.optanonCookieName, 'landingPath');
            if (!landingPath || landingPath === location.href) {
                return true;
            }
            return false;
        };
        return LandingPathNext;
    }());
    var landingPathNext;
    function initializeLandingPathNext() {
        landingPathNext = new LandingPathNext();
    }

    var BannerPushDown = /** @class */ (function () {
        function BannerPushDown() {
        }
        BannerPushDown.prototype.BannerPushDownHandler = function () {
            if (!this.checkIsBrowserIE11OrBelow()) {
                var bannerIdentifier_1 = '#onetrust-banner-sdk';
                bannerPushDown.pushPageDown(bannerIdentifier_1);
                OT(window).on('resize', function () {
                    var bannerIsVisible = OT(bannerIdentifier_1).css('display') !== 'none';
                    if (bannerIsVisible) {
                        bannerPushDown.pushPageDown(bannerIdentifier_1);
                    }
                });
            }
        };
        BannerPushDown.prototype.checkBrowserSupportPushPageUp = function () {
            if (this.checkIsBrowserIE11OrBelow()) {
                return !externalData.BannerVariables.isWebsiteContainFixedHeader;
            }
            return true;
        };
        BannerPushDown.prototype.pushPageUp = function () {
            OT('body').css('top: 0;');
        };
        BannerPushDown.prototype.checkIsBrowserIE11OrBelow = function () {
            var ua = window.navigator.userAgent;
            return ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0;
        };
        BannerPushDown.prototype.pushPageDown = function (bannerIdentifier) {
            var bannerHeightPx = OT(bannerIdentifier).height() + 'px';
            OT(bannerIdentifier).show().css(' bottom: auto; position:absolute; top:' + '-' + bannerHeightPx);
            OT('body').css('position: relative; top:' + bannerHeightPx);
        };
        return BannerPushDown;
    }());
    var bannerPushDown;
    function initializeBannerPushDown() {
        bannerPushDown = new BannerPushDown();
    }

    var PublicAPINext = /** @class */ (function () {
        function PublicAPINext() {
            this.consentChangedEventMap = {};
        }
        PublicAPINext.prototype.loadBanner = function () {
            if (externalData.BannerVariables.domainData.IsIabEnabled
                && externalData.BannerVariables.domainData.IabType === 'IAB') {
                moduleInitializer.moduleInitializer.otIABModuleData.proccessQueue();
            }
            /* When ScriptDynamicLoadEnabled is enabled, we wait for the page to be completly
            loaded to load the banner */
            if (moduleInitializer.moduleInitializer.ScriptDynamicLoadEnabled) {
                if (document.readyState === 'complete') {
                    OT(window).trigger('otloadbanner');
                }
                else {
                    window.addEventListener('load', function (event) {
                        OT(window).trigger('otloadbanner');
                    });
                }
            }
            else {
                if (document.readyState !== 'loading') {
                    OT(window).trigger('otloadbanner');
                }
                else {
                    window.addEventListener('DOMContentLoaded', function (event) {
                        OT(window).trigger('otloadbanner');
                    });
                }
            }
            externalData.BannerVariables.publicDomainData.IsBannerLoaded = true;
        };
        // Add listener to be called when consent is available
        PublicAPINext.prototype.OnConsentChanged = function (f) {
            var key = f.toString();
            if (!publicAPINext.consentChangedEventMap[key]) {
                publicAPINext.consentChangedEventMap[key] = true;
                window.addEventListener('consent.onetrust', f);
            }
        };
        // Optanon UI Google Analytics event tracking
        PublicAPINext.prototype.triggerGoogleAnalyticsEvent = function (category, action, label, value) {
            if (!externalData.BannerVariables.ignoreGoogleAnlyticsCall) {
                // Google Analytics (w/o Google Tag Manager)
                if (typeof window._gaq !== 'undefined') {
                    window._gaq.push(['_trackEvent', category, action, label, value]);
                }
                // Universal Analytics (w/o Google Tag Manager)
                if (typeof window.ga !== 'undefined') {
                    window.ga('send', 'event', category, action, label, value);
                }
            }
            // Google Tag Manager
            if (typeof window.dataLayer !== 'undefined' &&
                window.dataLayer.constructor === Array) {
                window.dataLayer.push({
                    event: 'trackOptanonEvent',
                    optanonCategory: category,
                    optanonAction: action,
                    optanonLabel: label,
                    optanonValue: value
                });
            }
        };
        // Sets setOptanonAlertBoxCookie cookie indicating alert box has been closed
        PublicAPINext.prototype.setAlertBoxClosed = function (isOptanonAlertBoxCookiePersistent) {
            var consentDate = new Date().toISOString();
            if (isOptanonAlertBoxCookiePersistent) {
                externalData.setCookie(externalData.BannerVariables.optanonAlertBoxClosedCookieName, consentDate, 365);
            }
            else {
                // TODO : validate if 0 works for setCookie days param
                externalData.setCookie(externalData.BannerVariables.optanonAlertBoxClosedCookieName, consentDate, 0);
            }
            if (bannerPushDown.checkBrowserSupportPushPageUp()) {
                bannerPushDown.pushPageUp();
            }
        };
        PublicAPINext.prototype.updateConsentFromCookie = function (OnetrustIABCookies) {
            return __awaiter(this, void 0, void 0, function () {
                var isInit;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (OnetrustIABCookies) {
                                isInit = iabNext.isInitIABCookieData(OnetrustIABCookies);
                                if (!isInit) {
                                    iabNext.updateFromGlobalConsent(OnetrustIABCookies);
                                }
                                if (OnetrustIABCookies === 'init') {
                                    externalData.setCookie(externalData.BannerVariables.optanonAlertBoxClosedCookieName, '', 0, true);
                                }
                            }
                            else {
                                // update cookie to use 1st party cookie
                                externalData.writeCookieParam(externalData.BannerVariables.optanonCookieName, externalData.BannerVariables.oneTrustIsIABCrossConsentEnableParam, false);
                                externalData.setIABCookieData();
                            }
                            if (!(externalData.BannerVariables.domainData.IabType === 'IAB2')) return [3 /*break*/, 2];
                            return [4 /*yield*/, externalData.populateVendorListTCF()];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, externalData.populateVendorListCMP()];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            publicAPINext.loadBanner();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return PublicAPINext;
    }());
    var publicAPINext;
    function initializePublicAPINext() {
        publicAPINext = new PublicAPINext();
    }

    var cookiePolicy = new OtCookiePolicy().assets();
    var CoreNext = /** @class */ (function () {
        function CoreNext() {
        }
        CoreNext.prototype.ensureHtmlGroupDataInitialised = function () {
            var json = externalData.BannerVariables.domainData;
            var groups = [];
            externalData.BannerVariables.oneTrustIABConsent.defaultPurpose = [];
            // If IAB not enabled, IAB purposes are filtered out already, no need of that check here
            json.Groups.forEach(function (group) {
                group.SubGroups.concat([group]).forEach(function (grp) {
                    if (CONSENTABLE_GROUPS.indexOf(grp.Type) === -1) {
                        externalData.BannerVariables.oneTrustIABConsent.defaultPurpose.push(grp);
                    }
                    else {
                        groups.push(grp);
                    }
                });
            });
            if (json.IsIabEnabled) {
                this.initializeIABData();
            }
            externalData.BannerVariables.oneTrustCategories = groups;
            this.initializeGroupData(groups);
            // Host data
            if (externalData.BannerVariables.commonData.showCookieList &&
                externalData.BannerVariables.commonData.allowHostOptOut) {
                this.initializeHostData(groups);
            }
            else {
                // Reset hosts to empty to set in cookie
                externalData.BannerVariables.oneTrustHostConsent = [];
            }
            // set 3rd Party consent flag to false if IAB is not enabled, skip if param not present
            externalData.setOrUpdate3rdPartyIABConsentFlag();
            // set geolocation flag
            externalData.setGeolocationInCookies();
        };
        CoreNext.prototype.initializeGroupData = function (groups) {
            var groupDataFromCookies = externalData.readCookieParam(externalData.BannerVariables.optanonCookieName, 'groups');
            if (!groupDataFromCookies) {
                // Populate optanonHtmlGroupData from json
                externalData.BannerVariables.optanonHtmlGroupData = [];
                groups.forEach(function (group) {
                    externalData.BannerVariables.optanonHtmlGroupData.push("" + groupsHelper.getGroupIdForCookie(group) + (groupsNext.checkIsActiveByDefault(group) ? ':1' : ':0'));
                });
                if (externalData.BannerVariables.domainData.IsConsentLoggingEnabled) {
                    window.addEventListener('beforeunload', this.consentDefaulCall);
                }
            }
            else {
                // Populate optanonHtmlGroupData from cookie
                groupsNext.synchroniseCookieGroupData();
                externalData.BannerVariables.optanonHtmlGroupData = moduleHelper.deserialiseStringToArray(groupDataFromCookies);
            }
        };
        CoreNext.prototype.initializeHostData = function (groups) {
            var hostDataFromCookies = externalData.readCookieParam(externalData.BannerVariables.optanonCookieName, 'hosts');
            if (!hostDataFromCookies) {
                externalData.BannerVariables.oneTrustHostConsent = [];
                groups.forEach(function (group) {
                    if (group.Hosts.length) {
                        group.Hosts.forEach(function (host) {
                            externalData.BannerVariables.oneTrustHostConsent.push("" + host.HostId + (groupsNext.checkIsActiveByDefault(group) ? ':1' : ':0'));
                        });
                    }
                });
            }
            else {
                groupsNext.synchroniseCookieHostData();
                externalData.BannerVariables.oneTrustHostConsent = moduleHelper.deserialiseStringToArray(hostDataFromCookies);
            }
        };
        CoreNext.prototype.consentDefaulCall = function () {
            // create default consent transaction
            var interaction = parseInt(externalData.readCookieParam(externalData.BannerVariables.optanonCookieName, externalData.BannerVariables.bannerInteractionParam), 10);
            if (isNaN(interaction)) {
                consentIntegration.createConsentTransaction(true);
                window.removeEventListener('beforeunload', this.consentDefaulCall);
            }
        };
        // Moved from consentNoticeV2
        CoreNext.prototype.consentNoticeInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, bannerContent, pcContent;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                externalData.getBannerContent(),
                                externalData.getPcContent()
                            ])];
                        case 1:
                            _a = _b.sent(), bannerContent = _a[0], pcContent = _a[1];
                            this.bannerGroup = {
                                name: bannerContent.name,
                                html: atob(bannerContent.html),
                                css: externalData.BannerVariables.commonData.useRTL
                                    ? bannerContent.cssRTL
                                    : bannerContent.css
                            };
                            this.preferenceCenterGroup = {
                                name: pcContent.name,
                                html: atob(pcContent.html),
                                css: externalData.BannerVariables.commonData.useRTL
                                    ? pcContent.cssRTL
                                    : pcContent.css
                            };
                            this.cookieListGroup = {
                                name: cookiePolicy.name,
                                html: cookiePolicy.html,
                                css: externalData.BannerVariables.commonData.useRTL
                                    ? cookiePolicy.cssRTL
                                    : cookiePolicy.css
                            };
                            this.mobileSDKEnabled = moduleInitializer.moduleInitializer.MobileSDK;
                            return [2 /*return*/];
                    }
                });
            });
        };
        CoreNext.prototype.initializeIabConsentOnReload = function () {
            var _this = this;
            // Set IAB consentable group status
            externalData.BannerVariables.oneTrustIABConsent.defaultPurpose.forEach(function (purpose) {
                if (CONSENTABLE_IAB_GROUPS.indexOf(purpose.Type) > -1) {
                    _this.setIABConsent(purpose, false);
                }
            });
        };
        CoreNext.prototype.initializeIABData = function (isAllowAll, isRejectAll) {
            var _this = this;
            if (isAllowAll === void 0) { isAllowAll = false; }
            if (isRejectAll === void 0) { isRejectAll = false; }
            // Clear and Insert default vendor and purposes either from cookies or from Json data
            externalData.BannerVariables.oneTrustIABConsent.purpose = [];
            externalData.BannerVariables.oneTrustIABConsent.vendors = [];
            externalData.BannerVariables.oneTrustIABConsent.specialFeatures = [];
            if (externalData.BannerVariables.oneTrustIABConsent.IABCookieValue &&
                !isAllowAll &&
                !isRejectAll &&
                !externalData.reconsentRequired()) {
                this.initializeIabConsentOnReload(); // initialie all the groups to false before updating consent from cookie
                iabNext.populateVendorAndPurposeFromCookieData();
            }
            else {
                // Set IAB consentable group status
                externalData.BannerVariables.oneTrustIABConsent.defaultPurpose.forEach(function (purpose) {
                    if (CONSENTABLE_IAB_GROUPS.indexOf(purpose.Type) > -1) {
                        if (isRejectAll) {
                            _this.setIABConsent(purpose, _this.isAlwaysActiveGroup(purpose));
                        }
                        else {
                            var isActivePurpose = (groupsNext.checkIsActiveByDefault(purpose) &&
                                _this.canSoftOptInInsertForGroup(groupsHelper.getGroupIdForCookie(purpose))) ||
                                isAllowAll;
                            _this.setIABConsent(purpose, isActivePurpose);
                        }
                    }
                });
                // Set all the vendor values to true in case of allow all and false in case of reject all
                // On load if vendor consent mode is opt out then set vendor values to true
                var vendorValue = isAllowAll
                    || (!isRejectAll && externalData.BannerVariables.domainData.VendorConsentModel === CONSENT_MODEL.OPT_OUT);
                // Set vendors status
                externalData.setIABVendor(vendorValue);
            }
        };
        // Returns true if group is not soft opt-in or if group is soft opt-in and landing page was left (i.e. after user interaction)
        CoreNext.prototype.canSoftOptInInsertForGroup = function (groupId) {
            var group = groupsNext.getGroupById(groupId);
            if (group) {
                var parentGroup = groupsHelper.isTopLevelGroup(group)
                    ? group
                    : groupsNext.getParentGroup(group.Parent);
                var isSoftOptInGroup = groupsNext.safeGroupDefaultStatus(parentGroup).toLowerCase() ===
                    'inactive landingpage';
                if (!isSoftOptInGroup) {
                    return true;
                }
                if (landingPathNext.isLandingPage()) {
                    return false;
                }
                return true;
            }
        };
        CoreNext.prototype.isAlwaysActiveGroup = function (group) {
            if (!groupsNext.safeGroupDefaultStatus(group)) {
                return true;
            }
            else {
                var groupStatus = groupsNext.safeGroupDefaultStatus(group).toLowerCase();
                if (group.Parent && groupStatus !== externalData.BannerVariables.constant.GROUPSTATUS.ALWAYSACTIVE) {
                    groupStatus = groupsNext
                        .safeGroupDefaultStatus(groupsNext.getParentGroup(group.Parent))
                        .toLowerCase();
                }
                return (groupStatus ===
                    externalData.BannerVariables.constant.GROUPSTATUS.ALWAYSACTIVE);
            }
        };
        // moved from IAB
        CoreNext.prototype.setIABConsent = function (group, isActive) {
            if (group.Type === GROUP_TYPES.IAB2_SPL_FEATURE) {
                this.setIabSpeciFeatureConsent(group, isActive);
            }
            else {
                this.setIabPurposeConsent(group, isActive);
            }
        };
        CoreNext.prototype.setIabPurposeConsent = function (group, isActive) {
            var found = false;
            externalData.BannerVariables.oneTrustIABConsent.purpose = externalData.BannerVariables.oneTrustIABConsent.purpose
                .map(function (purpose) {
                var purposeId = purpose.split(':')[0];
                var groupId = externalData.extractGroupIdForIabGroup(groupsHelper.getGroupIdForCookie(group).toString());
                if (purposeId === groupId) {
                    purpose = purposeId + ":" + isActive;
                    found = true;
                }
                return purpose;
            });
            if (!found) {
                var groupId = externalData.extractGroupIdForIabGroup(groupsHelper.getGroupIdForCookie(group).toString());
                externalData.BannerVariables.oneTrustIABConsent.purpose.push(groupId + ":" + isActive);
            }
        };
        CoreNext.prototype.setIabSpeciFeatureConsent = function (group, isActive) {
            var found = false;
            externalData.BannerVariables.oneTrustIABConsent.specialFeatures = externalData.BannerVariables.oneTrustIABConsent.specialFeatures
                .map(function (purpose) {
                var purposeId = purpose.split(':')[0];
                var groupId = externalData.extractGroupIdForIabGroup(groupsHelper.getGroupIdForCookie(group).toString());
                if (purposeId === groupId) {
                    purpose = purposeId + ":" + isActive;
                    found = true;
                }
                return purpose;
            });
            if (!found) {
                var groupId = externalData.extractGroupIdForIabGroup(groupsHelper.getGroupIdForCookie(group).toString());
                externalData.BannerVariables.oneTrustIABConsent.specialFeatures.push(groupId + ":" + isActive);
            }
        };
        CoreNext.prototype.updateIabGroupDataV2 = function (group, isEnabled) {
            var purposeId = externalData.extractGroupIdForIabGroup(groupsHelper.getGroupIdForCookie(group).toString());
            if (group.Type === GROUP_TYPES.IAB2_SPL_FEATURE) {
                this.updateIabSpecialFeatureData(purposeId, isEnabled);
            }
            else {
                this.updateIabPurposeData(purposeId, isEnabled);
            }
        };
        CoreNext.prototype.toggleGroupStatusOn = function (group) {
            var groupName = groupsHelper.safeGroupName(group);
            // Google Analytics event tracking
            publicAPINext.triggerGoogleAnalyticsEvent('OneTrust Cookie Consent', 'Preferences Toggle On', groupName, undefined);
            this.updateEnabledGroupData(group);
        };
        CoreNext.prototype.toggleGroupStatusOff = function (group) {
            var groupName = groupsHelper.safeGroupName(group);
            // Google Analytics event tracking
            publicAPINext.triggerGoogleAnalyticsEvent('OneTrust Cookie Consent', 'Preferences Toggle Off', groupName, undefined);
            this.updateDisabledGroupData(group);
        };
        CoreNext.prototype.updateEnabledGroupData = function (group) {
            if (CONSENTABLE_IAB_GROUPS.indexOf(group.Type) > -1) {
                this.updateIabGroupData(group, true);
            }
            else {
                var index = moduleHelper.indexOf(externalData.BannerVariables.optanonHtmlGroupData, groupsHelper.getGroupIdForCookie(group) + ':0');
                if (index !== -1) {
                    externalData.BannerVariables.optanonHtmlGroupData[index] =
                        groupsHelper.getGroupIdForCookie(group) + ':1';
                }
            }
        };
        CoreNext.prototype.updateDisabledGroupData = function (group) {
            if (CONSENTABLE_IAB_GROUPS.indexOf(group.Type) > -1) {
                this.updateIabGroupData(group, false);
            }
            else {
                var index = moduleHelper.indexOf(externalData.BannerVariables.optanonHtmlGroupData, groupsHelper.getGroupIdForCookie(group) + ':1');
                if (index !== -1) {
                    externalData.BannerVariables.optanonHtmlGroupData[index] =
                        groupsHelper.getGroupIdForCookie(group) + ':0';
                }
            }
        };
        // Check if all sub groups are enabled for a parent group
        CoreNext.prototype.isAllSubgroupsEnabled = function (group) {
            var isAllSubGroupsEnabled = true;
            group.SubGroups.some(function (subGroup) {
                var source = externalData.BannerVariables.optanonHtmlGroupData;
                var searchStr;
                if (CONSENTABLE_IAB_GROUPS.indexOf(subGroup.Type) > -1) {
                    source = subGroup.Type === GROUP_TYPES.IAB2_SPL_FEATURE
                        ? externalData.BannerVariables.vendors.selectedSpecialFeatures
                        : externalData.BannerVariables.vendors.selectedPurpose;
                    searchStr = externalData.extractGroupIdForIabGroup(groupsHelper.getGroupIdForCookie(subGroup).toString()) + ':false';
                }
                else {
                    searchStr = groupsHelper.getGroupIdForCookie(subGroup) + ':0';
                }
                if (moduleHelper.indexOf(source, searchStr) !== -1) {
                    isAllSubGroupsEnabled = false;
                    return true;
                }
            });
            return isAllSubGroupsEnabled;
        };
        // Check if all sub groups are disabled for a parent group
        CoreNext.prototype.isAllSubgroupsDisabled = function (group) {
            var isAllSubGroupsDisabled = true;
            group.SubGroups.some(function (subGroup) {
                var source = externalData.BannerVariables.optanonHtmlGroupData;
                var searchStr;
                if (CONSENTABLE_IAB_GROUPS.indexOf(subGroup.Type) > -1) {
                    source = subGroup.Type === GROUP_TYPES.IAB2_SPL_FEATURE
                        ? externalData.BannerVariables.vendors.selectedSpecialFeatures
                        : externalData.BannerVariables.vendors.selectedPurpose;
                    searchStr = externalData.extractGroupIdForIabGroup(groupsHelper.getGroupIdForCookie(subGroup).toString()) + ':true';
                }
                else {
                    searchStr = groupsHelper.getGroupIdForCookie(subGroup) + ':1';
                }
                if (moduleHelper.indexOf(source, searchStr) !== -1) {
                    isAllSubGroupsDisabled = false;
                    return true;
                }
            });
            return isAllSubGroupsDisabled;
        };
        // Check given group is enabled
        CoreNext.prototype.isGroupEnabled = function (group) {
            if (CONSENTABLE_IAB_GROUPS.indexOf(group.Type) > -1) { // IAB group
                var source = group.Type === GROUP_TYPES.IAB2_SPL_FEATURE
                    ? externalData.BannerVariables.vendors.selectedSpecialFeatures
                    : externalData.BannerVariables.vendors.selectedPurpose;
                return moduleHelper.indexOf(source, externalData.extractGroupIdForIabGroup(groupsHelper.getGroupIdForCookie(group).toString()) + ':true') > -1;
            }
            else {
                return moduleHelper.indexOf(externalData.BannerVariables.optanonHtmlGroupData, groupsHelper.getGroupIdForCookie(group) + ':1') > -1;
            }
        };
        // Enable/Disbale a group HTML element
        CoreNext.prototype.toggleGroupHtmlElement = function (groupId, isEnabled) {
            var lookupElement = OT("#ot-group-id-" + groupId).el[0];
            if (lookupElement) {
                lookupElement.checked = isEnabled;
                lookupElement.setAttribute('checked', isEnabled);
            }
        };
        CoreNext.prototype.updateIabGroupData = function (group, isEnabled) {
            this.updateIabGroupDataV2(group, isEnabled);
        };
        CoreNext.prototype.updateIabPurposeData = function (purposeId, isEnabled) {
            var idx;
            externalData.BannerVariables.vendors.selectedPurpose.some(function (selectionStr, index) {
                if (selectionStr.split(':')[0] === purposeId) {
                    idx = index;
                    return true;
                }
            });
            externalData.BannerVariables.vendors.selectedPurpose[idx] = purposeId + ":" + isEnabled;
        };
        CoreNext.prototype.updateIabSpecialFeatureData = function (purposeId, isEnabled) {
            var idx;
            externalData.BannerVariables.vendors.selectedSpecialFeatures.some(function (selectionStr, index) {
                if (selectionStr.split(':')[0] === purposeId) {
                    idx = index;
                    return true;
                }
            });
            externalData.BannerVariables.vendors.selectedSpecialFeatures[idx] = purposeId + ":" + isEnabled;
        };
        return CoreNext;
    }());
    var coreNext;
    function initializeCoreNext() {
        coreNext = new CoreNext();
    }

    var GroupsV2 = /** @class */ (function () {
        function GroupsV2() {
        }
        GroupsV2.prototype.getAllGroupElements = function () {
            return document.querySelectorAll('div#onetrust-pc-sdk .category-group .category-item');
        };
        GroupsV2.prototype.toogleGroupElementOn = function (element) {
            var checkbox = element.querySelector('input[class*="category-switch-handler"]');
            moduleHelper.setCheckedAttribute(null, checkbox, true);
        };
        GroupsV2.prototype.toogleGroupElementOff = function (element) {
            var checkbox = element.querySelector('input[class*="category-switch-handler"]');
            moduleHelper.setCheckedAttribute(null, checkbox, false);
        };
        GroupsV2.prototype.toogleSubGroupElementOn = function (element, allowAll) {
            if (allowAll === void 0) { allowAll = false; }
            var elements = element.querySelectorAll('li.cookie-subgroup');
            for (var i = 0; i < elements.length; i++) {
                var checkbox = elements[i].querySelector('input[class*="cookie-subgroup-handler"]');
                moduleHelper.setCheckedAttribute(null, checkbox, true);
                if (!allowAll) {
                    var subGroupData = groupsNext.getGroupById(elements[i].getAttribute('data-optanongroupid'));
                    coreNext.toggleGroupStatusOn(subGroupData);
                    groupsNext.toggleGroupHosts(subGroupData, true);
                }
            }
        };
        GroupsV2.prototype.toogleSubGroupElementOff = function (element) {
            var elements = element.querySelectorAll('li.cookie-subgroup');
            for (var i = 0; i < elements.length; i++) {
                var checkbox = elements[i].querySelector('input[class*="cookie-subgroup-handler"]');
                moduleHelper.setCheckedAttribute(null, checkbox, false);
                var subGroupData = groupsNext.getGroupById(elements[i].getAttribute('data-optanongroupid'));
                coreNext.toggleGroupStatusOff(subGroupData);
                groupsNext.toggleGroupHosts(subGroupData, false);
            }
        };
        GroupsV2.prototype.isIabPurposeActive = function (group) {
            var groupId = externalData.extractGroupIdForIabGroup(groupsHelper.getGroupIdForCookie(group).toString());
            var source = group.Type === GROUP_TYPES.IAB2_SPL_FEATURE
                ? externalData.BannerVariables.vendors.selectedSpecialFeatures
                : externalData.BannerVariables.vendors.selectedPurpose;
            return OneTrustBannerLibrary.inArray(groupId + ":true", source);
        };
        GroupsV2.prototype.isGroupActive = function (group) {
            var groupIsActive;
            if (CONSENTABLE_IAB_GROUPS.indexOf(group.Type) > -1) {
                groupIsActive = this.isIabPurposeActive(group) !== -1;
            }
            else {
                groupIsActive =
                    OneTrustBannerLibrary.inArray(groupsHelper.getGroupIdForCookie(group) + ':1', externalData.BannerVariables.optanonHtmlGroupData) !== -1;
            }
            return groupIsActive;
        };
        GroupsV2.prototype.IsGroupInActive = function (group) {
            var groupIsActive;
            if (CONSENTABLE_IAB_GROUPS.indexOf(group.Type) > -1) {
                groupIsActive = this.isIabPurposeActive(group) === -1;
            }
            else {
                groupIsActive =
                    OneTrustBannerLibrary.inArray(groupsHelper.getGroupIdForCookie(group) + ':1', externalData.BannerVariables.optanonHtmlGroupData) === -1;
            }
            return groupIsActive;
        };
        GroupsV2.prototype.safeFormattedGroupDescription = function (group) {
            if (group && group.GroupDescription) {
                return group.GroupDescription.replace(/\r\n/g, '<br>');
            }
            else {
                return '';
            }
        };
        GroupsV2.prototype.canInsertForGroup = function (groupId, ignoreGroupCheck) {
            if (ignoreGroupCheck === void 0) { ignoreGroupCheck = false; }
            var validGroup = groupId != null && typeof groupId !== 'undefined';
            var isExistingActiveGroup;
            var isNonExistingGroup;
            var groupDataFromCookies = externalData.readCookieParam(externalData.BannerVariables.optanonCookieName, 'groups');
            var groupData = externalData.BannerVariables.optanonHtmlGroupData.join(',');
            if (!ignoreGroupCheck) {
                if (groupDataFromCookies !== groupData) { // model variable is insync with cookies
                    coreNext.ensureHtmlGroupDataInitialised();
                }
                isExistingActiveGroup = moduleHelper.contains(externalData.BannerVariables.optanonHtmlGroupData, groupId + ':1');
                isNonExistingGroup = !this.doesGroupExist(groupId);
                if (validGroup &&
                    ((isExistingActiveGroup &&
                        coreNext.canSoftOptInInsertForGroup(groupId)) ||
                        isNonExistingGroup)) {
                    return true;
                }
                return false;
            }
            return true;
        };
        GroupsV2.prototype.getGroupSubGroups = function (group) {
            return group.SubGroups;
        };
        // Returns true if group id exist in json
        GroupsV2.prototype.doesGroupExist = function (groupId) {
            return groupsNext.getGroupById(groupId) ? true : false;
        };
        return GroupsV2;
    }());
    var groupsV2;
    function initializeGroupsV2() {
        groupsV2 = new GroupsV2();
    }

    var CoreV2 = /** @class */ (function () {
        function CoreV2() {
        }
        CoreV2.prototype.updateFilterSelection = function (isHostList) {
            if (isHostList === void 0) { isHostList = false; }
            var selection;
            var attributeName;
            if (isHostList) {
                selection = externalData.BannerVariables.filterByCategories;
                attributeName = 'data-optanongroupid';
            }
            else {
                selection = externalData.BannerVariables.filterByIABCategories;
                attributeName = 'data-purposeid';
            }
            var categoryFilters = OT('#onetrust-pc-sdk .category-filter-handler').el;
            for (var i = 0; i < categoryFilters.length; i++) {
                var groupId = categoryFilters[i].getAttribute(attributeName);
                if (selection.indexOf(groupId) > -1) {
                    categoryFilters[i].checked = true;
                }
                else {
                    categoryFilters[i].checked = false;
                }
            }
        };
        CoreV2.prototype.cancelHostFilter = function () {
            var categoryFilters = OT('#onetrust-pc-sdk .category-filter-handler').el;
            for (var i = 0; i < categoryFilters.length; i++) {
                var optanonGroupId = categoryFilters[i].getAttribute('data-optanongroupid');
                if (categoryFilters[i].checked &&
                    externalData.BannerVariables.filterByCategories.indexOf(optanonGroupId) < 0) {
                    categoryFilters[i].checked = '';
                }
            }
        };
        CoreV2.prototype.updateHostFilterList = function () {
            var categoryFilters = OT('#onetrust-pc-sdk .category-filter-handler').el;
            for (var i = 0; i < categoryFilters.length; i++) {
                var optanonGroupId = categoryFilters[i].getAttribute('data-optanongroupid');
                if (categoryFilters[i].checked &&
                    externalData.BannerVariables.filterByCategories.indexOf(optanonGroupId) < 0) {
                    externalData.BannerVariables.filterByCategories.push(optanonGroupId);
                }
                else if (!categoryFilters[i].checked &&
                    externalData.BannerVariables.filterByCategories.indexOf(optanonGroupId) > -1) {
                    var selection = externalData.BannerVariables.filterByCategories;
                    externalData.BannerVariables.filterByCategories.splice(selection.indexOf(optanonGroupId), 1);
                }
            }
            return externalData.BannerVariables.filterByCategories;
        };
        CoreV2.prototype.getHostCookies = function (group) {
            if (!group.Hosts.length) {
                return [];
            }
            var cookies = [];
            group.Hosts.Cookies.map(function (cookie) {
                cookies.push({
                    cookie: cookie,
                    optanonGroupId: groupsHelper.getGroupIdForCookie(group)
                });
            });
            return cookies;
        };
        CoreV2.prototype.InitializeHostList = function () {
            // TODO: remove this condition once it's integrated for all layouts
            externalData.BannerVariables.hosts.hostTemplate = OT('#vendors-list #hosts-list-container li').el[0].cloneNode(true);
            externalData.BannerVariables.hosts.hostCookieTemplate = OT('#vendors-list #hosts-list-container .host-option-group li').el[0].cloneNode(true);
        };
        CoreV2.prototype.getCookiesForGroup = function (group) {
            var thirdPartyCookiesList = [];
            var firstPartyCookiesList = [];
            // 1st Party
            if (group.FirstPartyCookies.length) {
                group.FirstPartyCookies.forEach(function (cookie) {
                    firstPartyCookiesList.push(__assign({}, cookie, { groupName: group.GroupName }));
                });
            }
            // 3rd Party
            if (group.Hosts.length) {
                group.Hosts.forEach(function (host) {
                    thirdPartyCookiesList.push(__assign({}, host, { isActive: groupsNext.safeGroupDefaultStatus(group).toLowerCase() ===
                            'always active', groupName: group.GroupName }));
                });
            }
            return {
                firstPartyCookiesList: firstPartyCookiesList,
                thirdPartyCookiesList: thirdPartyCookiesList
            };
        };
        CoreV2.prototype.getDuration = function (days) {
            if (!days || parseInt(days) === 0) {
                return 'a few seconds';
            }
            var duration = parseInt(days);
            if (duration >= 365) {
                duration = duration / 365;
                duration = this.round_to_precision(duration, 0.5);
                duration = duration > 1 ? duration + ' years' : duration + ' year';
            }
            else {
                duration = duration + ' days ';
            }
            return duration;
        };
        CoreV2.prototype.reactivateSrcTag = function (element) {
            var tags = ['src'];
            // If copy data-${tag} value to ${tag}
            element.setAttribute(tags[0], element.getAttribute("data-" + tags[0]));
            element.removeAttribute('data-src'); // Remove data-src 
        };
        CoreV2.prototype.reactivateScriptTag = function (element) {
            var parent = element.parentNode;
            var script = document.createElement(element.tagName);
            script.innerHTML = element.innerHTML;
            var attributes = element.attributes;
            if (attributes.length > 0) {
                for (var i = 0; i < attributes.length; i++) {
                    if (attributes[i].name !== 'type') {
                        script.setAttribute(attributes[i].name, attributes[i].value, true);
                    }
                    else {
                        script.setAttribute('type', 'text/javascript', true);
                    }
                }
            }
            parent.appendChild(script);
            parent.removeChild(element);
        };
        CoreV2.prototype.reactivateTag = function (element, isSrc) {
            var groupIds = element.className
                .match(/optanon-category(-[a-zA-Z0-9]+)+($|\s)/)[0]
                .split(/optanon-category-/i)[1]
                .split('-');
            var isInsertGroup = true;
            if (groupIds && groupIds.length > 0) {
                for (var i = 0; i < groupIds.length; i++) {
                    if (!groupsV2.canInsertForGroup(groupIds[i].trim())) {
                        // Trim Id's to avoid additional space from class name
                        isInsertGroup = false;
                        break;
                    }
                }
                if (isInsertGroup) {
                    if (isSrc) {
                        this.reactivateSrcTag(element);
                    }
                    else {
                        this.reactivateScriptTag(element);
                    }
                }
            }
        };
        CoreV2.prototype.substitutePlainTextScriptTags = function () {
            var _this = this;
            var scriptTags = [].slice.call(document.querySelectorAll('script[class*="optanon-category"]'));
            var allSrcTags = document.querySelectorAll('*[class*="optanon-category"]');
            Array.prototype.forEach.call(allSrcTags, function (element) {
                if (element.tagName !== 'SCRIPT' && element.hasAttribute('data-src')) {
                    _this.reactivateTag(element, true);
                }
            });
            Array.prototype.forEach.call(scriptTags, function (element) {
                if (element.hasAttribute('type') && element.getAttribute('type') === 'text/plain') {
                    _this.reactivateTag(element, false);
                }
            });
        };
        CoreV2.prototype.round_to_precision = function (x, precision) {
            var y = +x + (precision === undefined ? 0.5 : precision / 2);
            return y - (y % (precision === undefined ? 1 : +precision));
        };
        return CoreV2;
    }());
    var coreV2;
    function initializeCoreV2() {
        coreV2 = new CoreV2();
    }

    var IabV2 = /** @class */ (function () {
        function IabV2() {
        }
        IabV2.prototype.getBeginEnd = function () {
            var begin = (externalData.BannerVariables.vendors.currentPage - 1) *
                externalData.BannerVariables.vendors.numberPerPage;
            var end = begin + externalData.BannerVariables.vendors.numberPerPage;
            return { begin: begin, end: end };
        };
        IabV2.prototype.nextPage = function () {
            externalData.BannerVariables.vendors.currentPage += 1;
            this.initVendorsData('', externalData.BannerVariables.currentGlobalFilteredList);
        };
        IabV2.prototype.previousPage = function () {
            externalData.BannerVariables.vendors.currentPage -= 1;
            this.initVendorsData('', externalData.BannerVariables.currentGlobalFilteredList);
        };
        IabV2.prototype.getSearchQuery = function (q) {
            var _this = this;
            var words = q.trim().split(/\s+/g);
            var searchQuery = new RegExp(words
                .map(function (word) {
                return _this.escapeRegExp(word);
            })
                .join('|') + '(.+)?', 'gi');
            return searchQuery;
        };
        IabV2.prototype.escapeRegExp = function (s) {
            return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        };
        IabV2.prototype.setGlobalFilteredList = function (filteredList) {
            externalData.BannerVariables.currentGlobalFilteredList = filteredList;
            return filteredList;
        };
        // SEARCH ALGORITHM
        IabV2.prototype.filterList = function (q, listToFilter, filterByList) {
            var searchRegex = this.getSearchQuery(q);
            var hasFilterApplied = filterByList && filterByList.length;
            // Handle User Inital Load of the list w/out search or category filters
            if (q === '' && !hasFilterApplied) {
                return this.setGlobalFilteredList(listToFilter);
            }
            // Handle User selecting cateogry filter w/out search
            if (hasFilterApplied) {
                var numberOfCategories = OT('#onetrust-pc-sdk .group-options input').el.length;
                var categoryFilteredList_1 = [];
                var removeDuplicates_1 = false;
                // If user selects all filters skip filtering
                if (numberOfCategories !== filterByList.length) {
                    listToFilter.filter(function (item) {
                        removeDuplicates_1 = true;
                        if (item.vendorName) {
                            filterByList.forEach(function (purposeId) {
                                var extractedPurposeId = parseInt(externalData.extractGroupIdForIabGroup(purposeId));
                                if (purposeId.indexOf('IFEV2_') > -1) { // Features
                                    (item.features || []).forEach(function (feature) {
                                        if (feature.featureId === extractedPurposeId) {
                                            categoryFilteredList_1.push(item);
                                        }
                                    });
                                }
                                else if (purposeId.indexOf('ISFV2_') > -1) { // Special Features
                                    item.specialFeatures.forEach(function (specialFeature) {
                                        if (specialFeature.featureId === extractedPurposeId) {
                                            categoryFilteredList_1.push(item);
                                        }
                                    });
                                }
                                else if (purposeId.indexOf('ISPV2_') > -1) { // Special purposes
                                    (item.specialPurposes || []).forEach(function (specialPurpose) {
                                        if (specialPurpose.purposeId === extractedPurposeId) {
                                            categoryFilteredList_1.push(item);
                                        }
                                    });
                                }
                                else {
                                    // Item purposes
                                    item.purposes.forEach(function (purpose) {
                                        if (purpose.purposeId === extractedPurposeId) {
                                            categoryFilteredList_1.push(item);
                                        }
                                    });
                                    // Item legitimate interest purposes
                                    item.legIntPurposes.forEach(function (purpose) {
                                        if (purpose.purposeId === extractedPurposeId) {
                                            categoryFilteredList_1.push(item);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                else {
                    categoryFilteredList_1 = listToFilter;
                }
                // Remove duplicate items
                if (removeDuplicates_1) {
                    categoryFilteredList_1 = categoryFilteredList_1.filter(function (item, idx, arr) {
                        return arr.indexOf(item) === idx;
                    });
                }
                this.setGlobalFilteredList(categoryFilteredList_1);
            }
            if (q === '') {
                // Handle User selecting cateogry filter w/out search
                return externalData.BannerVariables.currentGlobalFilteredList;
            }
            else {
                // Handle User selecting cateogry filter with search
                return externalData.BannerVariables.currentGlobalFilteredList.filter(function (item) {
                    searchRegex.lastIndex = 0;
                    if (item.vendorName) {
                        return searchRegex.test(item.vendorName);
                    }
                });
            }
        };
        IabV2.prototype.loadVendorList = function (search, filterByList) {
            if (search === void 0) { search = ''; }
            var vendorList = externalData.BannerVariables.vendors.list;
            // If it's search, update list with filtered data
            if (search) {
                vendorList = externalData.BannerVariables.currentGlobalFilteredList;
            }
            else if (filterByList.length === 0) {
                externalData.BannerVariables.currentGlobalFilteredList = vendorList;
            }
            vendorList = this.filterList(externalData.BannerVariables.vendors.searchParam, vendorList, filterByList);
            externalData.BannerVariables.vendors.currentPage = 1;
            externalData.BannerVariables.vendors.pageList = vendorList;
            OT('#onetrust-pc-sdk #vendor-list-content').el[0].scrollTop = 0;
            this.initVendorsData(search, vendorList);
        };
        IabV2.prototype.vendorsListEvent = function () {
            var vendorsList = OT('#onetrust-pc-sdk #vendors-list-container .ot-checkbox input').el;
            var allVendorsChecked = true;
            var selectAllCheckBoxContainer = OT('#onetrust-pc-sdk #select-all-container .ot-checkbox').el[0];
            var selectAllCheckBox = OT('#onetrust-pc-sdk #select-all-vendors-input-container #select-all-vendor-groups-handler').el[0];
            for (var z = 0; z < vendorsList.length; z++) {
                if (!vendorsList[z].checked) {
                    allVendorsChecked = false;
                    break;
                }
                allVendorsChecked = true;
            }
            if (!allVendorsChecked) {
                // change select all to line through
                selectAllCheckBoxContainer.classList.add('line-through');
            }
            else {
                selectAllCheckBoxContainer.classList.remove('line-through');
            }
            selectAllCheckBox.checked = true;
            for (var x = 0; x < vendorsList.length; x++) {
                if (vendorsList[x].checked) {
                    break;
                }
                if (x === vendorsList.length - 1 && !vendorsList[x].checked) {
                    selectAllCheckBox.checked = false;
                }
            }
        };
        IabV2.prototype.setNoResultsContent = function (searchString, isHostList) {
            if (isHostList === void 0) { isHostList = false; }
            var noResults = OT('#onetrust-pc-sdk #vendors-list #no-results')
                .el[0];
            if (noResults) {
                noResults.querySelector('span').innerText = searchString;
                return;
            }
            var div = document.createElement('div'), p = document.createElement('p'), text = document.createTextNode(" did not match any " + (isHostList ? 'hosts.' : 'vendors.')), span = document.createElement('span');
            div.id = 'no-results';
            span.id = 'user-text';
            span.innerText = searchString;
            p.appendChild(span);
            p.appendChild(text);
            div.appendChild(p);
            OT('#onetrust-pc-sdk #vendor-list-content').addClass('no-results');
            return OT('#onetrust-pc-sdk #vendor-list-content').append(div);
        };
        IabV2.prototype.searchHostList = function (q) {
            var cookieList = externalData.BannerVariables.currentGlobalFilteredList;
            q = q.trim();
            if (q) {
                cookieList = this.searchList(q, cookieList);
            }
            this.initHostData(q, cookieList);
        };
        IabV2.prototype.searchList = function (q, listToFilter) {
            var searchQuery = this.getSearchQuery(q);
            return listToFilter.filter(function (item) {
                searchQuery.lastIndex = 0;
                return searchQuery.test(item.HostName);
            });
        };
        IabV2.prototype.initHostData = function (searchString, cookiesList) {
            externalData.BannerVariables.optanonHostList = cookiesList; // Update the global list to search
            var commonData = externalData.BannerVariables.commonData;
            var noResults = OT('#onetrust-pc-sdk #vendors-list #no-results').el[0];
            var isAllHostsDisabled = 0;
            // Back button text
            OT('#vendors-list .back-btn-handler .pc-back-button-text')
                .text(externalData.BannerVariables.domainData.PCenterBackText);
            // Select All // Allow all toggle label 
            OT('#vendors-list #select-all-container #select-all-text-container p')
                .text(externalData.BannerVariables.domainData.PCenterAllowAllConsentText);
            // Clear UL element content
            OT('#onetrust-pc-sdk #vendor-list-content .ot-sdk-column ul#hosts-list-container').html('');
            if (cookiesList && cookiesList.length) {
                OT('#onetrust-pc-sdk #vendor-list-content').removeClass('no-results');
                if (noResults) {
                    noResults.parentElement.removeChild(noResults);
                }
            }
            else {
                this.setNoResultsContent(searchString, true);
            }
            // Set Host list title
            if (coreNext.preferenceCenterGroup.name !== 'otPcTab') {
                OT('#onetrust-pc-sdk #vendors-list-title').text(externalData.BannerVariables.domainData.PCenterCookiesListText);
            }
            var _loop_1 = function (i) {
                var host = externalData.BannerVariables.hosts.hostTemplate.cloneNode(true);
                var hostBox = host.querySelector('.host-box');
                var label = host.querySelector('label');
                // Set attributes to input
                if (hostBox) {
                    hostBox.id = 'host-' + i;
                    label.setAttribute('for', 'host-' + i);
                    hostBox.name = 'host-' + i;
                    hostBox.setAttribute('aria-label', cookiesList[i].HostName);
                    hostBox.setAttribute('aria-controls', 'host-acc-txt-' + i);
                }
                // Add aria attributes to the Accordion text for Accessibility purposes    
                var hostAccordionText = host.querySelector('.accordion-text');
                if (hostAccordionText) {
                    hostAccordionText.setAttribute('id', 'host-acc-txt-' + i);
                    hostAccordionText.setAttribute('role', 'region');
                    hostAccordionText.setAttribute('aria-labelledby', hostBox.id);
                }
                if (!externalData.BannerVariables.commonData.allowHostOptOut ||
                    cookiesList[i].isFirstParty) {
                    // remove check box element if opt out not enabled
                    var checkbox = host.querySelector('.ot-checkbox');
                    if (checkbox) {
                        checkbox.parentElement.removeChild(checkbox);
                    }
                }
                else {
                    // Toogle group(checkbox)
                    host.querySelector('.ot-checkbox input').id = 'host-chkbox-' + i;
                    host.querySelector('.ot-checkbox input').setAttribute('aria-label', cookiesList[i].HostName);
                    host
                        .querySelector('.ot-checkbox input')
                        .setAttribute('hostId', cookiesList[i].HostId);
                    host
                        .querySelector('.ot-checkbox label')
                        .setAttribute('for', 'host-chkbox-' + i);
                    // set host status
                    if (externalData.BannerVariables.oneTrustHostConsent.indexOf(cookiesList[i].HostId + ":1") !== -1) {
                        host.querySelector('.ot-checkbox input').checked = true;
                        host
                            .querySelector('.ot-checkbox input')
                            .setAttribute('checked', true);
                        // Disable hosts which belongs to strictly necessary
                        if (cookiesList[i].isActive) {
                            isAllHostsDisabled++;
                            host.querySelector('.ot-checkbox input').disabled = true;
                            host
                                .querySelector('.ot-checkbox input')
                                .setAttribute('disabled', true);
                        }
                    }
                    else {
                        host.querySelector('.ot-checkbox input').checked = false;
                        host
                            .querySelector('.ot-checkbox input')
                            .setAttribute('checked', false);
                    }
                    host.querySelector('label .label-text').innerText =
                        cookiesList[i].HostName;
                }
                // Host name
                var hostName = cookiesList[i].HostName;
                if (externalData.BannerVariables.domainData.AddLinksToCookiepedia &&
                    !cookiesList[i].isFirstParty) {
                    hostName = "<a href=\"http://cookiepedia.co.uk/host/" + hostName + "\" target=\"_blank\"\n              style=\"text-decoration: underline;\">" + hostName + "</a>";
                }
                host.querySelector('.host-title').innerHTML = hostName;
                // Host Description
                host.querySelector('.host-description').innerText =
                    cookiesList[i].Description;
                // View Cookies label
                if (externalData.BannerVariables.domainData.PCViewCookiesText) {
                    host.querySelector('.host-view-cookies').innerText =
                        externalData.BannerVariables.domainData.PCViewCookiesText;
                }
                // Remove element if description not present
                if (!cookiesList[i].Description) {
                    var descriptionContainer = host.querySelector('.host-description');
                    descriptionContainer.parentElement.removeChild(descriptionContainer);
                }
                // Clear Ul element
                OT(host.querySelector('.host-option-group')).html('');
                // Add Cookies to the host
                cookiesList[i].Cookies.forEach(function (cookie) {
                    var cookieElement = externalData.BannerVariables.hosts.hostCookieTemplate.cloneNode(true);
                    // Cookie Name
                    var cookieName = cookie.Name;
                    if (externalData.BannerVariables.domainData.AddLinksToCookiepedia &&
                        cookiesList[i].isFirstParty) {
                        cookieName = cookieClass.getCookieLabel(cookie);
                    }
                    cookieElement.querySelector('.cookie-name-container div:nth-child(2)').innerHTML = cookieName;
                    // Cookie Host
                    if (commonData.pcShowCookieHost) {
                        cookieElement.querySelector('.cookie-host-container div:nth-child(2)').innerText = cookie.Host;
                    }
                    else {
                        var hostContainer = cookieElement.querySelector('.cookie-host-container');
                        hostContainer.parentElement.removeChild(hostContainer);
                    }
                    // Cookie Duration
                    if (commonData.pcShowCookieDuration) {
                        cookieElement.querySelector('.cookie-duration-container div:nth-child(2)').innerText = cookie.IsSession
                            ? 'Session'
                            : coreV2.getDuration(cookie.Length);
                    }
                    else {
                        var durationContainer = cookieElement.querySelector('.cookie-duration-container');
                        durationContainer.parentElement.removeChild(durationContainer);
                    }
                    // Cookie Type
                    if (commonData.pcShowCookieType) {
                        cookieElement.querySelector('.cookie-type-container div:nth-child(2)').innerText = cookiesList[i].isFirstParty ? '1st Party' : '3rd Party';
                    }
                    else {
                        var typeContainer = cookieElement.querySelector('.cookie-type-container');
                        typeContainer.parentElement.removeChild(typeContainer);
                    }
                    // Cookie Category
                    if (commonData.pcShowCookieCategory) {
                        var cookieCategory = cookiesList[i].isFirstParty
                            ? cookie.groupName
                            : cookiesList[i].groupName;
                        cookieElement.querySelector('.cookie-category-container div:nth-child(2)').innerText = cookieCategory;
                    }
                    else {
                        var categoryContainer = cookieElement.querySelector('.cookie-category-container');
                        categoryContainer.parentElement.removeChild(categoryContainer);
                    }
                    // Cookie Description
                    if (commonData.pcShowCookieDescription && cookie.description) {
                        cookieElement.querySelector('.cookie-description-container div:nth-child(2)').innerText = cookie.description;
                    }
                    else {
                        var descriptionContainer = cookieElement.querySelector('.cookie-description-container');
                        descriptionContainer.parentElement.removeChild(descriptionContainer);
                    }
                    OT(host.querySelector('.host-option-group')).append(cookieElement);
                });
                OT('#onetrust-pc-sdk #vendor-list-content .ot-sdk-column ul#hosts-list-container').append(host);
            };
            for (var i = 0; i < cookiesList.length; i++) {
                _loop_1(i);
            }
            if (externalData.BannerVariables.commonData.allowHostOptOut) {
                // Disable select all checkbox if all hosts are having disabled property
                if (isAllHostsDisabled === cookiesList.length) {
                    OT('#onetrust-pc-sdk #select-all-hosts-input-container #select-all-hosts-groups-handler').el[0].disabled = true;
                    OT('#onetrust-pc-sdk #select-all-hosts-input-container #select-all-hosts-groups-handler').el[0].setAttribute('disbled', true);
                }
                else {
                    OT('#onetrust-pc-sdk #select-all-hosts-input-container #select-all-hosts-groups-handler').el[0].disabled = false;
                    OT('#onetrust-pc-sdk #select-all-hosts-input-container #select-all-hosts-groups-handler').el[0].setAttribute('disbled', false);
                }
                // bind expand/collapse click handler to vendors
                var hostsDOMList = OT('#onetrust-pc-sdk #hosts-list-container .ot-checkbox input').el;
                for (var y = 0; y < hostsDOMList.length; y++) {
                    hostsDOMList[y].addEventListener('click', this.hostsListEvent);
                }
                OT('#onetrust-pc-sdk #select-all-container').removeClass('hide');
                this.hostsListEvent();
            }
            else {
                OT('#onetrust-pc-sdk #select-all-container').addClass('hide');
            }
        };
        IabV2.prototype.hostsListEvent = function () {
            var hostsList = OT('#onetrust-pc-sdk #hosts-list-container .ot-checkbox input').el;
            var allVendorsChecked = true;
            var selectAllCheckBoxContainer = OT('#onetrust-pc-sdk #select-all-container .ot-checkbox').el[0];
            var selectAllCheckBox = OT('#onetrust-pc-sdk #select-all-hosts-input-container #select-all-hosts-groups-handler').el[0];
            for (var z = 0; z < hostsList.length; z++) {
                if (!hostsList[z].checked) {
                    allVendorsChecked = false;
                    break;
                }
                allVendorsChecked = true;
            }
            if (!allVendorsChecked) {
                // change select all to line through
                selectAllCheckBoxContainer.classList.add('line-through');
            }
            else {
                selectAllCheckBoxContainer.classList.remove('line-through');
            }
            selectAllCheckBox.checked = true;
            for (var x = 0; x < hostsList.length; x++) {
                if (hostsList[x].checked) {
                    break;
                }
                if (x === hostsList.length - 1 && !hostsList[x].checked) {
                    selectAllCheckBox.checked = false;
                }
            }
        };
        IabV2.prototype.loadHostList = function (q, filterByList) {
            if (q === void 0) { q = ''; }
            var thirdPartyCookiesList = [];
            var firstPartyCookiesList = [];
            externalData.BannerVariables.domainData.Groups.forEach(function (group) {
                group.SubGroups.concat([group]).forEach(function (grp) {
                    if (filterByList.length) {
                        if (filterByList.indexOf(groupsHelper.getGroupIdForCookie(grp)) !== -1) {
                            var cookies = coreV2.getCookiesForGroup(grp);
                            firstPartyCookiesList = firstPartyCookiesList.concat(cookies.firstPartyCookiesList); // 1st
                            thirdPartyCookiesList = thirdPartyCookiesList.concat(cookies.thirdPartyCookiesList); // 3rd
                        }
                    }
                    else {
                        var cookies = coreV2.getCookiesForGroup(grp);
                        firstPartyCookiesList = firstPartyCookiesList.concat(cookies.firstPartyCookiesList); // 1st
                        thirdPartyCookiesList = thirdPartyCookiesList.concat(cookies.thirdPartyCookiesList); // 3rd
                    }
                });
            });
            // prepend first party cookies to the list
            if (firstPartyCookiesList.length) {
                thirdPartyCookiesList.unshift({
                    HostName: externalData.BannerVariables.domainData.PCFirstPartyCookieListText ||
                        'First Party Cookies',
                    HostId: 'first-party-cookies-group',
                    isFirstParty: true,
                    Cookies: firstPartyCookiesList,
                    Description: ''
                });
            }
            externalData.BannerVariables.currentGlobalFilteredList = thirdPartyCookiesList;
            this.initHostData(q, thirdPartyCookiesList);
        };
        IabV2.prototype.initVendorsData = function (searchString, vendorList) {
            var activeList = vendorList;
            var commonData = externalData.BannerVariables.commonData;
            // Back button text
            OT('#vendors-list .back-btn-handler .pc-back-button-text')
                .text(externalData.BannerVariables.domainData.PCenterBackText);
            // Select All // Allow all toggle label 
            OT('#vendors-list #select-all-container #select-all-text-container p')
                .text(externalData.BannerVariables.domainData.PCenterAllowAllConsentText);
            // Clear UL element content
            OT('#onetrust-pc-sdk #vendor-list-content .ot-sdk-column #vendors-list-container').html('');
            var hasNoResults = OT('#onetrust-pc-sdk #vendor-list-content #no-results');
            if (activeList.length) {
                OT('#onetrust-pc-sdk #vendor-list-content').removeClass('no-results');
                if (hasNoResults.length) {
                    hasNoResults.remove();
                }
            }
            else {
                this.setNoResultsContent(searchString, false);
            }
            // Set vendor list title
            if (coreNext.preferenceCenterGroup.name !== 'otPcTab') {
                OT('#onetrust-pc-sdk #vendors-list-title').text(externalData.BannerVariables.domainData.PCenterVendorsListText);
            }
            var _loop_2 = function (i) {
                var vendor = externalData.BannerVariables.vendors.vendorTemplate.cloneNode(true);
                // Input - To toggle vendor
                var vendorBox = vendor.querySelector('.vendor-box');
                // Accordion header logic
                var purposesCount = 0;
                // Set attributes to input
                vendorBox.id = 'IAB' + activeList[i].vendorId;
                vendorBox.name = 'IAB' + activeList[i].vendorId;
                vendorBox.nextElementSibling.setAttribute('for', 'IAB' + activeList[i].vendorId);
                vendorBox.setAttribute('aria-controls', 'IAB-ACC-TXT' + activeList[i].vendorId);
                vendor.querySelector('input').setAttribute('aria-label', activeList[i].vendorName);
                // Set vendor title/name
                vendor.querySelector('.vendor-title').innerText =
                    activeList[i].vendorName;
                // Set vendor privacy notice link
                vendor.querySelector('.vendor-privacy-notice').textContent = externalData.BannerVariables.domainData.PCenterViewPrivacyPolicyText;
                vendor
                    .querySelector('.vendor-privacy-notice')
                    .setAttribute('href', activeList[i].policyUrl);
                vendor
                    .querySelector('.vendor-privacy-notice')
                    .setAttribute('target', '_blank');
                // Toogle group(checkbox)
                vendor.querySelector('.toggle-group .ot-checkbox input').id =
                    'vendor-chkbox-' + i;
                vendor
                    .querySelector('.toggle-group .ot-checkbox input')
                    .setAttribute('vendorId', activeList[i].vendorId);
                // Aria-labels for input
                vendor.querySelector('.toggle-group .ot-checkbox input')
                    .setAttribute('aria-label', activeList[i].vendorName);
                vendor
                    .querySelector('.toggle-group .ot-checkbox label')
                    .setAttribute('for', 'vendor-chkbox-' + i);
                // Hidden label text
                vendor.querySelector('.label-text').textContent =
                    activeList[i].vendorName;
                // Accordion text logic
                var vendorAccordionText = vendor.querySelector('.accordion-text');
                if (vendorAccordionText) {
                    vendorAccordionText.setAttribute('id', 'IAB-ACC-TXT' + activeList[i].vendorId);
                    vendorAccordionText.setAttribute('aria-labelledby', vendorBox.id);
                    vendorAccordionText.setAttribute('role', 'region');
                }
                var consentPurposeTitleContainer = vendor.querySelector('.vendor-option-purpose'); // returns first element to update the purpose container title
                var venderConsentGroup = vendor.querySelector('.vendor-consent-group');
                var legitimateInterest = vendor.querySelector('.legitimate-interest');
                var legitimateInterestGroup = vendor.querySelector('.legitimate-interest-group');
                var vendorFeature = vendor.querySelector('.vendor-feature');
                var vendorFeatureGroup = vendor.querySelector('.vendor-feature-group');
                var vendorConsentGroupTemplate = venderConsentGroup.cloneNode(true);
                var vendorLegitimateInterestGroupTemplate = legitimateInterestGroup.cloneNode(true);
                var vendorFeatureTemplate = vendorFeatureGroup.cloneNode(true);
                // Insert Consert Purposes / Replace Consent Group With Data
                venderConsentGroup.parentElement.removeChild(venderConsentGroup);
                OT(consentPurposeTitleContainer.querySelector('p')).text(commonData.ConsentPurposesText);
                activeList[i].purposes.forEach(function (purpose) {
                    OT(vendorConsentGroupTemplate.querySelector('.consent-category')).text(purpose.purposeName);
                    // Removing consent status paragraph for now
                    var consentStatus = vendorConsentGroupTemplate.querySelector('.consent-status');
                    if (consentStatus) {
                        vendorConsentGroupTemplate.removeChild(consentStatus);
                    }
                    legitimateInterest.insertAdjacentHTML('beforebegin', vendorConsentGroupTemplate.outerHTML);
                    purposesCount++;
                });
                // Insert Legitimate Interest Purposes / Replace With Data
                legitimateInterestGroup.parentElement.removeChild(legitimateInterestGroup);
                OT(legitimateInterest.querySelector('p')).text(commonData.LegitimateInterestPurposesText);
                if (externalData.BannerVariables.domainData.IabType !== 'IAB2') {
                    activeList[i].legIntPurposes.forEach(function (legIntPurpose) {
                        OT(vendorLegitimateInterestGroupTemplate.querySelector('.consent-category')).text(legIntPurpose.purposeName);
                        OT(vendorLegitimateInterestGroupTemplate.querySelector('.vendor-opt-out-handler')).attr('href', activeList[i].policyUrl);
                        legitimateInterest.insertAdjacentHTML('afterend', vendorLegitimateInterestGroupTemplate.outerHTML);
                        purposesCount++;
                    });
                }
                // Insert features
                vendorFeatureGroup.parentElement.removeChild(vendorFeatureGroup);
                OT(vendorFeature.querySelector('p')).text(commonData.FeaturesText);
                activeList[i].features.forEach(function (feature) {
                    OT(vendorFeatureTemplate.querySelector('.consent-category')).text(feature.featureName);
                    vendorFeature.insertAdjacentHTML('afterend', vendorFeatureTemplate.outerHTML);
                });
                if (activeList[i].features.length === 0) {
                    vendorFeature.parentElement.removeChild(vendorFeature);
                }
                if (activeList[i].legIntPurposes.length === 0
                    || externalData.BannerVariables.domainData.IabType === 'IAB2') {
                    legitimateInterest.parentElement.removeChild(legitimateInterest);
                }
                // Accordion-header: Display Purposes Count
                var purposesCountElement = vendorBox.parentElement.querySelector('.vendor-purposes p');
                if (externalData.iabType === 'IAB') {
                    OT(purposesCountElement).text(purposesCount + " " + (purposesCount < 2 ? 'Purpose' : 'Purposes'));
                }
                else {
                    purposesCountElement.parentElement.removeChild(purposesCountElement);
                }
                // Set Vendor Status
                var isVendorActive = OneTrustBannerLibrary.inArray(activeList[i].vendorId + ':true', externalData.BannerVariables.vendors.selectedVendors) !== -1;
                if (isVendorActive) {
                    vendor.querySelector('.toggle-group .ot-checkbox input').checked = true;
                }
                else {
                    vendor.querySelector('.toggle-group .ot-checkbox input').checked = false;
                }
                OT('#onetrust-pc-sdk #vendor-list-content .ot-sdk-column #vendors-list-container').append(vendor);
            };
            for (var i = 0; i < activeList.length; i++) {
                _loop_2(i);
            }
            // bind expand/collapse click handler to vendors
            var vendorsDOMList = OT('#onetrust-pc-sdk #vendors-list-container .ot-checkbox input').el;
            for (var y = 0; y < vendorsDOMList.length; y++) {
                vendorsDOMList[y].addEventListener('click', this.vendorsListEvent);
            }
            OT('#onetrust-pc-sdk #select-all-container').removeClass('hide');
            // Check if the select all box should have a line-through
            this.vendorsListEvent();
        };
        IabV2.prototype.InitializeVendorList = function () {
            externalData.BannerVariables.vendors.list = externalData.BannerVariables
                .iabData
                ? externalData.BannerVariables.iabData.vendors
                : null;
            externalData.BannerVariables.vendors.selectedVendors = externalData.BannerVariables.oneTrustIABConsent.vendors.slice();
            externalData.BannerVariables.vendors.numberOfPages = Math.ceil(externalData.BannerVariables.vendors.list.length /
                externalData.BannerVariables.vendors.numberPerPage);
            externalData.BannerVariables.vendors.vendorTemplate = OT('#vendors-list #vendors-list-container li').el[0].cloneNode(true);
        };
        IabV2.prototype.cancelVendorFilter = function () {
            var categoryFilters = OT('#onetrust-pc-sdk .category-filter-handler').el;
            for (var i = 0; i < categoryFilters.length; i++) {
                var purposeId = categoryFilters[i].getAttribute('data-purposeid');
                if (categoryFilters[i].checked &&
                    externalData.BannerVariables.filterByIABCategories.indexOf(purposeId) <
                        0) {
                    categoryFilters[i].checked = '';
                }
            }
        };
        IabV2.prototype.updateVendorFilterList = function () {
            var categoryFilters = OT('#onetrust-pc-sdk .category-filter-handler').el;
            for (var i = 0; i < categoryFilters.length; i++) {
                var purposeId = categoryFilters[i].getAttribute('data-purposeid');
                if (categoryFilters[i].checked &&
                    externalData.BannerVariables.filterByIABCategories.indexOf(purposeId) <
                        0) {
                    externalData.BannerVariables.filterByIABCategories.push(purposeId);
                }
                else if (!categoryFilters[i].checked &&
                    externalData.BannerVariables.filterByIABCategories.indexOf(purposeId) >
                        -1) {
                    var selection = externalData.BannerVariables.filterByIABCategories;
                    externalData.BannerVariables.filterByIABCategories.splice(selection.indexOf(purposeId), 1);
                }
            }
            return externalData.BannerVariables.filterByIABCategories;
        };
        IabV2.prototype.saveVendorStatus = function () {
            // overriding this method incase of opted vendors are handled in click listeners.
            // Iab Vendors
            externalData.BannerVariables.oneTrustIABConsent.vendors = externalData.BannerVariables.vendors.selectedVendors.slice();
            // Iab Purpose
            externalData.BannerVariables.oneTrustIABConsent.purpose = externalData.BannerVariables.vendors.selectedPurpose.slice();
            // Iab Special Features
            externalData.BannerVariables.oneTrustIABConsent.specialFeatures = externalData.BannerVariables.vendors.selectedSpecialFeatures.slice();
        };
        IabV2.prototype.updateIabVariableReference = function () {
            // Iab Purpose
            externalData.BannerVariables.vendors.selectedPurpose = externalData.BannerVariables.oneTrustIABConsent.purpose.slice();
            // Iab Vendors
            externalData.BannerVariables.vendors.selectedVendors = externalData.BannerVariables.oneTrustIABConsent.vendors.slice();
            // Iab Special Features
            externalData.BannerVariables.vendors.selectedSpecialFeatures = externalData.BannerVariables.oneTrustIABConsent.specialFeatures.slice();
        };
        IabV2.prototype.allowAllhandler = function () {
            coreNext.initializeIABData(true);
        };
        IabV2.prototype.rejectAllHandler = function () {
            coreNext.initializeIABData(false, true);
        };
        IabV2.prototype.assignIABGlobalScope = function () {
            externalData.BannerVariables.oneTrustIABgdprAppliesGlobally =
                externalData.BannerVariables.constant.EUCOUNTRIES.indexOf(externalData.userLocation.country) >= 0;
        };
        return IabV2;
    }());
    var iabV2;
    function initializeIabV2() {
        iabV2 = new IabV2();
    }

    var CommonStyles = /** @class */ (function () {
        function CommonStyles() {
            this.importCSS = function () {
                return {
                    css: "#onetrust-banner-sdk{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}#onetrust-banner-sdk .onetrust-vendors-list-handler{cursor:pointer;color:#1f96db;font-size:inherit;font-weight:bold;text-decoration:none;margin-left:5px}#onetrust-banner-sdk .onetrust-vendors-list-handler:hover{color:#1f96db}#onetrust-banner-sdk .close-icon,#onetrust-pc-sdk .close-icon{background-image:url(\"data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMzQ4LjMzM3B4IiBoZWlnaHQ9IjM0OC4zMzNweCIgdmlld0JveD0iMCAwIDM0OC4zMzMgMzQ4LjMzNCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzQ4LjMzMyAzNDguMzM0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PHBhdGggZmlsbD0iIzU2NTY1NiIgZD0iTTMzNi41NTksNjguNjExTDIzMS4wMTYsMTc0LjE2NWwxMDUuNTQzLDEwNS41NDljMTUuNjk5LDE1LjcwNSwxNS42OTksNDEuMTQ1LDAsNTYuODVjLTcuODQ0LDcuODQ0LTE4LjEyOCwxMS43NjktMjguNDA3LDExLjc2OWMtMTAuMjk2LDAtMjAuNTgxLTMuOTE5LTI4LjQxOS0xMS43NjlMMTc0LjE2NywyMzEuMDAzTDY4LjYwOSwzMzYuNTYzYy03Ljg0Myw3Ljg0NC0xOC4xMjgsMTEuNzY5LTI4LjQxNiwxMS43NjljLTEwLjI4NSwwLTIwLjU2My0zLjkxOS0yOC40MTMtMTEuNzY5Yy0xNS42OTktMTUuNjk4LTE1LjY5OS00MS4xMzksMC01Ni44NWwxMDUuNTQtMTA1LjU0OUwxMS43NzQsNjguNjExYy0xNS42OTktMTUuNjk5LTE1LjY5OS00MS4xNDUsMC01Ni44NDRjMTUuNjk2LTE1LjY4Nyw0MS4xMjctMTUuNjg3LDU2LjgyOSwwbDEwNS41NjMsMTA1LjU1NEwyNzkuNzIxLDExLjc2N2MxNS43MDUtMTUuNjg3LDQxLjEzOS0xNS42ODcsNTYuODMyLDBDMzUyLjI1OCwyNy40NjYsMzUyLjI1OCw1Mi45MTIsMzM2LjU1OSw2OC42MTF6Ii8+PC9nPjwvc3ZnPg==\");background-size:contain;background-repeat:no-repeat;background-position:center;height:12px;width:12px}#onetrust-banner-sdk .powered-by-logo,#onetrust-pc-sdk .powered-by-logo{background-image:url(\"data:image/svg+xml;base64,PHN2ZyBpZD0ic3ZnLXRlc3QiIHdpZHRoPSIxNTJweCIgaGVpZ2h0PSIyNXB4IiB2aWV3Qm94PSIwIDAgMTE1MiAxNDkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHRpdGxlPlBvd2VyZWQgQnkgT25lVHJ1c3Q8L3RpdGxlPjxkZXNjPkxpbmsgdG8gT25lVHJ1c3QgV2Vic2l0ZTwvZGVzYz48ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjMuMDAwMDAwLCAtMjAuMDAwMDAwKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjU4LjAwMDAwMCwgMC4wMDAwMDApIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtOTAuMDAwMDAwLCAzNS4wMDAwMDApIj48cGF0aCBkPSJNNzYuMTgsNDIuNiBDNzYuMTgsNTUuODUzMzMzMyA3Mi44NDY2NjY3LDY2LjI3MzMzMzMgNjYuMTgsNzMuODYgQzU5LjUxMzMzMzMsODEuNDQ2NjY2NyA1MC4xOCw4NS4yNCAzOC4xOCw4NS4yNCBDMjUuOTgsODUuMjQgMTYuNTg2NjY2Nyw4MS40OTMzMzMzIDEwLDc0IEMzLjQxMzMzMzMzLDY2LjUwNjY2NjcgMC4wOCw1NiAwLDQyLjQ4IEMwLDI5IDMuMzMzMzMzMzMsMTguNTQ2NjY2NyAxMCwxMS4xMiBDMTYuNjY2NjY2NywzLjY5MzMzMzMzIDI2LjA5MzMzMzMsLTAuMDEzMzMzMzMzMyAzOC4yOCwxLjc3NjM1Njg0ZS0xNSBDNTAuMTczMzMzMywxLjc3NjM1Njg0ZS0xNSA1OS40NiwzLjc3MzMzMzMzIDY2LjE0LDExLjMyIEM3Mi44MiwxOC44NjY2NjY3IDc2LjE2NjY2NjcsMjkuMjkzMzMzMyA3Ni4xOCw0Mi42IFogTTEwLjE4LDQyLjYgQzEwLjE4LDUzLjgxMzMzMzMgMTIuNTY2NjY2Nyw2Mi4zMiAxNy4zNCw2OC4xMiBDMjIuMTEzMzMzMyw3My45MiAyOS4wNiw3Ni44MTMzMzMzIDM4LjE4LDc2LjggQzQ3LjM1MzMzMzMsNzYuOCA1NC4yOCw3My45MTMzMzMzIDU4Ljk2LDY4LjE0IEM2My42NCw2Mi4zNjY2NjY3IDY1Ljk4NjY2NjcsNTMuODUzMzMzMyA2Niw0Mi42IEM2NiwzMS40NjY2NjY3IDYzLjY2NjY2NjcsMjMuMDIgNTksMTcuMjYgQzU0LjMzMzMzMzMsMTEuNSA0Ny40MjY2NjY3LDguNjEzMzMzMzMgMzguMjgsOC42IEMyOS4xMDY2NjY3LDguNiAyMi4xMzMzMzMzLDExLjUgMTcuMzYsMTcuMyBDMTIuNTg2NjY2NywyMy4xIDEwLjIsMzEuNTMzMzMzMyAxMC4yLDQyLjYgTDEwLjE4LDQyLjYgWiIgZmlsbD0iIzZGQkU0QSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTEzNS43Miw4NC4xMiBMMTM1LjcyLDQ0IEMxMzUuNzIsMzguOTQ2NjY2NyAxMzQuNTY2NjY3LDM1LjE3MzMzMzMgMTMyLjI2LDMyLjY4IEMxMjkuOTUzMzMzLDMwLjE4NjY2NjcgMTI2LjM0NjY2NywyOC45NCAxMjEuNDQsMjguOTQgQzExNC45NDY2NjcsMjguOTQgMTEwLjE4NjY2NywzMC42OTMzMzMzIDEwNy4xNiwzNC4yIEMxMDQuMTMzMzMzLDM3LjcwNjY2NjcgMTAyLjYyLDQzLjUgMTAyLjYyLDUxLjU4IEwxMDIuNjIsODQuMTIgTDkzLjIyLDg0LjEyIEw5My4yMiwyMiBMMTAwLjg2LDIyIEwxMDIuMzgsMzAuNSBMMTAyLjg0LDMwLjUgQzEwNC43ODAyOTEsMjcuNDIzMzIwOCAxMDcuNTU0NjI5LDI0Ljk2MTA5NTYgMTEwLjg0LDIzLjQgQzExNC40NzA0MDcsMjEuNjg0NjUwMSAxMTguNDQ1MTUzLDIwLjgyMjY1NyAxMjIuNDYsMjAuODggQzEyOS45NCwyMC44OCAxMzUuNTY2NjY3LDIyLjY4IDEzOS4zNCwyNi4yOCBDMTQzLjExMzMzMywyOS44OCAxNDUsMzUuNjQ2NjY2NyAxNDUsNDMuNTggTDE0NSw4NC4xMiBMMTM1LjcyLDg0LjEyIFoiIGZpbGw9IiM2RkJFNEEiLz48cGF0aCBkPSJNMTkwLjY2LDg1LjI0IEMxODEuNDg2NjY3LDg1LjI0IDE3NC4yNDY2NjcsODIuNDQ2NjY2NyAxNjguOTQsNzYuODYgQzE2My42MzMzMzMsNzEuMjczMzMzMyAxNjAuOTY2NjY3LDYzLjUxMzMzMzMgMTYwLjk0LDUzLjU4IEMxNjAuOTQsNDMuNTggMTYzLjQwNjY2NywzNS42MzMzMzMzIDE2OC4zNCwyOS43NCBDMTczLjIyMjYxOCwyMy44NjE5ODg1IDE4MC41NjQ3MzQsMjAuNTkzODk2NCAxODguMiwyMC45IEMxOTUuMTkxODE5LDIwLjU3MjgzMjkgMjAxLjk2MzQ4MSwyMy4zOTAwNzkgMjA2LjY2LDI4LjU4IEMyMTEuMTkzMzMzLDMzLjcgMjEzLjQ2LDQwLjQ0NjY2NjcgMjEzLjQ2LDQ4LjgyIEwyMTMuNDYsNTQuODIgTDE3MC43Miw1NC44MiBDMTcwLjkwNjY2Nyw2Mi4xMTMzMzMzIDE3Mi43NDY2NjcsNjcuNjQ2NjY2NyAxNzYuMjQsNzEuNDIgQzE4MC4xMTE3NTIsNzUuMzQ5Njc5OSAxODUuNDkzNDg3LDc3LjQxMzQwNzggMTkxLDc3LjA4IEMxOTcuODI0MDU2LDc3LjA0NzIxMjYgMjA0LjU2OTE3Miw3NS42MTc4NzQzIDIxMC44Miw3Mi44OCBMMjEwLjgyLDgxLjI2IEMyMDcuNzg0MDg5LDgyLjU5OTM0ODMgMjA0LjYyMTYzLDgzLjYzMTE2NzYgMjAxLjM4LDg0LjM0IEMxOTcuODQ2NDU5LDg1LjAwMjk0OTUgMTk0LjI1NDYxNCw4NS4zMDQ1MDM3IDE5MC42Niw4NS4yNCBaIE0xODguMSwyOC43OCBDMTgzLjU3NjE0MywyOC41NTc4NDQzIDE3OS4xODQ4NTgsMzAuMzQzNjMzNyAxNzYuMSwzMy42NiBDMTcyLjkxNDg0NSwzNy40NTI2ODM2IDE3MS4wNzI2MjcsNDIuMTkxODIzNCAxNzAuODYsNDcuMTQgTDIwMy40LDQ3LjE0IEMyMDMuNCw0MS4yMDY2NjY3IDIwMi4wNjY2NjcsMzYuNjY2NjY2NyAxOTkuNCwzMy41MiBDMTk2LjU2MTUzOSwzMC4yODc5MjcgMTkyLjM5NDgzNiwyOC41NDAxMjQxIDE4OC4xLDI4Ljc4IFoiIGZpbGw9IiM2RkJFNEEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwb2x5Z29uIGZpbGw9IiM2RkJFNEEiIHBvaW50cz0iMjU2LjQyIDg0LjEyIDI0Ni44IDg0LjEyIDI0Ni44IDkuODYgMjIwLjU2IDkuODYgMjIwLjU2IDEuMyAyODIuNTYgMS4zIDI4Mi41NiA5Ljg2IDI1Ni40MiA5Ljg2Ii8+PHBhdGggZD0iTTMyMiwyMC45IEMzMjQuNDg5OTcsMjAuODc1MDQzNSAzMjYuOTc2MDQzLDIxLjEwMjg3NzcgMzI5LjQyLDIxLjU4IEwzMjguMTIsMzAuMyBDMzI1Ljg4OTkyOCwyOS43Nzc0NDM3IDMyMy42MTAxOTcsMjkuNDk1ODI5OSAzMjEuMzIsMjkuNDYgQzMxNi4zMjMyMjQsMjkuNDUyMzMxOSAzMTEuNTkwMTM5LDMxLjcwMTI4MjEgMzA4LjQ0LDM1LjU4IEMzMDQuODEzMDc5LDM5LjgxMjUyMTcgMzAyLjkwMTA2LDQ1LjI0ODkzMzcgMzAzLjA4LDUwLjgyIEwzMDMuMDgsODQuMTIgTDI5My42OCw4NC4xMiBMMjkzLjY4LDIyIEwzMDEuNDQsMjIgTDMwMi41MiwzMy41IEwzMDIuOTgsMzMuNSBDMzA0Ljk5MjUxMiwyOS43ODQyOTY3IDMwNy44NDA3MDgsMjYuNTg2OTIyNyAzMTEuMywyNC4xNiBDMzE0LjQ1MjE4OSwyMi4wMTA1NjkyIDMxOC4xODQ4MTUsMjAuODczMzM5MyAzMjIsMjAuOSBaIiBmaWxsPSIjNkZCRTRBIi8+PHBhdGggZD0iTTM0OS44NiwyMiBMMzQ5Ljg2LDYyLjMgQzM0OS44Niw2Ny4zNjY2NjY3IDM1MS4wMTMzMzMsNzEuMTQgMzUzLjMyLDczLjYyIEMzNTUuNjI2NjY3LDc2LjEgMzU5LjIzMzMzMyw3Ny4zNDY2NjY3IDM2NC4xNCw3Ny4zNiBDMzcwLjYzMzMzMyw3Ny4zNiAzNzUuMzgsNzUuNTg2NjY2NyAzNzguMzgsNzIuMDQgQzM4MS4zOCw2OC40OTMzMzMzIDM4Mi44OCw2Mi43IDM4Mi44OCw1NC42NiBMMzgyLjg4LDIyIEwzOTIuMjgsMjIgTDM5Mi4yOCw4NCBMMzg0LjUyLDg0IEwzODMuMTYsNzUuNjggTDM4Mi42Niw3NS42OCBDMzgwLjcyNzg0MSw3OC43NDM5OTkgMzc3Ljk0OTA4Niw4MS4xODIzNTY0IDM3NC42Niw4Mi43IEMzNzAuOTkxNjY5LDg0LjM3ODQzNzcgMzY2Ljk5MzQzNCw4NS4yMTIyNTc2IDM2Mi45Niw4NS4xNCBDMzU1LjQxMzMzMyw4NS4xNCAzNDkuNzYsODMuMzQ2NjY2NyAzNDYsNzkuNzYgQzM0Mi4yNCw3Ni4xNzMzMzMzIDM0MC4zNiw3MC40MzMzMzMzIDM0MC4zNiw2Mi41NCBMMzQwLjM2LDIyIEwzNDkuODYsMjIgWiIgZmlsbD0iIzZGQkU0QSIvPjxwYXRoIGQ9Ik00NTIuMjgsNjcuMTggQzQ1Mi41Mjk0NjMsNzIuNDQwMjM3OSA0NTAuMDk3OTM1LDc3LjQ2ODkwOCA0NDUuODIsODAuNTQgQzQ0MS41MTMzMzMsODMuNjczMzMzMyA0MzUuNDczMzMzLDg1LjI0IDQyNy43LDg1LjI0IEM0MTkuNDczMzMzLDg1LjI0IDQxMy4wNTMzMzMsODMuOTA2NjY2NyA0MDguNDQsODEuMjQgTDQwOC40NCw3Mi42MiBDNDExLjQ5OTMzLDc0LjE1NjEyNzQgNDE0LjcxODgwOCw3NS4zNTAwMTcyIDQxOC4wNCw3Ni4xOCBDNDIxLjI2NjI2OSw3Ny4wMjM0NzU0IDQyNC41ODUzNTMsNzcuNDYwMTk3IDQyNy45Miw3Ny40OCBDNDMxLjgzNDc3OSw3Ny42OTY2NzY5IDQzNS43Mzc5MzQsNzYuODgyOTQ0OCA0MzkuMjQsNzUuMTIgQzQ0MS41ODM0NTQsNzMuNzgyODg3MyA0NDMuMDk1MDUyLDcxLjM1NDYwNjkgNDQzLjI2MDM0Miw2OC42NjE1OTI4IEM0NDMuNDI1NjMxLDY1Ljk2ODU3ODggNDQyLjIyMjM0Myw2My4zNzM2NjYxIDQ0MC4wNiw2MS43NiBDNDM2LjI2OTg4Miw1OS4yMDM2NzM1IDQzMi4xNDQwMzIsNTcuMTg0NDk3MiA0MjcuOCw1NS43NiBDNDIzLjUwNjk2LDU0LjI2Njg2MjIgNDE5LjM3ODYzMSw1Mi4zMzY3MzQ3IDQxNS40OCw1MCBDNDEzLjI1NzUyOCw0OC42NDMwMTI1IDQxMS4zODEzNzIsNDYuNzg3Mzk4NyA0MTAsNDQuNTggQzQwOC43NjM4MDMsNDIuMzQ5OTE0IDQwOC4xNDkwNjgsMzkuODI4ODEwNyA0MDguMjIsMzcuMjggQzQwOC4wODg0MjEsMzIuNDg1NDY1OSA0MTAuNDIwNDMxLDI3Ljk1NzI5MjkgNDE0LjQsMjUuMjggQzQxOC41MiwyMi4zNiA0MjQuMTY2NjY3LDIwLjkgNDMxLjM0LDIwLjkgQzQzOC4wNzczMDMsMjAuODg3MjM1NiA0NDQuNzQ2NDY3LDIyLjI0ODI4OTUgNDUwLjk0LDI0LjkgTDQ0Ny42LDMyLjU0IEM0NDIuMjU3ODUzLDMwLjE2NDY0MTUgNDM2LjUwMzg2NCwyOC44NTM1MjAxIDQzMC42NiwyOC42OCBDNDI3LjIwODI3LDI4LjQ0NzgwNDQgNDIzLjc1NjkwNiwyOS4xMzgwNzczIDQyMC42NiwzMC42OCBDNDE4LjU0MDM2NCwzMS44MjQ4NzE4IDQxNy4yMzA4MTEsMzQuMDUxMTEzNSA0MTcuMjYsMzYuNDYgQzQxNy4yMTk0LDM3Ljk3NDIzNDMgNDE3LjY2ODI5LDM5LjQ2MTE3OTkgNDE4LjU0LDQwLjcgQzQxOS42NTQ1ODEsNDIuMDkxMjU1MSA0MjEuMDUyMTIxLDQzLjIyOTczOTQgNDIyLjY0LDQ0LjA0IEM0MjYuMTY0NjA1LDQ1Ljc5ODYwNjggNDI5Ljc5ODc5LDQ3LjMyODQzODQgNDMzLjUyLDQ4LjYyIEM0NDAuODgsNTEuMjg2NjY2NyA0NDUuODUzMzMzLDUzLjk1MzMzMzMgNDQ4LjQ0LDU2LjYyIEM0NTEuMTA5Myw1OS40NjczMzg2IDQ1Mi40OTY4NjYsNjMuMjgzMTQ2NiA0NTIuMjgsNjcuMTggTDQ1Mi4yOCw2Ny4xOCBaIiBmaWxsPSIjNkZCRTRBIi8+PHBhdGggZD0iTTQ4Ny42Miw3Ny40OCBDNDg5LjIzMzY0LDc3LjQ4NzEwOTkgNDkwLjg0NTMyLDc3LjM2NjczNTQgNDkyLjQ0LDc3LjEyIEM0OTMuNjgwOTA2LDc2Ljk0MTMxMzIgNDk0LjkwOTgzLDc2LjY4NzUxMzcgNDk2LjEyLDc2LjM2IEw0OTYuMTIsODMuNTYgQzQ5NC42ODI0MDgsODQuMTY5MjYzOSA0OTMuMTY4NDY5LDg0LjU3OTcwOTQgNDkxLjYyLDg0Ljc4IEM0ODkuODQ4ODk4LDg1LjA4MTk1MSA0ODguMDU2NTcyLDg1LjI0MjQ1NzggNDg2LjI2LDg1LjI2IEM0NzQuMjYsODUuMjYgNDY4LjI2LDc4LjkzMzMzMzMgNDY4LjI2LDY2LjI4IEw0NjguMjYsMjkuMzQgTDQ1OS4zNiwyOS4zNCBMNDU5LjM2LDI0LjggTDQ2OC4yNiwyMC44IEw0NzIuMjYsNy41NCBMNDc3LjcsNy41NCBMNDc3LjcsMjIgTDQ5NS43LDIyIEw0OTUuNywyOS4zIEw0NzcuNywyOS4zIEw0NzcuNyw2NS44OCBDNDc3LjQ5MzYyOSw2OC45NzY4NTk0IDQ3OC40NDEyMDcsNzIuMDQwNDU4OCA0ODAuMzYsNzQuNDggQzQ4Mi4yMTQ5MjgsNzYuNTA3Nzc1MSA0ODQuODc0NzI1LDc3LjYwNjg2NDkgNDg3LjYyLDc3LjQ4IEw0ODcuNjIsNzcuNDggWiIgZmlsbD0iIzZGQkU0QSIvPjwvZz48L2c+PHRleHQgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjkwIiBmb250LXdlaWdodD0iNTAwIiBmaWxsPSIjNjk2OTY5Ij48dHNwYW4geD0iMTQuMjU0ODgyOCIgeT0iMTEzIj5Qb3dlcmVkIGJ5PC90c3Bhbj48L3RleHQ+PC9nPjwvZz48L3N2Zz4=\");background-size:contain;background-repeat:no-repeat;background-position:center;height:25px;width:152px;display:block}#onetrust-banner-sdk h3 *,#onetrust-banner-sdk h4 *,#onetrust-banner-sdk h6 *,#onetrust-banner-sdk button *,#onetrust-banner-sdk a[data-parent-id] *,#onetrust-pc-sdk h3 *,#onetrust-pc-sdk h4 *,#onetrust-pc-sdk h6 *,#onetrust-pc-sdk button *,#onetrust-pc-sdk a[data-parent-id] *{font-size:inherit;font-weight:inherit;color:inherit}#onetrust-banner-sdk .hide,#onetrust-pc-sdk .hide{display:none !important}#onetrust-pc-sdk .ot-sdk-row .ot-sdk-column{padding:0}#onetrust-pc-sdk .ot-sdk-container{padding-right:0}#onetrust-pc-sdk .ot-sdk-row{flex-direction:initial;width:100%}#onetrust-pc-sdk [type=\"checkbox\"]:checked,#onetrust-pc-sdk [type=\"checkbox\"]:not(:checked){pointer-events:initial}#onetrust-pc-sdk [type=\"checkbox\"]:disabled+label::before,#onetrust-pc-sdk [type=\"checkbox\"]:disabled+label:after,#onetrust-pc-sdk [type=\"checkbox\"]:disabled+label{pointer-events:none;opacity:0.7}#onetrust-pc-sdk #vendor-list-content{transform:translate3d(0, 0, 0)}#onetrust-pc-sdk li input[type=\"checkbox\"]{z-index:1}#onetrust-pc-sdk li .ot-checkbox label{z-index:2}#onetrust-pc-sdk li .ot-checkbox input[type=\"checkbox\"]{height:auto;width:auto}#onetrust-pc-sdk li .host-title a,#onetrust-pc-sdk li .accordion-text{z-index:2;position:relative}#onetrust-pc-sdk input{margin:3px 0.1ex}#onetrust-pc-sdk .toggle-always-active{opacity:0.6;cursor:default}#onetrust-pc-sdk .screen-reader-only{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}#onetrust-pc-sdk .pc-logo{height:60px;width:180px;background:url(\"data:image/svg+xml;base64, PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTE3IiBoZWlnaHQ9IjE1MCI+CiAgPGRlZnM+CiAgICA8cGF0aCBpZD0iYSIgZD0iTS41NDc3LjI0MDRoMjEuODU5djIxLjY4ODVILjU0Nzd6Ii8+CiAgICA8cGF0aCBpZD0iYyIgZD0iTS4wMzc2LjE3MTNoNTEzLjA0Mjl2MTQ2LjUwNTVILjAzNzZ6Ii8+CiAgPC9kZWZzPgogIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICA8cGF0aCBmaWxsPSIjNUE1QjVEIiBkPSJNOS40NDc4IDEzNi45MzQzaDEuMjg0M2MxLjE5OSAwIDIuMDk2OS0uMjM3MiAyLjY5My0uNzExNy41OTU0LS40NzM5Ljg5MzQtMS4xNjQ5Ljg5MzQtMi4wNzExIDAtLjkxMzgtLjI0OTctMS41ODk4LS43NDg1LTIuMDI3Mi0uNDk5NC0uNDM1Ni0xLjI4MTgtLjY1NC0yLjM0NzItLjY1NGgtMS43NzV2NS40NjR6bTguODA5LTIuOTIxNWMwIDEuOTgxMy0uNjE4NiAzLjQ5NjQtMS44NTU5IDQuNTQ1Mi0xLjIzNzIgMS4wNDgtMi45OTcyIDEuNTcyOC01LjI3OTEgMS41NzI4aC0xLjY3NHY2LjU0Nkg1LjU0NjV2LTE4LjQwM2g1Ljg3NzdjMi4yMzExIDAgMy45Mjc3LjQ3OTUgNS4wODk3IDEuNDQwNCAxLjE2Mi45NjE1IDEuNzQzIDIuMzkzNyAxLjc0MyA0LjI5ODZ6TTI1LjYzMTcgMTM2LjQ0MjNoMS4yNTg2YzEuMjMzNSAwIDIuMTQzOS0uMjA1OSAyLjczMTItLjYxNTcuNTg3Mi0uNDExNy44ODA5LTEuMDU4Mi44ODA5LTEuOTM5NCAwLS44NzMtLjMtMS40OTM3LS44OTk4LTEuODYyNy0uNjAwNC0uMzY5LTEuNTI5LS41NTQyLTIuNzg3Ni0uNTU0MmgtMS4xODMzdjQuOTcyem0wIDMuMTczMnY3LjA2MTNoLTMuOTAxNHYtMTguNDAzaDUuMzYxNGMyLjUwMDMgMCA0LjM1LjQ1NDQgNS41NTAyIDEuMzY1MSAxLjE5OTYuOTEwNyAxLjc5ODggMi4yOTMzIDEuNzk4OCA0LjE0OCAwIDEuMDgyLS4yOTc0IDIuMDQ1My0uODkyOCAyLjg4ODItLjU5Ni44NDM1LTEuNDM5MyAxLjUwNDQtMi41Mjk4IDEuOTgzMyAyLjc2ODkgNC4xMzcyIDQuNTcyIDYuODA5NiA1LjQxMTYgOC4wMTg0aC00LjMyOTNsLTQuMzkyLTcuMDYxM2gtMi4wNzY3ek0zOC43NDQ5IDE0Ni42NzY4aDMuOTAxM3YtMTguNDAzSDM4Ljc0NXpNNTcuNzcyOSAxMjguMjczOGgzLjkzOWwtNi4yNTQ5IDE4LjQwM2gtNC4yNTMzbC02LjI0MjMtMTguNDAzaDMuOTM5NmwzLjQ2MDMgMTAuOTUwN2MuMTkyNi42NDY0LjM5MjIgMS4zOTk2LjU5OCAyLjI2MDYuMjA1MS44NTk5LjMzMzEgMS40NTguMzg0IDEuNzkzMS4wOTIyLS43NzI2LjQwNjUtMi4xMjMyLjk0MzYtNC4wNTM3bDMuNDg2LTEwLjk1MDdNNzMuMDI1IDEzOS4wMjM2Yy0xLjIzMjktMy45NzAzLTEuOTI2OC02LjIxNTItMi4wODI0LTYuNzM0OS0uMTU1Ni0uNTIwMy0uMjY2LS45MzE0LS4zMzM4LTEuMjMzOS0uMjc2NyAxLjA3NDUtMS4wNjkyIDMuNzMxMi0yLjM3OCA3Ljk2ODhoNC43OTQyem0yLjI2NTYgNy42NTMybC0xLjMzMzktNC4zODAxSDY3LjI0OWwtMS4zMzQgNC4zOGgtNC4yMDNsNi40OTM4LTE4LjQ3ODhoNC43NjkxbDYuNTE5IDE4LjQ3ODloLTQuMjAzMnpNODkuNjI0MiAxMzEuMjU2OWMtMS40NjgyIDAtMi42MDQ0LjU1MTctMy40MTA3IDEuNjU0NC0uODA1IDEuMTA0LTEuMjA3OCAyLjY0MjMtMS4yMDc4IDQuNjE0MiAwIDQuMTA0IDEuNTM5NyA2LjE1NSA0LjYxODUgNi4xNTUgMS4yOTE5IDAgMi44NTY3LS4zMjIgNC42OTQ0LS45Njl2My4yNzI0Yy0xLjUxMDIuNjMwMS0zLjE5NjcuOTQ0Ni01LjA1OS45NDQ2LTIuNjc2NSAwLTQuNzIzOC0uODEyMi02LjE0MTItMi40MzU4LTEuNDE4Ni0xLjYyMy0yLjEyNy0zLjk1NC0yLjEyNy02Ljk5MyAwLTEuOTEyOS4zNDc2LTMuNTg5MiAxLjA0NDctNS4wMjg0LjY5NTgtMS40Mzk3IDEuNjk2Ni0yLjU0MzcgMy4wMDEtMy4zMTA2IDEuMzA0NC0uNzY4MiAyLjgzMzQtMS4xNTIzIDQuNTg3MS0xLjE1MjMgMS43ODcgMCAzLjU4Mi40MzI0IDUuMzg2NSAxLjI5NjZsLTEuMjU4NiAzLjE3MjZhMjAuODE0MiAyMC44MTQyIDAgMDAtMi4wNzY4LS44NTZjLS42OTU4LS4yNDM2LTEuMzc5Ny0uMzY0Ny0yLjA1MS0uMzY0NyIvPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTUuMzY5IDEyOC4wMzM1KSI+CiAgICAgIDxtYXNrIGlkPSJiIiBmaWxsPSIjZmZmIj4KICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNhIi8+CiAgICAgIDwvbWFzaz4KICAgICAgPHBhdGggZmlsbD0iIzVBNUI1RCIgZD0iTTguNTg4OSA3LjgxNzZMMTIuNDI3NS4yNDA0aDQuMjAzTDEwLjUyNyAxMS40ODF2Ny4xNjIzSDYuNjUxNHYtNy4wMzY4TC41NDc3LjI0MDRINC43NzZsMy44MTI5IDcuNTc3Mk0yMi40MDY3IDE1LjkzN2MtLjQzNiAxLjY5NTItMS4xNzQ2IDMuNzA0OC0yLjIxNDggNi4wMjk1aC0yLjc2ODJjLjU0NTItMi4yMzI0Ljk2ODctNC4zMzggMS4yNzExLTYuMzE5NGgzLjUyM2wuMTg4OS4yOSIgbWFzaz0idXJsKCNiKSIvPgogICAgPC9nPgogICAgPHBhdGggZmlsbD0iIzVBNUI1RCIgZD0iTTEzOS4zNDUzIDE0MS41NjU1YzAgMS42NjI1LS41OTczIDIuOTcxNy0xLjc5MjYgMy45MjgyLTEuMTk1OC45NTY1LTIuODU5MSAxLjQzNDgtNC45OTA1IDEuNDM0OC0xLjk2MjYgMC0zLjctLjM2OS01LjIwOTUtMS4xMDcydi0zLjYyNjNjMS4yNDE2LjU1NDIgMi4yOTIuOTQ0NSAzLjE1MjIgMS4xNzE3Ljg2MDIuMjI2NiAxLjY0NjMuMzM5NiAyLjM1OTcuMzM5Ni44NTU4IDAgMS41MTIxLS4xNjM4IDEuOTY5NS0uNDkxNC40NTc0LS4zMjY0LjY4NTgtLjgxMzQuNjg1OC0xLjQ1OTkgMC0uMzYwOS0uMTAwNC0uNjgxNi0uMzAyNC0uOTYzNC0uMjAwOC0uMjgwNS0uNDk3LS41NTE2LS44ODcyLS44MTIxLS4zODk3LS4yNTkyLTEuMTg0Ni0uNjc0Ny0yLjM4NDItMS4yNDUyLTEuMTI0NC0uNTI5LTEuOTY3Ny0xLjAzNjgtMi41Mjk4LTEuNTIzOC0uNTYyMi0uNDg1OC0xLjAxMTQtMS4wNTMyLTEuMzQ2NS0xLjY5OS0uMzM1Ny0uNjQ2NC0uNTAzMi0xLjQwMTUtLjUwMzItMi4yNjU3IDAtMS42MjguNTUxNS0yLjkwODQgMS42NTQ1LTMuODQwNCAxLjEwMy0uOTMxMyAyLjYyODMtMS4zOTcgNC41NzQ2LTEuMzk3Ljk1NjIgMCAxLjg2OTEuMTE0MiAyLjczNzUuMzQwMS44Njc3LjIyNiAxLjc3NjIuNTQ1NCAyLjcyNDMuOTU2NWwtMS4yNTg3IDMuMDM0Yy0uOTgxMy0uNDAyNC0xLjc5MzEtLjY4MzYtMi40MzUtLjg0My0uNjQxOS0uMTU5NC0xLjI3My0uMjM5MS0xLjg5MzYtLjIzOTEtLjczODUgMC0xLjMwNS4xNzEzLTEuNjk5LjUxNTktLjM5NDcuMzQ0LS41OTE3Ljc5MzMtLjU5MTcgMS4zNDYyIDAgLjM0NDYuMDc5Ny42NDQ2LjIzOS45MDA3LjE1OTQuMjU2LjQxMzUuNTA0Ljc2MTEuNzQzLjM0ODIuMjM4IDEuMTcyNy42NjkxIDIuNDczMyAxLjI4OTggMS43MTk4LjgyMjggMi44OTgxIDEuNjQ2OSAzLjUzNjIgMi40NzM0LjYzNzUuODI2Ni45NTYyIDEuODQwMi45NTYyIDMuMDM5Nk0xNTMuMjc2NyAxNDYuNjc2OGgtMTAuNTk2NnYtMTguNDAzaDEwLjU5NjZ2My4xOTY1aC02LjY5NTN2NC4wNDEyaDYuMjI5MXYzLjE5N2gtNi4yMjl2NC43NDU1aDYuNjk1MnYzLjIyMjhNMTY0LjkyOTkgMTMxLjI1NjljLTEuNDY4OCAwLTIuNjA1LjU1MTctMy40MTA3IDEuNjU0NC0uODA1IDEuMTA0LTEuMjA3OCAyLjY0MjMtMS4yMDc4IDQuNjE0MiAwIDQuMTA0IDEuNTM5IDYuMTU1IDQuNjE4NSA2LjE1NSAxLjI5MTkgMCAyLjg1NjctLjMyMiA0LjY5MzgtLjk2OXYzLjI3MjRjLTEuNTA5Ni42MzAxLTMuMTk2MS45NDQ2LTUuMDU5Ljk0NDYtMi42NzYgMC00LjcyMzItLjgxMjItNi4xNDEyLTIuNDM1OC0xLjQxOC0xLjYyMy0yLjEyNy0zLjk1NC0yLjEyNy02Ljk5MyAwLTEuOTEyOS4zNDgyLTMuNTg5MiAxLjA0NDctNS4wMjg0LjY5NjQtMS40Mzk3IDEuNjk2NS0yLjU0MzcgMy4wMDE2LTMuMzEwNiAxLjMwNDQtLjc2ODIgMi44MzM0LTEuMTUyMyA0LjU4NzEtMS4xNTIzIDEuNzg3IDAgMy41ODIuNDMyNCA1LjM4NTggMS4yOTY2bC0xLjI1OCAzLjE3MjZhMjAuODE0MiAyMC44MTQyIDAgMDAtMi4wNzY3LS44NTZjLS42OTY1LS4yNDM2LTEuMzgwNC0uMzY0Ny0yLjA1MTEtLjM2NDdNMTg4LjUxMyAxMjguMjczOHYxMS45MDcyYzAgMS4zNi0uMzA0MyAyLjU1MjUtLjkxMjMgMy41NzU1LS42MDg2IDEuMDI0My0xLjQ4NyAxLjgwODgtMi42MzY0IDIuMzU0OC0xLjE0OTUuNTQ0OC0yLjUwODUuODE3Mi00LjA3NzcuODE3Mi0yLjM2NiAwLTQuMjAzMS0uNjA1Ny01LjUxMi0xLjgxODktMS4zMDgxLTEuMjEyNS0xLjk2MzEtMi44NzItMS45NjMxLTQuOTc4OHYtMTEuODU3aDMuODg4OHYxMS4yNjU3YzAgMS40MTg1LjI4NTQgMi40NTkuODU1OCAzLjEyMTguNTcwMy42NjI4IDEuNTE0Ljk5NDggMi44MzE1Ljk5NDggMS4yNzUgMCAyLjE5OTgtLjMzNCAyLjc3NDUtMS4wMDA1LjU3NDgtLjY2NzcuODYyMS0xLjcxNDYuODYyMS0zLjE0MTJ2LTExLjI0MDZoMy44ODg4TTE5Ni45MTkzIDEzNi40NDIzaDEuMjU4NmMxLjIzMzUgMCAyLjE0NC0uMjA1OSAyLjczMTItLjYxNTcuNTg3My0uNDExNy44ODA5LTEuMDU4Mi44ODA5LTEuOTM5NCAwLS44NzMtLjMtMS40OTM3LS44OTk3LTEuODYyNy0uNjAwNS0uMzY5LTEuNTI5LS41NTQyLTIuNzg3Ny0uNTU0MmgtMS4xODMzdjQuOTcyem0wIDMuMTczMnY3LjA2MTNoLTMuOTAxNHYtMTguNDAzaDUuMzYxNGMyLjUwMDMgMCA0LjM1LjQ1NDQgNS41NTAyIDEuMzY1MSAxLjE5OTcuOTEwNyAxLjc5ODkgMi4yOTMzIDEuNzk4OSA0LjE0OCAwIDEuMDgyLS4yOTc0IDIuMDQ1My0uODkyOSAyLjg4ODItLjU5Ni44NDM1LTEuNDM5MyAxLjUwNDQtMi41Mjk4IDEuOTgzMyAyLjc2ODkgNC4xMzcyIDQuNTcyMSA2LjgwOTYgNS40MTE2IDguMDE4NGgtNC4zMjkybC00LjM5Mi03LjA2MTNoLTIuMDc2OHpNMjEwLjAzMjUgMTQ2LjY3NjhoMy45MDEzdi0xOC40MDNoLTMuOTAxM3pNMjI1LjY2MyAxNDYuNjc2OGgtMy45MDE0VjEzMS41MjFoLTQuOTk2MnYtMy4yNDczaDEzLjg5MzF2My4yNDczaC00Ljk5NTV2MTUuMTU1N00yMzkuMjE2IDEzNS44NTFsMy44MzgtNy41NzcyaDQuMjAzOGwtNi4xMDM3IDExLjI0MDZ2Ny4xNjI0aC0zLjg3NjJWMTM5LjY0bC02LjEwMy0xMS4zNjYyaDQuMjI4M2wzLjgxMjggNy41NzcyTTI2My41NDIgMTMyLjQxNDJjMC0uNDQ0My0uMTUwNi0uNzk1Mi0uNDUzLTEuMDUxMi0uMzAxOC0uMjU1NS0uNjkxNC0uMzgzNS0xLjE3MDEtLjM4MzUtLjU2MjkgMC0xLjAwNTIuMTM0My0xLjMyNzcuNDAyMy0uMzIzMS4yNjk5LS40ODUuNjUwOC0uNDg1IDEuMTQ2IDAgLjczODcuMzk5IDEuNTUzNCAxLjE5NTMgMi40NDIuNzIyMS0uNDAyMiAxLjI3NTUtLjc5OTUgMS42NjItMS4xODk5LjM4NTMtLjM4OTcuNTc4NS0uODQ1NC41Nzg1LTEuMzY1N3ptLTQuNTE3NSA4LjkyNTNjMCAuNzIxOC4yNzA0IDEuMjk3My44MTEzIDEuNzI0Ny41NDE1LjQyOCAxLjIzNTQuNjQyIDIuMDgzLjY0MiAxLjA1NjYgMCAyLjAwOS0uMjU2IDIuODU3NC0uNzY3NWwtNC4xNzkzLTQuMTU0MmMtLjQ4NjMuMzY5LS44NzAzLjc1NS0xLjE1MTQgMS4xNTgtLjI4MS40MDIzLS40MjEuODY4LS40MjEgMS4zOTd6bTE0LjI1NzcgNS4zMzczaC00Ljc0NGwtMS40NDgtMS40MjI4Yy0xLjYwMiAxLjExNzEtMy40MTQgMS42NzQ1LTUuNDM2MSAxLjY3NDUtMi4wNDY3IDAtMy42NzA1LS40NzAxLTQuODcwMS0xLjQxMDMtMS4xOTk3LS45MzktMS43OTk1LTIuMjA5OC0xLjc5OTUtMy44MTQgMC0xLjE0OTguMjU0MS0yLjEyODkuNzYxMS0yLjkzODUuNTA4Mi0uODEwMyAxLjM3ODUtMS41Njc4IDIuNjEyLTIuMjczMi0uNjI5My0uNzIxMi0xLjA4NjctMS40MTE1LTEuMzcxNi0yLjA3MDUtLjI4Ni0uNjU4NC0uNDI4NS0xLjM3ODMtLjQyODUtMi4xNTg0IDAtMS4yNzYuNDg4OC0yLjMwMzMgMS40NjYzLTMuMDg0MS45NzY5LS43ODA4IDIuMjgzOC0xLjE3MTEgMy45MjAxLTEuMTcxMSAxLjU1OTggMCAyLjgwODQuMzYzNCAzLjc0NCAxLjA4ODkuOTM1NC43MjU1IDEuNDAyMiAxLjY5NyAxLjQwMjIgMi45MTQ2IDAgLjk5ODYtLjI4ODYgMS45MTExLS44Njc3IDIuNzM3Ny0uNTc5MS44MjY2LTEuNTE0NiAxLjYxMzYtMi44MDU5IDIuMzYwNGwzLjU3MzggMy40ODdjLjU5NTUtLjk4MTUgMS4xMTEyLTIuMjQ1IDEuNTQ4LTMuNzg5NWg0LjAwMjNjLS4zMDMgMS4xMzM1LS43MTc4IDIuMjM5NC0xLjI0NjcgMy4zMTc2LS41MjkgMS4wNzgyLTEuMTI4MSAyLjAzMjgtMS43OTk1IDIuODYzMmwzLjc4NzggMy42ODg1ek0yODkuMzkwMSAxNDYuNjc2OGgtMy45VjEzMS41MjFoLTQuOTk2M3YtMy4yNDczaDEzLjg5MjV2My4yNDczaC00Ljk5NjJ2MTUuMTU1N00zMTIuMjk0NCAxNDYuNjc2OGgtMy44ODgydi03Ljk0MjVoLTcuMjg3djcuOTQyNWgtMy45MDA3di0xOC40MDNoMy45MDA3djcuMjEyaDcuMjg3di03LjIxMmgzLjg4ODJ2MTguNDAzTTMxNi45MzggMTQ2LjY3NjhoMy45MDEzdi0xOC40MDNoLTMuOTAxNHpNMzI5LjM3MTcgMTM2LjQ0MjNoMS4yNTg2YzEuMjMyOSAwIDIuMTQzOS0uMjA1OSAyLjczMDUtLjYxNTcuNTg4LS40MTE3Ljg4MS0xLjA1ODIuODgxLTEuOTM5NCAwLS44NzMtLjI5OTMtMS40OTM3LS44OTkxLTEuODYyNy0uNjAwNS0uMzY5LTEuNTI5Ny0uNTU0Mi0yLjc4ODMtLjU1NDJoLTEuMTgyN3Y0Ljk3MnptMCAzLjE3MzJ2Ny4wNjEzaC0zLjkwMDd2LTE4LjQwM2g1LjM2MTNjMi40OTkgMCA0LjM0OTMuNDU0NCA1LjU0OTYgMS4zNjUxIDEuMTk5LjkxMDcgMS43OTg4IDIuMjkzMyAxLjc5ODggNC4xNDggMCAxLjA4Mi0uMjk4IDIuMDQ1My0uODkzNCAyLjg4ODItLjU5NDguODQzNS0xLjQzODcgMS41MDQ0LTIuNTI5MiAxLjk4MzMgMi43NjgyIDQuMTM3MiA0LjU3MTUgNi44MDk2IDUuNDExNiA4LjAxODRoLTQuMzI5OWwtNC4zOTItNy4wNjEzaC0yLjA3NjF6TTM1My42OTc2IDEzNy40YzAtMy45NTI3LTEuNzQ1NS01LjkyOTctNS4yMzU4LTUuOTI5N2gtMi4wNzYydjExLjk4MzdoMS42NzRjMy43NTgzIDAgNS42MzgtMi4wMTc4IDUuNjM4LTYuMDU0em00LjA1Mi0uMTAwNGMwIDMuMDI4OS0uODYyMSA1LjM0OTEtMi41ODYzIDYuOTYwMi0xLjcyMzUgMS42MTE3LTQuMjEzOCAyLjQxNy03LjQ2ODMgMi40MTdoLTUuMjEwN3YtMTguNDAzaDUuNzc2N2MzLjAwMjkgMCA1LjMzNTYuNzkxNSA2Ljk5NyAyLjM3ODcgMS42NjA5IDEuNTg2IDIuNDkxNiAzLjgwMTUgMi40OTE2IDYuNjQ3ek0zNjAuMDE1MiAxNDEuMzM5NWg2Ljc1NzR2LTMuMTQ2OGgtNi43NTc0ek0zNzMuNzU3NyAxMzYuOTM0M2gxLjI4MzFjMS4yMDAzIDAgMi4wOTgyLS4yMzcyIDIuNjkzLS43MTE3LjU5Ni0uNDczOS44OTQtMS4xNjQ5Ljg5NC0yLjA3MTEgMC0uOTEzOC0uMjQ5Ny0xLjU4OTgtLjc0OTEtMi4wMjcyLS40OTk0LS40MzU2LTEuMjgxOC0uNjU0LTIuMzQ3Mi0uNjU0aC0xLjc3Mzh2NS40NjR6bTguODA5MS0yLjkyMTVjMCAxLjk4MTMtLjYxOTIgMy40OTY0LTEuODU2NSA0LjU0NTItMS4yMzg2IDEuMDQ4LTIuOTk2NiAxLjU3MjgtNS4yNzk4IDEuNTcyOGgtMS42NzI4djYuNTQ2aC0zLjkwMjZ2LTE4LjQwM2g1Ljg3NzhjMi4yMzE3IDAgMy45MjgzLjQ3OTUgNS4wOTEgMS40NDA0IDEuMTYxMy45NjE1IDEuNzQzIDIuMzkzNyAxLjc0MyA0LjI5ODZ6TTM5NS4wMzc2IDEzOS4wMjM2Yy0xLjIzMy0zLjk3MDMtMS45Mjc1LTYuMjE1Mi0yLjA4MjUtNi43MzQ5LS4xNTU2LS41MjAzLS4yNjYtLjkzMTQtLjMzNDQtMS4yMzM5LS4yNzYgMS4wNzQ1LTEuMDY5MSAzLjczMTItMi4zNzggNy45Njg4aDQuNzk0OXptMi4yNjUgNy42NTMybC0xLjMzNC00LjM4MDFoLTYuNzA2NWwtMS4zMzQ1IDQuMzhoLTQuMjAyNWw2LjQ5MjYtMTguNDc4OGg0Ljc2OTdsNi41MTgzIDE4LjQ3ODloLTQuMjAzMXpNNDA3LjcyMjkgMTM2LjQ0MjNoMS4yNThjMS4yMzM1IDAgMi4xNDM5LS4yMDU5IDIuNzMxMi0uNjE1Ny41ODc5LS40MTE3Ljg4MDktMS4wNTgyLjg4MDktMS45Mzk0IDAtLjg3My0uMjk5My0xLjQ5MzctLjg5OTEtMS44NjI3LS42MDA1LS4zNjktMS41Mjk3LS41NTQyLTIuNzg4My0uNTU0MmgtMS4xODI3djQuOTcyem0wIDMuMTczMnY3LjA2MTNoLTMuOTAwN3YtMTguNDAzaDUuMzYxM2MyLjQ5OSAwIDQuMzQ5NC40NTQ0IDUuNTQ5IDEuMzY1MSAxLjE5OTYuOTEwNyAxLjc5OTUgMi4yOTMzIDEuNzk5NSA0LjE0OCAwIDEuMDgyLS4yOTggMi4wNDUzLS44OTM1IDIuODg4Mi0uNTk0OC44NDM1LTEuNDM4NyAxLjUwNDQtMi41MjkxIDEuOTgzMyAyLjc2ODIgNC4xMzcyIDQuNTcxNCA2LjgwOTYgNS40MTE1IDguMDE4NGgtNC4zMjk5bC00LjM5Mi03LjA2MTNoLTIuMDc2MXpNNDI3LjkzMzYgMTQ2LjY3NjhoLTMuOTAwN1YxMzEuNTIxaC00Ljk5NjJ2LTMuMjQ3M2gxMy44OTI0djMuMjQ3M2gtNC45OTU1djE1LjE1NTdNNDQxLjQ4NjYgMTM1Ljg1MWwzLjgzODYtNy41NzcyaDQuMjAzOGwtNi4xMDM2IDExLjI0MDZ2Ny4xNjI0aC0zLjg3NjlWMTM5LjY0bC02LjEwMjQtMTEuMzY2Mmg0LjIyODNsMy44MTIyIDcuNTc3Mk00NjIuNDQwMiAxMzYuNDQyM2gxLjI1OGMxLjIzMzUgMCAyLjE0MzktLjIwNTkgMi43MzE4LS42MTU3LjU4NjYtLjQxMTcuODgwMy0xLjA1ODIuODgwMy0xLjkzOTQgMC0uODczLS4yOTkzLTEuNDkzNy0uODk5MS0xLjg2MjctLjYwMDUtLjM2OS0xLjUyOS0uNTU0Mi0yLjc4NzctLjU1NDJoLTEuMTgzM3Y0Ljk3MnptMCAzLjE3MzJ2Ny4wNjEzaC0zLjkwMTR2LTE4LjQwM2g1LjM2MTRjMi41MDAzIDAgNC4zNS40NTQ0IDUuNTUwMiAxLjM2NTEgMS4xOTkuOTEwNyAxLjc5OTUgMi4yOTMzIDEuNzk5NSA0LjE0OCAwIDEuMDgyLS4yOTggMi4wNDUzLS44OTM1IDIuODg4Mi0uNTk2Ljg0MzUtMS40MzkzIDEuNTA0NC0yLjUyOTEgMS45ODMzIDIuNzY4MiA0LjEzNzIgNC41NzE0IDYuODA5NiA1LjQxMDMgOC4wMTg0aC00LjMyODZsLTQuMzkyLTcuMDYxM2gtMi4wNzY4ek00NzUuNTUzNCAxNDYuNjc2OGgzLjkwMDd2LTE4LjQwM2gtMy45MDA3ek00OTQuOTQ2IDE0MS41NjU1YzAgMS42NjI1LS41OTc0IDIuOTcxNy0xLjc5MjYgMy45MjgyLTEuMTk1OS45NTY1LTIuODU5MiAxLjQzNDgtNC45OTA2IDEuNDM0OC0xLjk2MjYgMC0zLjctLjM2OS01LjIwOTUtMS4xMDcydi0zLjYyNjNjMS4yNDEuNTU0MiAyLjI5MjYuOTQ0NSAzLjE1MjIgMS4xNzE3Ljg1OTYuMjI2NiAxLjY0NjQuMzM5NiAyLjM1OTcuMzM5Ni44NTUyIDAgMS41MTE1LS4xNjM4IDEuOTY5NS0uNDkxNC40NTc0LS4zMjY0LjY4NTgtLjgxMzQuNjg1OC0xLjQ1OTkgMC0uMzYwOS0uMTAwNC0uNjgxNi0uMzAyNC0uOTYzNC0uMjAwOC0uMjgwNS0uNDk2My0uNTUxNi0uODg3Mi0uODEyMS0uMzg5Ni0uMjU5Mi0xLjE4NTItLjY3NDctMi4zODQ4LTEuMjQ1Mi0xLjEyNDQtLjUyOS0xLjk2Ny0xLjAzNjgtMi41Mjg2LTEuNTIzOC0uNTYyOC0uNDg1OC0xLjAxMDgtMS4wNTMyLTEuMzQ3LTEuNjk5LS4zMzU3LS42NDY0LS41MDMzLTEuNDAxNS0uNTAzMy0yLjI2NTcgMC0xLjYyOC41NTEtMi45MDg0IDEuNjU0Ni0zLjg0MDQgMS4xMDMtLjkzMTMgMi42MjgzLTEuMzk3IDQuNTc0NS0xLjM5Ny45NTYyIDAgMS44NjkxLjExNDIgMi43MzY5LjM0MDEuODY5LjIyNiAxLjc3NjIuNTQ1NCAyLjcyNDkuOTU2NWwtMS4yNTg2IDMuMDM0Yy0uOTgyLS40MDI0LTEuNzkzOC0uNjgzNi0yLjQzNS0uODQzLS42NDItLjE1OTQtMS4yNzMxLS4yMzkxLTEuODk0My0uMjM5MS0uNzM3OCAwLTEuMzAzOC4xNzEzLTEuNjk4NC41MTU5LS4zOTQ3LjM0NC0uNTkxNy43OTMzLS41OTE3IDEuMzQ2MiAwIC4zNDQ2LjA3OTcuNjQ0Ni4yMzkuOTAwNy4xNTk0LjI1Ni40MTM1LjUwNC43NjE4Ljc0My4zNDc2LjIzOCAxLjE3Mi42NjkxIDIuNDcyNyAxLjI4OTggMS43MTkxLjgyMjggMi44OTg3IDEuNjQ2OSAzLjUzNjEgMi40NzM0LjYzNjkuODI2Ni45NTYyIDEuODQwMi45NTYyIDMuMDM5NiIvPgogICAgPGc+CiAgICAgIDxtYXNrIGlkPSJkIiBmaWxsPSIjZmZmIj4KICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNjIi8+CiAgICAgIDwvbWFzaz4KICAgICAgPHBhdGggZmlsbD0iIzVBNUI1RCIgZD0iTTUxMy4wODA1IDE0Ni42NzY4aC00LjQyOTdsLTQuODE5OS03Ljc1NDItMS42NDk1IDEuMTgzN3Y2LjU3MDVoLTMuOXYtMTguNDAzaDMuOXY4LjQyMDhsMS41MzcyLTIuMTY0NyA0Ljk4MjQtNi4yNTZoNC4zMjkzbC02LjQxODYgOC4xNDMzIDYuNDY4OCAxMC4yNTk2IiBtYXNrPSJ1cmwoI2QpIi8+CiAgICAgIDxwYXRoIGZpbGw9IiM2Q0MwNEEiIGQ9Ik00MC41NzcgNzkuODkxNmMtOS4wOTg0IDAtMTYuMTE0OS0yLjkxOS0yMC44NTU3LTguNjczNi00Ljc4OC01LjgwOTgtNy4yMTQ4LTE0LjUxNDItNy4yMTQ4LTI1Ljg3MjggMC0xMS4yMDA0IDIuNDI3NS0xOS44MjU3IDcuMjE0OC0yNS42MzY4IDQuNzQxNS01Ljc1NTMgMTEuNzk4MS04LjY3MyAyMC45NzMtOC42NzMgOS4xMzE2IDAgMTYuMTA3MyAyLjg5NTggMjAuNzMyNyA4LjYwNzcgNC42NzM3IDUuNzc0NyA3LjA0NDEgMTQuNDIyIDcuMDQ0MSAyNS43MDIgMCAxMS4zOTgyLTIuMzgwNCAyMC4xMTUyLTcuMDczIDI1LjkwODctNC42NDQ4IDUuNzMxMy0xMS42NSA4LjYzNzgtMjAuODIxMSA4LjYzNzh6TTQwLjY5NDMuMTcxM2MtMTIuOTIxOSAwLTIzLjA0OTggMy45OTQ4LTMwLjEwNDYgMTEuODcyNkMzLjU2MjUgMTkuODkxNiAwIDMxLjA1NTYgMCA0NS4yMjhjMCAxNC4yODc2IDMuNTUyNSAyNS41MzA3IDEwLjU1ODMgMzMuNDE2NyA3LjAzNDEgNy45MTg2IDE3LjEzMzggMTEuOTM0IDMwLjAxODcgMTEuOTM0IDEyLjYxMDYgMCAyMi42MTI0LTQuMDg1NyAyOS43MjYyLTEyLjE0MjQgNy4wODI0LTguMDIyOCAxMC42NzM4LTE5LjE1NiAxMC42NzM4LTMzLjA5MSAwLTEzLjk3MzItMy41ODEzLTI1LjEwNjUtMTAuNjQ1NS0zMy4wOTFDNjMuMjM3OCA0LjIzNjQgNTMuMjY2LjE3MTMgNDAuNjk0My4xNzEzeiIgbWFzaz0idXJsKCNkKSIvPgogICAgPC9nPgogICAgPHBhdGggZmlsbD0iIzZDQzA0QSIgZD0iTTEyOC4xNDgyIDIxLjg2NDljLTQuNTUyIDAtOC43NDcuOTEyNS0xMi40NjgyIDIuNzEyNS0zLjIwMDUgMS41NDgzLTUuODI1NyAzLjY2OS03LjgyMzQgNi4zMTYzbC0xLjQxMy03Ljg1MjdoLTkuNzAzMXY2Ni4zNjE1aDExLjY4MzN2LTM0Ljc2OGMwLTguMTEyIDEuNTAzMy0xMy45NzI2IDQuNDY4NS0xNy40MiAyLjkyODItMy40MDU1IDcuNjY2LTUuMTMyIDE0LjA4MDEtNS4xMzIgNC43OTA0IDAgOC4zMjkxIDEuMjAxMiAxMC41MTgyIDMuNTcwNCAyLjIwOTIgMi4zOTEyIDMuMzI5OCA2LjEyNzQgMy4zMjk4IDExLjEwMzh2NDIuNjQ1OGgxMS42ODI3VjQ2LjQwNGMwLTguNDY1My0yLjA3NzQtMTQuNzQyLTYuMTc1Mi0xOC42NTc4LTQuMDg2NC0zLjkwMjUtMTAuMjAyNi01Ljg4MTMtMTguMTc5Ny01Ljg4MTNNMTk2LjE0ODggMzEuOTY0NGM0LjgzOCAwIDguNDQxNCAxLjQ5MzEgMTEuMDE1NyA0LjU2NCAyLjQzODIgMi45MTAzIDMuNzQwOCA3LjEzMTYgMy44NzcgMTIuNTU2N2gtMzEuNjI5M2MuNjM1Ni01LjIyMDUgMi4zNDEtOS4zODEgNS4wNzY1LTEyLjM3ODQgMi45MTEzLTMuMTkwOCA2LjcyNTQtNC43NDIzIDExLjY2MDEtNC43NDIzem0uMTE3My0xMC4wOTk1Yy04Ljg3ODcgMC0xNi4wNTc3IDMuMjAyLTIxLjMzODggOS41MTcxLTUuMjM4NCA2LjI2MzYtNy44OTQ5IDE0Ljc5OTItNy44OTQ5IDI1LjM2ODggMCAxMC41MTY0IDIuODY3NCAxOC44Njg3IDguNTIyNCAyNC44MjU0IDUuNjY3NSA1Ljk3MzYgMTMuNDg1OSA5LjAwMjUgMjMuMjM4NiA5LjAwMjUgNC4zOTU4IDAgOC4yMDk5LS4zMzMzIDExLjMzNTctLjk5MSAzLjEyNjUtLjY1NzIgNi40ODA3LTEuNzU0OSA5Ljk2OTItMy4yNjE4bC41ODE2LS4yNTFWNzUuMjc5M2wtMS4zNDIuNTc0M2MtNi42MjUgMi44MzU1LTEzLjQxODggNC4yNzM0LTIwLjE5MTkgNC4yNzM0LTYuMjczIDAtMTEuMTg1OC0xLjg3NC0xNC42MDM0LTUuNTcwMS0zLjI4NjQtMy41NTM2LTUuMTE0MS04LjgwMS01LjQzNzktMTUuNjA3NWg0NC4zMzc4di03LjEzNjZjMC04LjkwMjEtMi40NTQ1LTE2LjE4ODctNy4yOTUtMjEuNjU3Mi00Ljg3MDgtNS41MDEtMTEuNTU5OC04LjI5MDctMTkuODgxNC04LjI5MDd6TTIyOC44NjIyIDEyLjMyODJoMjcuMjExNXY3Ny4wNzQzaDExLjkxODZWMTIuMzI4MmgyNy4yMTE2VjEuNTIzMmgtNjYuMzQxN3YxMC44MDVNMzM1LjA4ODIgMjEuODY0OWMtNC4yMTIgMC04LjEzMDkgMS4yMDI1LTExLjY0NyAzLjU3NDgtMi45NjY1IDIuMDAxNS01LjU5MDQgNC43NDg2LTcuODE5NiA4LjE4NDFsLS45OTA3LTEwLjU4MjhoLTkuODkyN3Y2Ni4zNjE1aDExLjY4MzRWNTMuODcwMWMwLTYuMDQwOCAxLjc4ODgtMTEuMTQ3NyA1LjMxNTUtMTUuMTgwMSAzLjU0MzEtNC4wNTA3IDcuNjgwNC02LjAyMDEgMTIuNjQ1Mi02LjAyMDEgMS45NTc2IDAgNC4yNjE1LjI4OTMgNi44NDUyLjg1OThsMS4wMDgzLjIyMjIgMS42Mzk1LTEwLjk3Ny0uODkyOS0uMTgzOWMtMi4zMjctLjQ4MTQtNC45ODMtLjcyNjEtNy44OTQyLS43MjYxTTM5Ny4zMDUgNTcuODY4NmMwIDguMDc1LTEuNDk1NyAxMy45MzgtNC40NDQ2IDE3LjQyNTgtMi45MDg4IDMuNDQwNS03LjYzNDUgNS4xODQ3LTE0LjA0NjIgNS4xODQ3LTQuNzg5MiAwLTguMzI4NS0xLjIwMTktMTAuNTE3Ni0zLjU3MDUtMi4yMDkyLTIuMzktMy4zMjg1LTYuMTI2Mi0zLjMyODUtMTEuMTAzOFYyMy4wNDFoLTExLjgwMTl2NDMuMTE2NWMwIDguNDI3NiAyLjA2OCAxNC42NzUgNi4xNDYzIDE4LjU2OTMgNC4wNjQ1IDMuODgyNCAxMC4yMTE0IDUuODUxOSAxOC4yNjg4IDUuODUxOSA0LjY2NSAwIDguODg4MS0uODgxOCAxMi41NDkyLTIuNjIxNiAzLjE2NTMtMS41MDM4IDUuNzcxNy0zLjYwNjkgNy43NjU2LTYuMjYyM2wxLjI1NzQgNy43MDc3aDkuODM1VjIzLjA0MUgzOTcuMzA1djM0LjgyNzZNNDUxLjA5IDUwLjkwOTZjLTUuNDkxOC0yLjA0OTgtOS4yNDM5LTMuNjMxNC0xMS4xNTEyLTQuNzAwMi0xLjgyNTgtMS4wMjE3LTMuMTU1NC0yLjA5NjItMy45NTIyLTMuMTk0LS43NjU1LTEuMDU1Ni0xLjEzODItMi4zMTItMS4xMzgyLTMuODQyOCAwLTIuMjA5MiAxLjAwNC0zLjkwMjUgMy4wNjg4LTUuMTc2IDIuMTg2Ni0xLjM0OCA1LjUzNjQtMi4wMzIyIDkuOTU2LTIuMDMyMiA1LjA5ODUgMCAxMC44ODcxIDEuMzIwNSAxNy4yMDY2IDMuOTI1MWwuODcxNS4zNTk3IDQuMjM0NS05LjY5My0uODk0MS0uMzgwOWMtNi43MTE2LTIuODYtMTMuNjc5OC00LjMxMDQtMjAuNzEyNi00LjMxMDQtNy42MTM5IDAtMTMuNzE0MyAxLjU5MjgtMTguMTMyIDQuNzM0Ny00LjUyIDMuMjE0Ni02LjgxMTQgNy42NjI1LTYuODExNCAxMy4yMTk0IDAgMy4wOTg2LjY2NjMgNS44MTM2IDEuOTgyIDguMDcgMS4zMDQ1IDIuMjM2NyAzLjMwNDcgNC4yNTI2IDUuOTQ1IDUuOTkyNCAyLjU3NDIgMS42OTc3IDYuOTQwNSAzLjY5OTEgMTIuOTY3NiA1Ljk0NDggNi4xODI2IDIuMzgyNCAxMC4zNzUxIDQuNDU2NiAxMi40NTg4IDYuMTY1IDEuOTU3NiAxLjYwNiAyLjkwOTQgMy40NjgyIDIuOTA5NCA1LjY5MjUgMCAyLjk5My0xLjE5MTUgNS4xNTUyLTMuNjQxNiA2LjYwODEtMi41Nzk0IDEuNTMwMi02LjM2OSAyLjMwNTMtMTEuMjYzNiAyLjMwNTMtMy4xOTggMC02LjU2ODUtLjQ0NDQtMTAuMDE4Ny0xLjMyMy0zLjQ2MS0uODc5My02Ljc0NjgtMi4xMDA3LTkuNzYzNC0zLjYyOTVsLTEuMzk5Mi0uNzA4djExLjE4NDFsLjQ4ODguMjc2OGM0LjkwNDYgMi43NzQ3IDExLjc4NjggNC4xODEyIDIwLjQ1NzIgNC4xODEyIDguMjQzMiAwIDE0Ljc2MTUtMS43MDQ2IDE5LjM3NDQtNS4wNjQzIDQuNzA4OC0zLjQyOTMgNy4wOTY4LTguMzU5MiA3LjA5NjgtMTQuNjUzNSAwLTQuNTA3Ni0xLjQ0MzctOC4zMTA5LTQuMjkxLTExLjMwNTktMi44MTQtMi45NTgtOC4wMDAzLTUuNzg2Ni0xNS44NDgyLTguNjQ1NE01MTUuNDg2IDc5LjQ1OTJjLS45MDAzLjI2My0yLjE0NTIuNTIxLTMuNzAyNC43NjctMS41NDQ4LjI0NjYtMy4xNzM2LjM3MDktNC44NDM4LjM3MDktMi45NTIgMC01LjE5NjMtLjkxMjYtNi44NjA5LTIuNzkxNy0xLjY3Mi0xLjg4NDctMi41MTk3LTQuNjc2My0yLjUxOTctOC4yOTdWMzIuNTUyNWgxOC42ODk4VjIzLjA0MWgtMTguNjg5OFY4LjEwODJoLTcuMzIzNGwtNC4xOTE4IDE0LjAxNzctOS4zOTUxIDQuMTMwNHY2LjI5NjJoOS4yMjd2MzcuMzY3NmMwIDEzLjcwODQgNi42MTI0IDIwLjY1ODYgMTkuNjUyOCAyMC42NTg2IDEuNjgzNCAwIDMuNjA0LS4xNzIgNS43MDg0LS41MTE1IDIuMTcyOC0uMzUzNCAzLjc4NzgtLjc5MzQgNC45MzY2LTEuMzQ3NWwuNTQ1Mi0uMjYzdi05LjM1NjVsLTEuMjMyOS4zNTkiLz4KICA8L2c+Cjwvc3ZnPgo=\");background-position:center;background-size:contain;background-repeat:no-repeat}#onetrust-pc-sdk .ot-tooltip .ot-tooltiptext{visibility:hidden;width:120px;background-color:#555;color:#fff;text-align:center;padding:5px 0;border-radius:6px;position:absolute;z-index:1;bottom:125%;left:50%;margin-left:-60px;opacity:0;transition:opacity 0.3s}#onetrust-pc-sdk .ot-tooltip .ot-tooltiptext::after{content:\"\";position:absolute;top:100%;left:50%;margin-left:-5px;border-width:5px;border-style:solid;border-color:#555 transparent transparent transparent}#onetrust-pc-sdk .ot-tooltip:hover .ot-tooltiptext{visibility:visible;opacity:1}#onetrust-pc-sdk .ot-tooltip{position:relative;display:inline-block;z-index:3}#onetrust-pc-sdk .ot-tooltip svg{color:grey;height:20px;width:20px}#onetrust-pc-sdk.ot-fade-in,.onetrust-pc-dark-filter.ot-fade-in{animation-name:onetrust-fade-in;animation-duration:400ms;animation-timing-function:ease-in-out}#onetrust-pc-sdk.hide{display:none !important}.onetrust-pc-dark-filter.hide{display:none !important}#ot-sdk-btn.ot-sdk-show-settings,#ot-sdk-btn.optanon-show-settings{color:#68b631;border:1px solid #68b631;height:auto;white-space:normal;word-wrap:break-word;padding:0.8em 2em;font-size:0.8em;line-height:1.2;cursor:pointer;-moz-transition:0.1s ease;-o-transition:0.1s ease;-webkit-transition:1s ease;transition:0.1s ease}#ot-sdk-btn.ot-sdk-show-settings:hover,#ot-sdk-btn.optanon-show-settings:hover{color:#fff;background-color:#68b631}#ot-sdk-btn.ot-sdk-show-settings:focus,#ot-sdk-btn.optanon-show-settings:focus{outline:none}.onetrust-pc-dark-filter{background:rgba(0,0,0,0.5);z-index:2147483646;width:100%;height:100%;overflow:hidden;position:fixed;top:0;bottom:0;left:0}@keyframes onetrust-fade-in{0%{opacity:0}100%{opacity:1}}@media only screen and (min-width: 426px) and (max-width: 896px) and (orientation: landscape){#onetrust-pc-sdk p{font-size:0.75em}}\n#onetrust-banner-sdk,#onetrust-pc-sdk,#ot-sdk-cookie-policy{font-size:16px}#onetrust-banner-sdk *,#onetrust-banner-sdk ::after,#onetrust-banner-sdk ::before,#onetrust-pc-sdk *,#onetrust-pc-sdk ::after,#onetrust-pc-sdk ::before,#ot-sdk-cookie-policy *,#ot-sdk-cookie-policy ::after,#ot-sdk-cookie-policy ::before{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}#onetrust-banner-sdk div,#onetrust-banner-sdk span,#onetrust-banner-sdk h1,#onetrust-banner-sdk h2,#onetrust-banner-sdk h3,#onetrust-banner-sdk h4,#onetrust-banner-sdk h5,#onetrust-banner-sdk h6,#onetrust-banner-sdk p,#onetrust-banner-sdk img,#onetrust-banner-sdk svg,#onetrust-banner-sdk button,#onetrust-banner-sdk section,#onetrust-banner-sdk a,#onetrust-banner-sdk label,#onetrust-banner-sdk input,#onetrust-banner-sdk ul,#onetrust-banner-sdk li,#onetrust-banner-sdk nav,#onetrust-banner-sdk table,#onetrust-banner-sdk thead,#onetrust-banner-sdk tr,#onetrust-banner-sdk td,#onetrust-banner-sdk tbody,#onetrust-banner-sdk .main-content,#onetrust-banner-sdk .toggle,#onetrust-banner-sdk #content,#onetrust-banner-sdk .checkbox,#onetrust-pc-sdk div,#onetrust-pc-sdk span,#onetrust-pc-sdk h1,#onetrust-pc-sdk h2,#onetrust-pc-sdk h3,#onetrust-pc-sdk h4,#onetrust-pc-sdk h5,#onetrust-pc-sdk h6,#onetrust-pc-sdk p,#onetrust-pc-sdk img,#onetrust-pc-sdk svg,#onetrust-pc-sdk button,#onetrust-pc-sdk section,#onetrust-pc-sdk a,#onetrust-pc-sdk label,#onetrust-pc-sdk input,#onetrust-pc-sdk ul,#onetrust-pc-sdk li,#onetrust-pc-sdk nav,#onetrust-pc-sdk table,#onetrust-pc-sdk thead,#onetrust-pc-sdk tr,#onetrust-pc-sdk td,#onetrust-pc-sdk tbody,#onetrust-pc-sdk .main-content,#onetrust-pc-sdk .toggle,#onetrust-pc-sdk #content,#onetrust-pc-sdk .checkbox,#ot-sdk-cookie-policy div,#ot-sdk-cookie-policy span,#ot-sdk-cookie-policy h1,#ot-sdk-cookie-policy h2,#ot-sdk-cookie-policy h3,#ot-sdk-cookie-policy h4,#ot-sdk-cookie-policy h5,#ot-sdk-cookie-policy h6,#ot-sdk-cookie-policy p,#ot-sdk-cookie-policy img,#ot-sdk-cookie-policy svg,#ot-sdk-cookie-policy button,#ot-sdk-cookie-policy section,#ot-sdk-cookie-policy a,#ot-sdk-cookie-policy label,#ot-sdk-cookie-policy input,#ot-sdk-cookie-policy ul,#ot-sdk-cookie-policy li,#ot-sdk-cookie-policy nav,#ot-sdk-cookie-policy table,#ot-sdk-cookie-policy thead,#ot-sdk-cookie-policy tr,#ot-sdk-cookie-policy td,#ot-sdk-cookie-policy tbody,#ot-sdk-cookie-policy .main-content,#ot-sdk-cookie-policy .toggle,#ot-sdk-cookie-policy #content,#ot-sdk-cookie-policy .checkbox{font-family:inherit;font-size:initial;font-weight:normal;-webkit-font-smoothing:auto;letter-spacing:normal;line-height:normal;padding:0;margin:0;height:auto;min-height:0;max-height:none;width:auto;min-width:0;max-width:none;border-radius:0;border:none;clear:none;float:none;position:static;bottom:auto;left:auto;right:auto;top:auto;text-align:left;text-decoration:none;text-indent:0;text-shadow:none;text-transform:none;white-space:normal;background:none;overflow:visible;vertical-align:baseline;visibility:visible;z-index:auto;box-shadow:none}#onetrust-banner-sdk label:before,#onetrust-banner-sdk label:after,#onetrust-banner-sdk .checkbox:after,#onetrust-banner-sdk .checkbox:before,#onetrust-pc-sdk label:before,#onetrust-pc-sdk label:after,#onetrust-pc-sdk .checkbox:after,#onetrust-pc-sdk .checkbox:before,#ot-sdk-cookie-policy label:before,#ot-sdk-cookie-policy label:after,#ot-sdk-cookie-policy .checkbox:after,#ot-sdk-cookie-policy .checkbox:before{content:\"\";content:none}\n#onetrust-banner-sdk .ot-sdk-container,#onetrust-pc-sdk .ot-sdk-container,#ot-sdk-cookie-policy .ot-sdk-container{position:relative;width:100%;max-width:100%;margin:0 auto;padding:0 20px;box-sizing:border-box}#onetrust-banner-sdk .ot-sdk-column,#onetrust-banner-sdk .ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-column,#onetrust-pc-sdk .ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-columns{width:100%;float:left;box-sizing:border-box;padding:0;display:initial}@media (min-width: 400px){#onetrust-banner-sdk .ot-sdk-container,#onetrust-pc-sdk .ot-sdk-container,#ot-sdk-cookie-policy .ot-sdk-container{width:90%;padding:0}}@media (min-width: 550px){#onetrust-banner-sdk .ot-sdk-container,#onetrust-pc-sdk .ot-sdk-container,#ot-sdk-cookie-policy .ot-sdk-container{width:100%}#onetrust-banner-sdk .ot-sdk-column,#onetrust-banner-sdk .ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-column,#onetrust-pc-sdk .ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-columns{margin-left:4%}#onetrust-banner-sdk .ot-sdk-column:first-child,#onetrust-banner-sdk .ot-sdk-columns:first-child,#onetrust-pc-sdk .ot-sdk-column:first-child,#onetrust-pc-sdk .ot-sdk-columns:first-child,#ot-sdk-cookie-policy .ot-sdk-column:first-child,#ot-sdk-cookie-policy .ot-sdk-columns:first-child{margin-left:0}#onetrust-banner-sdk .ot-sdk-one.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-one.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-one.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-one.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-one.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-one.ot-sdk-columns{width:4.66666666667%}#onetrust-banner-sdk .ot-sdk-two.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-two.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-two.ot-sdk-columns{width:13.3333333333%}#onetrust-banner-sdk .ot-sdk-three.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-three.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-three.ot-sdk-columns{width:22%}#onetrust-banner-sdk .ot-sdk-four.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-four.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-four.ot-sdk-columns{width:30.6666666667%}#onetrust-banner-sdk .ot-sdk-five.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-five.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-five.ot-sdk-columns{width:39.3333333333%}#onetrust-banner-sdk .ot-sdk-six.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-six.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-six.ot-sdk-columns{width:48%}#onetrust-banner-sdk .ot-sdk-seven.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-seven.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-seven.ot-sdk-columns{width:56.6666666667%}#onetrust-banner-sdk .ot-sdk-eight.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-eight.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-eight.ot-sdk-columns{width:65.3333333333%}#onetrust-banner-sdk .ot-sdk-nine.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-nine.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-nine.ot-sdk-columns{width:74%}#onetrust-banner-sdk .ot-sdk-ten.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-ten.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-ten.ot-sdk-columns{width:82.6666666667%}#onetrust-banner-sdk .ot-sdk-eleven.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-eleven.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-eleven.ot-sdk-columns{width:91.3333333333%}#onetrust-banner-sdk .ot-sdk-twelve.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-twelve.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-twelve.ot-sdk-columns{width:100%;margin-left:0}#onetrust-banner-sdk .ot-sdk-one-third.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-one-third.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-one-third.ot-sdk-column{width:30.6666666667%}#onetrust-banner-sdk .ot-sdk-two-thirds.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-two-thirds.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-two-thirds.ot-sdk-column{width:65.3333333333%}#onetrust-banner-sdk .ot-sdk-one-half.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-one-half.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-one-half.ot-sdk-column{width:48%}#onetrust-banner-sdk .ot-sdk-offset-by-one.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-one.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-one.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-one.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-one.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-one.ot-sdk-columns{margin-left:8.66666666667%}#onetrust-banner-sdk .ot-sdk-offset-by-two.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-two.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-two.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-two.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-two.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-two.ot-sdk-columns{margin-left:17.3333333333%}#onetrust-banner-sdk .ot-sdk-offset-by-three.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-three.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-three.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-three.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-three.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-three.ot-sdk-columns{margin-left:26%}#onetrust-banner-sdk .ot-sdk-offset-by-four.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-four.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-four.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-four.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-four.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-four.ot-sdk-columns{margin-left:34.6666666667%}#onetrust-banner-sdk .ot-sdk-offset-by-five.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-five.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-five.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-five.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-five.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-five.ot-sdk-columns{margin-left:43.3333333333%}#onetrust-banner-sdk .ot-sdk-offset-by-six.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-six.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-six.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-six.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-six.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-six.ot-sdk-columns{margin-left:52%}#onetrust-banner-sdk .ot-sdk-offset-by-seven.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-seven.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-seven.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-seven.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-seven.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-seven.ot-sdk-columns{margin-left:60.6666666667%}#onetrust-banner-sdk .ot-sdk-offset-by-eight.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-eight.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-eight.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-eight.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-eight.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-eight.ot-sdk-columns{margin-left:69.3333333333%}#onetrust-banner-sdk .ot-sdk-offset-by-nine.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-nine.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-nine.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-nine.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-nine.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-nine.ot-sdk-columns{margin-left:78%}#onetrust-banner-sdk .ot-sdk-offset-by-ten.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-ten.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-ten.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-ten.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-ten.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-ten.ot-sdk-columns{margin-left:86.6666666667%}#onetrust-banner-sdk .ot-sdk-offset-by-eleven.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-eleven.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-eleven.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-eleven.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-eleven.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-eleven.ot-sdk-columns{margin-left:95.3333333333%}#onetrust-banner-sdk .ot-sdk-offset-by-one-third.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-one-third.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-one-third.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-one-third.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-one-third.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-one-third.ot-sdk-columns{margin-left:34.6666666667%}#onetrust-banner-sdk .ot-sdk-offset-by-two-thirds.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-two-thirds.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-two-thirds.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-two-thirds.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-two-thirds.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-two-thirds.ot-sdk-columns{margin-left:69.3333333333%}#onetrust-banner-sdk .ot-sdk-offset-by-one-half.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-one-half.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-one-half.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-one-half.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-one-half.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-one-half.ot-sdk-columns{margin-left:52%}}#onetrust-banner-sdk h1,#onetrust-banner-sdk h2,#onetrust-banner-sdk h3,#onetrust-banner-sdk h4,#onetrust-banner-sdk h5,#onetrust-banner-sdk h6,#onetrust-pc-sdk h1,#onetrust-pc-sdk h2,#onetrust-pc-sdk h3,#onetrust-pc-sdk h4,#onetrust-pc-sdk h5,#onetrust-pc-sdk h6,#ot-sdk-cookie-policy h1,#ot-sdk-cookie-policy h2,#ot-sdk-cookie-policy h3,#ot-sdk-cookie-policy h4,#ot-sdk-cookie-policy h5,#ot-sdk-cookie-policy h6{margin-top:0;font-weight:600;font-family:inherit}#onetrust-banner-sdk h1,#onetrust-pc-sdk h1,#ot-sdk-cookie-policy h1{font-size:1.5rem;line-height:1.2}#onetrust-banner-sdk h2,#onetrust-pc-sdk h2,#ot-sdk-cookie-policy h2{font-size:1.5rem;line-height:1.25}#onetrust-banner-sdk h3,#onetrust-pc-sdk h3,#ot-sdk-cookie-policy h3{font-size:1.5rem;line-height:1.3}#onetrust-banner-sdk h4,#onetrust-pc-sdk h4,#ot-sdk-cookie-policy h4{font-size:1.5rem;line-height:1.35}#onetrust-banner-sdk h5,#onetrust-pc-sdk h5,#ot-sdk-cookie-policy h5{font-size:1.5rem;line-height:1.5}#onetrust-banner-sdk h6,#onetrust-pc-sdk h6,#ot-sdk-cookie-policy h6{font-size:1.5rem;line-height:1.6}@media (min-width: 550px){#onetrust-banner-sdk h1,#onetrust-pc-sdk h1,#ot-sdk-cookie-policy h1{font-size:1.5rem}#onetrust-banner-sdk h2,#onetrust-pc-sdk h2,#ot-sdk-cookie-policy h2{font-size:1.5rem}#onetrust-banner-sdk h3,#onetrust-pc-sdk h3,#ot-sdk-cookie-policy h3{font-size:1.5rem}#onetrust-banner-sdk h4,#onetrust-pc-sdk h4,#ot-sdk-cookie-policy h4{font-size:1.5rem}#onetrust-banner-sdk h5,#onetrust-pc-sdk h5,#ot-sdk-cookie-policy h5{font-size:1.5rem}#onetrust-banner-sdk h6,#onetrust-pc-sdk h6,#ot-sdk-cookie-policy h6{font-size:1.5rem}}#onetrust-banner-sdk p,#onetrust-pc-sdk p,#ot-sdk-cookie-policy p{margin:0 0 1em 0;font-family:inherit;line-height:normal}#onetrust-banner-sdk a,#onetrust-pc-sdk a,#ot-sdk-cookie-policy a{color:#565656;text-decoration:underline}#onetrust-banner-sdk a:hover,#onetrust-pc-sdk a:hover,#ot-sdk-cookie-policy a:hover{color:#565656;text-decoration:none}#onetrust-banner-sdk .ot-sdk-button,#onetrust-banner-sdk button,#onetrust-pc-sdk .ot-sdk-button,#onetrust-pc-sdk button,#ot-sdk-cookie-policy .ot-sdk-button,#ot-sdk-cookie-policy button{margin-bottom:1rem;font-family:inherit}#onetrust-banner-sdk .ot-sdk-button,#onetrust-banner-sdk button,#onetrust-banner-sdk input[type=\"submit\"],#onetrust-banner-sdk input[type=\"reset\"],#onetrust-banner-sdk input[type=\"button\"],#onetrust-pc-sdk .ot-sdk-button,#onetrust-pc-sdk button,#onetrust-pc-sdk input[type=\"submit\"],#onetrust-pc-sdk input[type=\"reset\"],#onetrust-pc-sdk input[type=\"button\"],#ot-sdk-cookie-policy .ot-sdk-button,#ot-sdk-cookie-policy button,#ot-sdk-cookie-policy input[type=\"submit\"],#ot-sdk-cookie-policy input[type=\"reset\"],#ot-sdk-cookie-policy input[type=\"button\"]{display:inline-block;height:38px;padding:0 30px;color:#555;text-align:center;font-size:0.9em;font-weight:400;line-height:38px;letter-spacing:0.01em;text-decoration:none;white-space:nowrap;background-color:transparent;border-radius:2px;border:1px solid #bbb;cursor:pointer;box-sizing:border-box}#onetrust-banner-sdk .ot-sdk-button:hover,#onetrust-banner-sdk button:hover,#onetrust-banner-sdk input[type=\"submit\"]:hover,#onetrust-banner-sdk input[type=\"reset\"]:hover,#onetrust-banner-sdk input[type=\"button\"]:hover,#onetrust-banner-sdk .ot-sdk-button:focus,#onetrust-banner-sdk button:focus,#onetrust-banner-sdk input[type=\"submit\"]:focus,#onetrust-banner-sdk input[type=\"reset\"]:focus,#onetrust-banner-sdk input[type=\"button\"]:focus,#onetrust-pc-sdk .ot-sdk-button:hover,#onetrust-pc-sdk button:hover,#onetrust-pc-sdk input[type=\"submit\"]:hover,#onetrust-pc-sdk input[type=\"reset\"]:hover,#onetrust-pc-sdk input[type=\"button\"]:hover,#onetrust-pc-sdk .ot-sdk-button:focus,#onetrust-pc-sdk button:focus,#onetrust-pc-sdk input[type=\"submit\"]:focus,#onetrust-pc-sdk input[type=\"reset\"]:focus,#onetrust-pc-sdk input[type=\"button\"]:focus,#ot-sdk-cookie-policy .ot-sdk-button:hover,#ot-sdk-cookie-policy button:hover,#ot-sdk-cookie-policy input[type=\"submit\"]:hover,#ot-sdk-cookie-policy input[type=\"reset\"]:hover,#ot-sdk-cookie-policy input[type=\"button\"]:hover,#ot-sdk-cookie-policy .ot-sdk-button:focus,#ot-sdk-cookie-policy button:focus,#ot-sdk-cookie-policy input[type=\"submit\"]:focus,#ot-sdk-cookie-policy input[type=\"reset\"]:focus,#ot-sdk-cookie-policy input[type=\"button\"]:focus{color:#333;border-color:#888;outline:0;opacity:0.7}#onetrust-banner-sdk .ot-sdk-button.ot-sdk-button-primary,#onetrust-banner-sdk button.ot-sdk-button-primary,#onetrust-banner-sdk input[type=\"submit\"].ot-sdk-button-primary,#onetrust-banner-sdk input[type=\"reset\"].ot-sdk-button-primary,#onetrust-banner-sdk input[type=\"button\"].ot-sdk-button-primary,#onetrust-pc-sdk .ot-sdk-button.ot-sdk-button-primary,#onetrust-pc-sdk button.ot-sdk-button-primary,#onetrust-pc-sdk input[type=\"submit\"].ot-sdk-button-primary,#onetrust-pc-sdk input[type=\"reset\"].ot-sdk-button-primary,#onetrust-pc-sdk input[type=\"button\"].ot-sdk-button-primary,#ot-sdk-cookie-policy .ot-sdk-button.ot-sdk-button-primary,#ot-sdk-cookie-policy button.ot-sdk-button-primary,#ot-sdk-cookie-policy input[type=\"submit\"].ot-sdk-button-primary,#ot-sdk-cookie-policy input[type=\"reset\"].ot-sdk-button-primary,#ot-sdk-cookie-policy input[type=\"button\"].ot-sdk-button-primary{color:#fff;background-color:#33c3f0;border-color:#33c3f0}#onetrust-banner-sdk .ot-sdk-button.ot-sdk-button-primary:hover,#onetrust-banner-sdk button.ot-sdk-button-primary:hover,#onetrust-banner-sdk input[type=\"submit\"].ot-sdk-button-primary:hover,#onetrust-banner-sdk input[type=\"reset\"].ot-sdk-button-primary:hover,#onetrust-banner-sdk input[type=\"button\"].ot-sdk-button-primary:hover,#onetrust-banner-sdk .ot-sdk-button.ot-sdk-button-primary:focus,#onetrust-banner-sdk button.ot-sdk-button-primary:focus,#onetrust-banner-sdk input[type=\"submit\"].ot-sdk-button-primary:focus,#onetrust-banner-sdk input[type=\"reset\"].ot-sdk-button-primary:focus,#onetrust-banner-sdk input[type=\"button\"].ot-sdk-button-primary:focus,#onetrust-pc-sdk .ot-sdk-button.ot-sdk-button-primary:hover,#onetrust-pc-sdk button.ot-sdk-button-primary:hover,#onetrust-pc-sdk input[type=\"submit\"].ot-sdk-button-primary:hover,#onetrust-pc-sdk input[type=\"reset\"].ot-sdk-button-primary:hover,#onetrust-pc-sdk input[type=\"button\"].ot-sdk-button-primary:hover,#onetrust-pc-sdk .ot-sdk-button.ot-sdk-button-primary:focus,#onetrust-pc-sdk button.ot-sdk-button-primary:focus,#onetrust-pc-sdk input[type=\"submit\"].ot-sdk-button-primary:focus,#onetrust-pc-sdk input[type=\"reset\"].ot-sdk-button-primary:focus,#onetrust-pc-sdk input[type=\"button\"].ot-sdk-button-primary:focus,#ot-sdk-cookie-policy .ot-sdk-button.ot-sdk-button-primary:hover,#ot-sdk-cookie-policy button.ot-sdk-button-primary:hover,#ot-sdk-cookie-policy input[type=\"submit\"].ot-sdk-button-primary:hover,#ot-sdk-cookie-policy input[type=\"reset\"].ot-sdk-button-primary:hover,#ot-sdk-cookie-policy input[type=\"button\"].ot-sdk-button-primary:hover,#ot-sdk-cookie-policy .ot-sdk-button.ot-sdk-button-primary:focus,#ot-sdk-cookie-policy button.ot-sdk-button-primary:focus,#ot-sdk-cookie-policy input[type=\"submit\"].ot-sdk-button-primary:focus,#ot-sdk-cookie-policy input[type=\"reset\"].ot-sdk-button-primary:focus,#ot-sdk-cookie-policy input[type=\"button\"].ot-sdk-button-primary:focus{color:#fff;background-color:#1eaedb;border-color:#1eaedb}#onetrust-banner-sdk input[type=\"email\"],#onetrust-banner-sdk input[type=\"number\"],#onetrust-banner-sdk input[type=\"search\"],#onetrust-banner-sdk input[type=\"text\"],#onetrust-banner-sdk input[type=\"tel\"],#onetrust-banner-sdk input[type=\"url\"],#onetrust-banner-sdk input[type=\"password\"],#onetrust-banner-sdk textarea,#onetrust-banner-sdk select,#onetrust-pc-sdk input[type=\"email\"],#onetrust-pc-sdk input[type=\"number\"],#onetrust-pc-sdk input[type=\"search\"],#onetrust-pc-sdk input[type=\"text\"],#onetrust-pc-sdk input[type=\"tel\"],#onetrust-pc-sdk input[type=\"url\"],#onetrust-pc-sdk input[type=\"password\"],#onetrust-pc-sdk textarea,#onetrust-pc-sdk select,#ot-sdk-cookie-policy input[type=\"email\"],#ot-sdk-cookie-policy input[type=\"number\"],#ot-sdk-cookie-policy input[type=\"search\"],#ot-sdk-cookie-policy input[type=\"text\"],#ot-sdk-cookie-policy input[type=\"tel\"],#ot-sdk-cookie-policy input[type=\"url\"],#ot-sdk-cookie-policy input[type=\"password\"],#ot-sdk-cookie-policy textarea,#ot-sdk-cookie-policy select{height:38px;padding:6px 10px;background-color:#fff;border:1px solid #d1d1d1;border-radius:4px;box-shadow:none;box-sizing:border-box}#onetrust-banner-sdk input[type=\"email\"],#onetrust-banner-sdk input[type=\"number\"],#onetrust-banner-sdk input[type=\"search\"],#onetrust-banner-sdk input[type=\"text\"],#onetrust-banner-sdk input[type=\"tel\"],#onetrust-banner-sdk input[type=\"url\"],#onetrust-banner-sdk input[type=\"password\"],#onetrust-banner-sdk textarea,#onetrust-pc-sdk input[type=\"email\"],#onetrust-pc-sdk input[type=\"number\"],#onetrust-pc-sdk input[type=\"search\"],#onetrust-pc-sdk input[type=\"text\"],#onetrust-pc-sdk input[type=\"tel\"],#onetrust-pc-sdk input[type=\"url\"],#onetrust-pc-sdk input[type=\"password\"],#onetrust-pc-sdk textarea,#ot-sdk-cookie-policy input[type=\"email\"],#ot-sdk-cookie-policy input[type=\"number\"],#ot-sdk-cookie-policy input[type=\"search\"],#ot-sdk-cookie-policy input[type=\"text\"],#ot-sdk-cookie-policy input[type=\"tel\"],#ot-sdk-cookie-policy input[type=\"url\"],#ot-sdk-cookie-policy input[type=\"password\"],#ot-sdk-cookie-policy textarea{-webkit-appearance:none;-moz-appearance:none;appearance:none}#onetrust-banner-sdk textarea,#onetrust-pc-sdk textarea,#ot-sdk-cookie-policy textarea{min-height:65px;padding-top:6px;padding-bottom:6px}#onetrust-banner-sdk input[type=\"email\"]:focus,#onetrust-banner-sdk input[type=\"number\"]:focus,#onetrust-banner-sdk input[type=\"search\"]:focus,#onetrust-banner-sdk input[type=\"text\"]:focus,#onetrust-banner-sdk input[type=\"tel\"]:focus,#onetrust-banner-sdk input[type=\"url\"]:focus,#onetrust-banner-sdk input[type=\"password\"]:focus,#onetrust-banner-sdk textarea:focus,#onetrust-banner-sdk select:focus,#onetrust-pc-sdk input[type=\"email\"]:focus,#onetrust-pc-sdk input[type=\"number\"]:focus,#onetrust-pc-sdk input[type=\"search\"]:focus,#onetrust-pc-sdk input[type=\"text\"]:focus,#onetrust-pc-sdk input[type=\"tel\"]:focus,#onetrust-pc-sdk input[type=\"url\"]:focus,#onetrust-pc-sdk input[type=\"password\"]:focus,#onetrust-pc-sdk textarea:focus,#onetrust-pc-sdk select:focus,#ot-sdk-cookie-policy input[type=\"email\"]:focus,#ot-sdk-cookie-policy input[type=\"number\"]:focus,#ot-sdk-cookie-policy input[type=\"search\"]:focus,#ot-sdk-cookie-policy input[type=\"text\"]:focus,#ot-sdk-cookie-policy input[type=\"tel\"]:focus,#ot-sdk-cookie-policy input[type=\"url\"]:focus,#ot-sdk-cookie-policy input[type=\"password\"]:focus,#ot-sdk-cookie-policy textarea:focus,#ot-sdk-cookie-policy select:focus{border:1px solid #33c3f0;outline:0}#onetrust-banner-sdk label,#onetrust-banner-sdk legend,#onetrust-pc-sdk label,#onetrust-pc-sdk legend,#ot-sdk-cookie-policy label,#ot-sdk-cookie-policy legend{display:block;margin-bottom:0.5rem;font-weight:600}#onetrust-banner-sdk fieldset,#onetrust-pc-sdk fieldset,#ot-sdk-cookie-policy fieldset{padding:0;border-width:0}#onetrust-banner-sdk input[type=\"checkbox\"],#onetrust-banner-sdk input[type=\"radio\"],#onetrust-pc-sdk input[type=\"checkbox\"],#onetrust-pc-sdk input[type=\"radio\"],#ot-sdk-cookie-policy input[type=\"checkbox\"],#ot-sdk-cookie-policy input[type=\"radio\"]{display:inline}#onetrust-banner-sdk label>.label-body,#onetrust-pc-sdk label>.label-body,#ot-sdk-cookie-policy label>.label-body{display:inline-block;margin-left:0.5rem;font-weight:normal}#onetrust-banner-sdk ul,#onetrust-pc-sdk ul,#ot-sdk-cookie-policy ul{list-style:circle inside}#onetrust-banner-sdk ol,#onetrust-pc-sdk ol,#ot-sdk-cookie-policy ol{list-style:decimal inside}#onetrust-banner-sdk ol,#onetrust-banner-sdk ul,#onetrust-pc-sdk ol,#onetrust-pc-sdk ul,#ot-sdk-cookie-policy ol,#ot-sdk-cookie-policy ul{padding-left:0;margin-top:0}#onetrust-banner-sdk ul ul,#onetrust-banner-sdk ul ol,#onetrust-banner-sdk ol ol,#onetrust-banner-sdk ol ul,#onetrust-pc-sdk ul ul,#onetrust-pc-sdk ul ol,#onetrust-pc-sdk ol ol,#onetrust-pc-sdk ol ul,#ot-sdk-cookie-policy ul ul,#ot-sdk-cookie-policy ul ol,#ot-sdk-cookie-policy ol ol,#ot-sdk-cookie-policy ol ul{margin:1.5rem 0 1.5rem 3rem;font-size:90%}#onetrust-banner-sdk li,#onetrust-pc-sdk li,#ot-sdk-cookie-policy li{margin-bottom:1rem}#onetrust-banner-sdk code,#onetrust-pc-sdk code,#ot-sdk-cookie-policy code{padding:0.2rem 0.5rem;margin:0 0.2rem;font-size:90%;white-space:nowrap;background:#f1f1f1;border:1px solid #e1e1e1;border-radius:4px}#onetrust-banner-sdk pre>code,#onetrust-pc-sdk pre>code,#ot-sdk-cookie-policy pre>code{display:block;padding:1rem 1.5rem;white-space:pre}#onetrust-banner-sdk th,#onetrust-banner-sdk td,#onetrust-pc-sdk th,#onetrust-pc-sdk td,#ot-sdk-cookie-policy th,#ot-sdk-cookie-policy td{padding:12px 15px;text-align:left;border-bottom:1px solid #e1e1e1}#onetrust-banner-sdk .ot-sdk-u-full-width,#onetrust-pc-sdk .ot-sdk-u-full-width,#ot-sdk-cookie-policy .ot-sdk-u-full-width{width:100%;box-sizing:border-box}#onetrust-banner-sdk .ot-sdk-u-max-full-width,#onetrust-pc-sdk .ot-sdk-u-max-full-width,#ot-sdk-cookie-policy .ot-sdk-u-max-full-width{max-width:100%;box-sizing:border-box}#onetrust-banner-sdk .ot-sdk-u-pull-right,#onetrust-pc-sdk .ot-sdk-u-pull-right,#ot-sdk-cookie-policy .ot-sdk-u-pull-right{float:right}#onetrust-banner-sdk .ot-sdk-u-pull-left,#onetrust-pc-sdk .ot-sdk-u-pull-left,#ot-sdk-cookie-policy .ot-sdk-u-pull-left{float:left}#onetrust-banner-sdk hr,#onetrust-pc-sdk hr,#ot-sdk-cookie-policy hr{margin-top:3rem;margin-bottom:3.5rem;border-width:0;border-top:1px solid #e1e1e1}#onetrust-banner-sdk .ot-sdk-container:after,#onetrust-banner-sdk .ot-sdk-row:after,#onetrust-banner-sdk .ot-sdk-u-cf,#onetrust-pc-sdk .ot-sdk-container:after,#onetrust-pc-sdk .ot-sdk-row:after,#onetrust-pc-sdk .ot-sdk-u-cf,#ot-sdk-cookie-policy .ot-sdk-container:after,#ot-sdk-cookie-policy .ot-sdk-row:after,#ot-sdk-cookie-policy .ot-sdk-u-cf{content:\"\";display:table;clear:both}#onetrust-banner-sdk .ot-sdk-row,#onetrust-pc-sdk .ot-sdk-row,#ot-sdk-cookie-policy .ot-sdk-row{margin:0;max-width:none;display:block;margin:0}\n",
                    cssRTL: "#onetrust-banner-sdk{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}#onetrust-banner-sdk .onetrust-vendors-list-handler{cursor:pointer;color:#1f96db;font-size:inherit;font-weight:bold;text-decoration:none;margin-right:5px}#onetrust-banner-sdk .onetrust-vendors-list-handler:hover{color:#1f96db}#onetrust-banner-sdk .close-icon,#onetrust-pc-sdk .close-icon{background-image:url(\"data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMzQ4LjMzM3B4IiBoZWlnaHQ9IjM0OC4zMzNweCIgdmlld0JveD0iMCAwIDM0OC4zMzMgMzQ4LjMzNCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzQ4LjMzMyAzNDguMzM0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PHBhdGggZmlsbD0iIzU2NTY1NiIgZD0iTTMzNi41NTksNjguNjExTDIzMS4wMTYsMTc0LjE2NWwxMDUuNTQzLDEwNS41NDljMTUuNjk5LDE1LjcwNSwxNS42OTksNDEuMTQ1LDAsNTYuODVjLTcuODQ0LDcuODQ0LTE4LjEyOCwxMS43NjktMjguNDA3LDExLjc2OWMtMTAuMjk2LDAtMjAuNTgxLTMuOTE5LTI4LjQxOS0xMS43NjlMMTc0LjE2NywyMzEuMDAzTDY4LjYwOSwzMzYuNTYzYy03Ljg0Myw3Ljg0NC0xOC4xMjgsMTEuNzY5LTI4LjQxNiwxMS43NjljLTEwLjI4NSwwLTIwLjU2My0zLjkxOS0yOC40MTMtMTEuNzY5Yy0xNS42OTktMTUuNjk4LTE1LjY5OS00MS4xMzksMC01Ni44NWwxMDUuNTQtMTA1LjU0OUwxMS43NzQsNjguNjExYy0xNS42OTktMTUuNjk5LTE1LjY5OS00MS4xNDUsMC01Ni44NDRjMTUuNjk2LTE1LjY4Nyw0MS4xMjctMTUuNjg3LDU2LjgyOSwwbDEwNS41NjMsMTA1LjU1NEwyNzkuNzIxLDExLjc2N2MxNS43MDUtMTUuNjg3LDQxLjEzOS0xNS42ODcsNTYuODMyLDBDMzUyLjI1OCwyNy40NjYsMzUyLjI1OCw1Mi45MTIsMzM2LjU1OSw2OC42MTF6Ii8+PC9nPjwvc3ZnPg==\");background-size:contain;background-repeat:no-repeat;background-position:center;height:12px;width:12px}#onetrust-banner-sdk .powered-by-logo,#onetrust-pc-sdk .powered-by-logo{background-image:url(\"data:image/svg+xml;base64,PHN2ZyBpZD0ic3ZnLXRlc3QiIHdpZHRoPSIxNTJweCIgaGVpZ2h0PSIyNXB4IiB2aWV3Qm94PSIwIDAgMTE1MiAxNDkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHRpdGxlPlBvd2VyZWQgQnkgT25lVHJ1c3Q8L3RpdGxlPjxkZXNjPkxpbmsgdG8gT25lVHJ1c3QgV2Vic2l0ZTwvZGVzYz48ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjMuMDAwMDAwLCAtMjAuMDAwMDAwKSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjU4LjAwMDAwMCwgMC4wMDAwMDApIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtOTAuMDAwMDAwLCAzNS4wMDAwMDApIj48cGF0aCBkPSJNNzYuMTgsNDIuNiBDNzYuMTgsNTUuODUzMzMzMyA3Mi44NDY2NjY3LDY2LjI3MzMzMzMgNjYuMTgsNzMuODYgQzU5LjUxMzMzMzMsODEuNDQ2NjY2NyA1MC4xOCw4NS4yNCAzOC4xOCw4NS4yNCBDMjUuOTgsODUuMjQgMTYuNTg2NjY2Nyw4MS40OTMzMzMzIDEwLDc0IEMzLjQxMzMzMzMzLDY2LjUwNjY2NjcgMC4wOCw1NiAwLDQyLjQ4IEMwLDI5IDMuMzMzMzMzMzMsMTguNTQ2NjY2NyAxMCwxMS4xMiBDMTYuNjY2NjY2NywzLjY5MzMzMzMzIDI2LjA5MzMzMzMsLTAuMDEzMzMzMzMzMyAzOC4yOCwxLjc3NjM1Njg0ZS0xNSBDNTAuMTczMzMzMywxLjc3NjM1Njg0ZS0xNSA1OS40NiwzLjc3MzMzMzMzIDY2LjE0LDExLjMyIEM3Mi44MiwxOC44NjY2NjY3IDc2LjE2NjY2NjcsMjkuMjkzMzMzMyA3Ni4xOCw0Mi42IFogTTEwLjE4LDQyLjYgQzEwLjE4LDUzLjgxMzMzMzMgMTIuNTY2NjY2Nyw2Mi4zMiAxNy4zNCw2OC4xMiBDMjIuMTEzMzMzMyw3My45MiAyOS4wNiw3Ni44MTMzMzMzIDM4LjE4LDc2LjggQzQ3LjM1MzMzMzMsNzYuOCA1NC4yOCw3My45MTMzMzMzIDU4Ljk2LDY4LjE0IEM2My42NCw2Mi4zNjY2NjY3IDY1Ljk4NjY2NjcsNTMuODUzMzMzMyA2Niw0Mi42IEM2NiwzMS40NjY2NjY3IDYzLjY2NjY2NjcsMjMuMDIgNTksMTcuMjYgQzU0LjMzMzMzMzMsMTEuNSA0Ny40MjY2NjY3LDguNjEzMzMzMzMgMzguMjgsOC42IEMyOS4xMDY2NjY3LDguNiAyMi4xMzMzMzMzLDExLjUgMTcuMzYsMTcuMyBDMTIuNTg2NjY2NywyMy4xIDEwLjIsMzEuNTMzMzMzMyAxMC4yLDQyLjYgTDEwLjE4LDQyLjYgWiIgZmlsbD0iIzZGQkU0QSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTEzNS43Miw4NC4xMiBMMTM1LjcyLDQ0IEMxMzUuNzIsMzguOTQ2NjY2NyAxMzQuNTY2NjY3LDM1LjE3MzMzMzMgMTMyLjI2LDMyLjY4IEMxMjkuOTUzMzMzLDMwLjE4NjY2NjcgMTI2LjM0NjY2NywyOC45NCAxMjEuNDQsMjguOTQgQzExNC45NDY2NjcsMjguOTQgMTEwLjE4NjY2NywzMC42OTMzMzMzIDEwNy4xNiwzNC4yIEMxMDQuMTMzMzMzLDM3LjcwNjY2NjcgMTAyLjYyLDQzLjUgMTAyLjYyLDUxLjU4IEwxMDIuNjIsODQuMTIgTDkzLjIyLDg0LjEyIEw5My4yMiwyMiBMMTAwLjg2LDIyIEwxMDIuMzgsMzAuNSBMMTAyLjg0LDMwLjUgQzEwNC43ODAyOTEsMjcuNDIzMzIwOCAxMDcuNTU0NjI5LDI0Ljk2MTA5NTYgMTEwLjg0LDIzLjQgQzExNC40NzA0MDcsMjEuNjg0NjUwMSAxMTguNDQ1MTUzLDIwLjgyMjY1NyAxMjIuNDYsMjAuODggQzEyOS45NCwyMC44OCAxMzUuNTY2NjY3LDIyLjY4IDEzOS4zNCwyNi4yOCBDMTQzLjExMzMzMywyOS44OCAxNDUsMzUuNjQ2NjY2NyAxNDUsNDMuNTggTDE0NSw4NC4xMiBMMTM1LjcyLDg0LjEyIFoiIGZpbGw9IiM2RkJFNEEiLz48cGF0aCBkPSJNMTkwLjY2LDg1LjI0IEMxODEuNDg2NjY3LDg1LjI0IDE3NC4yNDY2NjcsODIuNDQ2NjY2NyAxNjguOTQsNzYuODYgQzE2My42MzMzMzMsNzEuMjczMzMzMyAxNjAuOTY2NjY3LDYzLjUxMzMzMzMgMTYwLjk0LDUzLjU4IEMxNjAuOTQsNDMuNTggMTYzLjQwNjY2NywzNS42MzMzMzMzIDE2OC4zNCwyOS43NCBDMTczLjIyMjYxOCwyMy44NjE5ODg1IDE4MC41NjQ3MzQsMjAuNTkzODk2NCAxODguMiwyMC45IEMxOTUuMTkxODE5LDIwLjU3MjgzMjkgMjAxLjk2MzQ4MSwyMy4zOTAwNzkgMjA2LjY2LDI4LjU4IEMyMTEuMTkzMzMzLDMzLjcgMjEzLjQ2LDQwLjQ0NjY2NjcgMjEzLjQ2LDQ4LjgyIEwyMTMuNDYsNTQuODIgTDE3MC43Miw1NC44MiBDMTcwLjkwNjY2Nyw2Mi4xMTMzMzMzIDE3Mi43NDY2NjcsNjcuNjQ2NjY2NyAxNzYuMjQsNzEuNDIgQzE4MC4xMTE3NTIsNzUuMzQ5Njc5OSAxODUuNDkzNDg3LDc3LjQxMzQwNzggMTkxLDc3LjA4IEMxOTcuODI0MDU2LDc3LjA0NzIxMjYgMjA0LjU2OTE3Miw3NS42MTc4NzQzIDIxMC44Miw3Mi44OCBMMjEwLjgyLDgxLjI2IEMyMDcuNzg0MDg5LDgyLjU5OTM0ODMgMjA0LjYyMTYzLDgzLjYzMTE2NzYgMjAxLjM4LDg0LjM0IEMxOTcuODQ2NDU5LDg1LjAwMjk0OTUgMTk0LjI1NDYxNCw4NS4zMDQ1MDM3IDE5MC42Niw4NS4yNCBaIE0xODguMSwyOC43OCBDMTgzLjU3NjE0MywyOC41NTc4NDQzIDE3OS4xODQ4NTgsMzAuMzQzNjMzNyAxNzYuMSwzMy42NiBDMTcyLjkxNDg0NSwzNy40NTI2ODM2IDE3MS4wNzI2MjcsNDIuMTkxODIzNCAxNzAuODYsNDcuMTQgTDIwMy40LDQ3LjE0IEMyMDMuNCw0MS4yMDY2NjY3IDIwMi4wNjY2NjcsMzYuNjY2NjY2NyAxOTkuNCwzMy41MiBDMTk2LjU2MTUzOSwzMC4yODc5MjcgMTkyLjM5NDgzNiwyOC41NDAxMjQxIDE4OC4xLDI4Ljc4IFoiIGZpbGw9IiM2RkJFNEEiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwb2x5Z29uIGZpbGw9IiM2RkJFNEEiIHBvaW50cz0iMjU2LjQyIDg0LjEyIDI0Ni44IDg0LjEyIDI0Ni44IDkuODYgMjIwLjU2IDkuODYgMjIwLjU2IDEuMyAyODIuNTYgMS4zIDI4Mi41NiA5Ljg2IDI1Ni40MiA5Ljg2Ii8+PHBhdGggZD0iTTMyMiwyMC45IEMzMjQuNDg5OTcsMjAuODc1MDQzNSAzMjYuOTc2MDQzLDIxLjEwMjg3NzcgMzI5LjQyLDIxLjU4IEwzMjguMTIsMzAuMyBDMzI1Ljg4OTkyOCwyOS43Nzc0NDM3IDMyMy42MTAxOTcsMjkuNDk1ODI5OSAzMjEuMzIsMjkuNDYgQzMxNi4zMjMyMjQsMjkuNDUyMzMxOSAzMTEuNTkwMTM5LDMxLjcwMTI4MjEgMzA4LjQ0LDM1LjU4IEMzMDQuODEzMDc5LDM5LjgxMjUyMTcgMzAyLjkwMTA2LDQ1LjI0ODkzMzcgMzAzLjA4LDUwLjgyIEwzMDMuMDgsODQuMTIgTDI5My42OCw4NC4xMiBMMjkzLjY4LDIyIEwzMDEuNDQsMjIgTDMwMi41MiwzMy41IEwzMDIuOTgsMzMuNSBDMzA0Ljk5MjUxMiwyOS43ODQyOTY3IDMwNy44NDA3MDgsMjYuNTg2OTIyNyAzMTEuMywyNC4xNiBDMzE0LjQ1MjE4OSwyMi4wMTA1NjkyIDMxOC4xODQ4MTUsMjAuODczMzM5MyAzMjIsMjAuOSBaIiBmaWxsPSIjNkZCRTRBIi8+PHBhdGggZD0iTTM0OS44NiwyMiBMMzQ5Ljg2LDYyLjMgQzM0OS44Niw2Ny4zNjY2NjY3IDM1MS4wMTMzMzMsNzEuMTQgMzUzLjMyLDczLjYyIEMzNTUuNjI2NjY3LDc2LjEgMzU5LjIzMzMzMyw3Ny4zNDY2NjY3IDM2NC4xNCw3Ny4zNiBDMzcwLjYzMzMzMyw3Ny4zNiAzNzUuMzgsNzUuNTg2NjY2NyAzNzguMzgsNzIuMDQgQzM4MS4zOCw2OC40OTMzMzMzIDM4Mi44OCw2Mi43IDM4Mi44OCw1NC42NiBMMzgyLjg4LDIyIEwzOTIuMjgsMjIgTDM5Mi4yOCw4NCBMMzg0LjUyLDg0IEwzODMuMTYsNzUuNjggTDM4Mi42Niw3NS42OCBDMzgwLjcyNzg0MSw3OC43NDM5OTkgMzc3Ljk0OTA4Niw4MS4xODIzNTY0IDM3NC42Niw4Mi43IEMzNzAuOTkxNjY5LDg0LjM3ODQzNzcgMzY2Ljk5MzQzNCw4NS4yMTIyNTc2IDM2Mi45Niw4NS4xNCBDMzU1LjQxMzMzMyw4NS4xNCAzNDkuNzYsODMuMzQ2NjY2NyAzNDYsNzkuNzYgQzM0Mi4yNCw3Ni4xNzMzMzMzIDM0MC4zNiw3MC40MzMzMzMzIDM0MC4zNiw2Mi41NCBMMzQwLjM2LDIyIEwzNDkuODYsMjIgWiIgZmlsbD0iIzZGQkU0QSIvPjxwYXRoIGQ9Ik00NTIuMjgsNjcuMTggQzQ1Mi41Mjk0NjMsNzIuNDQwMjM3OSA0NTAuMDk3OTM1LDc3LjQ2ODkwOCA0NDUuODIsODAuNTQgQzQ0MS41MTMzMzMsODMuNjczMzMzMyA0MzUuNDczMzMzLDg1LjI0IDQyNy43LDg1LjI0IEM0MTkuNDczMzMzLDg1LjI0IDQxMy4wNTMzMzMsODMuOTA2NjY2NyA0MDguNDQsODEuMjQgTDQwOC40NCw3Mi42MiBDNDExLjQ5OTMzLDc0LjE1NjEyNzQgNDE0LjcxODgwOCw3NS4zNTAwMTcyIDQxOC4wNCw3Ni4xOCBDNDIxLjI2NjI2OSw3Ny4wMjM0NzU0IDQyNC41ODUzNTMsNzcuNDYwMTk3IDQyNy45Miw3Ny40OCBDNDMxLjgzNDc3OSw3Ny42OTY2NzY5IDQzNS43Mzc5MzQsNzYuODgyOTQ0OCA0MzkuMjQsNzUuMTIgQzQ0MS41ODM0NTQsNzMuNzgyODg3MyA0NDMuMDk1MDUyLDcxLjM1NDYwNjkgNDQzLjI2MDM0Miw2OC42NjE1OTI4IEM0NDMuNDI1NjMxLDY1Ljk2ODU3ODggNDQyLjIyMjM0Myw2My4zNzM2NjYxIDQ0MC4wNiw2MS43NiBDNDM2LjI2OTg4Miw1OS4yMDM2NzM1IDQzMi4xNDQwMzIsNTcuMTg0NDk3MiA0MjcuOCw1NS43NiBDNDIzLjUwNjk2LDU0LjI2Njg2MjIgNDE5LjM3ODYzMSw1Mi4zMzY3MzQ3IDQxNS40OCw1MCBDNDEzLjI1NzUyOCw0OC42NDMwMTI1IDQxMS4zODEzNzIsNDYuNzg3Mzk4NyA0MTAsNDQuNTggQzQwOC43NjM4MDMsNDIuMzQ5OTE0IDQwOC4xNDkwNjgsMzkuODI4ODEwNyA0MDguMjIsMzcuMjggQzQwOC4wODg0MjEsMzIuNDg1NDY1OSA0MTAuNDIwNDMxLDI3Ljk1NzI5MjkgNDE0LjQsMjUuMjggQzQxOC41MiwyMi4zNiA0MjQuMTY2NjY3LDIwLjkgNDMxLjM0LDIwLjkgQzQzOC4wNzczMDMsMjAuODg3MjM1NiA0NDQuNzQ2NDY3LDIyLjI0ODI4OTUgNDUwLjk0LDI0LjkgTDQ0Ny42LDMyLjU0IEM0NDIuMjU3ODUzLDMwLjE2NDY0MTUgNDM2LjUwMzg2NCwyOC44NTM1MjAxIDQzMC42NiwyOC42OCBDNDI3LjIwODI3LDI4LjQ0NzgwNDQgNDIzLjc1NjkwNiwyOS4xMzgwNzczIDQyMC42NiwzMC42OCBDNDE4LjU0MDM2NCwzMS44MjQ4NzE4IDQxNy4yMzA4MTEsMzQuMDUxMTEzNSA0MTcuMjYsMzYuNDYgQzQxNy4yMTk0LDM3Ljk3NDIzNDMgNDE3LjY2ODI5LDM5LjQ2MTE3OTkgNDE4LjU0LDQwLjcgQzQxOS42NTQ1ODEsNDIuMDkxMjU1MSA0MjEuMDUyMTIxLDQzLjIyOTczOTQgNDIyLjY0LDQ0LjA0IEM0MjYuMTY0NjA1LDQ1Ljc5ODYwNjggNDI5Ljc5ODc5LDQ3LjMyODQzODQgNDMzLjUyLDQ4LjYyIEM0NDAuODgsNTEuMjg2NjY2NyA0NDUuODUzMzMzLDUzLjk1MzMzMzMgNDQ4LjQ0LDU2LjYyIEM0NTEuMTA5Myw1OS40NjczMzg2IDQ1Mi40OTY4NjYsNjMuMjgzMTQ2NiA0NTIuMjgsNjcuMTggTDQ1Mi4yOCw2Ny4xOCBaIiBmaWxsPSIjNkZCRTRBIi8+PHBhdGggZD0iTTQ4Ny42Miw3Ny40OCBDNDg5LjIzMzY0LDc3LjQ4NzEwOTkgNDkwLjg0NTMyLDc3LjM2NjczNTQgNDkyLjQ0LDc3LjEyIEM0OTMuNjgwOTA2LDc2Ljk0MTMxMzIgNDk0LjkwOTgzLDc2LjY4NzUxMzcgNDk2LjEyLDc2LjM2IEw0OTYuMTIsODMuNTYgQzQ5NC42ODI0MDgsODQuMTY5MjYzOSA0OTMuMTY4NDY5LDg0LjU3OTcwOTQgNDkxLjYyLDg0Ljc4IEM0ODkuODQ4ODk4LDg1LjA4MTk1MSA0ODguMDU2NTcyLDg1LjI0MjQ1NzggNDg2LjI2LDg1LjI2IEM0NzQuMjYsODUuMjYgNDY4LjI2LDc4LjkzMzMzMzMgNDY4LjI2LDY2LjI4IEw0NjguMjYsMjkuMzQgTDQ1OS4zNiwyOS4zNCBMNDU5LjM2LDI0LjggTDQ2OC4yNiwyMC44IEw0NzIuMjYsNy41NCBMNDc3LjcsNy41NCBMNDc3LjcsMjIgTDQ5NS43LDIyIEw0OTUuNywyOS4zIEw0NzcuNywyOS4zIEw0NzcuNyw2NS44OCBDNDc3LjQ5MzYyOSw2OC45NzY4NTk0IDQ3OC40NDEyMDcsNzIuMDQwNDU4OCA0ODAuMzYsNzQuNDggQzQ4Mi4yMTQ5MjgsNzYuNTA3Nzc1MSA0ODQuODc0NzI1LDc3LjYwNjg2NDkgNDg3LjYyLDc3LjQ4IEw0ODcuNjIsNzcuNDggWiIgZmlsbD0iIzZGQkU0QSIvPjwvZz48L2c+PHRleHQgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjkwIiBmb250LXdlaWdodD0iNTAwIiBmaWxsPSIjNjk2OTY5Ij48dHNwYW4geD0iMTQuMjU0ODgyOCIgeT0iMTEzIj5Qb3dlcmVkIGJ5PC90c3Bhbj48L3RleHQ+PC9nPjwvZz48L3N2Zz4=\");background-size:contain;background-repeat:no-repeat;background-position:center;height:25px;width:152px;display:block}#onetrust-banner-sdk h3 *,#onetrust-banner-sdk h4 *,#onetrust-banner-sdk h6 *,#onetrust-banner-sdk button *,#onetrust-banner-sdk a[data-parent-id] *,#onetrust-pc-sdk h3 *,#onetrust-pc-sdk h4 *,#onetrust-pc-sdk h6 *,#onetrust-pc-sdk button *,#onetrust-pc-sdk a[data-parent-id] *{font-size:inherit;font-weight:inherit;color:inherit}#onetrust-banner-sdk .hide,#onetrust-pc-sdk .hide{display:none !important}#onetrust-pc-sdk .ot-sdk-row .ot-sdk-column{padding:0}#onetrust-pc-sdk .ot-sdk-container{padding-left:0}#onetrust-pc-sdk .ot-sdk-row{flex-direction:initial;width:100%}#onetrust-pc-sdk [type=\"checkbox\"]:checked,#onetrust-pc-sdk [type=\"checkbox\"]:not(:checked){pointer-events:initial}#onetrust-pc-sdk [type=\"checkbox\"]:disabled+label::before,#onetrust-pc-sdk [type=\"checkbox\"]:disabled+label:after,#onetrust-pc-sdk [type=\"checkbox\"]:disabled+label{pointer-events:none;opacity:0.7}#onetrust-pc-sdk #vendor-list-content{transform:translate3d(0, 0, 0)}#onetrust-pc-sdk li input[type=\"checkbox\"]{z-index:1}#onetrust-pc-sdk li .ot-checkbox label{z-index:2}#onetrust-pc-sdk li .ot-checkbox input[type=\"checkbox\"]{height:auto;width:auto}#onetrust-pc-sdk li .host-title a,#onetrust-pc-sdk li .accordion-text{z-index:2;position:relative}#onetrust-pc-sdk input{margin:3px 0.1ex}#onetrust-pc-sdk .toggle-always-active{opacity:0.6;cursor:default}#onetrust-pc-sdk .screen-reader-only{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px}#onetrust-pc-sdk .pc-logo{height:60px;width:180px;background:url(\"data:image/svg+xml;base64, PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNTE3IiBoZWlnaHQ9IjE1MCI+CiAgPGRlZnM+CiAgICA8cGF0aCBpZD0iYSIgZD0iTS41NDc3LjI0MDRoMjEuODU5djIxLjY4ODVILjU0Nzd6Ii8+CiAgICA8cGF0aCBpZD0iYyIgZD0iTS4wMzc2LjE3MTNoNTEzLjA0Mjl2MTQ2LjUwNTVILjAzNzZ6Ii8+CiAgPC9kZWZzPgogIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICA8cGF0aCBmaWxsPSIjNUE1QjVEIiBkPSJNOS40NDc4IDEzNi45MzQzaDEuMjg0M2MxLjE5OSAwIDIuMDk2OS0uMjM3MiAyLjY5My0uNzExNy41OTU0LS40NzM5Ljg5MzQtMS4xNjQ5Ljg5MzQtMi4wNzExIDAtLjkxMzgtLjI0OTctMS41ODk4LS43NDg1LTIuMDI3Mi0uNDk5NC0uNDM1Ni0xLjI4MTgtLjY1NC0yLjM0NzItLjY1NGgtMS43NzV2NS40NjR6bTguODA5LTIuOTIxNWMwIDEuOTgxMy0uNjE4NiAzLjQ5NjQtMS44NTU5IDQuNTQ1Mi0xLjIzNzIgMS4wNDgtMi45OTcyIDEuNTcyOC01LjI3OTEgMS41NzI4aC0xLjY3NHY2LjU0Nkg1LjU0NjV2LTE4LjQwM2g1Ljg3NzdjMi4yMzExIDAgMy45Mjc3LjQ3OTUgNS4wODk3IDEuNDQwNCAxLjE2Mi45NjE1IDEuNzQzIDIuMzkzNyAxLjc0MyA0LjI5ODZ6TTI1LjYzMTcgMTM2LjQ0MjNoMS4yNTg2YzEuMjMzNSAwIDIuMTQzOS0uMjA1OSAyLjczMTItLjYxNTcuNTg3Mi0uNDExNy44ODA5LTEuMDU4Mi44ODA5LTEuOTM5NCAwLS44NzMtLjMtMS40OTM3LS44OTk4LTEuODYyNy0uNjAwNC0uMzY5LTEuNTI5LS41NTQyLTIuNzg3Ni0uNTU0MmgtMS4xODMzdjQuOTcyem0wIDMuMTczMnY3LjA2MTNoLTMuOTAxNHYtMTguNDAzaDUuMzYxNGMyLjUwMDMgMCA0LjM1LjQ1NDQgNS41NTAyIDEuMzY1MSAxLjE5OTYuOTEwNyAxLjc5ODggMi4yOTMzIDEuNzk4OCA0LjE0OCAwIDEuMDgyLS4yOTc0IDIuMDQ1My0uODkyOCAyLjg4ODItLjU5Ni44NDM1LTEuNDM5MyAxLjUwNDQtMi41Mjk4IDEuOTgzMyAyLjc2ODkgNC4xMzcyIDQuNTcyIDYuODA5NiA1LjQxMTYgOC4wMTg0aC00LjMyOTNsLTQuMzkyLTcuMDYxM2gtMi4wNzY3ek0zOC43NDQ5IDE0Ni42NzY4aDMuOTAxM3YtMTguNDAzSDM4Ljc0NXpNNTcuNzcyOSAxMjguMjczOGgzLjkzOWwtNi4yNTQ5IDE4LjQwM2gtNC4yNTMzbC02LjI0MjMtMTguNDAzaDMuOTM5NmwzLjQ2MDMgMTAuOTUwN2MuMTkyNi42NDY0LjM5MjIgMS4zOTk2LjU5OCAyLjI2MDYuMjA1MS44NTk5LjMzMzEgMS40NTguMzg0IDEuNzkzMS4wOTIyLS43NzI2LjQwNjUtMi4xMjMyLjk0MzYtNC4wNTM3bDMuNDg2LTEwLjk1MDdNNzMuMDI1IDEzOS4wMjM2Yy0xLjIzMjktMy45NzAzLTEuOTI2OC02LjIxNTItMi4wODI0LTYuNzM0OS0uMTU1Ni0uNTIwMy0uMjY2LS45MzE0LS4zMzM4LTEuMjMzOS0uMjc2NyAxLjA3NDUtMS4wNjkyIDMuNzMxMi0yLjM3OCA3Ljk2ODhoNC43OTQyem0yLjI2NTYgNy42NTMybC0xLjMzMzktNC4zODAxSDY3LjI0OWwtMS4zMzQgNC4zOGgtNC4yMDNsNi40OTM4LTE4LjQ3ODhoNC43NjkxbDYuNTE5IDE4LjQ3ODloLTQuMjAzMnpNODkuNjI0MiAxMzEuMjU2OWMtMS40NjgyIDAtMi42MDQ0LjU1MTctMy40MTA3IDEuNjU0NC0uODA1IDEuMTA0LTEuMjA3OCAyLjY0MjMtMS4yMDc4IDQuNjE0MiAwIDQuMTA0IDEuNTM5NyA2LjE1NSA0LjYxODUgNi4xNTUgMS4yOTE5IDAgMi44NTY3LS4zMjIgNC42OTQ0LS45Njl2My4yNzI0Yy0xLjUxMDIuNjMwMS0zLjE5NjcuOTQ0Ni01LjA1OS45NDQ2LTIuNjc2NSAwLTQuNzIzOC0uODEyMi02LjE0MTItMi40MzU4LTEuNDE4Ni0xLjYyMy0yLjEyNy0zLjk1NC0yLjEyNy02Ljk5MyAwLTEuOTEyOS4zNDc2LTMuNTg5MiAxLjA0NDctNS4wMjg0LjY5NTgtMS40Mzk3IDEuNjk2Ni0yLjU0MzcgMy4wMDEtMy4zMTA2IDEuMzA0NC0uNzY4MiAyLjgzMzQtMS4xNTIzIDQuNTg3MS0xLjE1MjMgMS43ODcgMCAzLjU4Mi40MzI0IDUuMzg2NSAxLjI5NjZsLTEuMjU4NiAzLjE3MjZhMjAuODE0MiAyMC44MTQyIDAgMDAtMi4wNzY4LS44NTZjLS42OTU4LS4yNDM2LTEuMzc5Ny0uMzY0Ny0yLjA1MS0uMzY0NyIvPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTUuMzY5IDEyOC4wMzM1KSI+CiAgICAgIDxtYXNrIGlkPSJiIiBmaWxsPSIjZmZmIj4KICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNhIi8+CiAgICAgIDwvbWFzaz4KICAgICAgPHBhdGggZmlsbD0iIzVBNUI1RCIgZD0iTTguNTg4OSA3LjgxNzZMMTIuNDI3NS4yNDA0aDQuMjAzTDEwLjUyNyAxMS40ODF2Ny4xNjIzSDYuNjUxNHYtNy4wMzY4TC41NDc3LjI0MDRINC43NzZsMy44MTI5IDcuNTc3Mk0yMi40MDY3IDE1LjkzN2MtLjQzNiAxLjY5NTItMS4xNzQ2IDMuNzA0OC0yLjIxNDggNi4wMjk1aC0yLjc2ODJjLjU0NTItMi4yMzI0Ljk2ODctNC4zMzggMS4yNzExLTYuMzE5NGgzLjUyM2wuMTg4OS4yOSIgbWFzaz0idXJsKCNiKSIvPgogICAgPC9nPgogICAgPHBhdGggZmlsbD0iIzVBNUI1RCIgZD0iTTEzOS4zNDUzIDE0MS41NjU1YzAgMS42NjI1LS41OTczIDIuOTcxNy0xLjc5MjYgMy45MjgyLTEuMTk1OC45NTY1LTIuODU5MSAxLjQzNDgtNC45OTA1IDEuNDM0OC0xLjk2MjYgMC0zLjctLjM2OS01LjIwOTUtMS4xMDcydi0zLjYyNjNjMS4yNDE2LjU1NDIgMi4yOTIuOTQ0NSAzLjE1MjIgMS4xNzE3Ljg2MDIuMjI2NiAxLjY0NjMuMzM5NiAyLjM1OTcuMzM5Ni44NTU4IDAgMS41MTIxLS4xNjM4IDEuOTY5NS0uNDkxNC40NTc0LS4zMjY0LjY4NTgtLjgxMzQuNjg1OC0xLjQ1OTkgMC0uMzYwOS0uMTAwNC0uNjgxNi0uMzAyNC0uOTYzNC0uMjAwOC0uMjgwNS0uNDk3LS41NTE2LS44ODcyLS44MTIxLS4zODk3LS4yNTkyLTEuMTg0Ni0uNjc0Ny0yLjM4NDItMS4yNDUyLTEuMTI0NC0uNTI5LTEuOTY3Ny0xLjAzNjgtMi41Mjk4LTEuNTIzOC0uNTYyMi0uNDg1OC0xLjAxMTQtMS4wNTMyLTEuMzQ2NS0xLjY5OS0uMzM1Ny0uNjQ2NC0uNTAzMi0xLjQwMTUtLjUwMzItMi4yNjU3IDAtMS42MjguNTUxNS0yLjkwODQgMS42NTQ1LTMuODQwNCAxLjEwMy0uOTMxMyAyLjYyODMtMS4zOTcgNC41NzQ2LTEuMzk3Ljk1NjIgMCAxLjg2OTEuMTE0MiAyLjczNzUuMzQwMS44Njc3LjIyNiAxLjc3NjIuNTQ1NCAyLjcyNDMuOTU2NWwtMS4yNTg3IDMuMDM0Yy0uOTgxMy0uNDAyNC0xLjc5MzEtLjY4MzYtMi40MzUtLjg0My0uNjQxOS0uMTU5NC0xLjI3My0uMjM5MS0xLjg5MzYtLjIzOTEtLjczODUgMC0xLjMwNS4xNzEzLTEuNjk5LjUxNTktLjM5NDcuMzQ0LS41OTE3Ljc5MzMtLjU5MTcgMS4zNDYyIDAgLjM0NDYuMDc5Ny42NDQ2LjIzOS45MDA3LjE1OTQuMjU2LjQxMzUuNTA0Ljc2MTEuNzQzLjM0ODIuMjM4IDEuMTcyNy42NjkxIDIuNDczMyAxLjI4OTggMS43MTk4LjgyMjggMi44OTgxIDEuNjQ2OSAzLjUzNjIgMi40NzM0LjYzNzUuODI2Ni45NTYyIDEuODQwMi45NTYyIDMuMDM5Nk0xNTMuMjc2NyAxNDYuNjc2OGgtMTAuNTk2NnYtMTguNDAzaDEwLjU5NjZ2My4xOTY1aC02LjY5NTN2NC4wNDEyaDYuMjI5MXYzLjE5N2gtNi4yMjl2NC43NDU1aDYuNjk1MnYzLjIyMjhNMTY0LjkyOTkgMTMxLjI1NjljLTEuNDY4OCAwLTIuNjA1LjU1MTctMy40MTA3IDEuNjU0NC0uODA1IDEuMTA0LTEuMjA3OCAyLjY0MjMtMS4yMDc4IDQuNjE0MiAwIDQuMTA0IDEuNTM5IDYuMTU1IDQuNjE4NSA2LjE1NSAxLjI5MTkgMCAyLjg1NjctLjMyMiA0LjY5MzgtLjk2OXYzLjI3MjRjLTEuNTA5Ni42MzAxLTMuMTk2MS45NDQ2LTUuMDU5Ljk0NDYtMi42NzYgMC00LjcyMzItLjgxMjItNi4xNDEyLTIuNDM1OC0xLjQxOC0xLjYyMy0yLjEyNy0zLjk1NC0yLjEyNy02Ljk5MyAwLTEuOTEyOS4zNDgyLTMuNTg5MiAxLjA0NDctNS4wMjg0LjY5NjQtMS40Mzk3IDEuNjk2NS0yLjU0MzcgMy4wMDE2LTMuMzEwNiAxLjMwNDQtLjc2ODIgMi44MzM0LTEuMTUyMyA0LjU4NzEtMS4xNTIzIDEuNzg3IDAgMy41ODIuNDMyNCA1LjM4NTggMS4yOTY2bC0xLjI1OCAzLjE3MjZhMjAuODE0MiAyMC44MTQyIDAgMDAtMi4wNzY3LS44NTZjLS42OTY1LS4yNDM2LTEuMzgwNC0uMzY0Ny0yLjA1MTEtLjM2NDdNMTg4LjUxMyAxMjguMjczOHYxMS45MDcyYzAgMS4zNi0uMzA0MyAyLjU1MjUtLjkxMjMgMy41NzU1LS42MDg2IDEuMDI0My0xLjQ4NyAxLjgwODgtMi42MzY0IDIuMzU0OC0xLjE0OTUuNTQ0OC0yLjUwODUuODE3Mi00LjA3NzcuODE3Mi0yLjM2NiAwLTQuMjAzMS0uNjA1Ny01LjUxMi0xLjgxODktMS4zMDgxLTEuMjEyNS0xLjk2MzEtMi44NzItMS45NjMxLTQuOTc4OHYtMTEuODU3aDMuODg4OHYxMS4yNjU3YzAgMS40MTg1LjI4NTQgMi40NTkuODU1OCAzLjEyMTguNTcwMy42NjI4IDEuNTE0Ljk5NDggMi44MzE1Ljk5NDggMS4yNzUgMCAyLjE5OTgtLjMzNCAyLjc3NDUtMS4wMDA1LjU3NDgtLjY2NzcuODYyMS0xLjcxNDYuODYyMS0zLjE0MTJ2LTExLjI0MDZoMy44ODg4TTE5Ni45MTkzIDEzNi40NDIzaDEuMjU4NmMxLjIzMzUgMCAyLjE0NC0uMjA1OSAyLjczMTItLjYxNTcuNTg3My0uNDExNy44ODA5LTEuMDU4Mi44ODA5LTEuOTM5NCAwLS44NzMtLjMtMS40OTM3LS44OTk3LTEuODYyNy0uNjAwNS0uMzY5LTEuNTI5LS41NTQyLTIuNzg3Ny0uNTU0MmgtMS4xODMzdjQuOTcyem0wIDMuMTczMnY3LjA2MTNoLTMuOTAxNHYtMTguNDAzaDUuMzYxNGMyLjUwMDMgMCA0LjM1LjQ1NDQgNS41NTAyIDEuMzY1MSAxLjE5OTcuOTEwNyAxLjc5ODkgMi4yOTMzIDEuNzk4OSA0LjE0OCAwIDEuMDgyLS4yOTc0IDIuMDQ1My0uODkyOSAyLjg4ODItLjU5Ni44NDM1LTEuNDM5MyAxLjUwNDQtMi41Mjk4IDEuOTgzMyAyLjc2ODkgNC4xMzcyIDQuNTcyMSA2LjgwOTYgNS40MTE2IDguMDE4NGgtNC4zMjkybC00LjM5Mi03LjA2MTNoLTIuMDc2OHpNMjEwLjAzMjUgMTQ2LjY3NjhoMy45MDEzdi0xOC40MDNoLTMuOTAxM3pNMjI1LjY2MyAxNDYuNjc2OGgtMy45MDE0VjEzMS41MjFoLTQuOTk2MnYtMy4yNDczaDEzLjg5MzF2My4yNDczaC00Ljk5NTV2MTUuMTU1N00yMzkuMjE2IDEzNS44NTFsMy44MzgtNy41NzcyaDQuMjAzOGwtNi4xMDM3IDExLjI0MDZ2Ny4xNjI0aC0zLjg3NjJWMTM5LjY0bC02LjEwMy0xMS4zNjYyaDQuMjI4M2wzLjgxMjggNy41NzcyTTI2My41NDIgMTMyLjQxNDJjMC0uNDQ0My0uMTUwNi0uNzk1Mi0uNDUzLTEuMDUxMi0uMzAxOC0uMjU1NS0uNjkxNC0uMzgzNS0xLjE3MDEtLjM4MzUtLjU2MjkgMC0xLjAwNTIuMTM0My0xLjMyNzcuNDAyMy0uMzIzMS4yNjk5LS40ODUuNjUwOC0uNDg1IDEuMTQ2IDAgLjczODcuMzk5IDEuNTUzNCAxLjE5NTMgMi40NDIuNzIyMS0uNDAyMiAxLjI3NTUtLjc5OTUgMS42NjItMS4xODk5LjM4NTMtLjM4OTcuNTc4NS0uODQ1NC41Nzg1LTEuMzY1N3ptLTQuNTE3NSA4LjkyNTNjMCAuNzIxOC4yNzA0IDEuMjk3My44MTEzIDEuNzI0Ny41NDE1LjQyOCAxLjIzNTQuNjQyIDIuMDgzLjY0MiAxLjA1NjYgMCAyLjAwOS0uMjU2IDIuODU3NC0uNzY3NWwtNC4xNzkzLTQuMTU0MmMtLjQ4NjMuMzY5LS44NzAzLjc1NS0xLjE1MTQgMS4xNTgtLjI4MS40MDIzLS40MjEuODY4LS40MjEgMS4zOTd6bTE0LjI1NzcgNS4zMzczaC00Ljc0NGwtMS40NDgtMS40MjI4Yy0xLjYwMiAxLjExNzEtMy40MTQgMS42NzQ1LTUuNDM2MSAxLjY3NDUtMi4wNDY3IDAtMy42NzA1LS40NzAxLTQuODcwMS0xLjQxMDMtMS4xOTk3LS45MzktMS43OTk1LTIuMjA5OC0xLjc5OTUtMy44MTQgMC0xLjE0OTguMjU0MS0yLjEyODkuNzYxMS0yLjkzODUuNTA4Mi0uODEwMyAxLjM3ODUtMS41Njc4IDIuNjEyLTIuMjczMi0uNjI5My0uNzIxMi0xLjA4NjctMS40MTE1LTEuMzcxNi0yLjA3MDUtLjI4Ni0uNjU4NC0uNDI4NS0xLjM3ODMtLjQyODUtMi4xNTg0IDAtMS4yNzYuNDg4OC0yLjMwMzMgMS40NjYzLTMuMDg0MS45NzY5LS43ODA4IDIuMjgzOC0xLjE3MTEgMy45MjAxLTEuMTcxMSAxLjU1OTggMCAyLjgwODQuMzYzNCAzLjc0NCAxLjA4ODkuOTM1NC43MjU1IDEuNDAyMiAxLjY5NyAxLjQwMjIgMi45MTQ2IDAgLjk5ODYtLjI4ODYgMS45MTExLS44Njc3IDIuNzM3Ny0uNTc5MS44MjY2LTEuNTE0NiAxLjYxMzYtMi44MDU5IDIuMzYwNGwzLjU3MzggMy40ODdjLjU5NTUtLjk4MTUgMS4xMTEyLTIuMjQ1IDEuNTQ4LTMuNzg5NWg0LjAwMjNjLS4zMDMgMS4xMzM1LS43MTc4IDIuMjM5NC0xLjI0NjcgMy4zMTc2LS41MjkgMS4wNzgyLTEuMTI4MSAyLjAzMjgtMS43OTk1IDIuODYzMmwzLjc4NzggMy42ODg1ek0yODkuMzkwMSAxNDYuNjc2OGgtMy45VjEzMS41MjFoLTQuOTk2M3YtMy4yNDczaDEzLjg5MjV2My4yNDczaC00Ljk5NjJ2MTUuMTU1N00zMTIuMjk0NCAxNDYuNjc2OGgtMy44ODgydi03Ljk0MjVoLTcuMjg3djcuOTQyNWgtMy45MDA3di0xOC40MDNoMy45MDA3djcuMjEyaDcuMjg3di03LjIxMmgzLjg4ODJ2MTguNDAzTTMxNi45MzggMTQ2LjY3NjhoMy45MDEzdi0xOC40MDNoLTMuOTAxNHpNMzI5LjM3MTcgMTM2LjQ0MjNoMS4yNTg2YzEuMjMyOSAwIDIuMTQzOS0uMjA1OSAyLjczMDUtLjYxNTcuNTg4LS40MTE3Ljg4MS0xLjA1ODIuODgxLTEuOTM5NCAwLS44NzMtLjI5OTMtMS40OTM3LS44OTkxLTEuODYyNy0uNjAwNS0uMzY5LTEuNTI5Ny0uNTU0Mi0yLjc4ODMtLjU1NDJoLTEuMTgyN3Y0Ljk3MnptMCAzLjE3MzJ2Ny4wNjEzaC0zLjkwMDd2LTE4LjQwM2g1LjM2MTNjMi40OTkgMCA0LjM0OTMuNDU0NCA1LjU0OTYgMS4zNjUxIDEuMTk5LjkxMDcgMS43OTg4IDIuMjkzMyAxLjc5ODggNC4xNDggMCAxLjA4Mi0uMjk4IDIuMDQ1My0uODkzNCAyLjg4ODItLjU5NDguODQzNS0xLjQzODcgMS41MDQ0LTIuNTI5MiAxLjk4MzMgMi43NjgyIDQuMTM3MiA0LjU3MTUgNi44MDk2IDUuNDExNiA4LjAxODRoLTQuMzI5OWwtNC4zOTItNy4wNjEzaC0yLjA3NjF6TTM1My42OTc2IDEzNy40YzAtMy45NTI3LTEuNzQ1NS01LjkyOTctNS4yMzU4LTUuOTI5N2gtMi4wNzYydjExLjk4MzdoMS42NzRjMy43NTgzIDAgNS42MzgtMi4wMTc4IDUuNjM4LTYuMDU0em00LjA1Mi0uMTAwNGMwIDMuMDI4OS0uODYyMSA1LjM0OTEtMi41ODYzIDYuOTYwMi0xLjcyMzUgMS42MTE3LTQuMjEzOCAyLjQxNy03LjQ2ODMgMi40MTdoLTUuMjEwN3YtMTguNDAzaDUuNzc2N2MzLjAwMjkgMCA1LjMzNTYuNzkxNSA2Ljk5NyAyLjM3ODcgMS42NjA5IDEuNTg2IDIuNDkxNiAzLjgwMTUgMi40OTE2IDYuNjQ3ek0zNjAuMDE1MiAxNDEuMzM5NWg2Ljc1NzR2LTMuMTQ2OGgtNi43NTc0ek0zNzMuNzU3NyAxMzYuOTM0M2gxLjI4MzFjMS4yMDAzIDAgMi4wOTgyLS4yMzcyIDIuNjkzLS43MTE3LjU5Ni0uNDczOS44OTQtMS4xNjQ5Ljg5NC0yLjA3MTEgMC0uOTEzOC0uMjQ5Ny0xLjU4OTgtLjc0OTEtMi4wMjcyLS40OTk0LS40MzU2LTEuMjgxOC0uNjU0LTIuMzQ3Mi0uNjU0aC0xLjc3Mzh2NS40NjR6bTguODA5MS0yLjkyMTVjMCAxLjk4MTMtLjYxOTIgMy40OTY0LTEuODU2NSA0LjU0NTItMS4yMzg2IDEuMDQ4LTIuOTk2NiAxLjU3MjgtNS4yNzk4IDEuNTcyOGgtMS42NzI4djYuNTQ2aC0zLjkwMjZ2LTE4LjQwM2g1Ljg3NzhjMi4yMzE3IDAgMy45MjgzLjQ3OTUgNS4wOTEgMS40NDA0IDEuMTYxMy45NjE1IDEuNzQzIDIuMzkzNyAxLjc0MyA0LjI5ODZ6TTM5NS4wMzc2IDEzOS4wMjM2Yy0xLjIzMy0zLjk3MDMtMS45Mjc1LTYuMjE1Mi0yLjA4MjUtNi43MzQ5LS4xNTU2LS41MjAzLS4yNjYtLjkzMTQtLjMzNDQtMS4yMzM5LS4yNzYgMS4wNzQ1LTEuMDY5MSAzLjczMTItMi4zNzggNy45Njg4aDQuNzk0OXptMi4yNjUgNy42NTMybC0xLjMzNC00LjM4MDFoLTYuNzA2NWwtMS4zMzQ1IDQuMzhoLTQuMjAyNWw2LjQ5MjYtMTguNDc4OGg0Ljc2OTdsNi41MTgzIDE4LjQ3ODloLTQuMjAzMXpNNDA3LjcyMjkgMTM2LjQ0MjNoMS4yNThjMS4yMzM1IDAgMi4xNDM5LS4yMDU5IDIuNzMxMi0uNjE1Ny41ODc5LS40MTE3Ljg4MDktMS4wNTgyLjg4MDktMS45Mzk0IDAtLjg3My0uMjk5My0xLjQ5MzctLjg5OTEtMS44NjI3LS42MDA1LS4zNjktMS41Mjk3LS41NTQyLTIuNzg4My0uNTU0MmgtMS4xODI3djQuOTcyem0wIDMuMTczMnY3LjA2MTNoLTMuOTAwN3YtMTguNDAzaDUuMzYxM2MyLjQ5OSAwIDQuMzQ5NC40NTQ0IDUuNTQ5IDEuMzY1MSAxLjE5OTYuOTEwNyAxLjc5OTUgMi4yOTMzIDEuNzk5NSA0LjE0OCAwIDEuMDgyLS4yOTggMi4wNDUzLS44OTM1IDIuODg4Mi0uNTk0OC44NDM1LTEuNDM4NyAxLjUwNDQtMi41MjkxIDEuOTgzMyAyLjc2ODIgNC4xMzcyIDQuNTcxNCA2LjgwOTYgNS40MTE1IDguMDE4NGgtNC4zMjk5bC00LjM5Mi03LjA2MTNoLTIuMDc2MXpNNDI3LjkzMzYgMTQ2LjY3NjhoLTMuOTAwN1YxMzEuNTIxaC00Ljk5NjJ2LTMuMjQ3M2gxMy44OTI0djMuMjQ3M2gtNC45OTU1djE1LjE1NTdNNDQxLjQ4NjYgMTM1Ljg1MWwzLjgzODYtNy41NzcyaDQuMjAzOGwtNi4xMDM2IDExLjI0MDZ2Ny4xNjI0aC0zLjg3NjlWMTM5LjY0bC02LjEwMjQtMTEuMzY2Mmg0LjIyODNsMy44MTIyIDcuNTc3Mk00NjIuNDQwMiAxMzYuNDQyM2gxLjI1OGMxLjIzMzUgMCAyLjE0MzktLjIwNTkgMi43MzE4LS42MTU3LjU4NjYtLjQxMTcuODgwMy0xLjA1ODIuODgwMy0xLjkzOTQgMC0uODczLS4yOTkzLTEuNDkzNy0uODk5MS0xLjg2MjctLjYwMDUtLjM2OS0xLjUyOS0uNTU0Mi0yLjc4NzctLjU1NDJoLTEuMTgzM3Y0Ljk3MnptMCAzLjE3MzJ2Ny4wNjEzaC0zLjkwMTR2LTE4LjQwM2g1LjM2MTRjMi41MDAzIDAgNC4zNS40NTQ0IDUuNTUwMiAxLjM2NTEgMS4xOTkuOTEwNyAxLjc5OTUgMi4yOTMzIDEuNzk5NSA0LjE0OCAwIDEuMDgyLS4yOTggMi4wNDUzLS44OTM1IDIuODg4Mi0uNTk2Ljg0MzUtMS40MzkzIDEuNTA0NC0yLjUyOTEgMS45ODMzIDIuNzY4MiA0LjEzNzIgNC41NzE0IDYuODA5NiA1LjQxMDMgOC4wMTg0aC00LjMyODZsLTQuMzkyLTcuMDYxM2gtMi4wNzY4ek00NzUuNTUzNCAxNDYuNjc2OGgzLjkwMDd2LTE4LjQwM2gtMy45MDA3ek00OTQuOTQ2IDE0MS41NjU1YzAgMS42NjI1LS41OTc0IDIuOTcxNy0xLjc5MjYgMy45MjgyLTEuMTk1OS45NTY1LTIuODU5MiAxLjQzNDgtNC45OTA2IDEuNDM0OC0xLjk2MjYgMC0zLjctLjM2OS01LjIwOTUtMS4xMDcydi0zLjYyNjNjMS4yNDEuNTU0MiAyLjI5MjYuOTQ0NSAzLjE1MjIgMS4xNzE3Ljg1OTYuMjI2NiAxLjY0NjQuMzM5NiAyLjM1OTcuMzM5Ni44NTUyIDAgMS41MTE1LS4xNjM4IDEuOTY5NS0uNDkxNC40NTc0LS4zMjY0LjY4NTgtLjgxMzQuNjg1OC0xLjQ1OTkgMC0uMzYwOS0uMTAwNC0uNjgxNi0uMzAyNC0uOTYzNC0uMjAwOC0uMjgwNS0uNDk2My0uNTUxNi0uODg3Mi0uODEyMS0uMzg5Ni0uMjU5Mi0xLjE4NTItLjY3NDctMi4zODQ4LTEuMjQ1Mi0xLjEyNDQtLjUyOS0xLjk2Ny0xLjAzNjgtMi41Mjg2LTEuNTIzOC0uNTYyOC0uNDg1OC0xLjAxMDgtMS4wNTMyLTEuMzQ3LTEuNjk5LS4zMzU3LS42NDY0LS41MDMzLTEuNDAxNS0uNTAzMy0yLjI2NTcgMC0xLjYyOC41NTEtMi45MDg0IDEuNjU0Ni0zLjg0MDQgMS4xMDMtLjkzMTMgMi42MjgzLTEuMzk3IDQuNTc0NS0xLjM5Ny45NTYyIDAgMS44NjkxLjExNDIgMi43MzY5LjM0MDEuODY5LjIyNiAxLjc3NjIuNTQ1NCAyLjcyNDkuOTU2NWwtMS4yNTg2IDMuMDM0Yy0uOTgyLS40MDI0LTEuNzkzOC0uNjgzNi0yLjQzNS0uODQzLS42NDItLjE1OTQtMS4yNzMxLS4yMzkxLTEuODk0My0uMjM5MS0uNzM3OCAwLTEuMzAzOC4xNzEzLTEuNjk4NC41MTU5LS4zOTQ3LjM0NC0uNTkxNy43OTMzLS41OTE3IDEuMzQ2MiAwIC4zNDQ2LjA3OTcuNjQ0Ni4yMzkuOTAwNy4xNTk0LjI1Ni40MTM1LjUwNC43NjE4Ljc0My4zNDc2LjIzOCAxLjE3Mi42NjkxIDIuNDcyNyAxLjI4OTggMS43MTkxLjgyMjggMi44OTg3IDEuNjQ2OSAzLjUzNjEgMi40NzM0LjYzNjkuODI2Ni45NTYyIDEuODQwMi45NTYyIDMuMDM5NiIvPgogICAgPGc+CiAgICAgIDxtYXNrIGlkPSJkIiBmaWxsPSIjZmZmIj4KICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNjIi8+CiAgICAgIDwvbWFzaz4KICAgICAgPHBhdGggZmlsbD0iIzVBNUI1RCIgZD0iTTUxMy4wODA1IDE0Ni42NzY4aC00LjQyOTdsLTQuODE5OS03Ljc1NDItMS42NDk1IDEuMTgzN3Y2LjU3MDVoLTMuOXYtMTguNDAzaDMuOXY4LjQyMDhsMS41MzcyLTIuMTY0NyA0Ljk4MjQtNi4yNTZoNC4zMjkzbC02LjQxODYgOC4xNDMzIDYuNDY4OCAxMC4yNTk2IiBtYXNrPSJ1cmwoI2QpIi8+CiAgICAgIDxwYXRoIGZpbGw9IiM2Q0MwNEEiIGQ9Ik00MC41NzcgNzkuODkxNmMtOS4wOTg0IDAtMTYuMTE0OS0yLjkxOS0yMC44NTU3LTguNjczNi00Ljc4OC01LjgwOTgtNy4yMTQ4LTE0LjUxNDItNy4yMTQ4LTI1Ljg3MjggMC0xMS4yMDA0IDIuNDI3NS0xOS44MjU3IDcuMjE0OC0yNS42MzY4IDQuNzQxNS01Ljc1NTMgMTEuNzk4MS04LjY3MyAyMC45NzMtOC42NzMgOS4xMzE2IDAgMTYuMTA3MyAyLjg5NTggMjAuNzMyNyA4LjYwNzcgNC42NzM3IDUuNzc0NyA3LjA0NDEgMTQuNDIyIDcuMDQ0MSAyNS43MDIgMCAxMS4zOTgyLTIuMzgwNCAyMC4xMTUyLTcuMDczIDI1LjkwODctNC42NDQ4IDUuNzMxMy0xMS42NSA4LjYzNzgtMjAuODIxMSA4LjYzNzh6TTQwLjY5NDMuMTcxM2MtMTIuOTIxOSAwLTIzLjA0OTggMy45OTQ4LTMwLjEwNDYgMTEuODcyNkMzLjU2MjUgMTkuODkxNiAwIDMxLjA1NTYgMCA0NS4yMjhjMCAxNC4yODc2IDMuNTUyNSAyNS41MzA3IDEwLjU1ODMgMzMuNDE2NyA3LjAzNDEgNy45MTg2IDE3LjEzMzggMTEuOTM0IDMwLjAxODcgMTEuOTM0IDEyLjYxMDYgMCAyMi42MTI0LTQuMDg1NyAyOS43MjYyLTEyLjE0MjQgNy4wODI0LTguMDIyOCAxMC42NzM4LTE5LjE1NiAxMC42NzM4LTMzLjA5MSAwLTEzLjk3MzItMy41ODEzLTI1LjEwNjUtMTAuNjQ1NS0zMy4wOTFDNjMuMjM3OCA0LjIzNjQgNTMuMjY2LjE3MTMgNDAuNjk0My4xNzEzeiIgbWFzaz0idXJsKCNkKSIvPgogICAgPC9nPgogICAgPHBhdGggZmlsbD0iIzZDQzA0QSIgZD0iTTEyOC4xNDgyIDIxLjg2NDljLTQuNTUyIDAtOC43NDcuOTEyNS0xMi40NjgyIDIuNzEyNS0zLjIwMDUgMS41NDgzLTUuODI1NyAzLjY2OS03LjgyMzQgNi4zMTYzbC0xLjQxMy03Ljg1MjdoLTkuNzAzMXY2Ni4zNjE1aDExLjY4MzN2LTM0Ljc2OGMwLTguMTEyIDEuNTAzMy0xMy45NzI2IDQuNDY4NS0xNy40MiAyLjkyODItMy40MDU1IDcuNjY2LTUuMTMyIDE0LjA4MDEtNS4xMzIgNC43OTA0IDAgOC4zMjkxIDEuMjAxMiAxMC41MTgyIDMuNTcwNCAyLjIwOTIgMi4zOTEyIDMuMzI5OCA2LjEyNzQgMy4zMjk4IDExLjEwMzh2NDIuNjQ1OGgxMS42ODI3VjQ2LjQwNGMwLTguNDY1My0yLjA3NzQtMTQuNzQyLTYuMTc1Mi0xOC42NTc4LTQuMDg2NC0zLjkwMjUtMTAuMjAyNi01Ljg4MTMtMTguMTc5Ny01Ljg4MTNNMTk2LjE0ODggMzEuOTY0NGM0LjgzOCAwIDguNDQxNCAxLjQ5MzEgMTEuMDE1NyA0LjU2NCAyLjQzODIgMi45MTAzIDMuNzQwOCA3LjEzMTYgMy44NzcgMTIuNTU2N2gtMzEuNjI5M2MuNjM1Ni01LjIyMDUgMi4zNDEtOS4zODEgNS4wNzY1LTEyLjM3ODQgMi45MTEzLTMuMTkwOCA2LjcyNTQtNC43NDIzIDExLjY2MDEtNC43NDIzem0uMTE3My0xMC4wOTk1Yy04Ljg3ODcgMC0xNi4wNTc3IDMuMjAyLTIxLjMzODggOS41MTcxLTUuMjM4NCA2LjI2MzYtNy44OTQ5IDE0Ljc5OTItNy44OTQ5IDI1LjM2ODggMCAxMC41MTY0IDIuODY3NCAxOC44Njg3IDguNTIyNCAyNC44MjU0IDUuNjY3NSA1Ljk3MzYgMTMuNDg1OSA5LjAwMjUgMjMuMjM4NiA5LjAwMjUgNC4zOTU4IDAgOC4yMDk5LS4zMzMzIDExLjMzNTctLjk5MSAzLjEyNjUtLjY1NzIgNi40ODA3LTEuNzU0OSA5Ljk2OTItMy4yNjE4bC41ODE2LS4yNTFWNzUuMjc5M2wtMS4zNDIuNTc0M2MtNi42MjUgMi44MzU1LTEzLjQxODggNC4yNzM0LTIwLjE5MTkgNC4yNzM0LTYuMjczIDAtMTEuMTg1OC0xLjg3NC0xNC42MDM0LTUuNTcwMS0zLjI4NjQtMy41NTM2LTUuMTE0MS04LjgwMS01LjQzNzktMTUuNjA3NWg0NC4zMzc4di03LjEzNjZjMC04LjkwMjEtMi40NTQ1LTE2LjE4ODctNy4yOTUtMjEuNjU3Mi00Ljg3MDgtNS41MDEtMTEuNTU5OC04LjI5MDctMTkuODgxNC04LjI5MDd6TTIyOC44NjIyIDEyLjMyODJoMjcuMjExNXY3Ny4wNzQzaDExLjkxODZWMTIuMzI4MmgyNy4yMTE2VjEuNTIzMmgtNjYuMzQxN3YxMC44MDVNMzM1LjA4ODIgMjEuODY0OWMtNC4yMTIgMC04LjEzMDkgMS4yMDI1LTExLjY0NyAzLjU3NDgtMi45NjY1IDIuMDAxNS01LjU5MDQgNC43NDg2LTcuODE5NiA4LjE4NDFsLS45OTA3LTEwLjU4MjhoLTkuODkyN3Y2Ni4zNjE1aDExLjY4MzRWNTMuODcwMWMwLTYuMDQwOCAxLjc4ODgtMTEuMTQ3NyA1LjMxNTUtMTUuMTgwMSAzLjU0MzEtNC4wNTA3IDcuNjgwNC02LjAyMDEgMTIuNjQ1Mi02LjAyMDEgMS45NTc2IDAgNC4yNjE1LjI4OTMgNi44NDUyLjg1OThsMS4wMDgzLjIyMjIgMS42Mzk1LTEwLjk3Ny0uODkyOS0uMTgzOWMtMi4zMjctLjQ4MTQtNC45ODMtLjcyNjEtNy44OTQyLS43MjYxTTM5Ny4zMDUgNTcuODY4NmMwIDguMDc1LTEuNDk1NyAxMy45MzgtNC40NDQ2IDE3LjQyNTgtMi45MDg4IDMuNDQwNS03LjYzNDUgNS4xODQ3LTE0LjA0NjIgNS4xODQ3LTQuNzg5MiAwLTguMzI4NS0xLjIwMTktMTAuNTE3Ni0zLjU3MDUtMi4yMDkyLTIuMzktMy4zMjg1LTYuMTI2Mi0zLjMyODUtMTEuMTAzOFYyMy4wNDFoLTExLjgwMTl2NDMuMTE2NWMwIDguNDI3NiAyLjA2OCAxNC42NzUgNi4xNDYzIDE4LjU2OTMgNC4wNjQ1IDMuODgyNCAxMC4yMTE0IDUuODUxOSAxOC4yNjg4IDUuODUxOSA0LjY2NSAwIDguODg4MS0uODgxOCAxMi41NDkyLTIuNjIxNiAzLjE2NTMtMS41MDM4IDUuNzcxNy0zLjYwNjkgNy43NjU2LTYuMjYyM2wxLjI1NzQgNy43MDc3aDkuODM1VjIzLjA0MUgzOTcuMzA1djM0LjgyNzZNNDUxLjA5IDUwLjkwOTZjLTUuNDkxOC0yLjA0OTgtOS4yNDM5LTMuNjMxNC0xMS4xNTEyLTQuNzAwMi0xLjgyNTgtMS4wMjE3LTMuMTU1NC0yLjA5NjItMy45NTIyLTMuMTk0LS43NjU1LTEuMDU1Ni0xLjEzODItMi4zMTItMS4xMzgyLTMuODQyOCAwLTIuMjA5MiAxLjAwNC0zLjkwMjUgMy4wNjg4LTUuMTc2IDIuMTg2Ni0xLjM0OCA1LjUzNjQtMi4wMzIyIDkuOTU2LTIuMDMyMiA1LjA5ODUgMCAxMC44ODcxIDEuMzIwNSAxNy4yMDY2IDMuOTI1MWwuODcxNS4zNTk3IDQuMjM0NS05LjY5My0uODk0MS0uMzgwOWMtNi43MTE2LTIuODYtMTMuNjc5OC00LjMxMDQtMjAuNzEyNi00LjMxMDQtNy42MTM5IDAtMTMuNzE0MyAxLjU5MjgtMTguMTMyIDQuNzM0Ny00LjUyIDMuMjE0Ni02LjgxMTQgNy42NjI1LTYuODExNCAxMy4yMTk0IDAgMy4wOTg2LjY2NjMgNS44MTM2IDEuOTgyIDguMDcgMS4zMDQ1IDIuMjM2NyAzLjMwNDcgNC4yNTI2IDUuOTQ1IDUuOTkyNCAyLjU3NDIgMS42OTc3IDYuOTQwNSAzLjY5OTEgMTIuOTY3NiA1Ljk0NDggNi4xODI2IDIuMzgyNCAxMC4zNzUxIDQuNDU2NiAxMi40NTg4IDYuMTY1IDEuOTU3NiAxLjYwNiAyLjkwOTQgMy40NjgyIDIuOTA5NCA1LjY5MjUgMCAyLjk5My0xLjE5MTUgNS4xNTUyLTMuNjQxNiA2LjYwODEtMi41Nzk0IDEuNTMwMi02LjM2OSAyLjMwNTMtMTEuMjYzNiAyLjMwNTMtMy4xOTggMC02LjU2ODUtLjQ0NDQtMTAuMDE4Ny0xLjMyMy0zLjQ2MS0uODc5My02Ljc0NjgtMi4xMDA3LTkuNzYzNC0zLjYyOTVsLTEuMzk5Mi0uNzA4djExLjE4NDFsLjQ4ODguMjc2OGM0LjkwNDYgMi43NzQ3IDExLjc4NjggNC4xODEyIDIwLjQ1NzIgNC4xODEyIDguMjQzMiAwIDE0Ljc2MTUtMS43MDQ2IDE5LjM3NDQtNS4wNjQzIDQuNzA4OC0zLjQyOTMgNy4wOTY4LTguMzU5MiA3LjA5NjgtMTQuNjUzNSAwLTQuNTA3Ni0xLjQ0MzctOC4zMTA5LTQuMjkxLTExLjMwNTktMi44MTQtMi45NTgtOC4wMDAzLTUuNzg2Ni0xNS44NDgyLTguNjQ1NE01MTUuNDg2IDc5LjQ1OTJjLS45MDAzLjI2My0yLjE0NTIuNTIxLTMuNzAyNC43NjctMS41NDQ4LjI0NjYtMy4xNzM2LjM3MDktNC44NDM4LjM3MDktMi45NTIgMC01LjE5NjMtLjkxMjYtNi44NjA5LTIuNzkxNy0xLjY3Mi0xLjg4NDctMi41MTk3LTQuNjc2My0yLjUxOTctOC4yOTdWMzIuNTUyNWgxOC42ODk4VjIzLjA0MWgtMTguNjg5OFY4LjEwODJoLTcuMzIzNGwtNC4xOTE4IDE0LjAxNzctOS4zOTUxIDQuMTMwNHY2LjI5NjJoOS4yMjd2MzcuMzY3NmMwIDEzLjcwODQgNi42MTI0IDIwLjY1ODYgMTkuNjUyOCAyMC42NTg2IDEuNjgzNCAwIDMuNjA0LS4xNzIgNS43MDg0LS41MTE1IDIuMTcyOC0uMzUzNCAzLjc4NzgtLjc5MzQgNC45MzY2LTEuMzQ3NWwuNTQ1Mi0uMjYzdi05LjM1NjVsLTEuMjMyOS4zNTkiLz4KICA8L2c+Cjwvc3ZnPgo=\");background-position:center;background-size:contain;background-repeat:no-repeat}#onetrust-pc-sdk .ot-tooltip .ot-tooltiptext{visibility:hidden;width:120px;background-color:#555;color:#fff;text-align:center;padding:5px 0;border-radius:6px;position:absolute;z-index:1;bottom:125%;right:50%;margin-right:-60px;opacity:0;transition:opacity 0.3s}#onetrust-pc-sdk .ot-tooltip .ot-tooltiptext::after{content:\"\";position:absolute;top:100%;right:50%;margin-right:-5px;border-width:5px;border-style:solid;border-color:#555 transparent transparent transparent}#onetrust-pc-sdk .ot-tooltip:hover .ot-tooltiptext{visibility:visible;opacity:1}#onetrust-pc-sdk .ot-tooltip{position:relative;display:inline-block;z-index:3}#onetrust-pc-sdk .ot-tooltip svg{color:grey;height:20px;width:20px}#onetrust-pc-sdk.ot-fade-in,.onetrust-pc-dark-filter.ot-fade-in{animation-name:onetrust-fade-in;animation-duration:400ms;animation-timing-function:ease-in-out}#onetrust-pc-sdk.hide{display:none !important}.onetrust-pc-dark-filter.hide{display:none !important}#ot-sdk-btn.ot-sdk-show-settings,#ot-sdk-btn.optanon-show-settings{color:#68b631;border:1px solid #68b631;height:auto;white-space:normal;word-wrap:break-word;padding:0.8em 2em;font-size:0.8em;line-height:1.2;cursor:pointer;-moz-transition:0.1s ease;-o-transition:0.1s ease;-webkit-transition:1s ease;transition:0.1s ease}#ot-sdk-btn.ot-sdk-show-settings:hover,#ot-sdk-btn.optanon-show-settings:hover{color:#fff;background-color:#68b631}#ot-sdk-btn.ot-sdk-show-settings:focus,#ot-sdk-btn.optanon-show-settings:focus{outline:none}.onetrust-pc-dark-filter{background:rgba(0,0,0,0.5);z-index:2147483646;width:100%;height:100%;overflow:hidden;position:fixed;top:0;bottom:0;right:0}@keyframes onetrust-fade-in{0%{opacity:0}100%{opacity:1}}@media only screen and (min-width: 426px) and (max-width: 896px) and (orientation: landscape){#onetrust-pc-sdk p{font-size:0.75em}}\n#onetrust-banner-sdk,#onetrust-pc-sdk,#ot-sdk-cookie-policy{font-size:16px}#onetrust-banner-sdk *,#onetrust-banner-sdk ::after,#onetrust-banner-sdk ::before,#onetrust-pc-sdk *,#onetrust-pc-sdk ::after,#onetrust-pc-sdk ::before,#ot-sdk-cookie-policy *,#ot-sdk-cookie-policy ::after,#ot-sdk-cookie-policy ::before{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}#onetrust-banner-sdk div,#onetrust-banner-sdk span,#onetrust-banner-sdk h1,#onetrust-banner-sdk h2,#onetrust-banner-sdk h3,#onetrust-banner-sdk h4,#onetrust-banner-sdk h5,#onetrust-banner-sdk h6,#onetrust-banner-sdk p,#onetrust-banner-sdk img,#onetrust-banner-sdk svg,#onetrust-banner-sdk button,#onetrust-banner-sdk section,#onetrust-banner-sdk a,#onetrust-banner-sdk label,#onetrust-banner-sdk input,#onetrust-banner-sdk ul,#onetrust-banner-sdk li,#onetrust-banner-sdk nav,#onetrust-banner-sdk table,#onetrust-banner-sdk thead,#onetrust-banner-sdk tr,#onetrust-banner-sdk td,#onetrust-banner-sdk tbody,#onetrust-banner-sdk .main-content,#onetrust-banner-sdk .toggle,#onetrust-banner-sdk #content,#onetrust-banner-sdk .checkbox,#onetrust-pc-sdk div,#onetrust-pc-sdk span,#onetrust-pc-sdk h1,#onetrust-pc-sdk h2,#onetrust-pc-sdk h3,#onetrust-pc-sdk h4,#onetrust-pc-sdk h5,#onetrust-pc-sdk h6,#onetrust-pc-sdk p,#onetrust-pc-sdk img,#onetrust-pc-sdk svg,#onetrust-pc-sdk button,#onetrust-pc-sdk section,#onetrust-pc-sdk a,#onetrust-pc-sdk label,#onetrust-pc-sdk input,#onetrust-pc-sdk ul,#onetrust-pc-sdk li,#onetrust-pc-sdk nav,#onetrust-pc-sdk table,#onetrust-pc-sdk thead,#onetrust-pc-sdk tr,#onetrust-pc-sdk td,#onetrust-pc-sdk tbody,#onetrust-pc-sdk .main-content,#onetrust-pc-sdk .toggle,#onetrust-pc-sdk #content,#onetrust-pc-sdk .checkbox,#ot-sdk-cookie-policy div,#ot-sdk-cookie-policy span,#ot-sdk-cookie-policy h1,#ot-sdk-cookie-policy h2,#ot-sdk-cookie-policy h3,#ot-sdk-cookie-policy h4,#ot-sdk-cookie-policy h5,#ot-sdk-cookie-policy h6,#ot-sdk-cookie-policy p,#ot-sdk-cookie-policy img,#ot-sdk-cookie-policy svg,#ot-sdk-cookie-policy button,#ot-sdk-cookie-policy section,#ot-sdk-cookie-policy a,#ot-sdk-cookie-policy label,#ot-sdk-cookie-policy input,#ot-sdk-cookie-policy ul,#ot-sdk-cookie-policy li,#ot-sdk-cookie-policy nav,#ot-sdk-cookie-policy table,#ot-sdk-cookie-policy thead,#ot-sdk-cookie-policy tr,#ot-sdk-cookie-policy td,#ot-sdk-cookie-policy tbody,#ot-sdk-cookie-policy .main-content,#ot-sdk-cookie-policy .toggle,#ot-sdk-cookie-policy #content,#ot-sdk-cookie-policy .checkbox{font-family:inherit;font-size:initial;font-weight:normal;-webkit-font-smoothing:auto;letter-spacing:normal;line-height:normal;padding:0;margin:0;height:auto;min-height:0;max-height:none;width:auto;min-width:0;max-width:none;border-radius:0;border:none;clear:none;float:none;position:static;bottom:auto;right:auto;left:auto;top:auto;text-align:right;text-decoration:none;text-indent:0;text-shadow:none;text-transform:none;white-space:normal;background:none;overflow:visible;vertical-align:baseline;visibility:visible;z-index:auto;box-shadow:none}#onetrust-banner-sdk label:before,#onetrust-banner-sdk label:after,#onetrust-banner-sdk .checkbox:after,#onetrust-banner-sdk .checkbox:before,#onetrust-pc-sdk label:before,#onetrust-pc-sdk label:after,#onetrust-pc-sdk .checkbox:after,#onetrust-pc-sdk .checkbox:before,#ot-sdk-cookie-policy label:before,#ot-sdk-cookie-policy label:after,#ot-sdk-cookie-policy .checkbox:after,#ot-sdk-cookie-policy .checkbox:before{content:\"\";content:none}\n#onetrust-banner-sdk .ot-sdk-container,#onetrust-pc-sdk .ot-sdk-container,#ot-sdk-cookie-policy .ot-sdk-container{position:relative;width:100%;max-width:100%;margin:0 auto;padding:0 20px;box-sizing:border-box}#onetrust-banner-sdk .ot-sdk-column,#onetrust-banner-sdk .ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-column,#onetrust-pc-sdk .ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-columns{width:100%;float:right;box-sizing:border-box;padding:0;display:initial}@media (min-width: 400px){#onetrust-banner-sdk .ot-sdk-container,#onetrust-pc-sdk .ot-sdk-container,#ot-sdk-cookie-policy .ot-sdk-container{width:90%;padding:0}}@media (min-width: 550px){#onetrust-banner-sdk .ot-sdk-container,#onetrust-pc-sdk .ot-sdk-container,#ot-sdk-cookie-policy .ot-sdk-container{width:100%}#onetrust-banner-sdk .ot-sdk-column,#onetrust-banner-sdk .ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-column,#onetrust-pc-sdk .ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-columns{margin-right:4%}#onetrust-banner-sdk .ot-sdk-column:first-child,#onetrust-banner-sdk .ot-sdk-columns:first-child,#onetrust-pc-sdk .ot-sdk-column:first-child,#onetrust-pc-sdk .ot-sdk-columns:first-child,#ot-sdk-cookie-policy .ot-sdk-column:first-child,#ot-sdk-cookie-policy .ot-sdk-columns:first-child{margin-right:0}#onetrust-banner-sdk .ot-sdk-one.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-one.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-one.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-one.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-one.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-one.ot-sdk-columns{width:4.66666666667%}#onetrust-banner-sdk .ot-sdk-two.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-two.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-two.ot-sdk-columns{width:13.3333333333%}#onetrust-banner-sdk .ot-sdk-three.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-three.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-three.ot-sdk-columns{width:22%}#onetrust-banner-sdk .ot-sdk-four.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-four.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-four.ot-sdk-columns{width:30.6666666667%}#onetrust-banner-sdk .ot-sdk-five.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-five.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-five.ot-sdk-columns{width:39.3333333333%}#onetrust-banner-sdk .ot-sdk-six.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-six.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-six.ot-sdk-columns{width:48%}#onetrust-banner-sdk .ot-sdk-seven.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-seven.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-seven.ot-sdk-columns{width:56.6666666667%}#onetrust-banner-sdk .ot-sdk-eight.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-eight.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-eight.ot-sdk-columns{width:65.3333333333%}#onetrust-banner-sdk .ot-sdk-nine.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-nine.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-nine.ot-sdk-columns{width:74%}#onetrust-banner-sdk .ot-sdk-ten.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-ten.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-ten.ot-sdk-columns{width:82.6666666667%}#onetrust-banner-sdk .ot-sdk-eleven.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-eleven.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-eleven.ot-sdk-columns{width:91.3333333333%}#onetrust-banner-sdk .ot-sdk-twelve.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-twelve.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-twelve.ot-sdk-columns{width:100%;margin-right:0}#onetrust-banner-sdk .ot-sdk-one-third.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-one-third.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-one-third.ot-sdk-column{width:30.6666666667%}#onetrust-banner-sdk .ot-sdk-two-thirds.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-two-thirds.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-two-thirds.ot-sdk-column{width:65.3333333333%}#onetrust-banner-sdk .ot-sdk-one-half.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-one-half.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-one-half.ot-sdk-column{width:48%}#onetrust-banner-sdk .ot-sdk-offset-by-one.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-one.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-one.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-one.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-one.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-one.ot-sdk-columns{margin-right:8.66666666667%}#onetrust-banner-sdk .ot-sdk-offset-by-two.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-two.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-two.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-two.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-two.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-two.ot-sdk-columns{margin-right:17.3333333333%}#onetrust-banner-sdk .ot-sdk-offset-by-three.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-three.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-three.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-three.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-three.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-three.ot-sdk-columns{margin-right:26%}#onetrust-banner-sdk .ot-sdk-offset-by-four.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-four.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-four.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-four.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-four.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-four.ot-sdk-columns{margin-right:34.6666666667%}#onetrust-banner-sdk .ot-sdk-offset-by-five.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-five.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-five.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-five.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-five.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-five.ot-sdk-columns{margin-right:43.3333333333%}#onetrust-banner-sdk .ot-sdk-offset-by-six.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-six.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-six.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-six.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-six.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-six.ot-sdk-columns{margin-right:52%}#onetrust-banner-sdk .ot-sdk-offset-by-seven.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-seven.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-seven.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-seven.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-seven.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-seven.ot-sdk-columns{margin-right:60.6666666667%}#onetrust-banner-sdk .ot-sdk-offset-by-eight.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-eight.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-eight.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-eight.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-eight.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-eight.ot-sdk-columns{margin-right:69.3333333333%}#onetrust-banner-sdk .ot-sdk-offset-by-nine.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-nine.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-nine.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-nine.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-nine.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-nine.ot-sdk-columns{margin-right:78%}#onetrust-banner-sdk .ot-sdk-offset-by-ten.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-ten.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-ten.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-ten.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-ten.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-ten.ot-sdk-columns{margin-right:86.6666666667%}#onetrust-banner-sdk .ot-sdk-offset-by-eleven.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-eleven.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-eleven.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-eleven.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-eleven.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-eleven.ot-sdk-columns{margin-right:95.3333333333%}#onetrust-banner-sdk .ot-sdk-offset-by-one-third.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-one-third.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-one-third.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-one-third.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-one-third.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-one-third.ot-sdk-columns{margin-right:34.6666666667%}#onetrust-banner-sdk .ot-sdk-offset-by-two-thirds.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-two-thirds.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-two-thirds.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-two-thirds.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-two-thirds.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-two-thirds.ot-sdk-columns{margin-right:69.3333333333%}#onetrust-banner-sdk .ot-sdk-offset-by-one-half.ot-sdk-column,#onetrust-banner-sdk .ot-sdk-offset-by-one-half.ot-sdk-columns,#onetrust-pc-sdk .ot-sdk-offset-by-one-half.ot-sdk-column,#onetrust-pc-sdk .ot-sdk-offset-by-one-half.ot-sdk-columns,#ot-sdk-cookie-policy .ot-sdk-offset-by-one-half.ot-sdk-column,#ot-sdk-cookie-policy .ot-sdk-offset-by-one-half.ot-sdk-columns{margin-right:52%}}#onetrust-banner-sdk h1,#onetrust-banner-sdk h2,#onetrust-banner-sdk h3,#onetrust-banner-sdk h4,#onetrust-banner-sdk h5,#onetrust-banner-sdk h6,#onetrust-pc-sdk h1,#onetrust-pc-sdk h2,#onetrust-pc-sdk h3,#onetrust-pc-sdk h4,#onetrust-pc-sdk h5,#onetrust-pc-sdk h6,#ot-sdk-cookie-policy h1,#ot-sdk-cookie-policy h2,#ot-sdk-cookie-policy h3,#ot-sdk-cookie-policy h4,#ot-sdk-cookie-policy h5,#ot-sdk-cookie-policy h6{margin-top:0;font-weight:600;font-family:inherit}#onetrust-banner-sdk h1,#onetrust-pc-sdk h1,#ot-sdk-cookie-policy h1{font-size:1.5rem;line-height:1.2}#onetrust-banner-sdk h2,#onetrust-pc-sdk h2,#ot-sdk-cookie-policy h2{font-size:1.5rem;line-height:1.25}#onetrust-banner-sdk h3,#onetrust-pc-sdk h3,#ot-sdk-cookie-policy h3{font-size:1.5rem;line-height:1.3}#onetrust-banner-sdk h4,#onetrust-pc-sdk h4,#ot-sdk-cookie-policy h4{font-size:1.5rem;line-height:1.35}#onetrust-banner-sdk h5,#onetrust-pc-sdk h5,#ot-sdk-cookie-policy h5{font-size:1.5rem;line-height:1.5}#onetrust-banner-sdk h6,#onetrust-pc-sdk h6,#ot-sdk-cookie-policy h6{font-size:1.5rem;line-height:1.6}@media (min-width: 550px){#onetrust-banner-sdk h1,#onetrust-pc-sdk h1,#ot-sdk-cookie-policy h1{font-size:1.5rem}#onetrust-banner-sdk h2,#onetrust-pc-sdk h2,#ot-sdk-cookie-policy h2{font-size:1.5rem}#onetrust-banner-sdk h3,#onetrust-pc-sdk h3,#ot-sdk-cookie-policy h3{font-size:1.5rem}#onetrust-banner-sdk h4,#onetrust-pc-sdk h4,#ot-sdk-cookie-policy h4{font-size:1.5rem}#onetrust-banner-sdk h5,#onetrust-pc-sdk h5,#ot-sdk-cookie-policy h5{font-size:1.5rem}#onetrust-banner-sdk h6,#onetrust-pc-sdk h6,#ot-sdk-cookie-policy h6{font-size:1.5rem}}#onetrust-banner-sdk p,#onetrust-pc-sdk p,#ot-sdk-cookie-policy p{margin:0 0 1em 0;font-family:inherit;line-height:normal}#onetrust-banner-sdk a,#onetrust-pc-sdk a,#ot-sdk-cookie-policy a{color:#565656;text-decoration:underline}#onetrust-banner-sdk a:hover,#onetrust-pc-sdk a:hover,#ot-sdk-cookie-policy a:hover{color:#565656;text-decoration:none}#onetrust-banner-sdk .ot-sdk-button,#onetrust-banner-sdk button,#onetrust-pc-sdk .ot-sdk-button,#onetrust-pc-sdk button,#ot-sdk-cookie-policy .ot-sdk-button,#ot-sdk-cookie-policy button{margin-bottom:1rem;font-family:inherit}#onetrust-banner-sdk .ot-sdk-button,#onetrust-banner-sdk button,#onetrust-banner-sdk input[type=\"submit\"],#onetrust-banner-sdk input[type=\"reset\"],#onetrust-banner-sdk input[type=\"button\"],#onetrust-pc-sdk .ot-sdk-button,#onetrust-pc-sdk button,#onetrust-pc-sdk input[type=\"submit\"],#onetrust-pc-sdk input[type=\"reset\"],#onetrust-pc-sdk input[type=\"button\"],#ot-sdk-cookie-policy .ot-sdk-button,#ot-sdk-cookie-policy button,#ot-sdk-cookie-policy input[type=\"submit\"],#ot-sdk-cookie-policy input[type=\"reset\"],#ot-sdk-cookie-policy input[type=\"button\"]{display:inline-block;height:38px;padding:0 30px;color:#555;text-align:center;font-size:0.9em;font-weight:400;line-height:38px;letter-spacing:0.01em;text-decoration:none;white-space:nowrap;background-color:transparent;border-radius:2px;border:1px solid #bbb;cursor:pointer;box-sizing:border-box}#onetrust-banner-sdk .ot-sdk-button:hover,#onetrust-banner-sdk button:hover,#onetrust-banner-sdk input[type=\"submit\"]:hover,#onetrust-banner-sdk input[type=\"reset\"]:hover,#onetrust-banner-sdk input[type=\"button\"]:hover,#onetrust-banner-sdk .ot-sdk-button:focus,#onetrust-banner-sdk button:focus,#onetrust-banner-sdk input[type=\"submit\"]:focus,#onetrust-banner-sdk input[type=\"reset\"]:focus,#onetrust-banner-sdk input[type=\"button\"]:focus,#onetrust-pc-sdk .ot-sdk-button:hover,#onetrust-pc-sdk button:hover,#onetrust-pc-sdk input[type=\"submit\"]:hover,#onetrust-pc-sdk input[type=\"reset\"]:hover,#onetrust-pc-sdk input[type=\"button\"]:hover,#onetrust-pc-sdk .ot-sdk-button:focus,#onetrust-pc-sdk button:focus,#onetrust-pc-sdk input[type=\"submit\"]:focus,#onetrust-pc-sdk input[type=\"reset\"]:focus,#onetrust-pc-sdk input[type=\"button\"]:focus,#ot-sdk-cookie-policy .ot-sdk-button:hover,#ot-sdk-cookie-policy button:hover,#ot-sdk-cookie-policy input[type=\"submit\"]:hover,#ot-sdk-cookie-policy input[type=\"reset\"]:hover,#ot-sdk-cookie-policy input[type=\"button\"]:hover,#ot-sdk-cookie-policy .ot-sdk-button:focus,#ot-sdk-cookie-policy button:focus,#ot-sdk-cookie-policy input[type=\"submit\"]:focus,#ot-sdk-cookie-policy input[type=\"reset\"]:focus,#ot-sdk-cookie-policy input[type=\"button\"]:focus{color:#333;border-color:#888;outline:0;opacity:0.7}#onetrust-banner-sdk .ot-sdk-button.ot-sdk-button-primary,#onetrust-banner-sdk button.ot-sdk-button-primary,#onetrust-banner-sdk input[type=\"submit\"].ot-sdk-button-primary,#onetrust-banner-sdk input[type=\"reset\"].ot-sdk-button-primary,#onetrust-banner-sdk input[type=\"button\"].ot-sdk-button-primary,#onetrust-pc-sdk .ot-sdk-button.ot-sdk-button-primary,#onetrust-pc-sdk button.ot-sdk-button-primary,#onetrust-pc-sdk input[type=\"submit\"].ot-sdk-button-primary,#onetrust-pc-sdk input[type=\"reset\"].ot-sdk-button-primary,#onetrust-pc-sdk input[type=\"button\"].ot-sdk-button-primary,#ot-sdk-cookie-policy .ot-sdk-button.ot-sdk-button-primary,#ot-sdk-cookie-policy button.ot-sdk-button-primary,#ot-sdk-cookie-policy input[type=\"submit\"].ot-sdk-button-primary,#ot-sdk-cookie-policy input[type=\"reset\"].ot-sdk-button-primary,#ot-sdk-cookie-policy input[type=\"button\"].ot-sdk-button-primary{color:#fff;background-color:#33c3f0;border-color:#33c3f0}#onetrust-banner-sdk .ot-sdk-button.ot-sdk-button-primary:hover,#onetrust-banner-sdk button.ot-sdk-button-primary:hover,#onetrust-banner-sdk input[type=\"submit\"].ot-sdk-button-primary:hover,#onetrust-banner-sdk input[type=\"reset\"].ot-sdk-button-primary:hover,#onetrust-banner-sdk input[type=\"button\"].ot-sdk-button-primary:hover,#onetrust-banner-sdk .ot-sdk-button.ot-sdk-button-primary:focus,#onetrust-banner-sdk button.ot-sdk-button-primary:focus,#onetrust-banner-sdk input[type=\"submit\"].ot-sdk-button-primary:focus,#onetrust-banner-sdk input[type=\"reset\"].ot-sdk-button-primary:focus,#onetrust-banner-sdk input[type=\"button\"].ot-sdk-button-primary:focus,#onetrust-pc-sdk .ot-sdk-button.ot-sdk-button-primary:hover,#onetrust-pc-sdk button.ot-sdk-button-primary:hover,#onetrust-pc-sdk input[type=\"submit\"].ot-sdk-button-primary:hover,#onetrust-pc-sdk input[type=\"reset\"].ot-sdk-button-primary:hover,#onetrust-pc-sdk input[type=\"button\"].ot-sdk-button-primary:hover,#onetrust-pc-sdk .ot-sdk-button.ot-sdk-button-primary:focus,#onetrust-pc-sdk button.ot-sdk-button-primary:focus,#onetrust-pc-sdk input[type=\"submit\"].ot-sdk-button-primary:focus,#onetrust-pc-sdk input[type=\"reset\"].ot-sdk-button-primary:focus,#onetrust-pc-sdk input[type=\"button\"].ot-sdk-button-primary:focus,#ot-sdk-cookie-policy .ot-sdk-button.ot-sdk-button-primary:hover,#ot-sdk-cookie-policy button.ot-sdk-button-primary:hover,#ot-sdk-cookie-policy input[type=\"submit\"].ot-sdk-button-primary:hover,#ot-sdk-cookie-policy input[type=\"reset\"].ot-sdk-button-primary:hover,#ot-sdk-cookie-policy input[type=\"button\"].ot-sdk-button-primary:hover,#ot-sdk-cookie-policy .ot-sdk-button.ot-sdk-button-primary:focus,#ot-sdk-cookie-policy button.ot-sdk-button-primary:focus,#ot-sdk-cookie-policy input[type=\"submit\"].ot-sdk-button-primary:focus,#ot-sdk-cookie-policy input[type=\"reset\"].ot-sdk-button-primary:focus,#ot-sdk-cookie-policy input[type=\"button\"].ot-sdk-button-primary:focus{color:#fff;background-color:#1eaedb;border-color:#1eaedb}#onetrust-banner-sdk input[type=\"email\"],#onetrust-banner-sdk input[type=\"number\"],#onetrust-banner-sdk input[type=\"search\"],#onetrust-banner-sdk input[type=\"text\"],#onetrust-banner-sdk input[type=\"tel\"],#onetrust-banner-sdk input[type=\"url\"],#onetrust-banner-sdk input[type=\"password\"],#onetrust-banner-sdk textarea,#onetrust-banner-sdk select,#onetrust-pc-sdk input[type=\"email\"],#onetrust-pc-sdk input[type=\"number\"],#onetrust-pc-sdk input[type=\"search\"],#onetrust-pc-sdk input[type=\"text\"],#onetrust-pc-sdk input[type=\"tel\"],#onetrust-pc-sdk input[type=\"url\"],#onetrust-pc-sdk input[type=\"password\"],#onetrust-pc-sdk textarea,#onetrust-pc-sdk select,#ot-sdk-cookie-policy input[type=\"email\"],#ot-sdk-cookie-policy input[type=\"number\"],#ot-sdk-cookie-policy input[type=\"search\"],#ot-sdk-cookie-policy input[type=\"text\"],#ot-sdk-cookie-policy input[type=\"tel\"],#ot-sdk-cookie-policy input[type=\"url\"],#ot-sdk-cookie-policy input[type=\"password\"],#ot-sdk-cookie-policy textarea,#ot-sdk-cookie-policy select{height:38px;padding:6px 10px;background-color:#fff;border:1px solid #d1d1d1;border-radius:4px;box-shadow:none;box-sizing:border-box}#onetrust-banner-sdk input[type=\"email\"],#onetrust-banner-sdk input[type=\"number\"],#onetrust-banner-sdk input[type=\"search\"],#onetrust-banner-sdk input[type=\"text\"],#onetrust-banner-sdk input[type=\"tel\"],#onetrust-banner-sdk input[type=\"url\"],#onetrust-banner-sdk input[type=\"password\"],#onetrust-banner-sdk textarea,#onetrust-pc-sdk input[type=\"email\"],#onetrust-pc-sdk input[type=\"number\"],#onetrust-pc-sdk input[type=\"search\"],#onetrust-pc-sdk input[type=\"text\"],#onetrust-pc-sdk input[type=\"tel\"],#onetrust-pc-sdk input[type=\"url\"],#onetrust-pc-sdk input[type=\"password\"],#onetrust-pc-sdk textarea,#ot-sdk-cookie-policy input[type=\"email\"],#ot-sdk-cookie-policy input[type=\"number\"],#ot-sdk-cookie-policy input[type=\"search\"],#ot-sdk-cookie-policy input[type=\"text\"],#ot-sdk-cookie-policy input[type=\"tel\"],#ot-sdk-cookie-policy input[type=\"url\"],#ot-sdk-cookie-policy input[type=\"password\"],#ot-sdk-cookie-policy textarea{-webkit-appearance:none;-moz-appearance:none;appearance:none}#onetrust-banner-sdk textarea,#onetrust-pc-sdk textarea,#ot-sdk-cookie-policy textarea{min-height:65px;padding-top:6px;padding-bottom:6px}#onetrust-banner-sdk input[type=\"email\"]:focus,#onetrust-banner-sdk input[type=\"number\"]:focus,#onetrust-banner-sdk input[type=\"search\"]:focus,#onetrust-banner-sdk input[type=\"text\"]:focus,#onetrust-banner-sdk input[type=\"tel\"]:focus,#onetrust-banner-sdk input[type=\"url\"]:focus,#onetrust-banner-sdk input[type=\"password\"]:focus,#onetrust-banner-sdk textarea:focus,#onetrust-banner-sdk select:focus,#onetrust-pc-sdk input[type=\"email\"]:focus,#onetrust-pc-sdk input[type=\"number\"]:focus,#onetrust-pc-sdk input[type=\"search\"]:focus,#onetrust-pc-sdk input[type=\"text\"]:focus,#onetrust-pc-sdk input[type=\"tel\"]:focus,#onetrust-pc-sdk input[type=\"url\"]:focus,#onetrust-pc-sdk input[type=\"password\"]:focus,#onetrust-pc-sdk textarea:focus,#onetrust-pc-sdk select:focus,#ot-sdk-cookie-policy input[type=\"email\"]:focus,#ot-sdk-cookie-policy input[type=\"number\"]:focus,#ot-sdk-cookie-policy input[type=\"search\"]:focus,#ot-sdk-cookie-policy input[type=\"text\"]:focus,#ot-sdk-cookie-policy input[type=\"tel\"]:focus,#ot-sdk-cookie-policy input[type=\"url\"]:focus,#ot-sdk-cookie-policy input[type=\"password\"]:focus,#ot-sdk-cookie-policy textarea:focus,#ot-sdk-cookie-policy select:focus{border:1px solid #33c3f0;outline:0}#onetrust-banner-sdk label,#onetrust-banner-sdk legend,#onetrust-pc-sdk label,#onetrust-pc-sdk legend,#ot-sdk-cookie-policy label,#ot-sdk-cookie-policy legend{display:block;margin-bottom:0.5rem;font-weight:600}#onetrust-banner-sdk fieldset,#onetrust-pc-sdk fieldset,#ot-sdk-cookie-policy fieldset{padding:0;border-width:0}#onetrust-banner-sdk input[type=\"checkbox\"],#onetrust-banner-sdk input[type=\"radio\"],#onetrust-pc-sdk input[type=\"checkbox\"],#onetrust-pc-sdk input[type=\"radio\"],#ot-sdk-cookie-policy input[type=\"checkbox\"],#ot-sdk-cookie-policy input[type=\"radio\"]{display:inline}#onetrust-banner-sdk label>.label-body,#onetrust-pc-sdk label>.label-body,#ot-sdk-cookie-policy label>.label-body{display:inline-block;margin-right:0.5rem;font-weight:normal}#onetrust-banner-sdk ul,#onetrust-pc-sdk ul,#ot-sdk-cookie-policy ul{list-style:circle inside}#onetrust-banner-sdk ol,#onetrust-pc-sdk ol,#ot-sdk-cookie-policy ol{list-style:decimal inside}#onetrust-banner-sdk ol,#onetrust-banner-sdk ul,#onetrust-pc-sdk ol,#onetrust-pc-sdk ul,#ot-sdk-cookie-policy ol,#ot-sdk-cookie-policy ul{padding-right:0;margin-top:0}#onetrust-banner-sdk ul ul,#onetrust-banner-sdk ul ol,#onetrust-banner-sdk ol ol,#onetrust-banner-sdk ol ul,#onetrust-pc-sdk ul ul,#onetrust-pc-sdk ul ol,#onetrust-pc-sdk ol ol,#onetrust-pc-sdk ol ul,#ot-sdk-cookie-policy ul ul,#ot-sdk-cookie-policy ul ol,#ot-sdk-cookie-policy ol ol,#ot-sdk-cookie-policy ol ul{margin:1.5rem 3rem 1.5rem 0;font-size:90%}#onetrust-banner-sdk li,#onetrust-pc-sdk li,#ot-sdk-cookie-policy li{margin-bottom:1rem}#onetrust-banner-sdk code,#onetrust-pc-sdk code,#ot-sdk-cookie-policy code{padding:0.2rem 0.5rem;margin:0 0.2rem;font-size:90%;white-space:nowrap;background:#f1f1f1;border:1px solid #e1e1e1;border-radius:4px}#onetrust-banner-sdk pre>code,#onetrust-pc-sdk pre>code,#ot-sdk-cookie-policy pre>code{display:block;padding:1rem 1.5rem;white-space:pre}#onetrust-banner-sdk th,#onetrust-banner-sdk td,#onetrust-pc-sdk th,#onetrust-pc-sdk td,#ot-sdk-cookie-policy th,#ot-sdk-cookie-policy td{padding:12px 15px;text-align:right;border-bottom:1px solid #e1e1e1}#onetrust-banner-sdk .ot-sdk-u-full-width,#onetrust-pc-sdk .ot-sdk-u-full-width,#ot-sdk-cookie-policy .ot-sdk-u-full-width{width:100%;box-sizing:border-box}#onetrust-banner-sdk .ot-sdk-u-max-full-width,#onetrust-pc-sdk .ot-sdk-u-max-full-width,#ot-sdk-cookie-policy .ot-sdk-u-max-full-width{max-width:100%;box-sizing:border-box}#onetrust-banner-sdk .ot-sdk-u-pull-right,#onetrust-pc-sdk .ot-sdk-u-pull-right,#ot-sdk-cookie-policy .ot-sdk-u-pull-right{float:left}#onetrust-banner-sdk .ot-sdk-u-pull-left,#onetrust-pc-sdk .ot-sdk-u-pull-left,#ot-sdk-cookie-policy .ot-sdk-u-pull-left{float:right}#onetrust-banner-sdk hr,#onetrust-pc-sdk hr,#ot-sdk-cookie-policy hr{margin-top:3rem;margin-bottom:3.5rem;border-width:0;border-top:1px solid #e1e1e1}#onetrust-banner-sdk .ot-sdk-container:after,#onetrust-banner-sdk .ot-sdk-row:after,#onetrust-banner-sdk .ot-sdk-u-cf,#onetrust-pc-sdk .ot-sdk-container:after,#onetrust-pc-sdk .ot-sdk-row:after,#onetrust-pc-sdk .ot-sdk-u-cf,#ot-sdk-cookie-policy .ot-sdk-container:after,#ot-sdk-cookie-policy .ot-sdk-row:after,#ot-sdk-cookie-policy .ot-sdk-u-cf{content:\"\";display:table;clear:both}#onetrust-banner-sdk .ot-sdk-row,#onetrust-pc-sdk .ot-sdk-row,#ot-sdk-cookie-policy .ot-sdk-row{margin:0;max-width:none;display:block;margin:0}\n",
                };
            };
        }
        return CommonStyles;
    }());

    var ConsentNoticeNext = /** @class */ (function () {
        function ConsentNoticeNext() {
            this.processedHTML = '';
            // TODO : Eddie : refectore all constant and have inherit parent child to override properties
            this.ONETRUST_PC_SDK = '#onetrust-pc-sdk';
            this.ONETRUST_PC_DARK_FILTER = '.onetrust-pc-dark-filter';
        }
        ConsentNoticeNext.prototype.setFilterList = function (isHostList) {
            var _this = this;
            var filterGroupOption = OT('#onetrust-pc-sdk #filter-modal .group-option').el[0].cloneNode(true);
            OT('#onetrust-pc-sdk #filter-modal .group-options').html('');
            // Clear filters label
            if (coreNext.preferenceCenterGroup.name !== 'otPcPopup') {
                OT('#onetrust-pc-sdk #clear-filters-handler p').text(externalData.BannerVariables.domainData.PCenterClearFiltersText);
            }
            else {
                // TODO: Remove hard coded value
                OT('#onetrust-pc-sdk #filter-cancel-handler').text(externalData.BannerVariables.domainData.PCenterCancelFiltersText || 'Cancel');
            }
            OT('#onetrust-pc-sdk #filter-apply-handler').text(externalData.BannerVariables.domainData.PCenterApplyFiltersText);
            if (isHostList) {
                externalData.BannerVariables.oneTrustCategories.forEach(function (category) {
                    if (category.Hosts.length || category.FirstPartyCookies.length) {
                        _this.filterGroupOptionSetter(filterGroupOption, category, isHostList);
                    }
                });
            }
            else {
                externalData.BannerVariables.oneTrustIABConsent.defaultPurpose.forEach(function (category) {
                    _this.filterGroupOptionSetter(filterGroupOption, category, isHostList);
                });
            }
        };
        ConsentNoticeNext.prototype.hideConsentNoticeV2 = function (caller) {
            if (caller === void 0) { caller = ''; }
            var json = externalData.BannerVariables.domainData;
            var RIGHT = 'right';
            var LEFT = 'left';
            var SLIDE_IN = 'slide-in';
            var SLIDE_OUT = 'slide-out';
            if (json.ForceConsent) {
                if (!consentNoticeNext.isCookiePolicyPage(json.AlertNoticeText) &&
                    !externalData.isAlertBoxClosedAndValid() &&
                    json.ShowAlertNotice) {
                    OT("" + this.ONETRUST_PC_DARK_FILTER)
                        .css('z-index: 2147483645')
                        .show();
                    OT("" + this.ONETRUST_PC_SDK).fadeOut(400);
                }
                else {
                    OT(this.ONETRUST_PC_DARK_FILTER + ", " + this.ONETRUST_PC_SDK).fadeOut(400);
                }
            }
            else {
                switch (coreNext.preferenceCenterGroup.name) {
                    case 'otPcPanel':
                        var POSITIONVAR = externalData.BannerVariables.domainData.PreferenceCenterPosition;
                        var POSITION = POSITIONVAR.charAt(0).toLowerCase() + POSITIONVAR.slice(1);
                        if (!externalData.BannerVariables.commonData.useRTL) {
                            OT("" + this.ONETRUST_PC_SDK).removeClass("ot-" + SLIDE_IN + "-" + (POSITION === RIGHT ? POSITION : LEFT));
                            OT("" + this.ONETRUST_PC_SDK).addClass("ot-" + SLIDE_OUT + "-" + (POSITION === RIGHT ? POSITION : LEFT));
                        }
                        else {
                            OT("" + this.ONETRUST_PC_SDK).removeClass("ot-" + SLIDE_IN + "-" + (POSITION === LEFT ? RIGHT : POSITION));
                            OT("" + this.ONETRUST_PC_SDK).addClass("ot-" + SLIDE_OUT + "-" + (POSITION === LEFT ? RIGHT : POSITION));
                        }
                        OT("" + this.ONETRUST_PC_DARK_FILTER).fadeOut(500);
                        break;
                    default:
                        OT(this.ONETRUST_PC_DARK_FILTER + ", " + this.ONETRUST_PC_SDK).fadeOut(400);
                }
            }
            externalData.BannerVariables.isPCVisible = false;
            consentNoticeNext.setBannerFocus(consentNoticeNext.getPCFocusableElement());
        };
        ConsentNoticeNext.prototype.filterGroupOptionSetter = function (filterGroupOption, category, isHostList) {
            var id = groupsHelper.getGroupIdForCookie(category) + "-filter";
            var filterGroupOptionClone = filterGroupOption.cloneNode(true);
            OT('#filter-modal .group-options').append(filterGroupOptionClone);
            OT(filterGroupOptionClone.querySelector('input')).attr('id', id);
            OT(filterGroupOptionClone.querySelector('label')).attr('for', id);
            OT(filterGroupOptionClone.querySelector('label span')).html(category.GroupName);
            if (isHostList) {
                OT(filterGroupOptionClone.querySelector('input')).attr('data-optanongroupid', groupsHelper.getGroupIdForCookie(category));
            }
            else {
                OT(filterGroupOptionClone.querySelector('input')).attr('data-purposeid', groupsHelper.getGroupIdForCookie(category));
            }
        };
        ConsentNoticeNext.prototype.isCookiePolicyPage = function (bannerText) {
            var isMatching = false;
            var currentURL = moduleHelper.removeURLPrefixes(window.location.href);
            var el = OT('<div></div>', 'ce').el;
            OT(el).html(bannerText);
            var hrefElements = el.querySelectorAll('a');
            for (var i = 0; i < hrefElements.length; i++) {
                if (moduleHelper.removeURLPrefixes(hrefElements[i].href) === currentURL) {
                    isMatching = true;
                    break;
                }
            }
            return isMatching;
        };
        ConsentNoticeNext.prototype.getPCFocusableElement = function () {
            var queryString = "#onetrust-pc-sdk #close-pc-btn-handler.main,\n    #onetrust-pc-sdk #content button,\n    #onetrust-pc-sdk #content [href],\n    #onetrust-pc-sdk #content input,\n    #onetrust-pc-sdk .ot-switch input,\n    #onetrust-pc-sdk .category-menu-switch-handler,\n    #onetrust-pc-sdk #content input";
            var focusableElements = Array.prototype.slice.call(OT(queryString).el);
            if (coreNext.preferenceCenterGroup.name === 'otPcTab') {
                var closeButton = Array.prototype.slice.call(OT('#onetrust-pc-sdk .pc-close-button').el);
                var saveBtn = Array.prototype.slice.call(OT('#onetrust-pc-sdk .save-preference-btn-handler').el);
                var allowBtn = Array.prototype.slice.call(OT('#onetrust-pc-sdk #accept-recommended-btn-handler').el);
                focusableElements = closeButton.concat(focusableElements, saveBtn, allowBtn);
            }
            return focusableElements;
        };
        ConsentNoticeNext.prototype.setBannerFocus = function (focusableElements, tabIndex, closedFromPC, stopBannerLoop) {
            if (closedFromPC) {
                var bannerCookiesSettingsBtn = OT('#onetrust-banner-sdk #onetrust-pc-btn-handler').el[0];
                if (bannerCookiesSettingsBtn) {
                    bannerCookiesSettingsBtn.focus();
                }
                return false;
            }
            if (!focusableElements || focusableElements.length <= 0) {
                return;
            }
            if (tabIndex !== null && tabIndex !== undefined) {
                for (var i = 0; i < focusableElements.length; i++) {
                    focusableElements[i].setAttribute('tabindex', tabIndex.toString());
                }
            }
            // Tab loop for the content inside Preference Center
            var firstItem = this.getdefaultElementsForFocus(focusableElements, 0, true);
            var lastItem = firstItem
                ? this.getdefaultElementsForFocus(focusableElements, focusableElements.length - 1, false)
                : null;
            // Not applicable for Tab layout as the first and last Item can change upon switching through tabs  
            if (firstItem && coreNext.preferenceCenterGroup.name != 'otPcTab') {
                OT(firstItem).on('keydown', function (e) {
                    if (e.keyCode === 9 && e.shiftKey) {
                        e.preventDefault();
                        lastItem.focus();
                    }
                });
                firstItem.focus();
            }
            else {
                focusableElements[0].focus();
            }
            if (!stopBannerLoop && lastItem) {
                OT(lastItem).on('keydown', function (e) {
                    if (e.keyCode === 9 && !e.shiftKey) {
                        e.preventDefault();
                        if (coreNext.preferenceCenterGroup.name != 'otPcTab') {
                            firstItem.focus();
                        }
                        // Focus the active tab from the list of tabs
                        else {
                            var elemToFocus = consentNoticeNext.getActiveTab();
                            if (elemToFocus) {
                                elemToFocus.focus();
                            }
                        }
                    }
                });
            }
        };
        // Select the active tab for focus
        ConsentNoticeNext.prototype.getActiveTab = function () {
            return OT('#onetrust-pc-sdk .category-menu-switch-handler[tabindex="0"]').el[0];
        };
        ConsentNoticeNext.prototype.getdefaultElementsForFocus = function (focusableElements, index, isFirstElement) {
            var focusableElementLength = focusableElements.length;
            var item = focusableElements[index];
            while (isFirstElement
                ? item.offsetParent === null && index < focusableElementLength
                : item.offsetParent === null && index > 0) {
                item = focusableElements[index];
                if (isFirstElement) {
                    ++index;
                }
                else {
                    --index;
                }
            }
            return item;
        };
        return ConsentNoticeNext;
    }());
    var consentNoticeNext;
    function initializeConsentNoticeNext() {
        consentNoticeNext = new ConsentNoticeNext();
    }

    // TODO: this seems unnecessary and may be able to be deprecated...
    var SDKElementsV2 = /** @class */ (function () {
        function SDKElementsV2() {
        }
        SDKElementsV2.prototype.getBanner = function () {
            return OT('#onetrust-banner-sdk');
        };
        SDKElementsV2.prototype.getBannerOverlay = function () {
            return OT('.onetrust-pc-dark-filter');
        };
        SDKElementsV2.prototype.getCookieSettings = function () {
            return OT('.ot-sdk-show-settings');
        };
        SDKElementsV2.prototype.getAllowAllButton = function () {
            return OT('#onetrust-pc-sdk #accept-recommended-btn-handler');
        };
        SDKElementsV2.prototype.getSelectedVendors = function () {
            return OT('#onetrust-pc-sdk .toggle-group .ot-checkbox input:checked');
        };
        return SDKElementsV2;
    }());
    var sdkElementsV2;
    function initializeSdkElementsV2() {
        sdkElementsV2 = new SDKElementsV2();
    }

    var LandingPath = /** @class */ (function () {
        function LandingPath() {
        }
        LandingPath.prototype.initialiseLandingPath = function () {
            // landing page viewed - ensure the parameter is updated but don't hide the alert box
            if (landingPathNext.isLandingPage()) {
                this.setLandingPathParam(location.href);
                return;
            }
            if (externalData.needReconsent() && !externalData.awaitingReconsent()) {
                // we need the reconsent so we're updating the landing page parameter and setting the reconsent flag
                this.setLandingPathParam(location.href);
                externalData.writeCookieParam(externalData.BannerVariables.optanonCookieName, externalData.BannerVariables.optanonAwaitingReconsentName, true);
                return;
            }
            // make sure the initial landing page isn't treated as such after navigating away
            this.setLandingPathParam(externalData.BannerVariables.optanonNotLandingPageName);
            externalData.writeCookieParam(externalData.BannerVariables.optanonCookieName, externalData.BannerVariables.optanonAwaitingReconsentName, false);
            if (externalData.BannerVariables.optanonIsSoftOptInMode && !moduleInitializer.moduleInitializer.MobileSDK) {
                publicAPINext.setAlertBoxClosed(true);
            }
        };
        LandingPath.prototype.setLandingPathParam = function (value) {
            // externalData : remove hardcoded param
            externalData.writeCookieParam(externalData.BannerVariables.optanonCookieName, 'landingPath', value);
        };
        return LandingPath;
    }());
    var landingPath;
    function initializeLandingPath() {
        landingPath = new LandingPath();
    }

    var Gtm = /** @class */ (function () {
        function Gtm() {
        }
        Gtm.prototype.updateGtmMacros = function (consentChanged) {
            if (consentChanged === void 0) { consentChanged = true; }
            var gtmOptanonActiveGroups = [];
            // Groups
            externalData.BannerVariables.optanonHtmlGroupData.forEach(function (group) {
                if (moduleHelper.endsWith(group, ':1') &&
                    coreNext.canSoftOptInInsertForGroup(group.replace(':1', ''))) {
                    gtmOptanonActiveGroups.push(group.replace(':1', ''));
                }
            });
            // Hosts
            externalData.BannerVariables.oneTrustHostConsent.forEach(function (host) {
                if (moduleHelper.endsWith(host, ':1')) {
                    gtmOptanonActiveGroups.push(host.replace(':1', ''));
                }
            });
            // Setting "optanon-active-groups" global variable for Google Tag Manager macro
            var serializeArrayString = ',' + moduleHelper.serialiseArrayToString(gtmOptanonActiveGroups) + ',';
            window.OnetrustActiveGroups = serializeArrayString;
            window.OptanonActiveGroups = serializeArrayString;
            // Setting "optanon-active-groups" data layer field for Google Tag Manager macro
            if (typeof window.dataLayer !== 'undefined') {
                if (window.dataLayer.constructor === Array) {
                    window.dataLayer.push({
                        event: 'OneTrustLoaded',
                        OnetrustActiveGroups: serializeArrayString
                    });
                    window.dataLayer.push({
                        event: 'OptanonLoaded',
                        OptanonActiveGroups: serializeArrayString
                    });
                }
            }
            else {
                window.dataLayer = [
                    {
                        event: 'OneTrustLoaded',
                        OnetrustActiveGroups: serializeArrayString
                    },
                    {
                        event: 'OptanonLoaded',
                        OptanonActiveGroups: serializeArrayString
                    }
                ];
            }
            // Trigger consent changed event
            if (consentChanged) {
                setTimeout(function () {
                    var event = new CustomEvent('consent.onetrust', {
                        detail: gtmOptanonActiveGroups
                    });
                    window.dispatchEvent(event);
                });
            }
        };
        return Gtm;
    }());
    var gtm;
    function initializeGtm() {
        gtm = new Gtm();
    }

    var SDKEventsNext = /** @class */ (function () {
        function SDKEventsNext() {
            // Closing Optanon alert box with predefined class = optanon-alert-box-wrapper
            this.closeOptanonAlertBox = function (setOptanonAlertBoxCookie, isOptanonAlertBoxCookiePersistent) {
                sdkEventsNext.alertBoxWrapperClose();
                if (setOptanonAlertBoxCookie &&
                    (externalData.BannerVariables.optanonIsOptInMode ||
                        (!externalData.BannerVariables.optanonIsOptInMode &&
                            !externalData.isAlertBoxClosedAndValid()))) {
                    publicAPINext.setAlertBoxClosed(isOptanonAlertBoxCookiePersistent);
                }
            };
        }
        SDKEventsNext.prototype.setAllowAllButton = function () {
            var deactiveCount = 0;
            var json = externalData.BannerVariables.domainData;
            var showAllow = json.Groups.some(function (group) {
                if (NON_CONSENTABLE_GROUPS.indexOf(group.Type) === -1) {
                    if (groupsV2.IsGroupInActive(group)) {
                        deactiveCount++;
                    }
                    group.SubGroups.some(function (subGroup) {
                        if (groupsV2.IsGroupInActive(subGroup)) {
                            deactiveCount++;
                            return true;
                        }
                    });
                    return deactiveCount >= 1;
                }
            });
            if (showAllow) {
                this.allowAllButtonShow();
            }
            else {
                this.allowAllButtonHide();
            }
            return showAllow;
        };
        SDKEventsNext.prototype.allowAllButtonShow = function () {
            sdkElementsV2.getAllowAllButton().show();
        };
        SDKEventsNext.prototype.allowAllButtonHide = function () {
            sdkElementsV2.getAllowAllButton().hide();
        };
        SDKEventsNext.prototype.alertBoxWrapperClose = function () {
            sdkElementsV2.getBanner().fadeOut(400);
        };
        return SDKEventsNext;
    }());
    var sdkEventsNext;
    function initializeSdkEventsNext() {
        sdkEventsNext = new SDKEventsNext();
    }

    var CoreEvents = /** @class */ (function () {
        function CoreEvents() {
            var _this = this;
            this.iab = iabV2;
            this.groupsClass = groupsV2;
            // Remove Event Listener
            this.rmClickEventListener = function (el) {
                el.removeEventListener('click', _this.onClickCloseBanner);
            };
            // Banner: close button handller
            this.bannerCloseButtonHandler = function (closeFromCookie) {
                if (closeFromCookie === void 0) { closeFromCookie = false; }
                sdkEventsNext.closeOptanonAlertBox(true, true);
                // TODO: total hack- I don't love it. Some futher untangling needs to be done around this and mobile AllowAll
                if (moduleInitializer.moduleInitializer.MobileSDK) {
                    window.OneTrust.Close();
                }
                else {
                    _this.close(closeFromCookie);
                }
                return false;
            };
            this.allowAllEventHandler = function () {
                _this.allowAllEvent();
            };
            // Banner:Accept cookie settings handler
            this.allowAllEvent = function (consentIgnoreForGeoLookup) {
                if (consentIgnoreForGeoLookup === void 0) { consentIgnoreForGeoLookup = false; }
                sdkEventsNext.closeOptanonAlertBox(true, true);
                coreEvents.allowAll(consentIgnoreForGeoLookup);
                return false;
            };
            // Called when click on reject all button
            this.rejectAllEventHandler = function () {
                if (moduleInitializer.moduleInitializer.MobileSDK) {
                    window.OneTrust.RejectAll();
                }
                else {
                    _this.rejectAllEvent();
                }
            };
            // Banner: Reject all handler
            this.rejectAllEvent = function (consentIgnoreForGeoLookup) {
                if (consentIgnoreForGeoLookup === void 0) { consentIgnoreForGeoLookup = false; }
                sdkEventsNext.closeOptanonAlertBox(true, true);
                _this.rejectAll(consentIgnoreForGeoLookup);
                return false;
            };
        }
        CoreEvents.prototype.closeBanner = function (isAcceptAllCookies) {
            sdkEventsNext.closeOptanonAlertBox(true, true);
            if (isAcceptAllCookies) {
                this.allowAll(false);
            }
            else {
                this.close(false);
            }
        };
        // Close consent notice, writes cookies and executes wrapper function
        CoreEvents.prototype.allowAll = function (consentIgnoreForGeoLookup) {
            if (moduleInitializer.moduleInitializer.MobileSDK) {
                window.OneTrust.AllowAll();
            }
            else {
                this.AllowAllV2(consentIgnoreForGeoLookup);
            }
        };
        /**
         * This method handles allow all and reject all behavior.
         * At a time either one of them only can be true
         */
        CoreEvents.prototype.bannerActionsHandler = function (consentIgnoreForGeoLookup, isAllowAll, isRejectAll) {
            var _this = this;
            var json = externalData.BannerVariables.domainData;
            // set landing page 1st
            landingPath.setLandingPathParam(externalData.BannerVariables.optanonNotLandingPageName);
            externalData.BannerVariables.optanonHtmlGroupData = []; // Groups
            externalData.BannerVariables.oneTrustHostConsent = []; // Hosts
            json.Groups.forEach(function (group) {
                if (group.IsAboutGroup) {
                    return false;
                } // Ignore about your privacy cookie group
                _this.groupsClass.getGroupSubGroups(group).concat([group]).forEach(function (grp) {
                    var isGroupActive = isAllowAll
                        ? true
                        : isRejectAll
                            ? coreNext.isAlwaysActiveGroup(grp)
                            : false;
                    if (CONSENTABLE_GROUPS.indexOf(grp.Type) > -1) {
                        externalData.BannerVariables.optanonHtmlGroupData.push(groupsHelper.getGroupIdForCookie(grp) + ":" + (isGroupActive ? '1' : '0')); // Groups
                    }
                    if (grp.Hosts.length &&
                        externalData.BannerVariables.commonData.allowHostOptOut) {
                        grp.Hosts.forEach(function (host) {
                            externalData.BannerVariables.oneTrustHostConsent.push(host.HostId + ":" + (isGroupActive ? '1' : '0')); // Hosts
                        });
                    }
                });
            });
            if (externalData.BannerVariables.domainData.IsIabEnabled) {
                isAllowAll ? this.iab.allowAllhandler() : this.iab.rejectAllHandler();
            }
            consentNoticeNext.hideConsentNoticeV2();
            cookieClass.writeCookieGroupsParam(externalData.BannerVariables.optanonCookieName); // Groups
            cookieClass.writeHostCookieParam(externalData.BannerVariables.optanonCookieName); // Hosts
            coreV2.substitutePlainTextScriptTags();
            gtm.updateGtmMacros();
            if (consentIntegration &&
                !consentIgnoreForGeoLookup &&
                externalData.BannerVariables.domainData.IsConsentLoggingEnabled) {
                consentIntegration.createConsentTransaction();
            }
            this.executeOptanonWrapper();
        };
        CoreEvents.prototype.alertBoxWrapperAndPopupClose = function () {
            sdkElementsV2.getBanner().fadeOut(200);
            sdkElementsV2.getBannerOverlay().hide();
        };
        CoreEvents.prototype.nextPageCloseBanner = function () {
            if (!landingPathNext.isLandingPage() && !externalData.isAlertBoxClosedAndValid()) {
                this.closeBanner(externalData.BannerVariables.domainData.NextPageAcceptAllCookies);
            }
        };
        CoreEvents.prototype.onClickCloseBanner = function (e) {
            var body = document.querySelector('body').children;
            if (!externalData.isAlertBoxClosedAndValid()) {
                publicAPINext.triggerGoogleAnalyticsEvent('OneTrust Cookie Consent', 'Banner Auto Close', undefined, undefined);
                this.closeBanner(externalData.BannerVariables.domainData.OnClickAcceptAllCookies);
            }
            for (var y = 0; y < body.length; y++) {
                this.rmClickEventListener(body[y]);
            }
            e.stopPropagation();
        };
        CoreEvents.prototype.scrollCloseBanner = function () {
            var overflowHeight = OT(document).height() - OT(window).height();
            if (overflowHeight === 0) {
                // when doctype is not specified, document height equals window height
                overflowHeight = OT(window).height();
            }
            var scrollPercent = (100 * OT(window).scrollTop()) / overflowHeight;
            if (scrollPercent > 25 &&
                !externalData.isAlertBoxClosedAndValid() &&
                !externalData.BannerVariables.isPCVisible) {
                publicAPINext.triggerGoogleAnalyticsEvent('OneTrust Cookie Consent', 'Banner Auto Close', undefined, undefined);
                coreEvents.closeBanner(externalData.BannerVariables.domainData.ScrollAcceptAllCookies);
                coreEvents.rmScrollEventListener.bind(this);
            }
            else if (externalData.isAlertBoxClosedAndValid()) {
                coreEvents.rmScrollEventListener.bind(this);
            }
        };
        CoreEvents.prototype.rmScrollEventListener = function () {
            window.removeEventListener('scroll', this.scrollCloseBanner);
        };
        // User Closed Banner, Click Accepts All
        CoreEvents.prototype.bannerClosed = function () {
            var body = document.querySelector('body').children;
            for (var y = 0; y < body.length; y++) {
                this.rmClickEventListener(body[y]);
            }
            this.rmScrollEventListener();
        };
        // Close consent notice, writes cookies and executes wrapper function
        CoreEvents.prototype.AllowAllV2 = function (consentIgnoreForGeoLookup) {
            var groups = this.groupsClass.getAllGroupElements();
            for (var i = 0; i < groups.length; i++) {
                this.groupsClass.toogleGroupElementOn(groups[i]);
                this.groupsClass.toogleSubGroupElementOn(groups[i], true);
            }
            this.bannerActionsHandler(consentIgnoreForGeoLookup, true, false);
            if (externalData.BannerVariables.domainData.IsIabEnabled) {
                this.iab.updateIabVariableReference();
            }
        };
        // Close consent notice, writes cookies and executes wrapper function
        CoreEvents.prototype.AllowAllV1 = function (consentIgnoreForGeoLookup) {
            this.allowAll(consentIgnoreForGeoLookup);
        };
        // Reject all except always active groups
        CoreEvents.prototype.rejectAll = function (consentIgnoreForGeoLookup) {
            var groupElements = this.groupsClass.getAllGroupElements();
            for (var i = 0; i < groupElements.length; i++) {
                var groupStatus = groupsNext.safeGroupDefaultStatus(groupsNext.getGroupById(groupElements[i].getAttribute('data-optanongroupid')));
                if (groupStatus.toLowerCase() !== 'always active') {
                    this.groupsClass.toogleGroupElementOff(groupElements[i]);
                    this.groupsClass.toogleSubGroupElementOff(groupElements[i]);
                }
            }
            this.bannerActionsHandler(consentIgnoreForGeoLookup, false, true);
            if (externalData.BannerVariables.domainData.IsIabEnabled) {
                this.iab.updateIabVariableReference();
            }
        };
        CoreEvents.prototype.executeCustomScript = function () {
            var json = externalData.BannerVariables.domainData;
            if (json.CustomJs) {
                new Function(json.CustomJs)();
            }
        };
        CoreEvents.prototype.updateConsentData = function (closeFromCookie) {
            landingPath.setLandingPathParam(externalData.BannerVariables.optanonNotLandingPageName);
            if (externalData.BannerVariables.domainData.IsIabEnabled &&
                !closeFromCookie) {
                this.iab.saveVendorStatus();
            }
            cookieClass.writeCookieGroupsParam(externalData.BannerVariables.optanonCookieName); // Groups
            cookieClass.writeHostCookieParam(externalData.BannerVariables.optanonCookieName); // Hosts
            coreV2.substitutePlainTextScriptTags();
            gtm.updateGtmMacros();
        };
        CoreEvents.prototype.close = function (closeFromCookie) {
            consentNoticeNext.hideConsentNoticeV2();
            this.updateConsentData(closeFromCookie);
            if (externalData.BannerVariables.domainData.IsConsentLoggingEnabled) {
                consentIntegration.createConsentTransaction();
            }
            this.executeOptanonWrapper();
        };
        CoreEvents.prototype.executeOptanonWrapper = function () {
            this.executeCustomScript();
            if (typeof window.OptanonWrapper === 'function') {
                if (window.OptanonWrapper !== 'undefined') {
                    window.OptanonWrapper();
                    // Adding Optanon Group Id to optanonWrapperScriptExecutedGroups
                    for (var i = 0; i <
                        externalData.BannerVariables.optanonWrapperScriptExecutedGroupsTemp
                            .length; i += 1) {
                        if (!moduleHelper.contains(externalData.BannerVariables.optanonWrapperScriptExecutedGroups, externalData.BannerVariables
                            .optanonWrapperScriptExecutedGroupsTemp[i])) {
                            externalData.BannerVariables.optanonWrapperScriptExecutedGroups.push(externalData.BannerVariables
                                .optanonWrapperScriptExecutedGroupsTemp[i]);
                        }
                    }
                    externalData.BannerVariables.optanonWrapperScriptExecutedGroupsTemp = [];
                    // Adding Optanon Group Id to optanonWrapperHtmlExecutedGroups
                    for (var i = 0; i <
                        externalData.BannerVariables.optanonWrapperHtmlExecutedGroupsTemp
                            .length; i += 1) {
                        if (!moduleHelper.contains(externalData.BannerVariables.optanonWrapperHtmlExecutedGroups, externalData.BannerVariables.optanonWrapperHtmlExecutedGroupsTemp[i])) {
                            externalData.BannerVariables.optanonWrapperHtmlExecutedGroups.push(externalData.BannerVariables.optanonWrapperHtmlExecutedGroupsTemp[i]);
                        }
                    }
                    externalData.BannerVariables.optanonWrapperHtmlExecutedGroupsTemp = [];
                }
            }
        };
        CoreEvents.prototype.TogglePreferenceCenter = function (bgIsHidden, wrapperIsHidden) {
            if (bgIsHidden && wrapperIsHidden) {
                this.showConsentNotice();
            }
            else {
                consentNoticeNext.hideConsentNoticeV2();
                cookieClass.writeCookieGroupsParam(externalData.BannerVariables.optanonCookieName);
                coreV2.substitutePlainTextScriptTags();
                gtm.updateGtmMacros();
                this.executeOptanonWrapper();
            }
        };
        CoreEvents.prototype.showConsentNotice = function () {
            this.showConsentNoticeV2();
        };
        CoreEvents.prototype.showConsentNoticeV2 = function () {
            OT('.onetrust-pc-dark-filter').removeClass('hide');
            OT('#onetrust-pc-sdk').removeClass('hide');
            switch (coreNext.preferenceCenterGroup.name) {
                case 'otPcPanel':
                    var animatedExist = OT('#onetrust-pc-sdk').el[0].classList.contains('ot-animated');
                    if (!animatedExist) {
                        OT('#onetrust-pc-sdk').addClass('ot-animated');
                    }
                    if (!externalData.BannerVariables.commonData.useRTL) {
                        var slideOutLeftExist = OT('#onetrust-pc-sdk').el[0].classList.contains('ot-slide-out-left');
                        if (slideOutLeftExist) {
                            OT('#onetrust-pc-sdk').removeClass('ot-slide-out-left');
                        }
                        if (externalData.BannerVariables.domainData.PreferenceCenterPosition ===
                            'right') {
                            OT('#onetrust-pc-sdk').addClass('ot-slide-in-right');
                        }
                        else {
                            OT('#onetrust-pc-sdk').addClass('ot-slide-in-left');
                        }
                    }
                    else {
                        var slideOutRightExist = OT('#onetrust-pc-sdk').el[0].classList.contains('ot-slide-out-left');
                        if (slideOutRightExist) {
                            OT('#onetrust-pc-sdk').removeClass('ot-slide-out-left');
                        }
                        if (externalData.BannerVariables.domainData.PreferenceCenterPosition ===
                            'right') {
                            OT('#onetrust-pc-sdk').addClass('ot-slide-in-left');
                        }
                        else {
                            OT('#onetrust-pc-sdk').addClass('ot-slide-in-right');
                        }
                    }
                    break;
            }
            var bannerTabIndex;
            if (coreNext.preferenceCenterGroup.name != "otPcTab") {
                bannerTabIndex = 0;
            }
            sdkEventsNext.setAllowAllButton();
            consentNoticeNext.setBannerFocus(consentNoticeNext.getPCFocusableElement(), bannerTabIndex);
        };
        CoreEvents.prototype.initialiseShowSettingsButtonsHandlers = function () {
            OT(sdkElementsV2.getCookieSettings()).on('click', function () {
                publicAPINext.triggerGoogleAnalyticsEvent('OneTrust Cookie Consent', 'Privacy Settings Click', undefined, undefined);
            });
        };
        return CoreEvents;
    }());
    var coreEvents;
    function initializeCoreEvents() {
        coreEvents = new CoreEvents();
    }

    var ShowSubgroupToggleV2 = /** @class */ (function () {
        function ShowSubgroupToggleV2() {
            this.groupsClass = groupsV2;
        }
        ShowSubgroupToggleV2.prototype.toggleAllSubGroupStatusOn = function (group) {
            if (group.ShowSubgroup) {
                var groupId = groupsHelper.getGroupIdForCookie(group);
                var groupElement = this.getGroupElementByOptanonGroupId(groupId.toString());
                this.groupsClass.toogleSubGroupElementOn(groupElement);
            }
            else {
                this.updateHiddenSubGroupData(group, true);
            }
        };
        ShowSubgroupToggleV2.prototype.toggleAllSubGroupStatusOff = function (group) {
            if (group.ShowSubgroup) {
                var groupId = groupsHelper.getGroupIdForCookie(group);
                var groupElement = this.getGroupElementByOptanonGroupId(groupId.toString());
                this.groupsClass.toogleSubGroupElementOff(groupElement);
            }
            else {
                this.updateHiddenSubGroupData(group, false);
            }
        };
        ShowSubgroupToggleV2.prototype.getGroupElementByOptanonGroupId = function (optanonGroupId) {
            return document.querySelector("#onetrust-pc-sdk .category-group .category-item[data-optanongroupid=\n            \"" + optanonGroupId + "\"]");
        };
        ShowSubgroupToggleV2.prototype.updateHiddenSubGroupData = function (group, isEnabled) {
            var subGroups = this.groupsClass.getGroupSubGroups(group);
            subGroups.forEach(function (grp) {
                isEnabled
                    ? coreNext.toggleGroupStatusOn(grp)
                    : coreNext.toggleGroupStatusOff(grp); // group
                groupsNext.toggleGroupHosts(grp, isEnabled); // hosts
            });
        };
        return ShowSubgroupToggleV2;
    }());
    var showSubgroupToggleV2;
    function initializeShowSubgroupToggleV2() {
        showSubgroupToggleV2 = new ShowSubgroupToggleV2();
    }

    var SDKEventsV2 = /** @class */ (function () {
        function SDKEventsV2() {
            var _this = this;
            this.showCookieSettingsHandler = function (e) {
                if (e) {
                    e.stopPropagation();
                }
                if (coreNext.preferenceCenterGroup.name === 'otPcList') {
                    _this.setPcListContainerHeight();
                }
                _this.toggleInfoDisplay();
                return false;
            };
            // PC: Back button click handler
            this.backBtnHandler = function () {
                _this.hideVendorsList();
                if (coreNext.preferenceCenterGroup.name === 'otPcList') {
                    OT('#onetrust-pc-sdk #content').removeClass('hide');
                    OT('#onetrust-pc-sdk').el[0].removeAttribute('style');
                    _this.setPcListContainerHeight();
                }
                // Reset filter state
                OT('#onetrust-pc-sdk #filter-count').text('0');
                if (OT('#onetrust-pc-sdk #vendor-search-handler').length) {
                    OT('#onetrust-pc-sdk #vendor-search-handler').el[0].value = '';
                }
                externalData.BannerVariables.currentGlobalFilteredList = [];
                externalData.BannerVariables.filterByCategories = [];
                externalData.BannerVariables.filterByIABCategories = [];
                externalData.BannerVariables.vendors.searchParam = '';
                sdkEventsV2.closeFilter();
                return false;
            };
            // PC: Toggling true / false
            this.toggleV2Category = function (event, group, isEnabled, checkbox) {
                var _this = this;
                if (!group) {
                    externalData.BannerVariables.dataGroupState.some(function (grp) {
                        if (typeof _this.getAttribute === 'function') {
                            if (groupsHelper.getGroupIdForCookie(grp) ===
                                _this.getAttribute('data-optanongroupid')) {
                                group = grp;
                                return true;
                            }
                        }
                    });
                }
                if (isEnabled === undefined) {
                    isEnabled = OT(this).is(':checked');
                }
                if (!checkbox) {
                    // Click or Key Event
                    moduleHelper.setCheckedAttribute(null, this, isEnabled);
                }
                else if (document.querySelector("#ot-group-id-" + checkbox)) {
                    // JS API call
                    moduleHelper.setCheckedAttribute("#ot-sub-group-id-" + checkbox, null, isEnabled);
                }
                groupsNext.toggleGroupHosts(group, isEnabled); // Enable/ Disbale hosts by group status
                if (isEnabled) {
                    coreNext.toggleGroupStatusOn(group);
                    if (showSubgroupToggleV2 && group.SubGroups && group.SubGroups.length) {
                        showSubgroupToggleV2.toggleAllSubGroupStatusOn(group);
                    }
                }
                else {
                    coreNext.toggleGroupStatusOff(group);
                    if (showSubgroupToggleV2 && group.SubGroups && group.SubGroups.length) {
                        showSubgroupToggleV2.toggleAllSubGroupStatusOff(group);
                    }
                }
                sdkEventsNext.setAllowAllButton();
            };
            this.toggleSubCategory = function (e, groupId, isEnabled, checkbox) {
                if (!groupId) {
                    groupId = this.getAttribute('data-optanongroupid');
                }
                var group = groupsNext.getGroupById(groupId);
                if (isEnabled === undefined) {
                    isEnabled = OT(this).is(':checked');
                }
                if (!checkbox) {
                    // Click or Key Event
                    moduleHelper.setCheckedAttribute(null, this, isEnabled);
                }
                else {
                    // JS API call
                    moduleHelper.setCheckedAttribute("#ot-sub-group-id-" + checkbox, null, isEnabled);
                }
                groupsNext.toggleGroupHosts(group, isEnabled); // Enable/ Disbale hosts by group status
                var parentGroup = groupsNext.getGroupById(group.Parent);
                var parentGroupEnabled = coreNext.isGroupEnabled(parentGroup);
                if (isEnabled) {
                    coreNext.toggleGroupStatusOn(group); // Enable sub group
                    // Check if all sub groups are enabled and parent is disabled then enable Parent
                    var isAllSubGroupsEnabled = coreNext.isAllSubgroupsEnabled(parentGroup);
                    if (isAllSubGroupsEnabled && !parentGroupEnabled) {
                        coreNext.toggleGroupStatusOn(parentGroup); // Toggle Parent group status
                        groupsNext.toggleGroupHosts(parentGroup, isEnabled); // Enable/ Disbale hosts by group status
                        coreNext.toggleGroupHtmlElement(group.Parent, true); // Update HTML attribute
                    }
                }
                else {
                    coreNext.toggleGroupStatusOff(group); // Disable sub group
                    // Check if all sub groups are disabled and parent is enabled then disable Parent
                    var isAllSubGroupsDisabled = coreNext.isAllSubgroupsDisabled(parentGroup);
                    if (isAllSubGroupsDisabled && parentGroupEnabled) {
                        coreNext.toggleGroupStatusOff(parentGroup); // Toggle Parent group status
                        groupsNext.toggleGroupHosts(parentGroup, isEnabled); // Enable/ Disbale hosts by group status
                        coreNext.toggleGroupHtmlElement(group.Parent, isEnabled); // Update HTML attribute
                    }
                    else {
                        coreNext.toggleGroupStatusOff(parentGroup); // Toggle Parent group status
                        groupsNext.toggleGroupHosts(parentGroup, false); // Enable/ Disbale hosts by group status
                        coreNext.toggleGroupHtmlElement(group.Parent, false); // Update HTML attribute
                    }
                }
                // Enable/Disable allow all button
                sdkEventsNext.setAllowAllButton();
            };
        }
        SDKEventsV2.prototype.initialiseConsentNoticeHandlers = function () {
            // KeyCode constants
            var KEYCODE = {
                TAB: 9,
                LEFT_ARROW: 37,
                RIGHT_ARROW: 39
            };
            // Bind events to the categories menu - only for Tab layout
            if (coreNext.preferenceCenterGroup.name === 'otPcTab') {
                this.categoryMenuSwitchHandler();
            }
            // .onetrust-close-btn-handler: set cookie and close consent notice
            OT(document).on('click', '.onetrust-close-btn-handler', sdkEventsV2.bannerCloseButtonHandler.bind(this));
            // Cookie Settings toggle(preference center) handler
            OT(document).on('click', '.ot-sdk-show-settings', this.cookieSettingsToggleHandler.bind(this));
            OT(document).on('click', '.optanon-show-settings', this.cookieSettingsToggleHandler.bind(this));
            OT(document).on('click', '.optanon-toggle-display', this.cookieSettingsToggleHandler.bind(this));
            // #onetrust-pc-btn-handler: show/close consent notice (set cookie if close)
            OT(document).on('click', '#onetrust-pc-btn-handler', this.showCookieSettingsHandler.bind(this));
            // #onetrust-accept-btn-handler: activate all groups, set cookie and close consent notice
            OT(document).on('click', '#onetrust-accept-btn-handler', coreEvents.allowAllEventHandler.bind(this));
            OT(document).on('click', '#accept-recommended-btn-handler', coreEvents.allowAllEventHandler.bind(this));
            OT(document).on('click', '#onetrust-reject-all-handler', coreEvents.rejectAllEventHandler.bind(this));
            // PC: Close preference center
            OT(document).on('click', '#close-pc-btn-handler', this.hideCookieSettingsHandler);
            // Close the Preference Center using escape key
            OT(document).on('keydown', function (e) {
                if (e.keyCode === 27) {
                    sdkEventsV2.hideCookieSettingsHandler();
                }
            });
            // TODO: to be removed after removing duplicate code
            OT(document).on('click', '#vendor-close-pc-btn-handler', this.hideCookieSettingsHandler);
            if (coreNext.bannerGroup.name === 'otFloatingRoundedIcon') {
                OT(document).on('click', '#onetrust-banner-sdk .banner-option-input', this.toggleBannerOptions);
            }
            // PC: Enable/disbale - category/group
            OT('#onetrust-pc-sdk').on('click', '.category-switch-handler', this.toggleV2Category);
            OT('#onetrust-pc-sdk').on('click', '.cookie-subgroup-handler', this.toggleSubCategory);
            OT('#onetrust-pc-sdk').on('keydown', '.category-menu-switch-handler', function (e) {
                if (coreNext.preferenceCenterGroup.name === 'otPcTab') {
                    if (e.keyCode === KEYCODE.LEFT_ARROW || e.keyCode === KEYCODE.RIGHT_ARROW) {
                        sdkEventsV2.changeSelectedTab(e);
                    }
                    // focus on the last button for tab layout to create a loop
                    if (e.shiftKey && e.keyCode === KEYCODE.TAB) {
                        e.preventDefault();
                        OT('#onetrust-pc-sdk #accept-recommended-btn-handler').el[0].focus();
                    }
                }
            });
            OT('#onetrust-pc-sdk').on('click', '.category-item', function (e) {
                if (coreNext.preferenceCenterGroup.name === 'otPcPopup') {
                    sdkEventsV2.toggleAccordionStatus(event);
                }
            });
            OT('#onetrust-consent-sdk').on('click', '.banner-option-input', function (e) {
                sdkEventsV2.toggleAccordionStatus(event);
            });
            if (externalData.BannerVariables.commonData.showCookieList) {
                // PC: View Host list
                OT('#onetrust-pc-sdk').on('click', '.category-host-list-handler', this.loadCookieList);
                // TODO: remove the layout specific condition ocne it's migrated for all layouts
                if (externalData.BannerVariables.commonData.allowHostOptOut) {
                    // Hosts list: Select all hosts checkbox handler
                    OT('#onetrust-pc-sdk #select-all-hosts-groups-handler').on('click', this.selectAllHostsGroupsHandler);
                    // Hosts list: Select particular host checkbox handler
                    OT('#onetrust-pc-sdk #hosts-list-container').on('click', this.selectHostsGroupHandler);
                }
            }
            if (externalData.BannerVariables.domainData.IsIabEnabled) {
                // PC: View vendors list click event
                OT('#onetrust-pc-sdk').on('click', '.category-vendors-list-handler', this.showVendorsList);
                // Vendors list: Select all vendors checkbox handler
                OT('#onetrust-pc-sdk #select-all-vendor-groups-handler').on('click', this.selectAllVendorsGroupsHandler);
                // Vendors list: Select particular vendor checkbox handler
                OT('#onetrust-pc-sdk #vendors-list-container').on('click', this.selectVendorsGroupHandler);
                // TODO: removed pagination,since user is not able view last accordion
                // Vendors list: vendor list sroll event
                // OT('#onetrust-pc-sdk #vendor-list-content').el[0].addEventListener('scroll', this.vendorListScrollEvent);
            }
            // Bind handlers only if host or vendors enabled
            if (externalData.BannerVariables.domainData.IsIabEnabled ||
                externalData.BannerVariables.commonData.showCookieList) {
                // Back button
                OT(document).on('click', '.back-btn-handler', this.backBtnHandler);
                // Search
                OT('#onetrust-pc-sdk #vendor-search-handler').on('keyup', function (e) {
                    var input = e.target.value;
                    if (externalData.BannerVariables.isCookieList) {
                        iabV2.searchHostList(input);
                    }
                    else {
                        externalData.BannerVariables.vendors.searchParam = input;
                        iabV2.loadVendorList(input, []);
                    }
                });
                //  Filter click event
                OT('#onetrust-pc-sdk #filter-btn-handler').on('click', this.toggleVendorFiltersHandler);
                // Apply filter action - all layouts
                OT('#onetrust-pc-sdk #filter-apply-handler').on('click', this.applyFilterHandler);
                if (coreNext.preferenceCenterGroup.name !== 'otPcPopup') {
                    // Vendors list: clear filters
                    OT('#onetrust-pc-sdk #clear-filters-handler').on('click', this.clearFiltersHandler);
                }
                else {
                    OT('#onetrust-pc-sdk #filter-cancel-handler').on('click', this.cancelFilterHandler);
                }
                OT('#onetrust-pc-sdk #filter-apply-handler').on('keydown', function (e) {
                    if ((e.keyCode === 9 || e.code === 'tab') && !e.shiftKey) {
                        e.preventDefault();
                        OT('#onetrust-pc-sdk .category-filter-handler').el[0].focus();
                    }
                });
                var categoryFilters = OT('#onetrust-pc-sdk .category-filter-handler')
                    .el;
                OT(categoryFilters[0]).on('keydown', function (e) {
                    if ((e.keyCode === 9 || e.code === 'tab') && e.shiftKey) {
                        e.preventDefault();
                        OT('#onetrust-pc-sdk #filter-apply-handler').el[0].focus();
                    }
                });
            }
        };
        // Cookie Settings: toggle handler
        SDKEventsV2.prototype.cookieSettingsToggleHandler = function () {
            this.toggleInfoDisplay();
            return false;
        };
        // PC: Preference center close button handler
        SDKEventsV2.prototype.hideCookieSettingsHandler = function (ev) {
            if (ev === void 0) { ev = window.event; }
            consentNoticeNext.hideConsentNoticeV2();
            consentNoticeNext.setBannerFocus(null, null, true);
            if (coreNext.preferenceCenterGroup.name === 'otPcPopup') {
                OT('#onetrust-pc-sdk #filter-cancel-handler').el[0].click();
            }
            if (coreNext.preferenceCenterGroup.name === 'otPcList') {
                OT('#onetrust-pc-sdk #content').removeClass('hide');
            }
            sdkEventsV2.hideVendorsList();
            var bannerVisible = false;
            var bannerHtml = document.getElementById('onetrust-banner-sdk');
            if (bannerHtml) {
                var bannerStyle = bannerHtml.getAttribute('style');
                if (bannerStyle) {
                    bannerVisible = bannerHtml.getAttribute('style').indexOf('display:none') !== -1;
                }
            }
            else {
                bannerVisible = true;
            }
            if (coreNext.mobileSDKEnabled && (externalData.isAlertBoxClosedAndValid() || bannerVisible)) {
                if (ev) {
                    ev.preventDefault();
                }
                sdkEventsV2.closePreferenceCenter();
            }
            return false;
        };
        // Select all hosts handler
        SDKEventsV2.prototype.selectAllHostsGroupsHandler = function (e) {
            var selectAllCheckBoxContainer = OT('#onetrust-pc-sdk #select-all-container .ot-checkbox').el[0];
            var hasClass = selectAllCheckBoxContainer.classList.contains('line-through');
            var hostsList = OT('#onetrust-pc-sdk .host-checkbox-handler').el;
            moduleHelper.setCheckedAttribute('#select-all-hosts-groups-handler', null, e.target.checked);
            for (var i = 0; i < hostsList.length; i++) {
                if (!hostsList[i].getAttribute('disabled')) {
                    moduleHelper.setCheckedAttribute(null, hostsList[i], e.target.checked);
                }
            }
            externalData.BannerVariables.optanonHostList.forEach(function (host) {
                externalData.BannerVariables.oneTrustHostConsent.some(function (hostId, index) {
                    if (!host.isActive && host.HostId === hostId.replace(/:0|:1/g, '')) {
                        externalData.BannerVariables.oneTrustHostConsent[index] = host.HostId + ":" + (e.target.checked ? '1' : '0');
                        return true;
                    }
                });
            });
            if (hasClass) {
                selectAllCheckBoxContainer.classList.remove('line-through');
            }
        };
        // Select individual host handler
        SDKEventsV2.prototype.selectHostsGroupHandler = function (event) {
            sdkEventsV2.toggleAccordionStatus(event);
            var hostId = event.target.getAttribute('hostId');
            if (hostId === null) {
                return;
            }
            var host;
            externalData.BannerVariables.optanonHostList.some(function (item) {
                if (item.HostId === hostId) {
                    host = item;
                    return true;
                }
            });
            moduleHelper.setCheckedAttribute(null, event.target, event.target.checked);
            sdkEventsV2.toggleHostStatus(host, event.target.checked);
        };
        // Toggle expanded/collapsed for the accordion headers based on aria-expanded true/false
        SDKEventsV2.prototype.toggleAccordionStatus = function (event) {
            var accordionInput = event.target;
            if (accordionInput && accordionInput.type === "checkbox" && (accordionInput.getAttribute('ot-accordion') === "true" || accordionInput.classList.contains('host-box') || accordionInput.classList.contains('vendor-box'))) {
                if (accordionInput.checked) {
                    accordionInput.setAttribute('aria-expanded', true);
                }
                else {
                    accordionInput.setAttribute('aria-expanded', false);
                }
            }
        };
        SDKEventsV2.prototype.toggleHostStatus = function (host, isEnabled) {
            var action = isEnabled
                ? 'Preferences Toggle On'
                : 'Preferences Toggle Off';
            publicAPINext.triggerGoogleAnalyticsEvent('OneTrust Cookie Consent', action, host.HostName, undefined);
            this.updateHostData(host.HostId, isEnabled);
        };
        SDKEventsV2.prototype.updateHostData = function (hostId, isEnabled) {
            var consent = isEnabled ? ':1' : ':0';
            var index = externalData.BannerVariables.oneTrustHostConsent.indexOf("" + hostId + (isEnabled ? ':0' : ':1'));
            if (index !== -1) {
                externalData.BannerVariables.oneTrustHostConsent[index] = "" + hostId + consent;
            }
        };
        SDKEventsV2.prototype.toggleBannerOptions = function () {
            var hasChkClass = OT(this).hasClass('chk');
            OT("input[name=\"" + OT(this).attr('name') + "\"]:not(:checked)").removeClass('chk');
            //checking radio input should make aria-expanded false for the other one.
            var bannerOptions = OT('.banner-option-input');
            bannerOptions.each(function (element) {
                OT(element).el.setAttribute('aria-expanded', false);
            });
            if (hasChkClass) {
                OT(this).removeClass('chk');
                OT(this).prop('checked', false);
                OT(this).attr('aria-expanded', false);
            }
            else {
                OT(this).addClass('chk');
                OT(this).prop('checked', true);
                OT(this).attr('aria-expanded', true);
            }
        };
        SDKEventsV2.prototype.bannerCloseButtonHandler = function (event) {
            if (event && event.target && event.target.className) {
                var currentElClassesName = event.target.className;
                if (currentElClassesName.indexOf('save-preference-btn-handler') > -1) {
                    externalData.BannerVariables.bannerCloseSource = BannerCloseSource.ConfirmChoiceButton;
                }
                else if (currentElClassesName.indexOf('banner-close-button') > -1) {
                    externalData.BannerVariables.bannerCloseSource = BannerCloseSource.BannerCloseButton;
                }
            }
            sdkEventsV2.hideVendorsList();
            return coreEvents.bannerCloseButtonHandler();
        };
        SDKEventsV2.prototype.hideCategoryContainer = function (isCookieList) {
            if (isCookieList === void 0) { isCookieList = false; }
            // Set host list flag
            externalData.BannerVariables.isCookieList = isCookieList;
            // Hide main container
            OT('#onetrust-pc-sdk .main-content').hide();
            // Show vendor container
            OT('#onetrust-pc-sdk #vendors-list').removeClass('hide');
            // Hide close button except popup and list container
            if (coreNext.preferenceCenterGroup.name !== 'otPcPopup' &&
                coreNext.preferenceCenterGroup.name !== 'otPcList') {
                OT('#onetrust-pc-sdk #close-pc-btn-handler.main').hide();
            }
            if (coreNext.preferenceCenterGroup.name === 'otPcList') {
                OT('#onetrust-pc-sdk').el[0].style.height = '';
            }
            if (isCookieList) {
                OT('#onetrust-pc-sdk #vendors-list #select-all-vendors-input-container').hide();
                if (externalData.BannerVariables.commonData.allowHostOptOut) {
                    OT('#onetrust-pc-sdk #vendors-list #select-all-hosts-input-container').show('inline-block');
                }
                else {
                    OT('#onetrust-pc-sdk #vendors-list #select-all-hosts-input-container').hide();
                }
                OT('#onetrust-pc-sdk #vendors-list #vendors-list-container').hide();
                OT('#onetrust-pc-sdk #vendors-list #hosts-list-container').show();
                // OT('#onetrust-pc-sdk #vendor-list-content').el[0].removeEventListener('scroll', bannerEventsObj().vendorListScrollEvent);
            }
            else {
                OT('#onetrust-pc-sdk #vendors-list #select-all-hosts-input-container').hide(); // hide host opt-out
                OT('#onetrust-pc-sdk #vendors-list #hosts-list-container').hide(); // hide hosts list
                OT('#onetrust-pc-sdk #vendors-list #vendors-list-container').show();
                OT('#onetrust-pc-sdk #vendors-list #select-all-container').show();
                OT('#onetrust-pc-sdk #vendors-list #select-all-vendors-input-container').show('inline-block');
                if (coreNext.preferenceCenterGroup.name === 'otPcCenter') {
                    OT('#onetrust-pc-sdk #vendors-list').removeClass('hosts-list');
                    OT('#onetrust-pc-sdk #vendor-list-content').removeClass('host-list-content');
                }
                // OT('#onetrust-pc-sdk #vendor-list-content').el[0].addEventListener('scroll', this.vendorListScrollEvent);
            }
            // Set filters content
            consentNoticeNext.setFilterList(isCookieList);
        };
        SDKEventsV2.prototype.showAllVendors = function () {
            sdkEventsV2.showCookieSettingsHandler();
            sdkEventsV2.showVendorsList(null, true);
        };
        SDKEventsV2.prototype.showVendorsList = function (event, isBanner) {
            if (isBanner === void 0) { isBanner = false; }
            // Hide content
            sdkEventsV2.hideCategoryContainer(false);
            if (!isBanner) {
                var selectedGroupId = this.getAttribute('data-parent-id');
                if (selectedGroupId) {
                    // ignore when it selected from the privacy
                    var selectedGroup = groupsNext.getGroupById(selectedGroupId);
                    if (selectedGroup) {
                        var subGroupIds = selectedGroup.SubGroups.concat([
                            selectedGroup
                        ]).reduce(function (accumulator, grp) {
                            if (IAB_GROUP_TYPES.indexOf(grp.Type) > -1) {
                                accumulator.push(groupsHelper.getGroupIdForCookie(grp));
                            }
                            return accumulator;
                        }, []);
                        externalData.BannerVariables.filterByIABCategories = externalData.BannerVariables.filterByIABCategories.concat(subGroupIds);
                    }
                }
            }
            // Set filter count and push the selection to array
            OT('#onetrust-pc-sdk #filter-count').text(externalData.BannerVariables.filterByIABCategories.length.toString());
            // Populate vendors content
            iabV2.loadVendorList('', externalData.BannerVariables.filterByIABCategories);
            // Update filters
            coreV2.updateFilterSelection(false);
            // set button focus
            sdkEventsV2.setBackButtonFocus();
            return false;
        };
        SDKEventsV2.prototype.loadCookieList = function () {
            // Hide content
            sdkEventsV2.hideCategoryContainer(true);
            var selectedGroupId = this.getAttribute('data-parent-id');
            var selectedGroup = groupsNext.getGroupById(selectedGroupId);
            // Set filter count and push the selection to array
            externalData.BannerVariables.filterByCategories.push(selectedGroupId);
            if (selectedGroup.SubGroups.length) {
                selectedGroup.SubGroups.forEach(function (subGroup) {
                    // Update the group id to the filter list to select them by default
                    if (IAB_GROUP_TYPES.indexOf(subGroup.Type) === -1) {
                        var subGroupId = groupsHelper.getGroupIdForCookie(subGroup);
                        if (externalData.BannerVariables.filterByCategories.indexOf(subGroupId) < 0) {
                            externalData.BannerVariables.filterByCategories.push(subGroupId);
                        }
                    }
                });
            }
            // Populate host content
            iabV2.loadHostList('', externalData.BannerVariables.filterByCategories);
            // Update the selection count
            OT('#onetrust-pc-sdk #filter-count').text(externalData.BannerVariables.filterByCategories.length.toString());
            // Update filters
            coreV2.updateFilterSelection(true);
            // Set button focus
            sdkEventsV2.setBackButtonFocus();
            return false;
        };
        SDKEventsV2.prototype.selectAllVendorsGroupsHandler = function (e) {
            var selectAllCheckBoxContainer = OT('#onetrust-pc-sdk #select-all-container .ot-checkbox').el[0];
            var hasClass = selectAllCheckBoxContainer.classList.contains('line-through');
            var vendorBoxes = OT('#onetrust-pc-sdk .vendor-checkbox-handler').el;
            for (var i = 0; i < vendorBoxes.length; i++) {
                moduleHelper.setCheckedAttribute(null, vendorBoxes[i], e.target.checked);
            }
            if (e.target.checked) {
                externalData.BannerVariables.vendors.selectedVendors = externalData.BannerVariables.vendors.list.map(function (vendor) { return vendor.vendorId + ':true'; });
            }
            else {
                externalData.BannerVariables.vendors.selectedVendors = [];
            }
            if (hasClass) {
                selectAllCheckBoxContainer.classList.remove('line-through');
            }
        };
        SDKEventsV2.prototype.selectVendorsGroupHandler = function (event) {
            sdkEventsV2.toggleAccordionStatus(event);
            var vendorId = event.target.getAttribute('vendorId');
            if (vendorId === null) {
                return;
            }
            var index = -1;
            externalData.BannerVariables.vendors.selectedVendors.some(function (vendor, idx) {
                if (vendor === vendorId + ':true') {
                    index = idx;
                    return true;
                }
            });
            if (index !== -1) {
                externalData.BannerVariables.vendors.selectedVendors.splice(index, 1);
            }
            else {
                externalData.BannerVariables.vendors.selectedVendors.push(vendorId + ':true');
            }
        };
        SDKEventsV2.prototype.vendorListScrollEvent = function (e) {
            var element = e.target;
            if (Math.ceil(element.scrollTop + element.clientHeight) >=
                element.scrollHeight &&
                iabV2.getBeginEnd().begin + 50 <=
                    externalData.BannerVariables.vendors.pageList.length) {
                iabV2.nextPage();
                element.scrollTop = 162;
            }
            if (element.scrollTop < 150 &&
                externalData.BannerVariables.vendors.currentPage > 1) {
                iabV2.previousPage();
                element.scrollTop = element.scrollHeight;
            }
        };
        SDKEventsV2.prototype.toggleVendorFiltersHandler = function () {
            var filterModal = OT('#onetrust-pc-sdk #filter-modal').el[0];
            // Handle the filter options based on preference center
            switch (coreNext.preferenceCenterGroup.name) {
                case 'otPcPanel':
                case 'otPcCenter':
                case 'otPcList':
                case 'otPcTab':
                    var triangle = OT('#onetrust-pc-sdk #triangle').el[0];
                    if (filterModal.style.display === 'block') {
                        OT(triangle).attr('style', 'display:none');
                        OT(filterModal).attr('style', 'display:none');
                    }
                    else {
                        var focusableElements = filterModal.querySelectorAll('[href], input, button');
                        OT(triangle).attr('style', 'display:block');
                        OT(filterModal).attr('style', 'display:block');
                        consentNoticeNext.setBannerFocus(focusableElements);
                    }
                    break;
                case 'otPcPopup':
                    if (window.innerWidth > 896 || window.screen.height > 896) {
                        filterModal.style.width = '400px';
                    }
                    else {
                        filterModal.setAttribute('style', 'height: 100%; width: 100%');
                    }
                    filterModal.querySelector('.ot-checkbox input').focus();
                    break;
                default:
                    return;
            }
        };
        SDKEventsV2.prototype.clearFiltersHandler = function () {
            var filters = OT('#onetrust-pc-sdk #filter-modal input').el;
            for (var i = 0; i < filters.length; i++) {
                if (filters[i].checked) {
                    filters[i].checked = false;
                }
            }
            if (externalData.BannerVariables.isCookieList) {
                externalData.BannerVariables.filterByCategories = [];
            }
            else {
                externalData.BannerVariables.filterByIABCategories = [];
            }
        };
        SDKEventsV2.prototype.cancelFilterHandler = function () {
            if (externalData.BannerVariables.isCookieList) {
                coreV2.cancelHostFilter();
            }
            else {
                iabV2.cancelVendorFilter();
            }
            sdkEventsV2.closeFilter();
            OT('#onetrust-pc-sdk #filter-btn-handler').focus();
        };
        SDKEventsV2.prototype.applyFilterHandler = function () {
            var filteredResults;
            if (externalData.BannerVariables.isCookieList) {
                filteredResults = coreV2.updateHostFilterList();
                iabV2.loadHostList('', filteredResults);
            }
            else {
                filteredResults = iabV2.updateVendorFilterList();
                iabV2.loadVendorList('', filteredResults);
            }
            OT('#onetrust-pc-sdk #filter-count').text(String(filteredResults.length));
            sdkEventsV2.closeFilter();
            OT('#onetrust-pc-sdk #filter-btn-handler').focus();
        };
        // Purpose of this functions to set pc container height only when groups is shown
        SDKEventsV2.prototype.setPcListContainerHeight = function () {
            // Exit from the function when vendor list is active
            if (OT('#onetrust-pc-sdk #content').el[0].classList.contains('hide')) {
                OT('#onetrust-pc-sdk').el[0].style.height = '';
                return;
            }
            setTimeout(function () {
                var containerHeight = window.innerHeight;
                // Calculate height for ipad and greater dimensions
                // For mobile devices setting window height(100%)
                if (window.innerWidth >= 768 && window.innerHeight >= 600) {
                    containerHeight = window.innerHeight * 0.8;
                }
                if (!OT('#onetrust-pc-sdk #content').el[0].scrollHeight ||
                    OT('#onetrust-pc-sdk #content').el[0].scrollHeight >= containerHeight) {
                    OT('#onetrust-pc-sdk').el[0].style.height = containerHeight + 'px';
                }
                else {
                    OT('#onetrust-pc-sdk').el[0].style.height = 'auto';
                }
            });
        };
        SDKEventsV2.prototype.changeSelectedTab = function (e) {
            var menuTabs = OT('#onetrust-pc-sdk .category-menu-switch-handler');
            var index = 0;
            var oldTab = OT(menuTabs.el[0]);
            menuTabs.each(function (element, idx) {
                if (OT(element).el.classList.contains('active-group')) {
                    index = idx;
                    OT(element).el.classList.remove('active-group');
                    oldTab = OT(element);
                }
            });
            var newTab;
            if (e.keyCode === 39) {
                if (index + 1 >= menuTabs.el.length) {
                    newTab = OT(menuTabs.el[0]);
                }
                else {
                    newTab = OT(menuTabs.el[index + 1]);
                }
            }
            else if (e.keyCode === 37) {
                if (index - 1 < 0) {
                    newTab = OT(menuTabs.el[menuTabs.el.length - 1]);
                }
                else {
                    newTab = OT(menuTabs.el[index - 1]);
                }
            }
            this.tabMenuToggle(newTab, oldTab);
        };
        // PC: Menu switch handler - Only for Tab layout
        SDKEventsV2.prototype.categoryMenuSwitchHandler = function () {
            var groups = OT('.category-menu-switch-handler').el;
            var _loop_1 = function (i) {
                var handler = function (event) {
                    for (var j = 0; j < groups.length; j++) {
                        var toggleElementGroup = groups[j].parentElement.parentElement;
                        toggleElementGroup
                            .querySelector('.description-container')
                            .classList.add('hide');
                        groups[j].classList.remove('active-group');
                        toggleElementGroup.querySelector('.category-menu-switch-handler').setAttribute('tabindex', -1);
                        toggleElementGroup.querySelector('.category-menu-switch-handler').setAttribute('aria-selected', false);
                    }
                    event.currentTarget.setAttribute("tabindex", 0);
                    event.currentTarget.setAttribute("aria-selected", true);
                    event.currentTarget.parentElement.parentElement
                        .querySelector('.description-container')
                        .classList.remove('hide');
                    event.currentTarget.classList.add('active-group');
                };
                groups[i].addEventListener('click', handler);
                groups[i].addEventListener('keydown', function (event) {
                    if (event.keyCode === 32 || event.code === 'space') {
                        handler(event);
                        event.preventDefault();
                        return false;
                    }
                });
            };
            for (var i = 0; i < groups.length; i++) {
                _loop_1(i);
            }
        };
        SDKEventsV2.prototype.tabMenuToggle = function (newTab, oldTab) {
            newTab.el.setAttribute("tabindex", 0);
            newTab.el.setAttribute("aria-selected", true);
            oldTab.el.setAttribute("tabindex", -1);
            oldTab.el.setAttribute("aria-selected", false);
            newTab.focus();
            // hiding the oldTab description and making it not tabbable
            oldTab.el.parentElement.parentElement
                .querySelector('.description-container')
                .classList.add('hide');
            // make newTab description tabbable and showing the content.
            newTab.el.parentElement.parentElement
                .querySelector('.description-container')
                .classList.remove('hide');
            newTab.el.classList.add('active-group');
        };
        // PC: hiding vendors list
        SDKEventsV2.prototype.hideVendorsList = function () {
            OT('#onetrust-pc-sdk .main-content').show();
            OT('#onetrust-pc-sdk #close-pc-btn-handler.main').show();
            OT('#onetrust-pc-sdk #vendors-list').addClass('hide');
        };
        SDKEventsV2.prototype.closeFilter = function () {
            var filterModal = OT('#onetrust-pc-sdk #filter-modal').el[0];
            var triangle = OT('#onetrust-pc-sdk #triangle').el[0];
            if (coreNext.preferenceCenterGroup.name === 'otPcPopup') {
                if (window.innerWidth > 896 || window.screen.height > 896) {
                    filterModal.style.width = '0';
                }
                else {
                    filterModal.setAttribute('style', 'height:0');
                }
            }
            else {
                filterModal.setAttribute('style', 'display:none');
            }
            if (triangle) {
                OT(triangle).attr('style', 'display:none');
            }
        };
        SDKEventsV2.prototype.setBackButtonFocus = function () {
            // Set focus on back button
            OT('#onetrust-pc-sdk .back-btn-handler').el[0].focus();
        };
        // Toggles consent notice visible state
        SDKEventsV2.prototype.toggleInfoDisplay = function () {
            OT('.onetrust-pc-dark-filter').el[0].setAttribute('style', '');
            OT('#onetrust-pc-sdk').el[0].setAttribute('style', '');
            if (!externalData.BannerVariables.isPCVisible) {
                coreEvents.TogglePreferenceCenter(true, true);
                externalData.BannerVariables.isPCVisible = true;
            }
        };
        SDKEventsV2.prototype.close = function (closeFromCookie) {
            coreEvents.bannerCloseButtonHandler(closeFromCookie);
        };
        // Moved from mobile sdk public api
        SDKEventsV2.prototype.closePreferenceCenter = function () {
            window.location.href = 'http://otsdk//consentChanged';
        };
        SDKEventsV2.prototype.initializeAlartHtmlAndHandler = function () {
            this.insertAlertHtml();
            this.initialiseAlertHandlers();
        };
        SDKEventsV2.prototype.setBannerPosition = function () {
            var bannerName = coreNext.bannerGroup.name;
            if (bannerName === 'otFlat') {
                if (externalData.BannerVariables.domainData.BannerPosition === 'bottom') {
                    OT('#onetrust-banner-sdk').css('bottom: -99px');
                    OT('#onetrust-banner-sdk').animate({ bottom: '0px' }, 1000);
                    setTimeout(function () {
                        OT('#onetrust-banner-sdk').css('bottom: 0px');
                    }, 1000);
                }
                else {
                    OT('#onetrust-banner-sdk').css('top: -99px; bottom: auto');
                    if (externalData.BannerVariables.pagePushedDown && !bannerPushDown.checkIsBrowserIE11OrBelow()) {
                        bannerPushDown.BannerPushDownHandler();
                    }
                    else {
                        OT('#onetrust-banner-sdk').animate({ top: '0' }, 1000);
                        setTimeout(function () {
                            OT('#onetrust-banner-sdk').css('top: 0px; bottom: auto');
                        }, 1000);
                    }
                }
                return;
            }
            if (bannerName === 'otFloatingRoundedCorner' || bannerName === 'otFloatingRounded') {
                OT('#onetrust-banner-sdk').css('bottom: -300px');
                OT('#onetrust-banner-sdk').animate({ bottom: '1em' }, 2000);
                setTimeout(function () {
                    OT('#onetrust-banner-sdk').css('bottom: 1rem');
                }, 2000);
                return;
            }
            if (bannerName === 'otFlat' || bannerName === 'otFloatingRoundedCorner') {
                OT('#onetrust-banner-sdk').animate({ top: '0px' }, 1000);
            }
        };
        SDKEventsV2.prototype.initialiseAlertHandlers = function () {
            var json = externalData.BannerVariables.domainData;
            this.setBannerPosition();
            if (json.ForceConsent) {
                if (!consentNoticeNext.isCookiePolicyPage(json.AlertNoticeText)) {
                    OT('.onetrust-pc-dark-filter')
                        .removeClass('hide')
                        .css('z-index:2147483645');
                }
            }
            // On Click Accepts All
            if (json.OnClickCloseBanner) {
                var bodyEvent = function (element) {
                    if (element.target.closest('#onetrust-banner-sdk') ||
                        element.target.closest('#onetrust-pc-sdk') ||
                        element.target.closest('.onetrust-pc-dark-filter') ||
                        element.target.closest('.ot-sdk-show-settings') ||
                        element.target.closest('.optanon-show-settings') ||
                        element.target.closest('.optanon-toggle-display')) {
                        return;
                    }
                    coreEvents.onClickCloseBanner(element);
                };
                document.body.addEventListener('click', bodyEvent);
            } // On Click Accepts All END
            // On Scroll Accepts All
            if (json.ScrollCloseBanner) {
                window.addEventListener('scroll', coreEvents.scrollCloseBanner);
                // TODO this was OT.one, I think it's supposed to be .on according to TS. Double check this.
                OT(document).on('click', '.onetrust-close-btn-handler', coreEvents.rmScrollEventListener);
                OT(document).on('click', '#onetrust-accept-btn-handler', coreEvents.rmScrollEventListener);
                OT(document).on('click', '#accept-recommended-btn-handler', coreEvents.rmScrollEventListener);
            } // On Scroll Accepts All END
            if (json.NextPageCloseBanner) {
                coreEvents.nextPageCloseBanner();
            }
            OT(document).on('click', '.onetrust-vendors-list-handler', this.showAllVendors);
        };
        SDKEventsV2.prototype.insertAlertHtml = function () {
            var _this = this;
            var domainData = externalData.BannerVariables.domainData;
            var commonData = externalData.BannerVariables.commonData;
            var cmpConfig = [
                {
                    type: 'purpose',
                    titleKey: 'BannerPurposeTitle',
                    descriptionKey: 'BannerPurposeDescription',
                    identifier: 'purpose-option'
                },
                {
                    type: 'feature',
                    titleKey: 'BannerFeatureTitle',
                    descriptionKey: 'BannerFeatureDescription',
                    identifier: 'feature-option'
                },
                {
                    type: 'information',
                    titleKey: 'BannerInformationTitle',
                    descriptionKey: 'BannerInformationDescription',
                    identifier: 'information-option'
                }
            ];
            var cmpEnabled = (domainData.BannerPurposeTitle && domainData.BannerPurposeDescription) ||
                (domainData.BannerFeatureTitle && domainData.BannerFeatureDescription) ||
                (domainData.BannerInformationTitle &&
                    domainData.BannerInformationDescription);
            var fragment = document.createDocumentFragment();
            var fm = function (selector) {
                return fragment.querySelector(selector);
            };
            var fmAll = function (selector) {
                return fragment.querySelectorAll(selector);
            };
            if (coreNext.bannerGroup) {
                var rootHtml = document.createElement('div');
                OT(rootHtml).html(coreNext.bannerGroup.html);
                var banner = rootHtml.querySelector('#onetrust-banner-sdk');
                var bannerCloseBtns = void 0;
                // Check if we need RTL on the banner
                if (externalData.BannerVariables.commonData.useRTL) {
                    OT(banner).attr('dir', 'rtl');
                }
                // Set Banner Position
                if (domainData.BannerPosition) {
                    OT(banner).addClass(domainData.BannerPosition);
                }
                // Dynamically set the classes depending on what the user has selected.
                OT(fragment).append(banner);
                // Set Banner Title
                if (domainData.BannerTitle) {
                    OT(fm('#onetrust-policy-title')).html(domainData.BannerTitle);
                }
                else {
                    OT(fm('#onetrust-policy')).el.removeChild(OT(fm('#onetrust-policy-title')).el);
                }
                // Set Banner Alert Notice
                OT(fm('#onetrust-policy-text')).html(domainData.AlertNoticeText);
                // Set Banner vendor link
                if (domainData.IsIabEnabled && domainData.BannerIABPartnersLink) {
                    OT(fm('#onetrust-policy-text'))
                        .append("<a class=\"onetrust-vendors-list-handler\" role=\"button\" href=\"javascript:void(0)\">\n          " + domainData.BannerIABPartnersLink + "\n          </a>");
                }
                // Set Banner Accept Button
                if (!commonData.showBannerAcceptButton) {
                    fm('#onetrust-accept-btn-handler').parentElement.removeChild(fm('#onetrust-accept-btn-handler'));
                }
                else {
                    OT(fm('#onetrust-accept-btn-handler')).html(domainData.AlertAllowCookiesText);
                    if (coreNext.bannerGroup.name === 'otFloatingRounded'
                        && !commonData.showBannerCookieSettings
                        && !domainData.BannerShowRejectAllButton) {
                        OT(fm('#onetrust-accept-btn-handler').parentElement).addClass('accept-btn-only');
                    }
                }
                // Set Reject All Button
                if (domainData.BannerShowRejectAllButton &&
                    domainData.BannerRejectAllButtonText.trim()) {
                    OT(fm('#onetrust-reject-all-handler')).html(domainData.BannerRejectAllButtonText);
                    fm('#onetrust-button-group-parent').classList.add('has-reject-all-button');
                }
                else {
                    fm('#onetrust-reject-all-handler').parentElement.removeChild(fm('#onetrust-reject-all-handler'));
                }
                // Set Banner Preference Center Button
                if (!commonData.showBannerCookieSettings) {
                    fm('#onetrust-pc-btn-handler').parentElement.removeChild(fm('#onetrust-pc-btn-handler'));
                }
                else {
                    OT(fm('#onetrust-pc-btn-handler')).html(domainData.AlertMoreInfoText);
                    if (domainData.BannerSettingsButtonDisplayLink) {
                        fm('#onetrust-pc-btn-handler').classList.add('cookie-setting-link');
                    }
                    if (coreNext.bannerGroup.name === 'otFloatingRounded' && !commonData.showBannerAcceptButton) {
                        OT(fm('#onetrust-pc-btn-handler')).addClass('cookie-settings-btn-only');
                    }
                }
                if (!commonData.showBannerAcceptButton &&
                    !commonData.showBannerCookieSettings &&
                    !domainData.BannerShowRejectAllButton) {
                    if (coreNext.bannerGroup.name !== 'otFlat' &&
                        coreNext.bannerGroup.name !== 'otFloatingFlat') {
                        fm('#onetrust-button-group-parent').parentElement.removeChild(fm('#onetrust-button-group-parent'));
                    }
                }
                bannerCloseBtns = OT(fmAll('.banner-close-button')).el;
                if (!domainData.showBannerCloseButton) {
                    for (var i = 0; i < bannerCloseBtns.length; i++) {
                        OT(bannerCloseBtns[i].parentElement).el.removeChild(bannerCloseBtns[i]);
                    }
                }
                /**
                 * CMP related logic starts
                 */
                if (cmpEnabled) {
                    if (coreNext.bannerGroup.name === 'otFloatingRoundedIcon') {
                        this.setFloatingRoundedIconBannerCmpOptions(fm, cmpConfig);
                    }
                    else {
                        this.setCmpBannerOptions(fm, cmpConfig);
                    }
                    OT(window).on('resize', function () {
                        if (window.innerWidth <= 896) {
                            _this.setBannerOptionContent();
                        }
                    });
                }
                else {
                    var bannerOptionContainer = OT(fm('#banner-options')).el;
                    if (coreNext.bannerGroup.name === 'otFloatingFlat') {
                        bannerOptionContainer = OT(fm('.banner-options-card')).el;
                    }
                    bannerOptionContainer.parentElement.removeChild(bannerOptionContainer);
                }
                /**
                 * CMP related logic ends
                 */
            }
            var oneTrustDOM = document.createElement('div');
            OT(oneTrustDOM).append(fragment);
            if (!externalData.BannerVariables.ignoreInjectingHtmlCss) {
                OT('#onetrust-consent-sdk').append(oneTrustDOM.firstChild);
                if (cmpEnabled) {
                    this.setBannerOptionContent();
                }
            }
            var groupContainer = OT('#onetrust-group-container').el;
            var buttonGroupParent = OT('#onetrust-button-group-parent').el;
            if ((groupContainer.length && groupContainer[0].clientHeight) <
                (buttonGroupParent.length && buttonGroupParent[0].clientHeight)) {
                OT('#onetrust-banner-sdk').removeClass('vertical-align-content');
            }
            consentNoticeNext.processedHTML = OT('#onetrust-consent-sdk').el[0].outerHTML;
        };
        SDKEventsV2.prototype.setCmpBannerOptions = function (fm, cmpConfig) {
            var domainData = externalData.BannerVariables.domainData;
            var bannerOption = OT(fm('#banner-options .banner-option')).el.cloneNode(true);
            OT(fm('#banner-options')).html('');
            var optionId = 1;
            cmpConfig.forEach(function (config) {
                var option = bannerOption.cloneNode(true);
                // TODO this was as keyof DomainData but TS is mad. Why?
                var title = domainData[config.titleKey];
                var description = domainData[config.descriptionKey];
                if (title && description) {
                    option.querySelector('.banner-option-header :first-child').innerHTML = title;
                    option.querySelector('input').setAttribute('aria-controls', 'option-details-' + optionId);
                    option.querySelector('.banner-option-details').setAttribute('id', 'option-details-' + optionId++);
                    option.querySelector('.banner-option-details').innerHTML = description;
                    option.querySelector('input').id = config.identifier;
                    option.querySelector('label').setAttribute('for', config.identifier);
                    OT(fm('#banner-options')).el.appendChild(option);
                }
            });
        };
        SDKEventsV2.prototype.setFloatingRoundedIconBannerCmpOptions = function (fm, cmpConfig) {
            var domainData = externalData.BannerVariables.domainData;
            var inputContainer = OT(fm('#banner-options input')).el.cloneNode(true);
            var labelContainer = OT(fm('#banner-options label')).el.cloneNode(true);
            var optionDetailContainer = OT(fm('.banner-option-details')).el.cloneNode(true);
            OT(fm('#banner-options')).html('');
            // Append CMP title
            cmpConfig.forEach(function (config) {
                var input = inputContainer.cloneNode(true);
                var label = labelContainer.cloneNode(true);
                var title = domainData[config.titleKey];
                var description = domainData[config.descriptionKey];
                if (title && description) {
                    input.setAttribute('id', config.identifier);
                    label.setAttribute('for', config.identifier);
                    label.querySelector('.banner-option-header :first-child').innerHTML = title;
                    OT(fm('#banner-options')).el.appendChild(input);
                    OT(fm('#banner-options')).el.appendChild(label);
                }
            });
            // Append descriptions
            cmpConfig.forEach(function (config) {
                var title = domainData[config.titleKey];
                var description = domainData[config.descriptionKey];
                if (title && description) {
                    var detailContainer = optionDetailContainer.cloneNode(true);
                    detailContainer.innerHTML = description;
                    detailContainer.classList.add(config.identifier);
                    OT(fm('#banner-options')).el.appendChild(detailContainer);
                }
            });
        };
        SDKEventsV2.prototype.setBannerOptionContent = function () {
            if (coreNext.bannerGroup.name === 'otFlat' ||
                coreNext.bannerGroup.name === 'otFloatingRoundedIcon') {
                setTimeout(function () {
                    if (window.innerWidth < 769) {
                        var bannerOptionsContent = OT('#banner-options').el[0].cloneNode(true);
                        OT('#banner-options').el[0].parentElement.removeChild(OT('#banner-options').el[0]);
                        OT('#onetrust-group-container').el[0].appendChild(bannerOptionsContent);
                    }
                    else {
                        var bannerOptionsContent = OT('#banner-options').el[0].cloneNode(true);
                        OT('#banner-options').el[0].parentElement.removeChild(OT('#banner-options').el[0]);
                        if (coreNext.bannerGroup.name === 'otFloatingRoundedIcon') {
                            OT('.banner-content').el[0].appendChild(bannerOptionsContent);
                        }
                        else {
                            OT('#onetrust-banner-sdk').el[0].appendChild(bannerOptionsContent);
                        }
                    }
                });
            }
        };
        // Reject all except always active groups
        SDKEventsV2.prototype.RejectAll = function (consentIgnoreForGeoLookup) {
            var groupElements = groupsV2.getAllGroupElements();
            for (var i = 0; i < groupElements.length; i++) {
                var groupStatus = groupsNext.safeGroupDefaultStatus(groupsNext.getGroupById(groupElements[i].getAttribute('data-optanongroupid')));
                if (groupStatus.toLowerCase() !== 'always active') {
                    groupsV2.toogleGroupElementOff(groupElements[i]);
                    groupsV2.toogleSubGroupElementOff(groupElements[i]);
                }
            }
            coreEvents.bannerActionsHandler(consentIgnoreForGeoLookup, false, true);
            if (externalData.BannerVariables.domainData.IsIabEnabled) {
                iabV2.updateIabVariableReference();
            }
        };
        return SDKEventsV2;
    }());
    var sdkEventsV2;
    function initializeSdkEventsV2() {
        sdkEventsV2 = new SDKEventsV2();
    }

    var commonStyles = new CommonStyles().importCSS();
    var ConsentNoticeV2 = /** @class */ (function () {
        function ConsentNoticeV2() {
            this.processedCSS = '';
            this.iab = iabV2;
            this.groupsClass = groupsV2;
            this.core = coreV2;
            this.ONETRUST_SHOW_SETTINGS = '.ot-sdk-show-settings';
            this.ONETRUST_COOKIE_POLICY = '#ot-sdk-cookie-policy, #optanon-cookie-policy';
            this.addCustomBannerCSS = function () {
                var backgroundColor = externalData.BannerVariables.commonData.backgroundColor;
                var buttonColor = externalData.BannerVariables.commonData.buttonColor;
                var textColor = externalData.BannerVariables.commonData.textColor;
                var buttonTextColor = externalData.BannerVariables.commonData.buttonTextColor;
                var accordionBackgroundColor = externalData.BannerVariables.commonData.bannerAccordionBackgroundColor;
                var finalCSS = "\n        " + (coreNext.bannerGroup.name === 'otFloatingFlat'
                    ? "" + (backgroundColor
                        ? "#onetrust-consent-sdk #onetrust-banner-sdk > .ot-sdk-container {\n                    background-color: " + backgroundColor + ";}"
                        : '')
                    : "" + (backgroundColor
                        ? "#onetrust-consent-sdk #onetrust-banner-sdk {background-color: " + backgroundColor + ";}"
                        : '')) + "\n            " + (textColor
                    ? "#onetrust-consent-sdk #onetrust-policy-title,\n                    #onetrust-consent-sdk #onetrust-policy-text,\n                    #onetrust-consent-sdk #onetrust-policy-text *:not(.onetrust-vendors-list-handler){\n                        color: " + textColor + ";\n                    }"
                    : '') + "\n            " + (accordionBackgroundColor ? "#onetrust-consent-sdk #onetrust-banner-sdk .banner-option-details {\n                    background-color: " + accordionBackgroundColor + ";}"
                    : '') + "\n            ";
                if (buttonColor || buttonTextColor) {
                    finalCSS += "#onetrust-consent-sdk #onetrust-accept-btn-handler,\n                         #onetrust-banner-sdk #onetrust-reject-all-handler,\n                         #onetrust-consent-sdk #onetrust-pc-btn-handler {\n                            " + (buttonColor
                        ? "background-color: " + buttonColor + ";border-color: " + buttonColor + ";"
                        : '') + "\n                            " + (buttonTextColor
                        ? "color: " + buttonTextColor + ";"
                        : '') + "\n                        }";
                    finalCSS += "#onetrust-consent-sdk #onetrust-pc-btn-handler.cookie-setting-link {\n                            border-color: " + backgroundColor + ";\n                            background-color: " + backgroundColor + ";\n                            " + (buttonColor ? "color: " + buttonColor : '') + "\n                        }";
                }
                if (externalData.BannerVariables.commonData.bannerCustomCSS) {
                    finalCSS += externalData.BannerVariables.commonData.bannerCustomCSS;
                }
                return finalCSS;
            };
            this.addCustomPreferenceCenterCSS = function () {
                var backgroundColor = externalData.BannerVariables.commonData.pcBackgroundColor;
                var buttonColor = externalData.BannerVariables.commonData.pcButtonColor;
                var textColor = externalData.BannerVariables.commonData.pcTextColor;
                var buttonTextColor = externalData.BannerVariables.commonData.pcButtonTextColor;
                var pclinkTextColor = externalData.BannerVariables.commonData.pcLinksTextColor;
                var bannerTextColor = externalData.BannerVariables.commonData.bannerLinksTextColor;
                var accordionToggle = externalData.BannerVariables.domainData.PCenterEnableAccordion;
                var accordionColor = externalData.BannerVariables.commonData.pcAccordionBackgroundColor;
                var menuColor = externalData.BannerVariables.commonData.pcMenuColor;
                var menuHighlightColor = externalData.BannerVariables.commonData.pcMenuHighLightColor;
                var finalCSS = "\n            " + (backgroundColor
                    ? (coreNext.preferenceCenterGroup.name === 'otPcList'
                        ? '#onetrust-consent-sdk #onetrust-pc-sdk .group-parent-container,#onetrust-consent-sdk #onetrust-pc-sdk .manage-pc-container, #onetrust-pc-sdk #vendors-list'
                        : '#onetrust-consent-sdk #onetrust-pc-sdk') + ",\n                #onetrust-consent-sdk #search-container,\n                " + (accordionToggle && coreNext.preferenceCenterGroup.name === 'otPcList' ? '#onetrust-consent-sdk #onetrust-pc-sdk .ot-accordion-layout.category-item' : '#onetrust-consent-sdk #onetrust-pc-sdk .ot-switch.toggle') + ",\n                #onetrust-consent-sdk #onetrust-pc-sdk .group-toggle .checkbox,\n                #onetrust-consent-sdk #onetrust-pc-sdk #pc-title:after {\n                    background-color: " + backgroundColor + ";\n                } "
                    : '') + "\n            " + (textColor
                    ? "#onetrust-consent-sdk #onetrust-pc-sdk h3,\n                #onetrust-consent-sdk #onetrust-pc-sdk h4,\n                #onetrust-consent-sdk #onetrust-pc-sdk h6,\n                #onetrust-consent-sdk #onetrust-pc-sdk p,\n                #onetrust-consent-sdk #onetrust-pc-sdk #pc-policy-text,\n                #onetrust-consent-sdk #onetrust-pc-sdk #pc-title\n                {\n                    color: " + textColor + ";\n                }"
                    : '') + "\n            " + (pclinkTextColor
                    ? " #onetrust-consent-sdk #onetrust-pc-sdk .privacy-notice-link,\n                    #onetrust-consent-sdk #onetrust-pc-sdk .category-vendors-list-handler,\n                    #onetrust-consent-sdk #onetrust-pc-sdk .category-host-list-handler,\n                    #onetrust-consent-sdk #onetrust-pc-sdk .vendor-privacy-notice,\n                    #onetrust-consent-sdk #onetrust-pc-sdk #hosts-list-container .host-title a,\n                    #onetrust-consent-sdk #onetrust-pc-sdk #hosts-list-container .accordion-header .host-view-cookies,\n                    #onetrust-consent-sdk #onetrust-pc-sdk #hosts-list-container .cookie-name-container a\n                    {\n                        color: " + pclinkTextColor + ";\n                    }"
                    : '') + "\n            " + (bannerTextColor
                    ? " #onetrust-consent-sdk #onetrust-banner-sdk a[href]\n                        {\n                            color: " + bannerTextColor + ";\n                        }"
                    : '') + "\n            #onetrust-consent-sdk #onetrust-pc-sdk .category-vendors-list-handler:hover { opacity: .7;}\n            " + (accordionToggle && accordionColor ? "#onetrust-consent-sdk #onetrust-pc-sdk .accordion-text,\n            #onetrust-consent-sdk #onetrust-pc-sdk .accordion-text .cookie-subgroup-toggle .ot-switch.toggle\n             {\n                background-color: " + accordionColor + ";\n            }" : '') + "\n        ";
                if (buttonColor || buttonTextColor) {
                    finalCSS += "#onetrust-consent-sdk #onetrust-pc-sdk button {\n                " + (buttonColor
                        ? "background-color: " + buttonColor + ";border-color: " + buttonColor + ";"
                        : '') + "\n                " + (buttonTextColor ? "color: " + buttonTextColor + ";" : '') + "\n            }\n            #onetrust-consent-sdk #onetrust-pc-sdk .active-group {\n                " + (buttonColor ? "border-color: " + buttonColor + ";" : '') + "\n            }";
                }
                // Menu and Menu highlight color is applicable only for Tab layout
                if (coreNext.preferenceCenterGroup.name === 'otPcTab') {
                    if (menuColor) {
                        finalCSS += "#onetrust-consent-sdk #onetrust-pc-sdk .group {\n                    background-color: " + menuColor + "\n                }";
                    }
                    if (menuHighlightColor) {
                        finalCSS += "#onetrust-consent-sdk #onetrust-pc-sdk .active-group {\n                    background-color: " + menuHighlightColor + "\n                }";
                    }
                }
                if (externalData.BannerVariables.commonData.pcCustomCSS) {
                    finalCSS += externalData.BannerVariables.commonData.pcCustomCSS;
                }
                return finalCSS;
            };
            this.addCustomCookieListCSS = function () {
                var commonData = externalData.BannerVariables.commonData;
                var v2CookiePolicyID = commonData.CookiesV2NewCookiePolicy ? '-v2.ot-sdk-cookie-policy' : '';
                var finalCSS = "\n                " + (commonData.cookieListPrimaryColor
                    ? "\n                    #ot-sdk-cookie-policy" + v2CookiePolicyID + " h6,\n                    #ot-sdk-cookie-policy" + v2CookiePolicyID + " li,\n                    #ot-sdk-cookie-policy" + v2CookiePolicyID + " p,\n                    #ot-sdk-cookie-policy" + v2CookiePolicyID + " a,\n                    #ot-sdk-cookie-policy" + v2CookiePolicyID + " span,\n                    #ot-sdk-cookie-policy" + v2CookiePolicyID + " #cookie-policy-description {\n                        color: " + commonData.cookieListPrimaryColor + ";\n                    }"
                    : '') + "\n                    " + (commonData.cookieListTableHeaderColor
                    ? "#ot-sdk-cookie-policy" + v2CookiePolicyID + " th {\n                        color: " + commonData.cookieListTableHeaderColor + ";\n                    }"
                    : '') + "\n                    " + (commonData.cookieListGroupNameColor
                    ? "#ot-sdk-cookie-policy" + v2CookiePolicyID + " .ot-sdk-cookie-policy-group {\n                        color: " + commonData.cookieListGroupNameColor + ";\n                    }"
                    : '') + "\n                    " + (commonData.cookieListTitleColor
                    ? "\n                    #ot-sdk-cookie-policy" + v2CookiePolicyID + " #cookie-policy-title {\n                            color: " + commonData.cookieListTitleColor + ";\n                        }\n                    "
                    : '') + "\n            " + (v2CookiePolicyID && commonData.CookieListTableHeaderBackgroundColor
                    ? "\n                    #ot-sdk-cookie-policy" + v2CookiePolicyID + " table th {\n                            background-color: " + commonData.CookieListTableHeaderBackgroundColor + ";\n                        }\n                    "
                    : '') + "\n            ";
                if (commonData.cookieListCustomCss) {
                    finalCSS += commonData.cookieListCustomCss;
                }
                return finalCSS;
            };
        }
        ConsentNoticeV2.prototype.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, coreNext.consentNoticeInit()];
                        case 1:
                            _a.sent();
                            this.mobileSDKEnabled = coreNext.mobileSDKEnabled;
                            return [2 /*return*/];
                    }
                });
            });
        };
        ConsentNoticeV2.prototype.setParentGroupName = function (currentCategoryGroup, groupName, headerId, descripId) {
            // Set Category / Group name
            if (currentCategoryGroup.querySelector('h4')) {
                OT(currentCategoryGroup.querySelector('h4')).html(groupName);
                OT(currentCategoryGroup.querySelector('h4')).attr('id', headerId);
            }
            else {
                OT(currentCategoryGroup.querySelector('h3')).html(groupName);
                OT(currentCategoryGroup.querySelector('h3')).attr('id', headerId);
            }
            // Set group name for Tab layout (Right side)
            if (coreNext.preferenceCenterGroup.name === 'otPcTab') {
                currentCategoryGroup.querySelector('.category-header').innerHTML = groupName;
                // tab and tabpanel controls for Preference Center Tabs
                currentCategoryGroup.querySelector('.description-container').setAttribute('aria-labelledby', headerId);
                currentCategoryGroup.querySelector('.description-container').setAttribute('id', descripId);
                currentCategoryGroup.querySelector('.category-menu-switch-handler').setAttribute('aria-controls', descripId);
            }
        };
        ConsentNoticeV2.prototype.setParentGroupToggle = function (currentCategoryGroup, group, json, groupName, id, headerId, descripId) {
            /**
             * Set group toggles only for consentable groups
             * Before calling this function make sure currentCategoryGroup element has only 1 or 2 input element(s) within a container
             * Set Toggle ID and Label "for" attribute
             */
            if (NON_CONSENTABLE_GROUPS.indexOf(group.Type) === -1) {
                this.setToggleProps(currentCategoryGroup, group, id, headerId);
                // Set ARIA attributes for Popup Layout
                if (coreNext.preferenceCenterGroup.name === "otPcPopup") {
                    currentCategoryGroup.querySelector('input').setAttribute('ot-accordion', true);
                    currentCategoryGroup.querySelector('input').setAttribute('aria-label', groupName);
                    currentCategoryGroup.querySelector('.accordion-text').setAttribute('id', descripId);
                    currentCategoryGroup.querySelector('input').setAttribute('aria-controls', descripId);
                    var inputId = currentCategoryGroup.querySelector('input').getAttribute('id');
                    currentCategoryGroup.querySelector('.accordion-text').setAttribute('aria-labelledby', inputId);
                }
                var labelText = currentCategoryGroup.querySelector('.label-text'); // Set Screen Reader Text
                if (labelText) {
                    OT(labelText).html(groupName);
                }
            }
            else {
                moduleHelper.removeChild(currentCategoryGroup.querySelector('.toggle:not(.ot-switch)') ||
                    currentCategoryGroup.querySelectorAll('.ot-switch.toggle input, .ot-switch.toggle label'));
            }
        };
        ConsentNoticeV2.prototype.setParentGroupDescription = function (currentCategoryGroup, group, json) {
            var pcName = coreNext.preferenceCenterGroup.name;
            // Making it false by default only for these layout till it's implemented
            if (pcName === 'otPcTab') {
                json.PCenterEnableAccordion = false;
            }
            // Either insert a group description or legal text if it's a IAB 2.0 related groups
            var groupDescription = this.groupsClass.safeFormattedGroupDescription(group);
            if (IAB2_GROUPS_WITH_LEGAL_TEXT.indexOf(group.Type) > -1) {
                groupDescription = group.DescriptionLegal;
            }
            // Only for Popup layout
            if (pcName === 'otPcPopup') {
                if (!group.ShowVendorList || json.IabType === 'IAB') {
                    OT(currentCategoryGroup.querySelector('p:not(.always-active)')).html(groupDescription);
                }
                else {
                    if (group.Type === GROUP_TYPES.IAB2_STACK) {
                        moduleHelper.removeChild(currentCategoryGroup.querySelector('.ot-accordion-group-pc-container'));
                    }
                    else {
                        OT(currentCategoryGroup.querySelector('.ot-accordion-group-pc-container')).html(groupDescription);
                    }
                }
            }
            else { // Other layouts
                if (json.PCenterEnableAccordion) {
                    OT(currentCategoryGroup.querySelector('.ot-accordion-group-pc-container')).html(groupDescription);
                }
                else {
                    OT(currentCategoryGroup.querySelector('p:not(.always-active)')).html(groupDescription);
                }
            }
        };
        ConsentNoticeV2.prototype.initializePreferenceCenterGroups = function (fm, fragment) {
            var json = externalData.BannerVariables.domainData;
            var pcName = coreNext.preferenceCenterGroup.name;
            // Clone parent element which cateegory-group
            var cookiePreferencesContainer = OT(fm('#onetrust-pc-sdk .category-group'));
            // decide accordion / non-accrodion container
            if (pcName === 'otPcCenter' || pcName === 'otPcPanel' || pcName === 'otPcList') {
                if (externalData.BannerVariables.domainData.PCenterEnableAccordion) {
                    moduleHelper.removeChild(cookiePreferencesContainer.el.querySelector('.category-item:not(.ot-accordion-layout)'));
                }
                else {
                    moduleHelper.removeChild(cookiePreferencesContainer.el.querySelector('.category-item.ot-accordion-layout'));
                }
            }
            var categoryGroupTemplate = OT(fm('#onetrust-pc-sdk .category-item')).el; // category-item
            var subGroupContainerTemplate = OT(fm('.cookie-subgroups-container')); // Sub groups container
            var popupSubGroupContainerTemplate = OT(fm('.ot-accordion-pc-container .cookie-subgroups-container'));
            // Empty category-group container
            cookiePreferencesContainer.el.removeChild(categoryGroupTemplate);
            // Remove sub groups container since it's already cloned in another variable
            OT(categoryGroupTemplate.querySelector('.cookie-subgroups-container')).remove();
            var extractedGroups = json.Groups.filter(function (grp) { return grp.Order; });
            var appendGroups = cookiePreferencesContainer.el.children.length === 0;
            // Loop for each group to add content
            for (var i = 0; i < extractedGroups.length; i++) {
                var group = extractedGroups[i];
                var groupName = groupsHelper.safeGroupName(group);
                var subGroups = this.groupsClass.getGroupSubGroups(group);
                var groupId = groupsHelper.getGroupIdForCookie(group);
                var currentCategoryGroup = categoryGroupTemplate.cloneNode(true);
                currentCategoryGroup = OT(currentCategoryGroup).el;
                var id = "ot-group-id-" + groupId;
                var headerId = "ot-header-id-" + groupId;
                var descripId = "ot-desc-id-" + groupId;
                currentCategoryGroup.setAttribute('data-optanongroupid', groupId);
                // Set Category / Group name
                this.setParentGroupName(currentCategoryGroup, groupName, headerId, descripId);
                if (pcName === 'otPcPopup') {
                    if (group.ShowVendorList && json.IabType === 'IAB2') {
                        moduleHelper.removeChild(currentCategoryGroup.querySelector('p:not(.always-active)'));
                        moduleHelper.removeChild(currentCategoryGroup.querySelector('.accordion-text:not(.ot-accordion-pc-container)'));
                        if (!subGroups.length) {
                            moduleHelper.removeChild(currentCategoryGroup.querySelector('.cookie-subgroups-container'));
                        }
                    }
                    else {
                        moduleHelper.removeChild(currentCategoryGroup.querySelector('.ot-accordion-pc-container'));
                    }
                }
                // Set group toggles
                this.setParentGroupToggle(currentCategoryGroup, group, json, groupName, id, headerId, descripId);
                // Set group description
                this.setParentGroupDescription(currentCategoryGroup, group, json);
                var categoryExist = !!fm('#onetrust-pc-sdk .category-group').querySelector('.category-item');
                var currentCategoryList = cookiePreferencesContainer.el.querySelectorAll('.category-item');
                currentCategoryList = currentCategoryList[currentCategoryList.length - 1];
                if (appendGroups) {
                    cookiePreferencesContainer.append(currentCategoryGroup);
                }
                else {
                    if (!categoryExist) {
                        OneTrustBannerLibrary.insertAfter(currentCategoryGroup, cookiePreferencesContainer.el.querySelector('h3'));
                    }
                    else {
                        OneTrustBannerLibrary.insertAfter(currentCategoryGroup, currentCategoryList);
                    }
                }
                if (subGroups.length > 0 && group.ShowSubgroup) {
                    if (pcName === 'otPcPopup' && group.ShowVendorList && json.IabType === 'IAB2') {
                        this.setSubgroupsForPupose(group, popupSubGroupContainerTemplate, currentCategoryGroup);
                    }
                    else {
                        this.setSubgroups(group, subGroupContainerTemplate, currentCategoryGroup, json);
                    }
                }
                // Set vendor list button
                this.setVendorListBtn(currentCategoryGroup, fm, fragment, group);
                // Set host list button
                this.setHostListBtn(currentCategoryGroup, fm, fragment, group);
                externalData.BannerVariables.dataGroupState.push(group);
            }
            // Removing Vendor list button from Privacy tab - only Tab layout
            if (coreNext.preferenceCenterGroup.name === 'otPcTab') {
                if (!externalData.BannerVariables.domainData.IsIabEnabled) {
                    var globalVendorListButton = fm('.description-container .category-vendors-list-handler');
                    if (globalVendorListButton) {
                        globalVendorListButton.parentElement.removeChild(globalVendorListButton);
                    }
                }
                else {
                    fm('.description-container .category-vendors-list-handler').innerHTML = externalData.BannerVariables.domainData.VendorListText + "&#x200E;";
                }
            }
        };
        ConsentNoticeV2.prototype.jsonAddAboutCookies = function (json) {
            var group = {};
            group.GroupName = externalData.BannerVariables.optanonAboutCookiesGroupName;
            group.GroupDescription = json.MainInfoText;
            group.ShowInPopup = true;
            group.Order = 0;
            group.IsAboutGroup = true;
            return group;
        };
        ConsentNoticeV2.prototype.insertConsentNoticeHtml = function () {
            var json = externalData.BannerVariables.domainData;
            var pcLogoUrl = externalData.BannerVariables.commonData.optanonLogo;
            // Re-setting the selections for IAB related variabels
            if (externalData.BannerVariables.domainData.IsIabEnabled) {
                this.iab.updateIabVariableReference();
            }
            // Adding about group which is reauired for tab layout
            this.jsonAddAboutCookies(json);
            var fragment = document.createDocumentFragment();
            if (coreNext.preferenceCenterGroup) {
                var rootHtml = document.createElement('div');
                OT(rootHtml).html(coreNext.preferenceCenterGroup.html);
                var preferenceCenter = rootHtml.querySelector('#onetrust-pc-sdk');
                var isWebKit = /Chrome|Safari/i.test(navigator.userAgent) &&
                    /Google Inc|Apple Computer/i.test(navigator.vendor);
                if (!isWebKit) {
                    OT(preferenceCenter).addClass('ot-sdk-not-webkit');
                }
                // Check if we need RTL on the preference center
                if (externalData.BannerVariables.commonData.useRTL) {
                    OT(preferenceCenter).attr('dir', 'rtl');
                }
                var overLay = document.createElement('div');
                OT(overLay).addClass('onetrust-pc-dark-filter');
                OT(overLay).addClass('hide');
                OT(overLay).addClass('ot-fade-in');
                OT(fragment).append(overLay);
                // Set Preference Center Position
                if (externalData.BannerVariables.domainData.PreferenceCenterPosition === 'right') {
                    if (!externalData.BannerVariables.commonData.useRTL) {
                        OT(preferenceCenter).addClass('right');
                    }
                    else {
                        OT(preferenceCenter).addClass('right-rtl');
                    }
                }
                OT(fragment).append(preferenceCenter);
                var fm = function (selector) {
                    return fragment.querySelector(selector);
                };
                var fmAll = function (selector) {
                    return fragment.querySelectorAll(selector);
                };
                // Get all close buttons and remove if not required or set button title
                var pcCloseBtns = OT(fmAll('.pc-close-button')).el;
                if (!json.ShowPreferenceCenterCloseButton) {
                    for (var i = 0; i < pcCloseBtns.length; i++) {
                        OT(pcCloseBtns[i].parentElement).el.removeChild(pcCloseBtns[i]);
                    }
                }
                else {
                    if (!json.CloseText) {
                        json.CloseText = 'Close Button';
                    }
                }
                // Check for and set lang attribute
                if (json.Language && json.Language.Culture) {
                    OT(fm('#onetrust-pc-sdk')).attr('lang', json.Language.Culture);
                }
                // Add logo
                if (fm('.pc-logo') && pcLogoUrl) {
                    OT(fm('.pc-logo')).attr('style', "background-image: url(\"" + externalData.updateCorrectUrl(pcLogoUrl) + "\")");
                }
                // Set preference center title
                OT(fm('#pc-title')).html(json.MainText);
                // It's only for tab layout
                if (coreNext.preferenceCenterGroup.name === 'otPcTab') {
                    OT(fm('#privacy-text')).html(json.AboutCookiesText);
                    OT(fm('#pc-privacy-header')).html(json.AboutCookiesText);
                }
                // Set Main Info Text - PC description
                OT(fm('#pc-policy-text')).html(json.MainInfoText);
                // Set Cookie Policy link - More information link
                if (json.AboutText) {
                    OT(fm('#pc-policy-text')).html(OT(fm('#pc-policy-text')).html() + "\n                        <a href=\"" + json.AboutLink + "\" class=\"privacy-notice-link\" target=\"_blank\"\n                        aria-label=\"" + json.AboutText + ", " + json.PreferenceCenterMoreInfoScreenReader + "\">" + json.AboutText + "</a>");
                }
                // Set Accept Recommended Setting Button
                if (json.ConfirmText.trim()) {
                    OT(fm('#accept-recommended-btn-handler')).html(json.ConfirmText);
                    OT(fm('#accept-recommended-btn-handler')).attr('aria-label', json.ConfirmText);
                }
                else {
                    fm('#accept-recommended-btn-handler').parentElement.removeChild(fm('#accept-recommended-btn-handler'));
                }
                // Set Save Preference Button
                var savePreferenceBtns = fmAll('.save-preference-btn-handler');
                for (var i = 0; i < savePreferenceBtns.length; i++) {
                    OT(savePreferenceBtns[i]).html(json.AllowAllText);
                    OT(savePreferenceBtns[i]).attr('aria-label', json.AllowAllText);
                }
                // Set Manage Preference text
                if (fm('#manage-cookies-text')) {
                    OT(fm('#manage-cookies-text')).html(json.ManagePreferenceText);
                }
                this.initializePreferenceCenterGroups(fm, fragment);
            }
            // Append preference center to the DOM
            var oneTrustDOM = document.createElement('div');
            OT(oneTrustDOM).append(fragment);
            OT(oneTrustDOM).attr('id', 'onetrust-consent-sdk');
            consentNoticeNext.processedHTML = oneTrustDOM.outerHTML;
            if (!externalData.BannerVariables.ignoreInjectingHtmlCss) {
                OT(document.body).append(oneTrustDOM);
            }
            this.core.InitializeHostList();
        };
        ConsentNoticeV2.prototype.insertShowSettingsButtonsHtml = function () {
            var cookieButtonText = externalData.BannerVariables.domainData.CookieSettingButtonText;
            if (cookieButtonText) {
                OT(this.ONETRUST_SHOW_SETTINGS).text(cookieButtonText);
            }
        };
        ConsentNoticeV2.prototype.setVendorListBtn = function (currentCategoryGroup, fm, fragment, group) {
            var pcName = coreNext.preferenceCenterGroup.name;
            // Remove VendorList Button if its not enabled
            // TODO: revisit this check afte mock is updated when bundle is- both iab and groups
            if (!group.ShowVendorList) {
                if ((pcName === 'otPcPanel' || pcName === 'otPcCenter')
                    && !externalData.BannerVariables.domainData.PCenterEnableAccordion) {
                    currentCategoryGroup.removeChild(currentCategoryGroup.querySelector('.category-vendors-list-container'));
                }
                else if (pcName === 'otPcPopup'
                    || (pcName === 'otPcPanel' || pcName === 'otPcCenter'
                        && externalData.BannerVariables.domainData.PCenterEnableAccordion)) {
                    var venderListContainer = fm('#vendor-list-container');
                    var accordionText = currentCategoryGroup.querySelector('.accordion-text');
                    if (venderListContainer) {
                        fragment.querySelector('#content').removeChild(venderListContainer);
                    }
                    OT(accordionText).el.removeChild(accordionText.querySelector('.category-vendors-list-container'));
                }
                if (pcName === 'otPcTab' || pcName === 'otPcList') {
                    var vendorListBtn = currentCategoryGroup.querySelector('.category-vendors-list-container');
                    if (vendorListBtn) {
                        vendorListBtn.parentElement.removeChild(vendorListBtn);
                    }
                }
            }
            else {
                // Set parent group id to use it in filters
                currentCategoryGroup.querySelector('.category-vendors-list-handler').innerHTML = externalData.BannerVariables.domainData.VendorListText + "&#x200E;";
                currentCategoryGroup
                    .querySelector('.category-vendors-list-handler')
                    .setAttribute('data-parent-id', groupsHelper.getGroupIdForCookie(group));
            }
        };
        ConsentNoticeV2.prototype.setHostListBtn = function (currentCategoryGroup, fm, fragment, group) {
            // Remove Host list Button if its not enabled
            var groupHasFirstPartyCookies = false;
            if (externalData.BannerVariables.commonData.showCookieList) {
                group.SubGroups.concat([group]).some(function (grp) {
                    if (IAB_GROUP_TYPES.indexOf(grp.Type) === -1 && grp.FirstPartyCookies.length) {
                        groupHasFirstPartyCookies = true;
                        return true;
                    }
                });
            }
            if (externalData.BannerVariables.commonData.showCookieList && (group.ShowHostList || groupHasFirstPartyCookies)) {
                if (currentCategoryGroup.querySelector('.category-host-list-handler')) {
                    currentCategoryGroup.querySelector('.category-host-list-handler').innerHTML =
                        externalData.BannerVariables.domainData.ThirdPartyCookieListText + "&#x200E;";
                    // Set parent group id to use it in filters
                    currentCategoryGroup.querySelector('.category-host-list-handler')
                        .setAttribute('data-parent-id', groupsHelper.getGroupIdForCookie(group));
                }
            }
            else {
                // TOOD: align this code with other layouts
                if (coreNext.preferenceCenterGroup.name === 'otPcPopup') {
                    var venderListContainer = fm('#vendor-list-container');
                    var accordionText = currentCategoryGroup.querySelector('.accordion-text');
                    if (venderListContainer) {
                        fragment.querySelector('#content').removeChild(venderListContainer);
                    }
                    if (accordionText.querySelector('.category-host-list-container')) {
                        OT(accordionText).el.removeChild(accordionText.querySelector('.category-host-list-container'));
                    }
                }
                else {
                    var hostListBtn = currentCategoryGroup.querySelector('.category-host-list-container');
                    if (hostListBtn) {
                        hostListBtn.parentElement.removeChild(hostListBtn);
                    }
                }
            }
        };
        ConsentNoticeV2.prototype.setSubgroupsForPupose = function (group, cookieSubGroupContainerTemplate, currentCategoryGroup) {
            var _this = this;
            var container = currentCategoryGroup.querySelector('.cookie-subgroups-container');
            container.parentElement.removeChild(container);
            var consentableSubGroups = CONSENTABLE_IAB_GROUPS.concat(CONSENTABLE_GROUPS);
            group.SubGroups.forEach(function (subgroup) {
                var subGroupContainerClone = cookieSubGroupContainerTemplate.el.cloneNode(true);
                var subGroupClone = subGroupContainerClone.querySelector('.cookie-subgroup').cloneNode(true);
                var subGroupToggle = subGroupClone.querySelector('.toggle');
                var id = "ot-sub-group-id-" + groupsHelper.getGroupIdForCookie(subgroup);
                var groupId = groupsHelper.getGroupIdForCookie(subgroup);
                var status = groupsNext.safeGroupDefaultStatus(subgroup).toLowerCase();
                OT(subGroupContainerClone.querySelector('.cookie-subgroups')).html('');
                OT(subGroupClone.querySelector('h6')).html(subgroup.GroupName);
                subGroupClone.querySelector('input').setAttribute('id', id);
                subGroupClone.querySelector('input').setAttribute('data-optanongroupid', groupId);
                subGroupClone.querySelector('label').setAttribute('for', id);
                subGroupClone.setAttribute('data-optanongroupid', groupId);
                if (group.ShowSubgroupToggle && consentableSubGroups.indexOf(group.Type) > -1) {
                    // Set Subgroup Status
                    if (_this.groupsClass.isGroupActive(subgroup)) {
                        subGroupClone.querySelector('input').setAttribute('checked', true);
                        if (groupsNext.safeGroupDefaultStatus(group).toLowerCase() ===
                            'always active') {
                            // disable toggle
                            subGroupClone.querySelector('input').disabled = true;
                            subGroupClone.querySelector('input').setAttribute('disabled', true);
                        }
                    }
                }
                else if (status !== 'always active') {
                    subGroupToggle.parentElement.removeChild(subGroupToggle);
                }
                // Hide cookie categories if it's a sub group of a stack
                if (subgroup.Type === 'COOKIE' && subgroup.Parent.indexOf('STACK') !== -1) {
                    subGroupContainerClone.style = 'display:none;';
                }
                // Set always active status
                if (status === 'always active') {
                    var toggle = subGroupToggle;
                    if (toggle) {
                        toggle.parentElement.removeChild(toggle);
                        subGroupClone.querySelector('.toggle-group').classList.add('ot-always-active-subgroup');
                        _this.setAlwaysActive(subGroupClone, true);
                    }
                }
                // Sub group description
                if (subgroup.DescriptionLegal) {
                    OT(subGroupClone.querySelector('.cookie-subgroups-description-legal')).html(subgroup.DescriptionLegal);
                }
                else {
                    OT(subGroupClone.querySelector('.cookie-subgroups-description-legal')).html(subgroup.GroupDescription);
                }
                OT(subGroupContainerClone.querySelector('.cookie-subgroups')).append(subGroupClone);
                var categoryVendersListContainer = currentCategoryGroup.querySelector('.category-item .category-vendors-list-container');
                if (categoryVendersListContainer) {
                    categoryVendersListContainer.insertAdjacentElement('beforebegin', subGroupContainerClone);
                }
            });
        };
        ConsentNoticeV2.prototype.setSubgroups = function (group, cookieSubGroupContainerTemplate, currentCategoryGroup, json) {
            var _this = this;
            var consentableSubGroups = CONSENTABLE_IAB_GROUPS.concat(CONSENTABLE_GROUPS);
            group.SubGroups.forEach(function (subgroup) {
                var subGroupContainerClone = cookieSubGroupContainerTemplate.el.cloneNode(true);
                var subGroupClone = subGroupContainerClone.querySelector('.cookie-subgroup').cloneNode(true);
                var subGroupToggle = subGroupClone.querySelector('.toggle');
                var groupId = groupsHelper.getGroupIdForCookie(subgroup);
                var id = "ot-sub-group-id-" + groupId;
                var status = groupsNext.safeGroupDefaultStatus(subgroup).toLowerCase();
                OT(subGroupContainerClone.querySelector('.cookie-subgroups')).html('');
                OT(subGroupClone.querySelector('h6')).html(subgroup.GroupName);
                subGroupClone.querySelector('input').setAttribute('id', id);
                subGroupClone.querySelector('input').setAttribute('data-optanongroupid', groupId);
                subGroupClone.querySelector('label').setAttribute('for', id);
                subGroupClone.setAttribute('data-optanongroupid', groupId);
                if (group.ShowSubgroupToggle && consentableSubGroups.indexOf(subgroup.Type) > -1) { // Set Subgroup Status
                    if (_this.groupsClass.isGroupActive(subgroup)) {
                        subGroupClone.querySelector('input').setAttribute('checked', true);
                        if (groupsNext.safeGroupDefaultStatus(group).toLowerCase() === 'always active') { // disable toggle
                            subGroupClone.querySelector('input').disabled = true;
                            subGroupClone.querySelector('input').setAttribute('disabled', true);
                        }
                    }
                }
                else if (status !== 'always active') {
                    subGroupToggle.parentElement.removeChild(subGroupToggle);
                }
                if (status === 'always active') {
                    var toggle = subGroupToggle;
                    if (toggle) {
                        toggle.parentElement.removeChild(toggle);
                        subGroupClone.querySelector('.toggle-group').classList.add('ot-always-active-subgroup');
                        _this.setAlwaysActive(subGroupClone, true);
                    }
                }
                if (subgroup.Type === 'COOKIE' && subgroup.Parent.indexOf('STACK') !== -1) {
                    subGroupContainerClone.style = 'display:none;';
                }
                var subgroupDescription = _this.groupsClass.safeFormattedGroupDescription(subgroup);
                var isLegalText = false;
                if (IAB2_GROUPS_WITH_LEGAL_TEXT.indexOf(subgroup.Type) > -1) {
                    isLegalText = true;
                    subgroupDescription = subgroup.DescriptionLegal;
                }
                // Set Subgroup Description
                if (json.PCenterEnableAccordion && isLegalText) {
                    group.ShowSubGroupDescription ?
                        OT(subGroupClone.querySelector('.cookie-subgroups-description-legal')).html(subgroupDescription) :
                        OT(subGroupClone.querySelector('.cookie-subgroups-description-legal')).html('');
                }
                else {
                    group.ShowSubGroupDescription
                        ? OT(subGroupClone.querySelector('p')).html(subgroupDescription)
                        : OT(subGroupClone.querySelector('p')).text(' ');
                }
                OT(subGroupContainerClone.querySelector('.cookie-subgroups')).append(subGroupClone);
                var categoryVendersListContainer = currentCategoryGroup.querySelector('.category-item .category-vendors-list-container');
                if (categoryVendersListContainer) {
                    categoryVendersListContainer.insertAdjacentElement('beforebegin', subGroupContainerClone);
                }
            });
        };
        ConsentNoticeV2.prototype.setFirstPartyCookies = function (group, firstPartyCookieContainer, currentCategoryGroup, cookieSubGroupContainerTemplate) {
            // First Party Cookie List
            var firstPartCookieList = group.FirstPartyCookies.slice();
            if (group.SubGroups.length > 0) {
                group.SubGroups.forEach(function (subgroup) {
                    firstPartCookieList = firstPartCookieList.concat(subgroup.FirstPartyCookies);
                });
            }
            if (!firstPartCookieList.length) {
                return;
            }
            var firstPartyCookieContainerClone = firstPartyCookieContainer.cloneNode(true);
            var cookieSubgroupsList = currentCategoryGroup.querySelectorAll('.cookie-subgroups');
            var cookieSubgroups = cookieSubgroupsList[cookieSubgroupsList.length - 1];
            // change the input id
            var firstPartyInput = firstPartyCookieContainerClone.querySelector('input');
            firstPartyInput.setAttribute('id', "first-party-cookies-container-" + groupsHelper.getGroupIdForCookie(group));
            // Prep unordered list for cookies
            var firstPartCookieGroupUnOrderedList = firstPartyCookieContainerClone.querySelector('.first-party-cookie-group');
            firstPartCookieGroupUnOrderedList.innerHTML = '';
            firstPartCookieList.forEach(function (cookie) {
                firstPartCookieGroupUnOrderedList.appendChild(OT("<li>" + cookieClass.getCookieLabel(cookie) + "</li>", 'ce').el);
            });
            firstPartyCookieContainerClone
                .querySelector('.accordion-text')
                .appendChild(firstPartCookieGroupUnOrderedList);
            if (cookieSubgroups) {
                cookieSubgroups.appendChild(firstPartyCookieContainerClone);
            }
            else {
                // Create a subgroup container on the fly, this is needed for styling
                var subGroupContainerClone = cookieSubGroupContainerTemplate.el.cloneNode(true);
                var categoryVendersListContainer = currentCategoryGroup.querySelector('.category-item .category-vendors-list-container');
                if (categoryVendersListContainer) {
                    categoryVendersListContainer.insertAdjacentElement('beforebegin', subGroupContainerClone);
                }
                var cookieSubgroups_1 = currentCategoryGroup.querySelector('.cookie-subgroups');
                if (cookieSubgroups_1 && firstPartCookieGroupUnOrderedList.firstChild) {
                    cookieSubgroups_1.innerHTML = '';
                    cookieSubgroups_1.appendChild(firstPartyCookieContainerClone);
                }
                else {
                    var firstPartyCookieContainerRemove = currentCategoryGroup.querySelector('.first-party-cookie-container');
                    firstPartyCookieContainerRemove.parentElement.removeChild(firstPartyCookieContainerRemove);
                }
                // Remove Default Subgroup Template
                if (group.SubGroups.length < 1) {
                    var cookieSubgroup = currentCategoryGroup.querySelector('.cookie-subgroup');
                    if (cookieSubgroup) {
                        cookieSubgroup.parentElement.removeChild(cookieSubgroup);
                    }
                }
            }
        };
        ConsentNoticeV2.prototype.setToggleProps = function (currentCategoryGroup, group, Id, headerId) {
            var inputs = currentCategoryGroup.querySelectorAll('input:not(.cookie-subgroup-handler)');
            var labels = currentCategoryGroup.querySelectorAll('label');
            var groupIsActive = this.groupsClass.isGroupActive(group);
            for (var i = 0; i < inputs.length; i++) {
                if (labels[i]) {
                    OT(labels[i]).attr('for', Id);
                }
                // Applicable only for Accordion layouts  since first input element used to expand/collapse
                if (inputs.length >= 2 && i === 0) {
                    OT(inputs[i]).attr('id', Id + "-toggle");
                }
                else {
                    if (groupsNext.safeGroupDefaultStatus(group).toLowerCase() === 'always active') {
                        var toggle = inputs[i].closest('.toggle');
                        if (toggle) {
                            toggle.parentElement.removeChild(toggle);
                            this.setAlwaysActive(currentCategoryGroup);
                        }
                    }
                    OT(inputs[i]).attr('id', Id);
                    OT(inputs[i]).attr('name', Id);
                    OT(inputs[i]).data('optanonGroupId', groupsHelper.getGroupIdForCookie(group));
                    moduleHelper.setCheckedAttribute(null, inputs[i], groupIsActive);
                    OT(inputs[i]).attr('aria-labelledby', headerId);
                }
            }
        };
        ConsentNoticeV2.prototype.setAlwaysActive = function (currentCategoryGroup, subGroup) {
            if (subGroup === void 0) { subGroup = false; }
            if (coreNext.preferenceCenterGroup.name === 'otPcPopup' ||
                coreNext.preferenceCenterGroup.name === 'otPcTab' ||
                subGroup) {
                currentCategoryGroup
                    .querySelector('.toggle-group')
                    .insertAdjacentElement('afterbegin', OT("<div class='always-active'>" + externalData.BannerVariables.domainData.AlwaysActiveText + "</div>", 'ce').el);
            }
            else {
                OT(!externalData.BannerVariables.domainData.PCenterEnableAccordion ?
                    currentCategoryGroup.querySelector('.category-header') : currentCategoryGroup.querySelector('.arrow-container')).el.insertAdjacentElement('afterend', OT("<div class='always-active'>" + externalData.BannerVariables.domainData.AlwaysActiveText + "</div>", 'ce').el);
                if (externalData.BannerVariables.domainData.PCenterEnableAccordion) {
                    currentCategoryGroup.querySelector('.accordion-header').classList.add('ot-always-active-group');
                }
                else {
                    currentCategoryGroup.classList.add('ot-always-active-group');
                }
            }
        };
        ConsentNoticeV2.prototype.initialiseCssReferences = function () {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.id = 'onetrust-style';
            style.innerHTML = externalData.BannerVariables.commonData.useRTL
                ? commonStyles.cssRTL
                : commonStyles.css;
            if (coreNext.bannerGroup) {
                style.innerHTML += coreNext.bannerGroup.css;
                style.innerHTML += this.addCustomBannerCSS();
            }
            if (coreNext.preferenceCenterGroup) {
                style.innerHTML += coreNext.preferenceCenterGroup.css;
                style.innerHTML += this.addCustomPreferenceCenterCSS();
            }
            if (coreNext.cookieListGroup) {
                style.innerHTML += coreNext.cookieListGroup.css;
                style.innerHTML += this.addCustomCookieListCSS();
            }
            this.processedCSS = style.innerHTML;
            if (!externalData.BannerVariables.ignoreInjectingHtmlCss) {
                OT(document.head).append(style);
            }
        };
        ConsentNoticeV2.prototype.geoLocationCallback = function () {
            this.loadDefaultBannerGroup();
        };
        ConsentNoticeV2.prototype.windowLoadBannerFocus = function () {
            var focusableElements = OT("#onetrust-banner-sdk [href]:not(.mobile),\n            #onetrust-banner-sdk #onetrust-accept-btn-handler,\n            #onetrust-banner-sdk #onetrust-reject-all-handler,\n            #onetrust-banner-sdk #onetrust-pc-btn-handler,\n            #onetrust-close-btn-container button").el;
            consentNoticeNext.setBannerFocus(focusableElements, 0, null, true);
        };
        ConsentNoticeV2.prototype.insertCookiePolicyHtml = function () {
            if (!OT(consentNoticeV2.ONETRUST_COOKIE_POLICY).length) {
                return;
            }
            var json = externalData.BannerVariables.domainData;
            var fragment = document.createDocumentFragment();
            var cookieList;
            if (coreNext.cookieListGroup) {
                var rootHtml = document.createElement('div');
                OT(rootHtml).html(coreNext.cookieListGroup.html);
                if (externalData.BannerVariables.commonData.CookiesV2NewCookiePolicy) {
                    rootHtml.removeChild(rootHtml.querySelector('.ot-sdk-cookie-policy'));
                }
                else {
                    rootHtml.removeChild(rootHtml.querySelector('#ot-sdk-cookie-policy-v2'));
                }
                cookieList = rootHtml.querySelector('.ot-sdk-cookie-policy');
                if (externalData.BannerVariables.commonData.useRTL) {
                    OT(cookieList).attr('dir', 'rtl');
                }
            }
            // set title
            cookieList.querySelector('#cookie-policy-title').innerHTML =
                json.CookieListTitle || '';
            // set description
            cookieList.querySelector('#cookie-policy-description').innerHTML =
                json.CookieListDescription || '';
            // Select Group Section and Table Row for hosts
            var sectionTemplate = cookieList.querySelector('section');
            var tableRowTemplate = cookieList.querySelector('section tbody tr');
            var subgroupSectionTemplate = null;
            var subgroupTableRowTemplate = null;
            if (!externalData.BannerVariables.commonData.CookiesV2NewCookiePolicy) {
                subgroupSectionTemplate = cookieList.querySelector('section.subgroup');
                subgroupTableRowTemplate = cookieList.querySelector('section.subgroup tbody tr');
                // Empty Cookie List to start fresh
                OT(cookieList).el.removeChild(cookieList.querySelector('section.subgroup'));
            }
            OT(cookieList).el.removeChild(cookieList.querySelector('section'));
            if (!OT('#ot-sdk-cookie-policy').length &&
                OT('#optanon-cookie-policy').length) {
                OT('#optanon-cookie-policy').append("<div id=\"ot-sdk-cookie-policy\"></div>");
            }
            for (var i = 0; i < json.Groups.length; i++) {
                if (externalData.BannerVariables.commonData.CookiesV2NewCookiePolicy) {
                    this.insertGroupHTMLV2(json, json.Groups, sectionTemplate, i, tableRowTemplate, cookieList, fragment);
                }
                else {
                    this.insertGroupHTML(json, json.Groups, sectionTemplate, i, tableRowTemplate, cookieList, fragment);
                    if (json.Groups[i].ShowSubgroup) {
                        for (var j = 0; j < json.Groups[i].SubGroups.length; j++) {
                            this.insertGroupHTML(json, json.Groups[i].SubGroups, subgroupSectionTemplate, j, subgroupTableRowTemplate, cookieList, fragment);
                        }
                    }
                }
            }
        };
        ConsentNoticeV2.prototype.insertGroupHTMLV2 = function (json, groupArray, sectionTemplate, i, tableRowTemplate, cookieList, fragment) {
            var _this = this;
            var group, hosts, subGroupCookie;
            group = groupArray[i];
            var sectionTemplateCloned = sectionTemplate.cloneNode(true);
            var subGroups = groupArray[i].SubGroups;
            if (!json.CookiesText) {
                json.CookiesText = 'Cookies';
            }
            if (!json.CategoriesText) {
                json.CategoriesText = 'Categories';
            }
            if (!json.LifespanText) {
                json.LifespanText = 'Lifespan';
            }
            if (!json.LifespanTypeText) {
                json.LifespanTypeText = 'Session';
            }
            if (!json.LifespanDurationText) {
                json.LifespanDurationText = 'days';
            }
            var st = function (selector) {
                return sectionTemplateCloned.querySelector(selector);
            };
            OT(st('tbody')).html('');
            var Hosts = group.Hosts.slice();
            var FirstPartyCookies = group.FirstPartyCookies.slice();
            if (!groupArray[i].ShowSubgroup || !subGroups.length) {
                // Empty Cookie List to start fresh
                sectionTemplateCloned.removeChild(sectionTemplateCloned.querySelector('section.ot-sdk-subgroup'));
            }
            else {
                var subGroupNode_1 = sectionTemplateCloned.querySelector('section.ot-sdk-subgroup ul li');
                subGroups.forEach(function (subGroup) {
                    // Set group name and description
                    var cloneNode = subGroupNode_1.cloneNode(true);
                    Hosts = Hosts.concat(subGroup.Hosts);
                    FirstPartyCookies = FirstPartyCookies.concat(subGroup.FirstPartyCookies);
                    OT(cloneNode.querySelector('.ot-sdk-cookie-policy-group')).html(groupsHelper.safeGroupName(subGroup));
                    OT(cloneNode.querySelector('.ot-sdk-cookie-policy-group-desc')).html(_this.groupsClass.safeFormattedGroupDescription(subGroup));
                    OT(subGroupNode_1.parentElement).append(cloneNode);
                });
                sectionTemplateCloned.querySelector('section.ot-sdk-subgroup ul').removeChild(subGroupNode_1);
            }
            // Remove Lifespan column if it is disabled
            if (!json.IsLifespanEnabled) {
                OT(st('thead tr')).el.removeChild(OT(st('th.ot-life-span')).el);
            }
            else {
                OT(st('th.ot-life-span')).el.innerHTML = json.LifespanText;
            }
            OT(st('th.ot-cookies')).el.innerHTML = json.CookiesText;
            OT(st('th.ot-host')).el.innerHTML = json.CategoriesText;
            OT(st('th.ot-cookies-type')).el.innerHTML = json.CookiesUsedText;
            hosts = this.transformFirstPartyCookies(FirstPartyCookies, Hosts);
            // Remove description column if no descriptions in data
            var showHostDescription = false;
            if (!hosts.some(function (host) { return host.Description; })) {
                OT(st('thead tr')).el.removeChild(OT(st('th.ot-host-description')).el);
            }
            else {
                showHostDescription = true;
            }
            // Set group name and description
            OT(st('.ot-sdk-cookie-policy-group')).html(groupsHelper.safeGroupName(group));
            OT(st('.ot-sdk-cookie-policy-group-desc')).html(this.groupsClass.safeFormattedGroupDescription(group));
            var _loop_1 = function (j) {
                var tableRowTemplateCloned = tableRowTemplate.cloneNode(true);
                var trt = function (selector) {
                    return tableRowTemplateCloned.querySelector(selector);
                };
                OT(trt('.ot-cookies-td span')).text('');
                OT(trt('.ot-life-span-td span')).text('');
                OT(trt('.ot-cookies-type span')).text('');
                OT(trt('.ot-host-td')).html('');
                OT(trt('.ot-host-description-td')).html("<span class=\"ot-mobile-border\"></span>\n                        <p>" + hosts[j].Description + "</p> ");
                var lifespanText = [];
                var cookiesText = [];
                for (var l = 0; l < hosts[j].Cookies.length; l++) {
                    subGroupCookie = hosts[j].Cookies[l];
                    if (subGroupCookie.IsSession) {
                        lifespanText.push(json.LifespanTypeText);
                    }
                    else if (subGroupCookie.Length === 0) {
                        lifespanText.push('<1 ' + json.LifespanDurationText);
                    }
                    else {
                        lifespanText.push(subGroupCookie.Length + ' ' + json.LifespanDurationText);
                    }
                    cookiesText.push(subGroupCookie.Name);
                }
                OT(trt('.ot-host-td')).append('<span class="ot-mobile-border"></span>');
                trt('.ot-host-td').setAttribute('data-label', json.CategoriesText);
                trt('.ot-cookies-td').setAttribute('data-label', json.CookiesText);
                OT(trt('.ot-host-td')).append("<a href=\"https://cookiepedia.co.uk/host/" + subGroupCookie.Host + "\" target=\"_blank\">" + hosts[j].HostName + "</a>");
                trt('.ot-cookies-td .ot-cookies-td-content').innerText = cookiesText.join(', ');
                trt('.ot-life-span-td .ot-life-span-td-content').innerText = lifespanText.join(', ');
                trt('.ot-cookies-type .ot-cookies-type-td-content').innerText = "" + (hosts[j].Type ? '1st Party' : '3rd Party');
                if (!json.IsLifespanEnabled) {
                    tableRowTemplateCloned.removeChild(trt('td.ot-life-span-td'));
                }
                if (!showHostDescription) {
                    tableRowTemplateCloned.removeChild(trt('td.ot-host-description-td'));
                }
                OT(st('tbody')).append(tableRowTemplateCloned);
            };
            // Insert host html
            for (var j = 0; j < hosts.length; j++) {
                _loop_1(j);
            }
            if (hosts.length === 0) {
                sectionTemplateCloned.removeChild(sectionTemplateCloned.querySelector('table'));
            }
            OT(cookieList).append(sectionTemplateCloned);
            OT(fragment).append(cookieList);
            OT('#ot-sdk-cookie-policy').append(fragment);
        };
        ConsentNoticeV2.prototype.insertGroupHTML = function (json, groupArray, sectionTemplate, i, tableRowTemplate, cookieList, fragment) {
            var group, cookie, hosts, subGroupCookie;
            group = groupArray[i];
            var sectionTemplateCloned = sectionTemplate.cloneNode(true);
            if (!json.CookiesText) {
                json.CookiesText = 'Cookies';
            }
            if (!json.CategoriesText) {
                json.CategoriesText = 'Categories';
            }
            if (!json.LifespanText) {
                json.LifespanText = 'Lifespan';
            }
            if (!json.LifespanTypeText) {
                json.LifespanTypeText = 'Session';
            }
            if (!json.LifespanDurationText) {
                json.LifespanDurationText = 'days';
            }
            var st = function (selector) {
                return sectionTemplateCloned.querySelector(selector);
            };
            OT(st('tbody')).html('');
            OT(st('thead tr'));
            // Remove Lifespan column if it is disabled
            if (!json.IsLifespanEnabled) {
                OT(st('thead tr')).el.removeChild(OT(st('th.life-span')).el);
            }
            else {
                OT(st('th.life-span')).el.innerHTML = json.LifespanText;
            }
            OT(st('th.cookies')).el.innerHTML = json.CookiesText;
            OT(st('th.host')).el.innerHTML = json.CategoriesText;
            // Remove description column if no descriptions in data
            var showHostDescription = false;
            if (!group.Hosts.some(function (host) { return host.description; })) {
                OT(st('thead tr')).el.removeChild(OT(st('th.host-description')).el);
            }
            else {
                showHostDescription = true;
            }
            // Set group name and description
            OT(st('.ot-sdk-cookie-policy-group')).html(groupsHelper.safeGroupName(group));
            OT(st('.ot-sdk-cookie-policy-group-desc')).html(this.groupsClass.safeFormattedGroupDescription(group));
            // Add first party cookies to unordered list
            if (group.FirstPartyCookies.length > 0) {
                OT(st('.cookies-used-header')).html(json.CookiesUsedText);
                OT(st('.cookies-list')).html('');
                for (var k = 0; k < group.FirstPartyCookies.length; k++) {
                    cookie = group.FirstPartyCookies[k];
                    OT(st('.cookies-list')).append("<li> " + cookieClass.getCookieLabel(cookie) + " <li>");
                }
            }
            else {
                // Remove section if there are no cookies
                sectionTemplateCloned.removeChild(st('.cookies-used-header'));
                sectionTemplateCloned.removeChild(st('.cookies-list'));
            }
            hosts = group.Hosts;
            var _loop_2 = function (j) {
                var tableRowTemplateCloned = tableRowTemplate.cloneNode(true);
                var trt = function (selector) {
                    return tableRowTemplateCloned.querySelector(selector);
                };
                OT(trt('.cookies-td ul')).html('');
                OT(trt('.life-span-td ul')).html('');
                OT(trt('.host-td')).html('');
                OT(trt('.host-description-td')).html("<span class=\"mobile-border\"></span>\n                        <p>" + hosts[j].Description + "</p> ");
                for (var l = 0; l < hosts[j].Cookies.length; l++) {
                    subGroupCookie = hosts[j].Cookies[l];
                    var lifespan = '';
                    if (subGroupCookie.IsSession) {
                        lifespan = json.LifespanTypeText;
                    }
                    else if (subGroupCookie.Length === 0) {
                        lifespan = '<1 ' + json.LifespanDurationText;
                    }
                    else {
                        lifespan = subGroupCookie.Length + ' ' + json.LifespanDurationText;
                    }
                    OT(trt('.cookies-td ul')).append("<li> " + subGroupCookie.Name + " " + (json.IsLifespanEnabled ? "&nbsp;(" + lifespan + ")" : '') + " </li>");
                    if (json.IsLifespanEnabled) {
                        OT(trt('.life-span-td ul')).append("<li>" + (subGroupCookie.Length ? subGroupCookie.Length + " days" : 'N/A') + "</li>");
                    }
                    if (l === 0) {
                        OT(trt('.host-td')).append('<span class="mobile-border"></span>');
                        OT(trt('.host-td')).append("<a href=\"https://cookiepedia.co.uk/host/" + subGroupCookie.Host + "\" target=\"_blank\">" + hosts[j].HostName + "</a>");
                    }
                }
                if (!showHostDescription) {
                    tableRowTemplateCloned.removeChild(trt('td.host-description-td'));
                }
                OT(st('tbody')).append(tableRowTemplateCloned);
            };
            // Insert host html
            for (var j = 0; j < hosts.length; j++) {
                _loop_2(j);
            }
            if (hosts.length === 0) {
                OT(st('table')).el.removeChild(OT(st('thead')).el);
            }
            OT(cookieList).append(sectionTemplateCloned);
            OT(fragment).append(cookieList);
            OT('#ot-sdk-cookie-policy').append(fragment);
        };
        ConsentNoticeV2.prototype.windowLoadBanner = function () {
            this.core.substitutePlainTextScriptTags();
            // Insert Optanon main consent notice component
            this.insertConsentNoticeHtml();
            sdkEventsV2.initialiseConsentNoticeHandlers();
            // Insert Optanon alert component
            if (externalData.BannerVariables.domainData.ShowAlertNotice &&
                !externalData.isAlertBoxClosedAndValid()) {
                sdkEventsV2.initializeAlartHtmlAndHandler();
            }
            else {
                // Hide banner in custom HTML
                var bannerHtml = document.getElementById('onetrust-banner-sdk');
                if (bannerHtml) {
                    bannerHtml.setAttribute('style', 'display:none');
                }
            }
            if (externalData.BannerVariables.domainData.IsIabEnabled) {
                this.iab.InitializeVendorList();
            }
            // Insert Optanon Show Settings component
            if (OT(this.ONETRUST_SHOW_SETTINGS).length > 0) {
                this.insertShowSettingsButtonsHtml();
            }
            // Insert Optanon Cookie Policy component
            if (OT(this.ONETRUST_COOKIE_POLICY).length > 0) {
                this.insertCookiePolicyHtml();
            }
            coreEvents.executeOptanonWrapper();
            // Always set cookie if not set yet
            if (!externalData.readCookieParam(externalData.BannerVariables.optanonCookieName, 'groups')) {
                cookieClass.writeCookieGroupsParam(externalData.BannerVariables.optanonCookieName); // Groups
            }
            if (!externalData.readCookieParam(externalData.BannerVariables.optanonCookieName, 'hosts')) {
                cookieClass.writeHostCookieParam(externalData.BannerVariables.optanonCookieName); // Hosts
            }
            if (externalData.BannerVariables.domainData.ShowAlertNotice &&
                !externalData.isAlertBoxClosedAndValid()) {
                this.windowLoadBannerFocus.bind(this);
            }
        };
        // Moved from publicAPI
        ConsentNoticeV2.prototype.loadDefaultBannerGroup = function () {
            this.canImpliedConsentLandingPage();
            if (moduleInitializer.moduleInitializer.CookieSPAEnabled) {
                OT(window).on('otloadbanner', this.windowLoadBanner.bind(this));
            }
            else {
                OT(window).one('otloadbanner', this.windowLoadBanner.bind(this));
            }
        };
        ConsentNoticeV2.prototype.canImpliedConsentLandingPage = function () {
            if (this.isImpliedConsent() && !landingPathNext.isLandingPage()) {
                if (externalData.readCookieParam(externalData.BannerVariables.optanonCookieName, externalData.BannerVariables.optanonAwaitingReconsentName) === 'true') {
                    this.checkForRefreshCloseImplied();
                }
            }
        };
        ConsentNoticeV2.prototype.isImpliedConsent = function () {
            var json = externalData.BannerVariables.domainData;
            return (json.ConsentModel &&
                json.ConsentModel.Name.toLowerCase() ===
                    externalData.BannerVariables.constant.IMPLIEDCONSENT);
        };
        ConsentNoticeV2.prototype.checkForRefreshCloseImplied = function () {
            sdkEventsNext.closeOptanonAlertBox(true, true);
            coreEvents.close(true);
            return false;
        };
        ConsentNoticeV2.prototype.transformFirstPartyCookies = function (cookies, hosts) {
            var hostGroup = hosts.slice();
            cookies.forEach(function (cookie) {
                var cookieExist = hostGroup.some(function (host) {
                    if (host.HostName === cookie.Host) {
                        host.Cookies.push(cookie);
                        return true;
                    }
                });
                if (!cookieExist) {
                    hostGroup.unshift({
                        HostName: cookie.Host,
                        HostId: '',
                        Description: '',
                        Type: '1st Party',
                        Cookies: [cookie],
                    });
                }
            });
            return hostGroup;
        };
        return ConsentNoticeV2;
    }());
    var consentNoticeV2;
    function initializeConsentNoticeV2() {
        consentNoticeV2 = new ConsentNoticeV2();
    }

    var GeolocationService = /** @class */ (function () {
        function GeolocationService() {
        }
        GeolocationService.prototype.postGeolocationCall = function () {
            if (externalData.BannerVariables.domainData.IsIabEnabled) {
                iabV2.assignIABGlobalScope();
            }
            consentNoticeV2.geoLocationCallback();
        };
        GeolocationService.prototype.setGeoLocation = function (country, state) {
            if (state === void 0) { state = ''; }
            externalData.userLocation = {
                country: country,
                state: state
            };
        };
        return GeolocationService;
    }());
    var geolocationService;
    function initializeGeolocation() {
        geolocationService = new GeolocationService();
    }

    var PublicAPIV2 = /** @class */ (function () {
        function PublicAPIV2() {
            this.useGeoLocationService = externalData.BannerVariables.useGeoLocationService;
            this.groupsClass = groupsV2;
            this.sdkEvents = sdkEventsV2;
            // Alias for old function name
            this.IsAlertBoxClosed = this.IsAlertBoxClosedAndValid;
            this.InitializeBanner = function () { return consentNoticeV2.loadDefaultBannerGroup(); };
            this.getHTML = function () {
                if (!document.getElementById('onetrust-banner-sdk')) {
                    consentNoticeV2.insertConsentNoticeHtml();
                    publicAPIV2.sdkEvents.insertAlertHtml();
                }
                return consentNoticeNext.processedHTML;
            };
            this.getCSS = function () { return consentNoticeV2.processedCSS; };
            this.setConsentProfile = function (consentData) {
                // Set Custom Payload in cookie
                if (consentData.customPayload) {
                    var customPayload = consentData.customPayload;
                    if (customPayload.Interaction) {
                        externalData.writeCookieParam(externalData.BannerVariables.optanonCookieName, externalData.BannerVariables.bannerInteractionParam, customPayload.Interaction);
                    }
                }
                // Set Custom Id in cookie
                var id = consentData.identifier;
                externalData.writeCookieParam(externalData.BannerVariables.optanonCookieName, externalData.BannerVariables.consentIntegrationParam, id);
                // Set Purposes in cookie
                publicAPIV2.synchroniseCookieWithPayload(consentData.purposes);
                // Trigger Optanon wrapper function
                coreEvents.executeOptanonWrapper();
            };
            // Inserts a script tag into page at specified location //
            // url: script tag reference url
            // selector: container element of script tag (possible values: 'head', 'body', '<element id>')
            // callback: callback method after script tag has been inserted
            // options: contains behaviors once the script is inserted
            //      options.deleteSelectorContent (boolean): set to true to delete all selector content before inserting script
            //      options.makeSelectorVisible (boolean): set to true to show selector after inserting script
            //      options.makeElementsVisible (array[string]): set the id's of arbitrary elements to show after inserting script
            //      options.deleteElements (array[string]): set the id's of arbitrary elements to delete after inserting script
            // groupId: if implied consent, the Optanon Group Id for which the script tag should be inserted
            this.InsertScript = function (url, selector, callback, options, groupId, async) {
                var validOptions = options != null && typeof options !== 'undefined';
                var ignoreGroupCheck = validOptions &&
                    typeof options.ignoreGroupCheck !== 'undefined' &&
                    options.ignoreGroupCheck === true;
                var i;
                var j;
                var script;
                var done;
                if (groupsV2.canInsertForGroup(groupId, ignoreGroupCheck) &&
                    !moduleHelper.contains(externalData.BannerVariables.optanonWrapperScriptExecutedGroups, groupId)) {
                    // Delay adding group to optanonWrapperScriptExecutedGroups
                    externalData.BannerVariables.optanonWrapperScriptExecutedGroupsTemp.push(groupId);
                    if (validOptions &&
                        typeof options.deleteSelectorContent !== 'undefined' &&
                        options.deleteSelectorContent === true) {
                        moduleHelper.empty(selector);
                    }
                    script = document.createElement('script');
                    if (callback != null && typeof callback !== 'undefined') {
                        done = false;
                        script.onload = script.onreadystatechange = function () {
                            if (!done &&
                                (!this.readyState ||
                                    this.readyState === 'loaded' ||
                                    this.readyState === 'complete')) {
                                done = true;
                                callback();
                            }
                        };
                    }
                    script.type = 'text/javascript';
                    script.src = url;
                    if (async) {
                        script.async = async;
                    }
                    switch (selector) {
                        case 'head':
                            document.getElementsByTagName('head')[0].appendChild(script);
                            break;
                        case 'body':
                            document.getElementsByTagName('body')[0].appendChild(script);
                            break;
                        default:
                            var element = document.getElementById(selector);
                            if (element) {
                                element.appendChild(script);
                                if (validOptions &&
                                    typeof options.makeSelectorVisible !== 'undefined' &&
                                    options.makeSelectorVisible === true) {
                                    moduleHelper.show(selector);
                                }
                            }
                            break;
                    }
                    if (validOptions && typeof options.makeElementsVisible !== 'undefined') {
                        for (i = 0; i < options.makeElementsVisible.length; i += 1) {
                            moduleHelper.show(options.makeElementsVisible[i]);
                        }
                    }
                    if (validOptions && typeof options.deleteElements !== 'undefined') {
                        for (j = 0; j < options.deleteElements.length; j += 1) {
                            moduleHelper.remove(options.deleteElements[j]);
                        }
                    }
                }
            };
            // Inserts an arbitrary html tag into page at specified location //
            // element: html element
            // selector: container element of html element (possible values: '<element id>')
            // callback: callback method after html element has been inserted
            // options: contains behaviors once the html is inserted
            //      options.deleteSelectorContent (boolean): set to true to delete all selector content before inserting html
            //      options.makeSelectorVisible (boolean): set to true to show selector after inserting html
            //      options.makeElementsVisible (array[string]): set the id's of arbitrary elements to show after inserting html
            //      options.deleteElements (array[string]): set the id's of arbitrary elements to delete after inserting html
            // groupId: if implied consent, the Optanon Group Id for which the html element should be inserted
            this.InsertHtml = function (element, selector, callback, options, groupId) {
                var validOptions = options != null && typeof options !== 'undefined';
                var ignoreGroupCheck = validOptions &&
                    typeof options.ignoreGroupCheck !== 'undefined' &&
                    options.ignoreGroupCheck === true;
                var i;
                var j;
                if (groupsV2.canInsertForGroup(groupId, ignoreGroupCheck) &&
                    !moduleHelper.contains(externalData.BannerVariables.optanonWrapperHtmlExecutedGroups, groupId)) {
                    // Delay adding group to optanonWrapperHtmlExecutedGroups
                    externalData.BannerVariables.optanonWrapperHtmlExecutedGroupsTemp.push(groupId);
                    if (validOptions &&
                        typeof options.deleteSelectorContent !== 'undefined' &&
                        options.deleteSelectorContent === true) {
                        moduleHelper.empty(selector);
                    }
                    moduleHelper.appendTo(selector, element);
                    if (validOptions &&
                        typeof options.makeSelectorVisible !== 'undefined' &&
                        options.makeSelectorVisible === true) {
                        moduleHelper.show(selector);
                    }
                    if (validOptions && typeof options.makeElementsVisible !== 'undefined') {
                        for (i = 0; i < options.makeElementsVisible.length; i += 1) {
                            moduleHelper.show(options.makeElementsVisible[i]);
                        }
                    }
                    if (validOptions && typeof options.deleteElements !== 'undefined') {
                        for (j = 0; j < options.deleteElements.length; j += 1) {
                            moduleHelper.remove(options.deleteElements[j]);
                        }
                    }
                    if (callback != null && typeof callback !== 'undefined') {
                        callback();
                    }
                }
            };
            // Selectively blocks Google Analytics tracking functionality when consent has not been given
            this.BlockGoogleAnalytics = function (gaId, groupId) {
                window['ga-disable-' + gaId] = !groupsV2.canInsertForGroup(groupId);
            };
        }
        // Returns if alert box has been closed by checking if setOptanonAlertBoxCookie exists
        PublicAPIV2.prototype.IsAlertBoxClosedAndValid = function () {
            return externalData.isAlertBoxClosedAndValid();
        };
        PublicAPIV2.prototype.LoadBanner = function () {
            publicAPINext.loadBanner();
        };
        PublicAPIV2.prototype.Init = function () {
            polyfill.insertViewPortTag();
            // Populates optanonHtmlGroupData from cookie or default statuses
            coreNext.ensureHtmlGroupDataInitialised();
            // Populates Google Tag Manager macro global Optanon variable
            gtm.updateGtmMacros(!externalData.readCookieParam(externalData.BannerVariables.optanonCookieName, 'groups'));
            landingPath.initialiseLandingPath();
            // Inserts reguired css references
            consentNoticeV2.initialiseCssReferences();
        };
        // Toggles consent notice visible state
        PublicAPIV2.prototype.ToggleInfoDisplay = function () {
            publicAPIV2.sdkEvents.toggleInfoDisplay();
        };
        PublicAPIV2.prototype.Close = function (closeFromCookie) {
            publicAPIV2.sdkEvents.close(closeFromCookie);
        };
        PublicAPIV2.prototype.AllowAll = function (consentIgnoreForGeoLookup) {
            coreEvents.allowAllEvent(consentIgnoreForGeoLookup);
        };
        PublicAPIV2.prototype.RejectAll = function (consentIgnoreForGeoLookup) {
            coreEvents.rejectAllEvent(consentIgnoreForGeoLookup);
        };
        PublicAPIV2.prototype.setDataSubjectId = function (id) {
            externalData.writeCookieParam(externalData.BannerVariables.optanonCookieName, externalData.BannerVariables.consentIntegrationParam, id);
        };
        PublicAPIV2.prototype.getDataSubjectId = function () {
            return externalData.readCookieParam(externalData.BannerVariables.optanonCookieName, externalData.BannerVariables.consentIntegrationParam);
        };
        PublicAPIV2.prototype.synchroniseCookieWithPayload = function (payloadPurposes) {
            var groupDataFromCookies = externalData.readCookieParam(externalData.BannerVariables.optanonCookieName, 'groups');
            var cookieGroupData = moduleHelper.deserialiseStringToArray(groupDataFromCookies);
            var updatedGroupData = [];
            cookieGroupData.forEach(function (item) {
                var groupData = item.split(':');
                var group = groupsNext.getGroupById(groupData[0]);
                var updatedPurpose;
                payloadPurposes.some(function (data) {
                    if (data.Id === group.PurposeId) {
                        updatedPurpose = data;
                        return true;
                    }
                });
                if (updatedPurpose) {
                    if (updatedPurpose.TransactionType ===
                        externalData.BannerVariables.constant.TRANSACTIONTYPE.CONFIRMED) {
                        updatedGroupData.push(groupData[0] + ":1");
                        if (group.Parent) {
                            sdkEventsV2.toggleSubCategory(null, group.CustomGroupId, true, group.CustomGroupId);
                        }
                        else {
                            sdkEventsV2.toggleV2Category(null, group, true, group.CustomGroupId);
                        }
                    }
                    else {
                        updatedGroupData.push(groupData[0] + ":0");
                        if (group.Parent) {
                            sdkEventsV2.toggleSubCategory(null, group.CustomGroupId, false, group.CustomGroupId);
                        }
                        else {
                            sdkEventsV2.toggleV2Category(null, group, false, group.CustomGroupId);
                        }
                    }
                }
                else {
                    updatedGroupData.push(groupData[0] + ":" + groupData[1]);
                }
            });
            cookieClass.writeCookieGroupsParam(externalData.BannerVariables.optanonCookieName, updatedGroupData);
        };
        PublicAPIV2.prototype.getGeolocationData = function () {
            return externalData.userLocation;
        };
        // Optanon UI Google Analytics event tracking
        PublicAPIV2.prototype.TriggerGoogleAnalyticsEvent = function (category, action, label, value) {
            publicAPINext.triggerGoogleAnalyticsEvent(category, action, label, value);
        };
        // if Re-consent is needed, update groups according to their default status
        PublicAPIV2.prototype.ReconsentGroups = function () {
            var toUpdateCookie = false;
            var cookieData = externalData.readCookieParam(externalData.BannerVariables.optanonCookieName, 'groups'); // Groups
            var cookieGroupData = moduleHelper.deserialiseStringToArray(cookieData);
            var cookieGroupDataStripped = moduleHelper.deserialiseStringToArray(cookieData.replace(/:0|:1/g, ''));
            var toUpdateHostCookie = false;
            var hostData = externalData.readCookieParam(externalData.BannerVariables.optanonCookieName, 'hosts'); // Hosts
            var cookieHostData = moduleHelper.deserialiseStringToArray(hostData);
            var cookieHostDataStripped = moduleHelper.deserialiseStringToArray(hostData.replace(/:0|:1/g, ''));
            var json = externalData.BannerVariables.domainData;
            var reconsentStatuses = [
                'inactive',
                'inactive landingpage',
                'do not track'
            ];
            if (cookieData) {
                json.Groups.forEach(function (group) {
                    group.SubGroups.concat([group]).forEach(function (grp) {
                        var groupId = groupsHelper.getGroupIdForCookie(grp);
                        var index = moduleHelper.indexOf(cookieGroupDataStripped, groupId);
                        if (index === -1) {
                            return;
                        }
                        var statusText = groupsNext
                            .safeGroupDefaultStatus(grp)
                            .toLowerCase();
                        if (reconsentStatuses.indexOf(statusText) > -1) {
                            toUpdateCookie = true;
                            cookieGroupData[index] = "" + groupId + (statusText === 'inactive landingpage' ? ':1' : ':0');
                        }
                    });
                });
                // Writing updated cookie
                if (toUpdateCookie) {
                    cookieClass.writeCookieGroupsParam(externalData.BannerVariables.optanonCookieName, cookieGroupData);
                }
            }
            if (hostData) {
                json.Groups.forEach(function (group) {
                    group.SubGroups.concat([group]).forEach(function (grp) {
                        grp.Hosts.forEach(function (host) {
                            // TODO combine it with the group logic
                            var index = moduleHelper.indexOf(cookieHostDataStripped, host.HostId);
                            if (index === -1) {
                                return;
                            }
                            var statusText = groupsNext
                                .safeGroupDefaultStatus(grp)
                                .toLowerCase();
                            if (reconsentStatuses.indexOf(statusText) > -1) {
                                toUpdateHostCookie = true;
                                cookieHostData[index] = "" + host.HostId + (statusText === 'inactive landingpage' ? ':1' : ':0');
                            }
                        });
                    });
                });
                // Writing updated cookie
                if (toUpdateHostCookie) {
                    cookieClass.writeHostCookieParam(externalData.BannerVariables.optanonCookieName, cookieHostData);
                }
            }
        };
        // Sets setOptanonAlertBoxCookie cookie indicating alert box has been closed
        PublicAPIV2.prototype.SetAlertBoxClosed = function (isOptanonAlertBoxCookiePersistent) {
            publicAPINext.setAlertBoxClosed(isOptanonAlertBoxCookiePersistent);
        };
        // Client facing wrapper around optanonData, returns groups, cookies and other domain data
        PublicAPIV2.prototype.GetDomainData = function () {
            return externalData.BannerVariables.publicDomainData;
        };
        return PublicAPIV2;
    }());
    var publicAPIV2;
    function initializePublicAPIV2() {
        publicAPIV2 = new PublicAPIV2();
    }

    var MobilePublicAPI = /** @class */ (function (_super) {
        __extends(MobilePublicAPI, _super);
        function MobilePublicAPI() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.mobileOnlineURL = externalData.BannerVariables.mobileOnlineURL;
            return _this;
        }
        // Close consent notice and writes cookie
        MobilePublicAPI.prototype.Close = function (closeFromCookie) {
            // MOBILE EVENT LISTNER
            coreEvents.closeBanner(false);
            window.location.href = 'http://otsdk//consentChanged';
        };
        // Close consent notice, writes cookies and executes wrapper function
        MobilePublicAPI.prototype.RejectAll = function (consentIgnoreForGeoLookup) {
            coreEvents.rejectAllEvent();
            // MOBILE EVENT LISTNER
            window.location.href = 'http://otsdk//consentChanged';
        };
        // Close consent notice, writes cookies and executes wrapper function
        MobilePublicAPI.prototype.AllowAll = function (consentIgnoreForGeoLookup) {
            coreEvents.AllowAllV2(consentIgnoreForGeoLookup);
            // MOBILE EVENT LISTNER
            window.location.href = 'http://otsdk//consentChanged';
        };
        // Toggles consent notice visible state
        MobilePublicAPI.prototype.ToggleInfoDisplay = function () {
            sdkEventsV2.toggleInfoDisplay();
        };
        return MobilePublicAPI;
    }(PublicAPIV2));
    var mobileSDKPublicAPI;
    function initializeMobileSDKPublicAPI() {
        mobileSDKPublicAPI = new MobilePublicAPI();
    }

    var ConsentSetting = /** @class */ (function () {
        function ConsentSetting() {
            externalData.setConsentModelFlag(this.getIsOptInMode(), this.getIsSoftOptInMode());
        }
        // Returns true if all json default group statuses are set to inactive (excluding 'always active' groups)
        ConsentSetting.prototype.getIsOptInMode = function () {
            var json = externalData.BannerVariables.domainData;
            var isOptIn = !json.Groups.some(function (group) {
                var groupStatus = groupsNext
                    .safeGroupDefaultStatus(group)
                    .toLowerCase();
                if (!groupStatus ||
                    groupStatus === 'active' ||
                    groupStatus === 'inactive landingpage' ||
                    groupStatus === externalData.BannerVariables.doNotTrackText) {
                    return true;
                }
                return group.SubGroups.some(function (subGroup) {
                    var groupStatus = groupsNext
                        .safeGroupDefaultStatus(subGroup)
                        .toLowerCase();
                    if (!groupStatus ||
                        groupStatus === 'active' ||
                        groupStatus === 'inactive landingpage' ||
                        groupStatus === externalData.BannerVariables.doNotTrackText) {
                        return true;
                    }
                });
            });
            return isOptIn;
        };
        // Returns true if all json default group statuses are set to inactive landingpage (excluding 'always active' groups)
        ConsentSetting.prototype.getIsSoftOptInMode = function () {
            var json = externalData.BannerVariables.domainData;
            var isSoftOptIn = !json.Groups.some(function (group) {
                var groupStatus = groupsNext
                    .safeGroupDefaultStatus(group)
                    .toLowerCase();
                if (groupStatus !== 'inactive landingpage' &&
                    groupStatus !== 'always active') {
                    return true;
                }
                return group.SubGroups.some(function (subGroup) {
                    var groupStatus = groupsNext
                        .safeGroupDefaultStatus(subGroup)
                        .toLowerCase();
                    if (groupStatus !== 'inactive landingpage' &&
                        groupStatus !== 'always active') {
                        return true;
                    }
                });
            });
            return isSoftOptIn;
        };
        return ConsentSetting;
    }());
    var consentSetting;
    function initializeConsentSetting() {
        consentSetting = new ConsentSetting();
    }

    function initConsentSDK() {
        polyfill.initPolyfill();
        initializeHelperNext();
        setDomainData();
        initSDKData();
    }
    function initializeModulesAfterBannerVariables() {
        initializeShowSubgroupToggleV2();
        initializeCookie();
        /**
         * GroupsNext must come before ConsentSetting because it's called in ConsentSetting's constructor
         */
        initializeGroupsNext();
        initializeConsentSetting();
        initializeConsentIntegration();
        initializeBannerPushDown();
        // Next
        initializeSdkEventsNext();
        initializeLandingPathNext();
        initializeConsentNoticeNext();
    }
    function initSDKData() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                initializeGroupsV2();
                initializeSdkElementsV2();
                initializeIabV2();
                initializeCoreV2();
                initializeCoreEvents();
                initializeSdkEventsV2();
                initializeConsentNoticeV2();
                initializeCoreNext();
                initializeGtm();
                initializeLandingPath();
                initializeGeolocation();
                initializePublicAPINext();
                if (moduleInitializer.moduleInitializer.MobileSDK) {
                    initializeMobileSDKPublicAPI();
                }
                else {
                    initializePublicAPIV2();
                }
                /**
                 * Have to initialize anything assigned to the public API before running executeSDK
                 */
                initializeIabNext();
                externalData.setBannerScriptData().then(function (scriptData) {
                    executeSDK(scriptData);
                });
                return [2 /*return*/];
            });
        });
    }
    function setDomainData() {
        if (window.otStubData) {
            moduleInitializer.moduleInitializer = window.otStubData.domainData;
            helperNext.setBannerScriptElement(window.otStubData.stubElement);
            externalData.setRegionRule(window.otStubData.regionRule); // set region rule selection
            externalData.userLocation = window.otStubData.userLocation; // set user location
            externalData.setbannerDataParentURL(window.otStubData.bannerBaseDataURL);
            externalData.BannerVariables.mobileOnlineURL = externalData.BannerVariables.mobileOnlineURL.concat(window.otStubData.mobileOnlineURL);
            window.otStubData = null;
            window.OneTrustStub = null;
        }
    }
    function executeSDK(response) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        window.OneTrust = window.Optanon = Object.assign({}, window.OneTrust, assignPublicAPI(response.DomainData));
                        // has to be done before publicAPI is init'd but after it's assigned??
                        // api can't be assigned until publicAPI is init'd
                        return [4 /*yield*/, externalData.initializeBannerVariables(response)];
                    case 1:
                        // has to be done before publicAPI is init'd but after it's assigned??
                        // api can't be assigned until publicAPI is init'd
                        _a.sent();
                        initializeModulesAfterBannerVariables();
                        if (externalData.BannerVariables.domainData.IsIabEnabled) {
                            externalData.populateIABCookies();
                            if (externalData.BannerVariables.domainData.IabType === 'IAB') {
                                window.__cmp = moduleInitializer.moduleInitializer.otIABModuleData.excuteAPI;
                                // Process queue only for CMP
                                moduleInitializer.moduleInitializer.otIABModuleData.proccessQueue();
                            }
                        }
                        // initialize Banner and preference center assests
                        return [4 /*yield*/, consentNoticeV2.init()];
                    case 2:
                        // initialize Banner and preference center assests
                        _a.sent();
                        if (moduleInitializer.moduleInitializer.MobileSDK) {
                            mobileSDKPublicAPI.Init();
                        }
                        else {
                            publicAPIV2.Init();
                        }
                        geolocationService.postGeolocationCall();
                        if (!externalData.isIABCrossConsentEnabled()) {
                            if (moduleInitializer.moduleInitializer.MobileSDK) {
                                mobileSDKPublicAPI.LoadBanner();
                            }
                            else {
                                publicAPIV2.LoadBanner();
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    /**
     * Use to assign all public API's, assignment avoid removing code during tree shaking
     */
    function assignPublicAPI(domainData) {
        var isMobileSdk = moduleInitializer.moduleInitializer.MobileSDK;
        // TODO: typing issues because of extension, etc.
        var publicApi;
        if (isMobileSdk) {
            publicApi = mobileSDKPublicAPI;
        }
        else {
            publicApi = publicAPIV2;
        }
        // Sort in alphabetical order
        var onetrustObj = {
            AllowAll: publicApi.AllowAll,
            BlockGoogleAnalytics: publicApi.BlockGoogleAnalytics,
            Close: publicApi.Close,
            getCSS: publicApi.getCSS,
            GetDomainData: publicApi.GetDomainData,
            getGeolocationData: publicApi.getGeolocationData,
            getHTML: publicApi.getHTML,
            Init: publicApi.Init,
            InitializeBanner: publicApi.InitializeBanner,
            initializeCookiePolicyHtml: consentNoticeV2.insertCookiePolicyHtml.bind(consentNoticeV2),
            InsertHtml: publicApi.InsertHtml,
            InsertScript: publicApi.InsertScript,
            IsAlertBoxClosed: publicApi.IsAlertBoxClosed,
            IsAlertBoxClosedAndValid: publicApi.IsAlertBoxClosedAndValid,
            LoadBanner: publicApi.LoadBanner,
            OnConsentChanged: publicAPINext.OnConsentChanged,
            ReconsentGroups: publicApi.ReconsentGroups,
            RejectAll: publicApi.RejectAll,
            SetAlertBoxClosed: publicApi.SetAlertBoxClosed,
            setGeoLocation: geolocationService.setGeoLocation,
            ToggleInfoDisplay: publicApi.ToggleInfoDisplay,
            TriggerGoogleAnalyticsEvent: publicApi.TriggerGoogleAnalyticsEvent,
            useGeoLocationService: publicApi.useGeoLocationService
        };
        if (domainData.IsConsentLoggingEnabled) {
            onetrustObj.getDataSubjectId = publicApi.getDataSubjectId;
            onetrustObj.setConsentProfile = publicApi.setConsentProfile;
            onetrustObj.setDataSubjectId = publicApi.setDataSubjectId;
        }
        if (isMobileSdk) {
            onetrustObj.mobileOnlineURL = publicApi.mobileOnlineURL;
            onetrustObj.otCookieData = externalData.otCookieData;
        }
        if (domainData.IsIabEnabled) {
            onetrustObj.updateConsentFromCookies = publicAPINext.updateConsentFromCookie;
            if (domainData.IabType === 'IAB') {
                onetrustObj.getConsentDataRequest = iabNext.getConsentDataRequest;
                onetrustObj.getPingRequest = iabNext.getPingRequest;
                onetrustObj.getVendorConsentsRequest = iabNext.getVendorConsentsRequest;
            }
            else if (domainData.IabType === 'IAB2') {
                onetrustObj.getPingRequest = iabNext.getPingRequestForTcf;
                onetrustObj.getVendorConsentsRequestV2 = iabNext.getVendorConsentsRequestV2;
            }
        }
        return onetrustObj;
    }
    initConsentSDK();

}());