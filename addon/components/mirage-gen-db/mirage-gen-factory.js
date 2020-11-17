import Component from '@ember/component';
import layout from '../../templates/components/mirage-gen-db/mirage-gen-factory';
import objFns  from '../../utils/obj-fns';

let typesMap = {
  number: 'faker.random.number()',
  string: 'faker.name.firstName()',
  boolean: 'faker.random.boolean()'
}

export default Component.extend({
  layout,
  init() {
    this._super(...arguments);

    let { prop, info } = JSON.parse(JSON.stringify(this.resultObj || {}));
    info = Array.isArray(info) && info.length ? info[0] : info;
    if  (typeof info === 'object') {
      info.srcRoot = true;
    }
    let stringKeys = [];
    info = JSON.stringify(info, (key, value) => {
      if  (typeof value === 'object' && value.isFactory && !value.srcRoot) {
        return '// Type your factory';
      }
      if (objFns.getAddedNodes.includes(key) || key === 'srcRoot'){
        return undefined;
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
