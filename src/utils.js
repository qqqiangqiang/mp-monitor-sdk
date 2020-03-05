/**
 * 过滤无效数据
 * @param {number} a 第一个值 
 * @param {number} b 第二个值
 * @return {number} 两者的差值
 */
function filterTime(a, b) {
  return (a > 0 && b > 0 && (a - b) >= 0) ? (a - b) : undefined;
}
/**
 * 兼容事件监听器 
 * @param {string} name 
 * @param {function} callback 
 * @param {boolean} useCapture 
 */
function addEventListener(name, callback, useCapture) {
  if (window.addEventListener) {
    return window.addEventListener(name, callback, useCapture);
  } else if (window.attachEvent) {
    return window.attachEvent('on' + name, callback);
  }
}
/**
 * load监听器
 * @param {function} fn 回调函数 
 */
function loadReady(fn) {
  // loadEvent是否有值循环检测
  const checkFn = () => {
    const timer = setTimeout(checkFn, 100);
    if (performance.timing.loadEventEnd > 0) {
      clearTimeout(timer);
      typeof fn == 'function' && fn();
    }
  };
  if (document.readyState == 'complete') {
    checkFn();
    return void 0;
  }
  addEventListener('load', function () {
    checkFn();
  })
}
/**
 * onload函数，主要是兼容js载入时，onloaded事件已完成的情况
 */
function onload(cb) {
  if (document.readyState === 'complete') {
    cb();
    return void 0;
  }
  addEventListener('load', cb);
}
/**
 * 生成唯一随机数
 */
function genId(length) {
  // 生成唯一随机数
  return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
}

module.exports = {
  filterTime,
  addEventListener,
  loadReady,
  genId,
  onload
}
