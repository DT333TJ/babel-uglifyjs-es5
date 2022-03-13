"use strict";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// 当前主系统origin
var targetOrigin = document.location.origin || window.location.protocol + '//' + window.location.hostname + (window.location.port ? ":" + window.location.port : ''); // 主页面宽度

var docClientWidth = document.documentElement.clientWidth; // 主页面高度

var docClientHeight = document.documentElement.clientHeight; // 资源路径

var cssHref = (location.href.indexOf('taikang') !== -1 ? 'http://10.132.23.192' : 'http://10.154.31.90') + '/starlinkdashboard';
var productionUrl = 'http://oa.taikang.com';
var uatUrl = 'http://oa.tkuat.com'; // const uatUrl = 'http://localhost:7552'

/**
 * @description: 设置打开看板系统路径的参数,将参数对象转为url的params
 * @param {*} obj
 * @return {*}
 */

function setObjectToUrlParams(obj) {
  var params = '';

  for (var _i = 0, _Object$entries = Object.entries(obj); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        k = _Object$entries$_i[0],
        v = _Object$entries$_i[1];

    params += "".concat(k, "=").concat(v, "&");
  }

  return params;
}
/**
 * @description: 向iframe元素通过postMessage方式进行通信，此处必须传递相应的targetOrigin和postMessageName的值
 * @param {*} data
 * @return {*}
 */


function setDrawerStyles(flag) {
  // 添加约定好的字段作为辨认身份的标识
  var container = {
    'true': 'left: 0',
    'false': 'left: 100%'
  },
      btn = {
    'true': 'visibility: visible',
    'false': 'visibility: hidden'
  };
  document.querySelector("#starlinkdashboard-iframe-container").setAttribute("style", container[flag]);
  document.querySelector("#dashboard-iframe-close-btn").setAttribute("style", btn[flag]);
}
/**
 * @description: 获取路径字符串参数中的某个值
 * @param {*}
 * @return {*}
 */


function getQueryVariable(location, variable) {
  var url = location.substring(location.indexOf('?') + 1);
  var vars = url.split('&');

  for (var index = 0; index < vars.length; index++) {
    var element = vars[index].split('=');
    if (element[0] === variable) return element[1];
  }
} // 类对象


