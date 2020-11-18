import Component from '@ember/component';
import objFns  from '../utils/obj-fns';
import layout from '../templates/components/mirage-gen-obj-tree';

let typesMap = {
  isRemoved: { name: 'N' },
  isFixture: { name: 'F', class: 'fixture-tick-name' },
  isFactory: { name: 'F', class: 'factory-tick-name' }
}

export default Component.extend({
  layout,
  output: {},
  getProperty(prop) {
    return Array.isArray(prop) ? (prop[0] || {}) : prop;
  },

  didRender() {
    this._super(...arguments);
    let graphEle = this.element.querySelector('#my-graph');
    graphEle.innerHTML = '';
    let listEle = document.createElement('li');
    let listEleInnerHTML = '<span>Data<div class="mirage-gen-tick-section">';
    Object.keys(typesMap).forEach((key) => {
      let property = `obj.${key}`;
      listEleInnerHTML= `${listEleInnerHTML} <section class="tick-mark-section" obj-location="${property}">${this.getTickSvg(this.get(property) ? 'svg-selected' : 'tick-icon', property)}<br><span class="${typesMap[key].class}">${typesMap[key].name}</span></section>`;
    });
    listEle.innerHTML = `${listEleInnerHTML}</div></span>`;
    graphEle.appendChild(listEle);
    this.constructGraph(this.obj || {}, graphEle, 'obj');
    ([...document.getElementsByClassName('tick-mark-section')] || []).forEach((ele) => {
      ele.addEventListener('click', (event) => this.toggleObjProp(event));
    });
  },

  constructGraph(obj, rootEle, parentProp) {
    let objKeys = Object.keys(this.getProperty(obj)) || [];
    let outputObj = obj.isArray ? obj[0] : obj;
    let objNodes = objKeys.filter((prop) => typeof outputObj[prop] === 'object');
    if (objNodes.length) {
      let ulEle = document.createElement('ul');
      rootEle.appendChild(ulEle);
      let isSingleNode = objNodes.length === 1;
      objNodes.forEach((prop) => {
        let listEle = document.createElement('li');
        if (isSingleNode) {
          listEle.classList.add('different');
        }
        let objLocation = obj.isArray ? `${parentProp}.0.${prop}` : `${parentProp}.${prop}`;
        let innerSpanElement = document.createElement('span');
        innerSpanElement.appendChild(document.createTextNode(prop));
        innerSpanElement.appendChild(this.getTickMark(objLocation));
        listEle.appendChild(innerSpanElement);
        this.constructGraph(outputObj[prop], listEle, objLocation);
        ulEle.appendChild(listEle);
      });
    }
  },

  getTickMark(prop) {
    let divElement = document.createElement('div');
    divElement.classList.add('mirage-gen-tick-section');
    Object.keys(typesMap).forEach((key) => {
      let sectionEle = document.createElement('section');
      sectionEle.classList.add('tick-mark-section');
      let property = `${prop}.${key}`;
      sectionEle.setAttribute('obj-location', property);
      sectionEle.innerHTML=`${this.getTickSvg(this.get(property) ? 'svg-selected' : 'tick-icon', property)}<br><span class="${typesMap[key].class}">${typesMap[key].name}</span>`;
      divElement.appendChild(sectionEle);
    });
    return divElement;
  },

  getTickSvg(classNames, property) {
    classNames = classNames || 'tick-icon';
    return `<svg obj-location="${property}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="12px" height="12px" viewBox="0 0 342.508 342.508" xml:space="preserve" class="tick-mark ${classNames}"><g><path d="M171.254,0C76.837,0,0.003,76.819,0.003,171.248c0,94.428,76.829,171.26,171.251,171.26   c94.438,0,171.251-76.826,171.251-171.26C342.505,76.819,265.697,0,171.254,0z M245.371,136.161l-89.69,89.69   c-2.693,2.69-6.242,4.048-9.758,4.048c-3.543,0-7.059-1.357-9.761-4.048l-39.007-39.007c-5.393-5.398-5.393-14.129,0-19.521   c5.392-5.392,14.123-5.392,19.516,0l29.252,29.262l79.944-79.948c5.381-5.386,14.111-5.386,19.504,0   C250.764,122.038,250.764,130.769,245.371,136.161z" /></g></svg>`;
  },

  toggleObjProp(event = {}) {
    let objLocation = (event.currentTarget || event.target).getAttribute('obj-location');
    let propArr = objLocation.split('.');
    let lastProp = propArr[propArr.length - 1];
    propArr.pop();
    let isMainObj = propArr.length === 1;
    let mainObj = propArr.join('.');
    
    let canStopObjToggle = false;

    if (propArr.length > 1) {
      propArr.pop();

      if (propArr[propArr.length - 1] === '0') {
        propArr.pop();
      }
      let parentObj = propArr.join('.');
      let dbNodes = ['isFixture', 'isFactory'];
      for (let i =0; i< dbNodes.length; i++) {
        canStopObjToggle = this.get(`${parentObj}.${dbNodes[i]}`);
        if (canStopObjToggle) {
          break;
        }
      }
    }

    if (!canStopObjToggle) {
      Object.keys(typesMap).forEach((key) => {
        this.set(`${mainObj}.${key}`, key === lastProp);
      });
      objFns.setChildNodes(this.get(mainObj), isMainObj);
      this.resetObj(this.obj);
    }
  }
});
