import Component from '@ember/component';
import layout from '../../templates/components/mirage-gen-db/mirage-gen-fixture';
import objFns  from '../../utils/obj-fns';


export default Component.extend({
  layout,
  init() {
    this._super(...arguments);
    
    let { prop, info } = JSON.parse(JSON.stringify(this.resultObj || {}));
    info = JSON.stringify(info, (key, value) => {
      return objFns.getAddedNodes.includes(key) || key === 'srcRoot' ? undefined : value;
    }, 2);
    info = info.replace(/"/g, '\'');
    this.set('resultObj', { prop, info });
  }
});
