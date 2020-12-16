import Component from '@ember/component';
import { computed, setProperties } from '@ember/object';
import objFns  from '../utils/obj-fns';
import { reads } from '@ember/object/computed';
import layout from '../templates/components/mirage-gen-api-container';

export default Component.extend({
  layout,
  canShowDB: false,
  resultObj: reads('selectedMirageResponse.data'),
  isObjFormat: computed('resultObj', function() {
    let { resultObj: response } = this;
    return typeof response === 'object';
  }),

  hasObjProp: computed('resultObj', 'isObjFormat', function() {
    if (this.isObjFormat) {
      let { resultObj: response } = this;
      return Object.keys(response).some((key) => typeof response[key] === 'object');
    }
    return false;
  }),

  stringifiedResponse: computed('resultObj', 'isObjFormat', function() {
    let { resultObj: response } = this;

    if (this.isObjFormat) {
      let unwantedNodes = [...objFns.getAddedNodes];
      unwantedNodes.push('srcRoot');
      return JSON.stringify(response, (key, value) => {
        return unwantedNodes.includes(key) ? undefined : value;
      }, 2);
    }
    return response;
  }),

  filteredResponses: computed('searchValue', 'mirageResponses.[]', function() {
    let { mirageResponses, searchValue } = this;
    mirageResponses = mirageResponses || [];
    if (searchValue) {
      return mirageResponses.filter(({ url }) => url.includes(searchValue));
    }
    return mirageResponses;
  }),

  actions: {
    hideMiragePreview() {
      this.set('canshowMiragePreview', false);
    },

    selectDBType(outputObj, key) {
      setProperties(outputObj, {
        isFactory: key === 'isFactory',
        isFixture: key === 'isFixture',
        isRemoved: key === 'isRemoved'
      });
    },

    showMiragePreview(selectedMirageResponse) {
      objFns.addCond((selectedMirageResponse || {}).data)
      this.setProperties({
        selectedMirageResponse,
        canShowDB: false,
        canshowMiragePreview: true
      });
    },

    resetObj(obj) {
      this.set('selectedMirageResponse.data', {...obj});
    },

    toggleshowDB() {
      this.toggleProperty('canShowDB');
    }
  }
});
