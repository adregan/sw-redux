#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var config = require('../config');

(() => {
  'use strict';

  const configPath = path.join(__dirname, '..', '/config.json');
  config.cache.version += 1;
  fs.writeFile(configPath, JSON.stringify(config, null, 4), err => {if (err) throw err;});

})();
