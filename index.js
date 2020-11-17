'use strict';
const createFile = require('broccoli-file-creator');
const mergeTrees = require('broccoli-merge-trees');
const dummyFiles = {
  'components/mirage-gen.js': `import Component from '@ember/component';export default Component.extend({});`
};

module.exports = {
  name: require('./package').name,
  addonOptions: {},

  included() {
    this.addonOptions = this.app.project.config(this.app.env)['ember-mirage-gen'] || {};
    this._super.included.apply(this, arguments);
  },

  treeForApp(tree) {
    if (!this.addonOptions.isEnabled) {
      let filesTree = [];
      for (let file in dummyFiles) {
        filesTree.push(createFile(file, dummyFiles[file]));
      }

      return mergeTrees(filesTree);
    }

    return this._super.treeForApp.call(this, tree);
  },

  treeForAddon(tree) {
    if (!this.addonOptions.isEnabled) {
      return;
    }

    return this._super.treeForAddon.call(this, tree);
  },
};
