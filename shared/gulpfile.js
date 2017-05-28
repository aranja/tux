'use strict'
const gulp = require('gulp')
const gutil = require('gulp-util')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')
const clone = require('gulp-clone')
const runSequence = require('run-sequence')
const del = require('del')
const gulpBabel = require('gulp-babel')
const merge = require('merge2')

// Load configuration from tsconfig.json. Additionally, this instance
// tracks incremental builds after a watch triggers.
const tsProject = ts.createProject('tsconfig.json')

// Configures babel to build es6 code with styled-jsx to es5. Either
// with or without es2015 module syntax.
const babel = target =>
  gulpBabel({
    plugins: [
      'styled-jsx/babel',
      ['transform-runtime', {
        helpers: false,
        polyfill: false,
        regenerator: true,
      }],
    ],
    presets: [
      'react',
      ['es2015', { 'modules': target === 'es2015' ? false : 'commonjs' }],
    ],
    env: {
      development: {
        plugins: [require.resolve('react-hot-loader/babel')]
      }
    }
  })
  .on('error', function(error) {
    // only log babel errors once.
    if (target === 'es2015') {
      console.log(error.stack || error.message)
    }
    // Don't crash the watch process.
    this.end()
  })

gulp.task('clean', () => {
  return del(['lib', 'es'])
})

gulp.task('build:js', () => {
  const tsResult = tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .once('error', function () {
      // Crash CI builds on typescript error.
      this.once('finish', () => {
        if (process.env.TS_FAIL_ON_ERROR) {
          process.exit(1)
        }
      })
    })

  const streams = []

  // CommonJS Modules
  if (process.env.TARGET !== 'es2015') {
    streams.push(
      tsResult.dts
        .pipe(gulp.dest('lib')),
      tsResult.js
        .pipe(clone())
        .pipe(babel('commonjs'))
        .pipe(gulp.dest('lib'))
    )
  }

  // ES2015 Modules
  if (process.env.TARGET !== 'commonjs') {
    streams.push(
      tsResult.dts
        .pipe(gulp.dest('es')),
      tsResult.js
        .pipe(babel('es2015'))
        .pipe(gulp.dest('es'))
    )
  }

  return merge(streams)
})

/**
 * Build source files with typescript and babel.
 * This generates three files for each source file:
 *
 *   file.js - transpiled es5 commonjs module
 *   file.js.map - source map
 *   file.d.ts - typescript type declarations
 */
gulp.task('build', () => {
  return runSequence('clean', 'build:js')
})

gulp.task('watch', ['build'], () => {
  gulp.watch('src/**/*.{ts,tsx}', ['build:js'])
})

gulp.task('default', ['build'])
