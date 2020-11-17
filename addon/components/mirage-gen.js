import Component from '@ember/component';
import layout from '../templates/components/mirage-gen';
import { A } from '@ember/array';

export default Component.extend({
  layout,
  canShowAPIContainer: false,

  init() {
    this._super(...arguments);
    this.set('mirageResponses', A());
  },

  didInsertElement() {
    this._super(...arguments);
    window.onload = () => this.getResponse();
  },

  getResponse() {
    window.xhook.after(({ method }, { finalUrl: url, data }) => {
      this.mirageResponses.pushObject({
        url,
        data: JSON.parse(data),
        method: (method || '').toLowerCase()
      });
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
