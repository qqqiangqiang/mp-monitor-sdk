declare type typesReportData = {
  behaviorInfo?: Object;
  perfInfo?: Object;
  errorList?: Array<typesErrorInfo>;
  resourceList?: Array<typesResourceInfo>;
}

declare type typesResourceInfo = {
  initiatorType: string; // 资源类型，script/link/img
  name: string, // 资源地址
  duration: number | string; // 持续时间，responseEnd - fetchStart
  redirect: number | string; // 重定向
  dns: number | string; // DNS解析
  connect: number | string; // TCP建连
  network: number | string; // 网络总耗时 

  send: number | string; // 发送开始到接受第一个返回, 首字节时间
  receive: number | string; // 接收总时间
  request: number | string; // 总时间
}

declare type typesErrorInfo = {
  t: number | string; // 错误发生时间
  n: string; // 错误类型
  msg: string; // 错误信息
  data?: jsErrorDetailInfo | resourceErrorDetailInfo | PromiseRejectionEvent // 不同类型错误的详细错误信息
}

declare type jsErrorDetailInfo = {
  sourceUrl: string; // 错误发生的脚本地址
  col: string | number; // 错误发生的行数
  line: string | number; // 错误发生的列数
  stack: string; // 错误发生的调用栈
}

declare type resourceErrorDetailInfo = {
  target: string; // 哪种资源报错 img/script/link
  type: string; // 报错类型 error
  resourceUrl: string; // 报错资源地址 
}

declare type typesPerfData = {
  // 网络建连
  redirect: string | number; // 页面重定向时间
  dns: string | number; // DNS查找时间
  connect: string | number; // TCP建连时间
  network: string | number; // 网络总耗时

  // 网络接收
  send: string | number; // 前端从发送到接收到后端第一个返回
  receive: string | number; // 接受页面时间
  request: string | number, // 请求页面总时间

  // 前端渲染
  dom: string | number; // dom解析时间
  loadEvent: string | number; // loadEvent时间
  frontend: string | number; // 前端总时间

  // 关键阶段
  load: string | number; // 页面完全加载总时间
  domReady: string | number; // domready时间
  interactive: string | number; // 可操作时间
  ttfb: string | number;  // 首字节时间
}

declare type behaviorData = {
  behaviorType: string,
  xpath: string,
  tagName: string; // dom tagName
  className: string; // dom className
  innerHtml: string; // dom innerHtml
  innerText: string; // dom innerText
}

declare type typesLogOptions = {
  appId: string | number;
  domain: string;
  addData: object;
}

declare type typesLog = {
  time: time; // 上报时间
  addData: Object; // 追加的数据
  userId: string | number; // 用户标识
  uvId: string | number; // 统计uv标识
  type: string | number; // 上报的类型
  url: string; // 当前页面的url
  ua: String; // window.navigator.userAgent
}
