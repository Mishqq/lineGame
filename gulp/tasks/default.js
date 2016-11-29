'use strict';

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	rimraf = require('rimraf'),
	browserSync = require("browser-sync"),
	config = require('../config');

gulp.task('webserver', function () {
	browserSync(config.serverSettings);
});

gulp.task('clean', function (cb) {
	rimraf(config.clean, cb);
});

gulp.task('build', [
	'js:vendor',
	'js:build',
	'style:vendor',
	'style:build',
	'image:build',
	'fonts'
]);

gulp.task('prod', [
	'js:vendor',
	'js:prod',
	'style:vendor',
	'style:prod',
	'image:build',
	'fonts'
]);

gulp.task('default', ['build', 'webserver', 'watch']);