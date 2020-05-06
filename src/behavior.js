/* @flow */
/**
 * /html/body/div[2]/ul/li[2]
 * @param {dom} element 触发点击事件的dom元素 
 */
function getXpath(element) {
  if (!(element instanceof Element)) {
    return void 0;
  }

  if (element.nodeType !== 1) {
    return void 0;
  }

  let rootElement = document.body;
  if (element === rootElement) {
    return void 0;
  }


  let childIndex = (ele) => {
    let parent = ele.parentNode;
    let children = [].slice.call(parent.childNodes).filter(_ => _.nodeType === 1);
    let i = 0;
    for (let _i = 0, len = children.length; _i < len; _i++) {
      if (children[_i] === ele) {
        i = _i;
        break;
      }
    }
    return i === 0 ? '' : '[' + i + ']';
  };

  let xpath = '';

  while (element !== document) {
    let tag = element.tagName.toLocaleLowerCase();
    let eleIndex = childIndex(element);
    xpath = '/' + tag + eleIndex + xpath;
    element = element.parentNode;
  }

  return xpath;
};

export default {
  load(cb: Function) {
    document.addEventListener('click', (e) => {
      const event = e || window.event;
      const target = event.target || event.srcElement;

      const data: behaviorData = {
        behaviorType: 'click',
        xpath: getXpath(target),
        tagName: target.tagName,
        className: target.className,
        innerHtml: target.innerHTML,
        innerText: target.innerText
      }

      cb && cb(data);
    }, false)
  }
}