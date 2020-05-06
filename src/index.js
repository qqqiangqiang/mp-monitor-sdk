/* @flow */
import Log from './log'
import perf from './perf'
import error from './error';
import resource from './resource';
import behavior from './behavior';

export default class Mpperformance {
  options: Object
  perfInfo: typesPerfData
  errorList: Array<typesErrorInfo>
  resourceList: Array<typesResourceInfo>

  constructor(options: Object = {}) {
    const {
      appId = '',
      domain = '',
      addData = {},
      errorEnable = true,
      resourceEnable = true,
      ajaxEnable = true,
      behaviorEnable = true
    } = options

    this.options = {
      errorEnable,
      resourceEnable,
      ajaxEnable,
      behaviorEnable
    }

    this.log = new Log({
      appId,
      domain,
      addData
    });

    this.perfInfo = {};
    this.errorList = [];
    this.resourceList = [];
    this.init();
  }
  init() {
    const { errorEnable, resourceEnable, ajaxEnable, behaviorEnable } = this.options;
    perf.load((data) => {
      this.perfInfo = data;
      const reportData: typesReportData = {
        perfInfo: this.perfInfo,
        resourceList: this.resourceList,
        errorList: this.errorList
      }
      this.log.report(1, reportData);
    });
    if (errorEnable) {
      error.load((data) => {
        this.errorList.push(data);
        // const reportData: typesReportData = {
        //   errorList: this.errorList
        // }
        // this.log.report(2, this.errorList);
      })
    }
    if (resourceEnable) {
      resource.load((data) => { // resource采集数据和perf一起上报
        this.resourceList.push(data);
      })
    }
    if (ajaxEnable) { }
    if (behaviorEnable) {
      behavior.load((data) => {
        // this.log.report(3, data);
        console.log('>>>>>>>', data);
      })
    }
  }
  /**
   * 上报完后清除信息
   */
  clear() {
    this.perfInfo = {};
    this.errorList = [];
    this.resourceList = [];
  }
}

window.Mpperformance == undefined && (window.Mpperformance = Mpperformance);