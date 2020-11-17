import Component from '@ember/component';
import { computed } from '@ember/object';
import objFns  from '../utils/obj-fns';
import layout from '../templates/components/mirage-gen-api-container';

export default Component.extend({
  layout,
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
        canshowMiragePreview: true
      });
    },

    resetObj(obj) {
      this.set('selectedMirageResponse.data', {...obj});
    }
  }
});
