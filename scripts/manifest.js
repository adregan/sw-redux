#!/usr/bin/env node

var fs = require('fs');
var config = require('../config');
var path = require('path');

(() => {
  'use strict';
  const manifestPath = path.join(__dirname, '..', 'dist/static/manifest.json');
  fs.writeFile(manifestPath, JSON.stringify(config.manifest, null, 4), err => {if (err) throw err;});
})();
