/* @flow */
import { genId } from './utils';

const REPORT_TYPES = {
  1: 'pvuv',
  3: 'error'
}

const clog = (text) => {
  console.log(`%c ${text}`, 'color:red')
  return text;
}

class Log {
  options: typesLogOptions
  baseLog: typesLog

  constructor(options) {
    this.options = options;
  }
  report(type, data) {
    const { addData, domain, appId } = this.options;
    if (!domain) {
      return clog('请设置上报地址')
    }
    const { mpUserId, isFristIn } = this.genUser();
    const uvId = this.genUvId();

    this.baseLog = {
      type, // 1pref和resource上报 2错误上报 3行为上报
      appId,
      addData,
      uvId,
      mpUserId,
      isFristIn,
      preUrl: document.referrer && document.referrer !== location.href ? document.referrer : '',
      time: new Date().getTime(),
      url: location.href
    }

    const log = { ...this.baseLog, ...data }
    const errorMsg = this.validLog(log)
    if (errorMsg) {
      return clog(errorMsg)
    }
    return window.fetch && fetch(domain, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      type: 'report-data',
      body: JSON.stringify(log)
    }).catch(err => {
      console.warn(err);
    })
  }
  genUser(): string | number {
    let userId = sessionStorage.getItem('mpUserId') || '';
    let result = {
      mpUserId: userId,
      isFristIn: false,
    };
    if (!userId) {
      userId = genId();
      sessionStorage.setItem('mpUserId', userId);
      result.userId = userId;
      result.isFristIn = true;
    }
    return result;
  }
  genUvId(): string | number {
    const date = new Date();
    let uvId = localStorage.getItem('mpUvId') || '';
    const datatime = localStorage.getItem('mpUvTime') || '';
    const today = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' 23:59:59';
    if ((!uvId && !datatime) || (date.getTime() > datatime * 1)) {
      uvId = genId();
      localStorage.setItem('mpUvId', uvId);
      localStorage.setItem('mpUvTime', new Date(today).getTime());
    }
    return uvId;
  }
  validLog(log) {
    const { appId, type } = log;
    if (!appId) {
      return '请设置appId';
    }
    if (!REPORT_TYPES[type]) {
      return 'type类型不合法'
    }
  }
}

export default Log