var StarlinkDashBoard = /*#__PURE__*/function () {
  function StarlinkDashBoard() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, StarlinkDashBoard);

    // 配置对象
    this.options = _objectSpread({
      systemCode: '',
      title: "星链看板",
      // 同源看板跳转本系统事件
      commonOriSelfPageJump: '_blank',
      // _blank, _self
      // 同源看板跳转外系统事件
      commonOriOtherPageJump: '_blank'
    }, options);
    this.storageFlag = false;
    this.initFlag = false;
    this.openStatus = false; // 对外提供的方法

    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.onMessageHandle = this.onMessageHandle.bind(this);
    this.onVisibilityChangeHandle = this.onVisibilityChangeHandle.bind(this); // 自动执行初始化

    this.init();
  }
  /**
   * @description: 初始话看板iframe,生成入口元素iframe相关容器元素
   * @param {*}
   * @return {*}
   */


  _createClass(StarlinkDashBoard, [{
    key: "init",
    value: function init() {
      // 绑定事件
      this.bind(); // 设置样式文件的路径

      var href = cssHref + '/starlinkEntry/starlinkEntry.css'; // 如果不存在必填写的参数，进行提示

      var _this$options = this.options,
          systemCode = _this$options.systemCode,
          title = _this$options.title; // 判断参数

      if (!systemCode) {
        window.alert("星链看板初始化不成功，缺少系统编码参数");
        return;
      } // 生成入口元素


      this.initEntryElement(href, title);
    }
    /**
     * @description: 绑定window, document事件
     * @param {*}
     * @return {*}
     */

  }, {
    key: "bind",
    value: function bind() {
      window.addEventListener('message', this.onMessageHandle, false);
      document.addEventListener('visibilitychange', this.onVisibilityChangeHandle);
    }
    /**
     * @description: 生成入口元素
     * @param {*} href
     * @param {*} title
     * @return {*}
     */

  }, {
    key: "initEntryElement",
    value: function initEntryElement(href, title) {
      var _this = this;

      // 列表元素
      var list = [// 生成样式css
      {
        createEle: 'link',
        targetEle: 'head',
        attribute: {
          rel: "stylesheet",
          type: "text/css",
          href: href
        }
      }, // 生成iframe展示容器元素
      {
        createEle: 'div',
        targetEle: 'body',
        attribute: {
          id: "starlinkdashboard-iframe-container",
          className: "dashboard-iframe-containerClass",
          style: "visibility: hidden"
        }
      }, // 生成iframe展示容器关闭按钮元素
      {
        createEle: 'span',
        targetEle: '#starlinkdashboard-iframe-container',
        attribute: {
          id: "dashboard-iframe-close-btn",
          className: "dashboard-iframe-close-btn",
          title: "\u5173\u95ED".concat(title),
          innerText: '✖',
          style: "visibility: hidden"
        },
        handleName: 'iframeButtonHandle'
      }, // 生成iframe的容器元素，可用来切换清除iframe,重新生成对应路径的iframe
      {
        createEle: 'div',
        targetEle: '#starlinkdashboard-iframe-container',
        attribute: {
          id: "starlinkdashboard-iframe-widget",
          width: "0",
          height: "100%"
        }
      }]; // 根据数据生成对应的元素

      list.map(function (item) {
        _this.insertElement(item);
      });
    }
    /**
     * @description: 创建对应的html元素数据，并绑定相应的事件
     * @param {*} eleItem
     * @return {*}
     */

  }, {
    key: "insertElement",
    value: function insertElement(eleItem) {
      var createEle = eleItem.createEle,
          targetEle = eleItem.targetEle,
          attribute = eleItem.attribute,
          handleName = eleItem.handleName;
      var createElement = document.createElement(createEle); // 添加属性

      attribute && Object.keys(attribute).map(function (item) {
        createElement[item] = attribute[item];
      });
      document.querySelector(targetEle).appendChild(createElement); // 元素添加绑定事件

      handleName && this.handleEvent(createElement, handleName);
    }
    /**
     * @description: 绑定事件统一处理
     * @param {*} createElement
     * @param {*} handleName
     * @return {*}
     */

  }, {
    key: "handleEvent",
    value: function handleEvent(createElement, handleName) {
      handleName === 'iframeButtonHandle' && this.iframeButtonHandle(createElement);
    }
    /**
     * @description: iframe容器关闭按钮添加绑定事件
     * @param {*} createElement
     * @return {*}
     */

  }, {
    key: "iframeButtonHandle",
    value: function iframeButtonHandle(createElement) {
      var _this2 = this;

      createElement.onclick = function (event) {
        event.preventDefault();

        _this2.closeDrawer();
      };
    }
    /**
     * @description: 关闭看板容器,清空当前iframe
     * @param {*}
     * @return {*}
     */

  }, {
    key: "closeDrawer",
    value: function closeDrawer() {
      setDrawerStyles('false');
      document.querySelector("#starlinkdashboard-iframe-widget").innerHTML = '';
      sessionStorage.removeItem('starlinkdashboard-storage-urls');
      this.openStatus = false;
      this.initFlag = false;
    }
    /**
     * @description: 生成iframe元素和变量src的值，同时展开iframe容器，打开看板系统
     * @param {*} urlObj
     * @param {*} params
     * @return {*}
     */

  }, {
    key: "openDrawer",
    value: function openDrawer(urlObj) {
      // 只能在关闭状态才能open
      if (this.openStatus) return; // 解构参数

      var params = urlObj.params; // 设置、拼接url中的参数

      var paramsString = setObjectToUrlParams(params),
          systemCode = this.options.systemCode; // 设置完整的url, 包含最初打开的系统编码

      var src = (location.href.indexOf('taikang') !== -1 ? productionUrl : uatUrl) + "/starlinkdashboard/".concat(systemCode, "/dashboard?").concat(paramsString) + "currentDashboard=".concat(systemCode, "&oriDashboard=").concat(systemCode, "&storageID=").concat(new Date().valueOf(), "&storageIndex=0"); // 设置iframe url

      this.initIframeElementAndUrl(src);

      if (!this.openStatus) {
        // 设置展开状态
        setDrawerStyles('true');
        this.openStatus = true;
      }
    }
    /**
     * @description: 生成iframe 具体的内容
     * @param {*} src
     * @return {*}
     */

  }, {
    key: "initIframeElementAndUrl",
    value: function initIframeElementAndUrl(src) {
      var _this3 = this;

      document.querySelector("#starlinkdashboard-iframe-widget").innerHTML = ''; // 确保路由url中最后一个不是&

      src = src.endsWith('&') ? src.substring(0, src.length - 1) : src; // 本地存储当前要打开的路径

      var item = {
        createEle: 'iframe',
        targetEle: '#starlinkdashboard-iframe-widget',
        attribute: {
          id: "starlinkdashboard-iframe",
          className: "dashboard-iframe-widgetClass",
          width: docClientWidth + 'px',
          height: docClientHeight + 'px',
          frameborder: "0",
          scrolling: 'no',
          style: "border: none",
          seamless: 'seamless',
          src: src
        }
      }; // 生成iframe元素

      this.insertElement(item); // 保证iframe加载完后发送消息

      document.getElementById("starlinkdashboard-iframe").onload = function () {
        if (!_this3.initFlag) {
          _this3.initFlag = true;
        }
      };
    }
    /**
     * @description: 向父系统发送消息
     * @param {*} data
     * @return {*}
     */

  }, {
    key: "postMessageHandle",
    value: function postMessageHandle(data) {
      // 添加约定好的字段作为辨认身份的标识
      data['targetOrigin'] = targetOrigin;
      data['postMessageName'] = 'starlinkdashboard';
      document.getElementById("starlinkdashboard-iframe").contentWindow.postMessage(data, "*");
    }
    /**
     * @description: 监听到postMessage的message事件
     * @param {*} event
     * @return {*}
     */

  }, {
    key: "onMessageHandle",
    value: function onMessageHandle(event) {
      var data = event.data; // 确认身份

      if (event.origin === data.targetOrigin && data.postMessageName === 'starlinkdashboard') {
        // 接收到初始化看板页面相关数据
        if (data.postMessageType === 'init' && data.params) {
          var url = data.params.url; // 存储看板

          this.storageUrl(url);
        } // 接收到回退当前看板浏览记录操作
        // 接收到切换其他系统看板操作


        if ((data.postMessageType === 'fallback' || data.postMessageType === 'jumpDashboard') && data.params) {
          var _url = data.params.url; // 重新设置看板

          this.initIframeElementAndUrl(_url);
        } // 接收到同源看板跳转外系统页面的操作


        if (data.postMessageType === 'jumpOtherSystemPage' && data.params) {
          var _url2 = data.params.url; // 跳转到空白页面则不需要关闭看板

          this.options.commonOriOtherPageJump !== '_blank' && this.closeDrawer();
          window.open(_url2, this.options.commonOriOtherPageJump);
        }
      }
    }
    /**
     * @description: 记录看板的浏览记录
     * @param {*} url
     * @return {*}
     */

  }, {
    key: "storageUrl",
    value: function storageUrl(url) {
      var storageData = JSON.parse(sessionStorage.getItem('starlinkdashboard-storage-urls')) || {};
      var storageID = getQueryVariable(url, 'storageID') || '',
          storageIndex = getQueryVariable(url, 'storageIndex') || '',
          urls = storageData['urls'] || [];

      if (storageID) {
        // 当前存储数据是之前存储的数据,就清除
        if (storageData['storageID'] !== storageID + '') {
          storageData = {};
        }

        storageData['storageID'] = storageID; // 如果是已存在的浏览记录，就替换该存储值

        storageIndex ? urls[storageIndex] = url : urls.push(url); // 存储值

        storageData['urls'] = urls;
        sessionStorage.setItem('starlinkdashboard-storage-urls', JSON.stringify(storageData)); // 向看板传递存储的浏览记录数据

        this.openStatus && this.postMessageHandle({
          storage: true,
          storageData: JSON.stringify(storageData)
        });
      }
    }
    /**
     * @description:  监听当前页面是否处于激活状态,如果此时看板打开，就对数据进行刷新
     * @param {*} event
     * @return {*}
     */

  }, {
    key: "onVisibilityChangeHandle",
    value: function onVisibilityChangeHandle(event) {
      // 用户打开或回到页面
      if (document.visibilityState === 'visible') {
        this.openStatus && this.postMessageHandle({
          refresh: true
        });
      } // 用户离开当前页面，重置看板刷新标识


      if (document.visibilityState === 'hidden') {
        this.openStatus && this.postMessageHandle({
          resetRefresh: true
        });
      }
    }
  }]);

  return StarlinkDashBoard;
}();

window.StarlinkDashBoard = StarlinkDashBoard;
