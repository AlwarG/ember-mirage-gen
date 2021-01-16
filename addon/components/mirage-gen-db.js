import Component from '@ember/component';
import layout from '../templates/components/mirage-gen-db';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  layout,
  mirageGenService: service('mirage-gen'),
  factories: computed('outputArr', 'outputArr.[]', 'outputArr.@each.{isRemoved,isFactory}', function() {
    return (this.outputArr || []).filter(({ isFactory, isRemoved } = {}) => isFactory && !isRemoved);
  }),
  fixtures: computed('outputArr', 'outputArr.[]', 'outputArr.@each.{isRemoved,isFixture}', function() {
    return (this.outputArr || []).filter(({ isFixture, isRemoved } = {}) => isFixture && !isRemoved);
  }),
  outputArr: computed('response.data', function() {
    let { data: obj } = this.response || {};
    obj = obj || {};
    let dbArray = [];
    return this.getdbArray(dbArray, obj, 'root', null);
  }),

  init() {
    this._super(...arguments);
    const { excludedNodes } =  this.get('mirageGenService.config') || {};
    this.setProperties({
      excludedNodes: excludedNodes || [],
      factoriesList: [],
      fixturesList: []
    });
    this.getFileList();
  },

  getFileList() {
    ['factories', 'fixtures'].forEach((dirName) => {
      fetch(`${window.emberMirageGen.serverUrl}/${dirName}`).then((response) => {
        return response.json().then(({ data }) => {
          this.set(`${dirName}List`, data);
        });
      })
    })
  },

  getdbArray(dbArray, obj, prop = 'root', parentProp = null) {
    if  (parentProp === 'root' && (this.excludedNodes || []).includes(prop)) {
      return dbArray;
    }
    if  (typeof obj === 'object') {
      let { isFactory, isFixture, isArray } = obj;
      let info = (!isFixture && isArray && typeof obj[0] === 'object') ? obj[0]: obj;
      if  (isFactory || isFixture) {
        dbArray.push({
          prop,
          info,
          isFactory,
          isFixture,
          isArray,
          arrLength: Object.keys(obj).length - 4
        });
      }
      if (isFixture) {
        return dbArray;
      }
      let objKeys = Object.keys(info).filter((key) => typeof info[key] === 'object');
      objKeys.forEach((key) => {
        return this.getdbArray(dbArray, info[key], key, prop);
      });
    }
    return dbArray;
  },

  actions: {
    showSpecificDB(toggleId, panelId) {
      document.getElementById(toggleId).classList.toggle('active');
      let panel = document.getElementById(panelId);
      panel.style.maxHeight = panel.style.maxHeight ? null : `${panel.scrollHeight + 20}px`;
    }
  }
});
