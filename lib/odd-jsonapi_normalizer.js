(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("odd-jsonapi_normalizer", [], factory);
	else if(typeof exports === 'object')
		exports["odd-jsonapi_normalizer"] = factory();
	else
		root["odd-jsonapi_normalizer"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Normalizer = function () {
  /**
   *Creates an instance of Normalizer.
   * @param {Object} response response that returned by Axios
   * @memberof Normalizer
   */
  function Normalizer(response) {
    _classCallCheck(this, Normalizer);

    this.data = Array.isArray(response.data) ? response.data : [response.data];
    this.includedResources = response.included || [];
    this.resources = [].concat(_toConsumableArray(this.data), _toConsumableArray(this.includedResources));
    this.serverSideSortResult = {};
    this.entities = {};
    this.meta = response.meta;
  }

  /**
   * short hand for new Normalizer(response).normalize()
   *
   * @static
   * @param {Object} response response that returned by Axios
   * @returns {Object} { serverSideSortResult, entities, meta }
   * @memberof Normalizer
   */


  _createClass(Normalizer, [{
    key: "normalize",


    /**
     * normalizing JSON:API response
     *
     * @returns {Object} { serverSideSortResult, entities, meta }
     * @memberof Normalizer
     */
    value: function normalize() {
      var _this = this;

      this.resources.forEach(function (resource) {
        _this.__recordServerSideSortResult(resource);
        _this.__writeToEntities(resource);
      });

      return {
        entities: this.entities,
        meta: this.meta,
        serverSideSortResult: this.serverSideSortResult
      };
    }

    /**
     * keep server-side sort by an array of ids
     *
     * @param {Object} resource JSON:API resource object
     * @memberof Normalizer
     */

  }, {
    key: "__recordServerSideSortResult",
    value: function __recordServerSideSortResult(resource) {
      if (!this.serverSideSortResult[resource.type]) this.serverSideSortResult[resource.type] = [];

      this.serverSideSortResult[resource.type].push(resource.id);
    }

    /**
     * record resource into entities object in `entities[type][id]` format.
     * will remove `type` property.
     * relationships will been added as attributes, and each relationship will contain `type` and `id` from JSON:API.
     *
     * @param {Object} resource JSON:API resource object
     * @memberof Normalizer
     */

  }, {
    key: "__writeToEntities",
    value: function __writeToEntities(resource) {
      if (!this.entities[resource.type]) this.entities[resource.type] = {};

      this.entities[resource.type][resource.id] = Object.assign({ id: resource.id }, resource.attributes, this.__relationshipsFrom(resource));
    }

    /**
     * Converting `relationships` in a resource into
     * `{ brand: { type: 'product-brand', id: '1' } }` format.
     * If it is an one-to-many relationship, result will like
     * `{ variants: [{ type: 'product-variants', id: '1' }, { type: 'product-variants', id: '2' }] }`
     *
     * @param {*} resource
     * @returns
     * @memberof Normalizer
     */

  }, {
    key: "__relationshipsFrom",
    value: function __relationshipsFrom(resource) {
      if (!resource.relationships) return null;

      var result = {};

      Object.keys(resource.relationships).forEach(function (relationshipName) {
        result[relationshipName] = resource.relationships[relationshipName].data;
      });

      return result;
    }
  }], [{
    key: "normalize",
    value: function normalize(response) {
      return new this(response).normalize();
    }
  }]);

  return Normalizer;
}();

exports.default = Normalizer;
module.exports = exports["default"];

/***/ })
/******/ ]);
});
//# sourceMappingURL=odd-jsonapi_normalizer.js.map