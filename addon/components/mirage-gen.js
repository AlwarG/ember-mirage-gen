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
  isJSONString(jsonString) {
    if (typeof jsonString !== "string") {
      return false;
    }

    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  },

  getResponse({ isOnlyForCurrentDomain }) {
    window.xhook.after(({ method }, { finalUrl: url, data }) => {
      let canPushResponse = true;
      if (isOnlyForCurrentDomain) {
        let apiDomain = (url || '').split("/")[2];
        canPushResponse = window.location.hostname === apiDomain;
      }

      if (canPushResponse) {
        this.mirageResponses.pushObject({
          url,
          data: this.isJSONString(data) ? JSON.parse(data) : data,
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
