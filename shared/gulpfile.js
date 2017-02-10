'use strict'
const gulp = require('gulp')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const merge = require('merge2')

// Load configuration from tsconfig.json. Additionally, this instance
// tracks incremental builds after a watch triggers.
const tsProject = ts.createProject('tsconfig.json')

/**
 * Build source files with typescript and babel.
 * This generates three files for each source file:
 *
 *   file.js - transpiled es5 commonjs module
 *   file.js.map - source map
 *   file.d.ts - typescript type declarations
 */
gulp.task('build', () => {
  const tsResult = tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())

  return merge([
    tsResult.dts
      .pipe(gulp.dest(tsProject.options.outDir)),
    tsResult.js
      .pipe(babel())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(tsProject.options.outDir)),
  ])
})

gulp.task('watch', ['build'], () => {
  gulp.watch('src/**/*.{ts,tsx}', ['build'])
})

gulp.task('default', ['build'])
