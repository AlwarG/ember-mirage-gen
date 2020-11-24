import Component from '@ember/component';
import { inject as service } from '@ember/service';
import layout from '../../templates/components/mirage-gen-db/mirage-gen-factory';
import objFns  from '../../utils/obj-fns';

let typesMap = {
  number: 'faker.random.number()',
  string: 'faker.name.firstName()',
  boolean: 'faker.random.boolean()'
}

export default Component.extend({
  layout,
  mirageGenService: service('mirage-gen'),
  init() {
    this._super(...arguments);
    let { excludedNodes } = this.get('mirageGenService.config') || {};
    excludedNodes = excludedNodes || [];
    excludedNodes = [...objFns.getAddedNodes, ...excludedNodes];
    let { prop, info } = JSON.parse(JSON.stringify(this.resultObj || {}));
    info = Array.isArray(info) && info.length ? info[0] : info;

    if  (typeof info === 'object') {
      info.srcRoot = true;
    }
    excludedNodes.push('srcRoot');
    let stringKeys = [];
    info = JSON.stringify(info, (key, value) => {
      if (excludedNodes.includes(key)){
        return undefined;
      }
      if  (typeof value === 'object' && value.isFactory && !value.srcRoot) {
        return '// Type your factory';
      }
      if (typeof key === 'string' && key.includes('-') && !stringKeys.includes(key)) {
        stringKeys.push(key);
      }
      let type = typesMap[typeof value];
      if (type) {
        return (type === 'string' && typeof Number(value) === 'number') ? '`${' + typesMap.number + '}`' : type;
      }
      return value;
    }, 2);
    info = info.replace(/"/g, '');
    stringKeys.forEach((key) => info = info.replace(new RegExp(key, 'g'), `'${key}'`));
    this.set('resultObj', { prop, info });
  },
});
