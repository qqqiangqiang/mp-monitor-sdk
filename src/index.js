/* @flow */
import Log from './log'
import perf from './perf'
import error from './error';
import resource from './resource';

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
      ajaxEnable = true
    } = options

    this.options = {
      errorEnable,
      resourceEnable,
      ajaxEnable
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
    const { errorEnable, resourceEnable, ajaxEnable } = this.options;
    perf.load((data) => {
      this.perfInfo = data;
      console.log('>>>>perf', this.perfInfo)
      console.log('>>>>resource', this.resourceList)
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
        console.log('>>>>error', this.errorList)
        const reportData: typesReportData = {
          errorList: this.errorList
        }
        // this.log.report(2, this.errorList);
      })
    }
    if (resourceEnable) {
      resource.load((data) => { // resource采集数据和perf一起上报
        this.resourceList.push(data);
      })
    }
    if (ajaxEnable) { }
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