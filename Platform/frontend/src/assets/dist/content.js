/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/webextension-polyfill/dist/browser-polyfill.js":
/*!*********************************************************************!*\
  !*** ./node_modules/webextension-polyfill/dist/browser-polyfill.js ***!
  \*********************************************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else // removed by dead control flow
{ var mod; }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (module) {
  /* webextension-polyfill - v0.12.0 - Tue May 14 2024 18:01:29 */
  /* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */
  /* vim: set sts=2 sw=2 et tw=80: */
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  "use strict";

  if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
    throw new Error("This script should only be loaded in a browser extension.");
  }
  if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";

    // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.
    const wrapAPIs = extensionAPIs => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "disable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "enable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "openPopup": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setBadgeText": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "browsingData": {
          "remove": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "removeCache": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCookies": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeDownloads": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFormData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeHistory": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeLocalStorage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePasswords": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePluginData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "settings": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2,
              "singleCallbackArg": false
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            },
            "elements": {
              "createSidebarPane": {
                "minArgs": 1,
                "maxArgs": 1
              }
            }
          }
        },
        "downloads": {
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "identity": {
          "launchWebAuthFlow": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setEnabled": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "permissions": {
          "contains": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "request": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "sessions": {
          "getDevices": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getRecentlyClosed": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "restore": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "discard": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goBack": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goForward": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "topSites": {
          "get": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };
      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }

      /**
       * A WeakMap subclass which creates and stores a value for any key which does
       * not exist when accessed, but behaves exactly as an ordinary WeakMap
       * otherwise.
       *
       * @param {function} createItem
       *        A function which will be called in order to create the value for any
       *        key which does not exist, the first time it is accessed. The
       *        function receives, as its only argument, the key being created.
       */
      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }
        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }
          return super.get(key);
        }
      }

      /**
       * Returns true if the given object is an object with a `then` method, and can
       * therefore be assumed to behave as a Promise.
       *
       * @param {*} value The value to test.
       * @returns {boolean} True if the value is thenable.
       */
      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };

      /**
       * Creates and returns a function which, when called, will resolve or reject
       * the given promise based on how it is called:
       *
       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
       *   the promise is rejected with that value.
       * - If the function is called with exactly one argument, the promise is
       *   resolved to that value.
       * - Otherwise, the promise is resolved to an array containing all of the
       *   function's arguments.
       *
       * @param {object} promise
       *        An object containing the resolution and rejection functions of a
       *        promise.
       * @param {function} promise.resolve
       *        The promise's resolution function.
       * @param {function} promise.reject
       *        The promise's rejection function.
       * @param {object} metadata
       *        Metadata about the wrapped method which has created the callback.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function}
       *        The generated callback function.
       */
      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (extensionAPIs.runtime.lastError) {
            promise.reject(new Error(extensionAPIs.runtime.lastError.message));
          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };
      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";

      /**
       * Creates a wrapper function for a method with the given name and metadata.
       *
       * @param {string} name
       *        The name of the method which is being wrapped.
       * @param {object} metadata
       *        Metadata about the method being wrapped.
       * @param {integer} metadata.minArgs
       *        The minimum number of arguments which must be passed to the
       *        function. If called with fewer than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxArgs
       *        The maximum number of arguments which may be passed to the
       *        function. If called with more than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function(object, ...*)}
       *       The generated wrapper function.
       */
      const wrapAsyncFunction = (name, metadata) => {
        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }
          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }
          return new Promise((resolve, reject) => {
            if (metadata.fallbackToNoCallback) {
              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
              // and so the polyfill will try to call it with a callback first, and it will fallback
              // to not passing the callback if the first call fails.
              try {
                target[name](...args, makeCallback({
                  resolve,
                  reject
                }, metadata));
              } catch (cbError) {
                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
                target[name](...args);

                // Update the API method metadata, so that the next API calls will not try to
                // use the unsupported callback anymore.
                metadata.fallbackToNoCallback = false;
                metadata.noCallback = true;
                resolve();
              }
            } else if (metadata.noCallback) {
              target[name](...args);
              resolve();
            } else {
              target[name](...args, makeCallback({
                resolve,
                reject
              }, metadata));
            }
          });
        };
      };

      /**
       * Wraps an existing method of the target object, so that calls to it are
       * intercepted by the given wrapper function. The wrapper function receives,
       * as its first argument, the original `target` object, followed by each of
       * the arguments passed to the original method.
       *
       * @param {object} target
       *        The original target object that the wrapped method belongs to.
       * @param {function} method
       *        The method being wrapped. This is used as the target of the Proxy
       *        object which is created to wrap the method.
       * @param {function} wrapper
       *        The wrapper function which is called in place of a direct invocation
       *        of the wrapped method.
       *
       * @returns {Proxy<function>}
       *        A Proxy object for the given method, which invokes the given wrapper
       *        method in its place.
       */
      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }
        });
      };
      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

      /**
       * Wraps an object in a Proxy which intercepts and wraps certain methods
       * based on the given `wrappers` and `metadata` objects.
       *
       * @param {object} target
       *        The target object to wrap.
       *
       * @param {object} [wrappers = {}]
       *        An object tree containing wrapper functions for special cases. Any
       *        function present in this object tree is called in place of the
       *        method in the same location in the `target` object tree. These
       *        wrapper methods are invoked as described in {@see wrapMethod}.
       *
       * @param {object} [metadata = {}]
       *        An object tree containing metadata used to automatically generate
       *        Promise-based wrapper functions for asynchronous. Any function in
       *        the `target` object tree which has a corresponding metadata object
       *        in the same location in the `metadata` tree is replaced with an
       *        automatically-generated wrapper function, as described in
       *        {@see wrapAsyncFunction}
       *
       * @returns {Proxy<object>}
       */
      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);
        let handlers = {
          has(proxyTarget, prop) {
            return prop in target || prop in cache;
          },
          get(proxyTarget, prop, receiver) {
            if (prop in cache) {
              return cache[prop];
            }
            if (!(prop in target)) {
              return undefined;
            }
            let value = target[prop];
            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.

              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else if (hasOwnProperty(metadata, "*")) {
              // Wrap all properties in * namespace.
              value = wrapObject(value, wrappers[prop], metadata["*"]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,
                get() {
                  return target[prop];
                },
                set(value) {
                  target[prop] = value;
                }
              });
              return value;
            }
            cache[prop] = value;
            return value;
          },
          set(proxyTarget, prop, value, receiver) {
            if (prop in cache) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }
            return true;
          },
          defineProperty(proxyTarget, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },
          deleteProperty(proxyTarget, prop) {
            return Reflect.deleteProperty(cache, prop);
          }
        };

        // Per contract of the Proxy API, the "get" proxy handler must return the
        // original value of the target if that value is declared read-only and
        // non-configurable. For this reason, we create an object with the
        // prototype set to `target` instead of using `target` directly.
        // Otherwise we cannot return a custom object for APIs that
        // are declared read-only and non-configurable, such as `chrome.devtools`.
        //
        // The proxy handlers themselves will still use the original `target`
        // instead of the `proxyTarget`, so that the methods and properties are
        // dereferenced via the original targets.
        let proxyTarget = Object.create(target);
        return new Proxy(proxyTarget, handlers);
      };

      /**
       * Creates a set of wrapper functions for an event object, which handles
       * wrapping of listener functions that those messages are passed.
       *
       * A single wrapper is created for each listener function, and stored in a
       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
       * retrieve the original wrapper, so that  attempts to remove a
       * previously-added listener work as expected.
       *
       * @param {DefaultWeakMap<function, function>} wrapperMap
       *        A DefaultWeakMap object which will create the appropriate wrapper
       *        for a given listener function when one does not exist, and retrieve
       *        an existing one when it does.
       *
       * @returns {object}
       */
      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },
        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },
        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }
      });
      const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps an onRequestFinished listener function so that it will return a
         * `getContent()` property which returns a `Promise` rather than using a
         * callback API.
         *
         * @param {object} req
         *        The HAR entry object representing the network request.
         */
        return function onRequestFinished(req) {
          const wrappedReq = wrapObject(req, {} /* wrappers */, {
            getContent: {
              minArgs: 0,
              maxArgs: 0
            }
          });
          listener(wrappedReq);
        };
      });
      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps a message listener function so that it may send responses based on
         * its return value, rather than by returning a sentinel value and calling a
         * callback. If the listener function returns a Promise, the response is
         * sent when the promise either resolves or rejects.
         *
         * @param {*} message
         *        The message sent by the other end of the channel.
         * @param {object} sender
         *        Details about the sender of the message.
         * @param {function(*)} sendResponse
         *        A callback which, when called with an arbitrary argument, sends
         *        that value as a response.
         * @returns {boolean}
         *        True if the wrapped listener returned a Promise, which will later
         *        yield a response. False otherwise.
         */
        return function onMessage(message, sender, sendResponse) {
          let didCallSendResponse = false;
          let wrappedSendResponse;
          let sendResponsePromise = new Promise(resolve => {
            wrappedSendResponse = function (response) {
              didCallSendResponse = true;
              resolve(response);
            };
          });
          let result;
          try {
            result = listener(message, sender, wrappedSendResponse);
          } catch (err) {
            result = Promise.reject(err);
          }
          const isResultThenable = result !== true && isThenable(result);

          // If the listener didn't returned true or a Promise, or called
          // wrappedSendResponse synchronously, we can exit earlier
          // because there will be no response sent from this listener.
          if (result !== true && !isResultThenable && !didCallSendResponse) {
            return false;
          }

          // A small helper to send the message if the promise resolves
          // and an error if the promise rejects (a wrapped sendMessage has
          // to translate the message into a resolved promise or a rejected
          // promise).
          const sendPromisedResult = promise => {
            promise.then(msg => {
              // send the message value.
              sendResponse(msg);
            }, error => {
              // Send a JSON representation of the error if the rejected value
              // is an instance of error, or the object itself otherwise.
              let message;
              if (error && (error instanceof Error || typeof error.message === "string")) {
                message = error.message;
              } else {
                message = "An unexpected error occurred";
              }
              sendResponse({
                __mozWebExtensionPolyfillReject__: true,
                message
              });
            }).catch(err => {
              // Print an error on the console if unable to send the response.
              console.error("Failed to send onMessage rejected reply", err);
            });
          };

          // If the listener returned a Promise, send the resolved value as a
          // result, otherwise wait the promise related to the wrappedSendResponse
          // callback to resolve and send it as a response.
          if (isResultThenable) {
            sendPromisedResult(result);
          } else {
            sendPromisedResult(sendResponsePromise);
          }

          // Let Chrome know that the listener is replying.
          return true;
        };
      });
      const wrappedSendMessageCallback = ({
        reject,
        resolve
      }, reply) => {
        if (extensionAPIs.runtime.lastError) {
          // Detect when none of the listeners replied to the sendMessage call and resolve
          // the promise to undefined as in Firefox.
          // See https://github.com/mozilla/webextension-polyfill/issues/130
          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
            resolve();
          } else {
            reject(new Error(extensionAPIs.runtime.lastError.message));
          }
        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
          // Convert back the JSON representation of the error into
          // an Error instance.
          reject(new Error(reply.message));
        } else {
          resolve(reply);
        }
      };
      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }
        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }
        return new Promise((resolve, reject) => {
          const wrappedCb = wrappedSendMessageCallback.bind(null, {
            resolve,
            reject
          });
          args.push(wrappedCb);
          apiNamespaceObj.sendMessage(...args);
        });
      };
      const staticWrappers = {
        devtools: {
          network: {
            onRequestFinished: wrapEvent(onRequestFinishedWrappers)
          }
        },
        runtime: {
          onMessage: wrapEvent(onMessageWrappers),
          onMessageExternal: wrapEvent(onMessageWrappers),
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 1,
            maxArgs: 3
          })
        },
        tabs: {
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 2,
            maxArgs: 3
          })
        }
      };
      const settingMetadata = {
        clear: {
          minArgs: 1,
          maxArgs: 1
        },
        get: {
          minArgs: 1,
          maxArgs: 1
        },
        set: {
          minArgs: 1,
          maxArgs: 1
        }
      };
      apiMetadata.privacy = {
        network: {
          "*": settingMetadata
        },
        services: {
          "*": settingMetadata
        },
        websites: {
          "*": settingMetadata
        }
      };
      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    };

    // The build process adds a UMD wrapper around this file, which makes the
    // `module` variable available.
    module.exports = wrapAPIs(chrome);
  } else {
    module.exports = globalThis.browser;
  }
});
//# sourceMappingURL=browser-polyfill.js.map


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calculateDaysRemaining: () => (/* binding */ calculateDaysRemaining),
/* harmony export */   checkLicenseStatus: () => (/* binding */ checkLicenseStatus),
/* harmony export */   delay: () => (/* binding */ delay),
/* harmony export */   downloadFile: () => (/* binding */ downloadFile),
/* harmony export */   formatNumber: () => (/* binding */ formatNumber),
/* harmony export */   getLicense: () => (/* binding */ getLicense),
/* harmony export */   removeLicense: () => (/* binding */ removeLicense),
/* harmony export */   saveLicense: () => (/* binding */ saveLicense),
/* harmony export */   sendMessage: () => (/* binding */ sendMessage),
/* harmony export */   sendMessageToTab: () => (/* binding */ sendMessageToTab),
/* harmony export */   storage: () => (/* binding */ storage),
/* harmony export */   updateTab: () => (/* binding */ updateTab),
/* harmony export */   validateLicense: () => (/* binding */ validateLicense)
/* harmony export */ });
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webextension-polyfill */ "./node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);

