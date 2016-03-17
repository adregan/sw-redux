#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

(() => {
  'use strict';
  
  const configPath = path.join(__dirname, '..', '/config.json');

  fs.readFile(configPath, (err, data) => {
    if (err) throw err;
    let config = JSON.parse(data);
    config.cache.version += 1;
  
    fs.writeFile(configPath, JSON.stringify(config, null, 4), err => {if (err) throw err});
  });

})();
