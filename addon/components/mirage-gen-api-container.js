import Component from '@ember/component';
import { computed } from '@ember/object';
import objFns  from '../utils/obj-fns';
import layout from '../templates/components/mirage-gen-api-container';

export default Component.extend({
  layout,
  canShowDB: false,
  isObjFormat: computed('selectedMirageResponse.data', function() {
    let response = this.get('selectedMirageResponse.data');
    return typeof response === 'object';
  }),

  stringifiedResponse: computed('selectedMirageResponse.data', 'isObjFormat', function() {
    let response = this.get('selectedMirageResponse.data');
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
