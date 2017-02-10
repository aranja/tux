#!/usr/bin/env node
/**
 * Builds a lerna package by running gulp with a shared config.
 */

'use strict'
const argv = require('yargs').argv
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')

// Paths
const pkg = path.resolve(argv._[0] || '.')
const tsconfig = path.join(pkg, 'tsconfig.json')
const gulp = path.join(__dirname, '..', 'node_modules', '.bin', 'gulp')
const gulpfile = path.join(__dirname, '..', 'shared', 'gulpfile.js')

// Check if we're in a valid package folder.
if (!fs.existsSync(tsconfig)) {
  console.error('Could not find a tsconfig.json file.')
  process.exit()
}

// Configure gulp.
const gulpArgs = ['--gulpfile', gulpfile, '--cwd', pkg]
if (argv.watch) {
  gulpArgs.push('watch')
}

// Go!
child_process.spawnSync(gulp, gulpArgs, { stdio: 'inherit' })
