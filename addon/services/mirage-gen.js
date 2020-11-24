import Service from '@ember/service';
import { getOwner } from '@ember/application';

export default Service.extend({
  init() {
    this._super(...arguments);
    const { 'ember-mirage-gen': config } = getOwner(this).resolveRegistration('config:environment');
    this.set('config',  config || {});
  }
});
