/* @flow */
import { addEventListener } from './utils';

/**
 * 生成runtime错误日志
 * 
 * @param {Array} allMsg 相关错误信息
 * @return {typesErrorInfo} 
 */
function formatRuntimeJsError(allMsg): typesErrorInfo {
  const [
    message, // 错误信息（字符串）。可用于HTML onerror=""处理程序中的event
    source, // 发生错误的脚本URL（字符串）
    lineno, // 发生错误的行号（数字）
    colno, // 发生错误的列号（数字）
    errObj // Error对象（对象）
  ] = allMsg;
  return {
    t: new Date().getTime(),
    n: 'js',
    msg: errObj && errObj.stack ? errObj.stack.toString() : message,
    data: {
      sourceUrl: source,
      col: colno || (window.event && window.event.errorCharacter) || 0,
      line: lineno,
      stack: errObj.stack
    }
  }
}
/**
 * 解析resource资源错误
 * 
 * @param {event} e 错误事件对象 
 * @return {typesErrorInfo}
 */
function formatResourceError(e): typesErrorInfo {
  return {
    n: 'resource',
    t: new Date().getTime(),
    msg: e.target.localName + ' is load error',
    data: {
      target: e.target.localName,
      type: e.type,
      resourceUrl: e.target.href || e.target.currentSrc,
    }
  }
}
/**
 * 解析promise没有reject的错误
 * 
 * @param {event} e 错误事件对象 
 * @return {typesErrorInfo} 
 */
function formatNoRejectHandlerError(e): typesErrorInfo {
  const message = e && e.reason;
  return {
    n: 'promise',
    t: new Date().getTime(),
    msg: message,
    data: e
  }
}
/**
 * 解析console error报错
 * 
 * @param {string|object} info 错误信息
 */
function formatConsoleError(info): typesErrorInfo {
  return {
    n: 'consoleError',
    t: new Date().getTime(),
    msg: info
  }
}

export default {
  load(cb: Function) {
    // js
    window.onerror = (function (origin) {
      return (...args) => {
        const [
          message, // 错误信息（字符串）。可用于HTML onerror=""处理程序中的event
          source, // 发生错误的脚本URL（字符串
          lineno, // 发生错误的行号（数字）
          colno, // 发生错误的列号（数字）
          errObj // Error对象（对象）
        ] = args;
        const errorInfo: typesErrorInfo = formatRuntimeJsError(args);
        cb && cb(errorInfo)
        origin && origin.apply(window, args);
      }
    })(window.onerror)

    // img,script,css,jsonp
    addEventListener('error', function (e) {
      if (e.target == window) return; // 排除js报错异常
      const errorInfo: typesErrorInfo = formatResourceError(e);
      cb && cb(errorInfo)
    }, true);

    // 当Promise 被 reject 且没有 reject 处理器的时候，会触发 unhandledrejection 事件
    addEventListener('unhandledrejection', function (e) {
      const errorInfo: typesErrorInfo = formatNoRejectHandlerError(e);
      cb && cb(errorInfo);
    })

    // consle.error
    console.error = (function (origin) {
      return function (info) {
        const errorInfo: typesErrorInfo = formatConsoleError(info);
        cb && cb(errorInfo);
        origin.call(console, info)
      }
    })(console.error)
  }
}
