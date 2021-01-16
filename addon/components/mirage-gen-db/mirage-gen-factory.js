import Component from '@ember/component';
import { inject as service } from '@ember/service';
import layout from '../../templates/components/mirage-gen-db/mirage-gen-factory';
import objFns  from '../../utils/obj-fns';
import { computed } from '@ember/object';

let typesMap = {
  number: 'faker.random.number()',
  string: 'faker.name.firstName()',
  boolean: 'faker.random.boolean()'
}

export default Component.extend({
  layout,
  mirageGenService: service('mirage-gen'),
  isComparionEnabled: false,
  resultObjCopy: computed('resultObj', function() {
    return JSON.parse(JSON.stringify(this.resultObj || {}));
  }),

  init() {
    this._super(...arguments);
    this.set('resultObj', this.getResultObj(this.resultObj));
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this.set('resultObj', this.getResultObj(this.resultObj));
  },

  getResultObj(resultObj) {
    let { excludedNodes } = this.get('mirageGenService.config') || {};
    excludedNodes = excludedNodes || [];
    excludedNodes = [...objFns.getAddedNodes, ...excludedNodes];
    let { prop, info } = JSON.parse(JSON.stringify(resultObj || {}));
    info = Array.isArray(info) && info.length ? info[0] : info;

    if  (typeof info === 'object') {
      info.srcRoot = true;
    }
    excludedNodes.push('srcRoot');
    let stringKeys = [];
    info = JSON.stringify(info, (key, value) => {
      if (excludedNodes.includes(key)){
        return undefined;
      }
      if  (typeof value === 'object' && value.isFactory && !value.srcRoot) {
        return '// Type your factory';
      }
      if (typeof key === 'string' && key.includes('-') && !stringKeys.includes(key)) {
        stringKeys.push(key);
      }
      let type = typesMap[typeof value];
      if (type) {
        return (type === 'string' && typeof Number(value) === 'number') ? '`${' + typesMap.number + '}`' : type;
      }
      return value;
    }, 2);
    let stringifiedInfo = info;
    info = info.replace(/"/g, '');
    stringKeys.forEach((key) => info = info.replace(new RegExp(key, 'g'), `'${key}'`));
    return { prop, info, stringifiedInfo };
  },

  comparedObject: computed('isComparionEnabled', 'selectedFactoryObjKeys.[]', 'selectedFactoryObjKeys', 'resultObj', function() {
    let resultObj = this.resultObj || {};
    if (this.isComparionEnabled) {
      let info = JSON.parse(this.resultObjCopy.stringifiedInfo);
      for (let key in info) {
        if((this.selectedFactoryObjKeys || []).includes(key)) {
          delete info[key];
        }
      }
      return this.getResultObj({ prop: this.resultObjCopy.prop, info });
    }
    return resultObj;
  }),

  actions: {
    setSelectedFactory({ currentTarget } = {}) {
      let { value: selectedFactory } = currentTarget;
      this.set('selectedFactory', selectedFactory);
      if ((this.factoriesList || []).includes(selectedFactory)) {
        this.set('isLoading', true);
        fetch(`${window.emberMirageGen.serverUrl}/factories/${selectedFactory}`).then((response) => {
          response.json().then(({ data } = {}) => {
            let selectedFactoryObj = objFns.getDBString(data);
            if (!selectedFactoryObj) {
              let selectedDBObjString = (data|| '').split('export default Factory.extend(')[1] || '';
              let reductionLength = selectedDBObjString[selectedDBObjString.length - 2] === ';' ? 3 : 2;
              selectedFactoryObj = selectedDBObjString.substring(0, selectedDBObjString.length - reductionLength);
            }
            selectedFactoryObj = (selectedFactoryObj || '').replace(/ /g, '');
            selectedFactoryObj = selectedFactoryObj.replace(/(\r\n|\n|\r)/g, '');
            this.setProperties({
              selectedFactoryObj,
              selectedFactoryObjKeys: objFns.getKeys(selectedFactoryObj),
              isLoading: false
            });
          });
        });
      }
    }
  }
});