async function sendMessage(request) {
    const response = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.sendMessage(request);
    return response;
}
async function sendMessageToTab(request) {
    const [tab] = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.query({
        active: true,
        lastFocusedWindow: true,
    });
    if (tab && tab.id) {
        const response = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.sendMessage(tab.id, request);
        return response;
    }
}
async function updateTab(url) {
    const [tab] = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.query({
        active: true,
        lastFocusedWindow: true,
    });
    if (tab && tab.id) {
        const response = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.update(tab.id, { url });
        return response;
    }
}
class StorageService {
    async get(key) {
        try {
            const localStorage = await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().storage.local.get(key);
            if (key) {
                return localStorage[key] !== undefined ? localStorage[key] : null;
            }
            return localStorage;
        }
        catch (error) {
            console.error('Error retrieving data:', error);
            return null;
        }
    }
    async set(key, value) {
        try {
            await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().storage.local.set({ [key]: value });
        }
        catch (error) {
            console.error('Error setting data:', error);
        }
    }
    async remove(key) {
        try {
            await webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().storage.local.remove(key);
        }
        catch (error) {
            console.error('Error removing data:', error);
        }
    }
}
const storage = new StorageService();
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}
function downloadFile(content, filename, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
}
// License validation functions
const API_BASE_URL = 'http://localhost:5000';
async function validateLicense(key) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/license/activation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                key,
                extensionName: chrome.runtime.getManifest().name
            })
        });
        const result = await response.json();
        if (response.ok && result.success) {
            return {
                valid: true,
                data: result.data
            };
        }
        else {
            return {
                valid: false,
                message: result.message || 'Invalid license key'
            };
        }
    }
    catch (error) {
        console.error('License validation error:', error);
        return {
            valid: false,
            message: 'Failed to connect to license server'
        };
    }
}
async function saveLicense(key, data) {
    await storage.set('licenseKey', key);
    await storage.set('licenseData', {
        ...data,
        validatedAt: new Date().toISOString()
    });
}
async function getLicense() {
    const key = await storage.get('licenseKey');
    const data = await storage.get('licenseData');
    return { key, data };
}
async function removeLicense() {
    await storage.remove('licenseKey');
    await storage.remove('licenseData');
}
async function checkLicenseStatus() {
    const { key, data } = await getLicense();
    if (!key) {
        return { valid: false, message: 'No license key found' };
    }
    // Check if we need to revalidate (every 24 hours or on browser restart)
    const shouldRevalidate = !data ||
        !data.validatedAt ||
        (new Date().getTime() - new Date(data.validatedAt).getTime()) > 24 * 60 * 60 * 1000;
    if (shouldRevalidate) {
        console.log('🔄 Revalidating license...');
        const result = await validateLicense(key);
        if (result.valid) {
            await saveLicense(key, result.data);
            return result;
        }
        else {
            // Invalid license, remove it
            await removeLicense();
            return result;
        }
    }
    // License is still valid from cache
    return { valid: true, data };
}
function calculateDaysRemaining(expiresAt) {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!************************!*\
  !*** ./src/content.ts ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");

// Global flag to prevent multiple initializations
let isInitialized = false;
let isScraperRunning = false;
// Create status overlay
const createStatusOverlay = () => {
    // Remove existing overlay if any
    const existing = document.getElementById('ads-scraper-status');
    if (existing) {
        existing.remove();
    }
    const overlay = document.createElement('div');
    overlay.id = 'ads-scraper-status';
    overlay.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 15px;
    border-radius: 8px;
    z-index: 999999;
    font-size: 14px;
    font-family: Arial, sans-serif;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    min-width: 200px;
  `;
    overlay.innerHTML = `
    <div style="margin-bottom: 8px; font-weight: bold; border-bottom: 1px solid #444; padding-bottom: 5px;">
      L2G Ads Scraper
    </div>
    <div style="margin-bottom: 5px;">Status: <span id="scraper-status-text" style="font-weight: bold;">Idle</span></div>
    <div style="margin-bottom: 5px;">Progress: <span id="scraper-progress-text">0/0</span></div>
    <div style="font-size: 12px; color: #aaa;">Updated: <span id="scraper-updated-time">${new Date().toLocaleTimeString()}</span></div>
  `;
    document.body.appendChild(overlay);
    console.log('✅ Status overlay created');
};
const updateStatusOverlay = (status) => {
    const statusText = document.getElementById('scraper-status-text');
    const progressText = document.getElementById('scraper-progress-text');
    const updatedTime = document.getElementById('scraper-updated-time');
    if (statusText && progressText && updatedTime) {
        statusText.textContent = status.state;
        progressText.textContent = `${status.current}/${status.total}`;
        updatedTime.textContent = new Date().toLocaleTimeString();
        if (status.state === 'Running') {
            statusText.style.color = '#4CAF50';
        }
        else if (status.state === 'Paused') {
            statusText.style.color = '#FFC107';
        }
        else if (status.state === 'Idle') {
            statusText.style.color = 'white';
        }
    }
};
const timestampToDate = (timestamp) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toISOString().split('T')[0];
};
// Helper function to format currency
const formatCurrency = (amount, currency = 'USD') => {
    if (!amount)
        return '';
    const num = parseInt(amount);
    if (isNaN(num))
        return amount;
    const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(num);
    return formatted;
};
// Main scraper function
const scrapeAdsData = async () => {
    if (isScraperRunning) {
        console.warn('⚠️ Scraper already running, skipping...');
        return;
    }
    isScraperRunning = true;
    console.log('🚀 Starting scraper...');
    let status = await _utils__WEBPACK_IMPORTED_MODULE_0__.storage.get('status') || {
        state: 'Idle',
        current: 0,
        total: 0,
        data: [],
        nextToken: undefined
    };
    if (!status.data) {
        status.data = [];
    }
    const settings = await _utils__WEBPACK_IMPORTED_MODULE_0__.storage.get('settings') || {
        enabled: false,
        delay: 2000,
        maxCount: 100,
        selectAll: false,
        mode: 'local'
    };
    if (!settings.enabled) {
        console.log('⚠️ Scraper not enabled in settings');
        isScraperRunning = false;
        return;
    }
    status.state = 'Running';
    status.total = settings.maxCount;
    await _utils__WEBPACK_IMPORTED_MODULE_0__.storage.set('status', status);
    updateStatusOverlay(status);
    chrome.runtime.sendMessage({
        event: 'statusUpdate',
        data: status
    }).catch(err => console.log('Popup closed:', err));
    try {
        let nextToken = null;
        let processedCount = 0;
        while (processedCount < settings.maxCount && status.state === 'Running') {
            status = await _utils__WEBPACK_IMPORTED_MODULE_0__.storage.get('status');
            if (status.state === 'Paused') {
                console.log('⏸️ Scraper paused');
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
            }
            if (status.state === 'Idle') {
                console.log('⏹️ Scraper stopped');
                break;
            }
            const data = await fetchAdsData(nextToken);
            if (!data) {
                console.log("❌ No data received");
                break;
            }
            let structuredData = await handleResponseData(data);
            const imageUrls = structuredData.map((item) => item.imageUrl);
            let domainList = [];
            try {
                domainList = await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.sendMessage)({ event: 'getDomains', data: imageUrls });
            }
            catch (error) {
                console.error('Error getting domains:', error);
                domainList = Array(imageUrls.length).fill('');
            }
            structuredData = structuredData.map((item, index) => ({
                ...item,
                domain: domainList[index] || item.domain
            }));
            await saveDataToLocalStorage(structuredData);
            nextToken = data?.['2'];
            processedCount += structuredData.length;
            status.current = processedCount;
            status.nextToken = nextToken;
            await _utils__WEBPACK_IMPORTED_MODULE_0__.storage.set('status', status);
            updateStatusOverlay(status);
            chrome.runtime.sendMessage({
                event: 'statusUpdate',
                data: status
            }).catch(err => console.log('Popup closed:', err));
            console.log(`✅ Processed ${processedCount}/${settings.maxCount} ads`);
            await new Promise(resolve => setTimeout(resolve, settings.delay));
            if (!nextToken) {
                console.log('✅ No more data available');
                break;
            }
        }
        if (status.state === 'Running') {
            status.state = 'Idle';
            await _utils__WEBPACK_IMPORTED_MODULE_0__.storage.set('status', status);
            updateStatusOverlay(status);
            chrome.runtime.sendMessage({
                event: 'statusUpdate',
                data: status
            }).catch(err => console.log('Popup closed:', err));
            console.log('✅ Scraping completed');
        }
    }
    catch (error) {
        console.error('❌ Error in scraper:', error);
        status.state = 'Idle';
        await _utils__WEBPACK_IMPORTED_MODULE_0__.storage.set('status', status);
        updateStatusOverlay(status);
    }
    finally {
        isScraperRunning = false;
    }
};
const saveDataToLocalStorage = async (data) => {
    const savedData = (await _utils__WEBPACK_IMPORTED_MODULE_0__.storage.get("dataList")) ?? [];
    const newArray = [...savedData, ...data];
    await _utils__WEBPACK_IMPORTED_MODULE_0__.storage.set("dataList", newArray);
    return true;
};
const handleResponseData = (data) => {
    let dataArray = [];
    function getImageUrlFromElementString(ele) {
        const match = ele.match(/<img[^>]+src="([^"]+)"/);
        return match ? match[1] : '';
    }
    data['1'].forEach(async (item) => {
        // Extract currency and spending from field 10 (min spend) and field 11 (max spend)
        let currency = 'USD';
        let minSpend = '';
        let maxSpend = '';
        // Field 10: Min spend - structure: {1: [{1: "USD", 2: "600"}]}
        if (item["10"] && item["10"]["1"] && item["10"]["1"][0]) {
            currency = item["10"]["1"][0]["1"] || 'USD';
            minSpend = item["10"]["1"][0]["2"] || '';
        }
        // Field 11: Max spend - structure: {1: [{1: "USD", 2: "700"}]}
        if (item["11"] && item["11"]["1"] && item["11"]["1"][0]) {
            if (!currency && item["11"]["1"][0]["1"]) {
                currency = item["11"]["1"][0]["1"];
            }
            maxSpend = item["11"]["1"][0]["2"] || '';
        }
        // Extract min and max shown range from fields 8 and 9
        const minShownRange = item["8"] || '';
        const maxShownRange = item["9"] || '';
        // Create formatted spend range
        let spendRange = '';
        if (minSpend && maxSpend) {
            spendRange = `${formatCurrency(minSpend, currency)} - ${formatCurrency(maxSpend, currency)}`;
        }
        else if (minSpend) {
            spendRange = `${formatCurrency(minSpend, currency)}+`;
        }
        else if (maxSpend) {
            spendRange = `Up to ${formatCurrency(maxSpend, currency)}`;
        }
        // Create formatted shown range
        let shownRange = '';
        if (minShownRange && maxShownRange) {
            shownRange = `${parseInt(minShownRange).toLocaleString()} - ${parseInt(maxShownRange).toLocaleString()}`;
        }
        else if (minShownRange) {
            shownRange = `${parseInt(minShownRange).toLocaleString()}+`;
        }
        else if (maxShownRange) {
            shownRange = `Up to ${parseInt(maxShownRange).toLocaleString()}`;
        }
        const adData = {
            advertiserId: item["1"] || '',
            advertiserName: item["12"] || '',
            urlDetail: `https://adstransparency.google.com/advertiser/${item["1"]}/creative/${item["2"]}`,
            startDate: item["6"] && item["6"]['1'] ? timestampToDate(item["6"]['1']) : '',
            endDate: item["7"] && item["7"]['1'] ? timestampToDate(item["7"]['1']) : '',
            totalDisplayDays: item["13"] || 0,
            domain: '',
            imageUrl: item["3"] && item["3"]['3'] && item["3"]['3']['2'] ?
                getImageUrlFromElementString(item["3"]['3']['2']) : '',
            minSpend: minSpend,
            maxSpend: maxSpend,
            currency: currency,
            spendRange: spendRange,
            minShownRange: minShownRange,
            maxShownRange: maxShownRange,
            shownRange: shownRange
        };
        dataArray.push(adData);
    });
    return dataArray;
};
const fetchAdsData = async (nextToken) => {
    const xsrfToken = await _utils__WEBPACK_IMPORTED_MODULE_0__.storage.get('xsrfToken');
    if (!xsrfToken) {
        console.error('❌ XSRF token not found. Please ensure you are logged in to Google Ads Transparency.');
        return null;
    }
    try {
        const myHeaders = new Headers();
        myHeaders.append("x-framework-xsrf-token", xsrfToken);
        const requestBody = JSON.parse(await _utils__WEBPACK_IMPORTED_MODULE_0__.storage.get('formData') || '{}');
        console.log('📤 Request body:', requestBody);
        if (nextToken) {
            requestBody["4"] = nextToken;
        }
        const urlencoded = new URLSearchParams();
        urlencoded.append("f.req", JSON.stringify(requestBody));
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: urlencoded,
            redirect: "follow"
        };
        const response = await fetch("https://adstransparency.google.com/anji/_/rpc/SearchService/SearchCreatives?authuser=0", requestOptions);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const result = await response.json();
        return result;
    }
    catch (error) {
        console.error('❌ Error fetching ads data:', error);
        return null;
    }
};
const setupNetworkInterceptor = () => {
    const originalFetch = window.fetch;
    window.fetch = async function (input, init) {
        const response = await originalFetch.apply(this, [input, init]);
        const responseClone = response.clone();
        try {
            const url = typeof input === 'string' ? input : input.url;
            if (url.includes('SearchCreatives') || url.includes('GetAdvertiserById')) {
                responseClone.json().then(data => {
                    _utils__WEBPACK_IMPORTED_MODULE_0__.storage.set(`intercepted_${Date.now()}`, { url, data });
                });
            }
        }
        catch (error) {
            console.error('Error in fetch interceptor:', error);
        }
        return response;
    };
};
// Initialize
const init = async () => {
    if (isInitialized) {
        console.log('⚠️ Content script already initialized');
        return;
    }
    console.log('🟢 L2G Ads Content Script Initializing...');
    createStatusOverlay();
    setupNetworkInterceptor();
    // Message listener
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('📨 Content script received message:', message.event);
        if (message.event === 'ping') {
            sendResponse({ success: true, message: 'Content script is alive' });
            return true;
        }
        if (message.event === 'start') {
            _utils__WEBPACK_IMPORTED_MODULE_0__.storage.get('settings').then((settings) => {
                const settingsObj = settings || {
                    enabled: true,
                    delay: 2000,
                    maxCount: 100,
                    selectAll: false,
                    mode: 'local'
                };
                settingsObj.enabled = true;
                _utils__WEBPACK_IMPORTED_MODULE_0__.storage.set('settings', settingsObj).then(() => {
                    scrapeAdsData();
                    sendResponse({ success: true });
                });
            });
            return true;
        }
        else if (message.event === 'stop') {
            _utils__WEBPACK_IMPORTED_MODULE_0__.storage.get('status').then((status) => {
                const scraperStatus = status || { state: 'Idle', current: 0, total: 0, data: [] };
                if (!scraperStatus.data)
                    scraperStatus.data = [];
                scraperStatus.state = 'Idle';
                _utils__WEBPACK_IMPORTED_MODULE_0__.storage.set('status', scraperStatus);
                updateStatusOverlay(scraperStatus);
                isScraperRunning = false;
                sendResponse({ success: true });
            });
            return true;
        }
        else if (message.event === 'pause') {
            _utils__WEBPACK_IMPORTED_MODULE_0__.storage.get('status').then((status) => {
                const scraperStatus = status || { state: 'Paused', current: 0, total: 0, data: [] };
                if (!scraperStatus.data)
                    scraperStatus.data = [];
                scraperStatus.state = 'Paused';
                _utils__WEBPACK_IMPORTED_MODULE_0__.storage.set('status', scraperStatus);
                updateStatusOverlay(scraperStatus);
                sendResponse({ success: true });
            });
            return true;
        }
        else if (message.event === 'resume') {
            _utils__WEBPACK_IMPORTED_MODULE_0__.storage.get('status').then((status) => {
                const scraperStatus = status || { state: 'Running', current: 0, total: 0, data: [] };
                if (!scraperStatus.data)
                    scraperStatus.data = [];
                scraperStatus.state = 'Running';
                _utils__WEBPACK_IMPORTED_MODULE_0__.storage.set('status', scraperStatus);
                updateStatusOverlay(scraperStatus);
                scrapeAdsData();
                sendResponse({ success: true });
            });
            return true;
        }
        else if (message.event === 'updateSettings') {
            const { delay, maxCount, selectAll, mode } = message.data;
            _utils__WEBPACK_IMPORTED_MODULE_0__.storage.get('settings').then((settings) => {
                const settingsObj = settings || {
                    enabled: true,
                    delay: 2000,
                    maxCount: 100,
                    selectAll: false,
                    mode: 'local'
                };
                settingsObj.delay = delay;
                settingsObj.maxCount = maxCount;
                settingsObj.selectAll = selectAll;
                if (mode !== undefined)
                    settingsObj.mode = mode;
                settingsObj.enabled = true;
                _utils__WEBPACK_IMPORTED_MODULE_0__.storage.set('settings', settingsObj);
                sendResponse({ success: true });
            });
            return true;
        }
        else if (message.event === 'clearData') {
            _utils__WEBPACK_IMPORTED_MODULE_0__.storage.set('dataList', []);
            sendResponse({ success: true });
            return true;
        }
        else if (message.event === 'modeChange') {
            const { mode } = message.data;
            _utils__WEBPACK_IMPORTED_MODULE_0__.storage.get('settings').then((settings) => {
                const settingsObj = settings || {
                    enabled: true,
                    delay: 2000,
                    maxCount: 100,
                    selectAll: false,
                    mode: 'local'
                };
                settingsObj.mode = mode;
                _utils__WEBPACK_IMPORTED_MODULE_0__.storage.set('settings', settingsObj);
                sendResponse({ success: true });
            });
            return true;
        }
        return true;
    });
    const settings = await _utils__WEBPACK_IMPORTED_MODULE_0__.storage.get('settings');
    const status = await _utils__WEBPACK_IMPORTED_MODULE_0__.storage.get('status');
    if (settings) {
        settings.enabled = true;
        await _utils__WEBPACK_IMPORTED_MODULE_0__.storage.set('settings', settings);
    }
    else {
        await _utils__WEBPACK_IMPORTED_MODULE_0__.storage.set('settings', {
            enabled: true,
            delay: 2000,
            maxCount: 100,
            selectAll: false,
            mode: 'local'
        });
    }
    if (status && status.state === 'Running') {
        scrapeAdsData();
    }
    isInitialized = true;
    console.log('✅ Content script initialized successfully');
};
// Run init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
}
else {
    init();
}
// Signal that content script is loaded
console.log('🟢 L2G Ads Content Script Loaded');

})();

/******/ })()
;
//# sourceMappingURL=content.js.map