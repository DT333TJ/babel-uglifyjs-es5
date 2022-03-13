// 当前主系统origin
const targetOrigin = document.location.origin || window.location.protocol + '//' + window.location.hostname + (window.location.port ? ":" + window.location.port : '')
// 主页面宽度
const docClientWidth = document.documentElement.clientWidth
// 主页面高度
const docClientHeight = document.documentElement.clientHeight
// 资源路径
const cssHref = (location.href.indexOf('taikang') !== -1 ? 'http://10.132.23.192' : 'http://10.154.31.90') + '/starlinkdashboard'
const productionUrl = 'http://oa.taikang.com'
const uatUrl = 'http://oa.tkuat.com'
// const uatUrl = 'http://localhost:7552'

/**
 * @description: 设置打开看板系统路径的参数,将参数对象转为url的params
 * @param {*} obj
 * @return {*}
 */
function setObjectToUrlParams(obj) {
  let params = ''
  for (let [k, v] of Object.entries(obj)) {
    params += `${k}=${v}&`
  }
  return params
}

/**
 * @description: 向iframe元素通过postMessage方式进行通信，此处必须传递相应的targetOrigin和postMessageName的值
 * @param {*} data
 * @return {*}
 */
function setDrawerStyles(flag) {
  // 添加约定好的字段作为辨认身份的标识
  let container = {
      'true': 'left: 0',
      'false': 'left: 100%'
    },
    btn = {
      'true': 'visibility: visible',
      'false': 'visibility: hidden'
    };
  document.querySelector("#starlinkdashboard-iframe-container").setAttribute("style", container[flag])
  document.querySelector("#dashboard-iframe-close-btn").setAttribute("style", btn[flag])
}

/**
 * @description: 获取路径字符串参数中的某个值
 * @param {*}
 * @return {*}
 */
function getQueryVariable(location, variable) {
  let url = location.substring(location.indexOf('?') + 1)
  var vars = url.split('&')
  for (let index = 0; index < vars.length; index++) {
    const element = vars[index].split('=')
    if (element[0] === variable) return element[1]
  }
}

// 类对象
export default class StarlinkDashBoard {
  constructor(options = {}) {
    // 配置对象
    this.options = {
      systemCode: '',
      title: "星链看板",
      // 同源看板跳转本系统事件
      commonOriSelfPageJump: '_blank', // _blank, _self
      // 同源看板跳转外系统事件
      commonOriOtherPageJump: '_blank',
      ...options
    }
    this.storageFlag = false
    this.initFlag = false
    this.openStatus = false
    // 对外提供的方法
    this.openDrawer = this.openDrawer.bind(this)
    this.closeDrawer = this.closeDrawer.bind(this)
    this.onMessageHandle = this.onMessageHandle.bind(this)
    this.onVisibilityChangeHandle = this.onVisibilityChangeHandle.bind(this)
    // 自动执行初始化
    this.init()
  }

  /**
   * @description: 初始话看板iframe,生成入口元素iframe相关容器元素
   * @param {*}
   * @return {*}
   */
  init() {
    // 绑定事件
    this.bind()
    // 设置样式文件的路径
    let href = cssHref + '/starlinkEntry/starlinkEntry.css';
    // 如果不存在必填写的参数，进行提示
    let {
      systemCode,
      title
    } = this.options
    // 判断参数
    if (!systemCode) {
      window.alert("星链看板初始化不成功，缺少系统编码参数")
      return
    }
    // 生成入口元素
    this.initEntryElement(href, title)
  }

  /**
   * @description: 绑定window, document事件
   * @param {*}
   * @return {*}
   */
  bind() {
    window.addEventListener('message', this.onMessageHandle, false);
    document.addEventListener('visibilitychange', this.onVisibilityChangeHandle)
  }

