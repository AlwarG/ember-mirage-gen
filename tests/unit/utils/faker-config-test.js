import fakerConfig from 'dummy/utils/faker-config';
import { module, test } from 'qunit';

module('Unit | Utility | faker-config', function() {

  // Replace this with your real tests.
  test('it works', function(assert) {
    let result = fakerConfig();
    assert.ok(result);
  });
});
