import { helper } from '@ember/component/helper';

export function getRandom() {
  return Math.random();
}

export default helper(getRandom);
