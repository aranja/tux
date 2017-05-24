#!/usr/bin/env node

var path = require('path');
var execa = require('execa');

var binPath = path.join(__dirname, 'node_modules', '.bin', 'tux');
var args = ['new'];

for (var i = 2; i < process.argv.length; i++) {
  args.push(process.argv[i]);
}

execa(binPath, args, { stdio: 'inherit' });
