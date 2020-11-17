import Component from '@ember/component';
import layout from '../templates/components/mirage-gen-db';
import { computed } from '@ember/object';

export default Component.extend({
  layout,
  canShowDB: false,
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
    return this.getdbArray(dbArray, obj, 'root');
  }),

  getdbArray(dbArray, obj, prop = 'root') {
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
        return this.getdbArray(dbArray, info[key], key);
      });
    }
    return dbArray;
  },

  actions: {
    showSpecificDB(toggleId, panelId) {
      document.getElementById(toggleId).classList.toggle('active');
      let panel = document.getElementById(panelId);
      panel.style.maxHeight = panel.style.maxHeight ? null : `${panel.scrollHeight}px`;
    },
    toggleshowDB() {
      this.toggleProperty('canShowDB');
    }
  }
});
