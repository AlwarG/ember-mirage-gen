'use strict';
const fs = require('fs');
const path = require('path');
const createFile = require('broccoli-file-creator');
const mergeTrees = require('broccoli-merge-trees');
const dummyFiles = {
  'components/mirage-gen.js': `import Component from '@ember/component';export default Component.extend({});`
};

let serverUrl;
let addonOptions = {};

function getFiles(app, dirName, apiName) {
  app.get(apiName, (req, res, next) => {
    let { miragePath: filePath } = addonOptions;

    try {
      if (fs.existsSync(filePath)) {
        try {
          res.send({
            data: fs.readdirSync(`${filePath}/${dirName}`),
            message: 'success'
          });
        } catch(exception) {
          next(exception);
        }
      } else {
        next(new Error('Files not found'));
      }
    } catch(exception) {
      next(exception);
    }
  });
}

function getFile(app, dirName, apiName) {
  app.get(`${apiName}/:fileName`, (req, res, next) => {
    let { miragePath: filePath } = addonOptions;
    try {
      if (fs.existsSync(`${filePath}/${dirName}`)) {
        let { fileName } = req.params || {};
        try {
          res.send({
            data: fs.readFileSync(`${filePath}/${dirName}/${fileName}`, 'utf8'),
            message: 'success'
          });
        } catch(exception) {
          next(exception);
        }
      } else {
        next(new Error('File not found'));
      }
    } catch(exception) {
      next(exception);
    }
  });
}

module.exports = {
  name: require('./package').name,

  included() {
    addonOptions = this.app.project.config(this.app.env)['ember-mirage-gen'] || {};
    addonOptions.miragePath = path.join(process.cwd(), '/mirage');
    this._super.included.apply(this, arguments);
  },

  serverMiddleware(config) {
    if (!addonOptions.isEnabled) {
      return;
    }

    let { ssl, port } = config.options;

    let protocol = ssl === true ? 'https' : 'http';
    serverUrl = `${protocol}://localhost:${port}`;
    let mirgeAPIs = {
      factories: '/factories',
      fixtures: '/fixtures'
    }
    for (let dirName in mirgeAPIs) {
      getFiles(config.app, dirName, mirgeAPIs[dirName]);
      getFile(config.app, dirName, mirgeAPIs[dirName]);
    }
  },

  treeForApp(tree) {
    if (!addonOptions.isEnabled) {
      let filesTree = [];
      for (let file in dummyFiles) {
        filesTree.push(createFile(file, dummyFiles[file]));
      }

      return mergeTrees(filesTree);
    }

    return this._super.treeForApp.call(this, tree);
  },

  treeForAddon(tree) {
    if (!addonOptions.isEnabled) {
      return;
    }

    return this._super.treeForAddon.call(this, tree);
  },

  contentFor(type) {
    if (type === 'head' && addonOptions.isEnabled && serverUrl) {
      return `<script>window.emberMirageGen = { serverUrl: '${serverUrl}' }</script>
      <script src="https://unpkg.com/xhook@latest/dist/xhook.min.js"></script>`;
    }
  }
};
