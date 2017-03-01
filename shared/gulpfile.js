'use strict'
const gulp = require('gulp')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')
const clone = require('gulp-clone')
const runSequence = require('run-sequence')
const del = require('del')
const babel = require('gulp-babel')
const merge = require('merge2')

// Load configuration from tsconfig.json. Additionally, this instance
// tracks incremental builds after a watch triggers.
const tsProject = ts.createProject('tsconfig.json')

// Configures babel to build es6 code with styled-jsx to es5. Either
// with or without es2015 module syntax.
const babelConfig = es2015 => ({
  plugins: [
    "styled-jsx/babel",
    ['transform-runtime', {
      helpers: false,
      polyfill: false,
      regenerator: true,
    }],
  ],
  "presets": [
    "react",
    ["es2015", { "modules": es2015 ? false : 'commonjs' }],
  ],
})

gulp.task('clean', () => {
  return del(['lib', 'es'])
})

gulp.task('build:js', () => {
  const tsResult = tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())

  return merge([
    // CommonJS
    tsResult.dts
      .pipe(gulp.dest('lib')),
    tsResult.js
      .pipe(clone())
      .pipe(babel(babelConfig(false)))
      .pipe(gulp.dest('lib')),

    // ES2015 Modules
    tsResult.dts
      .pipe(gulp.dest('es')),
    tsResult.js
      .pipe(babel(babelConfig(true)))
      .pipe(gulp.dest('es')),
  ])
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
