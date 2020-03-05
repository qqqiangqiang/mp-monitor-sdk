/* @flow */
import { onload, filterTime } from './utils';

/**
 * 处理entries
 * 
 * @param {array} entries 资源集合
 */
function resolveEntries(entries) {
  return entries.map(item => resolvePerformanceTiming(item));
}
/**
 * 解析每个资源的性能信息
 * 
 * @param {object} entry 
 */
function resolvePerformanceTiming(entry): typesResourceInfo {
  console.log('>>>>>>>>>>>ggggg', entry);
  let o = {
    initiatorType: entry.initiatorType,
    name: entry.name,
    nextHopProtocol: entry.nextHopProtocol,
    duration: parseInt(entry.duration),
    encodedBodySize: parseInt(entry.encodedBodySize),
    decodedBodySize: parseInt(entry.decodedBodySize),

    redirect: filterTime(entry.redirectEnd, entry.redirectStart), // 重定向
    dns: filterTime(entry.domainLookupEnd, entry.domainLookupStart), // DNS解析
    connect: filterTime(entry.connectEnd, entry.connectStart), // TCP建连
    network: filterTime(entry.connectEnd, entry.startTime), // 网络总耗时

    send: filterTime(entry.responseStart, entry.requestStart), // 发送开始到接受第一个返回, 首字节时间
    receive: filterTime(entry.responseEnd, entry.responseStart), // 接收总时间
    request: filterTime(entry.responseEnd, entry.requestStart), // 总时间
  };
  return o;
}

export default {
  /**
   * 采集器函数
   */
  collector(): typesResourceInfo {
    const entries = performance.getEntriesByType('resource');
    return resolveEntries(entries)
  },
  load(cb: Function) {
    const self = this;
    let performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance;
    if (!performance || !performance.getEntries) {
      return {}
    }
    onload(() => {
      const resourceInfo: typesResourceInfo = self.collector();
      cb && cb(resourceInfo);
    })
  }
}
