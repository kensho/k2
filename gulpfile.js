'use strict';

/* global require, process, __dirname */

var log = require('debug-logdown')('gulp');

var bold = require('quote')({ quotes: '*' });
log.info('node', bold(process.version));

var babel = require('babel-core/register');

var gulp = require('gulp'),
  eslint = require('gulp-eslint'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  notify = require('gulp-notify'),
  del = require('del'),
  watch = require('gulp-watch'),
  gutil = require('gulp-util'),
  webpack = require('gulp-webpack'),
  header = require('gulp-header');
var glob = require('glob');
var mocha = require('gulp-mocha');
var pkg = require('./package.json');
var join = require('path').join;

var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' */',
  ''].join('\n');

var isVerbose = process.argv.some(function (arg) {
  return arg === '-v' || arg === '--verbose';
});

require('gulp-grunt')(gulp, { verbose: isVerbose });

var allSources = glob.sync('src/*.{es6,js}');
log.log('all source files:\n' + allSources.join('\n  '));

// need to skip specs
function isSpecFile(filename) {
  return /-spec\./.test(filename);
}
var src = allSources.filter(function (filename) {
  return !isSpecFile(filename);
});
log.log('just source files:\n' + src.join('\n  '));

var specs = allSources.filter(isSpecFile);
log.log('spec files');
log.log(specs);

var dest = './dist';

gulp.task('deps-ok', function () {
  var depsOk = require('deps-ok');
  var ok = depsOk(process.cwd(), false);
  if (!ok) {
    gulp.emit('error', new gutil.PluginError('deps-ok', 'Found outdated installs'));
  }
});

gulp.task('clean', function(cb) {
  del([dest], cb);
});

gulp.task('lint:src', function () {
  return gulp.src(src)
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('lint:specs', function () {
  return gulp.src(specs)
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('lint:gulpfile', function () {
  return gulp.src('gulpfile.js')
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

var webpackPlugins = (function () {
  // Include webpack -- rather than gulp-webpack -- but avoid making it global
  // since that will lead to confusion. Additionally, avoid inlining it since
  // that would confuse the `new` syntax.
  var pack = require('webpack');
  return [new pack.BannerPlugin('@gener' + 'ated' + ' @no' + 'lint')];
}());

gulp.task('webpack', function () {
  return gulp.src('')
    .pipe(webpack({
      entry: './src/k2.es6',
      module: {
        loaders: [
          { test: /\.es6$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
      },
      plugins: webpackPlugins,
      output: {
        filename: 'k2.js',
        library: 'k2',
        libraryTarget: 'umd'
      }
    }))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest(dest))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(dest))
    .pipe(notify({ message: 'webpack task complete, includes lodash' }));
});

gulp.task('webpack-browser', function () {
  return gulp.src('')
    .pipe(webpack({
      entry: './src/k2.es6',
      module: {
        loaders: [
          { test: /\.es6$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
      },
      externals: {
        lodash: '_'
      },
      plugins: webpackPlugins,
      output: {
        filename: 'k2-browser.js',
        library: 'k2',
        libraryTarget: 'umd'
      }
    }))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest(dest))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(dest))
    .pipe(notify({ message: 'webpack (without lodash) browser task complete' }));
});

gulp.task('mocha', function () {
  var outputFolder = process.env.CIRCLE_TEST_REPORTS;
  var outputFilename = outputFolder ? join(outputFolder, 'junit.xml') : null;
  var reporter = outputFilename ? 'xunit' : 'spec';

  return gulp.src(specs, {read: false})
    .pipe(mocha({
      compilers: {
        js: babel
      },
      reporter: reporter,
      ui: 'bdd',
      reporterOptions: {
        output: outputFilename
      }
    }));
});

gulp.task('test', ['mocha', 'grunt-clean-console']);

gulp.task('watch', function() {
  var options = { ignoreInitial: true };
  watch(src, options, function () {
    gulp.start('lint', 'webpack');
  });
});

gulp.task('lint', ['lint:src', 'lint:specs', 'lint:gulpfile']);

gulp.task('default', ['deps-ok', 'grunt-nice-package', 'clean'], function () {
  gulp.start('lint', 'webpack', 'webpack-browser');
});