  /**
   * @description: 生成入口元素
   * @param {*} href
   * @param {*} title
   * @return {*}
   */
  initEntryElement(href, title) {
    // 列表元素
    let list = [
      // 生成样式css
      {
        createEle: 'link',
        targetEle: 'head',
        attribute: {
          rel: "stylesheet",
          type: "text/css",
          href
        }
      },
      // 生成iframe展示容器元素
      {
        createEle: 'div',
        targetEle: 'body',
        attribute: {
          id: "starlinkdashboard-iframe-container",
          className: "dashboard-iframe-containerClass",
          style: "visibility: hidden",
        }
      },
      // 生成iframe展示容器关闭按钮元素
      {
        createEle: 'span',
        targetEle: '#starlinkdashboard-iframe-container',
        attribute: {
          id: "dashboard-iframe-close-btn",
          className: "dashboard-iframe-close-btn",
          title: `关闭${title}`,
          innerText: '✖',
          style: "visibility: hidden"
        },
        handleName: 'iframeButtonHandle'
      },
      // 生成iframe的容器元素，可用来切换清除iframe,重新生成对应路径的iframe
      {
        createEle: 'div',
        targetEle: '#starlinkdashboard-iframe-container',
        attribute: {
          id: "starlinkdashboard-iframe-widget",
          width: "0",
          height: "100%"
        }
      }
    ]

    // 根据数据生成对应的元素
    list.map(item => {
      this.insertElement(item)
    })
  }

  /**
   * @description: 创建对应的html元素数据，并绑定相应的事件
   * @param {*} eleItem
   * @return {*}
   */
  insertElement(eleItem) {
    let {
      createEle,
      targetEle,
      attribute,
      handleName
    } = eleItem
    const createElement = document.createElement(createEle);
    // 添加属性
    attribute && Object.keys(attribute).map(item => {
      createElement[item] = attribute[item]
    })
    document.querySelector(targetEle).appendChild(createElement)
    // 元素添加绑定事件
    handleName && this.handleEvent(createElement, handleName)
  }

  /**
   * @description: 绑定事件统一处理
   * @param {*} createElement
   * @param {*} handleName
   * @return {*}
   */
  handleEvent(createElement, handleName) {
    handleName === 'iframeButtonHandle' && this.iframeButtonHandle(createElement)
  }

  /**
   * @description: iframe容器关闭按钮添加绑定事件
   * @param {*} createElement
   * @return {*}
   */
  iframeButtonHandle(createElement) {
    createElement.onclick = event => {
      event.preventDefault();
      this.closeDrawer()
    }
  }

  /**
   * @description: 关闭看板容器,清空当前iframe
   * @param {*}
   * @return {*}
   */
  closeDrawer() {
    setDrawerStyles('false')
    document.querySelector("#starlinkdashboard-iframe-widget").innerHTML = ''
    sessionStorage.removeItem('starlinkdashboard-storage-urls')
    this.openStatus = false
    this.initFlag = false
  }

  /**
   * @description: 生成iframe元素和变量src的值，同时展开iframe容器，打开看板系统
   * @param {*} urlObj
   * @param {*} params
   * @return {*}
   */
  openDrawer(urlObj) {
    // 只能在关闭状态才能open
    if (this.openStatus) return;
    // 解构参数
    let {
      params
    } = urlObj
    // 设置、拼接url中的参数
    let paramsString = setObjectToUrlParams(params),
      systemCode = this.options.systemCode;
    // 设置完整的url, 包含最初打开的系统编码
    let src = (location.href.indexOf('taikang') !== -1 ? productionUrl : uatUrl) + `/starlinkdashboard/${systemCode}/dashboard?${paramsString}` +
      `currentDashboard=${systemCode}&oriDashboard=${systemCode}&storageID=${(new Date()).valueOf()}&storageIndex=0`;
    // 设置iframe url
    this.initIframeElementAndUrl(src)
    if (!this.openStatus) {
      // 设置展开状态
      setDrawerStyles('true')
      this.openStatus = true
    }
  }

