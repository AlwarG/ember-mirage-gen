import Component from '@ember/component';
import { inject as service } from '@ember/service';
import layout from '../../templates/components/mirage-gen-db/mirage-gen-fixture';
import objFns  from '../../utils/obj-fns';
import { computed } from '@ember/object';


export default Component.extend({
  layout,
  mirageGenService: service('mirage-gen'),
  isComparionEnabled: false,

  resultObjCopy: computed('resultObj', function() {
    return JSON.parse(JSON.stringify(this.resultObj || {}));
  }),

  comparedObject: computed('isComparionEnabled', 'selectedFixtureObjKeys.[]', 'selectedFixtureObjKeys', 'resultObj', function() {
    let resultObj = this.resultObj || {};
    if (this.isComparionEnabled) {
      let info = JSON.parse(this.resultObjCopy.stringifiedInfo);
      for (let key in info) {
        if((this.selectedFixtureObjKeys || []).includes(key)) {
          delete info[key];
        }
      }
      return this.getResultObj({ prop: this.resultObjCopy.prop, info });
    }
    return resultObj;
  }),

  getResultObj(resultObj) {
    let { prop, info } = JSON.parse(JSON.stringify(resultObj || {}));
    let { excludedNodes } = this.get('mirageGenService.config') || {};
    excludedNodes = excludedNodes || [];
    excludedNodes = [...objFns.getAddedNodes, ...excludedNodes];
    excludedNodes.push('srcRoot');
    info = JSON.stringify(info, (key, value) => {
      return excludedNodes.includes(key) ? undefined : value;
    }, 2);
    let stringifiedInfo = info;
    info = info.replace(/"/g, '\'');
    return { prop, stringifiedInfo, info };
  },

  init() {
    this._super(...arguments);
    this.set('resultObj', this.getResultObj(this.resultObj));
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this.set('resultObj', this.getResultObj(this.resultObj));
  },

  actions: {
    setSelectedfixture({ currentTarget } = {}) {
      let { value: selectedFixture } = currentTarget;
      this.set('selectedFixture', selectedFixture);
      if ((this.fixturesList || []).includes(selectedFixture)) {
        this.set('isLoading', true);
        fetch(`${window.emberMirageGen.serverUrl}/fixtures/${selectedFixture}`).then((response) => {
          response.json().then(({ data } = {}) => {
            let selectedFixtureObj = objFns.getDBString(data);
            if  (!selectedFixtureObj) {
              let selectedDBObjString = (data|| '').split('export default')[1] || '';
              let reductionLength = selectedDBObjString[selectedDBObjString.length - 2] === ';' ? 2 : 1;
              selectedFixtureObj = selectedDBObjString.substring(0, selectedDBObjString.length - reductionLength);
            }
            selectedFixtureObj = (selectedFixtureObj || '').replace(/ /g, '');
            selectedFixtureObj = selectedFixtureObj.replace(/(\r\n|\n|\r)/g, '');
            this.setProperties({
              selectedFixtureObj,
              selectedFixtureObjKeys: objFns.getKeys(selectedFixtureObj),
              isLoading: false
            });
          });
        });
      }
    }
  }
});
