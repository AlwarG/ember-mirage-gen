import Component from '@ember/component';
import { computed } from '@ember/object';
import objFns  from '../utils/obj-fns';
import layout from '../templates/components/mirage-gen-api';

export default Component.extend({
  layout,
  output: computed('response.data', function() {
    let { data: obj } = this.response || {};
    obj = obj || {};
    if  (typeof obj === 'object' && (obj.isFactory || obj.isFixture)) {
      return `// Type your ${obj.isFactory ? 'Factory': 'Fixture'}`;
    }
    let info = JSON.stringify(this.getConfigObj(obj), (key, value) => {
      return objFns.getAddedNodes.includes(key) ? undefined : value;
    }, 2);
    info = info.replace(/"/g, '\'');
    return info;
  }),

  getConfigObj(obj) {
    let objKeys = Object.keys(obj);
    if (obj.isArray ) {
      if (typeof obj[0] === 'object') {
        let innnerObjNodes = Object.keys(obj[0] || {}).filter((key) => typeof obj[0][key] === 'object');
        let innerObj = {};
        innnerObjNodes.forEach((key) => {
          let { isArray, isFactory, isFixture, isRemoved } = obj[0][key];
          innerObj[key] = { isArray, isFactory, isFixture, isRemoved };
        });
        for (let i = 1; i < objKeys.length - 5; i++) {
          let allInnnerObjNodes = Object.keys(obj[i] || {}).filter((key) => typeof obj[i][key] === 'object');
          allInnnerObjNodes.forEach((key) => {
            Object.assign(obj[i][key], innerObj[key]);
          });
        }
      }
      let resultArr = [];
      for (let i = 0; i < objKeys.length - 5; i++) {
        let key = objKeys[i];
        let value = typeof obj[key] === 'object' ? this.getConfigObj({...obj[key]}) : obj[key];
        resultArr.push(value);
      }
      return resultArr;
    } else {
      let resultObj = {};
      objKeys.forEach((key) => {
        if (typeof obj[key] === 'object') {
          if (obj[key].isFactory) {
            resultObj[key] = '// Type your factory';
          } else if (obj[key].isFixture) {
            resultObj[key] = '// Type your fixture';
          } else {
            resultObj[key] = this.getConfigObj({...obj[key]});
          }
        } else {
          resultObj[key] = obj[key];
        }
      });
      return resultObj;
    }
  },

  init() {
    this._super(...arguments);
    let { response: { url } = {} } = this;
    this.set('url', this.getUrl(url));
  },

  getUrl(url) {
    url = (url || '').split('?')[0];
    let possibleUrlPluralStrings = ['es', 's'];
    let urlArr = url.split('/') || [];

    urlArr = urlArr.map((urlString, index) => {
      if (/^\d+$/.test(urlString)) {
        if (!index) {
          return ':id';
        }
        let id = 'id';
        let prevString = urlArr[index - 1];
  
        for (let i = 0; i < possibleUrlPluralStrings.length; i++) {
          let endsWithString = possibleUrlPluralStrings[i];

          if (prevString.endsWith(endsWithString)) {
            id = `${prevString.split(endsWithString)[0]}_id`;
            break;
          }
        }
        return `:${id}`;
      }
      return urlString;
    });
    return urlArr.join('/');
  }
});
