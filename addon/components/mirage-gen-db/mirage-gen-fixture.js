import Component from '@ember/component';
import { inject as service } from '@ember/service';
import layout from '../../templates/components/mirage-gen-db/mirage-gen-fixture';
import objFns  from '../../utils/obj-fns';


export default Component.extend({
  layout,
  mirageGenService: service('mirage-gen'),
  init() {
    this._super(...arguments);
    
    let { prop, info } = JSON.parse(JSON.stringify(this.resultObj || {}));
    let { excludedNodes } = this.get('mirageGenService.config') || {};
    excludedNodes = excludedNodes || [];
    excludedNodes = [...objFns.getAddedNodes, ...excludedNodes];
    excludedNodes.push('srcRoot');
    info = JSON.stringify(info, (key, value) => {
      return excludedNodes.includes(key) ? undefined : value;
    }, 2);
    info = info.replace(/"/g, '\'');
    this.set('resultObj', { prop, info });
  }
});
