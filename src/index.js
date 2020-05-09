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
    this.behaviorInfo = {};
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
      this.log.report(1, reportData).then(() => {
        this.clear();
      })
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
        this.behaviorInfo = data;
        const reportData: typesReportData = {
          behaviorInfo: data
        }
        this.log.report(3, reportData).then(() => {
          this.clear();
        });
      })
    }
  }
  /**
   * 上报完后清除信息
   */
  clear() {
    this.behaviorInfo = {};
    this.perfInfo = {};
    this.errorList = [];
    this.resourceList = [];
  }
}

window.Mpperformance == undefined && (window.Mpperformance = Mpperformance);