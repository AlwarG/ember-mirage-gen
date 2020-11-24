import Component from '@ember/component';
import { inject as service } from '@ember/service';
import layout from '../templates/components/mirage-gen';
import { A } from '@ember/array';

export default Component.extend({
  layout,
  mirageGenService: service('mirage-gen'),
  canShowAPIContainer: false,

  init() {
    this._super(...arguments);
    this.set('mirageResponses', A());
  },

  didInsertElement() {
    this._super(...arguments);
    let config =  this.get('mirageGenService.config') || {};
    window.onload = () => this.getResponse(config);
  },

  getResponse({ isOnlyForCurrentDomain }) {
    window.xhook.after(({ method }, { finalUrl: url, data }) => {
      let canPushResponse = true;
      if (isOnlyForCurrentDomain) {
        let apiDomain = url.split("/")[2];
        canPushResponse = window.location.hostname === apiDomain;
      }

      if (canPushResponse) {
        this.mirageResponses.pushObject({
          url,
          data: JSON.parse(data),
          method: (method || '').toLowerCase()
        });
      }
    });
  },

  actions: {
    showAPIContainer() {
      this.toggleProperty('canShowAPIContainer');
    },
    clearAPIS() {
      this.set('mirageResponses', A());
    }
  }
});
