'use strict';

/* global require, process, __dirname */

var log = require('debug-logdown')('gulp');

var bold = require('quote')({ quotes: '*' });
log.info('node', bold(process.version));

var gulp = require('gulp'),
  eslint = require('gulp-eslint'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  notify = require('gulp-notify'),
  del = require('del'),
  watch = require('gulp-watch'),
  gutil = require('gulp-util'),
  header = require('gulp-header');
var glob = require('glob');
var ngHtml2Js = require('gulp-ng-html2js');
var join = require('path').join;
var pkg = require('./package.json');

var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' */',
  ''].join('\n');

var isVerbose = process.argv.some(function (arg) {
  return arg === '-v' || arg === '--verbose';
});

require('gulp-grunt')(gulp, { verbose: isVerbose });

var src = glob.sync('src/**/*.js');
log.log('all source files:\n' + src.join('\n  '));

// need to skip specs
src = src.filter(function (filename) {
  return !/-spec\.js$/.test(filename);
});
log.log('just source files:\n' + src.join('\n  '));

var templates = 'src/**/*.tpl.html';
var specs = ['src/**/*-spec.js'];
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

gulp.task('templates', function () {
  return gulp.src(templates)
    .pipe(ngHtml2Js({
      moduleName: pkg.name
    }))
    .pipe(concat(pkg.name + '.templates.js'))
    .pipe(gulp.dest(dest));
});

gulp.task('js', ['templates'], function () {
  var jsAndTemplates = src.concat(dest + '/*.templates.js');
  return gulp.src(jsAndTemplates)
    .pipe(concat(pkg.name + '.js'))
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest(dest))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(dest))
    .pipe(notify({ message: 'js task complete' }));
});

var karma = require('karma').server;
gulp.task('test', function (done) {
  karma.start({
    configFile: join(__dirname, 'karma.conf.js'),
    singleRun: true
  }, done);
});

gulp.task('watch', function() {
  var options = { ignoreInitial: true };
  watch(src, options, function () {
    gulp.start('lint', 'js');
  });
});

gulp.task('lint', ['lint:src', 'lint:specs', 'lint:gulpfile']);

gulp.task('default', ['deps-ok', 'grunt-nice-package', 'clean'], function () {
  gulp.start('lint', 'js');
});