  /**
   * @description: 生成iframe 具体的内容
   * @param {*} src
   * @return {*}
   */
  initIframeElementAndUrl(src) {
    document.querySelector("#starlinkdashboard-iframe-widget").innerHTML = ''
    // 确保路由url中最后一个不是&
    src = src.endsWith('&') ? src.substring(0, src.length - 1) : src;
    // 本地存储当前要打开的路径
    let item = {
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
        src
      }
    }
    // 生成iframe元素
    this.insertElement(item)
    // 保证iframe加载完后发送消息
    document.getElementById("starlinkdashboard-iframe").onload = () => {
      if (!this.initFlag) {
        this.initFlag = true
      }
    }
  }

  /**
   * @description: 向父系统发送消息
   * @param {*} data
   * @return {*}
   */
  postMessageHandle(data) {
    // 添加约定好的字段作为辨认身份的标识
    data['targetOrigin'] = targetOrigin
    data['postMessageName'] = 'starlinkdashboard'
    document.getElementById("starlinkdashboard-iframe").contentWindow.postMessage(data, "*")
  }

  /**
   * @description: 监听到postMessage的message事件
   * @param {*} event
   * @return {*}
   */
  onMessageHandle(event) {
    let data = event.data
    // 确认身份
    if (event.origin === data.targetOrigin && data.postMessageName === 'starlinkdashboard') {
      // 接收到初始化看板页面相关数据
      if (data.postMessageType === 'init' && data.params) {
        let {
          url
        } = data.params
        // 存储看板
        this.storageUrl(url)
      }
      // 接收到回退当前看板浏览记录操作
      // 接收到切换其他系统看板操作
      if ((data.postMessageType === 'fallback' || data.postMessageType === 'jumpDashboard') && data.params) {
        let {
          url
        } = data.params
        // 重新设置看板
        this.initIframeElementAndUrl(url)
      }
      // 接收到同源看板跳转外系统页面的操作
      if (data.postMessageType === 'jumpOtherSystemPage' && data.params) {
        let {
          url
        } = data.params
        // 跳转到空白页面则不需要关闭看板
        this.options.commonOriOtherPageJump !== '_blank' && this.closeDrawer();
        window.open(url, this.options.commonOriOtherPageJump)
      }
    }
  }

  /**
   * @description: 记录看板的浏览记录
   * @param {*} url
   * @return {*}
   */
  storageUrl(url) {
    let storageData = JSON.parse(sessionStorage.getItem('starlinkdashboard-storage-urls')) || {}
    let storageID = getQueryVariable(url, 'storageID') || '',
      storageIndex = getQueryVariable(url, 'storageIndex') || '',
      urls = storageData['urls'] || [];
    if (storageID) {
      // 当前存储数据是之前存储的数据,就清除
      if (storageData['storageID'] !== storageID + '') {
        storageData = {}
      }
      storageData['storageID'] = storageID
      // 如果是已存在的浏览记录，就替换该存储值
      storageIndex ? urls[storageIndex] = url : urls.push(url);
      // 存储值
      storageData['urls'] = urls
      sessionStorage.setItem('starlinkdashboard-storage-urls', JSON.stringify(storageData));
      // 向看板传递存储的浏览记录数据
      this.openStatus && this.postMessageHandle({
        storage: true,
        storageData: JSON.stringify(storageData)
      })
    }
  }

  /**
   * @description:  监听当前页面是否处于激活状态,如果此时看板打开，就对数据进行刷新
   * @param {*} event
   * @return {*}
   */
  onVisibilityChangeHandle(event) {
    // 用户打开或回到页面
    if (document.visibilityState === 'visible') {
      this.openStatus && this.postMessageHandle({
        refresh: true
      })
    }
    // 用户离开当前页面，重置看板刷新标识
    if (document.visibilityState === 'hidden') {
      this.openStatus && this.postMessageHandle({
        resetRefresh: true
      })
    }
  }
}