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
    let fool = {
      student: {
          'personal-data': {
            name: 'myname',
            age: 12
          },
          'educational-data': {
             marks: 98,
             section: 'B'
          }
       } 
      }
    let foolUrl = 'https://sample/studentdata';
    window.xhook.after(({ method }, { finalUrl: url, data }) => {
      this.mirageResponses.pushObject({
        url: foolUrl,
        // data: JSON.parse(data),
        data: fool,
        method: (method || '').toLowerCase()
      });
    });
  },

  actions: {
    showAPIContainer() {
      this.toggleProperty('canShowAPIContainer');
    }
  }
});
